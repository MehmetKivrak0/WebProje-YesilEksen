import { useState, useEffect } from 'react';
import { ziraatService } from '../../../../../services/ziraatService';

type FarmerDetailModalProps = {
  isOpen: boolean;
  farmerId: string | null;
  onClose: () => void;
};

function FarmerDetailModal({ isOpen, farmerId, onClose }: FarmerDetailModalProps) {
  const [farmer, setFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && farmerId) {
      loadFarmerDetails();
    } else {
      setFarmer(null);
      setError(null);
    }
  }, [isOpen, farmerId]);

  const loadFarmerDetails = async () => {
    if (!farmerId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await ziraatService.getFarmerDetails(farmerId);
      if (response.success) {
        setFarmer(response.farmer);
      } else {
        setError('Çiftçi detayları yüklenemedi');
      }
    } catch (err: any) {
      console.error('Çiftçi detayları yükleme hatası:', err);
      setError(err.response?.data?.message || 'Çiftçi detayları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-border-light bg-background-light shadow-2xl dark:border-border-dark dark:bg-background-dark max-h-[90vh] overflow-hidden">
        <button
          className="absolute right-4 top-4 flex items-center justify-center rounded-lg border border-border-light/70 dark:border-border-dark/70 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-sm p-2 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          onClick={onClose}
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="mb-6 text-2xl font-semibold text-content-light dark:text-content-dark">
            Çiftçi Detayları
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Yükleniyor...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          ) : farmer ? (
            <div className="space-y-6">
              {/* Durum Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Durum: Onaylandı
                </span>
              </div>

              {/* Çiftlik Bilgileri */}
              <div className="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                <h3 className="mb-4 text-lg font-semibold text-content-light dark:text-content-dark">
                  Çiftlik Bilgileri
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Çiftçi Adı
                    </p>
                    <p className="mt-1 text-sm font-medium text-content-light dark:text-content-dark">
                      {farmer.name || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Çiftlik Adı
                    </p>
                    <p className="mt-1 text-sm font-medium text-content-light dark:text-content-dark">
                      {farmer.farmName || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      E-posta
                    </p>
                    <p className="mt-1 text-sm text-content-light dark:text-content-dark">
                      {farmer.email || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Telefon
                    </p>
                    <p className="mt-1 text-sm text-content-light dark:text-content-dark">
                      {farmer.phone || '-'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Adres
                    </p>
                    <p className="mt-1 text-sm text-content-light dark:text-content-dark">
                      {farmer.address || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Kayıt Tarihi
                    </p>
                    <p className="mt-1 text-sm text-content-light dark:text-content-dark">
                      {farmer.registrationDate
                        ? new Date(farmer.registrationDate).toLocaleDateString('tr-TR')
                        : '-'}
                    </p>
                  </div>
                </div>
                {farmer.description && (
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                      Açıklama
                    </p>
                    <p className="mt-1 text-sm text-content-light dark:text-content-dark">
                      {farmer.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Belgeler */}
              <div className="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                <h3 className="mb-4 text-lg font-semibold text-content-light dark:text-content-dark">
                  Belgeler
                </h3>
                {farmer.documents && farmer.documents.length > 0 ? (
                  <div className="space-y-3">
                    {farmer.documents.map((doc: any) => (
                      <div
                        key={doc.belgeId}
                        className="flex items-center justify-between rounded-lg border border-border-light p-3 dark:border-border-dark"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-content-light dark:text-content-dark">
                            {doc.name || doc.belgeTuru || 'Belge'}
                          </p>
                          {doc.status && (
                            <p className="mt-1 text-xs text-subtle-light dark:text-subtle-dark">
                              Durum: {doc.status}
                            </p>
                          )}
                        </div>
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 dark:border-primary/40 dark:hover:bg-primary/30"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Görüntüle
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    Henüz belge yüklenmemiş
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FarmerDetailModal;

