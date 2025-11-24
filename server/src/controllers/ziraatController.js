const { pool } = require('../config/database');

// Ziraat Admin Controller Fonksiyonları

// Yardımcı fonksiyon: Çiftlik aktivite logu kaydet
const logCiftlikActivity = async (client, options) => {
    const {
        kullanici_id,      // İşlemi yapan kullanıcı (admin)
        ciftlik_id,        // İlgili çiftlik ID (ciftlikler tablosu)
        basvuru_id,        // İlgili başvuru ID (ciftlik_basvurulari tablosu)
        islem_tipi,        // 'onay', 'red', 'guncelleme', 'durum_degisikligi'
        eski_durum,        // Önceki durum
        yeni_durum,        // Yeni durum
        aciklama,          // Açıklama/not
        ip_adresi,         // IP adresi (opsiyonel)
        user_agent         // User agent (opsiyonel)
    } = options;

    try {
        // 1. aktiviteler tablosuna kayıt ekle
        const aktiviteBaslik = islem_tipi === 'onay' 
            ? 'Çiftlik başvurusu onaylandı'
            : islem_tipi === 'red'
            ? 'Çiftlik başvurusu reddedildi'
            : islem_tipi === 'durum_degisikligi'
            ? `Çiftlik durumu değiştirildi: ${eski_durum} → ${yeni_durum}`
            : 'Çiftlik işlemi';

        await client.query(
            `INSERT INTO aktiviteler 
            (kullanici_id, tip, varlik_tipi, varlik_id, baslik, aciklama, ip_adresi, user_agent)
            VALUES ($1, $2, 'ciftlik', $3, $4, $5, $6, $7)`,
            [
                kullanici_id,
                islem_tipi,
                ciftlik_id || basvuru_id, // Önce ciftlik_id, yoksa basvuru_id
                aktiviteBaslik,
                aciklama || '',
                ip_adresi || null,
                user_agent || null
            ]
        );

        // 2. Eğer durum değişikliği varsa degisiklik_loglari tablosuna kayıt ekle
        if (eski_durum && yeni_durum && eski_durum !== yeni_durum) {
            await client.query(
                `INSERT INTO degisiklik_loglari 
                (varlik_tipi, varlik_id, alan_adi, eski_deger, yeni_deger, sebep, degistiren_id)
                VALUES ('ciftlik', $1, 'durum', $2, $3, $4, $5)`,
                [
                    ciftlik_id || basvuru_id,
                    eski_durum,
                    yeni_durum,
                    aciklama || null,
                    kullanici_id
                ]
            );
        }

        // 3. detayli_aktiviteler tablosuna kayıt ekle (Sanayi/Ziraat dashboard'ları için)
        if (islem_tipi === 'onay' || islem_tipi === 'red') {
            const kullaniciResult = await client.query(
                `SELECT rol FROM kullanicilar WHERE id = $1`,
                [kullanici_id]
            );
            const rol = kullaniciResult.rows.length > 0 ? kullaniciResult.rows[0].rol : null;

            // Başvuruyu yapan kullanıcıyı bul (etkilenen kullanıcı)
            let etkilenen_kullanici_id = null;
            if (basvuru_id) {
                const basvuruResult = await client.query(
                    `SELECT kullanici_id FROM ciftlik_basvurulari WHERE id = $1`,
                    [basvuru_id]
                );
                etkilenen_kullanici_id = basvuruResult.rows.length > 0 
                    ? basvuruResult.rows[0].kullanici_id 
                    : null;
            }

            await client.query(
                `INSERT INTO detayli_aktiviteler 
                (kategori, kullanici_id, rol, islem_tipi, hedef_tipi, hedef_id, onceki_durum, sonraki_durum, baslik, aciklama, etkilenen_kullanici_id, ip_adresi, user_agent)
                VALUES ('ciftlik', $1, $2, $3, 'ciftlik_basvurusu', $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    kullanici_id,
                    rol,
                    islem_tipi,
                    basvuru_id,
                    eski_durum,
                    yeni_durum,
                    aktiviteBaslik,
                    aciklama || '',
                    etkilenen_kullanici_id,
                    ip_adresi || null,
                    user_agent || null
                ]
            );
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Çiftlik aktivite logu kaydedildi:', {
                islem_tipi,
                ciftlik_id,
                basvuru_id,
                durum: `${eski_durum} → ${yeni_durum}`
            });
        }
    } catch (error) {
        // Log hatası kritik değil, sadece console'a yaz
        console.error('⚠️ Aktivite log kayıt hatası (işlem devam ediyor):', error.message);
    }
};

// Dashboard Stats - GET /api/ziraat/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        // Ürün onay istatistikleri
        const productStats = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE durum = 'beklemede') as pending,
                COUNT(*) FILTER (WHERE durum = 'onaylandi') as approved,
                COUNT(*) FILTER (WHERE durum = 'revizyon') as revision
            FROM urun_basvurulari
        `);

        // Çiftlik başvuru istatistikleri - ciftlik_basvurulari tablosundan
        const farmStats = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE durum = 'ilk_inceleme') as newApplications,
                0 as inspections
            FROM ciftlik_basvurulari
        `);
        
        // Onaylanan çiftlik sayısı - ciftlikler tablosundan aktif çiftlikler (kayıtlı çiftçiler)
        const approvedFarmsCount = await pool.query(`
            SELECT COUNT(*) as approved
            FROM ciftlikler
            WHERE durum = 'aktif' AND silinme IS NULL
        `);

        // Toplam kayıtlı çiftçi
        const farmersCount = await pool.query(`
            SELECT COUNT(*) as total FROM ciftlikler WHERE durum = 'aktif' AND silinme IS NULL
        `);

        // Toplam ürün
        const productsCount = await pool.query(`
            SELECT COUNT(*) as total FROM urunler WHERE durum = 'aktif'
        `);

        res.json({
            success: true,
            stats: {
                productSummary: {
                    pending: parseInt(productStats.rows[0].pending || 0),
                    approved: parseInt(productStats.rows[0].approved || 0),
                    revision: parseInt(productStats.rows[0].revision || 0)
                },
                farmSummary: {
                    newApplications: parseInt(farmStats.rows[0].newapplications || 0),
                    inspections: parseInt(farmStats.rows[0].inspections || 0),
                    approved: parseInt(approvedFarmsCount.rows[0].approved || 0)
                },
                totalFarmers: parseInt(farmersCount.rows[0].total || 0),
                totalProducts: parseInt(productsCount.rows[0].total || 0)
            }
        });
    } catch (error) {
        console.error('Dashboard stats hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Dashboard istatistikleri alınamadı'
        });
    }
};

// Product Applications - GET /api/ziraat/products/applications
const getProductApplications = async (req, res) => {
    try {
        // Query parametrelerini validate et ve parse et
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, search } = req.query;
        
        // Validation
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz sayfa numarası'
            });
        }
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz limit değeri (1-100 arası olmalı)'
            });
        }
        
        const offset = (page - 1) * limit;

        let whereClause = "WHERE u.durum IN ('beklemede', 'onaylandi', 'revizyon', 'incelemede')";
        const params = [];
        let paramIndex = 1;

        if (status) {
            whereClause += ` AND u.durum = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (search) {
            whereClause += ` AND (u.urun_adi ILIKE $${paramIndex} OR u.basvuran_adi ILIKE $${paramIndex} OR c.ad ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Toplam sayı
        const countQuery = `
            SELECT COUNT(*) as total
            FROM urun_basvurulari u
            JOIN ciftlikler c ON u.ciftlik_id = c.id
            JOIN kullanicilar k ON c.kullanici_id = k.id
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, params);

        // Sayfalama ile veriler
        // LIMIT ve OFFSET için parametre indekslerini doğru şekilde ayarla
        const limitParamIndex = paramIndex;
        const offsetParamIndex = paramIndex + 1;
        params.push(limit, offset);
        const dataQuery = `
            SELECT 
                u.id,
                u.urun_adi as name,
                u.basvuran_adi as applicant,
                u.durum as status,
                u.guncelleme as "lastUpdate",
                u.id::text as "applicationNumber",
                COALESCE(c.aciklama, '') as sector,
                EXTRACT(YEAR FROM c.olusturma)::INTEGER as "establishmentYear",
                '1-5' as "employeeCount",
                k.eposta as email,
                u.basvuru_tarihi as "applicationDate",
                '' as "taxNumber",
                COALESCE(u.notlar, '') as description
            FROM urun_basvurulari u
            JOIN ciftlikler c ON u.ciftlik_id = c.id
            JOIN kullanicilar k ON c.kullanici_id = k.id
            ${whereClause}
            ORDER BY u.basvuru_tarihi DESC
            LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
        `;
        const dataResult = await pool.query(dataQuery, params);

        const total = parseInt(countResult.rows[0].total || 0);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            applications: dataResult.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('❌ Product applications hatası:', error);
        console.error('Hata detayı:', {
            message: error.message,
            stack: error.stack,
            query: error.query || 'N/A',
            code: error.code,
            detail: error.detail,
            hint: error.hint
        });
        res.status(500).json({
            success: false,
            message: 'Ürün başvuruları alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

// Farm Applications - GET /api/ziraat/farms/applications
// Artık ciftlik_basvurulari tablosundan veri çekiyor (normalizasyon)
const getFarmApplications = async (req, res) => {
    try {
        // Query parametrelerini validate et ve parse et
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, search } = req.query;
        
        // Validation
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz sayfa numarası'
            });
        }
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz limit değeri (1-100 arası olmalı)'
            });
        }
        
        const offset = (page - 1) * limit;

        // ciftlik_basvurulari tablosundan veri çek
        // Not: Onaylanmış başvurular (durum = 'onaylandi') genelde listede gösterilmez
        // çünkü bunlar artık ciftlikler tablosunda aktif çiftlik olarak kayıtlı
        let whereClause = "WHERE 1=1";
        const params = [];
        let paramIndex = 1;

        // Durum filtresi - ciftlik_basvurulari tablosundaki durum değerleri
        // Frontend mapping: 'ilk_inceleme' -> 'İlk İnceleme', 'onaylandi' -> 'Onaylandı', 'reddedildi' -> 'Reddedildi'
        if (status) {
            whereClause += ` AND cb.durum = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        } else {
            // Durum filtresi yoksa onay bekleyen ve reddedilen başvuruları göster
            // Onaylanmış başvurular (durum = 'onaylandi') varsayılan olarak gösterilmez
            // çünkü bunlar ciftlikler tablosunda zaten aktif çiftlik olarak var
            whereClause += ` AND cb.durum IN ('ilk_inceleme', 'reddedildi')`;
        }

        if (search) {
            whereClause += ` AND (cb.ciftlik_adi ILIKE $${paramIndex} OR cb.sahip_adi ILIKE $${paramIndex} OR COALESCE(k.ad, '') ILIKE $${paramIndex} OR COALESCE(k.soyad, '') ILIKE $${paramIndex} OR cb.id::text ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Toplam sayı - ciftlik_basvurulari tablosundan
        const countQuery = `
            SELECT COUNT(*) as total
            FROM ciftlik_basvurulari cb
            JOIN kullanicilar k ON cb.kullanici_id = k.id AND k.silinme IS NULL
            ${whereClause}
        `;
        
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Farm applications count query:', countQuery);
            console.log('🔍 Params:', params);
        }
        
        const countResult = await pool.query(countQuery, params);

        // Sayfalama ile veriler - ciftlik_basvurulari tablosundan, belgeler de dahil
        // LIMIT ve OFFSET için parametre indekslerini doğru şekilde ayarla
        const limitParamIndex = paramIndex;
        const offsetParamIndex = paramIndex + 1;
        params.push(limit, offset);
        const dataQuery = `
            SELECT 
                cb.id,
                cb.ciftlik_adi as name,
                cb.sahip_adi as owner,
                cb.durum as status,
                cb.guncelleme as "lastUpdate",
                cb.id::text as "applicationNumber",
                cb.konum as sector,
                EXTRACT(YEAR FROM cb.basvuru_tarihi)::INTEGER as "establishmentYear",
                '1-5' as "employeeCount",
                k.eposta as email,
                COALESCE(k.telefon, '') as phone,
                cb.basvuru_tarihi as "applicationDate",
                '' as "taxNumber",
                COALESCE(cb.notlar, '') as description,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'name', COALESCE(bt.ad, b.ad, 'Belge'),
                            'status', CASE 
                                WHEN b.durum = 'onaylandi' THEN 'Onaylandı'
                                WHEN b.durum = 'reddedildi' THEN 'Reddedildi'
                                WHEN b.durum = 'eksik' THEN 'Eksik'
                                ELSE 'Beklemede'
                            END,
                            'url', b.dosya_yolu,
                            'belgeId', b.id,
                            'farmerNote', COALESCE(b.red_nedeni, b.kullanici_notu, ''),
                            'adminNote', COALESCE(b.yonetici_notu, ''),
                            'zorunlu', COALESCE(b.zorunlu, bt.zorunlu, TRUE)
                        ) ORDER BY COALESCE(bt.ad, b.ad, '')
                    ) FILTER (WHERE b.id IS NOT NULL),
                    '[]'::json
                ) as documents
            FROM ciftlik_basvurulari cb
            JOIN kullanicilar k ON cb.kullanici_id = k.id AND k.silinme IS NULL
            LEFT JOIN belgeler b ON b.basvuru_id = cb.id AND b.basvuru_tipi = 'ciftlik_basvurusu' AND b.basvuru_id IS NOT NULL
            LEFT JOIN belge_turleri bt ON b.belge_turu_id = bt.id AND bt.id IS NOT NULL
            ${whereClause}
            GROUP BY cb.id, cb.ciftlik_adi, cb.sahip_adi, cb.durum, cb.guncelleme, cb.konum, cb.basvuru_tarihi, k.eposta, k.telefon, cb.notlar
            ORDER BY cb.basvuru_tarihi DESC
            LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
        `;
        
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Farm applications data query:', dataQuery);
            console.log('🔍 Data query params:', params);
        }
        
        const dataResult = await pool.query(dataQuery, params);

        const total = parseInt(countResult.rows[0].total || 0);
        const totalPages = Math.ceil(total / limit);

        // Belge URL'lerini tam URL'ye çevir ve atık türlerini parse et
        const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const processedRows = dataResult.rows.map(row => {
            // documents JSON string veya array olabilir
            if (row.documents) {
                let documents = row.documents;
                if (typeof documents === 'string') {
                    try {
                        documents = JSON.parse(documents);
                    } catch (e) {
                        console.warn('Belgeler parse edilemedi:', e);
                        documents = [];
                    }
                }
                if (Array.isArray(documents)) {
                    row.documents = documents.map(doc => {
                        if (doc && doc.url) {
                            doc.url = `${baseUrl}/api/documents/file/${encodeURIComponent(doc.url)}`;
                        }
                        return doc;
                    });
                }
            }
            
            // Notlar'dan atık türlerini parse et
            let atikTurleri = [];
            if (row.description && row.description.includes('Atık Türleri:')) {
                const atikTurleriMatch = row.description.match(/Atık Türleri:\s*([^\n]+)/);
                if (atikTurleriMatch && atikTurleriMatch[1]) {
                    // Virgülle ayrılmış atık türlerini parse et
                    atikTurleri = atikTurleriMatch[1].split(',').map(t => t.trim()).filter(t => t);
                }
            }
            
            // Atık türlerini response'a ekle
            row.wasteTypes = atikTurleri;
            
            return row;
        });

        // Debug: Kaç kayıt bulundu
        console.log(`Farm applications sorgusu: ${total} kayıt bulundu (ciftlik_basvurulari tablosundan)`);
        if (total > 0 && process.env.NODE_ENV === 'development') {
            // İlk 5 kaydı göster (debug için)
            console.log('İlk 5 çiftlik:', processedRows.slice(0, 5).map(r => ({
                id: r.id,
                name: r.name,
                status: r.status,
                applicationDate: r.applicationDate
            })));
        }

        res.json({
            success: true,
            applications: processedRows,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('❌ Farm applications hatası:', error);
        console.error('Hata detayı:', {
            message: error.message,
            stack: error.stack,
            query: error.query || 'N/A',
            code: error.code,
            detail: error.detail,
            hint: error.hint
        });
        res.status(500).json({
            success: false,
            message: 'Çiftlik başvuruları alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

// Approve Product - POST /api/ziraat/products/approve/:id
const approveProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        // Ürün başvurusunu kontrol et
        const checkResult = await pool.query(
            'SELECT id, durum FROM urun_basvurulari WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün başvurusu bulunamadı'
            });
        }

        // Durumu güncelle
        await pool.query(
            'UPDATE urun_basvurulari SET durum = $1, guncelleme = NOW(), onay_tarihi = NOW(), inceleyen_id = $2 WHERE id = $3',
            ['onaylandi', req.user.id, id]
        );
        
        // Not varsa ekle
        if (note) {
            await pool.query(
                'UPDATE urun_basvurulari SET notlar = $1 WHERE id = $2',
                [note, id]
            );
        }

        // TODO: Bildirim oluştur
        // TODO: Aktivite log ekle

        res.json({
            success: true,
            message: 'Ürün başvurusu başarıyla onaylandı'
        });
    } catch (error) {
        console.error('Approve product hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün onaylama işlemi başarısız'
        });
    }
};

