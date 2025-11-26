import { useEffect, useMemo, useState } from 'react';
import { ziraatService, type FarmApplication as ApiFarmApplication } from '../../../../../services/ziraatService';
import type { DocumentReviewState, FarmApplication, FarmStatus, FarmDocument, DocumentStatus } from '../types';

export type ToastState = { message: string; tone: 'success' | 'error' } | null;

// Backend status değerlerini frontend status değerlerine map et
// ciftlikler tablosundaki durum değerleri: 'beklemede', 'aktif', 'pasif', 'askida', 'iptal', 'silindi'
const mapStatusFromBackend = (status: string | null | undefined): Exclude<FarmStatus, 'Aktif' | 'Beklemede' | 'Askıda'> => {
  // Null veya undefined kontrolü
  if (!status || typeof status !== 'string') {
    console.warn('⚠️ [MAP STATUS] Geçersiz durum değeri:', status);
    return 'İlk İnceleme';
  }
  
  const statusLower = status.toLowerCase().trim();
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
    'belge_eksik': 'Belge Eksik', // Belge eksik durumu
    'yeni': 'İlk İnceleme',
  };
  
  const mappedStatus = statusMap[statusLower] || 'İlk İnceleme';
  
  // Belge Eksik durumu için özel log
  if (statusLower === 'belge_eksik' && mappedStatus === 'Belge Eksik') {
    console.log('✅ [MAP STATUS] Belge Eksik durumu doğru map edildi:', {
      originalStatus: status,
      statusLower,
      mappedStatus
    });
  } else if (statusLower === 'belge_eksik' && mappedStatus !== 'Belge Eksik') {
    console.error('❌ [MAP STATUS] Belge Eksik durumu yanlış map edildi!', {
      originalStatus: status,
      statusLower,
      mappedStatus,
      expected: 'Belge Eksik'
    });
  }
  
  return mappedStatus;
};

