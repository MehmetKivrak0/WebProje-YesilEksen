-- HIZLI ÇÖZÜM: Veritabanı Adını "yesileksen" Yap
-- Encoding hatasına takılmamak için Türkçe karakter olmadan kullanıyoruz

-- ============================================
-- ADIM 1: Mevcut Veritabanı Adını Kontrol Et
-- ============================================
-- pgAdmin veya psql'de çalıştırın:
SELECT datname FROM pg_database 
WHERE datname LIKE '%yesil%' OR datname LIKE '%Yesil%' OR datname LIKE '%Eksen%';

-- ============================================
-- ADIM 2: Yeni Veritabanı Oluştur (ÖNERİLEN)
-- ============================================
-- Eğer "yesileksen" veritabanı yoksa oluştur:
CREATE DATABASE yesileksen
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE = template0;

-- ============================================
-- ADIM 3: Eski Veritabanından Verileri Kopyala
-- ============================================
-- PowerShell veya CMD'de çalıştırın (MEVCUT_VERITABANI_ADI yerine gerçek adı yazın):
-- 
-- pg_dump -U postgres -d "MEVCUT_VERITABANI_ADI" > backup.sql
-- psql -U postgres -d yesileksen < backup.sql
--
-- VEYA pgAdmin'de:
-- 1. Eski veritabanına sağ tık > Backup
-- 2. Backup dosyasını kaydet
-- 3. yesileksen veritabanına sağ tık > Restore
-- 4. Backup dosyasını seç ve restore et

-- ============================================
-- ADIM 4: Kontrol Et
-- ============================================
\c yesileksen
\dt