// Reject Product - POST /api/ziraat/products/reject/:id
const rejectProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Red nedeni zorunludur'
            });
        }

        // Ürün başvurusunu kontrol et
        const checkResult = await pool.query(
            'SELECT id, durum FROM urun_basvurulari WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün başvurusu bulunamadı'
            });
        }

        // Durumu güncelle ve red nedeni ekle
        await pool.query(
            'UPDATE urun_basvurulari SET durum = $1, guncelleme = NOW(), red_nedeni = $2, inceleyen_id = $3 WHERE id = $4',
            ['reddedildi', reason, req.user.id, id]
        );

        // TODO: Bildirim oluştur
        // TODO: Aktivite log ekle

        res.json({
            success: true,
            message: 'Ürün başvurusu reddedildi'
        });
    } catch (error) {
        console.error('Reject product hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün reddetme işlemi başarısız'
        });
    }
};

// Approve Farm - POST /api/ziraat/farms/approve/:id
// ciftlik_basvurulari tablosundan başvuruyu onayla ve ciftlikler tablosuna kayıt oluştur
const approveFarm = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params; // basvuru_id
        const { note } = req.body || {};

        console.log(`🔍 [CIFTLIK ONAY] Başvuru ID: ${id} için onaylama işlemi başlatıldı`);
        console.log(`📝 [CIFTLIK ONAY] Admin ID: ${req.user?.id}, Admin Not: ${note || 'Yok'}`);

        // Başvuruyu kontrol et
        const basvuruResult = await client.query(
            `SELECT cb.*, k.eposta, k.ad as kullanici_ad, k.soyad as kullanici_soyad 
             FROM ciftlik_basvurulari cb
             JOIN kullanicilar k ON cb.kullanici_id = k.id
             WHERE cb.id = $1`,
            [id]
        );

        if (basvuruResult.rows.length === 0) {
            console.error(`❌ [CIFTLIK ONAY] Başvuru ID ${id} bulunamadı`);
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Çiftlik başvurusu bulunamadı'
            });
        }

        const basvuru = basvuruResult.rows[0];
        console.log(`✅ [CIFTLIK ONAY] Başvuru bulundu - Çiftlik: ${basvuru.ciftlik_adi}, Kullanıcı: ${basvuru.kullanici_ad} ${basvuru.kullanici_soyad}`);
        console.log(`📊 [CIFTLIK ONAY] Mevcut durum: ${basvuru.durum}, Mevcut ciftlik_id: ${basvuru.ciftlik_id || 'Yok'}`);
        
        // Belgeleri kontrol et
        const belgelerResult = await client.query(
            `SELECT b.id, b.ad, b.durum, b.dosya_yolu, b.zorunlu, bt.ad as belge_turu_adi
             FROM belgeler b
             LEFT JOIN belge_turleri bt ON b.belge_turu_id = bt.id
             WHERE b.basvuru_id = $1 AND b.basvuru_tipi = 'ciftlik_basvurusu'`,
            [id]
        );
        
        console.log(`📄 [CIFTLIK ONAY] Toplam belge sayısı: ${belgelerResult.rows.length}`);
        
        if (belgelerResult.rows.length === 0) {
            console.warn(`⚠️ [CIFTLIK ONAY] UYARI: Başvuruya ait hiç belge bulunamadı!`);
            console.warn(`⚠️ [CIFTLIK ONAY] Belge kontrolü: basvuru_id=${id}, basvuru_tipi='ciftlik_basvurusu'`);
        } else {
            belgelerResult.rows.forEach((belge, index) => {
                console.log(`📄 [CIFTLIK ONAY] Belge ${index + 1}:`, {
                    id: belge.id,
                    ad: belge.ad || belge.belge_turu_adi || 'İsimsiz',
                    durum: belge.durum,
                    dosya_yolu: belge.dosya_yolu ? 'Var' : 'Yok',
                    zorunlu: belge.zorunlu
                });
            });
            
            // Zorunlu belgelerden onaylanmayanları kontrol et
            const zorunluBelgeler = belgelerResult.rows.filter(b => b.zorunlu);
            const onaylanmamisZorunluBelgeler = zorunluBelgeler.filter(b => b.durum !== 'onaylandi');
            
            if (onaylanmamisZorunluBelgeler.length > 0) {
                console.warn(`⚠️ [CIFTLIK ONAY] UYARI: ${onaylanmamisZorunluBelgeler.length} adet zorunlu belge onaylanmamış:`);
                onaylanmamisZorunluBelgeler.forEach(belge => {
                    console.warn(`   - ${belge.ad || belge.belge_turu_adi}: ${belge.durum}`);
                });
            }
        }

        // Eğer başvuru zaten onaylanmışsa ve ciftlik_id varsa, mevcut çiftliği aktif yap
        if (basvuru.ciftlik_id && basvuru.durum === 'onaylandi') {
            const eskiDurumResult = await client.query(
                'SELECT durum FROM ciftlikler WHERE id = $1',
                [basvuru.ciftlik_id]
            );
            const eskiDurum = eskiDurumResult.rows.length > 0 ? eskiDurumResult.rows[0].durum : null;
            
            await client.query(
                'UPDATE ciftlikler SET durum = $1, guncelleme = NOW() WHERE id = $2',
                ['aktif', basvuru.ciftlik_id]
            );
            
            // Log kaydı ekle
            await logCiftlikActivity(client, {
                kullanici_id: req.user?.id,
                ciftlik_id: basvuru.ciftlik_id,
                basvuru_id: id,
                islem_tipi: 'durum_degisikligi',
                eski_durum: eskiDurum,
                yeni_durum: 'aktif',
                aciklama: 'Çiftlik tekrar aktif edildi',
                ip_adresi: req.ip,
                user_agent: req.get('user-agent')
            });
            
            await client.query('COMMIT');
            return res.json({
                success: true,
                message: 'Çiftlik zaten onaylanmış ve aktif edildi'
            });
        }

        // ciftlikler tablosuna yeni kayıt oluştur
        console.log(`🏗️ [CIFTLIK ONAY] Yeni çiftlik kaydı oluşturuluyor...`);
        const aciklama = note 
            ? `Onay Notu: ${note}${basvuru.notlar ? '\n' + basvuru.notlar : ''}`
            : (basvuru.notlar || '');
        
        const ciftlikResult = await client.query(
            `INSERT INTO ciftlikler 
            (kullanici_id, ad, adres, durum, kayit_tarihi, aciklama)
            VALUES ($1, $2, $3, 'aktif', CURRENT_DATE, $4)
            RETURNING id`,
            [
                basvuru.kullanici_id,
                basvuru.ciftlik_adi,
                basvuru.konum,
                aciklama
            ]
        );

        const ciftlikId = ciftlikResult.rows[0].id;
        console.log(`✅ [CIFTLIK ONAY] Çiftlik kaydı oluşturuldu - Yeni Çiftlik ID: ${ciftlikId}`);

        // ciftlik_basvurulari tablosunu güncelle: ciftlik_id, durum, onay_tarihi
        console.log(`🔄 [CIFTLIK ONAY] Başvuru durumu güncelleniyor...`);
        await client.query(
            `UPDATE ciftlik_basvurulari 
            SET ciftlik_id = $1, durum = 'onaylandi', onay_tarihi = NOW(), 
                inceleme_tarihi = NOW(), inceleyen_id = $2, guncelleme = NOW()
            WHERE id = $3`,
            [ciftlikId, req.user?.id, id]
        );
        console.log(`✅ [CIFTLIK ONAY] Başvuru durumu 'onaylandi' olarak güncellendi`);

        // Belgeleri ciftlik_id ile de bağla (onaylandıktan sonra)
        console.log(`📎 [CIFTLIK ONAY] Belgeler çiftlik ile ilişkilendiriliyor...`);
        const belgeUpdateResult = await client.query(
            `UPDATE belgeler 
            SET ciftlik_id = $1, guncelleme = NOW()
            WHERE basvuru_id = $2 AND basvuru_tipi = 'ciftlik_basvurusu'
            RETURNING id, ad, dosya_yolu`,
            [ciftlikId, id]
        );
        
        if (belgeUpdateResult.rows.length === 0) {
            console.error(`❌ [CIFTLIK ONAY] HATA: Hiçbir belge güncellenmedi!`);
            console.error(`❌ [CIFTLIK ONAY] Belge güncellemesi başarısız - Kontrol parametreleri: basvuru_id=${id}, basvuru_tipi='ciftlik_basvurusu'`);
            console.error(`❌ [CIFTLIK ONAY] Bu durum belgelerin veritabanında doğru kaydedilmediğini gösterir.`);
        } else {
            console.log(`✅ [CIFTLIK ONAY] ${belgeUpdateResult.rows.length} adet belge çiftlik ID ${ciftlikId} ile ilişkilendirildi:`);
            belgeUpdateResult.rows.forEach((belge, index) => {
                console.log(`   ${index + 1}. ${belge.ad || 'İsimsiz'} (ID: ${belge.id}) - ${belge.dosya_yolu ? 'Dosya var' : 'Dosya yok'}`);
            });
        }

        // Atık türlerini notlar'dan oku ve ciftlik_atik_kapasiteleri tablosuna ekle (varsa)
        console.log(`♻️ [CIFTLIK ONAY] Atık türleri kontrol ediliyor...`);
        if (basvuru.notlar && basvuru.notlar.includes('Atık Türleri:')) {
            const atikTurleriMatch = basvuru.notlar.match(/Atık Türleri:\s*([^\n]+)/);
            if (atikTurleriMatch) {
                const atikTurleriListesi = atikTurleriMatch[1].split(',').map(t => t.trim());
                console.log(`♻️ [CIFTLIK ONAY] Bulunan atık türleri: ${atikTurleriListesi.join(', ')}`);
                
                // Birim ID'sini bul (ton için - default)
                const birimResult = await client.query(
                    `SELECT id FROM birimler WHERE kod = 'ton' OR kod = 'kg' LIMIT 1`
                );
                const birimId = birimResult.rows.length > 0 ? birimResult.rows[0].id : null;
                
                if (!birimId) {
                    console.warn(`⚠️ [CIFTLIK ONAY] Birim ID bulunamadı (ton veya kg)`);
                }
                
                let eklenenAtikSayisi = 0;
                for (const wasteTypeKod of atikTurleriListesi) {
                    // Atık türü ID'sini bul
                    const atikTuruResult = await client.query(
                        `SELECT id FROM atik_turleri WHERE kod = $1 AND aktif = TRUE`,
                        [wasteTypeKod]
                    );
                    
                    if (atikTuruResult.rows.length > 0 && birimId) {
                        const atikTuruId = atikTuruResult.rows[0].id;
                        
                        // ciftlik_atik_kapasiteleri tablosuna ekle
                        await client.query(
                            `INSERT INTO ciftlik_atik_kapasiteleri 
                            (ciftlik_id, atik_turu_id, kapasite, birim_id, periyot)
                            VALUES ($1, $2, 0, $3, 'yillik')
                            ON CONFLICT (ciftlik_id, atik_turu_id) DO NOTHING`,
                            [ciftlikId, atikTuruId, birimId]
                        );
                        eklenenAtikSayisi++;
                    } else {
                        console.warn(`⚠️ [CIFTLIK ONAY] Atık türü bulunamadı veya birim yok: ${wasteTypeKod}`);
                    }
                }
                console.log(`✅ [CIFTLIK ONAY] ${eklenenAtikSayisi} adet atık türü kapasitesi eklendi`);
            }
        } else {
            console.log(`ℹ️ [CIFTLIK ONAY] Başvuruda atık türü bilgisi yok`);
        }

        // Log kaydı ekle - Onaylama
        console.log(`📝 [CIFTLIK ONAY] Aktivite logu kaydediliyor...`);
        await logCiftlikActivity(client, {
            kullanici_id: req.user?.id,
            ciftlik_id: ciftlikId,
            basvuru_id: id,
            islem_tipi: 'onay',
            eski_durum: basvuru.durum,
            yeni_durum: 'onaylandi',
            aciklama: note || 'Çiftlik başvurusu onaylandı',
            ip_adresi: req.ip,
            user_agent: req.get('user-agent')
        });

        console.log(`💾 [CIFTLIK ONAY] Transaction COMMIT yapılıyor...`);
        await client.query('COMMIT');
        console.log(`✅ [CIFTLIK ONAY] İşlem başarıyla tamamlandı - Çiftlik ID: ${ciftlikId}`);

        // TODO: Bildirim oluştur

        res.json({
            success: true,
            message: 'Çiftlik başvurusu onaylandı ve çiftlikler tablosuna kayıt oluşturuldu',
            ciftlikId: ciftlikId
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ [CIFTLIK ONAY] HATA: Çiftlik onaylama işlemi başarısız');
        console.error('❌ [CIFTLIK ONAY] Hata detayı:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail,
            hint: error.hint,
            basvuru_id: req.params.id,
            admin_id: req.user?.id
        });
        res.status(500).json({
            success: false,
            message: 'Çiftlik onaylama işlemi başarısız',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint
            } : undefined
        });
    } finally {
        client.release();
    }
};