// Backend'den gelen veriyi frontend formatına çevir
const mapApiApplicationToFarmApplication = (apiApp: ApiFarmApplication): FarmApplication => {
  // Backend'den gelen durumu logla (debug için)
  if (apiApp.status === 'belge_eksik' || apiApp.status?.toLowerCase() === 'belge_eksik') {
    console.log('🔍 [MAP] Belge Eksik durumu tespit edildi:', {
      id: apiApp.id,
      name: apiApp.name,
      backendStatus: apiApp.status,
      statusType: typeof apiApp.status
    });
  }
  
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
      zorunlu: doc.zorunlu !== undefined ? doc.zorunlu : true, // Default true
    }));
  };

  const mappedStatus = mapStatusFromBackend(apiApp.status);
  
  // Belge Eksik durumu için özel log
  if (mappedStatus === 'Belge Eksik') {
    console.log('✅ [MAP] Başvuru durumu "Belge Eksik" olarak map edildi:', {
      id: apiApp.id,
      name: apiApp.name,
      backendStatus: apiApp.status,
      frontendStatus: mappedStatus
    });
  }
  
  return {
    id: apiApp.id,
    farm: apiApp.name,
    owner: apiApp.owner,
    location: apiApp.sector || 'Belirtilmemiş',
    status: mappedStatus,
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
  const [allApplications, setAllApplications] = useState<FarmApplication[]>([]); // İstatistikler için tüm başvurular
  const [approvedFarmCount, setApprovedFarmCount] = useState(0);
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
  const [updatingDocumentId, setUpdatingDocumentId] = useState<string | null>(null); // Belge güncelleme durumu
  const [toast, setToast] = useState<ToastState>(null);

  // Verileri yükle
  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  useEffect(() => {
    loadApprovedFarmCount();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ciftlik_basvurulari tablosundaki durum değerlerine göre mapping
      const statusParam = selectedStatus === 'Hepsi' ? undefined : 
        selectedStatus === 'İlk İnceleme' ? 'ilk_inceleme' :
        selectedStatus === 'Onaylandı' ? 'onaylandi' :
        selectedStatus === 'Belge Eksik' ? 'belge_eksik' :
        selectedStatus === 'Evrak Bekliyor' ? 'reddedildi' : undefined;

      console.log('🔍 Farm applications yükleniyor:', { selectedStatus, statusParam });

      // Filtrelenmiş veriyi yükle
      const response = await ziraatService.getFarmApplications({
        status: statusParam,
      });

      // İstatistikler için tüm başvuruları yükle (filtre olmadan)
      const allResponse = selectedStatus !== 'Hepsi' 
        ? await ziraatService.getFarmApplications({})
        : response;

      console.log('📥 API Response:', {
        success: response.success,
        count: response.applications?.length || 0,
        applications: response.applications?.slice(0, 5).map(a => ({
          id: a.id,
          name: a.name,
          status: a.status, // Backend'den gelen ham durum
          statusType: typeof a.status,
          statusLower: a.status?.toLowerCase(),
          isBelgeEksik: a.status?.toLowerCase() === 'belge_eksik'
        })),
        // Tüm başvurulardaki durumları kontrol et
        allStatuses: response.applications?.map(a => ({
          id: a.id,
          status: a.status
        })) || []
      });

      if (response.success) {
        const mappedApplications = response.applications.map(mapApiApplicationToFarmApplication);
        const statusDistribution = mappedApplications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log('🔄 [LOAD APPLICATIONS] Başvurular map edildi:', {
          count: mappedApplications.length,
          statusDistribution,
          // Backend'den gelen ham durumları da göster
          backendStatuses: response.applications?.map(a => ({
            id: a.id,
            name: a.name,
            backendStatus: a.status,
            mappedStatus: mappedApplications.find(m => m.id === a.id)?.status
          })) || []
        });
        setRecords(mappedApplications);

        // Tüm başvuruları istatistikler için kaydet
        if (allResponse.success) {
          const mappedAllApplications = allResponse.applications.map(mapApiApplicationToFarmApplication);
          setAllApplications(mappedAllApplications);
        }
      } else {
        setError('Başvurular yüklenemedi');
      }
    } catch (err) {
      console.error('Farm applications yükleme hatası:', err);
      setError('Başvurular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadApprovedFarmCount = async () => {
    try {
      const statsResponse = await ziraatService.getDashboardStats();
      if (statsResponse.success) {
        setApprovedFarmCount(statsResponse.stats?.farmSummary?.approved ?? 0);
      }
    } catch (err) {
      console.error('Onaylı çiftlik sayısı yüklenemedi:', err);
    }
  };

  const forceBelgeEksikStatus = async (applicationId: string, reason?: string) => {
    try {
      console.log(`💾 [FORCE BELGE EKSIK] Başvuru durumu güncelleniyor:`, {
        applicationId,
        status: 'belge_eksik',
        reason: reason || 'Zorunlu belgeler henüz tamamlanmadı.'
      });
      
      const response = await ziraatService.updateFarmApplicationStatus(applicationId, {
        status: 'belge_eksik',
        reason: reason || 'Zorunlu belgeler henüz tamamlanmadı.',
      });
      
      console.log(`✅ [FORCE BELGE EKSIK] Backend yanıtı:`, {
        success: response.success,
        message: response.message,
        status: (response as any).status
      });
      
      if (!response.success) {
        console.error('❌ [FORCE BELGE EKSIK] Backend başarısız yanıt döndü:', response);
      }
    } catch (err) {
      console.error('❌ [FORCE BELGE EKSIK] Belge eksik durumunu zorla ayarlama hatası:', err);
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

    // Records'tan güncel uygulamayı bul (eğer varsa)
    const currentApplication = records.find(app => app.id === inspectedApplication.id);
    const applicationToUse = currentApplication || inspectedApplication;

    // Eğer bu uygulama için daha önce reviews yoksa veya belgeler değişmişse, başlangıç değerlerini oluştur/güncelle
    setDocumentReviewsByApplication((prev) => {
      const existingReviews = prev[applicationToUse.id];
      
      // Eğer reviews yoksa veya belge sayısı değişmişse, yeniden oluştur
      const shouldUpdate = !existingReviews || 
        Object.keys(existingReviews).length !== applicationToUse.documents.length ||
        applicationToUse.documents.some(doc => {
          const review = existingReviews[doc.name];
          return !review || review.status !== doc.status;
        });

      if (!shouldUpdate && existingReviews) {
        return prev; // Zaten güncel, güncelleme
      }
      
      const initialReviews = applicationToUse.documents.reduce<DocumentReviewState>(
        (acc, doc) => {
          // Mevcut review varsa, onu koru (sadece eksik alanları doldur)
          const existingReview = existingReviews?.[doc.name];
          acc[doc.name] = { 
            status: existingReview?.status || doc.status, 
            reason: existingReview?.reason || doc.farmerNote,
            adminNote: existingReview?.adminNote || doc.adminNote,
            isSent: existingReview?.isSent || false,
          };
          return acc;
        },
        {},
      );

      return {
        ...prev,
        [applicationToUse.id]: initialReviews,
      };
    });

    // Eğer records'ta güncel uygulama varsa, inspectedApplication'ı güncelle
    if (currentApplication) {
      setInspectedApplication(currentApplication);
    }
  }, [inspectedApplication, records]);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'Hepsi') {
      return records;
    }

    return records.filter((application) => application.status === selectedStatus);
  }, [records, selectedStatus]);

  const closeInspectModal = () => setInspectedApplication(null);

  const updateDocumentStatus = async (name: string, status: DocumentReviewState[string]['status']) => {
    console.log('📤 [UPDATE DOCUMENT STATUS] Başlatıldı:', {
      belgAdi: name,
      yeniDurum: status,
      inspectedApplicationId: inspectedApplication?.id
    });

    if (!inspectedApplication) {
      console.error('❌ [UPDATE DOCUMENT STATUS] İncelenen başvuru bulunamadı');
      return;
    }
    
    const applicationId = inspectedApplication.id;
    const currentReviews = getDocumentReviews(applicationId);
    
    // Belgeyi bul
    const document = inspectedApplication.documents.find(d => d.name === name);
    
    if (!document) {
      console.error('❌ [UPDATE DOCUMENT STATUS] Belge bulunamadı:', name);
      setToast({
        message: `${name} belgesi bulunamadı.`,
        tone: 'error',
      });
      return;
    }

    console.log('📄 [UPDATE DOCUMENT STATUS] Belge bulundu:', {
      ad: document.name,
      belgeId: document.belgeId,
      mevcutDurum: document.status,
      url: document.url ? 'var' : 'yok'
    });

    // Belge ID'si kontrolü
    if (!document.belgeId) {
      console.error('❌ [UPDATE DOCUMENT STATUS] Belge ID bulunamadı:', {
        belgAdi: name,
        belge: document
      });
      setToast({
        message: `${name} belgesi için belge ID bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.`,
        tone: 'error',
      });
      return;
    }
    
    // Zaten aynı durumdaysa işlem yapma
    const currentStatus = currentReviews[name]?.status || document.status;
    if (currentStatus === status) {
      console.warn('⚠️ [UPDATE DOCUMENT STATUS] Belge zaten aynı durumda:', {
        belgAdi: name,
        durum: status
      });
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
        console.warn('⚠️ [UPDATE DOCUMENT STATUS] Red nedeni eksik, form gösteriliyor');
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

    // Loading state başlat
    console.log('⏳ [UPDATE DOCUMENT STATUS] Backend isteği gönderiliyor...', {
      belgeId: document.belgeId,
      yeniDurum: status
    });
    setUpdatingDocumentId(document.belgeId);

    try {
      // Backend'e direkt istek gönder
      const response = await ziraatService.updateDocumentStatus(document.belgeId, {
        status,
        reason: status === 'Reddedildi' ? currentReviews[name]?.reason : undefined,
        adminNote: currentReviews[name]?.adminNote,
      });

      console.log('✅ [UPDATE DOCUMENT STATUS] Backend yanıtı:', response);

      if (response.success) {
        // Local state'i güncelle
        updateDocumentReviews(applicationId, {
          ...currentReviews,
          [name]: {
            status,
            reason: status === 'Reddedildi' ? currentReviews[name]?.reason : undefined,
            adminNote: currentReviews[name]?.adminNote,
          },
        });

        // Belge durumunu application.documents'ta güncelle
        const updateApplicationDocuments = (app: FarmApplication) => {
          return {
            ...app,
            documents: app.documents.map((doc) =>
              doc.name === name ? { ...doc, status } : doc
            ),
          };
        };

        // Eğer başvuru durumu değiştiyse güncelle
        const applicationStatusChanged = (response as any).applicationStatusChanged;
        const newApplicationStatus = (response as any).applicationStatus;
        
        // Belge durumu "eksik" veya "reddedildi" ise ve belge zorunluysa, başvuru durumunu kontrol et
        const isProblemStatus = (status === 'Eksik' || status === 'Reddedildi');
        const updatedDocument = inspectedApplication?.documents.find(d => d.name === name);
        const isZorunlu = updatedDocument?.zorunlu !== false; // null veya undefined ise zorunlu kabul et
        
        if (applicationStatusChanged && newApplicationStatus) {
          console.log('🔄 [UPDATE DOCUMENT STATUS] Başvuru durumu değişti (backend):', newApplicationStatus);
          
          // Başvuru durumunu frontend formatına çevir
          const frontendStatus = mapStatusFromBackend(newApplicationStatus);
          
          // Başvuru durumunu güncelle
          setRecords((prev) =>
            prev.map((app) => {
              if (app.id === applicationId) {
                return {
                  ...updateApplicationDocuments(app),
                  status: frontendStatus,
                };
              }
              return app;
            })
          );
          
          // allApplications'ı da güncelle
          setAllApplications((prev) =>
            prev.map((app) => {
              if (app.id === applicationId) {
                return {
                  ...updateApplicationDocuments(app),
                  status: frontendStatus,
                };
              }
              return app;
            })
          );
          
          // Inspected application'ı da güncelle
          if (inspectedApplication && inspectedApplication.id === applicationId) {
            setInspectedApplication({
              ...updateApplicationDocuments(inspectedApplication),
              status: frontendStatus,
            });
          }
          
          const statusMessage = status === 'Onaylandı' ? 'onaylandı' : status === 'Reddedildi' ? 'reddedildi' : 'güncellendi';
          setToast({
            message: `${name} belgesi başarıyla ${statusMessage}. Başvuru durumu "${frontendStatus}" olarak güncellendi.`,
            tone: frontendStatus === 'Belge Eksik' ? 'error' : 'success',
          });
          
          // Başvuru durumu değiştiyse listeyi yenile (veritabanından güncel veriyi çek)
          console.log('🔄 [UPDATE DOCUMENT STATUS] Başvuru durumu değişti, liste yenileniyor...');
          // Kısa bir gecikme ekle (backend'in güncellemesi için)
          await new Promise(resolve => setTimeout(resolve, 500));
          await loadApplications();
        } else if (isProblemStatus && isZorunlu) {
          // Belge durumu "eksik" veya "reddedildi" ve zorunlu ise, başvuru durumunu "Belge Eksik" yap
          console.log('🔄 [UPDATE DOCUMENT STATUS] Zorunlu belge eksik/reddedildi, başvuru durumu güncelleniyor');
          
          setRecords((prev) =>
            prev.map((app) => {
              if (app.id === applicationId && app.status !== 'Belge Eksik') {
                return {
                  ...updateApplicationDocuments(app),
                  status: 'Belge Eksik',
                };
              }
              return updateApplicationDocuments(app);
            })
          );
          
          setAllApplications((prev) =>
            prev.map((app) => {
              if (app.id === applicationId && app.status !== 'Belge Eksik') {
                return {
                  ...updateApplicationDocuments(app),
                  status: 'Belge Eksik',
                };
              }
              return updateApplicationDocuments(app);
            })
          );
          
          // Inspected application'ı da güncelle
          if (inspectedApplication && inspectedApplication.id === applicationId) {
            setInspectedApplication({
              ...updateApplicationDocuments(inspectedApplication),
              status: 'Belge Eksik',
            });
          }
          
          setToast({
            message: `${name} belgesi ${status === 'Eksik' ? 'eksik' : 'reddedildi'}. Başvuru durumu "Belge Eksik" olarak güncellendi.`,
            tone: 'error',
          });
          
          // Başvuru durumu değiştiyse listeyi yenile (veritabanından güncel veriyi çek)
          console.log('🔄 [UPDATE DOCUMENT STATUS] Zorunlu belge eksik/reddedildi, liste yenileniyor...');
          // Kısa bir gecikme ekle (backend'in güncellemesi için)
          await new Promise(resolve => setTimeout(resolve, 500));
          await loadApplications();
        } else {
          // Belge durumunu application.documents'ta da güncelle
          setRecords((prev) =>
            prev.map((app) => {
              if (app.id === applicationId) {
                return updateApplicationDocuments(app);
              }
              return app;
            })
          );
          
          setAllApplications((prev) =>
            prev.map((app) => {
              if (app.id === applicationId) {
                return updateApplicationDocuments(app);
              }
              return app;
            })
          );
          
          // Inspected application'ı da güncelle
          if (inspectedApplication && inspectedApplication.id === applicationId) {
            setInspectedApplication(updateApplicationDocuments(inspectedApplication));
          }
          
          const statusMessage = status === 'Onaylandı' ? 'onaylandı' : status === 'Reddedildi' ? 'reddedildi' : 'güncellendi';
          console.log('🎉 [UPDATE DOCUMENT STATUS] İşlem başarılı:', statusMessage);
          setToast({
            message: `${name} belgesi başarıyla ${statusMessage}.`,
            tone: 'success',
          });
        }
      } else {
        console.error('❌ [UPDATE DOCUMENT STATUS] Backend hatası:', response.message);
        setToast({
          message: response.message || 'Belge güncellenemedi',
          tone: 'error',
        });
      }
    } catch (error: any) {
      console.error('❌ [UPDATE DOCUMENT STATUS] İstek hatası:', error);
      console.error('Hata detayları:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      const errorMessage = error?.response?.data?.message || error?.message || 'Belge güncellenirken bir hata oluştu';
      setToast({
        message: errorMessage,
        tone: 'error',
      });
    } finally {
      setUpdatingDocumentId(null);
    }
  };

  const updateDocumentReason = (name: string, reason: string, isSent?: boolean) => {
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
        isSent: isSent ?? currentReviews[name]?.isSent,
      },
    });
  };

  const updateDocumentAdminNote = (name: string, adminNote: string) => {
    if (!inspectedApplication) return;
    
    const applicationId = inspectedApplication.id;
    const currentReviews = getDocumentReviews(applicationId);
    
    // Sadece local state'i güncelle - backend'e gönderme
    // isSent flag'ini koru
    updateDocumentReviews(applicationId, {
      ...currentReviews,
      [name]: {
        status: currentReviews[name]?.status ?? 'Beklemede',
        reason: currentReviews[name]?.reason,
        adminNote,
        isSent: currentReviews[name]?.isSent,
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
      // belgeId kontrolü - null, undefined, boş string veya geçersiz format kontrolü
      if (!review || !doc.belgeId || typeof doc.belgeId !== 'string' || doc.belgeId.trim() === '') {
        if (!doc.belgeId) {
          console.warn(`Belge "${doc.name}" için belgeId bulunamadı, güncelleme atlanıyor.`);
        }
        continue;
      }

      const statusChanged = review.status !== doc.status;
      const hasReason = review.reason && review.reason.trim();
      const hasAdminNote = review.adminNote && review.adminNote.trim();
      const isSent = review.isSent === true; // "İlet" butonuna tıklanmış mı?

      // "İlet" butonuna tıklanmış belgeler için: hem reason hem adminNote backend'e gönder
      // "İlet" butonuna tıklanmamış belgeler için: sadece status değişikliği varsa gönder (reason ve adminNote gönderme)
      if (isSent && (hasReason || hasAdminNote)) {
        // "İlet" butonuna tıklanmış belgeler için reason ve adminNote gönder
        updates.push({
          belgeId: doc.belgeId,
          data: {
            status: review.status,
            reason: review.reason?.trim() || undefined,
            adminNote: review.adminNote?.trim() || undefined,
          },
        });
      } else if (statusChanged) {
        // Status değişikliği varsa (ama "İlet" butonuna tıklanmamışsa) sadece status gönder
        updates.push({
          belgeId: doc.belgeId,
          data: {
            status: review.status,
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

    const promises = updates.map(async ({ belgeId, data }, index) => {
      try {
        const response = await ziraatService.updateDocumentStatus(belgeId, data);
        
        // Backend'den success: false dönerse hata olarak kabul et
        if (!response.success) {
          const errorMessage = response.message || 'Belge güncellenemedi';
          console.error(`Belge güncelleme hatası (${belgeId}):`, errorMessage);
          throw { belgeId, error: errorMessage, originalError: { response: { data: response } } };
        }
        
        return response;
      } catch (error: any) {
        // Hata detaylarını daha anlaşılır hale getir
        let errorMessage = 'Bilinmeyen hata';
        
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        console.error(`Belge güncelleme hatası (${belgeId}):`, {
          errorMessage,
          status: error?.response?.status,
          data: error?.response?.data,
          originalError: error
        });
        
        // Hatayı tekrar fırlat ki Promise.allSettled'da yakalanabilsin
        throw { belgeId, error: errorMessage, originalError: error };
      }
    });

    const results = await Promise.allSettled(promises);
    const failed = results.filter((r) => r.status === 'rejected') as Array<{
      status: 'rejected';
      reason: { belgeId: string; error: string; originalError: any };
    }>;

    if (failed.length > 0) {
      const failedDetails = failed.map((f) => ({
        belgeId: f.reason.belgeId,
        error: f.reason.error,
      }));
      
      // Kullanıcıya detaylı hata mesajı göster
      const failedCount = failed.length;
      const totalCount = updates.length;
      const errorMessages = failedDetails.map(f => `Belge ${f.belgeId}: ${f.error}`).join('\n');
      
      // Hata mesajını daha yapılandırılmış şekilde logla
      const errorInfo = {
        message: `Bazı belge güncellemeleri başarısız oldu (${failedCount}/${totalCount})`,
        failed: failedDetails,
        total: totalCount,
        successful: totalCount - failedCount
      };
      
      if (failedCount === totalCount) {
        // Tüm güncellemeler başarısız olduysa hata fırlat
        console.error('[Belge Güncelleme Hatası]', errorInfo);
        const errorMessage = failedDetails.length === 1 
          ? `Belge güncellemesi başarısız oldu: Belge ${failedDetails[0].belgeId}: ${failedDetails[0].error}`
          : `${failedCount} belge güncellemesi başarısız oldu:\n${errorMessages}`;
        throw new Error(errorMessage);
      } else {
        // Bazı güncellemeler başarılı olduysa uyarı göster ama devam et
        console.warn('[Belge Güncelleme Uyarısı]', errorInfo);
      }
    }
  };

  // Onay işlemi sonrası state'i temizle
  const cleanupAfterApproval = (_applicationId: string) => {
    // Sadece preview modal'ı kapat, inspect modal açık kalabilir (güncellenmiş veriyle)
    setPreviewApplication(null);
    // Document reviews'i temizleme - güncel verilerle kalabilir
    // setDocumentReviewsByApplication((prev) => {
    //   const newState = { ...prev };
    //   delete newState[_applicationId];
    //   return newState;
    // });
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
      if (documentUpdates.length > 0) {
        try {
          await updateDocuments(documentUpdates);
        } catch (docError: any) {
          // Belge güncelleme hatalarını yakala ve kullanıcıya göster
          const errorMessage = docError?.message || 'Belge güncellemeleri sırasında bir hata oluştu';
          console.error('Belge güncelleme hatası:', docError);
          setError(errorMessage);
          setToast({
            message: errorMessage,
            tone: 'error',
          });
          // Belge güncellemeleri başarısız olduysa işlemi durdur
          setApprovingId(null);
          return;
        }
      }

      // 2. Belgeleri kontrol et - eksik belge var mı?
      const { hasMissing, missingDocuments } = checkMissingDocuments(application, applicationReviews);
      
      if (hasMissing) {
        // Eksik belgeler için belge durumlarını "Eksik" olarak işaretle ve veritabanına kaydet
        const missingDocumentUpdates: Array<{ belgeId: string; data: { status: string } }> = [];
        
        // Eksik belgeleri bul ve durumlarını "Eksik" olarak işaretle
        const zorunluBelgeler = application.documents.filter(doc => doc.zorunlu !== false);
        const eksikBelgeler = zorunluBelgeler.filter(doc => {
          const reviewStatus = applicationReviews[doc.name]?.status || doc.status;
          return reviewStatus !== 'Onaylandı' && (
            reviewStatus === 'Eksik' || 
            reviewStatus === 'Reddedildi' || 
            reviewStatus === 'Beklemede' || 
            !doc.url
          );
        });

        // Eksik belgeler için güncelleme hazırla
        for (const doc of eksikBelgeler) {
          if (doc.belgeId) {
            const reviewStatus = applicationReviews[doc.name]?.status || doc.status;
            // Eğer belge durumu "Eksik" değilse, "Eksik" olarak işaretle
            if (reviewStatus !== 'Eksik' && reviewStatus !== 'Onaylandı') {
              missingDocumentUpdates.push({
                belgeId: doc.belgeId,
                data: { status: 'Eksik' }
              });
            }
          }
        }

        // Eksik belgelerin durumlarını veritabanına kaydet
        if (missingDocumentUpdates.length > 0) {
          try {
            console.log(`📝 [APPROVE] ${missingDocumentUpdates.length} eksik belge durumu veritabanına kaydediliyor...`);
            await updateDocuments(missingDocumentUpdates);
            console.log(`✅ [APPROVE] Eksik belge durumları veritabanına kaydedildi`);
            
            // Belge durumları güncellendikten sonra kısa bir gecikme ekle
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (docError: any) {
            console.error('❌ [APPROVE] Eksik belge durumları kaydedilemedi:', docError);
            // Hata olsa bile devam et, çünkü başvuru durumunu güncellemek önemli
          }
        }

        // Eksik belge varsa, belge durumlarını güncelledikten sonra approveFarm'ı çağır
        // approveFarm backend'de belge eksik durumunu kontrol edip ciftlik_basvurulari tablosuna kaydedecek
        console.log(`💾 [APPROVE] Belge durumları güncellendi, approveFarm çağrılıyor...`);
        
        // approveFarm'ı çağır - backend belge eksik durumunu kontrol edip ciftlik_basvurulari tablosuna kaydedecek
        const response = await ziraatService.approveFarm(application.id);
        
        if (response.success) {
          if (response.status === 'belge_eksik') {
            const missingMessage = response.message || `Zorunlu belgelerden eksik/reddedilmiş/beklemede olanlar: ${missingDocuments.join(', ')}. Başvuru "Belge Eksik" durumuna alındı.`;
            
            setToast({
              message: missingMessage,
              tone: 'error',
            });

            // Local state'i güncelle
            setRecords((prev) =>
              prev.map((app) => {
                if (app.id === application.id) {
                  return { ...app, status: 'Belge Eksik' };
                }
                return app;
              })
            );
            setAllApplications((prev) =>
              prev.map((app) => {
                if (app.id === application.id) {
                  return { ...app, status: 'Belge Eksik' };
                }
                return app;
              })
            );
            
            // Listeyi yenile (veritabanından güncel durumu çek)
            console.log(`🔄 [APPROVE] Başvurular veritabanından yeniden yükleniyor...`);
            await loadApplications();
            console.log(`✅ [APPROVE] Başvurular yeniden yüklendi`);
          } else {
            // Beklenmeyen durum
            setToast({
              message: response.message || 'Onay işlemi tamamlandı.',
              tone: 'success',
            });
            await loadApplications();
          }
        } else {
          const errorMessage = response.message || 'Onay işlemi başarısız oldu';
          setError(errorMessage);
          setToast({
            message: errorMessage,
            tone: 'error',
          });
        }
        
        cleanupAfterApproval(application.id);
        return;
      }

      // 3. Çiftlik onayını yap (belgeler tamam ise)
      // ID'nin geçerli olduğundan emin ol
      if (!application.id || typeof application.id !== 'string') {
        throw new Error('Geçersiz başvuru ID\'si');
      }
      
      const response = await ziraatService.approveFarm(application.id);

        if (response.success) {
          if (response.status === 'belge_eksik') {
            // Backend'den eksik belgeler listesi gelirse, belge durumlarını güncelle
            const missingDocumentsFromBackend = response.missingDocuments || [];
            
            // Eksik belgeler için belge durumlarını "Eksik" olarak işaretle ve veritabanına kaydet
            const missingDocumentUpdates: Array<{ belgeId: string; data: { status: string } }> = [];
            
            if (missingDocumentsFromBackend.length > 0) {
              // Backend'den gelen eksik belgeler için güncelleme hazırla
              for (const doc of application.documents) {
                if (doc.belgeId && missingDocumentsFromBackend.some((md: any) => 
                  md.ad === doc.name || md.belgeId === doc.belgeId
                )) {
                  const reviewStatus = applicationReviews[doc.name]?.status || doc.status;
                  // Eğer belge durumu "Eksik" değilse, "Eksik" olarak işaretle
                  if (reviewStatus !== 'Eksik' && reviewStatus !== 'Onaylandı') {
                    missingDocumentUpdates.push({
                      belgeId: doc.belgeId,
                      data: { status: 'Eksik' }
                    });
                  }
                }
              }
            } else {
              // Backend'den liste gelmemişse, frontend'deki eksik belgeleri kontrol et
              const { missingDocuments: frontendMissingDocs } = checkMissingDocuments(application, applicationReviews);
              const zorunluBelgeler = application.documents.filter(doc => doc.zorunlu !== false);
              
              for (const doc of zorunluBelgeler) {
                if (doc.belgeId && frontendMissingDocs.includes(doc.name)) {
                  const reviewStatus = applicationReviews[doc.name]?.status || doc.status;
                  // Eğer belge durumu "Eksik" değilse, "Eksik" olarak işaretle
                  if (reviewStatus !== 'Eksik' && reviewStatus !== 'Onaylandı') {
                    missingDocumentUpdates.push({
                      belgeId: doc.belgeId,
                      data: { status: 'Eksik' }
                    });
                  }
                }
              }
            }

            // Eksik belgelerin durumlarını veritabanına kaydet
            if (missingDocumentUpdates.length > 0) {
              try {
                console.log(`📝 [APPROVE] Backend'den gelen ${missingDocumentUpdates.length} eksik belge durumu veritabanına kaydediliyor...`);
                await updateDocuments(missingDocumentUpdates);
                console.log(`✅ [APPROVE] Eksik belge durumları veritabanına kaydedildi`);
                
                // Belge durumları güncellendikten sonra kısa bir gecikme ekle
                await new Promise(resolve => setTimeout(resolve, 500));
              } catch (docError: any) {
                console.error('❌ [APPROVE] Eksik belge durumları kaydedilemedi:', docError);
                // Hata olsa bile devam et
              }
            }

            // Backend zaten belge eksik durumunu ciftlik_basvurulari tablosuna kaydetmiş
            const missingMessage =
              response.message ||
              `${application.farm} çiftliğinin zorunlu belgeleri henüz tamamlanmadı. Başvuru "Belge Eksik" durumuna alındı.`;
            
            console.log(`✅ [APPROVE] Backend belge eksik durumunu ciftlik_basvurulari tablosuna kaydetti`);
            
            setToast({
              message: missingMessage,
              tone: 'error',
            });

            // Local state'i güncelle
            setRecords((prev) =>
              prev.map((app) => {
                if (app.id === application.id) {
                  return { ...app, status: 'Belge Eksik' };
                }
                return app;
              })
            );
            setAllApplications((prev) =>
              prev.map((app) => {
                if (app.id === application.id) {
                  return { ...app, status: 'Belge Eksik' };
                }
                return app;
              })
            );
            
            // Listeyi yenile (veritabanından güncel durumu çek)
            console.log(`🔄 [APPROVE] Başvurular veritabanından yeniden yükleniyor...`);
            await loadApplications();
            console.log(`✅ [APPROVE] Başvurular yeniden yüklendi`);
            
            cleanupAfterApproval(application.id);
            return;
          }

          // Başarılı mesajı göster
        setToast({
          message: `${application.farm} çiftliği ve belgeler başarıyla onaylandı.`,
          tone: 'success',
        });

        // Önce local state'te başvurunun durumunu güncelle (anında UI güncellemesi için)
        console.log(`🔄 [QUICK APPROVE] Local state güncelleniyor - ${application.id} -> Onaylandı`);
        setRecords((prev) =>
          prev.map((app) => {
            if (app.id === application.id) {
              console.log(`✅ [QUICK APPROVE] Başvuru bulundu ve güncellendi:`, {
                id: app.id,
                eskiDurum: app.status,
                yeniDurum: 'Onaylandı'
              });
              return { ...app, status: 'Onaylandı' };
            }
            return app;
          })
        );

        // Listeyi yenile (backend'den güncel veriyi çek)
        console.log('🔄 [QUICK APPROVE] Backend\'den liste yenileniyor...');
        await loadApplications();
        console.log('✅ [QUICK APPROVE] Liste yenileme tamamlandı');

        // İstatistikleri güncelle (onaylanan çiftlik sayısı)
        console.log('🔄 [QUICK APPROVE] İstatistikler güncelleniyor...');
        await loadApprovedFarmCount();
        console.log('✅ [QUICK APPROVE] İstatistikler güncellendi');

        // State'i temizle (loadApplications sonrası records güncellenecek, useEffect inspectedApplication'ı güncelleyecek)
        cleanupAfterApproval(application.id);
        
        // Sayfayı yenile (kullanıcı başarı mesajını görebilsin diye kısa bir gecikme ile)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorMessage = response.message || 'Onay işlemi başarısız oldu';
        setError(errorMessage);
        setToast({
          message: errorMessage,
          tone: 'error',
        });
      }
    } catch (err: any) {
      console.error('Onay hatası:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Onay işlemi sırasında bir hata oluştu';
      setError(errorMessage);
      setToast({
        message: errorMessage,
        tone: 'error',
      });
    } finally {
      setApprovingId(null);
    }
  };

  // Zorunlu belgelerin durumunu kontrol et
  const checkRequiredDocuments = (
    application: FarmApplication,
  ): { allApproved: boolean; hasRejected: boolean } => {
    const zorunluBelgeler = application.documents.filter(doc => doc.zorunlu !== false); // zorunlu undefined ise true kabul et
    
    if (zorunluBelgeler.length === 0) {
      // Zorunlu belge yoksa, tüm belgeleri kontrol et
      const allApproved = application.documents.every(doc => doc.status === 'Onaylandı');
      const hasRejected = application.documents.some(doc => doc.status === 'Reddedildi');
      return { allApproved, hasRejected };
    }
    
    const allApproved = zorunluBelgeler.every(doc => doc.status === 'Onaylandı');
    const hasRejected = zorunluBelgeler.some(doc => doc.status === 'Reddedildi');
    
    return { allApproved, hasRejected };
  };

  // Belgeleri kontrol et ve eksik belge var mı kontrol et
  const checkMissingDocuments = (
    application: FarmApplication,
    documentReviews?: DocumentReviewState
  ): { hasMissing: boolean; missingDocuments: string[] } => {
    const zorunluBelgeler = application.documents.filter(doc => doc.zorunlu !== false);
    
    if (zorunluBelgeler.length === 0) {
      // Zorunlu belge yoksa, tüm belgeleri kontrol et
      const eksikBelgeler = application.documents.filter(doc => {
        const reviewStatus = documentReviews?.[doc.name]?.status || doc.status;
        return reviewStatus !== 'Onaylandı' && (reviewStatus === 'Eksik' || reviewStatus === 'Reddedildi' || reviewStatus === 'Beklemede' || !doc.url);
      });
      return {
        hasMissing: eksikBelgeler.length > 0,
        missingDocuments: eksikBelgeler.map(doc => doc.name)
      };
    }
    
    // Zorunlu belgelerden eksik/reddedilmiş/beklemede olanları kontrol et
    const eksikBelgeler = zorunluBelgeler.filter(doc => {
      const reviewStatus = documentReviews?.[doc.name]?.status || doc.status;
      // 1 tane de olsa belge eksik/reddedilmiş/beklemede ise eksik sayılır
      return reviewStatus !== 'Onaylandı' && (
        reviewStatus === 'Eksik' || 
        reviewStatus === 'Reddedildi' || 
        reviewStatus === 'Beklemede' || 
        !doc.url
      );
    });
    
    return {
      hasMissing: eksikBelgeler.length > 0,
      missingDocuments: eksikBelgeler.map(doc => doc.name)
    };
  };

  // Başvuru listesinden direkt onaylama
  const handleQuickApprove = async (application: FarmApplication) => {
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
      // Belgeleri kontrol et - eksik belge var mı?
      const { hasMissing, missingDocuments } = checkMissingDocuments(application);
      
      if (hasMissing) {
        // Eksik belge varsa durumu "belge_eksik" olarak kaydet
        const missingMessage = `Zorunlu belgelerden eksik/reddedilmiş/beklemede olanlar: ${missingDocuments.join(', ')}. Başvuru "Belge Eksik" durumuna alındı.`;
        
        setToast({
          message: missingMessage,
          tone: 'error',
        });

        // Local state'i güncelle
        setRecords((prev) =>
          prev.map((app) =>
            app.id === application.id ? { ...app, status: 'Belge Eksik' } : app
          )
        );
        setAllApplications((prev) =>
          prev.map((app) =>
            app.id === application.id ? { ...app, status: 'Belge Eksik' } : app
          )
        );

        // Veritabanına durumu kaydet
        try {
          await forceBelgeEksikStatus(application.id, missingMessage);
        } catch (statusError) {
          // Durum güncelleme hatası olsa bile devam et
        }
        await loadApplications();
        return;
      }

      // Backend'e onay isteği gönder (belgeler tamam ise)
      const response = await ziraatService.approveFarm(application.id);

      if (response.success) {
        // Backend zorunlu belgeleri kontrol eder; eksikse "belge_eksik" döner
        if (response.status === 'belge_eksik') {
          const missingMessage =
            response.message ||
            `${application.farm} çiftliğinin zorunlu belgeleri henüz tamamlanmadı. Başvuru "Belge Eksik" durumuna alındı.`;

          setToast({
            message: missingMessage,
            tone: 'error',
          });

          // Local state'i hemen güncelle (hem records hem allApplications)
          setRecords((prev) =>
            prev.map((app) =>
              app.id === application.id ? { ...app, status: 'Belge Eksik' } : app
            )
          );
          setAllApplications((prev) =>
            prev.map((app) =>
              app.id === application.id ? { ...app, status: 'Belge Eksik' } : app
            )
          );

          try {
            await forceBelgeEksikStatus(application.id, missingMessage);
          } catch (statusError) {
            // Durum güncelleme hatası olsa bile devam et
          }
          await loadApplications();
          return;
        }

        // Başarılı onay
        setToast({
          message: `${application.farm} çiftliği başarıyla onaylandı.`,
          tone: 'success',
        });
        
        // Önce local state'te başvurunun durumunu güncelle (anında UI güncellemesi için)
        setRecords((prev) =>
          prev.map((app) =>
            app.id === application.id ? { ...app, status: 'Onaylandı' } : app
          )
        );
        
        // Listeyi yenile (backend'den güncel veriyi çek)
        await loadApplications();

        // İstatistikleri güncelle (onaylanan çiftlik sayısı)
        await loadApprovedFarmCount();
      } else {
        const errorMessage = response.message || 'Onay işlemi başarısız oldu';
        setError(errorMessage);
        setToast({
          message: errorMessage,
          tone: 'error',
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'İşlem sırasında bir hata oluştu';
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
    allApplications, // İstatistikler için tüm başvurular
    setApplications: setRecords,
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
    checkRequiredDocuments,
    loading,
    error,
    loadApplications,
    approvingId,
    rejectingId,
    updatingDocumentId,
    toast,
    setToast,
  };
}

