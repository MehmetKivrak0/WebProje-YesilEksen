import CftNavbar from '../../components/cftnavbar';
import Footer from '../../components/footer';
import { useState } from 'react';

function CiftlikProfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  
  // Çiftlik bilgileri - gerçek uygulamada API'den gelecek
  const [ciftlikBilgileri, setCiftlikBilgileri] = useState({
    ad: 'Yeşil Vadi Çiftliği',
    sahibi: 'Mehmet Yılmaz',
    telefon: '+90 312 123 45 67',
    email: 'info@yesilvadi.com.tr',
    adres: 'Kızılcahamam Mah. Tarım Sok. No: 45, Kızılcahamam, Ankara, Türkiye',
    alan: '150',
    alanBirim: 'Dönüm',
    kurulusYili: '2010',
    urunTurleri: ['Mısır', 'Buğday', 'Ayçiçeği', 'Sebze'],
    sertifikalar: [
      'Organik Tarım Sertifikası',
      'İyi Tarım Uygulamaları (İTU)',
      'GlobalGAP Sertifikası'
    ],
    dogrulanmis: true,
    aciklama: 'Yeşil Vadi Çiftliği, 2010 yılından beri organik tarım ve sürdürülebilir tarım uygulamaları ile faaliyet göstermektedir. Çiftliğimizde mısır, buğday, ayçiçeği ve çeşitli sebzeler yetiştirilmektedir. Tüm üretimimiz organik sertifikalıdır ve çevre dostu yöntemler kullanılmaktadır.',
    foto: null
  });

  const handleSave = () => {
    // Gerçek uygulamada API çağrısı yapılacak
    setIsEditing(false);
    setFotoPreview(null);
    // API çağrısı: kaydetme işlemi
    console.log('Çiftlik bilgileri kaydedildi:', ciftlikBilgileri);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFotoPreview(null);
    // Değişiklikleri geri al (gerçek uygulamada orijinal verileri yükle)
  };

  const handleChange = (field: string, value: string) => {
    setCiftlikBilgileri(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Gerçek uygulamada dosya yükleme işlemi yapılacak
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
        setCiftlikBilgileri(prev => ({
          ...prev,
          foto: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrunTuruEkle = (urun: string) => {
    if (urun && !ciftlikBilgileri.urunTurleri.includes(urun)) {
      setCiftlikBilgileri(prev => ({
        ...prev,
        urunTurleri: [...prev.urunTurleri, urun]
      }));
    }
  };

  const handleUrunTuruSil = (urun: string) => {
    setCiftlikBilgileri(prev => ({
      ...prev,
      urunTurleri: prev.urunTurleri.filter(u => u !== urun)
    }));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark min-h-screen flex flex-col">
      <CftNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-5xl mx-auto">
          {/* Başlık */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">Çiftlik Profili</h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">Çiftlik bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>

          {/* Profil Kartı */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/20 dark:bg-primary/30 flex items-center justify-center border-2 border-primary/30 dark:border-primary/50">
                    {ciftlikBilgileri.foto || fotoPreview ? (
                      <img 
                        src={fotoPreview || ciftlikBilgileri.foto} 
                        alt={ciftlikBilgileri.ad}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-5xl">agriculture</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                      <span className="material-symbols-outlined text-base">camera_alt</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">{ciftlikBilgileri.ad}</h2>
                    {ciftlikBilgileri.dogrulanmis && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 dark:bg-primary/30 text-primary text-sm font-medium">
                        <span className="material-symbols-outlined text-base">verified</span>
                        Doğrulanmış
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-subtle-light dark:text-subtle-dark">Sahibi: {ciftlikBilgileri.sahibi}</p>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Düzenle
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      Kaydet
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                      İptal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bilgi Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* İletişim Bilgileri */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
              <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contact_mail</span>
                İletişim Bilgileri
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">person</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">Çiftlik Sahibi</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={ciftlikBilgileri.sahibi}
                        onChange={(e) => handleChange('sahibi', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.sahibi}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">phone</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">Telefon</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={ciftlikBilgileri.telefon}
                        onChange={(e) => handleChange('telefon', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.telefon}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">email</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">E-posta</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={ciftlikBilgileri.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">Adres</p>
                    {isEditing ? (
                      <textarea
                        value={ciftlikBilgileri.adres}
                        onChange={(e) => handleChange('adres', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      />
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.adres}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Çiftlik Detayları */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
              <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Çiftlik Detayları
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">agriculture</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">Çiftlik Adı</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={ciftlikBilgileri.ad}
                        onChange={(e) => handleChange('ad', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.ad}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">square_foot</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">Toplam Alan</p>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={ciftlikBilgileri.alan}
                          onChange={(e) => handleChange('alan', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <select
                          value={ciftlikBilgileri.alanBirim}
                          onChange={(e) => handleChange('alanBirim', e.target.value)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="Dönüm">Dönüm</option>
                          <option value="Hektar">Hektar</option>
                          <option value="Dekar">Dekar</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.alan} {ciftlikBilgileri.alanBirim}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">calendar_today</span>
                  <div className="flex-1">
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-0.5">Kuruluş Yılı</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={ciftlikBilgileri.kurulusYili}
                        onChange={(e) => handleChange('kurulusYili', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-sm text-content-light dark:text-content-dark">{ciftlikBilgileri.kurulusYili}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ürün Türleri */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 mb-6">
            <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">eco</span>
              Ürün Türleri
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {ciftlikBilgileri.urunTurleri.map((urun, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40">
                  <span className="text-sm text-content-light dark:text-content-dark">{urun}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleUrunTuruSil(urun)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Yeni ürün türü ekle"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUrunTuruEkle(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input && input.value) {
                      handleUrunTuruEkle(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  type="button"
                >
                  Ekle
                </button>
              </div>
            )}
          </div>

          {/* Açıklama */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 mb-6">
            <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              Hakkımızda
            </h3>
            {isEditing ? (
              <textarea
                value={ciftlikBilgileri.aciklama}
                onChange={(e) => handleChange('aciklama', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            ) : (
              <p className="text-sm text-content-light/80 dark:text-content-dark/80 leading-relaxed">
                {ciftlikBilgileri.aciklama}
              </p>
            )}
          </div>

          {/* Sertifikalar */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
            <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">workspace_premium</span>
              Sertifikalar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ciftlikBilgileri.sertifikalar.map((sertifika, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <p className="text-sm text-content-light dark:text-content-dark">{sertifika}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CiftlikProfil;