// Reject Farm - POST /api/ziraat/farms/reject/:id
// ciftlik_basvurulari tablosundaki başvuruyu reddet
const rejectFarm = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params; // basvuru_id
        const { reason } = req.body;

        if (!reason) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Red nedeni zorunludur'
            });
        }

        // Başvuruyu kontrol et
        const checkResult = await client.query(
            'SELECT id, durum FROM ciftlik_basvurulari WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Çiftlik başvurusu bulunamadı'
            });
        }

        // Önceki durumu al
        const oncekiDurum = checkResult.rows[0].durum;

        // Başvuru durumunu 'reddedildi' yap ve red nedeni ekle
        await client.query(
            `UPDATE ciftlik_basvurulari 
            SET durum = 'reddedildi', red_nedeni = $1, inceleme_tarihi = NOW(), 
                inceleyen_id = $2, guncelleme = NOW()
            WHERE id = $3`,
            [reason, req.user?.id, id]
        );

        // Başvurunun ciftlik_id'sini kontrol et (varsa)
        const basvuruDetayResult = await client.query(
            'SELECT ciftlik_id FROM ciftlik_basvurulari WHERE id = $1',
            [id]
        );
        const ciftlikId = basvuruDetayResult.rows.length > 0 
            ? basvuruDetayResult.rows[0].ciftlik_id 
            : null;

        // Log kaydı ekle - Red
        await logCiftlikActivity(client, {
            kullanici_id: req.user?.id,
            ciftlik_id: ciftlikId,
            basvuru_id: id,
            islem_tipi: 'red',
            eski_durum: oncekiDurum,
            yeni_durum: 'reddedildi',
            aciklama: reason || 'Çiftlik başvurusu reddedildi',
            ip_adresi: req.ip,
            user_agent: req.get('user-agent')
        });

        await client.query('COMMIT');

        // TODO: Bildirim oluştur

        res.json({
            success: true,
            message: 'Çiftlik başvurusu reddedildi'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Reject farm hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Çiftlik reddetme işlemi başarısız',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        client.release();
    }
};

