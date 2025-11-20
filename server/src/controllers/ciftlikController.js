const { Await } = require('react-router-dom');
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
             WHERE u.ciftlik_id = $1 AND t.durum = 'bekleyen'`,
            [ciftlik_id] // Artık sadece $1 için ciftlik_id gönderiyoruz
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
            return res.stats(404).json({
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
                u.olusturma_tarihi,
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

        queryText += ` GROUP BY u.id ORDER BY u.olusturma_tarihi DESC`;
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
            pagination:{
               page:parseInt(page),
               limit:parseInt(limit),
               total:totalCount,
               totalPages:Math.ceil(totalCount / limit)
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
