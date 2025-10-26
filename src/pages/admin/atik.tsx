
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';

function Atik() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">Atık Kataloğu (Ziraat Odası)</h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">Tarımsal atık kataloğunu ve ürünleri yönetin</p>
          </div>

          {/* Dashboard Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Toplam Ürün</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">156</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">inventory</span>
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
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Aktif Ürün</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">142</p>
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
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Atık Türü</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">24</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">category</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%5</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Toplam Miktar</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">2.4K</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">scale</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%18</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>
          </div>

          {/* Atık Kataloğu */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Atık Kataloğu</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">search</span>
                  <input className="pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Ürün ara" type="search"/>
                </div>
                <select className="p-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                  <option>Tüm Kategoriler</option>
                  <option>Hayvansal Atık</option>
                  <option>Bitkisel Atık</option>
                  <option>Gıda Atığı</option>
                </select>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Yeni Ürün Ekle
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
              <table className="w-full table-auto">
                <thead className="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Ürün Adı</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Miktar</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Fiyat</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Durum</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Buğday Sapı</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Bitkisel Atık</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">10 Ton</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">₺25/Ton</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">Aktif</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors mr-3 px-3 py-1 rounded">Düzenle</button>
                      <button className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors px-3 py-1 rounded">Sil</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Sığır Gübresi</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Hayvansal Atık</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">5 Ton</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">₺15/Ton</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">Aktif</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors mr-3 px-3 py-1 rounded">Düzenle</button>
                      <button className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors px-3 py-1 rounded">Sil</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Mısır Koçanı</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Bitkisel Atık</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">8 Ton</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">₺20/Ton</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">Beklemede</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors mr-3 px-3 py-1 rounded">Düzenle</button>
                      <button className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors px-3 py-1 rounded">Sil</button>
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

export default Atik;