import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function AtikEkle() {
  return (
    <div className="font-display min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 flex flex-col">
      <Navbar />
      <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">Atık Kayıt ve Analiz</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Yeni bir atık kaydı oluşturun ve potansiyelini anında analiz edin.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form className="space-y-6">
              <div className="relative">
                <select className="form-select w-full h-12 px-4 text-base bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary appearance-none">
                  <option>Atık Türü Seçin</option>
                  <option value="hayvansal">Hayvansal Gübre</option>
                  <option value="bitkisel">Bitkisel Atık</option>
                  <option value="tarimsal">Tarımsal Sanayi Yan Ürünü</option>
                  <option value="diger">Diğer (Manuel Giriş)</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">expand_more</span>
              </div>

              <div className="flex items-center gap-2">
                <input className="form-input w-full h-12 px-4 text-base bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary" placeholder="Miktar" type="number" />
                <div className="relative">
                  <select className="form-select h-12 pl-4 pr-10 text-base bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary appearance-none">
                    <option>ton</option>
                    <option>m³</option>
                    <option>litre</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              <label className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">upload_file</span>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Laboratuvar Belgesi Yükle (PDF/JPG/PNG)</p>
                <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
              </label>

              <label className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">add_a_photo</span>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Fotoğraf Yükle</p>
                <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
              </label>

              <div className="relative">
                <input className="form-input w-full h-12 px-4 pl-12 text-base bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary" placeholder="Konum (Otomatik/Manuel)" />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">location_on</span>
              </div>
            </form>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yapay Zeka Analizi</h3>

              <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0 size-12 text-primary">
                      <span className="material-symbols-outlined text-3xl">bolt</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Enerji Potansiyeli</p>
                      <p className="text-lg font-bold text-primary dark:text-primary/90">250 m³/ton</p>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <span>m³/ton</span>
                      <span className="material-symbols-outlined text-base">expand_more</span>
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
                      <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">L/kg</a>
                      <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">kWh/ton</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0 size-12 text-primary">
                    <span className="material-symbols-outlined text-3xl">factory</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Kullanım Alanları</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary-800 dark:bg-primary/20 dark:text-primary-300">Biyogaz</span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary-800 dark:bg-primary/20 dark:text-primary-300">Organik Gübre</span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary-800 dark:bg-primary/20 dark:text-primary-300">Yem Katkısı</span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary-800 dark:bg-primary/20 dark:text-primary-300">Biyoteknoloji</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg">
                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">hourglass_top</span>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">Onay Süreci: Bilgileriniz inceleniyor...</p>
              </div>

              <button className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Kaydı Tamamla ve Analiz Et
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AtikEkle;
