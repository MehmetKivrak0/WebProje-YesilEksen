import { useEffect, useMemo, useState } from 'react';
import { ziraatService, type FarmApplication as ApiFarmApplication } from '../../../../../services/ziraatService';
import type { DocumentReviewState, FarmApplication, FarmStatus } from '../types';

// Backend status değerlerini frontend status değerlerine map et
// ciftlikler tablosundaki durum değerleri: 'beklemede', 'aktif', 'pasif', 'askida', 'iptal', 'silindi'
const mapStatusFromBackend = (status: string): Exclude<FarmStatus, 'Aktif' | 'Beklemede' | 'Askıda'> => {
  const statusMap: Record<string, Exclude<FarmStatus, 'Aktif' | 'Beklemede' | 'Askıda'>> = {
    'beklemede': 'İlk İnceleme',
    'aktif': 'Onaylandı',
    'pasif': 'Evrak Bekliyor', // Reddedildi
    'askida': 'Denetimde',
    'iptal': 'Evrak Bekliyor',
    // Eski mapping'ler (geriye dönük uyumluluk için)
    'ilk_inceleme': 'İlk İnceleme',
    'denetimde': 'Denetimde',
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
    inspectionDate: formatDate(apiApp.inspectionDate),
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
  const [rejectReason, setRejectReason] = useState('');
  const [documentReviews, setDocumentReviews] = useState<DocumentReviewState>({});

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
        selectedStatus === 'Denetimde' ? 'denetimde' :
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

  useEffect(() => {
    if (!inspectedApplication) {
      setDocumentReviews({});
      return;
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

    setDocumentReviews(initialReviews);
  }, [inspectedApplication]);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'Hepsi') {
      return records;
    }

    return records.filter((application) => application.status === selectedStatus);
  }, [records, selectedStatus]);

  const closeInspectModal = () => setInspectedApplication(null);

  const updateDocumentStatus = async (name: string, status: DocumentReviewState[string]['status']) => {
    // Belge ID'sini bul
    const document = inspectedApplication?.documents.find(d => d.name === name);
    if (!document?.belgeId) {
      console.warn('Belge ID bulunamadı:', name);
      // Yine de state'i güncelle
      setDocumentReviews((prev) => ({
        ...prev,
        [name]: {
          status,
          reason: status === 'Reddedildi' ? prev[name]?.reason : undefined,
          adminNote: prev[name]?.adminNote,
        },
      }));
      return;
    }

    // State'i güncelle
    setDocumentReviews((prev) => ({
      ...prev,
      [name]: {
        status,
        reason: status === 'Reddedildi' ? prev[name]?.reason : undefined,
        adminNote: prev[name]?.adminNote,
      },
    }));

    // Backend'e gönder
    try {
      await ziraatService.updateDocumentStatus(document.belgeId, {
        status,
        reason: status === 'Reddedildi' ? documentReviews[name]?.reason : undefined,
        adminNote: documentReviews[name]?.adminNote,
      });
    } catch (error) {
      console.error('Belge durumu güncelleme hatası:', error);
    }
  };

  const updateDocumentReason = async (name: string, reason: string) => {
    // Belge ID'sini bul
    const document = inspectedApplication?.documents.find(d => d.name === name);
    
    // State'i güncelle
    setDocumentReviews((prev) => ({
      ...prev,
      [name]: {
        status: prev[name]?.status ?? 'Reddedildi',
        reason,
        adminNote: prev[name]?.adminNote,
      },
    }));

    // Backend'e gönder
    if (document?.belgeId) {
      try {
        await ziraatService.updateDocumentStatus(document.belgeId, {
          status: documentReviews[name]?.status ?? 'Reddedildi',
          reason,
          adminNote: documentReviews[name]?.adminNote,
        });
      } catch (error) {
        console.error('Belge reason güncelleme hatası:', error);
      }
    }
  };

  const updateDocumentAdminNote = async (name: string, adminNote: string) => {
    // Belge ID'sini bul
    const document = inspectedApplication?.documents.find(d => d.name === name);
    
    // State'i güncelle
    setDocumentReviews((prev) => ({
      ...prev,
      [name]: {
        status: prev[name]?.status ?? 'Beklemede',
        reason: prev[name]?.reason,
        adminNote,
      },
    }));

    // Backend'e gönder
    if (document?.belgeId) {
      try {
        await ziraatService.updateDocumentStatus(document.belgeId, {
          status: documentReviews[name]?.status ?? 'Beklemede',
          reason: documentReviews[name]?.reason,
          adminNote,
        });
      } catch (error) {
        console.error('Belge admin note güncelleme hatası:', error);
      }
    }
  };

  const handleApprove = async (application: FarmApplication) => {
    try {
      const response = await ziraatService.approveFarm(application.id);
      if (response.success) {
        await loadApplications();
        setInspectedApplication(null);
      } else {
        setError('Onay işlemi başarısız oldu');
      }
    } catch (err) {
      console.error('Onay hatası:', err);
      setError('Onay işlemi sırasında bir hata oluştu');
    }
  };

  const handleReject = async (application: FarmApplication, reason: string) => {
    try {
      const response = await ziraatService.rejectFarm(application.id, { reason });
      if (response.success) {
        await loadApplications();
        setRejectedApplication(null);
        setRejectReason('');
      } else {
        setError('Red işlemi başarısız oldu');
      }
    } catch (err) {
      console.error('Red hatası:', err);
      setError('Red işlemi sırasında bir hata oluştu');
    }
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
    updateDocumentAdminNote,
    filteredApplications,
    closeInspectModal,
    handleApprove,
    handleReject,
    loading,
    error,
    loadApplications,
  };
}

