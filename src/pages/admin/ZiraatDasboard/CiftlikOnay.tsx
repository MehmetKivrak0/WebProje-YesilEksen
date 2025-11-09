import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Navbar from '../../../components/navbar';

type DocumentStatus = 'Onaylandı' | 'Eksik' | 'Beklemede' | 'Reddedildi';
type FarmStatus = 'Onaylandı' | 'Denetimde' | 'Evrak Bekliyor' | 'İlk İnceleme';

type FarmApplication = {
  farm: string;
  owner: string;
  location: string;
  status: FarmStatus;
  inspectionDate: string;
  lastUpdate: string;
  notes: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  documents: Array<{
    name: string;
    status: DocumentStatus;
    url?: string;
    farmerNote?: string;
  }>;
};

const initialFarmApplications: FarmApplication[] = [
  {
    farm: 'Lale Bahçesi',
    owner: 'Hilal Karaca',
    location: 'Konya, Meram',
    status: 'Denetimde',
    inspectionDate: '2024-02-12',
    lastUpdate: 'Bugün',
    notes: 'Saha ziyareti tamamlandı, rapor hazırlanıyor.',
    contact: {
      name: 'Hilal Karaca',
      phone: '+90 536 111 22 33',
      email: 'hilal.karaca@lalebahcesi.com',
    },
    documents: [
      { name: 'Çiftlik Denetim Raporu', status: 'Beklemede', farmerNote: 'Denetmen raporu bekleniyor.' },
      { name: 'Zirai Güvenlik Belgesi', status: 'Onaylandı', url: '/docs/lale-bahcesi-gvenlik.pdf' },
      { name: 'Çevre Uyum Taahhüdü', status: 'Eksik' },
    ],
  },
  {
    farm: 'Göksu Organik',
    owner: 'Yağız Yıldırım',
    location: 'Antalya, Manavgat',
    status: 'Onaylandı',
    inspectionDate: '2024-02-08',
    lastUpdate: '2 gün önce',
    notes: 'Onay belgesi iletildi.',
    contact: {
      name: 'Yağız Yıldırım',
      phone: '+90 533 987 65 43',
      email: 'yagiz.yildirim@goksuorganik.com',
    },
    documents: [
      { name: 'Organik Üretim Sertifikası', status: 'Onaylandı', url: '/docs/goksu-organik-sertifika.pdf' },
      { name: 'Su Kullanım İzni', status: 'Onaylandı', url: '/docs/su-kullanim-izni.pdf' },
      { name: 'Hayvan Refahı Planı', status: 'Onaylandı', url: '/docs/hayvan-refahi-plani.pdf' },
    ],
  },
  {
    farm: 'Pamukova Tarım',
    owner: 'Selim Demirtaş',
    location: 'Sakarya, Pamukova',
    status: 'Evrak Bekliyor',
    inspectionDate: 'Bekleniyor',
    lastUpdate: '3 gün önce',
    notes: 'Analiz raporu eksik.',
    contact: {
      name: 'Selim Demirtaş',
      phone: '+90 542 321 54 76',
      email: 'selim.demirtas@pamukovatarim.com',
    },
    documents: [
      { name: 'Toprak Analiz Sonuçları', status: 'Eksik' },
      { name: 'Hayvan Sağlık Kayıtları', status: 'Beklemede', farmerNote: 'Veteriner raporu eklenecek.' },
      { name: 'ÇKS Kaydı', status: 'Beklemede', url: '/docs/pamukova-cks.pdf' },
    ],
  },
  {
    farm: 'Bereket Vadisi',
    owner: 'Nisa Güler',
    location: 'Kütahya, Gediz',
    status: 'İlk İnceleme',
    inspectionDate: '2024-02-18',
    lastUpdate: '5 saat önce',
    notes: 'İlk değerlendirme formu tamamlandı.',
    contact: {
      name: 'Nisa Güler',
      phone: '+90 505 222 44 55',
      email: 'nisa.guler@bereketvadisi.com',
    },
    documents: [
      { name: 'Çiftlik Tanıtım Formu', status: 'Beklemede', farmerNote: 'Güncel fotoğraflar yüklenecek.' },
      { name: 'İş Sağlığı Planı', status: 'Beklemede' },
      { name: 'Çevresel Etki Değerlendirmesi', status: 'Eksik' },
    ],
  },
  {
    farm: 'Güven Çiftliği',
    owner: 'Saim Bulut',
    location: 'Balıkesir, Gönen',
    status: 'Onaylandı',
    inspectionDate: '2024-01-28',
    lastUpdate: 'Geçen hafta',
    notes: 'Yeni sezon üretim planı onaylandı.',
    contact: {
      name: 'Saim Bulut',
      phone: '+90 532 444 77 88',
      email: 'saim.bulut@guvenciftligi.com',
    },
    documents: [
      { name: 'Tarımsal Üretim Planı', status: 'Onaylandı', url: '/docs/guven-ciftligi-uretimplani.pdf' },
      { name: 'Atık Yönetim Protokolü', status: 'Onaylandı', url: '/docs/atik-yonetim-protokolu.pdf' },
      { name: 'Zirai İlaç Envanteri', status: 'Onaylandı', url: '/docs/zirai-ilac-envanteri.pdf' },
    ],
  },
];

