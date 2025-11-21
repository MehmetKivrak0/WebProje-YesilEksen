-- =====================================================
-- YEŞİL-EKSEN - EK TABLOLAR
-- Kayıt sistemi için gerekli ek tablolar
-- =====================================================

-- Çiftlik Atık Türleri (Basit ilişki tablosu)
-- Çiftçinin hangi atık türlerini satacağını belirtir
-- Kapasite bilgisi olmadan sadece tür bilgisi
CREATE TABLE IF NOT EXISTS ciftlik_atik_turleri (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ciftlik_id UUID NOT NULL REFERENCES ciftlikler(id) ON DELETE CASCADE,
    atik_turu_id UUID NOT NULL REFERENCES atik_turleri(id) ON DELETE CASCADE,
    olusturma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ciftlik_id, atik_turu_id)
);

-- Index'ler (Performans için)
CREATE INDEX IF NOT EXISTS idx_ciftlik_atik_turleri_ciftlik ON ciftlik_atik_turleri(ciftlik_id);
CREATE INDEX IF NOT EXISTS idx_ciftlik_atik_turleri_atik ON ciftlik_atik_turleri(atik_turu_id);

-- =====================================================
-- ATIK TÜRLERİ SEED DATA
-- Frontend'de kullanılan atık türlerini ekle
-- =====================================================

-- Atık türlerini ekle (eğer yoksa)
INSERT INTO atik_turleri (kod, ad, aciklama, aktif) VALUES
    ('hayvansal-gubre', 'Hayvansal Gübre', 'Hayvansal gübre atıkları', TRUE),
    ('bitkisel-atik', 'Bitkisel Atık', 'Bitkisel kökenli atıklar', TRUE),
    ('tarimsal-sanayi', 'Tarımsal Sanayi Yan Ürünü', 'Tarımsal sanayi atıkları', TRUE),
    ('organik-atik', 'Organik Atık', 'Organik kökenli atıklar', TRUE),
    ('biyokutle', 'Biyokütle', 'Biyokütle atıkları', TRUE),
    ('diger', 'Diğer Atık Türleri', 'Diğer atık türleri', TRUE)
ON CONFLICT (kod) DO NOTHING;

-- =====================================================
-- BELGE TÜRLERİ SEED DATA
-- Kayıt formunda kullanılan belge türlerini ekle
-- =====================================================

-- Çiftçi belge türleri
INSERT INTO belge_turleri (kod, ad, zorunlu, aktif) VALUES
    ('tapu_kira', 'Tapu Senedi veya Onaylı Kira Sözleşmesi', TRUE, TRUE),
    ('nufus_cuzdani', 'Nüfus Cüzdanı Fotokopisi', TRUE, TRUE),
    ('ciftci_kutugu', 'Çiftçi Kütüğü Kaydı', TRUE, TRUE),
    ('muvafakatname', 'Muvafakatname', FALSE, TRUE),
    ('taahhutname', 'Taahhütname', FALSE, TRUE),
    ('doner_sermaye', 'Döner Sermaye Ücret Makbuzu', FALSE, TRUE)
ON CONFLICT (kod) DO NOTHING;

-- Şirket belge türleri
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
-- AÇIKLAMA
-- =====================================================
-- Bu script'i çalıştırmak için:
-- 1. pgAdmin veya psql ile veritabanına bağlan
-- 2. Bu dosyayı çalıştır
-- 
-- Veya terminal'den:
-- psql -U postgres -d yesileksen -f docs/ek_tablolar.sql

