import { useEffect, useState } from 'react';
import { ziraatService } from '../../../../../../services/ziraatService';

type FarmLogModalProps = {
  applicationId?: string; // Opsiyonel: verilmezse tüm logları gösterir
  onClose: () => void;
};

type LogEntry = {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  user_name?: string;
  old_status?: string;
  new_status?: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
};

function FarmLogModal({ applicationId, onClose }: FarmLogModalProps) {
  const [logs, setLogs] = useState<{
    activities: LogEntry[];
    detailedActivities: LogEntry[];
    changeLogs: LogEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [applicationId]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = applicationId 
        ? await ziraatService.getFarmLogs(applicationId)
        : await ziraatService.getAllFarmLogs();
      if (response.success) {
        setLogs(response.logs);
      } else {
        setError('Loglar yüklenemedi');
      }
    } catch (err) {
      console.error('Log yükleme hatası:', err);
      setError('Loglar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'onay':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'red':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'durum_degisikligi':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  // Tüm logları birleştir ve tarihe göre sırala
  const allLogs: (LogEntry & { source?: string })[] = [
    ...(logs?.activities || []).map((log) => ({ ...log, source: 'activity' })),
    ...(logs?.detailedActivities || []).map((log) => ({ ...log, source: 'detailed' })),
    ...(logs?.changeLogs || []).map((log) => ({ ...log, source: 'change' })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border-light bg-background-light shadow-2xl dark:border-border-dark dark:bg-background-dark">
        <button
          className="group absolute right-4 top-4 flex items-center justify-center rounded-lg border border-border-light/70 dark:border-border-dark/70 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-sm p-2 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          onClick={onClose}
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark">İşlem Geçmişi</h2>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              {applicationId 
                ? 'Çiftlik başvurusu ile ilgili tüm işlem kayıtları'
                : 'Tüm çiftlik işlem kayıtları'}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-subtle-light dark:text-subtle-dark">Yükleniyor...</div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          ) : allLogs.length === 0 ? (
            <div className="rounded-lg border border-border-light bg-background-light/60 p-8 text-center dark:border-border-dark dark:bg-background-dark/60">
              <span className="material-symbols-outlined mb-4 text-6xl text-subtle-light dark:text-subtle-dark">
                history
              </span>
              <p className="text-subtle-light dark:text-subtle-dark">Henüz işlem kaydı bulunmuyor</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-border-light bg-background-light/60 p-4 dark:border-border-dark dark:bg-background-dark/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(log.type)}`}>
                          {log.type === 'onay' ? 'Onaylandı' : log.type === 'red' ? 'Reddedildi' : log.type || 'İşlem'}
                        </span>
                        <span className="text-sm font-medium text-content-light dark:text-content-dark">
                          {log.title || log.field_name || 'İşlem'}
                        </span>
                      </div>

                      {log.description && (
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">{log.description}</p>
                      )}

                      {log.old_status && log.new_status && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-subtle-light dark:text-subtle-dark">Durum:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">{log.old_status}</span>
                          <span className="text-subtle-light dark:text-subtle-dark">→</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{log.new_status}</span>
                        </div>
                      )}

                      {log.field_name && log.old_value !== undefined && log.new_value !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-subtle-light dark:text-subtle-dark">{log.field_name}:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">{log.old_value || 'Boş'}</span>
                          <span className="text-subtle-light dark:text-subtle-dark">→</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{log.new_value || 'Boş'}</span>
                        </div>
                      )}

                      {log.reason && (
                        <div className="mt-2 rounded-lg border border-border-light bg-background-light p-2 dark:border-border-dark dark:bg-background-dark">
                          <p className="text-xs font-semibold text-subtle-light dark:text-subtle-dark">Sebep:</p>
                          <p className="text-sm text-content-light dark:text-content-dark">{log.reason}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-subtle-light dark:text-subtle-dark">
                        {log.user_name && (
                          <span>
                            <span className="material-symbols-outlined mr-1 align-middle text-sm">person</span>
                            {log.user_name}
                          </span>
                        )}
                        <span>
                          <span className="material-symbols-outlined mr-1 align-middle text-sm">schedule</span>
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              className="rounded-lg border border-border-light bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-border-dark dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmLogModal;

