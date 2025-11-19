import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Kayit() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Temel Bilgiler
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: '',
    terms: false,
    // Step 2: Çiftlik/Şirket Bilgileri
    farmName: '',
    phone: '',
    address: '',
    wasteTypes: [] as string[],
    otherWasteType: '',
    // Şirket için
    companyName: '',
    taxNumber: '',
    // Step 3: Belgeler - Bakanlığa Başvuru Sırasında Teslim Edilenler (Çiftçi için)
    tapuOrKiraDocument: null as File | null, // Tapu Senedi veya Onaylı Kira Sözleşmesi
    nufusCuzdani: null as File | null, // Nüfus Cüzdanı Fotokopisi
    ciftciKutuguKaydi: null as File | null, // Çiftçi Kütüğü Kaydı (Ziraat Odasından)
    muvafakatname: null as File | null, // Muvafakatname (Hisseli araziler için - Opsiyonel)
    taahhutname: null as File | null, // Taahhütname (Bakanlık matbu formu - Opsiyonel)
    donerSermayeMakbuz: null as File | null, // Döner Sermaye Ücret Makbuzu (Opsiyonel)
    // Step 3: Belgeler - Sanayi Odası İçin (Şirket için)
    ticaretSicilGazetesi: null as File | null, // Ticaret Sicil Gazetesi (Zorunlu)
    vergiLevhasi: null as File | null, // Vergi Levhası (Zorunlu)
    imzaSirkuleri: null as File | null, // İmza Sirküleri (Zorunlu)
    faaliyetBelgesi: null as File | null, // Faaliyet Belgesi (Zorunlu)
    odaKayitSicilSureti: null as File | null, // Oda Kayıt Sicil Sureti (Zorunlu)
    gidaIsletmeKayit: null as File | null, // Gıda İşletme Kayıt/Onay Belgesi (Opsiyonel)
    sanayiSicilBelgesi: null as File | null, // Sanayi Sicil Belgesi (Opsiyonel)
    kapasiteRaporu: null as File | null, // Kapasite Raporu (Opsiyonel)
  });
  const [showPassword, setShowPassword] = useState(false);

  // URL parametrelerinden gelen verileri formData'ya yükle
  useEffect(() => {
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const email = searchParams.get('email');
    const provider = searchParams.get('provider');

    if (firstName || lastName || email) {
      setFormData(prev => ({
        ...prev,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        // Sosyal medya girişi ile geldiyse şifre alanını boş bırak (kullanıcı girecek)
        ...(provider && { password: '' })
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWasteTypeChange = (wasteType: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(wasteType)
        ? prev.wasteTypes.filter(w => w !== wasteType)
        : [...prev.wasteTypes, wasteType]
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const provider = searchParams.get('provider');
      // Sosyal medya girişi ile geliyorsa şifre zorunlu değil
      const isPasswordRequired = !provider;
      
      // Validasyon
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.userType || !formData.terms) {
        alert('Lütfen tüm alanları doldurun ve kullanım şartlarını kabul edin.');
        return;
      }
      
      if (isPasswordRequired && !formData.password) {
        alert('Lütfen şifre alanını doldurun.');
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log('Form Data:', formData);
    alert('Kayıt başarıyla tamamlandı!');
  };

  const steps = [
    { number: 1, label: formData.userType === 'farmer' ? 'Çiftlik Bilgileri' : 'Şirket Bilgileri' },
    { number: 2, label: 'Belge Yükleme' },
    { number: 3, label: 'Onay' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
            </svg>
            <h1 className="text-2xl font-bold text-content-light dark:text-content-dark">Yeşil-Eksen</h1>
          </div>
          <h2 className="text-3xl font-bold text-content-light dark:text-content-dark">Hesap Oluşturun</h2>
          <p className="mt-2 text-sm text-subtle-light dark:text-subtle-dark">
            Zaten hesabınız var mı? 
            <a href="/giris" className="font-medium text-primary hover:text-primary/80 transition-colors"> Giriş yapın</a>
          </p>
          <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
            <a href="/" className="font-medium text-primary hover:text-primary/80 transition-colors">← Anasayfaya Dön</a>
          </p>
        </div>

        {/* Adım Göstergesi */}
        {currentStep > 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  // Progress bar'da gösterilecek adım numarası: currentStep - 1 (çünkü ilk adım progress bar'da yok)
                  const displayStep = currentStep - 1;
                  const isActive = displayStep >= step.number;
                  const isCompleted = displayStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-border-light dark:bg-border-dark text-subtle-light dark:text-subtle-dark'
                        }`}>
                          {step.number}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                          isActive
                            ? 'text-primary'
                            : 'text-subtle-light dark:text-subtle-dark'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 ${
                          isCompleted
                            ? 'bg-primary'
                            : 'bg-border-light dark:bg-border-dark'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Form İçeriği */}
        <form onSubmit={handleSubmit} className="bg-background-light dark:bg-background-dark rounded-xl p-8 border border-border-light dark:border-border-dark">
          {/* Step 1: Hesap Bilgileri */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark mb-6">Hesap Bilgileri</h2>
              
              <div className="space-y-4">
                {/* Ad */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                    Ad
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">person</span>
                    <input 
                      id="firstName" 
                      name="firstName" 
                      type="text" 
                      required 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                      placeholder="Adınız"
                    />
                  </div>
                </div>

                {/* Soyad */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                    Soyad
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">person</span>
                    <input 
                      id="lastName" 
                      name="lastName" 
                      type="text" 
                      required 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>

                {/* E-posta */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                    E-posta
                    {searchParams.get('provider') && (
                      <span className="text-xs text-subtle-light dark:text-subtle-dark ml-1">
                        ({searchParams.get('provider') === 'github' ? 'GitHub' : 'LinkedIn'} ile giriş yaptınız)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">mail</span>    
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      readOnly={!!searchParams.get('provider')}
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${searchParams.get('provider') ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="E-posta adresiniz"
                    />
                  </div>
                </div>  

                {/* Şifre */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                    Şifre {!searchParams.get('provider') && '*'}
                    {searchParams.get('provider') && <span className="text-xs text-subtle-light dark:text-subtle-dark ml-1">(Opsiyonel - Sosyal medya girişi)</span>}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">lock</span>
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required={!searchParams.get('provider')}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                      placeholder={searchParams.get('provider') ? "Şifreniz (Opsiyonel)" : "Şifreniz"}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Kullanıcı Türü */}
                <div>
                  <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                    Kullanıcı Türü
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                      <input 
                        type="radio" 
                        name="userType" 
                        value="farmer" 
                        checked={formData.userType === 'farmer'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark"
                      />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">agriculture</span>
                          <span className="text-sm font-medium text-content-light dark:text-content-dark">Çiftçi</span>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                      <input 
                        type="radio" 
                        name="userType" 
                        value="company" 
                        checked={formData.userType === 'company'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark"
                      />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">business</span>
                          <span className="text-sm font-medium text-content-light dark:text-content-dark">Şirket</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Kullanım Şartları */}
                <div className="flex items-center">
                  <input 
                    id="terms" 
                    name="terms" 
                    type="checkbox" 
                    required 
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-subtle-light dark:text-subtle-dark">
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">Kullanım şartlarını</a> ve 
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors"> gizlilik politikasını</a> kabul ediyorum
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Çiftlik/Şirket Bilgileri */}
          {currentStep === 2 && formData.userType === 'farmer' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark mb-6">Çiftlik Bilgileri</h2>
              
              <div className="space-y-6">
                {/* Çiftlik Adı */}
                <div>
                  <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Çiftlik Adı *</label>
                  <input 
                    type="text" 
                    name="farmName"
                    required 
                    value={formData.farmName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="Çiftlik adınızı girin"
                  />
                </div>

                {/* İletişim Bilgileri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Telefon *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">E-posta</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark opacity-60" 
                      placeholder={formData.email}
                    />
                  </div>
                </div>

                {/* Adres Bilgileri */}
                <div>
                  <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Adres *</label>
                  <textarea 
                    required 
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="Tam adresinizi girin"
                  ></textarea>
                </div>

                {/* Atık Türleri (Satış için) */}
                <div className="border-t border-border-light dark:border-border-dark pt-6">
                  <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4">Satış Yapacağınız Atık Türleri *</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark mb-4">Sanayi firmalarına satışa sunacağınız atık türlerini seçin</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: 'hayvansal-gubre', label: 'Hayvansal Gübre', icon: 'pets' },
                      { value: 'bitkisel-atik', label: 'Bitkisel Atık', icon: 'eco' },
                      { value: 'tarimsal-sanayi', label: 'Tarımsal Sanayi Yan Ürünü', icon: 'factory' },
                      { value: 'organik-atik', label: 'Organik Atık', icon: 'recycling' },
                      { value: 'biyokutle', label: 'Biyokütle', icon: 'energy_savings_leaf' },
                      { value: 'diger', label: 'Diğer Atık Türleri', icon: 'category' }
                    ].map((waste) => (
                      <label key={waste.value} className="flex items-center p-4 border border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.wasteTypes.includes(waste.value)}
                          onChange={() => handleWasteTypeChange(waste.value)}
                          className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark rounded"
                        />
                        <div className="ml-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">{waste.icon}</span>
                          <span className="text-sm font-medium text-content-light dark:text-content-dark">{waste.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {/* Diğer Atık Türü Input (Sadece "Diğer" seçildiğinde görünür) */}
                  {formData.wasteTypes.includes('diger') && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Diğer Atık Türü Açıklaması *
                      </label>
                      <input 
                        type="text" 
                        name="otherWasteType"
                        required={formData.wasteTypes.includes('diger')}
                        value={formData.otherWasteType}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="Lütfen atık türünü açıklayın"
                      />
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-between pt-6">
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-border-light dark:border-border-dark rounded-lg text-content-light dark:text-content-dark hover:bg-primary/5 transition-colors"
                >
                  Geri
                </button>
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Şirket Bilgileri */}
          {currentStep === 2 && formData.userType === 'company' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark mb-6">Şirket Bilgileri</h2>
              
              <div className="space-y-6">
                {/* Şirket Adı */}
                <div>
                  <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Şirket Adı *</label>
                  <input 
                    type="text" 
                    name="companyName"
                    required 
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="Şirket adınızı girin"
                  />
                </div>

                {/* İletişim Bilgileri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Telefon *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">E-posta</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark opacity-60" 
                      placeholder={formData.email}
                    />
                  </div>
                </div>

                {/* Vergi Numarası */}
                <div>
                  <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Vergi Numarası *</label>
                  <input 
                    type="text" 
                    name="taxNumber"
                    required 
                    value={formData.taxNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="Vergi numaranızı girin"
                  />
                </div>

                {/* Adres Bilgileri */}
                <div>
                  <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">Adres *</label>
                  <textarea 
                    required 
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="Tam adresinizi girin"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-border-light dark:border-border-dark rounded-lg text-content-light dark:text-content-dark hover:bg-primary/5 transition-colors"
                >
                  Geri
                </button>
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Belge Yükleme */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark mb-6">Gerekli Belgeler</h2>
              <p className="text-sm text-subtle-light dark:text-subtle-dark mb-4">
                {formData.userType === 'farmer' 
                  ? 'Bakanlığa başvuru sırasında teslim edilecek belgeleri yükleyin.' 
                  : 'Sanayi Odasına başvuru sırasında teslim edilecek belgeleri yükleyin.'} Tüm belgeler PDF, JPG veya PNG formatında olmalıdır.
              </p>
              
              <div className="space-y-6">
                {/* Zorunlu Belgeler */}
                <div className="border-t border-border-light dark:border-border-dark pt-4">
                  <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">verified</span>
                    Zorunlu Belgeler
                  </h3>

                  {/* Tapu Senedi veya Onaylı Kira Sözleşmesi (Sadece çiftçi için) */}
                  {formData.userType === 'farmer' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Tapu Senedi veya Onaylı Kira Sözleşmesi *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Arazi mülkiyetini veya kullanım hakkını gösteren resmi belge
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.tapuOrKiraDocument && (
                          <p className="text-sm text-primary mt-2">{formData.tapuOrKiraDocument.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="tapuOrKiraDocument"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  )}

                  {/* Nüfus Cüzdanı Fotokopisi */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                      Nüfus Cüzdanı Fotokopisi *
                    </label>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                      İşletme sahibinin TC kimlik belgesi fotokopisi
                    </p>
                    <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                      <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                      <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                      {formData.nufusCuzdani && (
                        <p className="text-sm text-primary mt-2">{formData.nufusCuzdani.name}</p>
                      )}
                      <input 
                        type="file" 
                        name="nufusCuzdani"
                        onChange={handleInputChange}
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>

                  {/* Çiftçi Kütüğü Kaydı (Sadece çiftçi için) */}
                  {formData.userType === 'farmer' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Çiftçi Kütüğü Kaydı *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Ziraat Odasından alınan çiftçi kayıt belgesi
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.ciftciKutuguKaydi && (
                          <p className="text-sm text-primary mt-2">{formData.ciftciKutuguKaydi.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="ciftciKutuguKaydi"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Opsiyonel Belgeler */}
                <div className="border-t border-border-light dark:border-border-dark pt-4">
                  <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    Opsiyonel Belgeler
                  </h3>

                  {/* Muvafakatname (Sadece çiftçi için) */}
                  {formData.userType === 'farmer' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Muvafakatname
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Hisseli araziler için gereklidir
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.muvafakatname && (
                          <p className="text-sm text-primary mt-2">{formData.muvafakatname.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="muvafakatname"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  )}

                  {/* Taahhütname (Sadece çiftçi için) */}
                  {formData.userType === 'farmer' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Taahhütname
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Bakanlık matbu formu
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.taahhutname && (
                          <p className="text-sm text-primary mt-2">{formData.taahhutname.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="taahhutname"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  )}

                  {/* Döner Sermaye Ücret Makbuzu (Sadece çiftçi için) */}
                  {formData.userType === 'farmer' && (
                    <div>
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Döner Sermaye Ücret Makbuzu
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Başvuru ücreti ödeme belgesi
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.donerSermayeMakbuz && (
                          <p className="text-sm text-primary mt-2">{formData.donerSermayeMakbuz.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="donerSermayeMakbuz"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* ŞİRKET İÇİN BELGELER */}
              {formData.userType === 'company' && (
                <div className="space-y-6">
                  {/* Zorunlu Belgeler */}
                  <div className="border-t border-border-light dark:border-border-dark pt-4">
                    <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">verified</span>
                      Zorunlu Belgeler
                    </h3>

                    {/* Ticaret Sicil Gazetesi */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Ticaret Sicil Gazetesi *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Şirket kuruluş ve tescil belgesi
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.ticaretSicilGazetesi && (
                          <p className="text-sm text-primary mt-2">{formData.ticaretSicilGazetesi.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="ticaretSicilGazetesi"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {/* Vergi Levhası */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Vergi Levhası *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Şirketin vergi kaydını gösterir
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.vergiLevhasi && (
                          <p className="text-sm text-primary mt-2">{formData.vergiLevhasi.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="vergiLevhasi"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {/* İmza Sirküleri */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        İmza Sirküleri *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Yetkili imza örnekleri belgesi
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.imzaSirkuleri && (
                          <p className="text-sm text-primary mt-2">{formData.imzaSirkuleri.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="imzaSirkuleri"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {/* Faaliyet Belgesi */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Faaliyet Belgesi *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Ticaret veya Sanayi Odasından güncel faaliyet belgesi
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.faaliyetBelgesi && (
                          <p className="text-sm text-primary mt-2">{formData.faaliyetBelgesi.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="faaliyetBelgesi"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {/* Oda Kayıt Sicil Sureti */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Oda Kayıt Sicil Sureti *
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Ticaret veya Sanayi Odasına kayıt belgesi
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.odaKayitSicilSureti && (
                          <p className="text-sm text-primary mt-2">{formData.odaKayitSicilSureti.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="odaKayitSicilSureti"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Opsiyonel Belgeler */}
                  <div className="border-t border-border-light dark:border-border-dark pt-4">
                    <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">add_circle</span>
                      Opsiyonel Belgeler
                    </h3>

                    {/* Gıda İşletme Kayıt/Onay Belgesi */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Gıda İşletme Kayıt / Onay Belgesi
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Tarım Bakanlığından (Gıda işletmeleri için gerekli)
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.gidaIsletmeKayit && (
                          <p className="text-sm text-primary mt-2">{formData.gidaIsletmeKayit.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="gidaIsletmeKayit"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {/* Sanayi Sicil Belgesi */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Sanayi Sicil Belgesi
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Üretim yapan firmalar için gereklidir
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.sanayiSicilBelgesi && (
                          <p className="text-sm text-primary mt-2">{formData.sanayiSicilBelgesi.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="sanayiSicilBelgesi"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {/* Kapasite Raporu */}
                    <div>
                      <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Kapasite Raporu
                      </label>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark mb-2">
                        Üretim yapan firmalar için gereklidir
                      </p>
                      <label className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG formatında yükleyin</p>
                        {formData.kapasiteRaporu && (
                          <p className="text-sm text-primary mt-2">{formData.kapasiteRaporu.name}</p>
                        )}
                        <input 
                          type="file" 
                          name="kapasiteRaporu"
                          onChange={handleInputChange}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-border-light dark:border-border-dark rounded-lg text-content-light dark:text-content-dark hover:bg-primary/5 transition-colors"
                >
                  Geri
                </button>
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Onay */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark mb-6">Kayıt Özeti</h2>
              
              <div className="space-y-4">
                <div className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                  <h3 className="font-semibold text-content-light dark:text-content-dark mb-3">Hesap Bilgileri</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Ad: {formData.firstName} {formData.lastName}</p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">E-posta: {formData.email}</p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Kullanıcı Türü: {formData.userType === 'farmer' ? 'Çiftçi' : 'Şirket'}</p>
                </div>

                {formData.userType === 'farmer' && (
                  <div className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                    <h3 className="font-semibold text-content-light dark:text-content-dark mb-3">Çiftlik Bilgileri</h3>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Çiftlik Adı: {formData.farmName}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Telefon: {formData.phone}</p>
                    
                    {formData.wasteTypes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Satış Yapacağınız Atık Türleri:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.wasteTypes.map((waste) => {
                            const wasteLabels: { [key: string]: string } = {
                              'hayvansal-gubre': 'Hayvansal Gübre',
                              'bitkisel-atik': 'Bitkisel Atık',
                              'tarimsal-sanayi': 'Tarımsal Sanayi Yan Ürünü',
                              'organik-atik': 'Organik Atık',
                              'biyokutle': 'Biyokütle',
                              'diger': formData.otherWasteType ? `Diğer: ${formData.otherWasteType}` : 'Diğer Atık Türleri'
                            };
                            return (
                              <span key={waste} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                                {wasteLabels[waste] || waste}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                  </div>
                )}

                {formData.userType === 'company' && (
                  <div className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                    <h3 className="font-semibold text-content-light dark:text-content-dark mb-3">Şirket Bilgileri</h3>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Şirket Adı: {formData.companyName}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Telefon: {formData.phone}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Vergi Numarası: {formData.taxNumber}</p>
                  </div>
                )}

                <div className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                  <h3 className="font-semibold text-content-light dark:text-content-dark mb-3">Yüklenen Belgeler</h3>
                  
                  {/* ÇİFTÇİ BELGELERİ */}
                  {formData.userType === 'farmer' && (
                    <>
                      {/* Zorunlu Belgeler */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-subtle-light dark:text-subtle-dark mb-1">Zorunlu Belgeler:</p>
                        {formData.tapuOrKiraDocument && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Tapu/Kira: {formData.tapuOrKiraDocument.name}
                          </p>
                        )}
                        {formData.nufusCuzdani && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Nüfus Cüzdanı: {formData.nufusCuzdani.name}
                          </p>
                        )}
                        {formData.ciftciKutuguKaydi && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Çiftçi Kütüğü: {formData.ciftciKutuguKaydi.name}
                          </p>
                        )}
                      </div>

                      {/* Opsiyonel Belgeler */}
                      {(formData.muvafakatname || formData.taahhutname || formData.donerSermayeMakbuz) && (
                        <div>
                          <p className="text-xs font-medium text-subtle-light dark:text-subtle-dark mb-1">Opsiyonel Belgeler:</p>
                          {formData.muvafakatname && (
                            <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                              Muvafakatname: {formData.muvafakatname.name}
                            </p>
                          )}
                          {formData.taahhutname && (
                            <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                              Taahhütname: {formData.taahhutname.name}
                            </p>
                          )}
                          {formData.donerSermayeMakbuz && (
                            <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                              Döner Sermaye Makbuzu: {formData.donerSermayeMakbuz.name}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ŞİRKET BELGELERİ */}
                  {formData.userType === 'company' && (
                    <>
                      {/* Zorunlu Belgeler */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-subtle-light dark:text-subtle-dark mb-1">Zorunlu Belgeler:</p>
                        {formData.ticaretSicilGazetesi && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Ticaret Sicil Gazetesi: {formData.ticaretSicilGazetesi.name}
                          </p>
                        )}
                        {formData.vergiLevhasi && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Vergi Levhası: {formData.vergiLevhasi.name}
                          </p>
                        )}
                        {formData.imzaSirkuleri && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            İmza Sirküleri: {formData.imzaSirkuleri.name}
                          </p>
                        )}
                        {formData.faaliyetBelgesi && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Faaliyet Belgesi: {formData.faaliyetBelgesi.name}
                          </p>
                        )}
                        {formData.odaKayitSicilSureti && (
                          <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            Oda Kayıt Sicil Sureti: {formData.odaKayitSicilSureti.name}
                          </p>
                        )}
                      </div>

                      {/* Opsiyonel Belgeler */}
                      {(formData.gidaIsletmeKayit || formData.sanayiSicilBelgesi || formData.kapasiteRaporu) && (
                        <div>
                          <p className="text-xs font-medium text-subtle-light dark:text-subtle-dark mb-1">Opsiyonel Belgeler:</p>
                          {formData.gidaIsletmeKayit && (
                            <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                              Gıda İşletme Kayıt: {formData.gidaIsletmeKayit.name}
                            </p>
                          )}
                          {formData.sanayiSicilBelgesi && (
                            <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                              Sanayi Sicil Belgesi: {formData.sanayiSicilBelgesi.name}
                            </p>
                          )}
                          {formData.kapasiteRaporu && (
                            <p className="text-sm text-content-light dark:text-content-dark flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                              Kapasite Raporu: {formData.kapasiteRaporu.name}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button 
                  type="button" 
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-border-light dark:border-border-dark rounded-lg text-content-light dark:text-content-dark hover:bg-primary/5 transition-colors"
                >
                  Geri
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Kaydı Tamamla
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Kayit;
