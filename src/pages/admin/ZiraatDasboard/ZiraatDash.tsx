import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ZrtnNavbar from '../../../components/zrtnavbar';

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

type ActivityType = 'kayit' | 'guncelleme' | 'onay' | 'denetim';

type Activity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
};

const activityTypeMeta: Record<ActivityType, { label: string; icon: string; badgeClass: string; bubbleClass: string; iconClass: string }> = {
  kayit: {
    label: 'Kayıt',
    icon: 'person_add',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200',
    bubbleClass: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconClass: 'text-emerald-600 dark:text-emerald-300',
  },
  guncelleme: {
    label: 'Güncelleme',
    icon: 'update',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-200',
    bubbleClass: 'bg-amber-100 dark:bg-amber-900/40',
    iconClass: 'text-amber-600 dark:text-amber-300',
  },
  onay: {
    label: 'Onay',
    icon: 'verified',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-200',
    bubbleClass: 'bg-green-100 dark:bg-green-900/40',
    iconClass: 'text-green-600 dark:text-green-300',
  },
  denetim: {
    label: 'Denetim',
    icon: 'assignment',
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/70 dark:text-sky-200',
    bubbleClass: 'bg-sky-100 dark:bg-sky-900/40',
    iconClass: 'text-sky-600 dark:text-sky-300',
  },
};

const activityLog: Activity[] = [
  {
    id: 'activity-1',
    title: 'Yeni çiftçi kaydı oluşturuldu',
    description: 'Mehmet Yılmaz sisteme eklendi ve temel bilgiler tamamlandı.',
    timestamp: '2 saat önce',
    type: 'kayit',
  },
  {
    id: 'activity-2',
    title: 'Çiftlik bilgileri güncellendi',
    description: 'Güneş Çiftliği arazi bilgileri ve üretim kapasitesi güncellendi.',
    timestamp: '4 saat önce',
    type: 'guncelleme',
  },
  {
    id: 'activity-3',
    title: 'Çiftlik sertifikası onaylandı',
    description: 'Bereket Çiftliği için organik sertifika süreci tamamlandı.',
    timestamp: '6 saat önce',
    type: 'onay',
  },
  {
    id: 'activity-4',
    title: 'Denetim raporu planlandı',
    description: 'Lale Bahçesi için saha ziyareti ve raporlama takvimi oluşturuldu.',
    timestamp: 'Dün',
    type: 'denetim',
  },
];

type ActivityFilter = 'hepsi' | ActivityType;

const activityFilters: Array<{ value: ActivityFilter; label: string }> = [
  { value: 'hepsi', label: 'Hepsi' },
  { value: 'kayit', label: 'Kayıt' },
  { value: 'guncelleme', label: 'Güncelleme' },
  { value: 'onay', label: 'Onay' },
  { value: 'denetim', label: 'Denetim' },
];

type FarmerStatusLabel = 'Aktif' | 'Beklemede';

type RegisteredFarmer = {
  id: string;
  name: string;
  farm: string;
  registrationDate: string;
  status: FarmerStatusLabel;
  detailPath: string;
};

const farmerStatusStyles: Record<FarmerStatusLabel, string> = {
  Aktif: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  Beklemede: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
};

const registeredFarmers: RegisteredFarmer[] = [
  {
    id: 'farmer-1',
    name: 'Mehmet Yılmaz',
    farm: 'Güneş Çiftliği',
    registrationDate: '2024-01-15',
    status: 'Aktif',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-1',
  },
  {
    id: 'farmer-2',
    name: 'Ayşe Demir',
    farm: 'Bereket Çiftliği',
    registrationDate: '2024-01-10',
    status: 'Beklemede',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-2',
  },
  {
    id: 'farmer-3',
    name: 'Ali Kaya',
    farm: 'Ege Organik',
    registrationDate: '2024-01-05',
    status: 'Aktif',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-3',
  },
  {
    id: 'farmer-4',
    name: 'Selin Acar',
    farm: 'Anadolu Hasat',
    registrationDate: '2024-01-02',
    status: 'Aktif',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-4',
  },
  {
    id: 'farmer-5',
    name: 'Burak Öztürk',
    farm: 'Yeşil Vadi',
    registrationDate: '2023-12-28',
    status: 'Beklemede',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-5',
  },
  {
    id: 'farmer-6',
    name: 'Elif Şahin',
    farm: 'Doğa Tarım',
    registrationDate: '2023-12-15',
    status: 'Aktif',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-6',
  },
  {
    id: 'farmer-7',
    name: 'Murat Kılıç',
    farm: 'Bereket Bahçesi',
    registrationDate: '2023-12-10',
    status: 'Aktif',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-7',
  },
  {
    id: 'farmer-8',
    name: 'Zeynep Uçar',
    farm: 'Anka Organik',
    registrationDate: '2023-12-05',
    status: 'Beklemede',
    detailPath: '/admin/ziraat/ciftlik-detay/farmer-8',
  },
];