// Get Registered Farmers - GET /api/ziraat/farmers/registered
const getRegisteredFarmers = async (req, res) => {
    try {
        // Query parametrelerini validate et ve parse et
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search } = req.query;
        
        // Validation
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz sayfa numarası'
            });
        }
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz limit değeri (1-100 arası olmalı)'
            });
        }
        
        const offset = (page - 1) * limit;

        let whereClause = "WHERE c.durum = 'aktif' AND c.silinme IS NULL";
        const params = [];
        let paramIndex = 1;

        if (search) {
            whereClause += ` AND (k.ad ILIKE $${paramIndex} OR k.soyad ILIKE $${paramIndex} OR k.eposta ILIKE $${paramIndex} OR c.ad ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Toplam sayı
        const countQuery = `
            SELECT COUNT(*) as total
            FROM ciftlikler c
            JOIN kullanicilar k ON c.kullanici_id = k.id
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, params);

        // Sayfalama ile veriler
        params.push(limit, offset);
        const dataQuery = `
            SELECT 
                k.id,
                CONCAT(k.ad, ' ', k.soyad) as name,
                k.eposta as email,
                c.ad as "farmName",
                COALESCE(k.telefon, '') as phone,
                c.durum as status,
                c.olusturma as "registrationDate"
            FROM ciftlikler c
            JOIN kullanicilar k ON c.kullanici_id = k.id
            ${whereClause}
            ORDER BY c.olusturma DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const dataResult = await pool.query(dataQuery, params);

        const total = parseInt(countResult.rows[0].total || 0);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            farmers: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Registered farmers hatası:', error);
        console.error('Hata detayı:', {
            message: error.message,
            stack: error.stack,
            query: error.query || 'N/A'
        });
        res.status(500).json({
            success: false,
            message: 'Kayıtlı çiftçiler alınamadı',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Dashboard Products - GET /api/ziraat/dashboard/products
const getDashboardProducts = async (req, res) => {
    try {
        const { search } = req.query;

        let whereClause = "WHERE u.durum IN ('stokta', 'aktif') AND u.silinme IS NULL";
        const params = [];
        let paramIndex = 1;

        if (search) {
            whereClause += ` AND (u.ad ILIKE $${paramIndex} OR u.aciklama ILIKE $${paramIndex} OR k.ad ILIKE $${paramIndex} OR k.soyad ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        const query = `
            SELECT 
                u.id,
                u.ad as name,
                COALESCE(uk.ad, 'Kategori Yok') as category,
                CONCAT(k.ad, ' ', k.soyad) as farmer,
                u.durum as status,
                COALESCE(u.birim_fiyat, 0) as price,
                COALESCE(u.mevcut_miktar, 0) as stock
            FROM urunler u
            JOIN ciftlikler c ON u.ciftlik_id = c.id
            JOIN kullanicilar k ON c.kullanici_id = k.id
            LEFT JOIN urun_kategorileri uk ON u.kategori_id = uk.id
            ${whereClause}
            ORDER BY u.olusturma DESC
            LIMIT 50
        `;

        const result = await pool.query(query, params);

        res.json({
            success: true,
            products: result.rows
        });
    } catch (error) {
        console.error('Dashboard products hatası:', error);
        console.error('Hata detayı:', {
            message: error.message,
            stack: error.stack,
            query: error.query || 'N/A'
        });
        res.status(500).json({
            success: false,
            message: 'Ürünler alınamadı',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Activity Log - GET /api/ziraat/activity-log
const getActivityLog = async (req, res) => {
    try {
        // Query parametrelerini validate et ve parse et
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { type } = req.query;
        
        // Validation
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz sayfa numarası'
            });
        }
        
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz limit değeri (1-100 arası olmalı)'
            });
        }
        
        const offset = (page - 1) * limit;

        let whereClause = "WHERE 1=1";
        const params = [];
        let paramIndex = 1;

        if (type) {
            whereClause += ` AND tip = $${paramIndex}`;
            params.push(type);
            paramIndex++;
        }

        // Toplam sayı
        const countQuery = `
            SELECT COUNT(*) as total
            FROM aktiviteler
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, params);

        // Sayfalama ile veriler
        params.push(limit, offset);
        const dataQuery = `
            SELECT 
                a.id,
                a.tip as type,
                a.baslik as description,
                CONCAT(k.ad, ' ', k.soyad) as user,
                a.olusturma as timestamp,
                jsonb_build_object(
                    'varlik_tipi', a.varlik_tipi,
                    'varlik_id', a.varlik_id,
                    'aciklama', COALESCE(a.aciklama, '')
                ) as details
            FROM aktiviteler a
            LEFT JOIN kullanicilar k ON a.kullanici_id = k.id
            ${whereClause}
            ORDER BY a.olusturma DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const dataResult = await pool.query(dataQuery, params);

        const total = parseInt(countResult.rows[0]?.total || 0);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            activities: dataResult.rows || [],
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Activity log hatası:', error);
        console.error('Hata detayı:', {
            message: error.message,
            stack: error.stack,
            query: error.query || 'N/A'
        });
        // Aktivite log tablosu yoksa veya hata varsa boş array döndür
        res.json({
            success: true,
            activities: [],
            pagination: {
                page: parseInt(req.query.page || 1),
                limit: parseInt(req.query.limit || 10),
                total: 0,
                totalPages: 0
            }
        });
    }
};

