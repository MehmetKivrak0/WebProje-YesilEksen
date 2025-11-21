-- YEŞİL-EKSEN - KAYIT SİSTEMİ SEED DATA
-- Bu SQL'i çalıştırmadan kayıt sistemi çalışmaz!

-- =====================================================
-- 1. ATIK TÜRLERİ (Frontend'de kullanılan kodlar)
-- =====================================================
INSERT INTO atik_turleri (kod, ad, aciklama, aktif) VALUES
    ('hayvansal-gubre', 'Hayvansal Gübre', 'Hayvansal gübre atıkları', TRUE),
    ('bitkisel-atik', 'Bitkisel Atık', 'Bitkisel kökenli atıklar', TRUE),
    ('tarimsal-sanayi', 'Tarımsal Sanayi Yan Ürünü', 'Tarımsal sanayi atıkları', TRUE),
    ('organik-atik', 'Organik Atık', 'Organik kökenli atıklar', TRUE),
    ('biyokutle', 'Biyokütle', 'Biyokütle atıkları', TRUE),
    ('diger', 'Diğer Atık Türleri', 'Diğer atık türleri', TRUE)
ON CONFLICT (kod) DO NOTHING;

-- =====================================================
-- 2. BELGE TÜRLERİ - ÇİFTÇİ
-- =====================================================
INSERT INTO belge_turleri (kod, ad, zorunlu, aktif) VALUES
    ('tapu_kira', 'Tapu Senedi veya Onaylı Kira Sözleşmesi', TRUE, TRUE),
    ('nufus_cuzdani', 'Nüfus Cüzdanı Fotokopisi', TRUE, TRUE),
    ('ciftci_kutugu', 'Çiftçi Kütüğü Kaydı', TRUE, TRUE),
    ('muvafakatname', 'Muvafakatname', FALSE, TRUE),
    ('taahhutname', 'Taahhütname', FALSE, TRUE),
    ('doner_sermaye', 'Döner Sermaye Ücret Makbuzu', FALSE, TRUE)
ON CONFLICT (kod) DO NOTHING;

-- =====================================================
-- 3. BELGE TÜRLERİ - ŞİRKET
-- =====================================================
INSERT INTO belge_turleri (kod, ad, zorunlu, aktif) VALUES
    ('ticaret_sicil', 'Ticaret Sicil Gazetesi', TRUE, TRUE),
    ('vergi_levhasi', 'Vergi Levhası', TRUE, TRUE),
    ('imza_sirkuleri', 'İmza Sirküleri', TRUE, TRUE),
    ('faaliyet_belgesi', 'Faaliyet Belgesi', TRUE, TRUE),
    ('oda_kayit', 'Oda Kayıt Sicil Sureti', TRUE, TRUE),
    ('gida_isletme', 'Gıda İşletme Kayıt/Onay Belgesi', FALSE, TRUE),
    ('sanayi_sicil', 'Sanayi Sicil Belgesi', FALSE, TRUE),
    ('kapasite_raporu', 'Kapasite Raporu', FALSE, TRUE)
ON CONFLICT (kod) DO NOTHING;

-- =====================================================
-- 4. BİRİMLER (ciftlik_atik_kapasiteleri için gerekli)
-- =====================================================
INSERT INTO birimler (kod, ad, sembol, tur) VALUES
    ('ton', 'Ton', 'ton', 'agirlik'),
    ('kg', 'Kilogram', 'kg', 'agirlik'),
    ('m3', 'Metreküp', 'm³', 'hacim'),
    ('lt', 'Litre', 'lt', 'hacim')
ON CONFLICT (kod) DO NOTHING;

