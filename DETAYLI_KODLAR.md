# 📝 YEŞİL-EKSEN - DETAYLI KODLAR

Bu dosya YOL_HARITASI.md dosyasında referans verilen tüm detaylı kodları içerir.

---

## 📁 Backend Kodları

### 1. Auth Middleware
**Dosya:** `server/src/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * JWT token doğrulama middleware
 */
const auth = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Giriş yapmanız gerekiyor'
            });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcıyı veritabanından getir
        const result = await pool.query(
            'SELECT id, ad, soyad, eposta, rol, durum FROM kullanicilar WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const user = result.rows[0];

        // Kullanıcı aktif mi kontrol et
        if (user.durum !== 'aktif') {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız aktif değil'
            });
        }

        // Kullanıcı bilgilerini request'e ekle
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
};

/**
 * Rol kontrolü middleware
 */
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

module.exports = { auth, checkRole };
```

---

### 2. JWT Helper
**Dosya:** `server/src/utils/jwtHelper.js`

```javascript
const jwt = require('jsonwebtoken');

/**
 * JWT token oluştur
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * JWT token doğrula
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token doğrulama hatası');
    }
};

/**
 * Token'dan kullanıcı bilgilerini çıkar
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
```

---

### 3. Auth Controller
**Dosya:** `server/src/controllers/authController.js`

```javascript
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
            userType, // 'farmer' veya 'company'
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
        const rol = userType === 'farmer' ? 'ciftci' : 'firma';

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
```

---

### 4. Çiftlik Controller
**Dosya:** `server/src/controllers/ciftlikController.js`

