import { useEffect, useMemo, useState } from 'react';
import ZrtnNavbar from '../../../components/zrtnavbar';

type FarmStatus = 'Aktif' | 'Beklemede' | 'Askıda';

type FarmRow = {
  name: string;
  farmer: string;
  registrationDate: string;
  status: FarmStatus;
  productionTons: number;
  annualRevenue: number;
};

type ChangeLogEntry = {
  name: string;
  field: 'Durum' | 'Silme';
  from: string;
  to: string;
  reason?: string;
  timestamp: string;
};

type StatusModalState = {
  open: boolean;
  farmName: string | null;
  currentStatus: FarmStatus | null;
  nextStatus: FarmStatus | null;
  reason: string;
  error: string | null;
};

type DeleteModalState = {
  open: boolean;
  farmName: string | null;
  reason: string;
  error: string | null;
};

type FarmProductsModalState = {
  open: boolean;
  farmName: string | null;
  products: string[];
};

const initialFarmRows: FarmRow[] = [
  {
    name: 'Güneş Çiftliği',
    farmer: 'Mehmet Yılmaz',
    registrationDate: '2024-01-15',
    status: 'Aktif',
    productionTons: 5300,
    annualRevenue: 840_000,
  },
  {
    name: 'Bereket Çiftliği',
    farmer: 'Ayşe Demir',
    registrationDate: '2024-01-10',
    status: 'Beklemede',
    productionTons: 4800,
    annualRevenue: 780_000,
  },
  {
    name: 'Ege Organik',
    farmer: 'Ali Kaya',
    registrationDate: '2024-01-05',
    status: 'Aktif',
    productionTons: 5100,
    annualRevenue: 795_000,
  },
  {
    name: 'Anadolu Hasat',
    farmer: 'Selin Acar',
    registrationDate: '2024-01-02',
    status: 'Askıda',
    productionTons: 4200,
    annualRevenue: 610_000,
  },
];

const statusOptions: FarmStatus[] = ['Aktif', 'Beklemede', 'Askıda'];

const initialStatusModalState: StatusModalState = {
  open: false,
  farmName: null,
  currentStatus: null,
  nextStatus: null,
  reason: '',
  error: null,
};

const initialDeleteModalState: DeleteModalState = {
  open: false,
  farmName: null,
  reason: '',
  error: null,
};

const initialFarmProductsModalState: FarmProductsModalState = {
  open: false,
  farmName: null,
  products: [],
};

const farmProductsCatalog: Record<string, string[]> = {
  'Güneş Çiftliği': ['Organik Zeytinyağı', 'Güneş Domatesi'],
  'Bereket Çiftliği': ['Doğal Bal'],
  'Ege Organik': [],
  'Anadolu Hasat': ['Anadolu Buğdayı', 'Yerel Nohut'],
};

