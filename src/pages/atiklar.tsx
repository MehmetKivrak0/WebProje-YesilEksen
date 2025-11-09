import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

const products = [
  {
    title: 'Organik Zeytinyağı',
    producer: 'Güney Ege Zeytincilik',
    price: '320 ₺ / 1L',
    desc: 'Soğuk sıkım yöntemiyle üretilmiş, sertifikalı organik zeytinyağı.',
    img: 'https://images.unsplash.com/photo-1503832724-9c91af8d7d63?auto=format&fit=crop&w=900&q=80',
    category: 'Gıda',
  },
  {
    title: 'Doğal Bal',
    producer: 'Anadolu Arıcılık',
    price: '250 ₺ / 850g',
    desc: 'Çiçek aromalı, katkısız ve analiz raporlu doğal bal.',
    img: 'https://images.unsplash.com/photo-1524593166156-312f362cada9?auto=format&fit=crop&w=900&q=80',
    category: 'Gıda',
  },
  {
    title: 'Taze Keçi Peyniri',
    producer: 'Akdeniz Çiftliği',
    price: '180 ₺ / 500g',
    desc: 'Pastörize keçi sütünden üretilmiş, düşük tuzlu kremamsı peynir.',
    img: 'https://images.unsplash.com/photo-1609189191655-08ce93cc4434?auto=format&fit=crop&w=900&q=80',
    category: 'Süt Ürünleri',
  },
  {
    title: 'Kurutulmuş Domates',
    producer: 'Marmara Bahçeleri',
    price: '95 ₺ / 200g',
    desc: 'Güneşte kurutulmuş, zeytinyağı ve kekik ile marine edilmiş domates.',
    img: 'https://images.unsplash.com/photo-1530816975036-2dd09c1c1b23?auto=format&fit=crop&w=900&q=80',
    category: 'Gıda',
  },
  {
    title: 'Lavanta Sabunu',
    producer: 'Ege Bitki Atölyesi',
    price: '55 ₺ / Adet',
    desc: 'Doğal yağlarla hazırlanmış, el yapımı lavanta kokulu sabun.',
    img: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80',
    category: 'Kişisel Bakım',
  },
  {
    title: 'Elma Sirkesi',
    producer: 'Kapadokya Çiftliği',
    price: '70 ₺ / 1L',
    desc: 'Doğal fermantasyonla hazırlanmış, filtresiz elma sirkesi.',
    img: 'https://images.unsplash.com/photo-1615485737455-efc5ff2b07ff?auto=format&fit=crop&w=900&q=80',
    category: 'Gıda',
  },
  {
    title: 'Doğal Yün İpliği',
    producer: 'Anadolu Tekstil',
    price: '120 ₺ / 100g',
    desc: 'El ile eğrilmiş, kimyasal işlem görmemiş doğal yün ipliği.',
    img: 'https://images.unsplash.com/photo-1504365819757-1dc5d03f0f37?auto=format&fit=crop&w=900&q=80',
    category: 'El Sanatları',
  },
  {
    title: 'Lavanta Paketi',
    producer: 'Isparta Lavanta Vadisi',
    price: '60 ₺ / Paket',
    desc: 'İç mekanları ferahlatan, el yapımı lavanta kese paketi.',
    img: 'https://images.unsplash.com/photo-1598517534344-31a5c9fa4f3a?auto=format&fit=crop&w=900&q=80',
    category: 'El Sanatları',
  },
];

function Atiklar() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-content-light dark:text-content-dark">Ürünler</h1>
              <p className="mt-2 text-lg text-subtle-light dark:text-subtle-dark">
                Kooperatifimizde sunulan yerel ve sürdürülebilir üretim ürünlerini keşfedin. Detaylarına ulaşarak tedarikçilerle iletişime geçin.
              </p>
            </div>
            <Link
              to="/atiklar/ekle"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Ürün Ekle
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">Tüm Ürünler</button>
            <button className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-content-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-background-dark dark:text-content-dark dark:hover:bg-primary/20 dark:hover:text-primary">
              Gıda
            </button>
            <button className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-content-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-background-dark dark:text-content-dark dark:hover:bg-primary/20 dark:hover:text-primary">
              Süt Ürünleri
            </button>
            <button className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-content-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-background-dark dark:text-content-dark dark:hover:bg-primary/20 dark:hover:text-primary">
              Kişisel Bakım
            </button>
            <button className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-content-light transition-colors hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:bg-background-dark dark:text-content-dark dark:hover:bg-primary/20 dark:hover:text-primary">
              El Sanatları
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-lg border border-border-light bg-background-light text-left shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-border-dark dark:bg-background-dark"
              >
                <a className="block" href="#">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={item.img}
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-background-light px-3 py-1 text-xs font-semibold text-primary shadow-sm dark:bg-background-dark">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <h3 className="text-lg font-semibold text-content-light dark:text-content-dark">{item.title}</h3>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{item.producer}</p>
                    <p className="text-sm font-medium text-primary">{item.price}</p>
                    <p className="mt-1 text-xs text-subtle-light dark:text-subtle-dark line-clamp-3">{item.desc}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-subtle-light dark:text-subtle-dark">
                      <span className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Detayı Gör
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">shopping_cart</span>
                        Teklif Al
                      </span>
                    </div>
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
