import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function CiftlikEkle() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-primary dark:text-background-light min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary dark:text-background-light">Çiftlik Kayıt ve Belge Yükleme</h2>
            <p className="mt-2 text-base text-text-secondary dark:text-gray-400">Çiftlik kurulumu için gerekli belgeleri yükleyin ve bilgilerinizi girin.</p>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-text-primary dark:text-background-light mb-6">Çiftlik Kurulumu İçin Gerekli Temel Belgeler ve Adımlar</h3>
            <div className="space-y-8">
              <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-surface-dark/50">
                <h4 className="text-lg font-semibold text-primary">1. Yer Seçimi ve Ön İzinler</h4>
                <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">Çiftliğin kurulacağı arazinin seçimi ve ilgili belediye/kurumdan alınacak ön izin belgeleri.</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="land-document">Arazi Tapusu / Kira Sözleşmesi</label>
                    <label className="relative cursor-pointer w-full mt-1" htmlFor="land-document">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-background-light dark:bg-background-dark hover:border-primary/70">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3">upload_file</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Belgeyi yükle (PDF, JPG, PNG)</span>
                      </div>
                      <input className="sr-only" id="land-document" name="land-document" type="file" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="pre-permit">Ön İzin Belgesi</label>
                    <label className="relative cursor-pointer w-full mt-1" htmlFor="pre-permit">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-background-light dark:bg-background-dark hover:border-primary/70">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3">upload_file</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Belgeyi yükle (PDF, JPG, PNG)</span>
                      </div>
                      <input className="sr-only" id="pre-permit" name="pre-permit" type="file" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-surface-dark/50">
                <h4 className="text-lg font-semibold text-primary">2. İnşaat ve Yapı İzinleri</h4>
                <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">Çiftlik binaları ve altyapısı için gerekli olan yapı ruhsatı ve projeler.</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="building-permit">Yapı Ruhsatı</label>
                    <label className="relative cursor-pointer w-full mt-1" htmlFor="building-permit">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-background-light dark:bg-background-dark hover:border-primary/70">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3">upload_file</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Belgeyi yükle (PDF, JPG, PNG)</span>
                      </div>
                      <input className="sr-only" id="building-permit" name="building-permit" type="file" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="architectural-project">Mimari Proje</label>
                    <label className="relative cursor-pointer w-full mt-1" htmlFor="architectural-project">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-background-light dark:bg-background-dark hover:border-primary/70">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3">upload_file</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Projeyi yükle (PDF, DWG)</span>
                      </div>
                      <input className="sr-only" id="architectural-project" name="architectural-project" type="file" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-surface-dark/50">
                <h4 className="text-lg font-semibold text-primary">3. Faaliyete Geçiş ve Tescil Belgeleri</h4>
                <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">Çiftliğin resmi olarak faaliyete geçebilmesi için gereken işletme ruhsatı ve ÇKS belgesi.</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="business-license">İşletme Ruhsatı</label>
                    <label className="relative cursor-pointer w-full mt-1" htmlFor="business-license">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-background-light dark:bg-background-dark hover:border-primary/70">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3">upload_file</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Belgeyi yükle (PDF, JPG, PNG)</span>
                      </div>
                      <input className="sr-only" id="business-license" name="business-license" type="file" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="farmer-reg-system">Çiftçi Kayıt Sistemi (ÇKS) Belgesi</label>
                    <label className="relative cursor-pointer w-full mt-1" htmlFor="farmer-reg-system">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-background-light dark:bg-background-dark hover:border-primary/70">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 mr-3">upload_file</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Belgeyi yükle (PDF, JPG, PNG)</span>
                      </div>
                      <input className="sr-only" id="farmer-reg-system" name="farmer-reg-system" type="file" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-surface-dark/50">
                <h4 className="text-lg font-semibold text-primary">4. Kişisel/Kurumsal Belgeler</h4>
                <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">Başvuru sahibinin veya şirketin kimlik ve vergi bilgilerini içeren belgeler.</p>
                <div className="mt-4 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="id-number">T.C. Kimlik Numarası / Vergi Kimlik Numarası</label>
                    <div className="mt-1">
                      <input className="form-input w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary rounded-lg p-3 placeholder-gray-400 dark:placeholder-gray-500" id="id-number" name="id-number" placeholder="Kimlik numaranızı girin" required type="text" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300" htmlFor="full-name">Ad Soyad / Firma Unvanı</label>
                    <div className="mt-1">
                      <input className="form-input w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary rounded-lg p-3 placeholder-gray-400 dark:placeholder-gray-500" id="full-name" name="full-name" placeholder="Adınızı veya firma unvanınızı girin" required type="text" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-gray-300">Belge Yükleme</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-400">cloud_upload</span>
                        <div className="flex text-sm text-text-secondary dark:text-gray-400">
                          <label className="relative cursor-pointer bg-background-light dark:bg-surface-dark rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary" htmlFor="personal-doc-upload">
                            <span>Dosyalarınızı seçin</span>
                            <input className="sr-only" id="personal-doc-upload" name="personal-doc-upload" type="file" multiple />
                          </label>
                          <p className="pl-1">veya sürükleyip bırakın</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Nüfus Cüzdanı, Vergi Levhası vb. (PDF, JPG, PNG)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col items-center gap-6">
              <button type="submit" className="group relative w-full sm:w-auto flex justify-center py-3.5 px-8 border border-transparent text-base font-bold rounded-lg bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors">
                Belgeleri Kaydet
              </button>
              <div className="flex items-center justify-center text-center text-sm text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-primary mr-3">schedule</span>
                <p>Belgeleriniz, uzmanlarımız tarafından 24 saat içinde incelenip onaylanacaktır.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-primary-light dark:bg-primary/20 p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-primary mb-2">Çiftlik Bilgileriniz Onaylandı mı?</h3>
            <p className="text-text-secondary dark:text-gray-300 mb-6">Onay sürecinden sonra, platformumuzun tüm özelliklerinden faydalanmak için ürün ve atık bilgilerinizi girmeye başlayabilirsiniz.</p>
            <a className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap" href="#">
              Ürün ve Atık Girişi Yap
              <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CiftlikEkle;