// Get Farm Logs - GET /api/ziraat/farms/:id/logs
// Çiftlik başvurusu veya çiftlik için log kayıtlarını getir
const getFarmLogs = async (req, res) => {
    try {
        const { id } = req.params; // basvuru_id veya ciftlik_id
        
        // Önce basvuru_id olarak kontrol et, yoksa ciftlik_id olarak kabul et
        const basvuruCheck = await pool.query(
            'SELECT id, ciftlik_id FROM ciftlik_basvurulari WHERE id = $1',
            [id]
        );
        
        let basvuruId = null;
        let ciftlikId = null;
        
        if (basvuruCheck.rows.length > 0) {
            basvuruId = basvuruCheck.rows[0].id;
            ciftlikId = basvuruCheck.rows[0].ciftlik_id;
        } else {
            // Eğer basvuru değilse, ciftlik_id olarak kontrol et
            const ciftlikCheck = await pool.query(
                'SELECT id FROM ciftlikler WHERE id = $1',
                [id]
            );
            if (ciftlikCheck.rows.length > 0) {
                ciftlikId = ciftlikCheck.rows[0].id;
                // Bu ciftlik için başvuruyu bul
                const basvuruFind = await pool.query(
                    'SELECT id FROM ciftlik_basvurulari WHERE ciftlik_id = $1 ORDER BY onay_tarihi DESC LIMIT 1',
                    [ciftlikId]
                );
                if (basvuruFind.rows.length > 0) {
                    basvuruId = basvuruFind.rows[0].id;
                }
            }
        }
        
        if (!basvuruId && !ciftlikId) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik veya başvuru bulunamadı'
            });
        }
        
        // Aktivite loglarını getir (basvuru_id veya ciftlik_id ile)
        const aktivitelerQuery = `
            SELECT 
                a.id,
                a.tip as type,
                a.baslik as title,
                a.aciklama as description,
                a.olusturma as timestamp,
                CONCAT(k.ad, ' ', k.soyad) as user_name,
                k.eposta as user_email,
                a.ip_adresi as ip_address,
                a.varlik_tipi,
                a.varlik_id
            FROM aktiviteler a
            LEFT JOIN kullanicilar k ON a.kullanici_id = k.id
            WHERE a.varlik_tipi = 'ciftlik' 
            AND (a.varlik_id = $1 ${basvuruId && ciftlikId ? 'OR a.varlik_id = $2' : ''})
            ORDER BY a.olusturma DESC
            LIMIT 100
        `;
        
        const aktiviteParams = ciftlikId ? (basvuruId ? [ciftlikId, basvuruId] : [ciftlikId]) : [basvuruId];
        const aktivitelerResult = await pool.query(aktivitelerQuery, aktiviteParams);
        
        // Detaylı aktivite loglarını getir (basvuru_id ile)
        let detayliAktiviteler = [];
        if (basvuruId) {
            const detayliQuery = `
                SELECT 
                    da.id,
                    da.islem_tipi as type,
                    da.baslik as title,
                    da.aciklama as description,
                    da.onceki_durum as old_status,
                    da.sonraki_durum as new_status,
                    da.olusturma as timestamp,
                    CONCAT(k.ad, ' ', k.soyad) as user_name,
                    k.eposta as user_email,
                    da.ip_adresi as ip_address
                FROM detayli_aktiviteler da
                LEFT JOIN kullanicilar k ON da.kullanici_id = k.id
                WHERE da.hedef_tipi = 'ciftlik_basvurusu' 
                AND da.hedef_id = $1
                ORDER BY da.olusturma DESC
                LIMIT 100
            `;
            const detayliResult = await pool.query(detayliQuery, [basvuruId]);
            detayliAktiviteler = detayliResult.rows;
        }
        
        // Değişiklik loglarını getir (ciftlik_id ile)
        let degisiklikLoglari = [];
        if (ciftlikId) {
            const degisiklikQuery = `
                SELECT 
                    dl.id,
                    dl.alan_adi as field_name,
                    dl.eski_deger as old_value,
                    dl.yeni_deger as new_value,
                    dl.sebep as reason,
                    dl.olusturma as timestamp,
                    CONCAT(k.ad, ' ', k.soyad) as user_name,
                    k.eposta as user_email
                FROM degisiklik_loglari dl
                LEFT JOIN kullanicilar k ON dl.degistiren_id = k.id
                WHERE dl.varlik_tipi = 'ciftlik' 
                AND dl.varlik_id = $1
                ORDER BY dl.olusturma DESC
                LIMIT 100
            `;
            const degisiklikResult = await pool.query(degisiklikQuery, [ciftlikId]);
            degisiklikLoglari = degisiklikResult.rows;
        }
        
        res.json({
            success: true,
            logs: {
                activities: aktivitelerResult.rows,
                detailedActivities: detayliAktiviteler,
                changeLogs: degisiklikLoglari
            }
        });
    } catch (error) {
        console.error('Farm logs hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Log kayıtları alınamadı',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get All Farm Logs - GET /api/ziraat/farms/logs/all
// Tüm çiftlik işlem loglarını getir (seçili duruma göre filtreleme için)
const getAllFarmLogs = async (req, res) => {
    try {
        const { status, limit: limitParam } = req.query;
        const limit = parseInt(limitParam) || 100;
        
        // Tüm aktivite loglarını getir (çiftlik ile ilgili)
        const aktivitelerQuery = `
            SELECT 
                a.id,
                a.tip as type,
                a.baslik as title,
                a.aciklama as description,
                a.olusturma as timestamp,
                CONCAT(k.ad, ' ', k.soyad) as user_name,
                k.eposta as user_email,
                a.varlik_id,
                a.varlik_tipi
            FROM aktiviteler a
            LEFT JOIN kullanicilar k ON a.kullanici_id = k.id
            WHERE a.varlik_tipi = 'ciftlik'
            ORDER BY a.olusturma DESC
            LIMIT $1
        `;
        
        const aktivitelerResult = await pool.query(aktivitelerQuery, [limit]);
        
        // Tüm detaylı aktivite loglarını getir (çiftlik başvuruları ile ilgili)
        const detayliQuery = `
            SELECT 
                da.id,
                da.islem_tipi as type,
                da.baslik as title,
                da.aciklama as description,
                da.onceki_durum as old_status,
                da.sonraki_durum as new_status,
                da.olusturma as timestamp,
                CONCAT(k.ad, ' ', k.soyad) as user_name,
                k.eposta as user_email,
                da.hedef_id as varlik_id
            FROM detayli_aktiviteler da
            LEFT JOIN kullanicilar k ON da.kullanici_id = k.id
            WHERE da.kategori = 'ciftlik' AND da.hedef_tipi = 'ciftlik_basvurusu'
            ORDER BY da.olusturma DESC
            LIMIT $1
        `;
        const detayliResult = await pool.query(detayliQuery, [limit]);
        
        // Tüm değişiklik loglarını getir (çiftlik ile ilgili)
        const degisiklikQuery = `
            SELECT 
                dl.id,
                dl.alan_adi as field_name,
                dl.eski_deger as old_value,
                dl.yeni_deger as new_value,
                dl.sebep as reason,
                dl.olusturma as timestamp,
                CONCAT(k.ad, ' ', k.soyad) as user_name,
                k.eposta as user_email,
                dl.varlik_id
            FROM degisiklik_loglari dl
            LEFT JOIN kullanicilar k ON dl.degistiren_id = k.id
            WHERE dl.varlik_tipi = 'ciftlik'
            ORDER BY dl.olusturma DESC
            LIMIT $1
        `;
        const degisiklikResult = await pool.query(degisiklikQuery, [limit]);
        
        res.json({
            success: true,
            logs: {
                activities: aktivitelerResult.rows,
                detailedActivities: detayliResult.rows,
                changeLogs: degisiklikResult.rows
            }
        });
    } catch (error) {
        console.error('All farm logs hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Log kayıtları alınamadı',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Belge durumunu güncelle - PUT /api/ziraat/documents/:belgeId
const updateDocumentStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { belgeId } = req.params;
        const { status, reason, adminNote } = req.body;

        console.log(`📄 [BELGE GUNCELLEME] Başlatıldı - Belge ID: ${belgeId}`);
        console.log(`📄 [BELGE GUNCELLEME] İstek verisi:`, {
            status,
            reason: reason ? 'Var' : 'Yok',
            adminNote: adminNote ? 'Var' : 'Yok',
            admin_id: req.user?.id
        });

        // Belgeyi kontrol et
        const checkResult = await client.query(
            `SELECT b.id, b.basvuru_id, b.basvuru_tipi, b.ad, b.durum as eski_durum, b.dosya_yolu,
                    bt.ad as belge_turu_adi, bt.kod as belge_turu_kodu
             FROM belgeler b
             LEFT JOIN belge_turleri bt ON b.belge_turu_id = bt.id
             WHERE b.id = $1`,
            [belgeId]
        );

        if (checkResult.rows.length === 0) {
            console.error(`❌ [BELGE GUNCELLEME] Belge bulunamadı - ID: ${belgeId}`);
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Belge bulunamadı'
            });
        }

        const belge = checkResult.rows[0];
        console.log(`✅ [BELGE GUNCELLEME] Belge bulundu:`, {
            id: belge.id,
            ad: belge.ad,
            belge_turu: belge.belge_turu_adi || belge.belge_turu_kodu,
            basvuru_id: belge.basvuru_id,
            basvuru_tipi: belge.basvuru_tipi,
            eski_durum: belge.eski_durum,
            dosya_yolu: belge.dosya_yolu ? 'Var' : 'YOK'
        });

        if (!belge.basvuru_id || !belge.basvuru_tipi) {
            console.error(`❌ [BELGE GUNCELLEME] KRITIK HATA: Belge başvuru ile ilişkilendirilmemiş!`);
            console.error(`❌ [BELGE GUNCELLEME] Belge ID ${belgeId} için basvuru_id veya basvuru_tipi eksik`);
        }

        // Durum mapping: Frontend -> Backend
        const statusMap = {
            'Onaylandı': 'onaylandi',
            'Reddedildi': 'reddedildi',
            'Eksik': 'eksik',
            'Beklemede': 'beklemede'
        };
        const backendStatus = statusMap[status] || 'beklemede';
        console.log(`🔄 [BELGE GUNCELLEME] Durum değişimi: ${belge.eski_durum} → ${backendStatus}`);

        // Belgeyi güncelle
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        updateFields.push(`durum = $${paramIndex++}`);
        updateValues.push(backendStatus);

        if (reason !== undefined) {
            updateFields.push(`red_nedeni = $${paramIndex++}`);
            updateValues.push(reason);
            console.log(`📝 [BELGE GUNCELLEME] Red nedeni eklendi`);
        }

        if (adminNote !== undefined) {
            updateFields.push(`yonetici_notu = $${paramIndex++}`);
            updateValues.push(adminNote);
            console.log(`📝 [BELGE GUNCELLEME] Yönetici notu eklendi`);
        }

        updateFields.push(`inceleme_tarihi = NOW()`);
        updateFields.push(`inceleyen_id = $${paramIndex++}`);
        updateValues.push(req.user?.id);

        updateFields.push(`guncelleme = NOW()`);
        updateValues.push(belgeId);

        const updateQuery = `
            UPDATE belgeler 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, durum, basvuru_id, basvuru_tipi
        `;

        console.log(`💾 [BELGE GUNCELLEME] SQL sorgusu çalıştırılıyor...`);
        const updateResult = await client.query(updateQuery, updateValues);

        if (updateResult.rows.length === 0) {
            console.error(`❌ [BELGE GUNCELLEME] HATA: Güncelleme başarısız - hiçbir satır etkilenmedi`);
            await client.query('ROLLBACK');
            return res.status(500).json({
                success: false,
                message: 'Belge güncellenemedi'
            });
        }

        console.log(`✅ [BELGE GUNCELLEME] Belge başarıyla güncellendi:`, {
            belge_id: updateResult.rows[0].id,
            yeni_durum: updateResult.rows[0].durum,
            basvuru_id: updateResult.rows[0].basvuru_id,
            basvuru_tipi: updateResult.rows[0].basvuru_tipi
        });

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Belge durumu güncellendi'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ [BELGE GUNCELLEME] HATA:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail,
            hint: error.hint,
            belge_id: req.params.belgeId
        });
        res.status(500).json({
            success: false,
            message: 'Belge güncellenemedi',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint
            } : undefined
        });
    } finally {
        client.release();
    }
};

