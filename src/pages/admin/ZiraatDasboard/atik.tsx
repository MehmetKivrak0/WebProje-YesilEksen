
import { Link } from 'react-router-dom';
import Navbar from '../../../components/navbar';

const productRows = [
  {
    name: 'Organik Zeytinyağı',
    category: 'Gıda',
    supplier: 'Güney Ege Zeytincilik',
    price: '₺320 / 1L',
    status: 'Aktif',
  },
  {
    name: 'Doğal Bal',
    category: 'Gıda',
    supplier: 'Anadolu Arıcılık',
    price: '₺250 / 850g',
    status: 'Aktif',
  },
  {
    name: 'Taze Keçi Peyniri',
    category: 'Süt Ürünleri',
    supplier: 'Akdeniz Çiftliği',
    price: '₺180 / 500g',
    status: 'Beklemede',
  },
  {
    name: 'Lavanta Sabunu',
    category: 'Kişisel Bakım',
    supplier: 'Ege Bitki Atölyesi',
    price: '₺55 / Adet',
    status: 'Aktif',
  },
  {
    name: 'Doğal Yün İpliği',
    category: 'El Sanatları',
    supplier: 'Anadolu Tekstil',
    price: '₺120 / 100g',
    status: 'Taslak',
  },
];

function Atik() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-content-light dark:text-content-dark">Ürün Yönetimi</h1>
              <p className="text-lg text-subtle-light dark:text-subtle-dark">
                Kırsal üreticilerden gelen sürdürülebilir ürünleri yönetin, kataloglayın ve güncel tutun.
              </p>
            </div>
            <Link
              to="/atiklar/ekle"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Yeni Ürün Ekle
            </Link>
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
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Ürün Kategorisi</p>
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
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Aylık Sipariş</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">2.4K</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%18</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>
          </div>

          {/* Ürün Listesi */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Ürün Kataloğu</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">search</span>
                  <input className="pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Ürün ara" type="search"/>
                </div>
                <select className="p-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                  <option>Tüm Kategoriler</option>
                  <option>Gıda</option>
                  <option>Süt Ürünleri</option>
                  <option>Kişisel Bakım</option>
                  <option>El Sanatları</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
              <table className="w-full table-auto">
                <thead className="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Ürün Adı</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Tedarikçi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Fiyat</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Durum</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {productRows.map((row) => (
                    <tr key={row.name} className="hover:bg-primary/5 dark:hover:bg-primary/10">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">{row.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">{row.category}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">{row.supplier}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">{row.price}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {row.status === 'Aktif' && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            Aktif
                          </span>
                        )}
                        {row.status === 'Beklemede' && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Beklemede
                          </span>
                        )}
                        {row.status === 'Taslak' && (
                          <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            Taslak
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button className="mr-3 rounded border border-primary px-3 py-1 text-primary transition-colors hover:bg-primary hover:text-white">
                          Düzenle
                        </button>
                        <button className="rounded border border-red-600 px-3 py-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white">
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
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