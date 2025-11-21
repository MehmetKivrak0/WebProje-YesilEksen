-- =====================================================
-- YEŞİL-EKSEN VERİTABANI KURULUMU
-- =====================================================
-- Bu dosyayı çalıştırmadan önce:
-- 1. PostgreSQL'de "yesileksen" veritabanını oluşturun
-- 2. Bu dosyayı "yesileksen" veritabanında çalıştırın
-- =====================================================

-- Veritabanı oluştur (eğer yoksa)
CREATE DATABASE yesileksen
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE = template0;

-- Veritabanına bağlan
\c yesileksen

-- =====================================================
-- ADIM 1: Ana Şema Dosyasını Çalıştır
-- =====================================================
-- Şimdi docs/Kullanılan Sql.sql dosyasını çalıştırın
-- pgAdmin'de: File > Open > docs/Kullanılan Sql.sql > Execute (F5)

-- =====================================================
-- ADIM 2: Seed Data Dosyasını Çalıştır
-- =====================================================
-- Şimdi docs/seed_data.sql dosyasını çalıştırın
-- pgAdmin'de: File > Open > docs/seed_data.sql > Execute (F5)

-- =====================================================
-- KONTROL
-- =====================================================
-- Kurulumun başarılı olduğunu kontrol edin:

SELECT COUNT(*) as atik_turu_sayisi FROM atik_turleri WHERE aktif = TRUE;
-- Sonuç: 6 olmalı

SELECT COUNT(*) as belge_turu_sayisi FROM belge_turleri WHERE aktif = TRUE;
-- Sonuç: 14+ olmalı

SELECT COUNT(*) as birim_sayisi FROM birimler;
-- Sonuç: 4+ olmalı

SELECT COUNT(*) as kullanici_sayisi FROM kullanicilar;
-- Sonuç: 3+ olmalı (admin, ziraat, sanayi)


