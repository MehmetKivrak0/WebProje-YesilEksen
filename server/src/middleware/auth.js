// Authentication middleware
const jwt = require('jsonwebtoken');
// JWT şuna yarar:
// Token oluşturmak ve doğrulamak için
const { pool } = require('../config/database.js');
// Database şuna yarar:
// PostgreSQL'e bağlanmak için

//Jwt Token Doğrulama middleware şuna yarar:
// Token'ın doğruluğunu kontrol etmek için
const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization')?.replace
            ('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Giriş yapmanız gerekiyor'
            });
        }

        //Token Doğrulama
        const decoded = jwt.verify
            (token, process.env.JWT_SECRET);

        //Kullanıcıyı veritabanından al
        const result = await pool.query
            ('SELECT id,ad,soyad,eposta,rol,durum FROM kullanicilar WHERE id = $1',
                [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }
        const user = result.rows[0]

        // Kullanıcı aktif mi kontrol et
        if (user.durum !== 'aktif') {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız aktif değil'
            });
        }

        //Kullanıcı bilgilerini request 'e ekle
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware hatası:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuş'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Yetkilendirme hatası'
        });
    }
}

//Rol Kontrolü middleware şuna yarar:
// Kullanıcının rolünü kontrol etmek için
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Giriş yapmanız gerekiyor'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için yetkiniz yok'
            });
        }

        next();
    };
};

module.exports = { auth, checkRole};

// JWT Token Oluşturma

const generateToken = (payloud) => {
    return  jwt.sign(payloud,process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE || '1h'
    });
};
// JWT Token Doğrulama

const verifyToken = (token) => {
    try {
        return jwt.verify(token,process.env.JWT_SECRET);
        //JWT_SECRET ne işe yarar?
        //JWT_SECRET, token'ı doğrularken kullanılır.
    } catch (error) {
        throw new Error('Token doğrulama hatası');
    }
}


// tokendan kullanıcı bilgilerini çıkar 

const decodeToken = (token) => {
    return jwt.decode(token);
}

module.exports = { generateToken, verifyToken, decodeToken };