```javascript
const { pool } = require('../config/database');

/**
 * Panel istatistikleri
 * GET /api/ciftlik/panel/stats
 */
const getPanelStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Çiftlik ID'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [userId]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlikId = ciftlikResult.rows[0].id;

        // Toplam ürün sayısı
        const urunResult = await pool.query(
            'SELECT COUNT(*) as toplam FROM urunler WHERE ciftlik_id = $1 AND durum != $2',
            [ciftlikId, 'silindi']
        );

        // Aktif ürün sayısı
        const aktifResult = await pool.query(
            'SELECT COUNT(*) as aktif FROM urunler WHERE ciftlik_id = $1 AND durum = $2',
            [ciftlikId, 'aktif']
        );

        // Bekleyen teklif sayısı
        const teklifResult = await pool.query(
            `SELECT COUNT(DISTINCT t.id) as bekleyen 
            FROM teklifler t
            JOIN urunler u ON t.urun_id = u.id
            WHERE u.ciftlik_id = $1 AND t.durum = 'beklemede'`,
            [ciftlikId]
        );

        // Toplam satış (onaylanan siparişler)
        const satisResult = await pool.query(
            `SELECT COALESCE(SUM(s.toplam_tutar), 0) as toplam_satis
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.id
            WHERE u.ciftlik_id = $1 AND s.durum = 'tamamlandi'`,
            [ciftlikId]
        );

        // Son siparişler (5 adet)
        const siparislerResult = await pool.query(
            `SELECT 
                s.id,
                s.siparis_no,
                f.ad as firma_adi,
                u.baslik as urun_adi,
                s.miktar,
                s.birim_fiyat,
                s.toplam_tutar,
                s.durum,
                s.olusturma_tarihi
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.id
            JOIN firmalar f ON s.firma_id = f.id
            WHERE u.ciftlik_id = $1
            ORDER BY s.olusturma_tarihi DESC
            LIMIT 5`,
            [ciftlikId]
        );

        res.json({
            success: true,
            stats: {
                toplamUrun: parseInt(urunResult.rows[0].toplam),
                aktifUrun: parseInt(aktifResult.rows[0].aktif),
                bekleyenTeklif: parseInt(teklifResult.rows[0].bekleyen),
                toplamSatis: parseFloat(satisResult.rows[0].toplam_satis),
                sonSiparisler: siparislerResult.rows
            }
        });

    } catch (error) {
        console.error('Panel stats hatası:', error);
        res.status(500).json({
            success: false,
            message: 'İstatistikler alınamadı'
        });
    }
};

/**
 * Ürünlerim listesi
 * GET /api/ciftlik/urunler
 */
const getMyProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 6, kategori, durum, search } = req.query;
        
        const offset = (page - 1) * limit;

        // Çiftlik ID'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [userId]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlikId = ciftlikResult.rows[0].id;

        // Query oluştur
        let queryText = `
            SELECT 
                u.id,
                u.baslik,
                u.aciklama,
                u.miktar,
                u.birim,
                u.fiyat,
                u.kategori,
                u.durum,
                u.resim_url,
                u.olusturma_tarihi,
                COUNT(t.id) as teklif_sayisi
            FROM urunler u
            LEFT JOIN teklifler t ON u.id = t.urun_id
            WHERE u.ciftlik_id = $1 AND u.durum != 'silindi'
        `;

        const queryParams = [ciftlikId];
        let paramIndex = 2;

        // Filtreleme
        if (kategori) {
            queryText += ` AND u.kategori = $${paramIndex}`;
            queryParams.push(kategori);
            paramIndex++;
        }

        if (durum) {
            queryText += ` AND u.durum = $${paramIndex}`;
            queryParams.push(durum);
            paramIndex++;
        }

        if (search) {
            queryText += ` AND (u.baslik ILIKE $${paramIndex} OR u.aciklama ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        queryText += ` GROUP BY u.id ORDER BY u.olusturma_tarihi DESC`;
        queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(queryText, queryParams);

        // Toplam sayı
        let countQuery = `SELECT COUNT(*) FROM urunler WHERE ciftlik_id = $1 AND durum != 'silindi'`;
        const countParams = [ciftlikId];
        let countIndex = 2;

        if (kategori) {
            countQuery += ` AND kategori = $${countIndex}`;
            countParams.push(kategori);
            countIndex++;
        }

        if (durum) {
            countQuery += ` AND durum = $${countIndex}`;
            countParams.push(durum);
            countIndex++;
        }

        if (search) {
            countQuery += ` AND (baslik ILIKE $${countIndex} OR aciklama ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);

        res.json({
            success: true,
            products: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });

    } catch (error) {
        console.error('Get products hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürünler alınamadı'
        });
    }
};

/**
 * Yeni ürün ekleme
 * POST /api/ciftlik/urun
 */
const addProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, miktar, price, category, desc, birim = 'kg' } = req.body;

        // Validasyon
        if (!title || !miktar || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Gerekli alanları doldurunuz'
            });
        }

        // Çiftlik ID'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [userId]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlikId = ciftlikResult.rows[0].id;

        // Ürün oluştur
        const result = await pool.query(
            `INSERT INTO urunler 
            (ciftlik_id, baslik, aciklama, miktar, birim, fiyat, kategori, durum)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'aktif')
            RETURNING *`,
            [ciftlikId, title, desc, miktar, birim, price, category]
        );

        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla eklendi',
            product: result.rows[0]
        });

    } catch (error) {
        console.error('Add product hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün eklenemedi'
        });
    }
};

/**
 * Ürün güncelleme
 * PUT /api/ciftlik/urun/:id
 */
const updateProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { title, miktar, price, category, desc, birim, durum } = req.body;

        // Çiftlik ID'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [userId]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlikId = ciftlikResult.rows[0].id;

        // Ürün bu çiftliğe ait mi kontrol et
        const productCheck = await pool.query(
            'SELECT id FROM urunler WHERE id = $1 AND ciftlik_id = $2',
            [productId, ciftlikId]
        );

        if (productCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı veya size ait değil'
            });
        }

        // Ürünü güncelle
        const result = await pool.query(
            `UPDATE urunler 
            SET baslik = COALESCE($1, baslik),
                aciklama = COALESCE($2, aciklama),
                miktar = COALESCE($3, miktar),
                birim = COALESCE($4, birim),
                fiyat = COALESCE($5, fiyat),
                kategori = COALESCE($6, kategori),
                durum = COALESCE($7, durum),
                guncelleme_tarihi = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *`,
            [title, desc, miktar, birim, price, category, durum, productId]
        );

        res.json({
            success: true,
            message: 'Ürün başarıyla güncellendi',
            product: result.rows[0]
        });

    } catch (error) {
        console.error('Update product hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün güncellenemedi'
        });
    }
};

/**
 * Ürün silme (soft delete)
 * DELETE /api/ciftlik/urun/:id
 */
const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        // Çiftlik ID'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [userId]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlikId = ciftlikResult.rows[0].id;

        // Ürün bu çiftliğe ait mi kontrol et
        const productCheck = await pool.query(
            'SELECT id FROM urunler WHERE id = $1 AND ciftlik_id = $2',
            [productId, ciftlikId]
        );

        if (productCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı veya size ait değil'
            });
        }

        // Soft delete
        await pool.query(
            `UPDATE urunler 
            SET durum = 'silindi', 
                guncelleme_tarihi = CURRENT_TIMESTAMP
            WHERE id = $1`,
            [productId]
        );

        res.json({
            success: true,
            message: 'Ürün başarıyla silindi'
        });

    } catch (error) {
        console.error('Delete product hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün silinemedi'
        });
    }
};

module.exports = {
    getPanelStats,
    getMyProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
```

---

### 5. Firma Controller
**Dosya:** `server/src/controllers/firmaController.js`

```javascript
const { pool } = require('../config/database');

/**
 * Firma panel istatistikleri
 * GET /api/firma/panel/stats
 */
const getPanelStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Firma ID'sini bul
        const firmaResult = await pool.query(
            'SELECT id FROM firmalar WHERE kullanici_id = $1',
            [userId]
        );

        if (firmaResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Firma bulunamadı'
            });
        }

        const firmaId = firmaResult.rows[0].id;

        // Toplam teklif sayısı
        const teklifResult = await pool.query(
            'SELECT COUNT(*) as toplam FROM teklifler WHERE firma_id = $1',
            [firmaId]
        );

        // Onaylanan teklif sayısı
        const onayliResult = await pool.query(
            'SELECT COUNT(*) as onayli FROM teklifler WHERE firma_id = $1 AND durum = $2',
            [firmaId, 'onaylandi']
        );

        // Bekleyen teklif sayısı
        const bekleyenResult = await pool.query(
            'SELECT COUNT(*) as bekleyen FROM teklifler WHERE firma_id = $1 AND durum = $2',
            [firmaId, 'beklemede']
        );

        // Toplam sipariş sayısı
        const siparisResult = await pool.query(
            'SELECT COUNT(*) as toplam FROM siparisler WHERE firma_id = $1',
            [firmaId]
        );

        // Toplam harcama
        const harcamaResult = await pool.query(
            `SELECT COALESCE(SUM(toplam_tutar), 0) as toplam_harcama
            FROM siparisler 
            WHERE firma_id = $1 AND durum IN ('onaylandi', 'hazirlaniyor', 'kargoda', 'tamamlandi')`,
            [firmaId]
        );

        // Son siparişler
        const sonSiparislerResult = await pool.query(
            `SELECT 
                s.id,
                s.siparis_no,
                u.baslik as urun_adi,
                c.ad as ciftlik_adi,
                s.miktar,
                s.birim_fiyat,
                s.toplam_tutar,
                s.durum,
                s.olusturma_tarihi
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.id
            JOIN ciftlikler c ON u.ciftlik_id = c.id
            WHERE s.firma_id = $1
            ORDER BY s.olusturma_tarihi DESC
            LIMIT 5`,
            [firmaId]
        );

        res.json({
            success: true,
            stats: {
                toplamTeklif: parseInt(teklifResult.rows[0].toplam),
                onayliTeklif: parseInt(onayliResult.rows[0].onayli),
                bekleyenTeklif: parseInt(bekleyenResult.rows[0].bekleyen),
                toplamSiparis: parseInt(siparisResult.rows[0].toplam),
                toplamHarcama: parseFloat(harcamaResult.rows[0].toplam_harcama),
                sonSiparisler: sonSiparislerResult.rows
            }
        });

    } catch (error) {
        console.error('Firma panel stats hatası:', error);
        res.status(500).json({
            success: false,
            message: 'İstatistikler alınamadı'
        });
    }
};

/**
 * Başvuru durumu kontrol
 * GET /api/firma/basvuru-durum
 */
const getBasvuruStatus = async (req, res) => {
    try {
        const userId = req.user.id;

        // Firma bilgilerini getir
        const result = await pool.query(
            `SELECT 
                f.id,
                f.ad,
                f.durum,
                f.olusturma_tarihi,
                k.eposta,
                k.telefon,
                k.ad as kullanici_adi,
                k.soyad as kullanici_soyadi
            FROM firmalar f
            JOIN kullanicilar k ON f.kullanici_id = k.id
            WHERE f.kullanici_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Firma bulunamadı'
            });
        }

        const firma = result.rows[0];

        res.json({
            success: true,
            firma: {
                id: firma.id,
                ad: firma.ad,
                durum: firma.durum,
                olusturmaTarihi: firma.olusturma_tarihi,
                yetkili: {
                    ad: firma.kullanici_adi,
                    soyad: firma.kullanici_soyadi,
                    eposta: firma.eposta,
                    telefon: firma.telefon
                }
            }
        });

    } catch (error) {
        console.error('Başvuru durum hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Başvuru durumu alınamadı'
        });
    }
};

