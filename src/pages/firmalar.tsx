<<<<<<< HEAD
function Firmalar() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">Firma Portalı</h1>
          <p className="text-lg text-subtle-light dark:text-subtle-dark">Firma işlemlerinizi yönetin</p>
        </div>
        
        <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-4">Firma Bilgileri</h2>
          <p className="text-subtle-light dark:text-subtle-dark">Bu sayfa geliştirilme aşamasındadır.</p>
        </div>
      </div>
=======
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Link } from 'react-router-dom'

function Firmalar() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-background-dark dark:text-background-light">Firmalar</h1>
            <div className="relative rounded-xl overflow-hidden h-96 lg:h-[calc(100vh-200px)] shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDV1QlBxRl9bhxtMQBzOMGyuaE_ylM__V26qSvD186fQd3iSjTFkXkTKTsciVRWGzQGNaUOegtEIlRQfXorUX2j8FHgkre6gRd5-ESWGHXzsf0ypWmuOcQLS5MM1YinSqNBIQCLwZAe4P1rUkPVOyr0PfEz2Dz6lFfF2GoW_JKooq2xpjpoR-6aWX2EI70g_0Op3gJQ8cinnNwI-9_QI4e1jD5yKxssjouPAQCM7p6A5c8c69LKKJcBh0T4ZFiHAjrI5F-dT7OHE9E")',
                }}
              ></div>
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-background-dark/50">search</span>
                  <input
                    className="form-input w-full pl-10 pr-4 py-2.5 rounded-lg border-none bg-background-light/90 dark:bg-background-dark/80 text-background-dark dark:text-background-light placeholder:text-background-dark/50 dark:placeholder:text-background-light/50 focus:ring-2 focus:ring-primary"
                    placeholder="Konum ara"
                    type="text"
                  />
                </div>
                <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-background-dark dark:text-background-light">BioEnerji A.Ş.</h3>
                      <p className="text-sm text-background-dark/70 dark:text-background-light/70">Çankaya, Ankara</p>
                    </div>
                    <button className="text-background-dark/60 dark:text-background-light/60 hover:text-primary dark:hover:text-primary">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">phone</span>
                      <span className="text-sm text-background-dark dark:text-background-light">+90 312 123 45 67</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">mail</span>
                      <span className="text-sm text-background-dark dark:text-background-light">info@bioenerji.com.tr</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">verified</span>
                      <span className="text-sm font-medium text-primary">Doğrulanmış Firma</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-background-dark dark:text-background-light mb-2">Satın Alım Geçmişi</h4>
                      <div className="border-t border-primary/20 dark:border-primary/30 pt-2 space-y-2 text-sm max-h-32 overflow-y-auto">
                        <div className="flex justify-between">
                          <span className="text-background-dark/80 dark:text-background-light/80">Mısır Sapı - 10 Ton</span>
                          <span className="text-background-dark/60 dark:text-background-light/60">15.03.2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-background-dark/80 dark:text-background-light/80">Buğday Samanı - 20 Ton</span>
                          <span className="text-background-dark/60 dark:text-background-light/60">02.02.2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-background-dark/80 dark:text-background-light/80">Ayçiçeği Sapı - 5 Ton</span>
                          <span className="text-background-dark/60 dark:text-background-light/60">10.12.2023</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-background-dark dark:text-background-light">Kayıtlı Firmalar</h2>
              <Link to="/firma/ekle" className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined">add</span>
                <span className="truncate">Yeni Firma Ekle</span>
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-background-dark/40 dark:text-background-light/40">search</span>
              <input
                className="form-input w-full pl-10 pr-4 py-2.5 rounded-lg border-primary/20 dark:border-primary/10 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary text-background-dark dark:text-background-light placeholder:text-background-dark/40 dark:placeholder:text-background-light/40"
                placeholder="Firma ara"
                type="text"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-lg bg-primary/20 dark:bg-primary/30 hover:bg-primary/30 dark:hover:bg-primary/40 px-3 transition-colors">
                <p className="text-background-dark dark:text-background-light text-sm font-medium">Sektör</p>
                <span className="material-symbols-outlined text-background-dark dark:text-background-light text-base">expand_more</span>
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-lg bg-primary/20 dark:bg-primary/30 hover:bg-primary/30 dark:hover:bg-primary/40 px-3 transition-colors">
                <p className="text-background-dark dark:text-background-light text-sm font-medium">Konum</p>
                <span className="material-symbols-outlined text-background-dark dark:text-background-light text-base">expand_more</span>
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-lg bg-primary/20 dark:bg-primary/30 hover:bg-primary/30 dark:hover:bg-primary/40 px-3 transition-colors">
                <p className="text-background-dark dark:text-background-light text-sm font-medium">Sertifikalar</p>
                <span className="material-symbols-outlined text-background-dark dark:text-background-light text-base">expand_more</span>
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-primary/20 dark:border-primary/10 bg-background-light dark:bg-background-dark/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-background-dark/70 dark:text-background-light/70 uppercase bg-primary/10 dark:bg-primary/20">
                  <tr>
                    <th className="px-6 py-3 font-semibold" scope="col">Firma Adı</th>
                    <th className="px-6 py-3 font-semibold" scope="col">Sektör</th>
                    <th className="px-6 py-3 font-semibold" scope="col">Konum</th>
                    <th className="px-6 py-3 text-center font-semibold" scope="col">Doğrulanmış</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary/10 dark:border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer">
                    <th className="px-6 py-4 font-medium text-background-dark dark:text-background-light whitespace-nowrap" scope="row">BioEnerji A.Ş.</th>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Enerji</td>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Ankara</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-md border-primary/30 bg-background-light dark:bg-background-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10 dark:border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer">
                    <th className="px-6 py-4 font-medium text-background-dark dark:text-background-light whitespace-nowrap" scope="row">Organik Gübre Sanayi</th>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Tarım</td>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">İzmir</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-md border-primary/30 bg-background-light dark:bg-background-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10 dark:border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer">
                    <th className="px-6 py-4 font-medium text-background-dark dark:text-background-light whitespace-nowrap" scope="row">Sönmez Tekstil</th>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Tekstil</td>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Bursa</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-md border-primary/30 bg-background-light dark:bg-background-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10 dark:border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer">
                    <th className="px-6 py-4 font-medium text-background-dark dark:text-background-light whitespace-nowrap" scope="row">Yeşil Yakıtlar Ltd.</th>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Enerji</td>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Adana</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-md border-primary/30 bg-background-light dark:bg-background-dark flex items-center justify-center"></div>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer">
                    <th className="px-6 py-4 font-medium text-background-dark dark:text-background-light whitespace-nowrap" scope="row">Doğa Tarım Ürünleri</th>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Tarım</td>
                    <td className="px-6 py-4 text-background-dark/80 dark:text-background-light/80">Antalya</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-md border-primary/30 bg-background-light dark:bg-background-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
>>>>>>> 336abe6 (firma, çiftlik ve atik sayfaları eklendi)
    </div>
  );
}

export default Firmalar;
