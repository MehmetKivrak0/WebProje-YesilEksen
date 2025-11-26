import { useState } from 'react';
import type { FarmApplication } from '../types';
import FarmStatusBadge from './FarmStatusBadge';

type ApplicationTableProps = {
  applications: FarmApplication[];
  onInspect: (application: FarmApplication) => void;
  onReject: (application: FarmApplication) => void;
  onQuickApprove?: (application: FarmApplication) => void;
  rejectingId?: string | null;
  approvingId?: string | null;
};

function ApplicationTable({
  applications,
  onInspect,
  onReject,
  onQuickApprove,
  rejectingId,
  approvingId,
}: ApplicationTableProps) {
  const [selectedApplication, setSelectedApplication] = useState<FarmApplication | null>(null);
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-background-light dark:bg-background-dark">
          <tr className="text-xs uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
            <th className="px-6 py-3 text-left">Çiftlik</th>
            <th className="px-6 py-3 text-left">Sahip</th>
            <th className="px-6 py-3 text-left">Adres</th>
            <th className="px-6 py-3 text-left">Durum</th>
            <th className="px-6 py-3 text-left">Son Güncelleme</th>
            <th className="px-6 py-3 text-left">Notlar</th>
            <th className="px-6 py-3 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light text-sm dark:divide-border-dark">
          {applications.map((farm) => (
            <tr key={farm.id} className="transition-colors hover:bg-primary/5 dark:hover:bg-primary/10">
              <td className="px-6 py-4 font-medium text-content-light dark:text-content-dark">{farm.farm}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.owner}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.location}</td>
              <td className="px-6 py-4">
                <FarmStatusBadge status={farm.status} />
              </td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.lastUpdate}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">
                <div className="space-y-1">
                  {farm.notes && (() => {
                    // "Atık Türleri:" ile başlayan satırları kaldır
                    const filteredNotes = farm.notes
                      .split('\n')
                      .filter(line => !line.trim().startsWith('Atık Türleri:'))
                      .join('\n')
                      .trim();
                    return filteredNotes ? (
                      <div className="text-sm">{filteredNotes}</div>
                    ) : null;
                  })()}
                  {farm.documents && farm.documents.length > 0 && farm.documents.some(doc => doc.adminNote && doc.adminNote.trim()) && (
                    <button
                      onClick={() => setSelectedApplication(farm)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 dark:border-primary/40 dark:hover:bg-primary/30"
                    >
                      <span className="material-symbols-outlined text-sm">note</span>
                      Notlar Göster
                    </button>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-primary/40 dark:hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onInspect(farm)}
                    disabled={rejectingId === farm.id || approvingId === farm.id}
                  >
                    İncele
                  </button>
                  {/* Onayla ve Reddet butonları sadece İlk İnceleme ve Belge Eksik durumlarında gösterilir */}
                  {farm.status !== 'Onaylandı' && farm.status !== 'Reddedildi' && (
                    <>
                      {onQuickApprove && (
                        <button
                          className="rounded-full bg-green-600 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onQuickApprove(farm);
                          }}
                          disabled={rejectingId === farm.id || approvingId === farm.id}
                        >
                          {approvingId === farm.id ? (
                            <>
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              <span>Onaylanıyor...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-base">check_circle</span>
                              <span>Onayla</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        className="rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        onClick={() => onReject(farm)}
                        disabled={rejectingId === farm.id || approvingId === farm.id}
                      >
                        {rejectingId === farm.id ? (
                          <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            <span>Reddediliyor...</span>
                          </>
                        ) : (
                          'Reddet'
                        )}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Admin Notları Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border-light bg-background-light shadow-2xl dark:border-border-dark dark:bg-background-dark">
            <button
              className="absolute right-4 top-4 flex items-center justify-center rounded-lg border border-border-light/70 dark:border-border-dark/70 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-sm p-2 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={() => setSelectedApplication(null)}
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <div className="p-6">
              <h3 className="mb-4 text-xl font-semibold text-content-light dark:text-content-dark">
                Admin Notları - {selectedApplication.farm}
              </h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                  selectedApplication.documents
                    .filter(doc => doc.adminNote && doc.adminNote.trim())
                    .map((doc, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border-light bg-background-light/50 p-4 dark:border-border-dark dark:bg-background-dark/50"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">description</span>
                          <h4 className="font-semibold text-content-light dark:text-content-dark">{doc.name}</h4>
                        </div>
                        <p className="text-sm text-content-light dark:text-content-dark whitespace-pre-line">
                          {doc.adminNote}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="rounded-lg border border-border-light bg-background-light/50 p-8 text-center dark:border-border-dark dark:bg-background-dark/50">
                    <span className="material-symbols-outlined mb-2 text-4xl text-subtle-light dark:text-subtle-dark">note</span>
                    <p className="text-sm font-medium text-content-light dark:text-content-dark">Henüz admin notu eklenmemiş</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-lg border-2 border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationTable;

