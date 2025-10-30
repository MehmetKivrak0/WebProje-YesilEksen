import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';

function Ciftlikler() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Çiftlikler</h1>
            <Link to="/ciftlik/ekle" className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">add</span>
              <span className="truncate">Yeni Çiftlik Ekle</span>
            </Link>
          </div>
          <div className="relative flex flex-row gap-8">
            <div className="relative flex-1 rounded-xl overflow-hidden min-h-[400px] lg:min-h-[700px] shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYgQs_lAQKoYnnEIuAc0BN0yaYgXJEymLr8yhyWbLN_-yHWk1TK_4MEZorMlaXBNDRrCTnbyQJof6ksiutopYlzj9L3fjINxeZiIbJ25jTvYAkmW8NGxO1NvGOxXcgFbFhf-9v_yW-ftZWtU3wV4TmPZzUiS4xFN-mIv1daWY5UWW_H1vF8TRIJ2NIHl87ybYO3zV9suDaK0zHVdF_RUHXaFTpTvMBMK9PIMlipkBI2ImJ0jOvPIq5lQf3JGXvbSr4NNIwGJN4TXI")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative flex h-full flex-col p-6">
                <label className="relative">
                  <span className="sr-only">Çiftlik ara</span>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-white/80">search</span>
                  </span>
                  <input
                    className="form-input block w-full max-w-sm rounded-full border-transparent bg-white/20 backdrop-blur-sm py-3 pl-12 pr-4 text-white placeholder:text-white/80 focus:border-primary focus:ring-primary"
                    placeholder="Haritada çiftlik ara"
                    defaultValue=""
                  />
                </label>
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <button className="flex size-10 items-center justify-center rounded-t-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 shadow">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-b-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 shadow">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                  </div>
                  <button className="flex size-10 items-center justify-center rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 shadow">
                    <span className="material-symbols-outlined">navigation</span>
                  </button>
                </div>
                <div className="absolute bottom-6 left-6 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB4TCRb0xWP5UBMjpvg-1ETr7_Ew5aiHnTc7L7NEClMq0pNWjel0oYwh0Fvm6hRilTiHw7HGRPQXO2G8v_TXqieXs5I1F35uFX-nbidtVjcmSYdMb77U9jR__JBPZTxeOrU3Bu4-ISMxdSoh5v0qj045LUaB6lRl_5KMU_WPq2ZPsMvckfzJQtiDh3xMmzl039g0pVnl_L3C-OZVwVfGPx22wZmCOTNs389hs9ChILoFnBHVKjef5ziDcBlnUuGD0Z7H4EYMzy5fKc")',
                        }}
                      ></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Toros Çiftliği</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mersin</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">Organik Sertifikalı</span>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">İyi Tarım</span>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 sm:mt-0 flex items-center justify-center gap-x-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                      Mesaj Gönder <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mevcut Ürünler</h3>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {[
                        { name: 'Domates', qty: '20 ton' },
                        { name: 'Salatalık', qty: '15 ton' },
                        { name: 'Zeytin', qty: '5 ton' },
                        { name: 'Portakal', qty: '30 ton' },
                        { name: 'Limon', qty: '10 ton' },
                      ].map((item, idx) => (
                        <div className="group relative" key={idx}>
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-full"
                            style={{
                              backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtjKISdIoXsoFh5Dj3qhjqfkiGIb36y3_KRdUix8JVx95f3slXT42sxX0F42c_1YznwpuLAKqGPFuRVacYm1VNa5umOg01c7FzwDvVdQmtqiDc1zFdqnQ5NFNjhBYb9o78mh2AZmE9U6x-bmIeA75eelZauq5EyoWF2RXOlDqBSqLMxR0Urlz8NdCDF-ski3T9JRxSU0sV0eWONnvTIjxIxcDUQVgh7Src7vo_fYw5cf1L5yHjl9e167snHxobLEOj7L9sSOfmenc")',
                            }}
                          ></div>
                          <div className="mt-2 text-center">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-96 shrink-0 z-10 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Filtreler</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30">
                    Konum <span className="material-symbols-outlined text-base">expand_more</span>
                  </button>
                  <button className="flex items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30">
                    Ürün Türü <span className="material-symbols-outlined text-base">expand_more</span>
                  </button>
                  <button className="flex items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30">
                    Sertifikalar <span className="material-symbols-outlined text-base">expand_more</span>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Çiftlik Listesi</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Güney Çiftliği', city: 'Antalya' },
                    { name: 'Toros Çiftliği', city: 'Mersin', active: true },
                    { name: 'Çukurova Çiftliği', city: 'Adana' },
                    { name: 'Güneydoğu Çiftliği', city: 'Gaziantep' },
                    { name: 'Amanos Çiftliği', city: 'Hatay' },
                    { name: 'Dulkadiroğlu Çiftliği', city: 'Kahramanmaraş' },
                  ].map((farm, idx) => (
                    <div
                      key={idx}
                      className={
                        'flex items-center gap-4 rounded-lg p-3 transition-colors duration-200 ' +
                        (farm.active
                          ? 'bg-gray-100 dark:bg-gray-800 ring-2 ring-primary'
                          : 'bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800')
                      }
                    >
                      <div
                        className="bg-center bg-no-repeat aspect-video bg-cover rounded h-14 w-24"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU2XUogdPi89L37V-OwqoOzjDWEgn5l7qKFJYifO0zvL7SN2KuQepW-sD8ntTejLyJLl9AvpVo0EfR6Eo41F2rls0XLv-J9ltixWEBGezoDE4HU9TJGt5tSRO4hx7CKmmaQU0uHSjI51D7G7GFQBfSIvLgbVtzNkqJgVjqdnIVNqwuH2iORgWT5rAVNLX35TfTsVIc80l87KpdPJC0a0L4KCJkucHK8fRGaGQ1KYh481AxML62ANtxe7K_uDRRu60OLDo7tncWmp0")',
                        }}
                      ></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{farm.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{farm.city}</p>
                      </div>
                    </div>
                  ))}
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

export default Ciftlikler;
