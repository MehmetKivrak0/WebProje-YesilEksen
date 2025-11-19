// Auth Controller (register, login, forgot-password, refresh-token)
const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { generateToken, verifyToken } = require('../utils/jwtHelper');

//Register Controller Kayıt Olma İşlemi
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            userType,
            phone,
            terms  // Kullanım şartları kabul edildi mi?
        } = req.body; //Form verileri

        //Validasyon
        if (!firstName || !lastName || !email || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: 'Tüm zorunlu alanları doldurun'
            });
        }
        if (!terms) {
            return res.status(400).json({
                success: false,
                message: 'Kullanım şartlarını kabul etmediniz'
            });
        }
        //Email Kontrolü
        const usercheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (usercheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanılmış'
            });
        }
        // Telefon Kontrolü
        const phonecheck = await query('SELECT * FROM users WHERE phone = $1', [phone]);
        if (phonecheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu telefon numarası zaten kullanılmış'
            });
        }
        // Şifreyi Hashleme
        const hashedPassword = await bcrypt.hash(password, 10);

        //Rol Belirleme
        // Rol belirleme
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

        //Kullanıcı Bilgilerini Veritabanına Kaydet
        const result = await query(
            `INSERT INTO kullanicilar (
      ad, 
      soyad, 
      eposta, 
      sifre_hash, 
      telefon,
      rol, 
      durum,
      eposta_dogrulandi,
      sartilar_kabul,
      sartilar_kabul_tarihi,
      olusturma
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    RETURNING id, ad, soyad, eposta, telefon, rol, durum`,
            [
                firstName,
                lastName,
                email,
                hashedPassword,
                phone || null,
                rol,
                'beklemede', // Durum: yönetici onayı bekliyor
                false, // Email doğrulanmadı
                true, // Şartlar kabul edildi
                new Date() // Şartlar kabul tarihi
            ]
        );
        const user = result.rows[0];

        //Token Oluşturma
        // Token Oluşturma (MİNİMAL)
        const token = generateToken({
            id: user.id,
            email: user.eposta,
            rol: user.rol
        });

        res.status(200).json({
            success: true,
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                ad: user.ad,
                soyad: user.soyad,
                email: user.eposta,
                telefon: user.telefon,
                rol: user.rol,
                durum: user.durum,
                eposta_dogrulandi: user.eposta_dogrulandi,
                avatar_url: user.avatar_url
            }
        });

    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Token Yenileme
const refreshToken = async (req, res) => {
    try {
        // TODO: Refresh token mantığı eklenecek
        res.status(200).json({
            success: true,
            message: 'Token yenilendi'
        });
    } catch (error) {
        console.error('Token yenileme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Token yenileme hatası'
        });
    }
};
module.exports = {
    register,
    login,
    forgotPassword,
    refreshToken
};