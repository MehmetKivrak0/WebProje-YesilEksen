
function Anasayfa() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-content-light dark:text-content-dark mb-6">
              Tarımı Sanayi ile Buluşturun
            </h1>
            <p className="text-xl text-subtle-light dark:text-subtle-dark mb-8">
              Yeşil-Eksen, çiftçiler ve şirketleri bir araya getirerek tarımsal atık yönetimi ve kaynak optimizasyonu için sürdürülebilir bir ekosistem oluşturur.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="ciftlik/ciftlik-yonetimi.html" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Çiftlik Yönetimi
              </a>
              <a href="firmalar/firmalar-ana-sayfa.html" className="bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark px-8 py-3 rounded-lg font-semibold border border-border-light dark:border-border-dark hover:bg-primary/10 transition-colors">
                Firma Portalı
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-content-light dark:text-content-dark mb-4">
              Platform Özellikleri
            </h2>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">
              Tarımsal atık yönetimi ve sürdürülebilir tarım için kapsamlı araçlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Çiftlik Yönetimi Kartı */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">agriculture</span>
              </div>
              <h3 className="text-xl font-semibold text-content-light dark:text-content-dark mb-2">Çiftlik Yönetimi</h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-4">
                Kapsamlı çiftlik kaydı, ürün takibi ve atık yönetim sistemi.
              </p>
              <a href="ciftlik/ciftlik-yonetimi.html" className="text-primary font-medium hover:underline">Keşfet →</a>
            </div>

            {/* Atık Yönetimi Kartı */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">recycling</span>
              </div>
              <h3 className="text-xl font-semibold text-content-light dark:text-content-dark mb-2">Atık Yönetimi</h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-4">
                Yapay zeka destekli atık analizi ve sürdürülebilir tarım uygulamaları için optimizasyon.
              </p>
              <a href="ciftlik/atik-yonetimi.html" className="text-primary font-medium hover:underline">Keşfet →</a>
            </div>

            {/* Firma Portalı Kartı */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">business</span>
              </div>
              <h3 className="text-xl font-semibold text-content-light dark:text-content-dark mb-2">Firma Portalı</h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-4">
                Doğrulanmış şirketlerle bağlantı kurun ve atık ticareti ile kaynak paylaşımı yapın.
              </p>
              <a href="firmalar/firmalar-ana-sayfa.html" className="text-primary font-medium hover:underline">Keşfet →</a>
            </div>

            {/* Yönetici Paneli Kartı */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
              </div>
              <h3 className="text-xl font-semibold text-content-light dark:text-content-dark mb-2">Yönetici Paneli</h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-4">
                Tarımsal odalar ve organizasyonlar için kapsamlı yönetim araçları.
              </p>
              <a href="admin/yonetici-paneli.html" className="text-primary font-medium hover:underline">Keşfet →</a>
            </div>

            {/* Çiftlik Keşfetme Kartı */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">explore</span>
              </div>
              <h3 className="text-xl font-semibold text-content-light dark:text-content-dark mb-2">Çiftlik Keşfetme</h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-4">
                Farklı bölgeler ve uzmanlık alanlarından çiftlikleri keşfedin ve bağlantı kurun.
              </p>
              <a href="ciftlik/ciftlik-kesfetme.html" className="text-primary font-medium hover:underline">Keşfet →</a>
            </div>

            {/* Ürün Kataloğu Kartı */}
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">inventory</span>
              </div>
              <h3 className="text-xl font-semibold text-content-light dark:text-content-dark mb-2">Ürün Kataloğu</h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-4">
                Tarımsal ürünler ve atık malzemelerin kapsamlı kataloğu.
              </p>
              <a href="ciftlik/urun-katalogu.html" className="text-primary font-medium hover:underline">Keşfet →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-primary/5 dark:bg-primary/10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-subtle-light dark:text-subtle-dark">Kayıtlı Çiftlik</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-subtle-light dark:text-subtle-dark">Partner Şirket</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-subtle-light dark:text-subtle-dark">Ton İşlenen Atık</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">%95</div>
              <div className="text-subtle-light dark:text-subtle-dark">Kullanıcı Memnuniyeti</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Anasayfa;