module.exports = {
    getPanelStats,
    getBasvuruStatus
};
```

---

## 📁 Frontend Kodları

### 6. Auth Service
**Dosya:** `src/services/authService.ts`

```typescript
import api from './api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'farmer' | 'company';
    phone: string;
    terms: boolean;
}

export interface User {
    id: number;
    ad: string;
    soyad: string;
    eposta: string;
    telefon: string;
    rol: 'ciftci' | 'firma' | 'ziraat_admin' | 'sanayi_admin';
    durum: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export const authService = {
    /**
     * Kullanıcı girişi
     */
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        
        // Token ve user bilgisini localStorage'a kaydet
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    /**
     * Kullanıcı kaydı
     */
    register: async (data: RegisterData): Promise<any> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    /**
     * Mevcut kullanıcı bilgisi
     */
    getMe: async (): Promise<User> => {
        const response = await api.get('/auth/me');
        return response.data.user;
    },

    /**
     * Çıkış
     */
    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Giriş yapılmış mı kontrol
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    /**
     * Mevcut kullanıcıyı localStorage'dan al
     */
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }
};
```

---

## 📋 Ek Notlar

### Güvenlik Notları

1. **Şifre Güvenliği:**
   - bcrypt ile hash'leme yapılıyor
   - Salt rounds: 10
   - Şifreler hiçbir zaman plain text olarak saklanmıyor

2. **JWT Token:**
   - 7 gün geçerlilik süresi
   - Her istekte doğrulanıyor
   - Süresi dolmuş token'lar otomatik reddediliyor

3. **Rol Kontrolü:**
   - Middleware seviyesinde yapılıyor
   - Her endpoint için uygun roller kontrol ediliyor

4. **SQL Injection:**
   - Parametreli sorgular kullanılıyor
   - Hiçbir yerde string concatenation yok

### Validation Önerileri

```javascript
// express-validator kullanımı
const { body, validationResult } = require('express-validator');

