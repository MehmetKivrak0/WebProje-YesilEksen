interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    name: string;
    applicationNumber: string;
    applicant: string;
    sector?: string;
    establishmentYear?: number;
    employeeCount?: string;
    email?: string;
    applicationDate: string;
    lastUpdate: string;
    taxNumber?: string;
    description?: string;
    status: string;
    documents?: Array<{ name: string; url?: string }>;
  };
  onApprove?: () => void;
  onReject?: () => void;
}

function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
}: ApplicationDetailModalProps) {
  if (!isOpen) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'İncelemede':
        return 'inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Onaylandı':
        return 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Revizyon':
      case 'Reddedildi':
        return 'inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-medium text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#4CAF50]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl rounded-xl bg-background-light shadow-xl dark:bg-background-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4 dark:border-border-dark">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">
                {application.name}
              </h2>
              <p className="text-sm text-subtle-light dark:text-subtle-dark">
                Başvuru No: {application.applicationNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-green-900 transition-colors hover:bg-green-50 dark:text-green-600 dark:hover:bg-green-900/20"
          >
            <span className="material-symbols-outlined text-xl font-bold leading-none">close</span>
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-6 pt-4 pb-2">
          <span className={getStatusClass(application.status)}>{application.status}</span>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Genel Bilgiler */}
              <div className="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                  Genel Bilgiler
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark">Firma Adı</p>
                    <p className="text-sm font-medium text-content-light dark:text-content-dark">
                      {application.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark">Başvuru Sahibi</p>
                    <p className="text-sm font-medium text-content-light dark:text-content-dark">
                      {application.applicant}
                    </p>
                  </div>
                  {application.sector && (
                    <div>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Sektör</p>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {application.sector}
                      </p>
                    </div>
                  )}
                  {application.establishmentYear && (
                    <div>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Kuruluş Yılı</p>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {application.establishmentYear}
                      </p>
                    </div>
                  )}
                  {application.employeeCount && (
                    <div>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Çalışan Sayısı</p>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {application.employeeCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              {application.email && (
                <div className="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                    İletişim Bilgileri
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">E-posta</p>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {application.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Başvuru Bilgileri */}
              <div className="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                  Başvuru Bilgileri
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark">Başvuru Tarihi</p>
                    <p className="text-sm font-medium text-content-light dark:text-content-dark">
                      {application.applicationDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark">Son Güncelleme</p>
                    <p className="text-sm font-medium text-content-light dark:text-content-dark">
                      {application.lastUpdate}
                    </p>
                  </div>
                  {application.taxNumber && (
                    <div>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Vergi Numarası</p>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {application.taxNumber}
                      </p>
                    </div>
                  )}
                  {application.description && (
                    <div>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">Açıklama</p>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {application.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Yüklenen Belgeler */}
              {application.documents && application.documents.length > 0 && (
                <div className="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                    Yüklenen Belgeler
                  </h3>
                  <div className="space-y-2">
                    {application.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border-light p-3 dark:border-border-dark"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                            description
                          </span>
                          <span className="text-sm text-content-light dark:text-content-dark">{doc.name}</span>
                        </div>
                        <button className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-800 dark:bg-green-800 dark:hover:bg-green-900">
                          İndir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-border-light px-6 py-4 dark:border-border-dark">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E8F5E9] bg-[#E8F5E9] px-4 py-2 text-sm font-medium text-[#2E7D32] transition-colors hover:border-[#2E7D32] hover:bg-[#E8F5E9]/80 dark:border-[#2E7D32]/30 dark:bg-[#2E7D32]/10 dark:text-[#4CAF50] dark:hover:bg-[#2E7D32]/20"
          >
            Kapat
          </button>
          {onReject && (
            <button
              onClick={onReject}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Reddet
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Onayla
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailModal;

