import { Link } from 'react-router-dom';
import Navbar from '../../../components/navbar';

const productSummary = {
  pending: 12,
  approved: 38,
  revision: 5,
};

const farmSummary = {
  newApplications: 7,
  inspections: 4,
  approved: 21,
};

function ZiraatDash() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">
              Ziraat Odası Admin Dashboard
            </h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">
              Çiftçileri ve çiftlik faaliyetlerini yönetin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Ürün Onayları</h2>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Bekleyen ürün başvurularını takip edin</p>
                </div>
                <Link
                  to="/admin/ziraat/urun-onay"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Detaya Git
                  <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Bekleyen</p>
                  <p className="text-2xl font-semibold text-content-light dark:text-content-dark">12</p>
                </div>
                <div className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Onaylanan</p>
                  <p className="text-2xl font-semibold text-content-light dark:text-content-dark">38</p>
                </div>
                <div className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Reddedilen</p>
                  <p className="text-2xl font-semibold text-content-light dark:text-content-dark">5</p>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      <th className="px-4 py-3 text-left">Ürün</th>
                      <th className="px-4 py-3 text-left">Başvuru Sahibi</th>
                      <th className="px-4 py-3 text-left">Durum</th>
                      <th className="px-4 py-3 text-left">Son Güncelleme</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-border-light dark:divide-border-dark">
                    <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">Organik Kompost</td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Anadolu Tarım Kooperatifi</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                          İncelemede
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">2 saat önce</td>
                    </tr>
                    <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">Sıvı Gübre</td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Çukurova Ziraat</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                          Onaylandı
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Dün</td>
                    </tr>
                    <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">Hayvansal Yem</td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Bereket Gıda</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-200">
                          Revizyon
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">3 gün önce</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Çiftlik Onayları</h2>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Yeni çiftlik kayıt taleplerini yönetin</p>
                </div>
                <Link
                  to="/admin/ziraat/ciftlik-onay"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Detaya Git
                  <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Yeni Başvuru</p>
                  <p className="text-2xl font-semibold text-content-light dark:text-content-dark">7</p>
                </div>
                <div className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Denetimde</p>
                  <p className="text-2xl font-semibold text-content-light dark:text-content-dark">4</p>
                </div>
                <div className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Onaylanan</p>
                  <p className="text-2xl font-semibold text-content-light dark:text-content-dark">21</p>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      <th className="px-4 py-3 text-left">Çiftlik</th>
                      <th className="px-4 py-3 text-left">Sahip</th>
                      <th className="px-4 py-3 text-left">Durum</th>
                      <th className="px-4 py-3 text-left">Denetim Tarihi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-border-light dark:divide-border-dark">
                    <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">Lale Bahçesi</td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Hilal Karaca</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                          Denetimde
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">12 Şubat 2024</td>
                    </tr>
                    <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">Göksu Organik</td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Yağız Yıldırım</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                          Onaylandı
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">8 Şubat 2024</td>
                    </tr>
                    <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">Pamukova Tarım</td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Selim Demirtaş</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-200">
                          Evrak Bekliyor
                        </span>
                      </td>
                      <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">Bekleniyor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Bekleyen Ürün Başvurusu</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">{productSummary.pending}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">inventory</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+3 yeni başvuru</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> son 24 saatte</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">İncelemedeki Çiftlik</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                    {farmSummary.newApplications + farmSummary.inspections}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">home</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">%18 yükseliş</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen haftaya göre</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Bu Ay Onaylanan Ürün</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">{productSummary.approved}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">%22 artış</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aya göre</span>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Bu Ay Onaylanan Çiftlik</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">{farmSummary.approved}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">task_alt</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">%15 artış</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçtiğimiz aya göre</span>
              </div>
            </div>
          </div>

          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark mb-8">
            <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-6">Son Aktiviteler</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">agriculture</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Yeni çiftçi kaydı: Mehmet Yılmaz</p>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">2 saat önce</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">update</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Çiftlik bilgileri güncellendi: Güneş Çiftliği</p>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">4 saat önce</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Çiftlik sertifikası onaylandı: Bereket Çiftliği</p>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">6 saat önce</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Kayıtlı Çiftçiler</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">search</span>
                  <input
                    className="pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Çiftçi ara"
                    type="search"
                  />
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Yeni Çiftçi Ekle
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
              <table className="w-full table-auto">
                <thead className="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      Çiftçi Adı
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      Çiftlik Adı
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      Kayıt Tarihi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Mehmet Yılmaz</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Güneş Çiftliği</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">2024-01-15</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                        Aktif
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="text-primary hover:text-primary/80 transition-colors">Düzenle</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Ayşe Demir</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Bereket Çiftliği</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">2024-01-10</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                        Beklemede
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="text-primary hover:text-primary/80 transition-colors">Düzenle</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">Ali Kaya</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">Ege Organik</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">2024-01-05</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                        Aktif
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button className="text-primary hover:text-primary/80 transition-colors">Düzenle</button>
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

export default ZiraatDash;
