import { useState } from 'react';
import { Link } from 'react-router-dom';
import ZrtnNavbar from '../../../../components/zrtnavbar';
import SummaryCards from './components/SummaryCards';
import ActivityFeed from './components/ActivityFeed';
import RegisteredFarmersTable from './components/RegisteredFarmersTable';
import ProductsTable from './components/ProductsTable';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import { useDashboardFilters } from './hooks/useDashboardFilters';
import { productSummary } from './data/productSummary';
import { farmSummary } from './data/farmSummary';
import { activityLog } from './data/activityLog';
import { registeredFarmers } from './data/registeredFarmers';
import { dashboardProducts } from './data/dashboardProducts';

function DashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const {
    activityFilter,
    setActivityFilter,
    farmerSearch,
    setFarmerSearch,
    productSearch,
    setProductSearch,
    farmerPage,
    totalFarmerPages,
    filteredFarmers,
    paginatedFarmers,
    farmerRange,
    filteredProducts,
    goToPreviousFarmerPage,
    goToNextFarmerPage,
    setFarmerPage,
  } = useDashboardFilters({
    farmers: registeredFarmers,
    products: dashboardProducts,
  });

  const filteredActivities =
    activityFilter === 'hepsi'
      ? activityLog
      : activityLog.filter((activity) => activity.type === activityFilter);

  const productApprovalStats = [
    { label: 'Bekleyen', value: productSummary.pending },
    { label: 'Onaylanan', value: productSummary.approved },
    { label: 'Reddedilen', value: productSummary.revision },
  ];

  const productApprovalRows = [
    {
      name: 'Organik Kompost',
      applicant: 'Anadolu Tarım Kooperatifi',
      status: 'İncelemede',
      statusClass:
        'inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      lastUpdate: '2 saat önce',
      applicationNumber: 'P-1024',
      sector: 'Yenilenebilir Enerji',
      establishmentYear: 2015,
      employeeCount: '50-100',
      email: 'info@ekoenerji.com',
      applicationDate: '2024-02-12',
      taxNumber: '1234567890',
      description: 'Laboratuvar sonuçları bekleniyor.',
      documents: [
        { name: 'Vergi Levhası' },
        { name: 'İmza Sirküleri' },
      ],
    },
    {
      name: 'Sıvı Gübre',
      applicant: 'Çukurova Ziraat',
      status: 'Onaylandı',
      statusClass:
        'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200',
      lastUpdate: 'Dün',
      applicationNumber: 'P-1025',
      sector: 'Tarım',
      establishmentYear: 2018,
      employeeCount: '25-50',
      email: 'info@cukurovaziraat.com',
      applicationDate: '2024-02-10',
      taxNumber: '9876543210',
      description: 'Başvuru onaylandı.',
      documents: [
        { name: 'Vergi Levhası' },
        { name: 'İmza Sirküleri' },
        { name: 'Ürün Analiz Raporu' },
      ],
    },
    {
      name: 'Hayvansal Yem',
      applicant: 'Bereket Gıda',
      status: 'Revizyon',
      statusClass:
        'inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-200',
      lastUpdate: '3 gün önce',
      applicationNumber: 'P-1026',
      sector: 'Hayvancılık',
      establishmentYear: 2020,
      employeeCount: '10-25',
      email: 'info@bereketgida.com',
      applicationDate: '2024-02-08',
      taxNumber: '5555555555',
      description: 'Eksik belgeler tamamlanmalı.',
      documents: [
        { name: 'Vergi Levhası' },
      ],
    },
  ];

  const farmApprovalStats = [
    { label: 'Yeni Başvuru', value: farmSummary.newApplications },
    { label: 'Denetimde', value: farmSummary.inspections },
    { label: 'Onaylanan', value: farmSummary.approved },
  ];

  const farmApprovalRows = [
    {
      name: 'Lale Bahçesi',
      owner: 'Hilal Karaca',
      status: 'Denetimde',
      statusClass:
        'inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      inspectionDate: '12 Şubat 2024',
      applicationNumber: 'C-2001',
      sector: 'Organik Tarım',
      establishmentYear: 2019,
      employeeCount: '5-10',
      email: 'info@lalebahcesi.com',
      applicationDate: '2024-02-01',
      taxNumber: '1111111111',
      description: 'Denetim süreci devam ediyor.',
      documents: [
        { name: 'Vergi Levhası' },
        { name: 'Çiftlik Ruhsatı' },
      ],
    },
    {
      name: 'Göksu Organik',
      owner: 'Yağız Yıldırım',
      status: 'Onaylandı',
      statusClass:
        'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200',
      inspectionDate: '8 Şubat 2024',
      applicationNumber: 'C-2002',
      sector: 'Organik Tarım',
      establishmentYear: 2017,
      employeeCount: '15-25',
      email: 'info@goksuorganik.com',
      applicationDate: '2024-01-28',
      taxNumber: '2222222222',
      description: 'Çiftlik onaylandı.',
      documents: [
        { name: 'Vergi Levhası' },
        { name: 'Çiftlik Ruhsatı' },
        { name: 'Organik Sertifika' },
      ],
    },
    {
      name: 'Pamukova Tarım',
      owner: 'Selim Demirtaş',
      status: 'Evrak Bekliyor',
      statusClass:
        'inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-200',
      inspectionDate: 'Bekleniyor',
      applicationNumber: 'C-2003',
      sector: 'Tarım',
      establishmentYear: 2021,
      employeeCount: '3-5',
      email: 'info@pamukovatarim.com',
      applicationDate: '2024-02-05',
      taxNumber: '3333333333',
      description: 'Eksik evraklar tamamlanmalı.',
      documents: [
        { name: 'Vergi Levhası' },
      ],
    },
  ];

  const handleProductRowClick = (row: any) => {
    setSelectedProduct(row);
    setIsProductModalOpen(true);
  };

  const handleFarmRowClick = (row: any) => {
    setSelectedFarm(row);
    setIsFarmModalOpen(true);
  };

  const handleApprove = () => {
    // Onaylama işlemi burada yapılacak
    console.log('Onaylandı:', selectedProduct || selectedFarm);
    setIsProductModalOpen(false);
    setIsFarmModalOpen(false);
  };

  const handleReject = () => {
    // Reddetme işlemi burada yapılacak
    console.log('Reddedildi:', selectedProduct || selectedFarm);
    setIsProductModalOpen(false);
    setIsFarmModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-content-light dark:bg-background-dark dark:text-content-dark">
      <ZrtnNavbar />

      <main className="flex-grow">
        <div className="container mx-auto flex flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header id="overview" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-content-light dark:text-content-dark">
                Ziraat Odası Admin Dashboard
              </h1>
              <p className="text-lg text-subtle-light dark:text-subtle-dark">
                Çiftçileri ve çiftlik faaliyetlerini yönetin
              </p>
            </div>
          </header>

          <SummaryCards productSummary={productSummary} farmSummary={farmSummary} />

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div id="product-approvals" className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Ürün Onayları</h2>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    Bekleyen ürün başvurularını takip edin
                  </p>
                </div>
                <Link
                  to="/admin/ziraat/urun-onay"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Detaya Git
                  <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
                </Link>
              </div>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {productApprovalStats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-border-light p-4 dark:border-border-dark">
                    <p className="mb-1 text-xs uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      {item.label}
                    </p>
                    <p className="text-2xl font-semibold text-content-light dark:text-content-dark">{item.value}</p>
                  </div>
                ))}
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
                  <tbody className="divide-y divide-border-light text-sm dark:divide-border-dark">
                    {productApprovalRows.map((row) => (
                      <tr
                        key={row.name}
                        onClick={() => handleProductRowClick(row)}
                        className="cursor-pointer transition-colors hover:bg-primary/5 dark:hover:bg-primary/10"
                      >
                        <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">{row.name}</td>
                        <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">{row.applicant}</td>
                        <td className="px-4 py-3">
                          <span className={row.statusClass}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">{row.lastUpdate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="farm-approvals" className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Çiftlik Onayları</h2>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    Yeni çiftlik kayıt taleplerini yönetin
                  </p>
                </div>
                <Link
                  to="/admin/ziraat/ciftlik-onay"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Detaya Git
                  <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
                </Link>
              </div>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {farmApprovalStats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-border-light p-4 dark:border-border-dark">
                    <p className="mb-1 text-xs uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      {item.label}
                    </p>
                    <p className="text-2xl font-semibold text-content-light dark:text-content-dark">{item.value}</p>
                  </div>
                ))}
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
                  <tbody className="divide-y divide-border-light text-sm dark:divide-border-dark">
                    {farmApprovalRows.map((row) => (
                      <tr
                        key={row.name}
                        onClick={() => handleFarmRowClick(row)}
                        className="cursor-pointer transition-colors hover:bg-primary/5 dark:hover:bg-primary/10"
                      >
                        <td className="px-4 py-3 font-medium text-content-light dark:text-content-dark">{row.name}</td>
                        <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">{row.owner}</td>
                        <td className="px-4 py-3">
                          <span className={row.statusClass}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3 text-subtle-light dark:text-subtle-dark">{row.inspectionDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <ActivityFeed
            activities={filteredActivities}
            activeFilter={activityFilter}
            onFilterChange={setActivityFilter}
          />

          <section id="farm-management" className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RegisteredFarmersTable
              farmers={paginatedFarmers}
              filteredTotal={filteredFarmers.length}
              rangeStart={farmerRange.start}
              rangeEnd={farmerRange.end}
              currentPage={farmerPage}
              totalPages={totalFarmerPages}
              search={farmerSearch}
              onSearchChange={setFarmerSearch}
              onPageChange={setFarmerPage}
              onPreviousPage={goToPreviousFarmerPage}
              onNextPage={goToNextFarmerPage}
            />
            <ProductsTable
              products={filteredProducts}
              search={productSearch}
              onSearchChange={setProductSearch}
            />
          </section>

          <section id="reports" className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Raporlar</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  Detaylı analiz ve raporlara erişin
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                to="/admin/ziraat/raporlar/genel"
                className="group flex items-center gap-4 rounded-lg border border-border-light bg-background-light p-6 transition-all hover:border-primary hover:bg-primary/5 dark:border-border-dark dark:bg-background-dark dark:hover:bg-primary/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                    assessment
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-content-light dark:text-content-dark">
                    Genel Rapor
                  </h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    Başvurular, onaylar, trendler ve kapsamlı istatistikler
                  </p>
                </div>
                <span className="material-symbols-outlined text-content-light transition-transform group-hover:translate-x-1 dark:text-content-dark">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/ziraat/raporlar/sdg"
                className="group flex items-center gap-4 rounded-lg border border-border-light bg-background-light p-6 transition-all hover:border-primary hover:bg-primary/5 dark:border-border-dark dark:bg-background-dark dark:hover:bg-primary/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">
                    eco
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-content-light dark:text-content-dark">
                    SDG Raporu
                  </h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    Sürdürülebilir kalkınma hedeflerine katkı analizi
                  </p>
                </div>
                <span className="material-symbols-outlined text-content-light transition-transform group-hover:translate-x-1 dark:text-content-dark">
                  chevron_right
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Product Application Detail Modal */}
      {selectedProduct && (
        <ApplicationDetailModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          application={{
            name: selectedProduct.name,
            applicationNumber: selectedProduct.applicationNumber,
            applicant: selectedProduct.applicant,
            sector: selectedProduct.sector,
            establishmentYear: selectedProduct.establishmentYear,
            employeeCount: selectedProduct.employeeCount,
            email: selectedProduct.email,
            applicationDate: selectedProduct.applicationDate,
            lastUpdate: selectedProduct.lastUpdate,
            taxNumber: selectedProduct.taxNumber,
            description: selectedProduct.description,
            status: selectedProduct.status,
            documents: selectedProduct.documents,
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Farm Application Detail Modal */}
      {selectedFarm && (
        <ApplicationDetailModal
          isOpen={isFarmModalOpen}
          onClose={() => setIsFarmModalOpen(false)}
          application={{
            name: selectedFarm.name,
            applicationNumber: selectedFarm.applicationNumber,
            applicant: selectedFarm.owner,
            sector: selectedFarm.sector,
            establishmentYear: selectedFarm.establishmentYear,
            employeeCount: selectedFarm.employeeCount,
            email: selectedFarm.email,
            applicationDate: selectedFarm.applicationDate,
            lastUpdate: selectedFarm.inspectionDate,
            taxNumber: selectedFarm.taxNumber,
            description: selectedFarm.description,
            status: selectedFarm.status,
            documents: selectedFarm.documents,
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default DashboardPage;

