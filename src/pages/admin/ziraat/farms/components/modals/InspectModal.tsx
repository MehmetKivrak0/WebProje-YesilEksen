import { useState, useRef, useEffect } from 'react';
import type { DocumentReviewState, FarmApplication } from '../../types';
import FarmStatusBadge from '../FarmStatusBadge';

type InspectModalProps = {
  application: FarmApplication;
  documentReviews: DocumentReviewState;
  onClose: () => void;
  onUpdateDocumentStatus: (name: string, status: DocumentReviewState[string]['status']) => void;
  onUpdateDocumentReason: (name: string, reason: string, isSent?: boolean) => void;
  onUpdateDocumentAdminNote: (name: string, adminNote: string) => void;
  onApprove: (application: FarmApplication) => void;
  isApproving?: boolean;
  onShowToast?: (message: string, tone: 'success' | 'error') => void;
};

function InspectModal({
  application,
  documentReviews,
  onClose,
  onUpdateDocumentStatus,
  onUpdateDocumentReason,
  onUpdateDocumentAdminNote,
  onApprove,
  isApproving = false,
  onShowToast,
}: InspectModalProps) {
  const [viewingDocument, setViewingDocument] = useState<{ url: string; name: string } | null>(null);
  const [documentBlobUrl, setDocumentBlobUrl] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const reasonTextareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [shouldScrollToReason, setShouldScrollToReason] = useState<{ documentName: string } | null>(null);
  // Local state for textarea values to avoid re-renders on every keystroke
  const [localReasons, setLocalReasons] = useState<Record<string, string>>({});
  const [localAdminNotes, setLocalAdminNotes] = useState<Record<string, string>>({});
  // Track which documents have been saved (İlet butonuna tıklanan belgeler)
  const [savedDocuments, setSavedDocuments] = useState<Set<string>>(new Set());

  // Değişiklik var mı kontrol et
  const hasChanges = () => {
    for (const doc of application.documents) {
      const review = documentReviews[doc.name];
      if (!review) continue;

      // Status değişmiş mi?
      if (review.status !== doc.status) {
        return true;
      }

      // Reason değişmiş mi?
      const currentReason = review.reason || '';
      const originalReason = doc.farmerNote || '';
      if (currentReason !== originalReason) {
        return true;
      }

      // AdminNote değişmiş mi?
      const currentAdminNote = review.adminNote || '';
      const originalAdminNote = doc.adminNote || '';
      if (currentAdminNote !== originalAdminNote) {
        return true;
      }
    }
    return false;
  };

  const handleViewDocument = async (url: string, name: string) => {
    setViewingDocument({ url, name });
    setDocumentError(false);
    setDocumentBlobUrl(null);
    setDocumentLoading(true);
    
    // Dosya türünü kontrol et
    const cleanUrl = url.split('?')[0];
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(cleanUrl);
    const isPdf = /\.pdf$/i.test(cleanUrl);
    
    // Resim veya PDF ise blob URL oluştur
    if (isImage || isPdf) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setDocumentBlobUrl(blobUrl);
        } else {
          setDocumentError(true);
        }
      } catch (error) {
        console.error('Belge yükleme hatası:', error);
        setDocumentError(true);
      } finally {
        setDocumentLoading(false);
      }
    } else {
      setDocumentLoading(false);
    }
  };

  // Application değiştiğinde local state'i sıfırla ve ilk değerleri yükle
  useEffect(() => {
    const newLocalReasons: Record<string, string> = {};
    const newLocalAdminNotes: Record<string, string> = {};
    
    application.documents.forEach((doc) => {
      const review = documentReviews[doc.name];
      if (review) {
        newLocalReasons[doc.name] = review.reason ?? '';
        newLocalAdminNotes[doc.name] = review.adminNote ?? '';
      }
    });
    
    setLocalReasons(newLocalReasons);
    setLocalAdminNotes(newLocalAdminNotes);
    setSavedDocuments(new Set());
  }, [application.id]); // Sadece application.id değiştiğinde çalış

  // Eğer onay işlemi başarılı olursa ve modal kapanırsa, ön izleme modal'ını da kapat
  // (onApprove başarılı olursa zaten setInspectedApplication(null) çağrılacak ve InspectModal kapanacak)

  // Reason textarea'sına scroll yap
  useEffect(() => {
    if (shouldScrollToReason) {
      const textarea = reasonTextareaRefs.current[shouldScrollToReason.documentName];
      if (textarea) {
        setTimeout(() => {
          textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
          textarea.focus();
          setShouldScrollToReason(null);
        }, 100);
      }
    }
  }, [shouldScrollToReason]);

  const handleDownloadDocument = async (url: string, name: string) => {
    try {
      const token = localStorage.getItem('token');
      const downloadUrl = `${url}?download=true`;
      
      // Fetch ile blob al
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('İndirme başarısız');
      }
      
      const blob = await response.blob();
      
      // Blob URL oluştur ve indir
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Dosya adını al (URL'den veya name parametresinden)
      const fileName = name || url.split('/').pop()?.split('?')[0] || 'belge';
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Blob URL'i temizle
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('İndirme hatası:', error);
      alert('Belge indirilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-end bg-black/40 px-4 py-8 sm:px-8">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border-light bg-background-light shadow-2xl dark:border-border-dark dark:bg-background-dark">
        <button
          className="group absolute right-4 top-4 flex items-center justify-center rounded-lg border border-border-light/70 dark:border-border-dark/70 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-sm p-2 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          onClick={onClose}
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <div className="max-h-[80vh] space-y-8 overflow-y-auto p-8">
          <div>
            <h2 className="text-2xl font-semibold text-content-light dark:text-content-dark">{application.farm}</h2>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              Sahibi: {application.owner}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border-light p-4 dark:border-border-dark">
              <h3 className="mb-3 text-sm font-semibold text-content-light dark:text-content-dark">Çiftlik Bilgileri</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-subtle-light dark:text-subtle-dark">
                  <span className="font-medium text-content-light dark:text-content-dark">Lokasyon:</span>{' '}
                  <span className="text-content-light dark:text-content-dark">{application.location}</span>
                </li>
                <li className="text-subtle-light dark:text-subtle-dark">
                  <span className="font-medium text-content-light dark:text-content-dark">Sorumlu Kişi:</span>{' '}
                  <span className="text-content-light dark:text-content-dark">{application.contact.name}</span>
                </li>
                <li className="text-subtle-light dark:text-subtle-dark">
                  <span className="font-medium text-content-light dark:text-content-dark">Telefon:</span>{' '}
                  {application.contact.phone && application.contact.phone.trim() ? (
                    <span className="text-content-light dark:text-content-dark">{application.contact.phone}</span>
                  ) : (
                    <span className="text-subtle-light dark:text-subtle-dark italic">Belirtilmemiş</span>
                  )}
                </li>
                <li className="text-subtle-light dark:text-subtle-dark">
                  <span className="font-medium text-content-light dark:text-content-dark">E-Posta:</span>{' '}
                  <span className="text-content-light dark:text-content-dark">{application.contact.email}</span>
                </li>
                {application.wasteTypes && application.wasteTypes.length > 0 && (
                  <li className="text-subtle-light dark:text-subtle-dark">
                    <span className="font-medium text-content-light dark:text-content-dark">Atık Türleri:</span>{' '}
                    <div className="mt-1 flex flex-wrap gap-2">
                      {application.wasteTypes.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-border-light p-4 dark:border-border-dark">
              <h3 className="mb-3 text-sm font-semibold text-content-light dark:text-content-dark">Çiftlik Kaydı</h3>
              <ul className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark">
                <li>
                  <span className="font-medium text-content-light dark:text-content-dark">Son Güncelleme:</span>{' '}
                  {application.lastUpdate}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium text-content-light dark:text-content-dark">Durum:</span>
                  <FarmStatusBadge status={application.status} />
                </li>
              </ul>
              <div className="mt-4 space-y-2 rounded-lg border border-border-light bg-background-light/40 p-3 dark:border-border-dark dark:bg-background-dark/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle-light dark:text-subtle-dark">
                  Admin Notu
                </p>
                {Object.entries(documentReviews)
                  .filter(([_, review]) => review.adminNote)
                  .map(([docName, review], index) => (
                    <div key={index} className="mb-2 rounded border border-blue-200 bg-blue-50/50 p-2 dark:border-blue-800 dark:bg-blue-900/20">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                        {docName}:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-line">{review.adminNote}</p>
                    </div>
                  ))}
                {Object.entries(documentReviews)
                  .filter(([_, review]) => review.adminNote).length === 0 && (
                    <p className="text-sm text-subtle-light dark:text-subtle-dark italic">Henüz admin notu eklenmemiş</p>
                  )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-light bg-gradient-to-br from-background-light to-background-light/50 p-6 dark:border-border-dark dark:from-background-dark dark:to-background-dark/50 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-content-light dark:text-content-dark">Belgeler ve Durumları</h3>
                <p className="text-xs text-subtle-light dark:text-subtle-dark">
                  {application.documents.length} belge • {application.documents.filter(d => (documentReviews[d.name]?.status ?? d.status) === 'Onaylandı').length} onaylandı
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-1">
              {application.documents && application.documents.length > 0 ? (
                application.documents.map((document) => {
                const review = documentReviews[document.name] ?? {
                  status: document.status,
                  reason: document.farmerNote,
                };
                
                // Dosya adını URL'den çıkar - URL formatı: /api/documents/file/farmer/filename.png veya tam URL
                let fileName: string | null = null;
                if (document.url) {
                  try {
                    // URL'den dosya yolunu çıkar
                    const urlParts = document.url.split('/file/');
                    if (urlParts.length > 1) {
                      // Decode edilmiş dosya yolunu al (örn: farmer/filename.png)
                      const filePath = decodeURIComponent(urlParts[1].split('?')[0]); // Query string'i temizle
                      // Dosya adını al (son kısmı)
                      fileName = filePath.split('/').pop() || filePath;
                    } else {
                      // Eğer format beklenen gibi değilse, en sondan al
                      fileName = document.url.split('/').pop()?.split('?')[0] || null;
                    }
                  } catch (e) {
                    // Hata durumunda sadece son kısmı al
                    fileName = document.url.split('/').pop()?.split('?')[0] || null;
                  }
                }
                const truncatedFileName = fileName && fileName.length > 50 ? fileName.substring(0, 50) + '...' : fileName;

                return (
                  <div
                    key={document.name}
                    className="group relative overflow-hidden rounded-xl border border-border-light bg-background-light shadow-sm transition-all hover:shadow-md dark:border-border-dark dark:bg-background-dark"
                  >
                    <div className="p-5">
                      {/* Belge Başlık */}
                      <div className="mb-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark flex-shrink-0 text-xl">description</span>
                          <h4 className="font-semibold text-content-light dark:text-content-dark text-base">{document.name}</h4>
                        </div>
                        {fileName && (
                          <div className="ml-8 flex items-center gap-2 text-xs text-subtle-light dark:text-subtle-dark">
                            <span className="material-symbols-outlined text-sm">attach_file</span>
                            <span className="truncate font-mono" title={fileName}>
                              {truncatedFileName}
                            </span>
                            {/* Dosya tipi ikonu */}
                            {fileName && (
                              <span className="ml-1 text-subtle-light dark:text-subtle-dark">
                                {fileName.toLowerCase().endsWith('.pdf') && '📄'}
                                {(fileName.toLowerCase().endsWith('.png') || fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) && '🖼️'}
                                {fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx') ? '📝' : ''}
                              </span>
                            )}
                          </div>
                        )}
                        {!document.url && (
                          <div className="ml-8 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            <span>Belge henüz yüklenmemiş</span>
                          </div>
                        )}
                      </div>

                      {/* Aksiyon Butonları */}
                      <div className="flex flex-wrap items-center gap-2">
                        {document.url && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleViewDocument(document.url!, document.name)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border-light bg-white px-3 py-2 text-xs font-medium text-content-light transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-border-dark dark:bg-background-dark/50 dark:text-content-dark dark:hover:bg-primary/10"
                              title="Belgeyi görüntüle"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                              <span className="hidden sm:inline">Görüntüle</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadDocument(document.url!, document.name)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border-light bg-white px-3 py-2 text-xs font-medium text-content-light transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-border-dark dark:bg-background-dark/50 dark:text-content-dark dark:hover:bg-primary/10"
                              title="Belgeyi indir"
                            >
                              <span className="material-symbols-outlined text-base">download</span>
                              <span className="hidden sm:inline">İndir</span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Reddetme Açıklama Formu */}
                      {review.status === 'Reddedildi' && (
                        <div className="mt-4 space-y-3 rounded-lg border border-red-200 bg-red-50/80 p-4 dark:border-red-900/60 dark:bg-red-900/20">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-red-800 dark:text-red-200">
                                Çiftçiye iletilecek açıklama
                              </span>
                              <textarea
                                ref={(el) => {
                                  reasonTextareaRefs.current[document.name] = el;
                                }}
                                className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-content-light placeholder:text-subtle-light focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 dark:border-red-700 dark:bg-background-dark dark:text-content-dark dark:placeholder:text-subtle-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Belgenin reddedilme gerekçesini ve yapılması gerekenleri belirtin."
                                value={localReasons[document.name] ?? ''}
                                onChange={(event) => {
                                  setLocalReasons((prev) => ({
                                    ...prev,
                                    [document.name]: event.target.value,
                                  }));
                                  // Eğer daha önce kaydedilmişse, değişiklik yapıldığı için kaydedildi durumunu kaldır
                                  if (savedDocuments.has(document.name)) {
                                    setSavedDocuments((prev) => {
                                      const newSet = new Set(prev);
                                      newSet.delete(document.name);
                                      return newSet;
                                    });
                                  }
                                }}
                                rows={3}
                                disabled={isApproving}
                              />
                            </label>
                            <label className="flex flex-col gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                Admin İç Notu (Çiftçiye gösterilmez)
                              </span>
                              <textarea
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-content-light placeholder:text-subtle-light focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:border-gray-600 dark:bg-background-dark dark:text-content-dark dark:placeholder:text-subtle-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Bu not sadece adminler tarafından görülebilir."
                                value={localAdminNotes[document.name] ?? ''}
                                onChange={(event) => {
                                  setLocalAdminNotes((prev) => ({
                                    ...prev,
                                    [document.name]: event.target.value,
                                  }));
                                  // Eğer daha önce kaydedilmişse, değişiklik yapıldığı için kaydedildi durumunu kaldır
                                  if (savedDocuments.has(document.name)) {
                                    setSavedDocuments((prev) => {
                                      const newSet = new Set(prev);
                                      newSet.delete(document.name);
                                      return newSet;
                                    });
                                  }
                                }}
                                rows={3}
                                disabled={isApproving}
                              />
                            </label>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setLocalReasons((prev) => ({
                                  ...prev,
                                  [document.name]: `Sayın çiftçimiz,

${document.name} belgeniz incelendi. İnceleme sırasında belirtilen eksiklikler belgede görülmektedir. Lütfen eksiklikleri gidererek belgeyi güncelleyip sisteme yeniden yükleyiniz.

Eksikliklerin giderilmesinin ardından belgenizi tekrar yükleyebilirsiniz. Herhangi bir sorunuz olması durumunda bizimle iletişime geçebilirsiniz.

Saygılarımızla,
Ziraat Odası İnceleme Birimi`,
                                }));
                              }}
                              className="rounded-lg border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600"
                            >
                              İnceleme Eksikleri
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalReasons((prev) => ({
                                  ...prev,
                                  [document.name]: `Sayın çiftçimiz,

${document.name} belgenizde yetkili imza ve/veya resmi mühür (kaşe) bulunmamaktadır. Belgenizin geçerliliği için yetkili kişi tarafından imzalanmış ve resmi mühür ile onaylanmış olması gerekmektedir.

Lütfen belgenizi yetkili imza ve mühür ile onayladıktan sonra sisteme tekrar yükleyiniz.

Saygılarımızla,
Ziraat Odası İnceleme Birimi`,
                                }));
                              }}
                              className="rounded-lg border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600"
                            >
                              İmza/Mühür Eksik
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalReasons((prev) => ({
                                  ...prev,
                                  [document.name]: `Sayın çiftçimiz,

${document.name} belgeniz format açısından uygun değildir. Belgelerin PDF formatında ve en fazla 10 MB boyutunda olması gerekmektedir.

Lütfen belgenizi PDF formatına dönüştürüp dosya boyutunu kontrol ederek sisteme yeniden yükleyiniz. Dosya boyutu 10 MB'dan büyükse, belgenizi bölümler halinde veya daha düşük çözünürlükte yükleyebilirsiniz.

Saygılarımızla,
Ziraat Odası İnceleme Birimi`,
                                }));
                              }}
                              className="rounded-lg border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600"
                            >
                              Format/Boyut Hatalı
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalReasons((prev) => ({
                                  ...prev,
                                  [document.name]: `Sayın çiftçimiz,

${document.name} belgenizde silik, bulanık veya okunaksız bölümler bulunmaktadır. Belgenin tamamının net ve okunabilir olması gerekmektedir.

Lütfen belgenizin tüm sayfalarının net ve okunabilir olduğundan emin olarak yeniden tarayıp sisteme yükleyiniz. Tarama kalitesini yüksek (en az 300 DPI) olarak ayarlayınız.

Saygılarımızla,
Ziraat Odası İnceleme Birimi`,
                                }));
                              }}
                              className="rounded-lg border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600"
                            >
                              Okunaksız Belge
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalReasons((prev) => ({
                                  ...prev,
                                  [document.name]: `Sayın çiftçimiz,

${document.name} belgeniz güncel değildir. Belgelerin son 3 ay içinde alınmış veya güncellenmiş olması gerekmektedir.

Lütfen belgenizi güncel haliyle temin edip sisteme yeniden yükleyiniz. Eğer belgenin güncel olması durumunda tarih bilgisini belirtmeniz gerekiyorsa, belge üzerinde görünür olmasına dikkat ediniz.

Saygılarımızla,
Ziraat Odası İnceleme Birimi`,
                                }));
                              }}
                              className="rounded-lg border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600"
                            >
                              Güncel Değil
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalReasons((prev) => ({
                                  ...prev,
                                  [document.name]: `Sayın çiftçimiz,

${document.name} belgeniz eksik veya tam sayfa içermemektedir. Belgenin tüm sayfalarının eksiksiz olarak yüklenmesi gerekmektedir.

Lütfen belgenizin tüm sayfalarını içeren tam versiyonunu sisteme yeniden yükleyiniz. Çok sayfalı belgeler için tüm sayfaların tek bir PDF dosyası halinde birleştirilmesi gerekmektedir.

Saygılarımızla,
Ziraat Odası İnceleme Birimi`,
                                }));
                              }}
                              className="rounded-lg border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600"
                            >
                              Eksik Sayfa
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // Textarea'dan direkt olarak mevcut değeri al (her zaman en güncel değer)
                                const textarea = reasonTextareaRefs.current[document.name];
                                const reason = textarea ? textarea.value : (localReasons[document.name] ?? '');
                                const adminNote = localAdminNotes[document.name] ?? '';
                                
                                if (reason.trim()) {
                                  // Önce localReasons'ı güncelle (textarea'daki en güncel değerle)
                                  setLocalReasons((prev) => ({
                                    ...prev,
                                    [document.name]: reason,
                                  }));
                                  
                                  // Reason'u documentReviews'e kaydet ve "İlet" butonuna tıklandı olarak işaretle
                                  onUpdateDocumentReason(document.name, reason, true);
                                  // Admin note varsa documentReviews'e kaydet
                                  if (adminNote.trim()) {
                                    onUpdateDocumentAdminNote(document.name, adminNote);
                                  }
                                  // "İlet" butonuna tıklandı olarak işaretle (UI için)
                                  setSavedDocuments((prev) => new Set(prev).add(document.name));
                                  // Toast bildirimi göster
                                  if (onShowToast) {
                                    onShowToast('Açıklama hafızaya kaydedildi. Onaylandığında backend\'e gönderilecek.', 'success');
                                  }
                                }
                              }}
                              disabled={isApproving}
                              className={`ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                savedDocuments.has(document.name)
                                  ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                                  : 'bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {savedDocuments.has(document.name) ? 'check_circle' : 'forward_to_inbox'}
                              </span>
                              {savedDocuments.has(document.name) ? 'Kaydedildi' : 'İlet'}
                            </button>
                          </div>
                          {localReasons[document.name] && (
                            <div className="rounded-lg bg-white/80 p-3 dark:bg-background-dark/50">
                              <p className="text-xs font-medium text-red-800 dark:text-red-200">
                                Çiftçi panelinde gösterilecek açıklama:
                              </p>
                              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                {localReasons[document.name]}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
                })
              ) : (
                <div className="rounded-lg border border-dashed border-border-light bg-background-light/50 p-8 text-center dark:border-border-dark dark:bg-background-dark/50">
                  <span className="material-symbols-outlined mb-2 text-4xl text-subtle-light dark:text-subtle-dark">description</span>
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">Henüz belge yüklenmemiş</p>
                  <p className="mt-1 text-xs text-subtle-light dark:text-subtle-dark">Bu çiftlik için henüz belge yüklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              className="rounded-lg border-2 border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>

      {/* Belge Görüntüleme Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl border border-border-light bg-background-light shadow-2xl dark:border-border-dark dark:bg-background-dark">
            <button
              className="absolute right-4 top-4 z-10 flex items-center justify-center rounded-lg border border-border-light/70 dark:border-border-dark/70 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-sm p-2 transition-colors hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={() => {
                if (documentBlobUrl) {
                  URL.revokeObjectURL(documentBlobUrl);
                }
                setViewingDocument(null);
                setDocumentBlobUrl(null);
                setDocumentError(false);
                setDocumentLoading(false);
              }}
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-content-light dark:text-content-dark">
                {viewingDocument.name}
              </h3>
              <div className="flex items-center justify-center rounded-lg border border-border-light bg-gray-100 dark:border-border-dark dark:bg-gray-900 min-h-[60vh] relative">
                {(() => {
                  // URL'den query string'i temizle ve dosya uzantısını kontrol et
                  const cleanUrl = viewingDocument.url.split('?')[0];
                  const isPdf = /\.pdf$/i.test(cleanUrl);
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(cleanUrl);
                  
                  // Loading durumu
                  if (documentLoading) {
                    return (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-sm text-subtle-light dark:text-subtle-dark">Belge yükleniyor...</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Hata durumu
                  if (documentError) {
                    return (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark mb-4">
                          {isPdf ? 'picture_as_pdf' : 'broken_image'}
                        </span>
                        <p className="text-content-light dark:text-content-dark mb-4">
                          {isPdf ? 'PDF yüklenemedi' : 'Resim yüklenemedi'}
                        </p>
                        <button
                          onClick={() => handleDownloadDocument(viewingDocument.url, viewingDocument.name)}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                        >
                          <span className="material-symbols-outlined text-base">download</span>
                          İndir
                        </button>
                      </div>
                    );
                  }
                  
                  // PDF görüntüleme
                  if (isPdf && documentBlobUrl) {
                    return (
                      <iframe
                        src={documentBlobUrl}
                        className="w-full h-[70vh] rounded-lg border-0"
                        title={viewingDocument.name}
                      />
                    );
                  }
                  
                  // Resim görüntüleme
                  if (isImage && documentBlobUrl) {
                    return (
                      <img
                        src={documentBlobUrl}
                        alt={viewingDocument.name}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                        onError={() => {
                          setDocumentError(true);
                          if (documentBlobUrl) {
                            URL.revokeObjectURL(documentBlobUrl);
                            setDocumentBlobUrl(null);
                          }
                        }}
                      />
                    );
                  }
                  
                  // Desteklenmeyen dosya türü
                  return (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark mb-4">
                        description
                      </span>
                      <p className="text-content-light dark:text-content-dark mb-4">
                        Bu dosya türü tarayıcıda görüntülenemiyor
                      </p>
                      <button
                        onClick={() => handleDownloadDocument(viewingDocument.url, viewingDocument.name)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                        İndir
                      </button>
                    </div>
                  );
                })()}
              </div>
              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleDownloadDocument(viewingDocument.url, viewingDocument.name)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-white px-4 py-2 text-sm font-medium text-content-light transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-border-dark dark:bg-background-dark/50 dark:text-content-dark dark:hover:bg-primary/10"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  İndir
                </button>
                <button
                  onClick={() => setViewingDocument(null)}
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

export default InspectModal;

