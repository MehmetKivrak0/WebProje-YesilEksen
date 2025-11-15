import type { FarmApplication } from '../types';

export const initialFarmApplications: FarmApplication[] = [
  {
    farm: 'Lale Bahçesi',
    owner: 'Hilal Karaca',
    location: 'Konya, Meram',
    status: 'Denetimde',
    inspectionDate: '2024-02-12',
    lastUpdate: 'Bugün',
    notes: 'Saha ziyareti tamamlandı, rapor hazırlanıyor.',
    contact: {
      name: 'Hilal Karaca',
      phone: '+90 536 111 22 33',
      email: 'hilal.karaca@lalebahcesi.com',
    },
    documents: [
      { name: 'Çiftlik Denetim Raporu', status: 'Beklemede', farmerNote: 'Denetmen raporu bekleniyor.' },
      { name: 'Zirai Güvenlik Belgesi', status: 'Onaylandı', url: '/docs/lale-bahcesi-gvenlik.pdf' },
      { name: 'Çevre Uyum Taahhüdü', status: 'Eksik' },
    ],
  },
  {
    farm: 'Göksu Organik',
    owner: 'Yağız Yıldırım',
    location: 'Antalya, Manavgat',
    status: 'Onaylandı',
    inspectionDate: '2024-02-08',
    lastUpdate: '2 gün önce',
    notes: 'Onay belgesi iletildi.',
    contact: {
      name: 'Yağız Yıldırım',
      phone: '+90 533 987 65 43',
      email: 'yagiz.yildirim@goksuorganik.com',
    },
    documents: [
      { name: 'Organik Üretim Sertifikası', status: 'Onaylandı', url: '/docs/goksu-organik-sertifika.pdf' },
      { name: 'Su Kullanım İzni', status: 'Onaylandı', url: '/docs/su-kullanim-izni.pdf' },
      { name: 'Hayvan Refahı Planı', status: 'Onaylandı', url: '/docs/hayvan-refahi-plani.pdf' },
    ],
  },
  {
    farm: 'Pamukova Tarım',
    owner: 'Selim Demirtaş',
    location: 'Sakarya, Pamukova',
    status: 'Evrak Bekliyor',
    inspectionDate: 'Bekleniyor',
    lastUpdate: '3 gün önce',
    notes: 'Analiz raporu eksik.',
    contact: {
      name: 'Selim Demirtaş',
      phone: '+90 542 321 54 76',
      email: 'selim.demirtas@pamukovatarim.com',
    },
    documents: [
      { name: 'Toprak Analiz Sonuçları', status: 'Eksik' },
      { name: 'Hayvan Sağlık Kayıtları', status: 'Beklemede', farmerNote: 'Veteriner raporu eklenecek.' },
      { name: 'ÇKS Kaydı', status: 'Beklemede', url: '/docs/pamukova-cks.pdf' },
    ],
  },
  {
    farm: 'Bereket Vadisi',
    owner: 'Nisa Güler',
    location: 'Kütahya, Gediz',
    status: 'İlk İnceleme',
    inspectionDate: '2024-02-18',
    lastUpdate: '5 saat önce',
    notes: 'İlk değerlendirme formu tamamlandı.',
    contact: {
      name: 'Nisa Güler',
      phone: '+90 505 222 44 55',
      email: 'nisa.guler@bereketvadisi.com',
    },
    documents: [
      { name: 'Çiftlik Tanıtım Formu', status: 'Beklemede', farmerNote: 'Güncel fotoğraflar yüklenecek.' },
      { name: 'İş Sağlığı Planı', status: 'Beklemede' },
      { name: 'Çevresel Etki Değerlendirmesi', status: 'Eksik' },
    ],
  },
  {
    farm: 'Güven Çiftliği',
    owner: 'Saim Bulut',
    location: 'Balıkesir, Gönen',
    status: 'Onaylandı',
    inspectionDate: '2024-01-28',
    lastUpdate: 'Geçen hafta',
    notes: 'Yeni sezon üretim planı onaylandı.',
    contact: {
      name: 'Saim Bulut',
      phone: '+90 532 444 77 88',
      email: 'saim.bulut@guvenciftligi.com',
    },
    documents: [
      { name: 'Tarımsal Üretim Planı', status: 'Onaylandı', url: '/docs/guven-ciftligi-uretimplani.pdf' },
      { name: 'Atık Yönetim Protokolü', status: 'Onaylandı', url: '/docs/atik-yonetim-protokolu.pdf' },
      { name: 'Zirai İlaç Envanteri', status: 'Onaylandı', url: '/docs/zirai-ilac-envanteri.pdf' },
    ],
  },
];

