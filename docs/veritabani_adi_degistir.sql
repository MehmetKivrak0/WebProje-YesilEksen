-- PostgreSQL'de Veritabanı Adını Değiştirme
-- ÖNEMLİ: Bu işlem sırasında veritabanına bağlı olan tüm bağlantıları kapatmanız gerekir

-- 1. Önce tüm aktif bağlantıları sonlandır
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'MEVCUT_VERITABANI_ADI' -- Buraya mevcut veritabanı adını yazın
  AND pid <> pg_backend_pid();

-- 2. Veritabanı adını değiştir
-- Örnek: "YeşilEksen" -> "yesileksen"
ALTER DATABASE "MEVCUT_VERITABANI_ADI" RENAME TO "yesileksen";

-- VEYA

-- 3. Yeni veritabanı oluştur ve verileri kopyala (daha güvenli yöntem)
-- 3.1. Yeni veritabanı oluştur
CREATE DATABASE yesileksen
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- 3.2. Eski veritabanından yeni veritabanına veri kopyala
-- pg_dump ve pg_restore kullanarak:
-- pg_dump -U postgres MEVCUT_VERITABANI_ADI > backup.sql
-- psql -U postgres yesileksen < backup.sql

-- 4. Kontrol et
\l

-- 5. Yeni veritabanına bağlan
\c yesileksen

-- 6. Tabloları kontrol et
\dt


