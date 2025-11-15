import type { FormEvent } from 'react';
import ZrtnNavbar from '../../../../components/zrtnavbar';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationSummaryCards from './components/ApplicationSummaryCards';
import ApplicationTable from './components/ApplicationTable';
import InspectModal from './components/modals/InspectModal';
import RejectModal from './components/modals/RejectModal';
import { useFarmApplications } from './hooks/useFarmApplications';
import { initialFarmApplications } from './data/farmApplications';

function FarmApplicationsPage() {
  const {
    selectedStatus,
    setSelectedStatus,
    applications,
    setApplications,
    inspectedApplication,
    setInspectedApplication,
    rejectedApplication,
    setRejectedApplication,
    rejectReason,
    setRejectReason,
    documentReviews,
    updateDocumentStatus,
    updateDocumentReason,
    filteredApplications,
    closeInspectModal,
  } = useFarmApplications({ applications: initialFarmApplications });

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

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-content-light dark:bg-background-dark dark:text-content-dark">
      <ZrtnNavbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-content-light dark:text-content-dark">Çiftlik Onay Süreçleri</h1>
              <p className="text-lg text-subtle-light dark:text-subtle-dark">
                Yeni kayıt taleplerini, denetim süreçlerini ve sonuçlarını burada yönetin.
              </p>
            </div>
            <ApplicationFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
          </div>

          <ApplicationSummaryCards applications={applications} />

          <div className="rounded-xl border border-border-light bg-background-light dark:border-border-dark dark:bg-background-dark">
            <div className="flex flex-col gap-4 border-b border-border-light px-6 py-4 dark:border-border-dark md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Başvuru Listesi</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  Filtreye göre görüntülenen {filteredApplications.length} kayıt
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-primary/40 dark:hover:bg-primary/30">
                <span className="material-symbols-outlined text-base">event</span>
                Denetim Planı Oluştur
              </button>
            </div>

            <ApplicationTable
              applications={filteredApplications}
              onInspect={setInspectedApplication}
              onReject={setRejectedApplication}
            />
          </div>
        </div>
      </main>

      {inspectedApplication && (
        <InspectModal
          application={inspectedApplication}
          documentReviews={documentReviews}
          onClose={closeInspectModal}
          onUpdateDocumentStatus={updateDocumentStatus}
          onUpdateDocumentReason={updateDocumentReason}
        />
      )}

      {rejectedApplication && (
        <RejectModal
          application={rejectedApplication}
          rejectReason={rejectReason}
          onChangeReason={setRejectReason}
          onCancel={() => {
            setRejectedApplication(null);
            setRejectReason('');
          }}
          onSubmit={handleRejectSubmit}
        />
      )}
    </div>
  );
}

export default FarmApplicationsPage;