// Başvuru durumunu güncelle - PUT /api/ziraat/farms/status/:id
// ciftlik_basvurulari tablosundaki başvurunun durumunu güncelle
const updateFarmApplicationStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params; // basvuru_id
        const { status, reason } = req.body;

        if (!status) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Durum zorunludur'
            });
        }

        // Geçerli durum kontrolü
        const validStatuses = ['ilk_inceleme', 'onaylandi', 'reddedildi', 'belge_eksik'];
        if (!validStatuses.includes(status)) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Geçersiz durum değeri'
            });
        }

        // Başvuruyu kontrol et
        const checkResult = await client.query(
            'SELECT id, durum FROM ciftlik_basvurulari WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Çiftlik başvurusu bulunamadı'
            });
        }

        // Önceki durumu al
        const oncekiDurum = checkResult.rows[0].durum;

        // Başvuru durumunu güncelle
        const updateFields = ['durum = $1', 'inceleme_tarihi = NOW()', 'inceleyen_id = $2', 'guncelleme = NOW()'];
        const updateValues = [status, req.user?.id];
        let paramIndex = 3;

        if (reason) {
            updateFields.push(`red_nedeni = $${paramIndex++}`);
            updateValues.push(reason);
        }

        updateValues.push(id);

        await client.query(
            `UPDATE ciftlik_basvurulari 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramIndex}`,
            updateValues
        );

        // Log kaydı ekle
        await logCiftlikActivity(client, {
            kullanici_id: req.user?.id,
            basvuru_id: id,
            islem_tipi: 'durum_degisikligi',
            eski_durum: oncekiDurum,
            yeni_durum: status,
            aciklama: reason || `Başvuru durumu ${status} olarak güncellendi`,
            ip_adresi: req.ip,
            user_agent: req.get('user-agent')
        });

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Başvuru durumu güncellendi'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Başvuru durumu güncelleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Başvuru durumu güncellenemedi',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        client.release();
    }
};

module.exports = {
    getDashboardStats,
    getProductApplications,
    getFarmApplications,
    approveProduct,
    rejectProduct,
    approveFarm,
    rejectFarm,
    getRegisteredFarmers,
    getDashboardProducts,
    getActivityLog,
    getFarmLogs,
    getAllFarmLogs,
    updateDocumentStatus,
    updateFarmApplicationStatus
};