// Örnek validation
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').isMobilePhone('tr-TR'),
    // ... diğer validationlar
], register);
```

### Error Handling İyileştirmeleri

```javascript
// Merkezi error handler
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

// Kullanımı
throw new AppError('Kullanıcı bulunamadı', 404);
```

### Logger Ekleme (Winston)

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Kullanımı
logger.info('User logged in', { userId: user.id });
logger.error('Database error', { error: error.message });
```

---

## 🎯 Test Önerileri

### Postman Collection

```json
{
    "info": {
        "name": "YesilEksen API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Auth",
            "item": [
                {
                    "name": "Register",
                    "request": {
                        "method": "POST",
                        "url": "{{baseUrl}}/auth/register",
                        "body": {
                            "mode": "raw",
                            "raw": "{\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\",\n  \"userType\": \"farmer\",\n  \"phone\": \"+90 532 123 45 67\",\n  \"terms\": true\n}"
                        }
                    }
                }
            ]
        }
    ]
}
```

### Unit Test Örneği (Jest)

```javascript
const { register } = require('../controllers/authController');

describe('Auth Controller', () => {
    describe('register', () => {
        it('should create a new user', async () => {
            const req = {
                body: {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    password: '123456',
                    userType: 'farmer',
                    phone: '+90 532 123 45 67',
                    terms: true
                }
            };
            
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            await register(req, res);
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: expect.any(String)
                })
            );
        });
    });
});
```

---

**✅ DETAYLI_KODLAR.md TAMAMLANDI**

Tüm backend ve frontend kodları bu dosyada bulunmaktadır. YOL_HARITASI.md ile birlikte kullanarak projeyi geliştirebilirsiniz.

