import { useState, type FormEvent } from 'react';
import ZrtnNavbar from '../../../../components/zrtnavbar';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationSummaryCards from './components/ApplicationSummaryCards';
import ApplicationTable from './components/ApplicationTable';
import InspectModal from './components/modals/InspectModal';
import RejectModal from './components/modals/RejectModal';
import PreviewApprovalModal from './components/modals/PreviewApprovalModal';
import FarmLogModal from './components/modals/FarmLogModal';
import FarmToast from './components/FarmToast';
import { useFarmApplications } from './hooks/useFarmApplications';

function FarmApplicationsPage() {
  const [showAllLogs, setShowAllLogs] = useState(false);
  const {
    selectedStatus,
    setSelectedStatus,
    applications,
    allApplications,
    approvedFarmCount,
    inspectedApplication,
    setInspectedApplication,
    rejectedApplication,
    setRejectedApplication,
    previewApplication,
    setPreviewApplication,
    rejectReason,
    setRejectReason,
    getDocumentReviews,
    updateDocumentReviews,
    updateDocumentStatus,
    updateDocumentReason,
    updateDocumentAdminNote,
    filteredApplications,
    closeInspectModal,
    handleApprove,
    handleReject,
    handleQuickApprove,
    loading,
    error,
    approvingId,
    rejectingId,
    updatingDocumentId,
    toast,
    setToast,
  } = useFarmApplications();

  const handleRejectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rejectedApplication && rejectReason.trim()) {
      await handleReject(rejectedApplication, rejectReason);
    }
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
                Yeni kayıt taleplerini ve sonuçlarını burada yönetin.
              </p>
            </div>
            <ApplicationFilters 
              selectedStatus={selectedStatus} 
              onStatusChange={setSelectedStatus}
              onShowLogs={() => setShowAllLogs(true)}
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <ApplicationSummaryCards 
            applications={allApplications || applications} 
            approvedFarmCount={approvedFarmCount}
          />

          <div className="rounded-xl border border-border-light bg-background-light dark:border-border-dark dark:bg-background-dark">
            <div className="flex flex-col gap-4 border-b border-border-light px-6 py-4 dark:border-border-dark md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">Başvuru Listesi</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                  {loading ? 'Yükleniyor...' : `Filtreye göre görüntülenen ${filteredApplications.length} kayıt`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-subtle-light dark:text-subtle-dark">Yükleniyor...</div>
              </div>
            ) : (
              <ApplicationTable
                applications={filteredApplications}
                onInspect={setInspectedApplication}
                onReject={setRejectedApplication}
                onQuickApprove={handleQuickApprove}
                rejectingId={rejectingId}
                approvingId={approvingId}
              />
            )}
          </div>
        </div>
      </main>

      {inspectedApplication && (
        <InspectModal
          application={inspectedApplication}
          documentReviews={getDocumentReviews(inspectedApplication.id)}
          onClose={closeInspectModal}
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

      {previewApplication && (
        <PreviewApprovalModal
          application={previewApplication}
          documentReviews={getDocumentReviews(previewApplication.id)}
          onClose={() => {
            setPreviewApplication(null);
            // Eğer inspect modal açıksa onu da kapat
            if (inspectedApplication?.id === previewApplication.id) {
              setInspectedApplication(null);
            }
          }}
          onConfirm={async () => {
            await handleApprove(previewApplication);
            setPreviewApplication(null);
          }}
          isProcessing={approvingId === previewApplication.id}
        />
      )}

      {showAllLogs && (
        <FarmLogModal
          onClose={() => setShowAllLogs(false)}
        />
      )}

      {toast && <FarmToast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default FarmApplicationsPage;
