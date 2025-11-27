const { pool } = require('../config/database');

//Çİftlik Panel İstatistikleri kısmı

const getPanelStats = async (req, res) => {
    try {
        const user_ıd = req.user.id;

        //Çiftlik İd'sini bul
        const citflikResult = await pool.query
            ('SELECT id FROM ciftlikler WHERE kullanici_id = $1', [user_ıd]);

        if (citflikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlik_id = citflikResult.rows[0].id;

        //Toplam Ürün Sayısını Bul
        const urunResult = await pool.query(
            'SELECT COUNT(*) as toplam FROM urunler WHERE ciftlik_id = $1 AND durum != $2',
            [ciftlik_id, 'silindi']
        );

        //Aktif Ürün Sayısını Bul
        const aktifResult = await pool.query(
            'SELECT COUNT(*) as aktif FROM urunler WHERE ciftlik_id = $1 AND durum = $2',
            [ciftlik_id, 'aktif']
        );
        //Bekleyen Teklif Sayısını Bul
        const teklifResult = await pool.query(
            `SELECT COUNT(DISTINCT t.id) as bekleyen 
             FROM teklifler t 
             JOIN urunler u ON t.urun_id = u.id 
             WHERE u.ciftlik_id = $1 AND t.durum = 'beklemede'`,
            [ciftlik_id]
        );

        const satisResult = await pool.query(
            `SELECT COALESCE(SUM(s.toplam_tutar), 0) as toplam_satis
             FROM siparisler s
             JOIN urunler u ON s.urun_id = u.id
             WHERE u.ciftlik_id = $1 AND s.durum = 'tamamlandi'`,
            [ciftlik_id] // Dikkat: Artık dizide sadece tek parametre ($1) var.
        );

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
                s.olusturma
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.id
            JOIN firmalar f ON s.firma_id = f.id
            WHERE u.ciftlik_id = $1
            ORDER BY s.olusturma DESC
            LIMIT 5`,
            [ciftlik_id]
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


//Ürünlerim Listesi 
//GET /api/ciftlik/urunler

const getMyProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 6, kategori,
            durum, search } = req.query;

        const offset = (page - 1) * limit;

        const citflikResult = await pool.query('SELECT id FROM ciftlikler WHERE kullanici_id =$1', [userId]
        );

        if (citflikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = citflikResult.rows[0].id;

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
                u.olusturma,
                COUNT(t.id) as teklif_sayisi
            FROM urunler u
            LEFT JOIN teklifler t ON u.id = t.urun_id
            WHERE u.ciftlik_id = $1 AND u.durum != 'silindi'
        `;
        const queryParams = [ciftlik_id];
        let paramIndex = 2;
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

        queryText += ` GROUP BY u.id ORDER BY u.olusturma DESC`;
        queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(queryText, queryParams);


        //Toplam Sayı
        let countQuery = `SELECT COUNT(*) FROM urunler WHERE ciftlik_id = $1 AND durum != 'silindi'`;
        const countParams = [ciftlik_id];
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
        console.error('Ürünler hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Ürünler alınamadı'
        });
    }
};


//Yeni Ürün Ekleme

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

        //Çiftlik id'sini bul
        const citflikResult = await pool.query('SELECT id FROM ciftlikler WHERE kullanici_id = $1', [userId]);
        if (citflikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = citflikResult.rows[0].id;

        //ürün oluştur
        const result = await pool.query(
            `INSERT INTO urunler 
            (ciftlik_id, baslik, aciklama, miktar, birim, fiyat, kategori, durum)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'aktif')
            RETURNING *`,
            [ciftlik_id, title, desc, miktar, birim, price, category]
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

//Ürün Güncelleme
const updateProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { title, miktar, price, category, desc, birim, durum } = req.body;

        //çiftlik id'sini bul
        const citflikResult = await pool.query('SELECT id FROM ciftlikler WHERE kullanici_id = $1', [userId]);

        if (citflikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = citflikResult.rows[0].id;

        //Ürün bu çiftliğe mi ait kontrol et 
        const productCheck = await pool.query('SELECT id FROM urunler WHERE id = $1 AND ciftlik_id = $2', [productId, ciftlik_id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı veya çiftliğinize ait değil'
            });
        }

        //Ürünü güncelle
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

//Ürün Silme
const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        //çiftlik id'sini bul
        const citflikResult = await pool.query('SELECT id FROM ciftlikler WHERE kullanici_id = $1', [userId]);

        if (citflikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = citflikResult.rows[0].id;

        //Ürünü soft delete yap (durum = 'silindi')
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

