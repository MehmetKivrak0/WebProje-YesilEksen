-- YEŞİL-EKSEN - FİRMA SAHİBİ KULLANICI OLUŞTURMA
-- Email: selam77@gmail.com
-- Şifre: 3136785972
-- Rol: firma

-- Kullanıcı kaydı oluştur
INSERT INTO kullanicilar (
    ad, 
    soyad, 
    eposta, 
    sifre_hash, 
    telefon, 
    rol, 
    durum, 
    eposta_dogrulandi, 
    sartlar_kabul, 
    sartlar_kabul_tarihi
)
SELECT 
    'Firma',
    'Sahibi',
    'selam77@gmail.com',
    '$2b$10$Qm1msElnHvnyOD54gBEv.e7Ju6OOo1eMi8mrqpNmiQR1BABaKDt/2', -- Şifre: 3136785972 (bcrypt hash)
    '+90 555 000 00 00', -- Varsayılan telefon, isterseniz değiştirebilirsiniz
    'firma',
    'aktif', -- Direkt aktif durumda (onay beklemeyecek)
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM kullanicilar WHERE eposta = 'selam77@gmail.com')
RETURNING id;

-- Firma kaydı oluştur (kullanıcı ID'sini kullanarak)
-- Önce kullanıcı ID'sini al
DO $$
DECLARE
    kullanici_id_var UUID; -- UUID tipi olarak değiştirildi
BEGIN
    -- Kullanıcı ID'sini al
    SELECT id INTO kullanici_id_var 
    FROM kullanicilar 
    WHERE eposta = 'selam77@gmail.com';
    
    -- Eğer kullanıcı varsa ve firma kaydı yoksa, firma kaydı oluştur
    IF kullanici_id_var IS NOT NULL THEN
        INSERT INTO firmalar (
            kullanici_id,
            ad,
            vergi_no,
            adres,
            durum
        )
        SELECT 
            kullanici_id_var,
            'Test Firma A.Ş.',
            '1234567890', -- Varsayılan vergi no, isterseniz değiştirebilirsiniz
            'İstanbul, Türkiye', -- Varsayılan adres, isterseniz değiştirebilirsiniz
            'aktif'
        WHERE NOT EXISTS (
            SELECT 1 FROM firmalar WHERE kullanici_id = kullanici_id_var
        );
    END IF;
END $$;

-- Oluşturulan kullanıcıyı kontrol et
SELECT 
    k.id,
    k.ad || ' ' || k.soyad as ad_soyad,
    k.eposta,
    k.telefon,
    k.rol,
    k.durum,
    f.id as firma_id,
    f.ad as firma_adi,
    f.vergi_no,
    f.adres as firma_adres
FROM kullanicilar k
LEFT JOIN firmalar f ON f.kullanici_id = k.id
WHERE k.eposta = 'selam77@gmail.com';

