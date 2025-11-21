-- YEŞİL-EKSEN - ŞİFRE KONTROL VE SIFIRLAMA

-- Hash'e sahip kullanıcıyı bul
SELECT 
    id,
    ad || ' ' || soyad as ad_soyad,
    eposta,
    rol,
    durum,
    sifre_hash
FROM kullanicilar
WHERE sifre_hash = '$2a$06$A7vupZ2HS2sa4OWCN8G0rOm3MwV1dhokWuER0BZz6opiQwOwiZqd2';

-- Tüm kullanıcıların hash'lerini göster (güvenlik için sadece test amaçlı)
SELECT 
    eposta,
    LEFT(sifre_hash, 30) as hash_prefix,
    LENGTH(sifre_hash) as hash_length
FROM kullanicilar
WHERE sifre_hash IS NOT NULL
ORDER BY olusturma DESC
LIMIT 10;

-- Şifre sıfırlama (belirli bir kullanıcı için)
-- Örnek: eposta='kullanici@example.com' için şifreyi '123456' olarak ayarla
-- UPDATE kullanicilar 
-- SET sifre_hash = crypt('123456', gen_salt('bf'))
-- WHERE eposta = 'kullanici@example.com';

-- Test şifreleri ile karşılaştır
-- PostgreSQL'de crypt() fonksiyonu ile test et:
-- SELECT 
--     eposta,
--     CASE 
--         WHEN sifre_hash = crypt('123456', sifre_hash) THEN '123456'
--         WHEN sifre_hash = crypt('admin', sifre_hash) THEN 'admin'
--         WHEN sifre_hash = crypt('password', sifre_hash) THEN 'password'
--         ELSE 'Bilinmiyor'
--     END as muhtemel_sifre
-- FROM kullanicilar
-- WHERE eposta = 'kullanici@example.com';


