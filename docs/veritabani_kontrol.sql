-- Veritabanı Kontrol ve Oluşturma
-- PostgreSQL'de çalıştırın

-- 1. Mevcut veritabanlarını listele
\l

-- 2. yesileksen veritabanı var mı kontrol et
SELECT datname FROM pg_database WHERE datname = 'yesileksen';

-- 3. Eğer yoksa oluştur
CREATE DATABASE yesileksen
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- 4. Veritabanına bağlan ve tabloları kontrol et
\c yesileksen

-- 5. Tabloları listele
\dt

-- 6. Kullanıcılar tablosunu kontrol et
SELECT COUNT(*) as kullanici_sayisi FROM kullanicilar;


