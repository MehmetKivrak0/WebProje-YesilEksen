function Kayit() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
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
                <a href="/giris" className="font-medium text-primary hover:text-primary/80 transition-colors">Giriş yapın</a>
            </p>
            <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                <a href="/" className="font-medium text-primary hover:text-primary/80 transition-colors">← Anasayfaya Dön</a>
            </p>
        </div>

        {/* Kayıt Formu */}
        <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="space-y-4">
                {/* Ad */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Ad
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">person</span>
                        <input id="firstName" name="firstName" type="text" required className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" placeholder="Adınız"/>
                    </div>
                </div>

                {/* Soyad */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Soyad
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">person</span>
                        <input id="lastName" name="lastName" type="text" required className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" placeholder="Soyadınız"/>
                    </div>
                </div>

                {/* E-posta */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        E-posta
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">mail</span>    
                        <input id="email" name="email" type="email" required className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" placeholder="E-posta adresiniz"/>
                    </div>
                </div>  

                {/* Şifre */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Şifre
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">lock</span>
                        <input id="password" name="password" type="password" required className="w-full pl-10 pr-10 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" placeholder="Şifreniz"/>
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">visibility</span>
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
                            <input type="radio" name="userType" value="farmer" className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark"/>
                            <div className="ml-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">agriculture</span>
                                    <span className="text-sm font-medium text-content-light dark:text-content-dark">Çiftçi</span>
                                </div>
                            </div>
                        </label>
                        <label className="flex items-center p-4 border border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                            <input type="radio" name="userType" value="company" className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark"/>
                            <div className="ml-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">business</span>
                                    <span className="text-sm font-medium text-content-light dark:text-content-dark">Şirket</span>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Çiftlik Adı (Çiftçi seçilirse) */}
                <div id="farmNameField" className="hidden">
                    <label htmlFor="farmName" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Çiftlik Adı
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">home</span>
                        <input id="farmName" name="farmName" type="text" className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" placeholder="Çiftlik adınız"/>
                    </div>
                </div>

                {/* Belge Yükleme */}
                <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Kimlik Belgesi
                    </label>
                    <div className="border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-4xl text-subtle-light dark:text-subtle-dark mb-2">upload_file</span>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">PDF/JPG/PNG Yükle</p>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"/>
                    </div>
                </div>
            </div>

            {/* Kullanım Şartları */}
            <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark rounded"/>
                <label htmlFor="terms" className="ml-2 block text-sm text-subtle-light dark:text-subtle-dark">
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">Kullanım şartlarını</a> ve 
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">gizlilik politikasını</a> kabul ediyorum
                </label>
            </div>

            {/* Kayıt Butonu */}
            <div>
                <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-white">person_add</span>
                    </span>
                    Hesap Oluştur
                </button>
            </div>
        </form>
    </div>
</div>

  )
}

export default Kayit;
