import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

function Atiklar() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-content-light dark:text-content-dark">Çiftlik Atıkları</h1>
              <p className="mt-2 text-lg text-subtle-light dark:text-subtle-dark">Değerlendirilebilecek tarımsal atıkları keşfedin ve döngüsel ekonomiye katkıda bulunun.</p>
            </div>
            <Link to="/atiklar/ekle" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
              Ürün Ekle
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-white">Tüm Atıklar</button>
            <button className="px-4 py-2 text-sm font-medium rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">Hayvansal Gübre</button>
            <button className="px-4 py-2 text-sm font-medium rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">Bitkisel Atıklar</button>
            <button className="px-4 py-2 text-sm font-medium rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">Gıda İşleme Atıkları</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                title: 'Buğday Sapı',
                producer: 'Orta Anadolu Tarım',
                qty: '15 Ton',
                desc: 'Hayvan yemi, biyoyakıt ve kompost üretimi için idealdir.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpRRpvTFE54XVxcZKcG8ww0mQB253D4HXqp7oovvkUpffTp11RR432Gm-zr7zZAzCTunrqCi9WgvqvTTz-bX7FWRFwkMROkZeE6t2Hk1XLS-RkXIKoi2ti0pkGa-4mIDhJmIFaiFw_SLaSyBFnP-uvm7Gq8yl1inPv-X8-i6FSqLQAeRycYemxDgF5weEtQFMThBcqtZp89CAcF2X2_4D5QXvO3F8Ocd-te6wwGAsgxOM1jeYPOaWEMpAz10c77GXaJyh_ibIapF0',
              },
              {
                title: 'Sığır Gübresi',
                producer: 'Akdeniz Besicilik',
                qty: '20 Ton',
                desc: 'Organik tarım için zengin besin kaynağı ve biyogaz hammaddesi.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5NS-LvUmgcr8DpafFMI3Bif-dmsi3apkMVR9W9stkG4Up9SBYfYODJorgdRDqnIPry6DMEUgf75CZ9qj1uFPKtWz9Q7Ruz1NBJF0YcqVO2BZz83R-YJhmCHO38EHzDwwsCrNxg52uQPjDWg5wQxHTDYDr7FmZaQZllcx5R_ji2TOs1nTukD4qP4vLIFbp9rFudtHrjzgg3dfKwjB0yOx0O3mJWi_EvlA47AAKAtuJjfBiCmGEdWHc9L5Y3dJrynqJ45yMAP5RxBE',
              },
              {
                title: 'Mısır Koçanı',
                producer: 'Karadeniz Tarım Kooperatifi',
                qty: '10 Ton',
                desc: 'Yem katkısı, endüstriyel hammadde ve enerji üretimi için kullanılır.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXCM91VmfKSMrlYTEYnLg7bX6dF76qL_IBeEOb0wi7L5DnD8WlCEaS1P8aHXsII0vvNnYq5Q-rLe8bs0A95J4H3OIN8uuxvvDx9rpPagWJF6MsSeIX9ZNpJ4-2WFT-HV8zvK3rykM9brLHVATmzOh_dPQhGBtJWjskVltFuUGsodCoQfnef339-k185WA40KEVBPmyOCkipEVFe1AqGSGs4kKCRjjcBKDDnrFtUcUxTDATwes1IzhOi0el1Q4j65C1u9HiCygSoZwE8',
              },
              {
                title: 'Zeytin Prinası',
                producer: 'Güney Ege Zeytincilik',
                qty: '25 Ton',
                desc: 'Yüksek kalorili biyoyakıt (pirina yağı) ve hayvan yemi üretimi.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjso5lhKl1Ao9p53ABHLXcHlaU1wI2eDDjFATEo03zpgK-zHXHbxuYurxjjchSTwFR15sZx5_3QhasZWsPkc55SwvsrHgHXnzqToJJ_piLkGUmZRRtQoiJZ_D0u-N-iwPC6-pGLOCzmhPviaNraG1xTuBLuHsfihJnDCEdHdVmhNf6JN7G_8EVp0f0M8Kh3k01bRPpBHm0hUWLZ6i2KlmuwkyPNFBHNkYN7qldR9FAeLMVvGsx_kze6jHuD_T0up3ihRbEYFTOmJI',
              },
              {
                title: 'Tavuk Gübresi',
                producer: 'Marmara Kanatlı Hayvanları',
                qty: '30 Ton',
                desc: 'Azot bakımından zengin, yüksek verimli organik gübre.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeF5UxKCVvXwvrwLx2uYzpi0cdVrGVLYg--_urircaEJowfxWxHoykrxYD6h8Qe9ShS5Ba1xG-ypo81pjDv0BIi0BiS0rHFEu_fG7ChkuBslz0VwznEsqMf8ThGAs7nrcr9a_BcTIMY2M06li7-NNi7YFjA44GEAdw4DkHmvHmGzIcYOb2CibAFT1ypXiVE0Nw9WDN_vwv7eCWNpQul2peEk7gVdKlefEXSWf2FZe5Td4zWo7isPIJzf3NV3CXsYwj1bD1hBYrxlw',
              },
              {
                title: 'Domates Sap ve Yaprakları',
                producer: 'Akdeniz Bahçeleri',
                qty: '8 Ton',
                desc: 'Kompost yapımında ve toprak iyileştirici olarak kullanılır.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBNIk8Kb6T6ERzrRdNlD_J7kN8ry6cJfajWXPY3tyrQ-tBgJd__unC07lyWUkUYqLHIfRQBNVS_kxYzwNMbxkDKXze-XJ87tWWzPMY0X82X4ZdwJzpn0r7yuHOJoTziJnHIrh_9IJQsAhr6soWtp6RueflQE6fbN5__m4sIBFkKDlqpNNc4VbWj9RlqvtlktjAA_F1YCbyqbkEhollYvuR0MvYILn0w-t4XTrzC5CtiJE2L-_hFd2vOymvB0khSfLG5Yp94FHQBDw',
              },
              {
                title: 'Ayçiçeği Küspesi',
                producer: 'Trakya Yağ Sanayi',
                qty: '12 Ton',
                desc: 'Protein açısından zengin, değerli bir hayvan yemi hammaddesi.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADv3g9yaCQRPctOgy4K95VEYO7kl0UmTjS0Nwquz3nnQtnPP9qLRKlA4JyUpOvUxaUUEW_yjOMzoLRN0DL8k1SjN79WWy-LtgBH_0jjJ7JeBHiYwBpNxVGWTqwbqK42Yz4-b2yptP_DHGTuh9lXhks0EI4r1dlCmBKkTQnIYyxrR_8Eq2TiPMn_0I6jdSIHv1RTHY4wEKa2I4b-qLiIcuqwJjVFGrx6vko0u4O9_Bofue69fE_lUoX3i8c3aet4yMLCXX9SxH-sAo',
              },
              {
                title: 'Fındık Zurufu',
                producer: 'Doğu Karadeniz Fındık',
                qty: '18 Ton',
                desc: 'Enerji üretimi, kompost ve sunta yapımında kullanılır.',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5NAj4PDrSJzgjGWGoSdlS6pywv0bfO8_bJ7nsm-nYlBbCCAiB9m6uopRwl1T4Rp9Oaox7amratGRtxzcGWKUDAeRXWtzdcyQBeogKur0Si9saSBkuOWmkOK4Xxz3yrr6C8zKWDj9tM_x5MpXU-ZKurynMR6s0rgpL1HScvcVYAUHSmi5ySJlcT3JjFaE2FntNxAfz0d6KntMger-wHILEo88JEeQtz3aTUzOAfAZyPrKmPB9USV7YZyNoktKarCmYyxpe9an9UDc',
              },
            ].map((item, idx) => (
              <div key={idx} className="group flex flex-col bg-background-light dark:bg-background-dark rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border-light dark:border-border-dark">
                <a className="block" href="#">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.img} />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-content-light dark:text-content-dark">{item.title}</h3>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{item.producer}</p>
                    <p className="text-md font-medium text-primary mt-2">{item.qty}</p>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2 flex-grow">{item.desc}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Atiklar;
