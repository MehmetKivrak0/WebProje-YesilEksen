import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function FirmaDetay() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            {/* Firma Kartı */}
            <div className="p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32"
                    style={{backgroundImage: 'url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuCJux5fXj_K4jD4vHtF0CU64CB5vu_kgDjGtl0pUPIU_AoVAWPbJQiUnQYB-txIuUTOoe2T9fA7hbkVLnW3FCTu4nUbgTyu_MWt5hyK3M73qSU3hCtHCZ6JfeChWD-RLs0dPMfOLUbR5kbZAK0llRVuAdy37Qq6nw5e9adueks-w8Ayo_woBikptdX9bSwFY7YmzLz0IttwY6-ENN1Zwxzh2lge0u9ZEghHvUAPEM5IdNCqeF9vaagr6zMxwOZFXQ5IUlXWNfmEou4\")'}}
                  ></div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5">
                    <span className="material-symbols-outlined !text-base">verified</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AgriConnect</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tarım ve Gıda Sanayi</p>
                <p className="text-sm font-medium text-primary mt-1">Doğrulanmış Firma</p>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                  <span className="material-symbols-outlined">chat_bubble</span> İletişime Geç
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-white shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                  <span className="material-symbols-outlined">shopping_cart</span> Ürünleri Gör
                </button>
              </div>
            </div>
            {/* Firma Bilgileri */}
            <div className="p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Firma Bilgileri</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Adres</p>
                    <p className="text-gray-800 dark:text-gray-200">Merkez Mah. Çiftlik Sok. No: 123, İstanbul, Türkiye</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">call</span>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">İletişim</p>
                    <p className="text-gray-800 dark:text-gray-200">+90 212 123 45 67</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">language</span>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Web Sitesi</p>
                    <a className="text-primary hover:underline" href="#">www.agriconnect.com.tr</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">group</span>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Sosyal Medya</p>
                    <div className="flex gap-2 mt-1">
                      <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">Twitter</a>
                      <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">Facebook</a>
                      <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">Instagram</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-2 space-y-8">
            {/* Ürünler ve Hizmetler */}
            <div className="p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ürünler ve Hizmetler</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tarımsal atıkların ve ürünlerin verimli değerlendirilmesi için doğrulanmış çiftlikler ve firmaları bir araya getiren platform. AgriConnect, tarımsal atıkların geri dönüşümü, organik gübre üretimi, biyogaz üretimi ve tarımsal danışmanlık hizmetleri sunmaktadır.
              </p>
            </div>
            {/* Sertifikalar */}
            <div className="p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sertifikalar</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">ISO 9001 Kalite Yönetim Sistemi</p>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">ISO 14001 Çevre Yönetim Sistemi</p>
                </li>
              </ul>
            </div>
            {/* Referanslar */}
            <div className="p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Referanslar (2)</h2>
              <div className="space-y-8">
                {/* İlk Referans */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                      style={{backgroundImage: 'url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuAeoGO2yvDVE3kZoPXTGMyDCvX2PJaJOdkLLr9Mr0oEeLDJmWoT_gsRI6TmSNZCHI0oFtpKK2Nidcg7ozVTcNntCjPIwTALvLsoMJ-hgkIBvfw5rNFfeEF8IaFwrHnP-xwWfrrMlbzJFOn0bTkKzhggFx-PCFd9AX3ao9pR09gnGgCWtnUlCz-uOPRxhIYYIe5NDQozoBbrFPGFiXfw8cuRG9R9pK4aVvzTDiEx7YDaYDF8-aCRJTFS6nrRkgjsQuNmWKwrNMQ2DIc\")'}}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Ayşe Yılmaz</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2023-01-15</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-primary">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="material-symbols-outlined !text-base" style={{fontVariationSettings: i < 5 ? "'FILL' 1" : undefined}}>star</span>
                        ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">"AgriConnect ile çalışmak çok verimli oldu. Atıklarımızı değerlendirerek hem çevreye katkı sağladık hem de ek gelir elde ettik."</p>
                  <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                    <button className="flex items-center gap-1.5 text-xs hover:text-primary">
                      <span className="material-symbols-outlined !text-base">thumb_up</span>
                      <span>3</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs hover:text-primary">
                      <span className="material-symbols-outlined !text-base">thumb_down</span>
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800"></div>
                {/* İkinci Referans */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                      style={{backgroundImage: 'url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuBS-v2q4iEPq_bKTqEp_5FnpPE7MMZeDH0MeTomJxGI7j9N92K6pTrOMKO4PuW9uZliN3rQmmrRm3dLvl0_oOuSSJuO95JjarHhjDXxuxPNIVct41y8glkHk0vZCbvcthqwBeBC8i1-aCJxX4pr2tQcAX6NRwX6NJ61aQBirYg2M9SOaheuB9YY_Sx-zivKZF1ez9aSkxdekYUkuRctsh7vBhFyVDSgai7yRA0KeBPPY9cPcubbgXuWyEWBkWTJsz5CqcuS5gAUte4\")'}}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Mehmet Demir</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2022-12-20</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-primary">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="material-symbols-outlined !text-base" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        ))}
                      <span className="material-symbols-outlined !text-base text-gray-300 dark:text-gray-600">star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">"Hizmetlerinden memnun kaldık. Danışmanlık hizmetleri sayesinde üretim süreçlerimizi iyileştirdik."</p>
                  <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                    <button className="flex items-center gap-1.5 text-xs hover:text-primary">
                      <span className="material-symbols-outlined !text-base">thumb_up</span>
                      <span>2</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs hover:text-primary">
                      <span className="material-symbols-outlined !text-base">thumb_down</span>
                      <span>1</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FirmaDetay;