const statusStyles: Record<string, string> = {
  Onaylandı: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  Denetimde: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  'Evrak Bekliyor': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
  'İlk İnceleme': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
};

function CiftlikOnay() {
  const [selectedStatus, setSelectedStatus] = useState<'Hepsi' | keyof typeof statusStyles>('Hepsi');
  const [applications, setApplications] = useState<FarmApplication[]>(initialFarmApplications);
  const [inspectedApplication, setInspectedApplication] = useState<FarmApplication | null>(null);
  const [rejectedApplication, setRejectedApplication] = useState<FarmApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [documentReviews, setDocumentReviews] = useState<Record<string, { status: DocumentStatus; reason?: string }>>({});

  const filteredApplications =
    selectedStatus === 'Hepsi'
      ? applications
      : applications.filter((application) => application.status === selectedStatus);

  const closeInspectModal = () => setInspectedApplication(null);
  const handleRejectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rejectedApplication) {
      const updatedApplications = applications.map((application) =>
        application.farm === rejectedApplication.farm
          ? {
              ...application,
              notes: `Red yanıtı: ${rejectReason}`,
            }
          : application,
      );
      setApplications(updatedApplications);
      const updatedCurrent = updatedApplications.find((application) => application.farm === rejectedApplication.farm);
      setInspectedApplication((current) =>
        current && current.farm === rejectedApplication.farm ? updatedCurrent ?? current : current,
      );
      console.info('Güncellenen çiftlik başvuruları', updatedApplications);
    }
    setRejectedApplication(null);
    setRejectReason('');
  };

  useEffect(() => {
    if (!inspectedApplication) {
      setDocumentReviews({});
      return;
    }

    const initial = inspectedApplication.documents.reduce<Record<string, { status: DocumentStatus; reason?: string }>>(
      (acc, doc) => {
        acc[doc.name] = { status: doc.status, reason: doc.farmerNote };
        return acc;
      },
      {},
    );

    setDocumentReviews(initial);
  }, [inspectedApplication]);

  const updateDocumentStatus = (name: string, status: DocumentStatus) => {
    setDocumentReviews((prev) => ({
      ...prev,
      [name]: {
        status,
        reason: status === 'Reddedildi' ? prev[name]?.reason : undefined,
      },
    }));
  };

  const updateDocumentReason = (name: string, reason: string) => {
    setDocumentReviews((prev) => ({
      ...prev,
      [name]: {
        status: prev[name]?.status ?? 'Reddedildi',
        reason,
      },
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">Çiftlik Onay Süreçleri</h1>
              <p className="text-lg text-subtle-light dark:text-subtle-dark">
                Yeni kayıt taleplerini, denetim süreçlerini ve sonuçlarını burada yönetin.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark" htmlFor="farm-status-filter">
                Durum Filtresi
              </label>
              <select
                id="farm-status-filter"
                className="p-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as typeof selectedStatus)}
              >
                <option value="Hepsi">Hepsi</option>
                <option value="İlk İnceleme">İlk İnceleme</option>
                <option value="Denetimde">Denetimde</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Evrak Bekliyor">Evrak Bekliyor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6">
              <p className="text-sm text-subtle-light dark:text-subtle-dark">Bekleyen Başvurular</p>
              <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                {applications.filter((farm) => farm.status === 'İlk İnceleme' || farm.status === 'Denetimde').length}
              </p>
              <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2">
                Başlangıç veya denetim sürecindeki tüm başvurular
              </p>
            </div>
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6">
              <p className="text-sm text-subtle-light dark:text-subtle-dark">Son Hafta Onayları</p>
              <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                {applications.filter((farm) => farm.status === 'Onaylandı').length}
              </p>
              <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2">Son 7 günde onaylanan çiftlik sayısı</p>
            </div>
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6">
              <p className="text-sm text-subtle-light dark:text-subtle-dark">Evrak Eksikleri</p>
              <p className="text-3xl font-bold text-content-light dark:text-content-dark">
                {applications.filter((farm) => farm.status === 'Evrak Bekliyor').length}
              </p>
              <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2">Tamamlanması gereken evrak sayısı</p>
            </div>
          </div>

          <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="flex flex-col gap-4 border-b border-border-light dark:border-border-dark px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Başvuru Listesi</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  Filtreye göre görüntülenen {filteredApplications.length} kayıt
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-primary/40 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">event</span>
                  Denetim Planı Oluştur
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-base">add_business</span>
                  Yeni Başvuru Kaydı
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-background-light dark:bg-background-dark">
                  <tr className="text-xs uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
                    <th className="px-6 py-3 text-left">Çiftlik</th>
                    <th className="px-6 py-3 text-left">Sahip</th>
                    <th className="px-6 py-3 text-left">Lokasyon</th>
                    <th className="px-6 py-3 text-left">Durum</th>
                    <th className="px-6 py-3 text-left">Planlanan Denetim</th>
                    <th className="px-6 py-3 text-left">Son Güncelleme</th>
                    <th className="px-6 py-3 text-left">Notlar</th>
                    <th className="px-6 py-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                  {filteredApplications.map((farm) => (
                    <tr key={farm.farm} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-content-light dark:text-content-dark">{farm.farm}</td>
                      <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.owner}</td>
                      <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            statusStyles[farm.status] ?? 'bg-muted text-content-light'
                          }`}
                        >
                          {farm.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.inspectionDate}</td>
                      <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.lastUpdate}</td>
                      <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.notes}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-primary/40 dark:hover:bg-primary/30"
                            onClick={() => setInspectedApplication(farm)}
                          >
                            İncele
                          </button>
                          <button className="rounded-full bg-green-600 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-green-500 dark:hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                            Onayla
                          </button>
                          <button
                            className="rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-red-500 dark:hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            onClick={() => setRejectedApplication(farm)}
                          >
                            Reddet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {inspectedApplication && (
        <div className="fixed inset-0 z-30 flex items-start justify-end bg-black/40 px-4 py-8 sm:px-8">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-2xl">
            <button
              className="absolute right-4 top-4 text-subtle-light dark:text-subtle-dark hover:text-primary"
              onClick={closeInspectModal}
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            <div className="max-h-[80vh] overflow-y-auto p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark">
                  {inspectedApplication.farm}
                </h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  Sahibi: {inspectedApplication.owner} • Denetim: {inspectedApplication.inspectionDate}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border-light dark:border-border-dark p-4">
                  <h3 className="text-sm font-semibold text-content-light dark:text-content-dark mb-3">
                    Çiftlik Bilgileri
                  </h3>
                  <ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
                    <li>
                      <span className="font-medium text-content-light dark:text-content-dark">Lokasyon:</span>{' '}
                      {inspectedApplication.location}
                    </li>
                    <li>
                      <span className="font-medium text-content-light dark:text-content-dark">Sorumlu Kişi:</span>{' '}
                      {inspectedApplication.contact.name}
                    </li>
                    <li>
                      <span className="font-medium text-content-light dark:text-content-dark">Telefon:</span>{' '}
                      {inspectedApplication.contact.phone}
                    </li>
                    <li>
                      <span className="font-medium text-content-light dark:text-content-dark">E-Posta:</span>{' '}
                      {inspectedApplication.contact.email}
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border-light dark:border-border-dark p-4">
                  <h3 className="text-sm font-semibold text-content-light dark:text-content-dark mb-3">
                    Denetim Özeti
                  </h3>
                  <ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
                    <li>
                      <span className="font-medium text-content-light dark:text-content-dark">Son Güncelleme:</span>{' '}
                      {inspectedApplication.lastUpdate}
                    </li>
                    <li>
                      <span className="font-medium text-content-light dark:text-content-dark">Durum:</span>{' '}
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[inspectedApplication.status]
                        }`}
                      >
                        {inspectedApplication.status}
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 space-y-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light/40 dark:bg-background-dark/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Notlar
                    </p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{inspectedApplication.notes}</p>
                    {Object.values(documentReviews)
                      .filter((review) => review.status === 'Reddedildi' && review.reason)
                      .map((review, index) => (
                        <p key={index} className="text-sm text-red-700 dark:text-red-200">
                          Geçerli Neden: {review.reason}
                        </p>
                      ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border-light dark:border-border-dark p-4">
                <h3 className="text-sm font-semibold text-content-light dark:text-content-dark mb-3">
                  Belgeler ve Durumları
                </h3>
                <ul className="space-y-2 text-sm">
                  {inspectedApplication.documents.map((document) => {
                    const review = documentReviews[document.name] ?? { status: document.status, reason: document.farmerNote };
                    const statusClass =
                      review.status === 'Onaylandı'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : review.status === 'Eksik'
                          ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                          : review.status === 'Reddedildi'
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
                    const canDownload = Boolean(document.url && review.status === 'Onaylandı');

                    return (
                      <li
                        key={document.name}
                        className="flex flex-col gap-3 rounded-lg bg-background-light/60 dark:bg-background-dark/60 px-4 py-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="text-subtle-light dark:text-subtle-dark">{document.name}</span>
                            {document.url && (
                              <span className="text-xs text-subtle-light/80 dark:text-subtle-dark/80">
                                Dosya: {document.url.split('/').pop()}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
                              {review.status}
                            </span>
                            <a
                              href={canDownload ? document.url : '#'}
                              download={canDownload ? '' : undefined}
                              target={canDownload ? '_blank' : undefined}
                              rel={canDownload ? 'noopener noreferrer' : undefined}
                              aria-disabled={!canDownload}
                              onClick={(event) => {
                                if (!canDownload) {
                                  event.preventDefault();
                                }
                              }}
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                canDownload
                                  ? 'border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                                  : 'border border-border-light dark:border-border-dark text-subtle-light/70 dark:text-subtle-dark/70 cursor-not-allowed'
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">download</span>
                              İndir
                            </a>
                            <button
                              type="button"
                              onClick={() => updateDocumentStatus(document.name, 'Onaylandı')}
                              className="inline-flex items-center gap-1 rounded-full border border-green-600 px-3 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                            >
                              <span className="material-symbols-outlined text-base">check</span>
                              Onayla
                            </button>
                            <button
                              type="button"
                              onClick={() => updateDocumentStatus(document.name, 'Reddedildi')}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                review.status === 'Reddedildi'
                                  ? 'border-red-600 bg-red-600 text-white'
                                  : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                              Reddet
                            </button>
                          </div>
                        </div>
                        {review.status === 'Reddedildi' && (
                          <div className="mt-2 space-y-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-900/20 p-3">
                            <label className="flex flex-col gap-2 text-xs text-red-800 dark:text-red-200">
                              Çiftçiye iletilecek açıklama
                              <textarea
                                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-content-light dark:text-content-dark focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Belgenin reddedilme gerekçesini ve yapılması gerekenleri belirtin."
                                value={review.reason ?? ''}
                                onChange={(event) => updateDocumentReason(document.name, event.target.value)}
                              />
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocumentReason(
                                    document.name,
                                    'Denetim sırasında belirtilen eksikler giderilmedi. Lütfen raporu güncelleyerek yeniden yükleyiniz.',
                                  )
                                }
                                className="rounded-full border border-red-500 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                              >
                                Denetim eksikleri
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocumentReason(
                                    document.name,
                                    'Belge yetkili imza/kaşe içermiyor. Onaylı versiyonu ekleyerek tekrar gönderiniz.',
                                  )
                                }
                                className="rounded-full border border-red-500 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                              >
                                Onaysız belge
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocumentReason(
                                    document.name,
                                    'Belge formatı uygun değil. PDF formatında ve en fazla 10 MB boyutunda dosya yükleyiniz.',
                                  )
                                }
                                className="rounded-full border border-red-500 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                              >
                                Format sorunlu
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (review.reason) {
                                    console.info(`İletildi: ${document.name} için mesaj -> ${review.reason}`);
                                  }
                                }}
                                disabled={!review.reason}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                  review.reason
                                    ? 'border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                                    : 'border border-border-light dark:border-border-dark text-subtle-light/70 dark:text-subtle-dark/70 cursor-not-allowed'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                                İlet
                              </button>
                            </div>
                            {review.reason && (
                              <p className="text-xs text-red-700 dark:text-red-200">
                                Çiftçi panelinde gösterilecek açıklama: <span className="font-medium">{review.reason}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm text-subtle-light dark:text-subtle-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                  onClick={closeInspectModal}
                >
                  Kapat
                </button>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                  Onayı Tamamla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectedApplication && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Reddet ve Bilgilendir</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  {rejectedApplication.farm} başvurusu için reddetme nedenini belirterek çiftliği bilgilendirin.
                </p>
              </div>
              <button
                className="text-subtle-light dark:text-subtle-dark hover:text-primary"
                onClick={() => {
                  setRejectedApplication(null);
                  setRejectReason('');
                }}
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleRejectSubmit}>
              <div>
                <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2" htmlFor="reject-reason">
                  Geçerli Neden
                </label>
                <textarea
                  id="reject-reason"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-content-light dark:text-content-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Örneğin: Denetim raporunda belirtilen eksikler giderilmedi. Güncel raporu yükleyiniz..."
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-light dark:text-content-dark mb-2" htmlFor="farm-owner-message">
                  Çiftlik Sahibine Mesaj
                </label>
                <textarea
                  id="farm-owner-message"
                  rows={4}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-content-light dark:text-content-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`${rejectedApplication.contact.name} için ileti: Reddetme nedenini ve düzeltme için talimatları paylaşın.`}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm text-subtle-light dark:text-subtle-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                  onClick={() => {
                    setRejectedApplication(null);
                    setRejectReason('');
                  }}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Reddi Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CiftlikOnay;

