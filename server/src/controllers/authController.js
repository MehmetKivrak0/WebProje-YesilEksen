const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtHelper');

/**
 * Kullanıcı kaydı
 * POST /api/auth/register
 */
const register = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            userType, // 'farmer', 'company', 'ziraat', 'sanayi'
            phone,
            terms
        } = req.body;

        // Validasyon
        if (!firstName || !lastName || !email || !password || !userType || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanları doldurunuz'
            });
        }

        if (!terms) {
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

        // Şifreyi hashle
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

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

        await client.query('BEGIN');

        // Kullanıcı oluştur
        const userResult = await client.query(
            `INSERT INTO kullanicilar 
            (ad, soyad, eposta, sifre_hash, telefon, rol, durum, eposta_dogrulandi, sartlar_kabul, sartlar_kabul_tarihi)
            VALUES ($1, $2, $3, $4, $5, $6, 'beklemede', FALSE, TRUE, CURRENT_TIMESTAMP)
            RETURNING id, ad, soyad, eposta, telefon, rol, durum`,
            [firstName, lastName, email, hashedPassword, phone, rol]
        );

        const user = userResult.rows[0];

        // Rol'e göre ilgili tabloya kayıt ekle
        if (rol === 'ciftci') {
            await client.query(
                `INSERT INTO ciftlikler (kullanici_id, ad, durum)
                VALUES ($1, $2, 'beklemede')`,
                [user.id, `${firstName} ${lastName}'nin Çiftliği`]
            );
        } else if (rol === 'firma') {
            await client.query(
                `INSERT INTO firmalar (kullanici_id, ad, durum)
                VALUES ($1, $2, 'beklemede')`,
                [user.id, `${firstName} ${lastName} Firma`]
            );
        } else if (rol === 'ziraat_yoneticisi') {
            await client.query(
                `INSERT INTO ziraat_odalari (kullanici_id, ad, durum)
                VALUES ($1, $2, 'beklemede')`,
                [user.id, `${firstName} ${lastName} - Ziraat Odası`]
            );
        } else if (rol === 'sanayi_yoneticisi') {
            await client.query(
                `INSERT INTO sanayi_odalari (kullanici_id, ad, durum)
                VALUES ($1, $2, 'beklemede')`,
                [user.id, `${firstName} ${lastName} - Sanayi Odası`]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı! Admin onayı bekleniyor.',
            user: {
                id: user.id,
                ad: user.ad,
                soyad: user.soyad,
                eposta: user.eposta,
                rol: user.rol,
                durum: user.durum
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Register hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt sırasında bir hata oluştu'
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
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        const user = result.rows[0];

        // Şifre kontrolü
        const isPasswordValid = await bcrypt.compare(password, user.sifre_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Kullanıcı durumu kontrolü
        if (user.durum === 'beklemede') {
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
        console.error('Login hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında bir hata oluştu'
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
        console.error('GetMe hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgisi alınamadı'
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

module.exports = {
    register,
    login,
    getMe,
    logout
};
