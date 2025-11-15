import { Link, useParams } from 'react-router-dom';
import Navbar from '../../../../components/navbar';

const heroBackground =
  "linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpZU1R2hl79yrNUFOM4v8cNGTd1SBvYLdTai1zhDONT8p3L4B3-bTzrYEI21wd2rxeLbsOt25VC83xeRh_uFsgIthMJQwsODDBuQnA5j5wuwFSajg5cjLlr6YIBatZtOw3-Lmx3wzjGpHDTtBokoFRilUGg3vp1LDMDqFUJkRd_hJoW-1oJIVKmIN7ijoEoFwlctfBx9MvO7OtIyxS3gt9lcvh7eWwR1L0Z0krPP2_zcqFTndoml3K5H32vwHqXbJ7_ogev26hrWA')";

function FarmDetailPage() {
  const { farmerId } = useParams<{ farmerId: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Çiftlik Hero Section */}
          <div
            className="relative mb-8 overflow-hidden rounded-xl bg-cover bg-center shadow-lg"
            style={{ backgroundImage: heroBackground }}
          >
            <div className="p-8 text-white">
              <h1 className="mb-2 text-4xl font-bold">Güneş Çiftliği</h1>
              <p className="text-lg">
                {farmerId ? `Çiftlik ID: ${farmerId} • Konya, Çumra` : 'Konya, Çumra'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex border-b border-border-light dark:border-border-dark">
            <button
              type="button"
              className="flex items-center justify-center border-b-2 border-primary px-4 pb-4 pt-2 text-primary"
            >
              <span className="text-sm font-bold">Ürünler/Atıklar</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center border-b-2 border-transparent px-4 pb-4 pt-2 text-subtle-light transition-colors hover:border-primary/50 hover:text-primary dark:text-subtle-dark"
            >
              <span className="text-sm font-bold">Çiftlik Hakkında</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center border-b-2 border-transparent px-4 pb-4 pt-2 text-subtle-light transition-colors hover:border-primary/50 hover:text-primary dark:text-subtle-dark"
            >
              <span className="text-sm font-bold">Belgeler/Sertifikalar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Ana İçerik */}
            <div className="lg:col-span-2">
              {/* Ürün/Atık Tablosu */}
              <div className="mb-8 rounded-lg bg-background-light p-6 shadow-md dark:bg-background-dark">
                <h2 className="mb-4 text-xl font-semibold text-content-light dark:text-content-dark">
                  Ürünler ve Atıklar
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-border-light bg-background-light text-xs uppercase dark:border-border-dark dark:bg-background-dark">
                      <tr>
                        <th className="px-6 py-3 text-subtle-light dark:text-subtle-dark">Ürün/Atık Adı</th>
                        <th className="px-6 py-3 text-subtle-light dark:text-subtle-dark">Miktar</th>
                        <th className="px-6 py-3 text-subtle-light dark:text-subtle-dark">Fiyat</th>
                        <th className="px-6 py-3 text-subtle-light dark:text-subtle-dark" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border-light transition-colors hover:bg-primary/5 dark:border-border-dark">
                        <td className="px-6 py-4 font-medium text-content-light dark:text-content-dark">Buğday Sapı</td>
                        <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">10 Ton</td>
                        <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">₺25/Ton</td>
                        <td className="px-6 py-4 text-right">
                          <Link className="font-medium text-primary hover:underline" to="#">
                            Teklif Ver
                          </Link>
                        </td>
                      </tr>
                      <tr className="border-b border-border-light transition-colors hover:bg-primary/5 dark:border-border-dark">
                        <td className="px-6 py-4 font-medium text-content-light dark:text-content-dark">Domates Posası</td>
                        <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">500 kg</td>
                        <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">₺50/100kg</td>
                        <td className="px-6 py-4 text-right">
                          <Link className="font-medium text-primary hover:underline" to="#">
                            Teklif Ver
                          </Link>
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-primary/5">
                        <td className="px-6 py-4 font-medium text-content-light dark:text-content-dark">Organik Elma</td>
                        <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">2 Ton</td>
                        <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">₺800/Ton</td>
                        <td className="px-6 py-4 text-right">
                          <Link className="font-medium text-primary hover:underline" to="#">
                            Teklif Ver
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fotoğraf Galerisi */}
              <div className="rounded-lg bg-background-light p-6 shadow-md dark:bg-background-dark">
                <h2 className="mb-4 text-2xl font-bold text-content-light dark:text-content-dark">Fotoğraf Galerisi</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      alt="Sepette hasat edilmiş elmalar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxUkWi2oHMwys6be_oXOWmX24N9dVaEMnNhQuabqdtDn7deWHnp_VRYxNiY2DrWV5wQ0jTsExZBnA170fqwm74fVdjZ2r9aFaBCWWuE2yWKME8AkJnTWTMevcALvctGAfJw3L1t-ZcTj-8a1Bqv3x4ki20KBz1WkplhcS1__10fDViwSkWR67ifiuisuua1VaPG66cEb0wJK3ZqoPJnbF2y6gIj_bhjO8QmubtRSq1cn0LJZYWCKTkRbUilhepp8IV8zjkNiK4bzA"
                    />
                  </div>
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      alt="Buğday tarlasında modern traktör"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA4LU9lEe4Dun7XdJgH2hwB2fa30NcOfffLZXAxO1BvrM7YihK7xFUFIdLMNIGsiyf-201fgeY8vqJ7dI-eFB6WmGwW8yOw8ugeGY5cjS5LkX_PxQJrVnOSumE5BN3plPNChuT76HXUx3XfjxB_-bB3wYO8w-UJ6KKpRQgd6FuUUM77nk_UtHEg3ONYQC7zgY-iI--hSQpMFmAXQLqloaOK8S8tx5TkpX0ex1MI8OZA8ot8ghnXd9HSkdHU_WBkxDeJwTeXQJHRs8"
                    />
                  </div>
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      alt="Altın buğday saplarının yakın çekimi"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYicyj4qma844qqkHz8yQScW501KbEnqdOvmgRvP1fqwJJr-AqZQ3Gyx65mcGZ97wCE86TOBaLPsNGES8JQg6bHqR3OwgQE33WzWVSaEJWXiAFuhC-f1JbUXcOHq-XBZZKnDMiYbzvhIds7N0oIY7s5Ws_5VQdZ0MDkNb9vZl2Mueq1GkHdUQAlA2KE3ot7LD1CNHwXjMftEBWYMnVkkwxnnUFSldqgVD2oUJftJM7KJETNMEEpF3TzR_j015D0tR1-uK6sIdfk3M"
                    />
                  </div>
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      alt="Ekinlere bakan çiftlik işçileri"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bYdWDdL6DI3gFH9ElfBRKw_zgSMTRhpwZ_dFOiBE6ZkZXBZE3uli4Y2X24tqddBc9z_kYcUbhtrgvooWHWkwK3gzcGwBiYhu7ZVX0JDmuyE3YlfC8yc0lxTpqQTQprztATwZyb2xbREL5iDLTgQupdQ39Y1qUpna1Wih2QZBmDoyOxVLrHj9G5J3IthuedrKP9xNWnwtmp5VFLCrRwBp3V-kONU4ABIyhnxRFDD3mRt5GtmSFoDnCNnrXZXQWC-xvUtEx9i_QSA"
                    />
                  </div>
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      alt="Çiftlik tarlalarının havadan görünümü"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC95v9uRbcNn15j3219HMmhFeR1awbrQf2_x1z7hVS99VF1CswP65lEdE5ZvDnX_oAlaxIWHjjx5aQXMJsPb9lgcsvM5bCOEzcIqjRT52JyXDdymCEdcQBSTA08OJwNQv03_cSyrCTbE1Nuo7TpkpIBudBTXGlFqNY-HBtiDpwReFfcb-Cmzkpgn_RHOGlt04GWhyZ318mQ_Ozza6uxJos71Vl-DwhVimiPND5zrURUXUrQc1QS662_fWYrABtiEkTgLx-BgqJAwE"
                    />
                  </div>
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg"
                      alt="Taze ürün tutan çiftçi"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPkp74LEWhjJysIO8CMwAlCYSLiWxXcXcrXBXUw7hX2AgxALlFd55cwJP_-YpIyH0Ryj-7sVTj3dC7ac6YMKsXJc_9vjurpf7V8k24-lmdGm866msb3e0SVzBJ04sUzsf5S-Frg2V9wrD0uaVzn5b_rf2PkxKg7p0dJi9eg-Wvx_Bg4I178iNIkyw7ruRnxb2wCcn1dC_95_xJwD1haWYavxMnlQcMXZFuNuSYgaCZtOHMXvZPKerReYuwCLeDILrdY2u4rV-H5Vc"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Yan Panel */}
            <div className="space-y-6">
              {/* İletişim Bilgileri */}
              <div className="rounded-lg bg-background-light p-6 shadow-md dark:bg-background-dark">
                <h3 className="mb-4 text-xl font-bold text-content-light dark:text-content-dark">
                  İletişim Bilgileri
                </h3>
                <ul className="space-y-3 text-subtle-light dark:text-subtle-dark">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">call</span>
                    <span>+90 123 456 78 90</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <span>contact@gunesciftligi.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span>Güneş Vadisi, Çumra, Konya, Türkiye</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <iframe
                    className="h-48 w-full rounded-lg"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100778.29342419016!2d32.69931324151772!3d37.57539077180436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d68e5473686851%3A0x281921389941a54b!2s%C3%87umra%2FKonya%2C%20Turkey!5e0!3m2!1str!2str!4v1684321098765"
                    title="Güneş Çiftliği Konum"
                  />
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    Çiftlikle İletişime Geç
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition-colors hover:bg-orange-500/90"
                  >
                    <span className="material-symbols-outlined">favorite_border</span>
                    Takip Et
                  </button>
                </div>
              </div>

              {/* Sertifikalar */}
              <div className="rounded-lg bg-background-light p-6 shadow-md dark:bg-background-dark">
                <h3 className="mb-4 text-xl font-bold text-content-light dark:text-content-dark">Sertifikalar</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">description</span>
                      <span className="text-subtle-light dark:text-subtle-dark">
                        Toprak Analiz Raporu - Haziran 2024.pdf
                      </span>
                    </div>
                    <Link className="text-primary hover:underline" to="#">
                      <span className="material-symbols-outlined">download</span>
                    </Link>
                  </li>
                  <li className="flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">description</span>
                      <span className="text-subtle-light dark:text-subtle-dark">Organik Tarım Sertifikası.pdf</span>
                    </div>
                    <Link className="text-primary hover:underline" to="#">
                      <span className="material-symbols-outlined">download</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FarmDetailPage;
