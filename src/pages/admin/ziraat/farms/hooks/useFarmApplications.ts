import { useEffect, useMemo, useState } from 'react';
import type { DocumentReviewState, FarmApplication, FarmStatus } from '../types';

type UseFarmApplicationsOptions = {
  applications: FarmApplication[];
};

export function useFarmApplications({ applications }: UseFarmApplicationsOptions) {
  const [selectedStatus, setSelectedStatus] = useState<'Hepsi' | FarmStatus>('Hepsi');
  const [records, setRecords] = useState<FarmApplication[]>(applications);
  const [inspectedApplication, setInspectedApplication] = useState<FarmApplication | null>(null);
  const [rejectedApplication, setRejectedApplication] = useState<FarmApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [documentReviews, setDocumentReviews] = useState<DocumentReviewState>({});

  useEffect(() => {
    if (!inspectedApplication) {
      setDocumentReviews({});
      return;
    }

    const initialReviews = inspectedApplication.documents.reduce<DocumentReviewState>(
      (acc, doc) => {
        acc[doc.name] = { status: doc.status, reason: doc.farmerNote };
        return acc;
      },
      {},
    );

    setDocumentReviews(initialReviews);
  }, [inspectedApplication]);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'Hepsi') {
      return records;
    }

    return records.filter((application) => application.status === selectedStatus);
  }, [records, selectedStatus]);

  const closeInspectModal = () => setInspectedApplication(null);

  const updateDocumentStatus = (name: string, status: DocumentReviewState[string]['status']) => {
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

  return {
    selectedStatus,
    setSelectedStatus,
    applications: records,
    setApplications: setRecords,
    inspectedApplication,
    setInspectedApplication,
    rejectedApplication,
    setRejectedApplication,
    rejectReason,
    setRejectReason,
    documentReviews,
    setDocumentReviews,
    updateDocumentStatus,
    updateDocumentReason,
    filteredApplications,
    closeInspectModal,
  };
}

