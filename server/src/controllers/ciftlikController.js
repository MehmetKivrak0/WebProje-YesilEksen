const { pool } = require('../config/database');

//Çiftlik Panel İstatistikleri kısmı

const getPanelStats = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { timeRange = 'ay' } = req.query; // hafta, ay, yil

        //Çiftlik İd'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlik_id = ciftlikResult.rows[0].id;

        // Zaman aralığı filtresi için tarih hesaplama
        let dateFilter = '';
        
        if (timeRange === 'hafta') {
            dateFilter = `AND s.olusturma >= NOW() - INTERVAL '7 days'`;
        } else if (timeRange === 'ay') {
            dateFilter = `AND s.olusturma >= NOW() - INTERVAL '1 month'`;
        } else if (timeRange === 'yil') {
            dateFilter = `AND s.olusturma >= NOW() - INTERVAL '1 year'`;
        }

        //Toplam Satış Sayısı (zaman aralığına göre)
        const satisSayisiResult = await pool.query(
            `SELECT COUNT(*) as toplam
             FROM siparisler s
             JOIN urunler u ON s.urun_id = u.id
             WHERE u.ciftlik_id = $1 AND s.durum = 'tamamlandi' ${dateFilter}`,
            [ciftlik_id]
        );

        //Bekleyen Onay Sayısı
        const bekleyenOnayResult = await pool.query(
            `SELECT COUNT(DISTINCT t.id) as bekleyen 
             FROM teklifler t 
             JOIN urunler u ON t.urun_id = u.id 
             WHERE u.ciftlik_id = $1 AND t.durum = 'beklemede'`,
            [ciftlik_id]
        );

        //Aktif Ürün Sayısı
        // Not: urunler tablosunda durum değerleri: 'aktif', 'stokta' (satışta olan ürünler)
        const aktifUrunResult = await pool.query(
            `SELECT COUNT(*) as aktif FROM urunler WHERE ciftlik_id = $1 AND durum IN ('aktif', 'stokta')`,
            [ciftlik_id]
        );

        //Toplam Gelir (zaman aralığına göre)
        // Not: siparisler tablosunda toplam_tutar yerine genel_toplam kullanılıyor
        const toplamGelirResult = await pool.query(
            `SELECT COALESCE(SUM(s.fiyat), 0) as toplam_gelir
             FROM siparisler s
             JOIN urunler u ON s.urun_id = u.id
             WHERE u.ciftlik_id = $1 AND s.durum = 'tamamlandi' ${dateFilter}`,
            [ciftlik_id]
        );

        res.json({
            success: true,
            stats: {
                toplamSatis: parseInt(satisSayisiResult.rows[0].toplam) || 0,
                bekleyenOnay: parseInt(bekleyenOnayResult.rows[0].bekleyen) || 0,
                aktifUrun: parseInt(aktifUrunResult.rows[0].aktif) || 0,
                toplamGelir: parseFloat(toplamGelirResult.rows[0].toplam_gelir) || 0
            }
        });

    } catch (error) {
        console.error('❌ Panel stats hatası:', error);
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
            message: 'İstatistikler alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};


//Ürünlerim Listesi 
//GET /api/ciftlik/urunler

const getMyProducts = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 6, kategori,
            durum, search } = req.query;

        const offset = (page - 1) * limit;

        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = ciftlikResult.rows[0].id;

        // Query oluştur
        let queryText = `
            SELECT 
                u.id,
                u.baslik,
                u.aciklama,
                u.miktar,
                b.kod as birim,
                u.fiyat,
                uk.ad as kategori,
                u.durum,
                u.olusturma,
                COUNT(t.id) as teklif_sayisi,
                (SELECT ur.resim_url 
                 FROM urun_resimleri ur 
                 WHERE ur.urun_id = u.id AND ur.ana_resim = TRUE 
                 LIMIT 1) as resim_url
            FROM urunler u
            LEFT JOIN teklifler t ON u.id = t.urun_id
            LEFT JOIN birimler b ON u.birim_id = b.id
            LEFT JOIN urun_kategorileri uk ON u.kategori_id = uk.id
            WHERE u.ciftlik_id = $1 AND u.durum != 'silindi'
        `;
        const queryParams = [ciftlik_id];
        let paramIndex = 2;
        if (kategori) {
            queryText += ` AND EXISTS (SELECT 1 FROM urun_kategorileri uk WHERE uk.id = u.kategori_id AND uk.ad = $${paramIndex})`;
            queryParams.push(kategori);
            paramIndex++;
        }

        if (durum) {
            // 'aktif' durumu için hem 'aktif' hem 'stokta' durumundaki ürünleri getir
            if (durum === 'aktif') {
                queryText += ` AND u.durum IN ('aktif', 'stokta')`;
            } else {
                queryText += ` AND u.durum = $${paramIndex}`;
                queryParams.push(durum);
                paramIndex++;
            }
        }

        if (search) {
            queryText += ` AND (u.baslik ILIKE $${paramIndex} OR u.aciklama ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        queryText += ` GROUP BY u.id, u.baslik, u.aciklama, u.miktar, b.kod, u.fiyat, uk.ad, u.durum, u.olusturma, u.kategori_id, u.birim_id ORDER BY u.olusturma DESC`;
        queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(queryText, queryParams);


        //Toplam Sayı
        // Not: urunler tablosunda kategori kolonu yok, kategori_id var ve JOIN ile alınmalı
        let countQuery = `SELECT COUNT(*) FROM urunler u WHERE u.ciftlik_id = $1 AND u.durum != 'silindi'`;
        const countParams = [ciftlik_id];
        let countIndex = 2;
        if (kategori) {
            countQuery += ` AND EXISTS (SELECT 1 FROM urun_kategorileri uk WHERE uk.id = u.kategori_id AND uk.ad = $${countIndex})`;
            countParams.push(kategori);
            countIndex++;
        }

        if (durum) {
            // 'aktif' durumu için hem 'aktif' hem 'stokta' durumundaki ürünleri say
            if (durum === 'aktif') {
                countQuery += ` AND u.durum IN ('aktif', 'stokta')`;
            } else {
                countQuery += ` AND u.durum = $${countIndex}`;
                countParams.push(durum);
                countIndex++;
            }
        }

        if (search) {
            countQuery += ` AND (u.baslik ILIKE $${countIndex} OR u.aciklama ILIKE $${countIndex})`;
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
        console.error('❌ Ürünler hatası:', error);
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
            message: 'Ürünler alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};


//Yeni Ürün Ekleme

const addProduct = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { title, miktar, price, category, desc, birim = 'kg' } = req.body;

        // Validasyon
        if (!title || !miktar || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Gerekli alanları doldurunuz'
            });
        }

        //Çiftlik id'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );
        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = ciftlikResult.rows[0].id;

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
        const user_id = req.user.id;
        const productId = req.params.id;
        const { title, miktar, price, category, desc, birim, durum } = req.body;

        //çiftlik id'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = ciftlikResult.rows[0].id;

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
        console.error('❌ Update product hatası:', error);
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
            message: 'Ürün güncellenemedi',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

//Ürün Silme
const deleteProduct = async (req, res) => {
    try {
        const user_id = req.user.id;
        const productId = req.params.id;

        //çiftlik id'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }
        const ciftlik_id = ciftlikResult.rows[0].id;

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
        console.error('❌ Delete product hatası:', error);
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
            message: 'Ürün silinemedi',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};
// Bekleyen Onaylar (Teklifler)
const getPendingOffers = async (req, res) => {
    try {
        const user_id = req.user.id;

        //Çiftlik İd'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlik_id = ciftlikResult.rows[0].id;

        // Bekleyen teklifleri getir
        const tekliflerResult = await pool.query(
            `SELECT 
                t.id,
                u.baslik as urun,
                t.miktar,
                t.birim_fiyat,
                t.toplam_fiyat as teklif_fiyat,
                f.ad as alici,
                t.olusturma as tarih,
                t.son_gecerlilik_tarihi
            FROM teklifler t
            JOIN urunler u ON t.urun_id = u.id
            JOIN firmalar f ON t.firma_id = f.id
            WHERE u.ciftlik_id = $1 AND t.durum = 'beklemede'
            ORDER BY t.olusturma DESC
            LIMIT 10`,
            [ciftlik_id]
        );

        // Tarih formatlama ve kalan süre hesaplama
        const formattedOffers = tekliflerResult.rows.map(offer => {
            const tarih = new Date(offer.tarih);
            const simdi = new Date();
            const fark = Math.floor((simdi - tarih) / (1000 * 60 * 60)); // saat cinsinden

            let tarihText = '';
            if (fark < 1) {
                tarihText = 'Az önce';
            } else if (fark < 24) {
                tarihText = `${fark} saat önce`;
            } else {
                const gun = Math.floor(fark / 24);
                tarihText = `${gun} gün önce`;
            }

            // Kalan süre hesaplama
            let kalanSure = '';
            if (offer.son_gecerlilik_tarihi) {
                const sonTarih = new Date(offer.son_gecerlilik_tarihi);
                const kalanGun = Math.ceil((sonTarih - simdi) / (1000 * 60 * 60 * 24));
                if (kalanGun > 0) {
                    kalanSure = `${kalanGun} gün kaldı`;
                } else {
                    kalanSure = 'Süresi doldu';
                }
            }

            return {
                id: offer.id,
                urun: offer.urun,
                miktar: `${parseFloat(offer.miktar).toLocaleString('tr-TR')} Ton`,
                teklifFiyat: `${parseFloat(offer.teklif_fiyat).toLocaleString('tr-TR')} ₺`,
                birimFiyat: `${parseFloat(offer.birim_fiyat).toLocaleString('tr-TR')} ₺ / ton`,
                alici: offer.alici,
                tarih: tarihText,
                sure: kalanSure || 'Belirtilmemiş'
            };
        });

        res.json({
            success: true,
            offers: formattedOffers
        });

    } catch (error) {
        console.error('❌ Bekleyen onaylar hatası:', error);
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
            message: 'Bekleyen onaylar alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

// Son Satışlar
const getRecentSales = async (req, res) => {
    try {
        const user_id = req.user.id;

        //Çiftlik İd'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlik_id = ciftlikResult.rows[0].id;

        // Son satışları getir
        const satislarResult = await pool.query(
            `SELECT 
                s.id,
                s.siparis_no,
                u.baslik as urun,
                s.miktar,
                s.birim_fiyat,
                s.fiyat,
                s.durum,
                f.ad as alici,
                s.olusturma as tarih
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.id
            JOIN firmalar f ON s.firma_id = f.id
            WHERE u.ciftlik_id = $1 AND s.durum IN ('tamamlandi', 'kargoda', 'hazirlaniyor')
            ORDER BY s.olusturma DESC
            LIMIT 10`,
            [ciftlik_id]
        );

        // Durum mapping ve tarih formatlama
        const durumMap = {
            'tamamlandi': { text: 'Tamamlandı', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'kargoda': { text: 'Kargoda', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
            'hazirlaniyor': { text: 'Hazırlanıyor', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
        };

        const formattedSales = satislarResult.rows.map(sale => {
            const tarih = new Date(sale.tarih);
            const simdi = new Date();
            const fark = Math.floor((simdi - tarih) / (1000 * 60 * 60)); // saat cinsinden

            let tarihText = '';
            if (fark < 1) {
                tarihText = 'Az önce';
            } else if (fark < 24) {
                tarihText = `${fark} saat önce`;
            } else {
                const gun = Math.floor(fark / 24);
                if (gun === 1) {
                    tarihText = '1 gün önce';
                } else {
                    tarihText = `${gun} gün önce`;
                }
            }

            const durumInfo = durumMap[sale.durum] || { text: sale.durum, class: '' };

            return {
                id: sale.id,
                siparisNo: sale.siparis_no,
                urun: sale.urun,
                miktar: `${parseFloat(sale.miktar).toLocaleString('tr-TR')} Ton`,
                fiyat: `${parseFloat(sale.fiyat).toLocaleString('tr-TR')} ₺`,
                durum: durumInfo.text,
                durumClass: durumInfo.class,
                alici: sale.alici,
                tarih: tarihText
            };
        });

        res.json({
            success: true,
            sales: formattedSales
        });

    } catch (error) {
        console.error('❌ Son satışlar hatası:', error);
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
            message: 'Son satışlar alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

// Çiftlik Profil Bilgilerini Getir
// GET /api/ciftlik/profil
const getCiftlikProfil = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Çiftlik bilgilerini getir
        const ciftlikResult = await pool.query(
            `SELECT 
                c.id,
                c.ad,
                k.telefon,
                c.adres,
                c.alan,
                c.kayit_tarihi,
                c.aciklama,
                c.website,
                c.durum,
                c.sehir_id,
                c.enlem,
                c.boylam,
                c.yillik_gelir,
                c.uretim_kapasitesi,
                k.ad as sahibi_ad,
                k.soyad as sahibi_soyad,
                k.eposta as email,
                s.ad as sehir_adi
            FROM ciftlikler c
            JOIN kullanicilar k ON c.kullanici_id = k.id
            LEFT JOIN sehirler s ON c.sehir_id = s.id
            WHERE c.kullanici_id = $1 AND c.silinme IS NULL`,
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlik = ciftlikResult.rows[0];
        const ciftlik_id = ciftlik.id;

        // Sertifikaları getir
        const sertifikalarResult = await pool.query(
            `SELECT 
                st.ad as sertifika_adi
            FROM ciftlik_sertifikalari cs
            JOIN sertifika_turleri st ON cs.sertifika_turu_id = st.id
            WHERE cs.ciftlik_id = $1
            ORDER BY st.ad`,
            [ciftlik_id]
        );

        // Ürün türlerini getir (kategorilerden)
        const urunTurleriResult = await pool.query(
            `SELECT DISTINCT uk.ad as kategori
            FROM urunler u
            JOIN urun_kategorileri uk ON u.kategori_id = uk.id
            WHERE u.ciftlik_id = $1 AND u.durum != 'silindi'
            ORDER BY uk.ad`,
            [ciftlik_id]
        );

        // Kuruluş yılı (kayıt_tarihi'nden)
        const kurulusYili = ciftlik.kayit_tarihi 
            ? new Date(ciftlik.kayit_tarihi).getFullYear().toString()
            : null;

        // Alan birimi (hektar olarak saklanıyor, dönüme çevir)
        const alanHektar = parseFloat(ciftlik.alan) || 0;
        const alanDonum = alanHektar * 10; // 1 hektar = 10 dönüm

        res.json({
            success: true,
            profil: {
                ad: ciftlik.ad,
                sahibi: `${ciftlik.sahibi_ad} ${ciftlik.sahibi_soyad}`,
                telefon: ciftlik.telefon || '',
                email: ciftlik.email || '',
                adres: ciftlik.adres || '',
                alan: alanDonum > 0 ? alanDonum.toString() : '',
                alanBirim: 'Dönüm',
                kurulusYili: kurulusYili || '',
                sehir_id: ciftlik.sehir_id || null,
                sehir_adi: ciftlik.sehir_adi || '',
                enlem: ciftlik.enlem ? parseFloat(ciftlik.enlem).toString() : '',
                boylam: ciftlik.boylam ? parseFloat(ciftlik.boylam).toString() : '',
                yillik_gelir: ciftlik.yillik_gelir ? parseFloat(ciftlik.yillik_gelir).toString() : '',
                uretim_kapasitesi: ciftlik.uretim_kapasitesi ? parseFloat(ciftlik.uretim_kapasitesi).toString() : '',
                urunTurleri: urunTurleriResult.rows.map(row => row.kategori),
                sertifikalar: sertifikalarResult.rows.map(row => row.sertifika_adi),
                dogrulanmis: ciftlik.durum === 'aktif',
                aciklama: ciftlik.aciklama || '',
                website: ciftlik.website || ''
            }
        });

    } catch (error) {
        console.error('❌ Çiftlik profil hatası:', error);
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
            message: 'Çiftlik profili alınamadı',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

// Çiftlik Profil Bilgilerini Güncelle
// PUT /api/ciftlik/profil
const updateCiftlikProfil = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {
            ad,
            telefon,
            adres,
            alan,
            alanBirim,
            kurulusYili,
            aciklama,
            website
        } = req.body;

        // Çiftlik ID'sini bul
        const ciftlikResult = await pool.query(
            'SELECT id FROM ciftlikler WHERE kullanici_id = $1 AND silinme IS NULL',
            [user_id]
        );

        if (ciftlikResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Çiftlik bulunamadı'
            });
        }

        const ciftlik_id = ciftlikResult.rows[0].id;

        // Alan birimini hektara çevir (dönüm -> hektar: 10'a böl)
        let alanHektar = null;
        if (alan) {
            const alanValue = parseFloat(alan);
            if (alanBirim === 'Dönüm') {
                alanHektar = alanValue / 10; // Dönüm -> Hektar
            } else if (alanBirim === 'Hektar') {
                alanHektar = alanValue;
            } else if (alanBirim === 'Dekar') {
                alanHektar = alanValue / 10; // Dekar = Dönüm
            }
        }

        // Kuruluş yılını DATE'e çevir
        let kayitTarihi = null;
        if (kurulusYili) {
            kayitTarihi = `${kurulusYili}-01-01`;
        }

        // Çiftlik bilgilerini güncelle
        const updateCiftlikResult = await pool.query(
            `UPDATE ciftlikler 
            SET 
                ad = COALESCE($1, ad),
                adres = COALESCE($2, adres),
                alan = COALESCE($3, alan),
                kayit_tarihi = COALESCE($4::DATE, kayit_tarihi),
                sehir_id = COALESCE($5::SMALLINT, sehir_id),
                enlem = COALESCE($6::DECIMAL, enlem),
                boylam = COALESCE($7::DECIMAL, boylam),
                yillik_gelir = COALESCE($8::DECIMAL, yillik_gelir),
                uretim_kapasitesi = COALESCE($9::DECIMAL, uretim_kapasitesi),
                aciklama = COALESCE($10, aciklama),
                website = COALESCE($11, website),
                guncelleme = NOW()
            WHERE id = $12
            RETURNING *`,
            [
                ad, 
                adres, 
                alanHektar, 
                kayitTarihi, 
                sehir_id || null,
                enlem ? parseFloat(enlem) : null,
                boylam ? parseFloat(boylam) : null,
                yillik_gelir ? parseFloat(yillik_gelir) : null,
                uretim_kapasitesi ? parseFloat(uretim_kapasitesi) : null,
                aciklama, 
                website, 
                ciftlik_id
            ]
        );

        // Telefon bilgisini kullanicilar tablosunda güncelle
        if (telefon !== undefined && telefon !== null) {
            await pool.query(
                `UPDATE kullanicilar 
                SET telefon = $1, guncelleme = NOW()
                WHERE id = $2`,
                [telefon, user_id]
            );
        }

        res.json({
            success: true,
            message: 'Çiftlik profili başarıyla güncellendi',
            profil: updateCiftlikResult.rows[0]
        });

    } catch (error) {
        console.error('❌ Çiftlik profil güncelleme hatası:', error);
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
            message: 'Çiftlik profili güncellenemedi',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                detail: error.detail,
                hint: error.hint,
                code: error.code
            } : undefined
        });
    }
};

module.exports = {
    getPanelStats,
    getMyProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getPendingOffers,
    getRecentSales,
    getCiftlikProfil,
    updateCiftlikProfil
};

