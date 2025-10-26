import Navbar from '../../components/navbar';

function DasSanayi() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">Sanayi Odası Admin Dashboard</h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">Sanayi odası üyelerini ve faaliyetlerini yönetin</p>
          </div>

          {/* Dashboard Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Toplam Üye</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">342</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">business</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%8</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Aktif Şirketler</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">298</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%12</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">İşlemler</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">1,247</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%23</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Gelir</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">₺1.8M</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">attach_money</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%15</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>
          </div>

          {/* Son Aktiviteler */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark mb-8">
            <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-6">Son Aktiviteler</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">business</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Yeni şirket kaydı: Teknoloji A.Ş.</p>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">2 saat önce</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">update</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Şirket bilgileri güncellendi: Gıda Sanayi Ltd.</p>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">4 saat önce</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Şirket doğrulaması tamamlandı: Tarım Teknolojileri A.Ş.</p>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">6 saat önce</p>
                </div>
              </div>
            </div>
          </div>

          {/* Üye Şirketler Listesi */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Üye Şirketler</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">search</span>
                  <input className="pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Şirket ara" type="search"/>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Yeni Üye Ekle
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
              <table className="w-full table-auto">
                <thead className="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Şirket Adı</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Sektör</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Üyelik Tarihi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Durum</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Teknoloji A.Ş.</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Bilgi Teknolojileri</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">2024-01-15</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">Aktif</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors px-3 py-1 rounded">Düzenle</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Gıda Sanayi Ltd.</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Gıda İşleme</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">2024-01-10</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">Beklemede</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors px-3 py-1 rounded">Düzenle</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Tarım Teknolojileri A.Ş.</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Tarım Teknolojisi</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">2024-01-05</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">Aktif</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors px-3 py-1 rounded">Düzenle</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DasSanayi;