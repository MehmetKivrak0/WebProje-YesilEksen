const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtHelper');
const path = require('path');

/**
 * Dosya yolunu normalize et (veritabanına kayıt için)
 */
const normalizeFilePath = (file, userType, userId) => {
    if (!file) return null;
    
    // Multer diskStorage kullanıldığında file.path otomatik olarak set edilir
    // Ancak güvenlik için kontrol edelim
    if (!file.path) {
        // Eğer path yoksa, destination ve filename'den oluştur
        if (file.destination && file.filename) {
            const fullPath = path.join(file.destination, file.filename);
            const relativePath = path.relative(path.join(__dirname, '../../uploads'), fullPath);
            return relativePath.replace(/\\/g, '/'); // Windows için backslash'i slash'e çevir
        }
        return null;
    }
    
    try {
        const relativePath = path.relative(path.join(__dirname, '../../uploads'), file.path);
        return relativePath.replace(/\\/g, '/'); // Windows için backslash'i slash'e çevir
    } catch (error) {
        console.error('❌ normalizeFilePath hatası:', error.message);
        return null;
    }
};

/**
 * Kullanıcı kaydı (FormData ile - dosya yükleme desteği)
 * POST /api/auth/register
 */
const register = async (req, res) => {
    const client = await pool.connect();
    
    try {
        // Debug: Gelen verileri logla
        if (process.env.NODE_ENV === 'development') {
            console.log('📝 Register isteği:', {
                body: req.body,
                bodyKeys: Object.keys(req.body || {}),
                hasFiles: !!req.files,
                filesKeys: req.files ? Object.keys(req.files) : []
            });
        }

        // FormData'dan gelen veriler (req.body ve req.files)
        const {
            firstName,
            lastName,
            email,
            password,
            userType, // 'farmer', 'company', 'ziraat', 'sanayi'
            phone,
            terms,
            // Çiftlik bilgileri
            farmName,
            address,
            wasteTypes,
            otherWasteType,
            // Şirket bilgileri
            companyName,
            taxNumber
        } = req.body;
        
        // Dosyalar (req.files)
        const files = req.files || {};

        // Debug: Parse edilen değerleri logla
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Parse edilen değerler:', {
                firstName: firstName ? '✓' : '✗',
                lastName: lastName ? '✓' : '✗',
                email: email ? '✓' : '✗',
                password: password ? `✓ (${password.length} karakter)` : '✗',
                userType: userType ? `✓ (${userType})` : '✗',
                phone: phone ? '✓' : '✗',
                terms: terms,
                termsType: typeof terms,
                farmName: farmName || 'yok',
                companyName: companyName || 'yok'
            });
        }

        // Validasyon - FormData'dan gelen değerler string olabilir
        if (!firstName || !lastName || !email || !userType || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanları doldurunuz',
                missing: {
                    firstName: !firstName,
                    lastName: !lastName,
                    email: !email,
                    userType: !userType,
                    phone: !phone
                }
            });
        }

        // Şifre kontrolü - Sosyal medya girişi için opsiyonel olabilir
        // Ama normal kayıt için zorunlu
        if (!password || password.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Şifre gereklidir'
            });
        }

        // Terms kontrolü - FormData'dan string olarak gelebilir ("true" veya "false")
        const termsValue = typeof terms === 'string' 
            ? terms.toLowerCase() === 'true' 
            : Boolean(terms);
        
        if (!termsValue) {
            return res.status(400).json({
                success: false,
                message: 'Şartları kabul etmelisiniz'
            });
        }

        // Email kontrolü
        const emailCheck = await pool.query(
            'SELECT id FROM kullanicilar WHERE eposta = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kayıtlı'
            });
        }

        // Şifreyi hashle - Node.js bcrypt kullan (kayıt için)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        if (process.env.NODE_ENV === 'development') {
            console.log('🔐 Şifre hash\'lendi:', {
                hashPrefix: hashedPassword.substring(0, 10) + '...',
                hashLength: hashedPassword.length,
                hashFormat: hashedPassword.substring(0, 7) // $2b$10$ formatını görmek için
            });
        }

        // Kullanıcı rolünü belirle
        let rol = 'ciftci'; // default

        if (userType === 'farmer' || userType === 'ciftci') {
            rol = 'ciftci';
        } else if (userType === 'company' || userType === 'firma') {
            rol = 'firma';
        } else if (userType === 'sanayi' || userType === 'sanayi_odasi') {
            rol = 'sanayi_yoneticisi';
        } else if (userType === 'ziraat' || userType === 'ziraat_odasi') {
            rol = 'ziraat_yoneticisi';
        } else {
            // Geçersiz userType
            return res.status(400).json({
                success: false,
                message: 'Geçersiz kullanıcı tipi. Seçenekler: farmer, company, sanayi, ziraat'
            });
        }

        // Ziraat ve sanayi yöneticileri için durum 'aktif', diğerleri için 'beklemede'
        const durum = (rol === 'ziraat_yoneticisi' || rol === 'sanayi_yoneticisi') ? 'aktif' : 'beklemede';

        await client.query('BEGIN');
        
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Transaction başlatıldı');
        }

        // Kullanıcı oluştur
        let user;
        try {
            const userResult = await client.query(
                `INSERT INTO kullanicilar 
                (ad, soyad, eposta, sifre_hash, telefon, rol, durum, eposta_dogrulandi, sartlar_kabul, sartlar_kabul_tarihi)
                VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, TRUE, CURRENT_TIMESTAMP)
                RETURNING id, ad, soyad, eposta, telefon, rol, durum`,
                [firstName, lastName, email, hashedPassword, phone, rol, durum]
            );

            user = userResult.rows[0];
            
            if (!user || !user.id) {
                throw new Error('Kullanıcı oluşturulamadı - user.id bulunamadı');
            }
            
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Kullanıcı oluşturuldu:', {
                    id: user.id,
                    email: user.eposta,
                    rol: user.rol,
                    durum: user.durum,
                    idType: typeof user.id
                });
            }
        } catch (userError) {
            console.error('❌ Kullanıcı oluşturma hatası:', {
                message: userError.message,
                code: userError.code,
                detail: userError.detail,
                stack: userError.stack
            });
            throw userError;
        }

        // Rol'e göre ilgili tabloya kayıt ekle
        let ciftlikId = null; // Onaylandıktan sonra set edilecek
        let basvuruId = null; // Başvuru ID'si (çiftlik için)
        let firmaId = null;

        if (rol === 'ciftci') {
            // Çiftlik başvurusu oluştur (normalizasyon: başvuru ve kayıtlı çiftlik ayrı)
            const ciftlikName = farmName || `${firstName} ${lastName}'nin Çiftliği`;
            const ciftlikAdres = address || 'Belirtilmemiş';
            const sahipAdi = `${firstName} ${lastName}`;
            
            // Önce ciftlik_basvurulari tablosuna başvuru ekle
            // Not: ciftlik_id henüz yok, onaylandıktan sonra ciftlikler tablosuna geçecek
            // Telefon: kullanicilar tablosundan çekilecek
            const basvuruResult = await client.query(
                `INSERT INTO ciftlik_basvurulari 
                (kullanici_id, ciftlik_adi, sahip_adi, konum, durum)
                VALUES ($1, $2, $3, $4, 'ilk_inceleme')
                RETURNING id`,
                [user.id, ciftlikName, sahipAdi, ciftlikAdres]
            );
            const basvuruId = basvuruResult.rows[0].id;

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Çiftlik başvurusu oluşturuldu:', {
                    basvuru_id: basvuruId,
                    ciftlik_adi: ciftlikName,
                    durum: 'ilk_inceleme'
                });
            }

            // Atık türlerini başvuru notlarına kaydet (varsa)
            // Not: Atık kapasiteleri onaylandıktan sonra ciftlik_atik_kapasiteleri tablosuna eklenecek
            // Başvuru aşamasında sadece notlar alanında saklıyoruz
            if (wasteTypes) {
                const wasteTypesArray = Array.isArray(wasteTypes) ? wasteTypes : JSON.parse(wasteTypes);
                const atikTurleriListesi = wasteTypesArray.join(', ');
                
                await client.query(
                    `UPDATE ciftlik_basvurulari 
                    SET notlar = COALESCE(notlar || E'\\n', '') || $1
                    WHERE id = $2`,
                    [`Atık Türleri: ${atikTurleriListesi}`, basvuruId]
                );
            }

            // Çiftçi belgelerini kaydet (belgeler tablosu kullanılıyor)
            const belgeTypes = {
                tapuOrKiraDocument: 'tapu_kira',
                nufusCuzdani: 'nufus_cuzdani',
                ciftciKutuguKaydi: 'ciftci_kutugu',
                muvafakatname: 'muvafakatname',
                taahhutname: 'taahhutname',
                donerSermayeMakbuz: 'doner_sermaye'
            };

            for (const [fileKey, belgeKod] of Object.entries(belgeTypes)) {
                const fileArray = files[fileKey];
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];
                    const filePath = normalizeFilePath(file, userType, user.id);
                    
                    // Belge türü ID'sini bul (kod'a göre)
                    const belgeTuruResult = await client.query(
                        `SELECT id FROM belge_turleri WHERE kod = $1`,
                        [belgeKod]
                    );
                    
                    let belgeTuruId;
                    if (belgeTuruResult.rows.length > 0) {
                        belgeTuruId = belgeTuruResult.rows[0].id;
                    } else {
                        // Belge türü yoksa oluştur
                        const newBelgeTuruResult = await client.query(
                            `INSERT INTO belge_turleri (kod, ad, zorunlu, aktif)
                            VALUES ($1, $2, $3, TRUE)
                            RETURNING id`,
                            [belgeKod, belgeKod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), true]
                        );
                        belgeTuruId = newBelgeTuruResult.rows[0].id;
                    }
                    
                    // Dosya bilgilerini al
                    if (!filePath) {
                        console.warn(`⚠️ Dosya yolu oluşturulamadı: ${fileKey}`);
                        continue; // Bu dosyayı atla ve bir sonrakine geç
                    }
                    
                    const fileExt = filePath.split('.').pop()?.toLowerCase() || 'pdf';
                    const fileSize = file.size || 0;
                    
                    // Belgeyi kaydet - basvuru_id ve basvuru_tipi ile bağla
                    await client.query(
                        `INSERT INTO belgeler 
                        (kullanici_id, basvuru_id, basvuru_tipi, belge_turu_id, ad, dosya_yolu, dosya_boyutu, dosya_tipi, durum, zorunlu)
                        VALUES ($1, $2, 'ciftlik_basvurusu', $3, $4, $5, $6, $7, 'beklemede', $8)`,
                        [user.id, basvuruId, belgeTuruId, file.originalname, filePath, fileSize, fileExt, true]
                    );
                }
            }

        } else if (rol === 'firma') {
            // Şirket kaydı oluştur
            const firmaName = companyName || `${firstName} ${lastName} Firma`;
            const firmaAdres = address || 'Belirtilmemiş';
            const vergiNo = taxNumber || `TEMP-${String(user.id).substring(0, 8)}`;
            
            const firmaResult = await client.query(
                `INSERT INTO firmalar (kullanici_id, ad, vergi_no, adres, durum)
                VALUES ($1, $2, $3, $4, 'beklemede')
                RETURNING id`,
                [user.id, firmaName, vergiNo, firmaAdres]
            );
            firmaId = firmaResult.rows[0].id;

            // Şirket belgelerini kaydet (belgeler tablosu kullanılıyor)
            const firmaBelgeTypes = {
                ticaretSicilGazetesi: 'ticaret_sicil',
                vergiLevhasi: 'vergi_levhasi',
                imzaSirkuleri: 'imza_sirkuleri',
                faaliyetBelgesi: 'faaliyet_belgesi',
                odaKayitSicilSureti: 'oda_kayit',
                gidaIsletmeKayit: 'gida_isletme',
                sanayiSicilBelgesi: 'sanayi_sicil',
                kapasiteRaporu: 'kapasite_raporu'
            };

            for (const [fileKey, belgeKod] of Object.entries(firmaBelgeTypes)) {
                const fileArray = files[fileKey];
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];
                    const filePath = normalizeFilePath(file, userType, user.id);
                    
                    // Belge türü ID'sini bul (kod'a göre)
                    const belgeTuruResult = await client.query(
                        `SELECT id FROM belge_turleri WHERE kod = $1`,
                        [belgeKod]
                    );
                    
                    let belgeTuruId;
                    if (belgeTuruResult.rows.length > 0) {
                        belgeTuruId = belgeTuruResult.rows[0].id;
                    } else {
                        // Belge türü yoksa oluştur
                        const newBelgeTuruResult = await client.query(
                            `INSERT INTO belge_turleri (kod, ad, zorunlu, aktif)
                            VALUES ($1, $2, $3, TRUE)
                            RETURNING id`,
                            [belgeKod, belgeKod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), true]
                        );
                        belgeTuruId = newBelgeTuruResult.rows[0].id;
                    }
                    
                    // Dosya bilgilerini al
                    if (!filePath) {
                        console.warn(`⚠️ Dosya yolu oluşturulamadı: ${fileKey}`);
                        continue; // Bu dosyayı atla ve bir sonrakine geç
                    }
                    
                    const fileExt = filePath.split('.').pop()?.toLowerCase() || 'pdf';
                    const fileSize = file.size || 0;
                    
                    // Belgeyi kaydet
                    await client.query(
                        `INSERT INTO belgeler 
                        (kullanici_id, firma_id, belge_turu_id, ad, dosya_yolu, dosya_boyutu, dosya_tipi, durum, zorunlu)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, 'beklemede', $8)`,
                        [user.id, firmaId, belgeTuruId, file.originalname, filePath, fileSize, fileExt, true]
                    );
                }
            }

        } else if (rol === 'ziraat_yoneticisi' || rol === 'sanayi_yoneticisi') {
            // Oda yöneticileri için sadece kullanicilar tablosunda rol yeterli
            // oda_tipi bilgisi rol'den türetilebilir (ziraat_yoneticisi -> ziraat, sanayi_yoneticisi -> sanayi)
            // Normalizasyon: Gereksiz oda_kullanicilari tablosu kaldırıldı
            
            if (process.env.NODE_ENV === 'development') {
                const odaTipi = rol === 'ziraat_yoneticisi' ? 'ziraat' : 'sanayi';
                console.log(`✅ ${rol} kaydedildi - kullanicilar tablosuna eklendi:`, {
                    kullanici_id: user.id,
                    email: user.eposta,
                    rol: user.rol,
                    oda_tipi: odaTipi + ' (rol\'den türetildi)'
                });
            }
        }

        // Transaction'ı commit et
        await client.query('COMMIT');
        
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Transaction commit edildi - Kullanıcı veritabanına kaydedildi:', {
                id: user.id,
                email: user.eposta,
                rol: user.rol
            });
            
            // Commit sonrası veritabanında kaydın varlığını doğrula
            const verifyResult = await pool.query(
                'SELECT id, ad, soyad, eposta, rol, durum FROM kullanicilar WHERE id = $1',
                [user.id]
            );
            
            if (verifyResult.rows.length > 0) {
                console.log('✅ Doğrulama: Kullanıcı veritabanında bulundu:', verifyResult.rows[0]);
            } else {
                console.error('❌ Doğrulama: Kullanıcı veritabanında BULUNAMADI!', {
                    id: user.id,
                    email: user.eposta
                });
            }
        }

        // Ziraat ve sanayi yöneticileri için token oluştur ve otomatik giriş yap
        let token = null;
        if (rol === 'ziraat_yoneticisi' || rol === 'sanayi_yoneticisi') {
            token = generateToken({
                id: user.id,
                email: user.eposta,
                rol: user.rol
            });
        }

        // Mesajı duruma göre belirle
        const successMessage = (rol === 'ziraat_yoneticisi' || rol === 'sanayi_yoneticisi') 
            ? 'Kayıt başarılı! Otomatik giriş yapılıyor...' 
            : 'Kayıt başarılı! Admin onayı bekleniyor.';

        const responseData = {
            success: true,
            message: successMessage,
            user: {
                id: user.id,
                ad: user.ad,
                soyad: user.soyad,
                eposta: user.eposta,
                rol: user.rol,
                durum: user.durum
            }
        };

        // Token varsa ekle
        if (token) {
            responseData.token = token;
        }

        res.status(201).json(responseData);
        
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Response gönderildi - Kayıt başarılı');
        }

    } catch (error) {
        // Transaction'ı rollback et
        try {
            await client.query('ROLLBACK');
            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Transaction rollback edildi');
            }
        } catch (rollbackError) {
            console.error('❌ Rollback hatası:', rollbackError.message);
        }
        
        console.error('❌ Register hatası:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail,
            body: req.body,
            email: req.body?.email || 'tanımsız'
        });
        
        // Veritabanı hatalarını özel olarak handle et
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi veya vergi numarası zaten kayıtlı'
            });
        }
        
        if (error.code === '23503') { // Foreign key constraint violation
            return res.status(400).json({
                success: false,
                message: 'Geçersiz referans (veritabanı hatası)'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Kayıt sırasında bir hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        client.release();
    }
};

/**
 * Kullanıcı girişi
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        // Request body'yi logla (development için)
        if (process.env.NODE_ENV === 'development') {
            console.log('🔐 Login isteği:', { 
                body: req.body,
                hasEmail: !!req.body?.email,
                hasPassword: !!req.body?.password
            });
        }

        const { email, password } = req.body;

        // Validasyon
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email ve şifre gerekli'
            });
        }

        // Kullanıcıyı bul
        const result = await pool.query(
            `SELECT id, ad, soyad, eposta, sifre_hash, telefon, rol, durum, eposta_dogrulandi
            FROM kullanicilar 
            WHERE eposta = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log('❌ Kullanıcı bulunamadı:', email);
            }
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        const user = result.rows[0];

        // Şifre kontrolü - PostgreSQL crypt() ile hash'lenmiş şifreler için
        // İki yöntem deniyoruz:
        // 1. PostgreSQL'in crypt() fonksiyonu ile (pgcrypto extension)
        // 2. Node.js bcrypt ile (fallback)
        
        let isPasswordValid = false;
        
        // Önce PostgreSQL crypt() ile kontrol et (pgcrypto extension gerekli)
        try {
            const cryptCheck = await pool.query(
                `SELECT crypt($1, $2) = $2 as is_valid`,
                [password, user.sifre_hash]
            );
            isPasswordValid = cryptCheck.rows[0]?.is_valid || false;
            
            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 PostgreSQL crypt() kontrolü:', {
                    email: user.eposta,
                    hashFormat: user.sifre_hash?.substring(0, 7),
                    isValid: isPasswordValid
                });
            }
        } catch (cryptError) {
            // pgcrypto extension yoksa veya hata varsa, Node.js bcrypt kullan
            if (process.env.NODE_ENV === 'development') {
                console.log('⚠️ PostgreSQL crypt() hatası, bcrypt kullanılıyor:', cryptError.message);
            }
            isPasswordValid = await bcrypt.compare(password, user.sifre_hash);
        }
        
        // Eğer hala false ise, Node.js bcrypt ile tekrar dene (fallback)
        if (!isPasswordValid) {
            try {
                isPasswordValid = await bcrypt.compare(password, user.sifre_hash);
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Node.js bcrypt kontrolü:', {
                        email: user.eposta,
                        hashFormat: user.sifre_hash?.substring(0, 7),
                        isValid: isPasswordValid
                    });
                }
            } catch (bcryptError) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('❌ bcrypt.compare hatası:', bcryptError.message);
                }
            }
        }

        if (!isPasswordValid) {
            if (process.env.NODE_ENV === 'development') {
                console.log('❌ Şifre eşleşmedi:', {
                    email: user.eposta,
                    hashFormat: user.sifre_hash?.substring(0, 7),
                    hashLength: user.sifre_hash?.length
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Kullanıcı durumu kontrolü
        // Ziraat ve sanayi yöneticileri için durum kontrolünü atla (direkt giriş yapabilirler)
        // Normalizasyon: Sadece kullanicilar.rol kullanılıyor, oda_kullanicilari tablosu kaldırıldı
        const isOdaYoneticisi = user.rol === 'ziraat_yoneticisi' || 
                                user.rol === 'sanayi_yoneticisi' || 
                                user.rol === 'super_yonetici';
        
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Kullanıcı durum kontrolü:', {
                email: user.eposta,
                rol: user.rol,
                durum: user.durum,
                isOdaYoneticisi: isOdaYoneticisi
            });
        }
        
        if (!isOdaYoneticisi && user.durum === 'beklemede') {
            if (process.env.NODE_ENV === 'development') {
                console.log('❌ Kullanıcı beklemede durumunda ve oda yöneticisi değil');
            }
            return res.status(403).json({
                success: false,
                message: 'Hesabınız admin onayı bekliyor'
            });
        }

        if (user.durum === 'pasif') {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız pasif durumda'
            });
        }

        // Token oluştur
        const token = generateToken({
            id: user.id,
            email: user.eposta,
            rol: user.rol
        });

        // Son giriş zamanını güncelle
        await pool.query(
            'UPDATE kullanicilar SET son_giris = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        res.json({
            success: true,
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                ad: user.ad,
                soyad: user.soyad,
                eposta: user.eposta,
                telefon: user.telefon,
                rol: user.rol,
                durum: user.durum
            }
        });

    } catch (error) {
        console.error('❌ Login hatası:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            email: req.body?.email || 'tanımsız',
            body: req.body
        });
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında bir hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Mevcut kullanıcı bilgisi
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT id, ad, soyad, eposta, telefon, rol, durum, olusturma_tarihi, son_giris
            FROM kullanicilar 
            WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('❌ GetMe hatası:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id
        });
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgisi alınamadı',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Çıkış
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
    try {
        // Client-side'da token silinecek
        res.json({
            success: true,
            message: 'Çıkış başarılı'
        });
    } catch (error) {
        console.error('Logout hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Çıkış sırasında bir hata oluştu'
        });
    }
};

/**
 * E-posta kontrolü (şifre sıfırlama için)
 * POST /api/auth/check-email
 */
const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Validasyon
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'E-posta adresi gereklidir'
            });
        }

        // E-posta format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir e-posta adresi giriniz'
            });
        }

        // Kullanıcıyı bul
        const result = await pool.query(
            'SELECT id, eposta FROM kullanicilar WHERE eposta = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'E-posta adresi doğrulandı'
        });

    } catch (error) {
        console.error('❌ Check Email hatası:', {
            message: error.message,
            stack: error.stack,
            email: req.body?.email || 'tanımsız'
        });
        res.status(500).json({
            success: false,
            message: 'E-posta kontrolü sırasında bir hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Şifre sıfırlama
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validasyon
        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'E-posta ve yeni şifre gereklidir'
            });
        }

        // Şifre validasyonu
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Şifre en az 8 karakter olmalıdır'
            });
        }

        // Büyük harf kontrolü
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Şifre en az bir büyük harf içermelidir'
            });
        }

        // Küçük harf kontrolü
        if (!/[a-z]/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Şifre en az bir küçük harf içermelidir'
            });
        }

        // Sayı kontrolü
        if (!/[0-9]/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Şifre en az bir sayı içermelidir'
            });
        }

        // Kullanıcıyı bul
        const result = await pool.query(
            'SELECT id, eposta FROM kullanicilar WHERE eposta = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı'
            });
        }

        // Yeni şifreyi hashle
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Şifreyi güncelle
        await pool.query(
            'UPDATE kullanicilar SET sifre_hash = $1 WHERE eposta = $2',
            [hashedPassword, email]
        );

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Şifre sıfırlandı:', {
                email: email,
                hashPrefix: hashedPassword.substring(0, 10) + '...'
            });
        }

        res.json({
            success: true,
            message: 'Şifreniz başarıyla güncellendi'
        });

    } catch (error) {
        console.error('❌ Reset Password hatası:', {
            message: error.message,
            stack: error.stack,
            email: req.body?.email || 'tanımsız'
        });
        res.status(500).json({
            success: false,
            message: 'Şifre sıfırlama sırasında bir hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    checkEmail,
    resetPassword
};
