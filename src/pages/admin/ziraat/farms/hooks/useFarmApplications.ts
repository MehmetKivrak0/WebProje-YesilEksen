import { useEffect, useMemo, useState } from 'react';
import { ziraatService, type FarmApplication as ApiFarmApplication } from '../../../../../services/ziraatService';
import type { DocumentReviewState, FarmApplication, FarmStatus, FarmDocument, DocumentStatus } from '../types';

export type ToastState = { message: string; tone: 'success' | 'error' } | null;

// Backend status değerlerini frontend status değerlerine map et
// ciftlikler tablosundaki durum değerleri: 'beklemede', 'aktif', 'pasif', 'askida', 'iptal', 'silindi'
const mapStatusFromBackend = (status: string): Exclude<FarmStatus, 'Aktif' | 'Beklemede' | 'Askıda'> => {
  const statusMap: Record<string, Exclude<FarmStatus, 'Aktif' | 'Beklemede' | 'Askıda'>> = {
    'beklemede': 'İlk İnceleme',
    'aktif': 'Onaylandı',
    'pasif': 'Evrak Bekliyor', // Reddedildi
    'askida': 'İlk İnceleme',
    'iptal': 'Evrak Bekliyor',
    // Eski mapping'ler (geriye dönük uyumluluk için)
    'ilk_inceleme': 'İlk İnceleme',
    'denetimde': 'İlk İnceleme', // Denetimde durumu artık kullanılmıyor, İlk İnceleme'ye map ediliyor
    'onaylandi': 'Onaylandı',
    'reddedildi': 'Evrak Bekliyor',
    'yeni': 'İlk İnceleme',
  };
  return statusMap[status.toLowerCase()] || 'İlk İnceleme';
};

// Backend'den gelen veriyi frontend formatına çevir
const mapApiApplicationToFarmApplication = (apiApp: ApiFarmApplication): FarmApplication => {
  // Tarih formatlaması için yardımcı fonksiyon
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Bekleniyor';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch {
      return 'Bekleniyor';
    }
  };

  // Belgeleri map et - backend'den gelen belgeler array'i
  const mapDocuments = (docs: any[] | null | undefined): FarmDocument[] => {
    if (!docs || !Array.isArray(docs)) return [];
    
    return docs.map((doc) => ({
      name: doc.name || 'Belirtilmemiş',
      status: (doc.status as DocumentStatus) || 'Beklemede',
      url: doc.url || undefined,
      belgeId: doc.belgeId || undefined,
      farmerNote: doc.farmerNote || undefined,
      adminNote: doc.adminNote || undefined,
    }));
  };

  return {
    id: apiApp.id,
    farm: apiApp.name,
    owner: apiApp.owner,
    location: apiApp.sector || 'Belirtilmemiş',
    status: mapStatusFromBackend(apiApp.status),
    lastUpdate: formatDate(apiApp.lastUpdate || apiApp.applicationDate),
    notes: apiApp.description || '',
    wasteTypes: apiApp.wasteTypes || [],
    contact: {
      name: apiApp.owner,
      phone: apiApp.phone || '', // Backend'den gelen telefon bilgisi
      email: apiApp.email || '',
    },
    documents: mapDocuments(apiApp.documents),
  };
};