function CitflitAdmin() {
  const [farms, setFarms] = useState<FarmRow[]>(initialFarmRows);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [statusModal, setStatusModal] = useState<StatusModalState>(initialStatusModalState);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(initialDeleteModalState);
  const [farmProductsModal, setFarmProductsModal] = useState<FarmProductsModalState>(initialFarmProductsModalState);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);
  const statusModalTitleId = 'status-modal-title';
  const deleteModalTitleId = 'delete-modal-title';
  const farmProductsModalTitleId = 'farm-products-modal-title';

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const totalFarmers = useMemo(() => new Set(farms.map((farm) => farm.farmer)).size, [farms]);
  const totalActiveFarms = useMemo(() => farms.filter((farm) => farm.status === 'Aktif').length, [farms]);
  const totalProduction = useMemo(() => farms.reduce((sum, farm) => sum + farm.productionTons, 0), [farms]);
  const totalRevenue = useMemo(() => farms.reduce((sum, farm) => sum + farm.annualRevenue, 0), [farms]);
  const filteredFarms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return farms;
    }

    return farms.filter((farm) => {
      return (
        farm.name.toLowerCase().includes(normalizedQuery) ||
        farm.farmer.toLowerCase().includes(normalizedQuery) ||
        farm.status.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [farms, searchQuery]);

  const openStatusModal = (farm: FarmRow, nextStatus: FarmStatus) => {
    if (farm.status === nextStatus) {
      return;
    }

    setStatusModal({
      open: true,
      farmName: farm.name,
      currentStatus: farm.status,
      nextStatus,
      reason: '',
      error: null,
    });
  };

  const closeStatusModal = () => setStatusModal(initialStatusModalState);

  const confirmStatusChange = () => {
    if (!statusModal.farmName || !statusModal.nextStatus) {
      closeStatusModal();
      return;
    }

    const farmName = statusModal.farmName;
    const reason = statusModal.reason.trim();

    if (!reason) {
      setStatusModal((prev) => ({ ...prev, error: 'Lütfen bir neden belirtin.' }));
      return;
    }

    const currentFarm = farms.find((farm) => farm.name === farmName);

    if (!currentFarm || currentFarm.status === statusModal.nextStatus) {
      closeStatusModal();
      return;
    }

    setFarms((prev) =>
      prev.map((farm) =>
        farm.name === farmName ? { ...farm, status: statusModal.nextStatus as FarmStatus } : farm,
      ),
    );

    setChangeLog((log) => [
      {
        name: farmName,
        field: 'Durum',
        from: currentFarm.status,
        to: statusModal.nextStatus as FarmStatus,
        reason,
        timestamp: new Date().toISOString(),
      },
      ...log,
    ]);

    setToast({
      message: `${farmName} için durum ${statusModal.nextStatus} olarak güncellendi.`,
      tone: 'success',
    });

    closeStatusModal();
  };

  const openDeleteModal = (farm: FarmRow) => {
    const relatedProducts = farmProductsCatalog[farm.name] ?? [];

    if (relatedProducts.length > 0) {
      setFarmProductsModal({
        open: true,
        farmName: farm.name,
        products: relatedProducts,
      });
      return;
    }

    setDeleteModal({
      open: true,
      farmName: farm.name,
      reason: '',
      error: null,
    });
  };

  const closeDeleteModal = () => setDeleteModal(initialDeleteModalState);
  const closeFarmProductsModal = () => setFarmProductsModal(initialFarmProductsModalState);

  const confirmDelete = () => {
    if (!deleteModal.farmName) {
      closeDeleteModal();
      return;
    }

    const farmName = deleteModal.farmName;
    const reason = deleteModal.reason.trim();

    if (!reason) {
      setDeleteModal((prev) => ({ ...prev, error: 'Lütfen silme nedenini belirtin.' }));
      return;
    }

    const existingFarm = farms.find((farm) => farm.name === farmName);

    if (!existingFarm) {
      closeDeleteModal();
      return;
    }

    setFarms((prev) => prev.filter((farm) => farm.name !== farmName));
    setChangeLog((log) => [
      {
        name: farmName,
        field: 'Silme',
        from: existingFarm.status,
        to: 'Listeden Kaldırıldı',
        reason,
        timestamp: new Date().toISOString(),
      },
      ...log,
    ]);

    setToast({
      message: `${farmName} listeden kaldırıldı.`,
      tone: 'success',
    });

    closeDeleteModal();
  };

  const renderStatusBadge = (status: FarmStatus) => {
    if (status === 'Aktif') {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
          Aktif
        </span>
      );
    }

    if (status === 'Beklemede') {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
          Beklemede
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        Askıda
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-content-light dark:bg-background-dark dark:text-content-dark">
      <ZrtnNavbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {toast && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
                toast.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                  : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {toast.tone === 'success' ? 'check_circle' : 'info'}
              </span>
              <span>{toast.message}</span>
            </div>
          )}

          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-content-light dark:text-content-dark">
              Çiftlik Yönetimi 
            </h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">Çiftçileri ve çiftlik faaliyetlerini yönetin</p>
          </div>

          <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Kayıtlı Çiftçi</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                    {totalFarmers.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl text-primary">agriculture</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%12</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Aktif Çiftlik</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                    {totalActiveFarms.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl text-primary">home</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%8</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Üretim (Ton)</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                    {totalProduction.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl text-primary">trending_up</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%23</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>

            <div className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Yıllık Gelir</p>
                  <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                    ₺{totalRevenue.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <span className="material-symbols-outlined text-2xl text-primary">attach_money</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">+%15</span>
                <span className="text-sm text-subtle-light dark:text-subtle-dark"> geçen aydan</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-light bg-background-light p-6 shadow-sm dark:border-border-dark dark:bg-background-dark">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Kayıtlı Çiftlikler</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  Aktif çiftlikleri durumlarına göre filtreleyin ve yönetin
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                    search
                  </span>
                  <input
                    className="w-full rounded-lg border border-border-light bg-background-light py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-background-dark sm:w-64"
                    placeholder="Çiftlik ara"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                        Çiftlik Adı
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                        Çiftçi
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
                    {filteredFarms.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-subtle-light dark:text-subtle-dark">
                          Aramanızla eşleşen bir çiftlik bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredFarms.map((farm) => (
                        <tr key={farm.name} className="transition hover:bg-primary/5 dark:hover:bg-primary/10">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-content-light dark:text-content-dark">
                            {farm.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">
                            {farm.farmer}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-light dark:text-subtle-dark">
                            {new Date(farm.registrationDate).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {renderStatusBadge(farm.status)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-wrap items-center gap-3">
                              <select
                                value={farm.status}
                                className="rounded-lg border border-border-light bg-background-light px-3 py-1 text-sm font-medium dark:border-border-dark dark:bg-background-dark"
                                onChange={(event) => openStatusModal(farm, event.target.value as FarmStatus)}
                                aria-label={`${farm.name} durumunu değiştir`}
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="inline-flex items-center gap-1 rounded-lg border border-red-600 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                                onClick={() => openDeleteModal(farm)}
                              >
                                <span className="material-symbols-outlined text-sm leading-none">delete</span>
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-border-light bg-background-light p-6 shadow-sm dark:border-border-dark dark:bg-background-dark">
            <h3 className="mb-4 text-lg font-semibold text-content-light dark:text-content-dark">Yapılan Değişiklikler</h3>
            {changeLog.length === 0 ? (
              <p className="text-sm text-subtle-light dark:text-subtle-dark">Henüz kaydedilmiş bir değişiklik bulunmuyor.</p>
            ) : (
              <ul className="space-y-3">
                {changeLog.map((log, index) => (
                  <li
                    key={`${log.name}-${log.timestamp}-${index}`}
                    className="rounded-lg border border-border-light px-4 py-3 text-sm text-subtle-light dark:border-border-dark dark:text-subtle-dark"
                  >
                    <span className="block font-medium text-content-light dark:text-content-dark">
                      {log.field === 'Silme'
                        ? `${log.name} listeden kaldırıldı`
                        : `${log.name} • Durum değişti: ${log.from} → ${log.to}`}
                    </span>
                    {log.reason && <span className="block">Neden: {log.reason}</span>}
                    <span className="mt-1 block text-xs text-subtle-light dark:text-subtle-dark">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {statusModal.open && statusModal.farmName && statusModal.currentStatus && statusModal.nextStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={statusModalTitleId}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border-light bg-background-light p-6 text-content-light shadow-2xl focus:outline-none dark:border-border-dark dark:bg-background-dark dark:text-content-dark"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 id={statusModalTitleId} className="text-lg font-semibold">
                  Durum Değişikliğini Onayla
                </h4>
                <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                  {statusModal.farmName} kaydının durumu{' '}
                  <span className="font-medium text-primary">{statusModal.currentStatus}</span> seviyesinden{' '}
                  <span className="font-medium text-primary">{statusModal.nextStatus}</span> seviyesine çekilecek.
                </p>
              </div>
              <button
                className="rounded-full bg-transparent p-1 text-subtle-light transition hover:text-content-light dark:text-subtle-dark dark:hover:text-content-dark"
                onClick={closeStatusModal}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <label className="mt-6 block text-sm font-medium text-content-light dark:text-content-dark">
              Değişiklik Nedeni
              <textarea
                className="mt-2 h-28 w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm text-content-light focus:outline-none focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-content-dark"
                placeholder="Çiftçiye iletilecek açıklamayı girin..."
                value={statusModal.reason}
                onChange={(event) =>
                  setStatusModal((prev) => ({ ...prev, reason: event.target.value, error: null }))
                }
              />
            </label>
            {statusModal.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{statusModal.error}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-subtle-light transition hover:bg-border-light/60 dark:border-border-dark dark:text-subtle-dark dark:hover:bg-border-dark/60"
                onClick={closeStatusModal}
              >
                Vazgeç
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                onClick={confirmStatusChange}
              >
                <span className="material-symbols-outlined text-base">send</span>
                Onayla ve Bildir
              </button>
            </div>
          </div>
        </div>
      )}
      {farmProductsModal.open && farmProductsModal.farmName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={farmProductsModalTitleId}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border-light bg-background-light p-6 text-content-light shadow-2xl focus:outline-none dark:border-border-dark dark:bg-background-dark dark:text-content-dark"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 id={farmProductsModalTitleId} className="text-lg font-semibold">
                  Çiftlik Silinemiyor
                </h4>
                <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                  {farmProductsModal.farmName} çiftliğine bağlı ürünler bulunuyor. Bu ürünler kaldırılmadan çiftlik kaydı
                  silinemez.
                </p>
              </div>
              <button
                className="rounded-full bg-transparent p-1 text-subtle-light transition hover:text-content-light dark:text-subtle-dark dark:hover:text-content-dark"
                onClick={closeFarmProductsModal}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-border-light bg-background-light/80 p-4 dark:border-border-dark dark:bg-background-dark/60">
              <h5 className="text-sm font-semibold text-content-light dark:text-content-dark">Bağlı Ürünler</h5>
              <ul className="mt-3 space-y-2">
                {farmProductsModal.products.map((product) => (
                  <li
                    key={product}
                    className="flex items-center justify-between rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm dark:border-border-dark dark:bg-background-dark"
                  >
                    <span className="font-medium text-content-light dark:text-content-dark">{product}</span>
                    <span className="text-xs uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Önce kaldırılmalı
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 dark:bg-primary/20 dark:text-primary"
                onClick={closeFarmProductsModal}
              >
                <span className="material-symbols-outlined text-base">check</span>
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.open && deleteModal.farmName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteModalTitleId}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border-light bg-background-light p-6 text-content-light shadow-2xl focus:outline-none dark:border-border-dark dark:bg-background-dark dark:text-content-dark"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 id={deleteModalTitleId} className="text-lg font-semibold">
                  Çiftliği Sil
                </h4>
                <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                  {deleteModal.farmName} kaydını sistemden kaldırmak üzeresiniz. Lütfen çiftçiye iletilecek silme nedenini
                  paylaşın.
                </p>
              </div>
              <button
                className="rounded-full bg-transparent p-1 text-subtle-light transition hover:text-content-light dark:text-subtle-dark dark:hover:text-content-dark"
                onClick={closeDeleteModal}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <label className="mt-6 block text-sm font-medium text-content-light dark:text-content-dark">
              Silme Nedeni
              <textarea
                className="mt-2 h-28 w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm text-content-light focus:outline-none focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-content-dark"
                placeholder="Silme gerekçesini yazın..."
                value={deleteModal.reason}
                onChange={(event) =>
                  setDeleteModal((prev) => ({ ...prev, reason: event.target.value, error: null }))
                }
              />
            </label>
            {deleteModal.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{deleteModal.error}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-subtle-light transition hover:bg-border-light/60 dark:border-border-dark dark:text-subtle-dark dark:hover:bg-border-dark/60"
                onClick={closeDeleteModal}
              >
                Vazgeç
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                onClick={confirmDelete}
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Sil ve Bildir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitflitAdmin;

