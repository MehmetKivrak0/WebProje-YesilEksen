import type { DocumentReviewState, FarmApplication } from '../../types';
import FarmStatusBadge from '../FarmStatusBadge';

type InspectModalProps = {
  application: FarmApplication;
  documentReviews: DocumentReviewState;
  onClose: () => void;
  onUpdateDocumentStatus: (name: string, status: DocumentReviewState[string]['status']) => void;
  onUpdateDocumentReason: (name: string, reason: string) => void;
};

function InspectModal({
  application,
  documentReviews,
  onClose,
  onUpdateDocumentStatus,
  onUpdateDocumentReason,
}: InspectModalProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-start justify-end bg-black/40 px-4 py-8 sm:px-8">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border-light bg-background-light shadow-2xl dark:border-border-dark dark:bg-background-dark">
        <button
          className="group absolute right-4 top-4 flex items-center justify-center rounded-lg border border-border-light/70 dark:border-border-dark/70 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-sm p-2 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          onClick={onClose}
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <div className="max-h-[80vh] space-y-8 overflow-y-auto p-8">
          <div>
            <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark">{application.farm}</h2>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              Sahibi: {application.owner} • Denetim: {application.inspectionDate}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border-light p-4 dark:border-border-dark">
              <h3 className="mb-3 text-sm font-semibold text-content-light dark:text-content-dark">Çiftlik Bilgileri</h3>
              <ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
                <li>
                  <span className="font-medium text-content-light dark:text-content-dark">Lokasyon:</span>{' '}
                  {application.location}
                </li>
                <li>
                  <span className="font-medium text-content-light dark:text-content-dark">Sorumlu Kişi:</span>{' '}
                  {application.contact.name}
                </li>
                <li>
                  <span className="font-medium text-content-light dark:text-content-dark">Telefon:</span>{' '}
                  {application.contact.phone}
                </li>
                <li>
                  <span className="font-medium text-content-light dark:text-content-dark">E-Posta:</span>{' '}
                  {application.contact.email}
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border-light p-4 dark:border-border-dark">
              <h3 className="mb-3 text-sm font-semibold text-content-light dark:text-content-dark">Denetim Özeti</h3>
              <ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
                <li>
                  <span className="font-medium text-content-light dark:text-content-dark">Son Güncelleme:</span>{' '}
                  {application.lastUpdate}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium text-content-light dark:text-content-dark">Durum:</span>
                  <FarmStatusBadge status={application.status} />
                </li>
              </ul>
              <div className="mt-4 space-y-2 rounded-lg border border-border-light bg-background-light/40 p-3 dark:border-border-dark dark:bg-background-dark/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                  Notlar
                </p>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">{application.notes}</p>
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

          <div className="rounded-xl border border-border-light p-4 dark:border-border-dark">
            <h3 className="mb-3 text-sm font-semibold text-content-light dark:text-content-dark">Belgeler ve Durumları</h3>
            <ul className="space-y-2 text-sm">
              {application.documents.map((document) => {
                const review = documentReviews[document.name] ?? {
                  status: document.status,
                  reason: document.farmerNote,
                };
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
                    className="flex flex-col gap-3 rounded-lg bg-background-light/60 px-4 py-3 dark:bg-background-dark/60"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                              : 'cursor-not-allowed border border-border-light text-subtle-light/70 dark:border-border-dark dark:text-subtle-dark/70'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">download</span>
                          İndir
                        </a>
                        <button
                          type="button"
                          onClick={() => onUpdateDocumentStatus(document.name, 'Onaylandı')}
                          className="inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          <span className="material-symbols-outlined text-base">check</span>
                          Onayla
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateDocumentStatus(document.name, 'Reddedildi')}
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
                      <div className="mt-2 space-y-3 rounded-lg border border-red-200 bg-red-50/60 p-3 dark:border-red-900/60 dark:bg-red-900/20">
                        <label className="flex flex-col gap-2 text-xs text-red-800 dark:text-red-200">
                          Çiftçiye iletilecek açıklama
                          <textarea
                            className="w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm text-content-light focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-border-dark dark:bg-background-dark dark:text-content-dark"
                            placeholder="Belgenin reddedilme gerekçesini ve yapılması gerekenleri belirtin."
                            value={review.reason ?? ''}
                            onChange={(event) => onUpdateDocumentReason(document.name, event.target.value)}
                          />
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateDocumentReason(
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
                              onUpdateDocumentReason(
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
                              onUpdateDocumentReason(
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
                              const reason = documentReviews[document.name]?.reason;
                              if (reason) {
                                console.info(`İletildi: ${document.name} için mesaj -> ${reason}`);
                              }
                            }}
                            disabled={!documentReviews[document.name]?.reason}
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                              documentReviews[document.name]?.reason
                                ? 'border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                                : 'cursor-not-allowed border border-border-light text-subtle-light/70 dark:border-border-dark dark:text-subtle-dark/70'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                            İlet
                          </button>
                        </div>
                        {documentReviews[document.name]?.reason && (
                          <p className="text-xs text-red-700 dark:text-red-200">
                            Çiftçi panelinde gösterilecek açıklama:{' '}
                            <span className="font-medium">{documentReviews[document.name]?.reason}</span>
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
              className="rounded-lg border-2 border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
              onClick={onClose}
            >
              Kapat
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
              Onayı Tamamla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InspectModal;