type ProductStatusLabel = 'Stokta' | 'İncelemede' | 'Tükendi';

type DashboardProduct = {
  id: string;
  name: string;
  producer: string;
  status: ProductStatusLabel;
  lastUpdate: string;
};

const productStatusStyles: Record<ProductStatusLabel, string> = {
  Stokta: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  İncelemede: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  Tükendi: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
};

const dashboardProducts: DashboardProduct[] = [
  {
    id: 'product-1',
    name: 'Organik Kompost',
    producer: 'Anadolu Tarım Kooperatifi',
    status: 'İncelemede',
    lastUpdate: '2 saat önce',
  },
  {
    id: 'product-2',
    name: 'Sıvı Gübre',
    producer: 'Çukurova Ziraat',
    status: 'Stokta',
    lastUpdate: 'Dün',
  },
  {
    id: 'product-3',
    name: 'Hayvansal Yem',
    producer: 'Bereket Gıda',
    status: 'Tükendi',
    lastUpdate: '3 gün önce',
  },
];

function ZiraatDash() {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('hepsi');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [farmerPage, setFarmerPage] = useState(1);

  const filteredActivities =
    activityFilter === 'hepsi'
      ? activityLog
      : activityLog.filter((activity) => activity.type === activityFilter);

  const farmersPerPage = 5;
  const normalizedSearch = farmerSearch.trim().toLowerCase();
  const filteredFarmers = registeredFarmers.filter((farmer) => {
    if (!normalizedSearch) {
      return true;
    }
    return (
      farmer.name.toLowerCase().includes(normalizedSearch) ||
      farmer.farm.toLowerCase().includes(normalizedSearch) ||
      farmer.status.toLowerCase().includes(normalizedSearch)
    );
  });
  const totalFarmerPages = Math.max(1, Math.ceil(filteredFarmers.length / farmersPerPage));

  useEffect(() => {
    setFarmerPage((prev) => {
      if (prev < 1) {
        return 1;
      }
      if (prev > totalFarmerPages) {
        return totalFarmerPages;
      }
      return prev;
    });
  }, [totalFarmerPages]);

  const currentFarmerPage = Math.min(Math.max(farmerPage, 1), totalFarmerPages);
  const farmerRangeStart =
    filteredFarmers.length === 0 ? 0 : (currentFarmerPage - 1) * farmersPerPage + 1;
  const farmerRangeEnd =
    filteredFarmers.length === 0
      ? 0
      : Math.min(currentFarmerPage * farmersPerPage, filteredFarmers.length);
  const paginatedFarmers = filteredFarmers.slice(
    (currentFarmerPage - 1) * farmersPerPage,
    currentFarmerPage * farmersPerPage,
  );

  const normalizedProductSearch = productSearch.trim().toLowerCase();
  const filteredProducts = dashboardProducts.filter((product) => {
    if (!normalizedProductSearch) {
      return true;
    }
    return (
      product.name.toLowerCase().includes(normalizedProductSearch) ||
      product.producer.toLowerCase().includes(normalizedProductSearch) ||
      product.status.toLowerCase().includes(normalizedProductSearch)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <ZrtnNavbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">
                Ziraat Odası Admin Dashboard
              </h1>
              <p className="text-lg text-subtle-light dark:text-subtle-dark">
                Çiftçileri ve çiftlik faaliyetlerini yönetin
              </p>
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
              <div className="rounded-lg border border-border-light dark:border-border-dark">
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
              <div className="rounded-lg border border-border-light dark:border-border-dark">
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

          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark mb-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Son Aktiviteler</h2>
              <div className="flex flex-wrap gap-2">
                {activityFilters.map((filter) => {
                  const isActive = activityFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setActivityFilter(filter.value)}
                      aria-pressed={isActive}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-border-light text-subtle-light hover:bg-primary/10 dark:border-border-dark dark:text-subtle-dark dark:hover:bg-primary/20'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => {
                  const meta = activityTypeMeta[activity.type];
                  return (
                    <div
                      key={activity.id}
                      className="flex flex-col gap-3 rounded-lg border border-border-light p-4 transition-colors hover:border-primary/40 dark:border-border-dark dark:hover:border-primary/40 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.bubbleClass}`}>
                          <span className={`material-symbols-outlined text-lg ${meta.iconClass}`}>{meta.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content-light dark:text-content-dark">{activity.title}</p>
                          <p className="text-xs text-subtle-light dark:text-subtle-dark">{activity.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-1">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                        <span className="text-xs text-subtle-light dark:text-subtle-dark">{activity.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg border border-dashed border-border-light p-6 text-center text-sm text-subtle-light dark:border-border-dark dark:text-subtle-dark">
                  Bu filtre için aktivite bulunmuyor.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Kayıtlı Çiftçiler</h2>
                <div className="relative w-full sm:max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Çiftçi ara"
                    type="search"
                    value={farmerSearch}
                    onChange={(event) => {
                      setFarmerSearch(event.target.value);
                      setFarmerPage(1);
                    }}
                  />
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
                    {paginatedFarmers.map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-primary/5 dark:hover:bg-primary/10">
                        <td className="px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">
                          {farmer.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">{farmer.farm}</td>
                        <td className="px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">
                          {farmer.registrationDate}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${farmerStatusStyles[farmer.status]}`}
                          >
                            {farmer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            to={farmer.detailPath}
                            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                          >
                            İncele
                            <span className="material-symbols-outlined text-sm leading-none">open_in_new</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {paginatedFarmers.length === 0 && (
                      <tr className="bg-background-light dark:bg-background-dark">
                        <td
                          className="px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark"
                          colSpan={5}
                        >
                          Aradığınız kriterlere uygun kayıtlı çiftçi bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-subtle-light dark:text-subtle-dark">
                  {filteredFarmers.length === 0
                    ? 'Gösterilecek çiftçi bulunamadı'
                    : `${farmerRangeStart}-${farmerRangeEnd} / ${filteredFarmers.length} kayıt gösteriliyor`}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFarmerPage((prev) => Math.max(prev - 1, 1))}
                    disabled={filteredFarmers.length === 0 || currentFarmerPage === 1}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      filteredFarmers.length === 0 || currentFarmerPage === 1
                        ? 'cursor-not-allowed border-border-light text-subtle-light dark:border-border-dark dark:text-subtle-dark'
                        : 'border-primary/30 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary-light dark:hover:bg-primary/20'
                    }`}
                  >
                    Önceki
                  </button>
                  <span className="text-xs text-subtle-light dark:text-subtle-dark">
                    Sayfa {filteredFarmers.length === 0 ? 0 : currentFarmerPage} /{' '}
                    {filteredFarmers.length === 0 ? 0 : totalFarmerPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFarmerPage((prev) => Math.min(prev + 1, totalFarmerPages))
                    }
                    disabled={
                      filteredFarmers.length === 0 || currentFarmerPage === totalFarmerPages
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      filteredFarmers.length === 0 || currentFarmerPage === totalFarmerPages
                        ? 'cursor-not-allowed border-border-light text-subtle-light dark:border-border-dark dark:text-subtle-dark'
                        : 'border-primary/30 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary-light dark:hover:bg-primary/20'
                    }`}
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Ürünler</h2>
                <div className="relative w-full sm:max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ürün ara"
                    type="search"
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border-light dark:border-border-dark">
                <table className="w-full table-auto">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                        Ürün
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                        Üretici
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                        Durum
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                        Son Güncelleme
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-primary/5 dark:hover:bg-primary/10">
                        <td className="px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">
                          {product.producer}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${productStatusStyles[product.status]}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">
                          {product.lastUpdate}
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr className="bg-background-light dark:bg-background-dark">
                        <td
                          className="px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark"
                          colSpan={4}
                        >
                          Aradığınız kriterlere uygun ürün kaydı bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ZiraatDash;
