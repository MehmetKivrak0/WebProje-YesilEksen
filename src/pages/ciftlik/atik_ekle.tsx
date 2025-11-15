import CftNavbar from '../../components/cftnavbar';
import Footer from '../../components/footer';

function AtikEkle() {
  return (
    <div className="font-display min-h-screen w-full bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark flex flex-col">
      <CftNavbar />
      <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="w-full max-w-6xl space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-content-light dark:text-content-dark mb-3">Atık Kayıt ve Analiz</h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark max-w-2xl mx-auto">Yeni bir atık kaydı oluşturun ve potansiyelini anında analiz edin</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_document</span>
                  Atık Bilgileri
                </h2>
                <form className="space-y-5">
                  <div className="relative">
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                      Atık Türü
                    </label>
                    <select className="form-select w-full h-12 px-4 pl-12 text-base bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-content-light dark:text-content-dark appearance-none transition-all hover:border-primary/50">
                      <option>Atık Türü Seçin</option>
                      <option value="hayvansal">Hayvansal Gübre</option>
                      <option value="bitkisel">Bitkisel Atık</option>
                      <option value="tarimsal">Tarımsal Sanayi Yan Ürünü</option>
                      <option value="diger">Diğer (Manuel Giriş)</option>
                    </select>
                    <span className="material-symbols-outlined absolute left-4 top-[42px] text-subtle-light dark:text-subtle-dark pointer-events-none">category</span>
                    <span className="material-symbols-outlined absolute right-4 top-[42px] text-subtle-light dark:text-subtle-dark pointer-events-none">expand_more</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                      Miktar
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input className="form-input w-full h-12 px-4 pl-12 text-base bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-content-light dark:text-content-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark transition-all hover:border-primary/50" placeholder="Miktar girin" type="number" />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">scale</span>
                      </div>
                      <div className="relative w-32">
                        <select className="form-select h-12 pl-4 pr-10 text-base bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-content-light dark:text-content-dark appearance-none transition-all hover:border-primary/50">
                          <option>ton</option>
                          <option>m³</option>
                          <option>litre</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                      Konum
                    </label>
                    <div className="relative">
                      <input className="form-input w-full h-12 px-4 pl-12 text-base bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-content-light dark:text-content-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark transition-all hover:border-primary/50" placeholder="Konum (Otomatik/Manuel)" />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">location_on</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-3">
                      Belge Yükleme
                    </label>
                    <div className="space-y-4">
                      <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-8 hover:border-primary dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                        </div>
                        <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Laboratuvar Belgesi</p>
                        <p className="text-xs text-subtle-light dark:text-subtle-dark">PDF, JPG veya PNG formatında</p>
                        <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>

                      <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-8 hover:border-primary dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl text-primary">add_a_photo</span>
                        </div>
                        <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Fotoğraf Yükle</p>
                        <p className="text-xs text-subtle-light dark:text-subtle-dark">JPG veya PNG formatında</p>
                        <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" accept=".jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border-light dark:border-border-dark bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-content-light dark:text-content-dark mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Yapay Zeka Analizi
                </h3>

                <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-md mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shrink-0 size-14 shadow-lg">
                        <span className="material-symbols-outlined text-3xl text-white">bolt</span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Enerji Potansiyeli</p>
                        <p className="text-2xl font-bold text-primary dark:text-primary/90">250 m³/ton</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-content-light dark:text-content-dark bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <span>m³/ton</span>
                        <span className="material-symbols-outlined text-base">expand_more</span>
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 overflow-hidden">
                        <a className="block px-4 py-2 text-sm text-content-light dark:text-content-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors" href="#">L/kg</a>
                        <a className="block px-4 py-2 text-sm text-content-light dark:text-content-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors" href="#">kWh/ton</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shrink-0 size-14 shadow-lg">
                      <span className="material-symbols-outlined text-3xl text-white">factory</span>
                    </div>
                    <p className="font-semibold text-lg text-content-light dark:text-content-dark">Kullanım Alanları</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary border border-primary/30 dark:border-primary/40 shadow-sm">Biyogaz</span>
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary border border-primary/30 dark:border-primary/40 shadow-sm">Organik Gübre</span>
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary border border-primary/30 dark:border-primary/40 shadow-sm">Yem Katkısı</span>
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary border border-primary/30 dark:border-primary/40 shadow-sm">Biyoteknoloji</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-yellow-200 dark:border-yellow-800/50 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 p-5 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 dark:bg-yellow-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 animate-pulse">hourglass_top</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Onay Süreci</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">Bilgileriniz inceleniyor ve analiz ediliyor...</p>
                  </div>
                </div>
              </div>

              <button className="w-full group relative overflow-hidden flex items-center justify-center gap-3 rounded-xl h-14 px-6 bg-gradient-to-r from-primary to-primary/90 text-white text-base font-bold hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02]">
                <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">add_circle</span>
                <span>Kayıt Oluştur ve Ürünü Ekle</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Kayıt Sonrası Süreç
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Onay Süreci</p>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Ürününüz admin tarafından incelenecek ve onaylanacaktır. Bu süreç genellikle 1-3 iş günü sürer.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Katalogda Yayınlama</p>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Onay sonrası ürününüz katalogda görünür hale gelecek ve firmalar tarafından görüntülenebilecektir.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Teklif Alma</p>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Firmalar ürününüze teklif verebilecek ve size bildirim gönderilecektir.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-content-light dark:text-content-dark mb-1">Takip ve Yönetim</p>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Ürünlerim sayfasından tüm ürünlerinizi, teklifleri ve satışları takip edebilirsiniz.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-2 text-xs text-subtle-light dark:text-subtle-dark">
                    <span className="material-symbols-outlined text-sm">notifications</span>
                    <span>Onay durumu ve teklifler hakkında bildirimler alacaksınız.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AtikEkle;