export function useFarmApplications() {
  const [selectedStatus, setSelectedStatus] = useState<'Hepsi' | FarmStatus>('Hepsi');
  const [records, setRecords] = useState<FarmApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspectedApplication, setInspectedApplication] = useState<FarmApplication | null>(null);
  const [rejectedApplication, setRejectedApplication] = useState<FarmApplication | null>(null);
  const [previewApplication, setPreviewApplication] = useState<FarmApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  // Her uygulama için ayrı documentReviews sakla (applicationId -> DocumentReviewState)
  const [documentReviewsByApplication, setDocumentReviewsByApplication] = useState<Record<string, DocumentReviewState>>({});
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  // Verileri yükle
  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ciftlik_basvurulari tablosundaki durum değerlerine göre mapping
      const statusParam = selectedStatus === 'Hepsi' ? undefined : 
        selectedStatus === 'İlk İnceleme' ? 'ilk_inceleme' :
        selectedStatus === 'Onaylandı' ? 'onaylandi' :
        selectedStatus === 'Evrak Bekliyor' ? 'reddedildi' : undefined;

      console.log('🔍 Farm applications yükleniyor:', { selectedStatus, statusParam });

      const response = await ziraatService.getFarmApplications({
        status: statusParam,
      });

      console.log('📥 API Response:', {
        success: response.success,
        count: response.applications?.length || 0,
        applications: response.applications?.slice(0, 3).map(a => ({
          id: a.id,
          name: a.name,
          status: a.status
        }))
      });

      if (response.success) {
        const mappedApplications = response.applications.map(mapApiApplicationToFarmApplication);
        console.log('✅ Mapped applications:', mappedApplications.length);
        setRecords(mappedApplications);
      } else {
        setError('Başvurular yüklenemedi');
      }
    } catch (err) {
      console.error('❌ Farm applications yükleme hatası:', err);
      setError('Başvurular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Mevcut uygulama için documentReviews'i al
  const getDocumentReviews = (applicationId: string): DocumentReviewState => {
    return documentReviewsByApplication[applicationId] || {};
  };

  // DocumentReviews'i güncelle
  const updateDocumentReviews = (applicationId: string, reviews: DocumentReviewState) => {
    setDocumentReviewsByApplication((prev) => ({
      ...prev,
      [applicationId]: reviews,
    }));
  };

  useEffect(() => {
    if (!inspectedApplication) {
      return;
    }

    // Eğer bu uygulama için daha önce reviews yoksa, başlangıç değerlerini oluştur
    setDocumentReviewsByApplication((prev) => {
      if (prev[inspectedApplication.id]) {
        return prev; // Zaten varsa güncelleme
      }
      
      const initialReviews = inspectedApplication.documents.reduce<DocumentReviewState>(
        (acc, doc) => {
          acc[doc.name] = { 
            status: doc.status, 
            reason: doc.farmerNote,
            adminNote: doc.adminNote
          };
          return acc;
        },
        {},
      );

      return {
        ...prev,
        [inspectedApplication.id]: initialReviews,
      };
    });
  }, [inspectedApplication]);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'Hepsi') {
      return records;
    }

    return records.filter((application) => application.status === selectedStatus);
  }, [records, selectedStatus]);

  const closeInspectModal = () => setInspectedApplication(null);

  const updateDocumentStatus = (name: string, status: DocumentReviewState[string]['status']) => {
    if (!inspectedApplication) return;
    
    const applicationId = inspectedApplication.id;
    const currentReviews = getDocumentReviews(applicationId);
    
    // Zaten aynı durumdaysa işlem yapma
    const document = inspectedApplication.documents.find(d => d.name === name);
    const currentStatus = currentReviews[name]?.status || document?.status;
    if (currentStatus === status) {
      setToast({
        message: `${name} belgesi zaten ${status} durumunda.`,
        tone: 'error',
      });
      return;
    }

    // Red işlemi için reason kontrolü
    if (status === 'Reddedildi') {
      const currentReason = currentReviews[name]?.reason;
      if (!currentReason || !currentReason.trim()) {
        // Önce status'u local state'te 'Reddedildi' yap ki reason formu görünsün
        updateDocumentReviews(applicationId, {
          ...currentReviews,
          [name]: {
            status: 'Reddedildi',
            reason: currentReviews[name]?.reason || '',
            adminNote: currentReviews[name]?.adminNote,
          },
        });
        
        setToast({
          message: `${name} belgesini reddetmek için lütfen red nedeni belirtin. Lütfen aşağıdaki "Çiftçiye iletilecek açıklama" alanına red nedenini yazın.`,
          tone: 'error',
        });
        
        // Reason textarea'sına scroll yapılması InspectModal'da yapılıyor
        return;
      }
    }

    // Sadece local state'i güncelle - backend'e gönderme
    updateDocumentReviews(applicationId, {
      ...currentReviews,
      [name]: {
        status,
        reason: status === 'Reddedildi' ? currentReviews[name]?.reason : undefined,
        adminNote: currentReviews[name]?.adminNote,
      },
    });

    const statusMessage = status === 'Onaylandı' ? 'onaylandı' : 'reddedildi';
    setToast({
      message: `${name} belgesi ${statusMessage} olarak işaretlendi. Değişiklikler onaylandığında kaydedilecek.`,
      tone: 'success',
    });
  };

  const updateDocumentReason = (name: string, reason: string) => {
    if (!inspectedApplication) return;
    
    const applicationId = inspectedApplication.id;
    const currentReviews = getDocumentReviews(applicationId);
    
    // Sadece local state'i güncelle - backend'e gönderme
    updateDocumentReviews(applicationId, {
      ...currentReviews,
      [name]: {
        status: currentReviews[name]?.status ?? 'Reddedildi',
        reason,
        adminNote: currentReviews[name]?.adminNote,
      },
    });
  };

  const updateDocumentAdminNote = (name: string, adminNote: string) => {
    if (!inspectedApplication) return;
    
    const applicationId = inspectedApplication.id;
    const currentReviews = getDocumentReviews(applicationId);
    
    // Sadece local state'i güncelle - backend'e gönderme
    updateDocumentReviews(applicationId, {
      ...currentReviews,
      [name]: {
        status: currentReviews[name]?.status ?? 'Beklemede',
        reason: currentReviews[name]?.reason,
        adminNote,
      },
    });
  };

  // Belge değişikliklerini kontrol et ve backend'e gönderilecek güncellemeleri hazırla
  const prepareDocumentUpdates = (
    documents: FarmDocument[],
    reviews: DocumentReviewState
  ): Array<{ belgeId: string; data: { status: string; reason?: string; adminNote?: string } }> => {
    const updates: Array<{ belgeId: string; data: { status: string; reason?: string; adminNote?: string } }> = [];

    for (const doc of documents) {
      const review = reviews[doc.name];
      if (!review || !doc.belgeId) continue;

      const statusChanged = review.status !== doc.status;
      const hasReason = review.reason && review.reason.trim();
      const adminNoteChanged = review.adminNote !== (doc.adminNote || '');

      // Reason varsa her zaman gönder (her "İlet" dendiğinde güncellenen reason gönderilsin)
      // Status veya adminNote değişmişse de gönder
      const shouldUpdate = statusChanged || hasReason || adminNoteChanged;

      if (shouldUpdate) {
        updates.push({
          belgeId: doc.belgeId,
          data: {
            status: review.status,
            reason: review.reason?.trim() || undefined,
            adminNote: review.adminNote?.trim() || undefined,
          },
        });
      }
    }

    return updates;
  };

  // Belge güncellemelerini backend'e gönder
  const updateDocuments = async (
    updates: Array<{ belgeId: string; data: { status: string; reason?: string; adminNote?: string } }>
  ): Promise<void> => {
    if (updates.length === 0) return;

    const promises = updates.map(({ belgeId, data }) =>
      ziraatService.updateDocumentStatus(belgeId, data)
    );

    const results = await Promise.allSettled(promises);
    const failed = results.filter((r) => r.status === 'rejected');

    if (failed.length > 0) {
      console.error('Bazı belge güncellemeleri başarısız:', failed);
      // Devam et, çünkü bazı belgeler güncellenmiş olabilir
    }
  };

  // Onay işlemi sonrası state'i temizle
  const cleanupAfterApproval = (applicationId: string) => {
    setInspectedApplication(null);
    setPreviewApplication(null);
    setDocumentReviewsByApplication((prev) => {
      const newState = { ...prev };
      delete newState[applicationId];
      return newState;
    });
  };

  const handleApprove = async (application: FarmApplication) => {
    // Validasyon: Zaten onaylanmışsa işlem yapma
    if (application.status === 'Onaylandı') {
      setToast({
        message: `${application.farm} çiftliği zaten onaylanmış durumda.`,
        tone: 'error',
      });
      return;
    }

    // Loading state başlat
    setApprovingId(application.id);
    setError(null);

    try {
      const applicationReviews = getDocumentReviews(application.id);

      // 1. Belge güncellemelerini hazırla ve gönder
      const documentUpdates = prepareDocumentUpdates(application.documents, applicationReviews);
      await updateDocuments(documentUpdates);

      // 2. Çiftlik onayını yap
      // ID'nin geçerli olduğundan emin ol
      if (!application.id || typeof application.id !== 'string') {
        throw new Error('Geçersiz başvuru ID\'si');
      }
      
      const response = await ziraatService.approveFarm(application.id);

      if (response.success) {
        // Başarılı mesajı göster
        setToast({
          message: `${application.farm} çiftliği ve belgeler başarıyla onaylandı.`,
          tone: 'success',
        });

        // Listeyi yenile
        await loadApplications();

        // State'i temizle
        cleanupAfterApproval(application.id);
      } else {
        const errorMessage = response.message || 'Onay işlemi başarısız oldu';
        setError(errorMessage);
        setToast({
          message: errorMessage,
          tone: 'error',
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Onay işlemi sırasında bir hata oluştu';
      console.error('Onay hatası:', err);
      setError(errorMessage);
      setToast({
        message: errorMessage,
        tone: 'error',
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (application: FarmApplication, reason: string) => {
    if (!reason.trim()) {
      setToast({
        message: 'Red nedeni belirtilmelidir.',
        tone: 'error',
      });
      return;
    }

    // Loading state başlat
    setRejectingId(application.id);
    setError(null);

    try {
      const response = await ziraatService.rejectFarm(application.id, { reason });
      
      if (response.success) {
        // Başarılı mesajı göster
        setToast({
          message: `${application.farm} çiftliği reddedildi.`,
          tone: 'success',
        });
        
        // Listeyi yenile
        await loadApplications();
        
        // Modal'ı kapat ve state'i temizle
        setRejectedApplication(null);
        setRejectReason('');
      } else {
        const errorMessage = response.message || 'Red işlemi başarısız oldu';
        setError(errorMessage);
        setToast({
          message: errorMessage,
          tone: 'error',
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Red işlemi sırasında bir hata oluştu';
      console.error('Red hatası:', err);
      setError(errorMessage);
      setToast({
        message: errorMessage,
        tone: 'error',
      });
    } finally {
      setRejectingId(null);
    }
  };

  // Toast otomatik kapanma
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return {
    selectedStatus,
    setSelectedStatus,
    applications: records,
    setApplications: setRecords,
    inspectedApplication,
    setInspectedApplication,
    rejectedApplication,
    setRejectedApplication,
    previewApplication,
    setPreviewApplication,
    rejectReason,
    setRejectReason,
    getDocumentReviews,
    updateDocumentStatus,
    updateDocumentReason,
    updateDocumentAdminNote,
    filteredApplications,
    closeInspectModal,
    handleApprove,
    handleReject,
    loading,
    error,
    loadApplications,
    approvingId,
    rejectingId,
    toast,
    setToast,
  };
}

