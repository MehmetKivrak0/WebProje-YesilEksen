-- YEŞİL-EKSEN - TEST KULLANICILARI
-- Login testi için test kullanıcıları

-- Test Çiftçi
INSERT INTO kullanicilar (ad, soyad, eposta, sifre_hash, telefon, rol, durum, eposta_dogrulandi, sartlar_kabul, sartlar_kabul_tarihi)
SELECT 
    'Test',
    'Çiftçi',
    'ciftci@test.com',
    crypt('123456', gen_salt('bf')),
    '+90 532 111 22 33',
    'ciftci',
    'aktif',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM kullanicilar WHERE eposta = 'ciftci@test.com')
RETURNING id;

-- Test Firma
INSERT INTO kullanicilar (ad, soyad, eposta, sifre_hash, telefon, rol, durum, eposta_dogrulandi, sartlar_kabul, sartlar_kabul_tarihi)
SELECT 
    'Test',
    'Firma',
    'firma@test.com',
    crypt('123456', gen_salt('bf')),
    '+90 532 444 55 66',
    'firma',
    'aktif',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM kullanicilar WHERE eposta = 'firma@test.com')
RETURNING id;

-- Test Kullanıcıları Göster
SELECT 
    id,
    ad || ' ' || soyad as ad_soyad,
    eposta,
    telefon,
    rol,
    durum
FROM kullanicilar
WHERE eposta IN ('ciftci@test.com', 'firma@test.com');

