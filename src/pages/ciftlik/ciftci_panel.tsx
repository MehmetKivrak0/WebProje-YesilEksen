import { useState } from 'react';
import { Link } from 'react-router-dom';
import CftNavbar from '../../components/cftnavbar';

function CiftciPanel() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'hafta' | 'ay' | 'yil'>('ay');

  // Örnek veriler - gerçek uygulamada API'den gelecek
  const stats = {
    toplamSatis: 18,
    bekleyenOnay: 3,
    aktifUrun: 12,
    toplamGelir: '32.500',
  };

  const sonSatislar = [
    {
      id: 1,
      urun: 'Mısır Sapı',
      miktar: '10 Ton',
      fiyat: '2.800 ₺',
      tarih: '2 saat önce',
      durum: 'Tamamlandı',
      durumClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      alici: 'BioEnerji A.Ş.',
    },
    {
      id: 2,
      urun: 'Buğday Samanı',
      miktar: '20 Ton',
      fiyat: '6.400 ₺',
      tarih: '1 gün önce',
      durum: 'Tamamlandı',
      durumClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      alici: 'Organik Gübre Sanayi',
    },
    {
      id: 3,
      urun: 'Ayçiçeği Sapı',
      miktar: '5 Ton',
      fiyat: '1.900 ₺',
      tarih: '2 gün önce',
      durum: 'Kargoda',
      durumClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      alici: 'Yeşil Yakıtlar Ltd.',
    },
    {
      id: 4,
      urun: 'Organik Kompost',
      miktar: '8 Ton',
      fiyat: '4.400 ₺',
      tarih: '3 gün önce',
      durum: 'Hazırlanıyor',
      durumClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      alici: 'Doğa Tarım Ürünleri',
    },
  ];

  const bekleyenOnaylar = [
    {
      id: 1,
      urun: 'Hayvansal Gübre',
      miktar: '15 Ton',
      teklifFiyat: '6.750 ₺',
      birimFiyat: '450 ₺ / ton',
      alici: 'BioEnerji A.Ş.',
      tarih: '5 saat önce',
      sure: '2 gün kaldı',
    },
    {
      id: 2,
      urun: 'Pamuk Atığı',
      miktar: '12 Ton',
      teklifFiyat: '5.040 ₺',
      birimFiyat: '420 ₺ / ton',
      alici: 'Sönmez Tekstil',
      tarih: '1 gün önce',
      sure: '3 gün kaldı',
    },
    {
      id: 3,
      urun: 'Zeytin Karasuyu',
      miktar: '5 m³',
      teklifFiyat: '3.400 ₺',
      birimFiyat: '680 ₺ / m³',
      alici: 'Organik Gübre Sanayi',
      tarih: '2 gün önce',
      sure: '4 gün kaldı',
    },
  ];

  const aktifUrunler = [
    {
      id: 1,
      urun: 'Mısır Sapı',
      miktar: '25 Ton',
      fiyat: '280 ₺ / ton',
      durum: 'Aktif',
      durumClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      id: 2,
      urun: 'Buğday Samanı',
      miktar: '30 Ton',
      fiyat: '320 ₺ / ton',
      durum: 'Aktif',
      durumClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      id: 3,
      urun: 'Hayvansal Gübre',
      miktar: '20 Ton',
      fiyat: '450 ₺ / ton',
      durum: 'Onay Bekliyor',
      durumClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
  ];

  const hizliErisim = [
    {
      title: 'Atık Ekle',
      description: 'Yeni atık kaydı oluştur',
      icon: 'add_circle',
      link: '/atiklar/ekle',
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Ürünlerim',
      description: 'Aktif ürünlerinizi görüntüleyin',
      icon: 'inventory_2',
      link: '/ciftlik/urunlerim',
      color: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Satış Geçmişi',
      description: 'Geçmiş satışlarınızı görüntüleyin',
      icon: 'history',
      link: '/ciftlik/satis-gecmisi',
      color: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Çiftlik Profili',
      description: 'Çiftlik bilgilerinizi düzenleyin',
      icon: 'agriculture',
      link: '/ciftlik/profil',
      color: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark min-h-screen flex flex-col">
      <CftNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Başlık */}
          <header className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">
                  Çiftçi Paneli
                </h1>
                <p className="text-lg text-subtle-light dark:text-subtle-dark">
                  Ürünlerinizi yönetin ve satışlarınızı takip edin
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTimeRange('hafta')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeRange === 'hafta'
                      ? 'bg-primary text-white'
                      : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-content-light dark:text-content-dark hover:bg-primary/10'
                  }`}
                >
                  Hafta
                </button>
                <button
                  onClick={() => setSelectedTimeRange('ay')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeRange === 'ay'
                      ? 'bg-primary text-white'
                      : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-content-light dark:text-content-dark hover:bg-primary/10'
                  }`}
                >
                  Ay
                </button>
                <button
                  onClick={() => setSelectedTimeRange('yil')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeRange === 'yil'
                      ? 'bg-primary text-white'
                      : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-content-light dark:text-content-dark hover:bg-primary/10'
                  }`}
                >
                  Yıl
                </button>
              </div>
            </div>
          </header>

          {/* İstatistik Kartları */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="group relative overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 dark:bg-blue-800/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 dark:bg-blue-400/20 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                      sell
                    </span>
                  </div>
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                    +12%
                  </div>
                </div>
                <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Toplam Satış</p>
                <p className="text-3xl font-bold text-content-light dark:text-content-dark mb-1">{stats.toplamSatis}</p>
                <p className="text-xs text-subtle-light dark:text-subtle-dark">Bu {selectedTimeRange === 'hafta' ? 'hafta' : selectedTimeRange === 'ay' ? 'ay' : 'yıl'}</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-200/30 dark:bg-yellow-800/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-yellow-500/10 dark:bg-yellow-400/20 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl text-yellow-600 dark:text-yellow-400">
                      pending_actions
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Bekleyen Onay</p>
                <p className="text-3xl font-bold text-content-light dark:text-content-dark mb-1">{stats.bekleyenOnay}</p>
                <p className="text-xs text-subtle-light dark:text-subtle-dark">Onay bekleyen ürünler</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/30 dark:bg-green-800/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 dark:bg-green-400/20 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">
                      inventory_2
                    </span>
                  </div>
                  <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                    Aktif
                  </div>
                </div>
                <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Aktif Ürün</p>
                <p className="text-3xl font-bold text-content-light dark:text-content-dark mb-1">{stats.aktifUrun}</p>
                <p className="text-xs text-subtle-light dark:text-subtle-dark">Satışta olan ürünler</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 dark:bg-purple-800/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 dark:bg-purple-400/20 flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400">
                      payments
                    </span>
                  </div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                    +8%
                  </div>
                </div>
                <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2">Toplam Gelir</p>
                <p className="text-3xl font-bold text-content-light dark:text-content-dark mb-1">{stats.toplamGelir} ₺</p>
                <p className="text-xs text-subtle-light dark:text-subtle-dark">Bu {selectedTimeRange === 'hafta' ? 'hafta' : selectedTimeRange === 'ay' ? 'ay' : 'yıl'}</p>
              </div>
            </div>
          </section>

          {/* Ana İçerik Grid */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            {/* Son Satışlar */}
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-1">Son Satışlar</h2>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">En son tamamlanan satışlarınız</p>
                </div>
                <Link
                  to="/ciftlik/satis-gecmisi"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-primary bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                >
                  Tümünü Gör
                  <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
                </Link>
              </div>
              <div className="space-y-3">
                {sonSatislar.map((satis) => (
                  <div
                    key={satis.id}
                    className="group rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-4 hover:border-primary/50 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <h3 className="font-semibold text-content-light dark:text-content-dark">{satis.urun}</h3>
                        </div>
                        <p className="text-xs text-subtle-light dark:text-subtle-dark flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">business</span>
                          {satis.alici}
                        </p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${satis.durumClass}`}>
                        {satis.durum}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border-light/50 dark:border-border-dark/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-subtle-light dark:text-subtle-dark">scale</span>
                          <span className="text-sm font-medium text-content-light dark:text-content-dark">{satis.miktar}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-primary">payments</span>
                          <span className="text-sm font-bold text-primary">{satis.fiyat}</span>
                        </div>
                      </div>
                      <span className="text-xs text-subtle-light dark:text-subtle-dark flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {satis.tarih}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bekleyen Onaylar */}
            <div className="rounded-xl border border-yellow-200 dark:border-yellow-800/30 bg-gradient-to-br from-yellow-50/50 to-background-light dark:from-yellow-900/10 dark:to-background-dark p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-1">Bekleyen Onaylar</h2>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Onay bekleyen teklifleriniz</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1.5 text-xs font-semibold text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  {bekleyenOnaylar.length} bekliyor
                </span>
              </div>
              <div className="space-y-3">
                {bekleyenOnaylar.map((onay) => (
                  <div
                    key={onay.id}
                    className="group rounded-lg border border-yellow-200/50 dark:border-yellow-800/30 bg-background-light dark:bg-background-dark p-4 hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                          <h3 className="font-semibold text-content-light dark:text-content-dark">{onay.urun}</h3>
                        </div>
                        <p className="text-xs text-subtle-light dark:text-subtle-dark flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">business</span>
                          {onay.alici}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2.5 pt-3 border-t border-border-light/50 dark:border-border-dark/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-subtle-light dark:text-subtle-dark flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">scale</span>
                          Miktar:
                        </span>
                        <span className="font-semibold text-content-light dark:text-content-dark">{onay.miktar}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-subtle-light dark:text-subtle-dark flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">request_quote</span>
                          Teklif:
                        </span>
                        <span className="font-bold text-primary text-base">{onay.teklifFiyat}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-subtle-light dark:text-subtle-dark flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {onay.tarih}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs font-medium">
                          <span className="material-symbols-outlined text-xs">timer</span>
                          {onay.sure}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Aktif Ürünler */}
          <section className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-1">Aktif Ürünler</h2>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Satışta olan ürünleriniz</p>
              </div>
              <Link
                to="/ciftlik/urunlerim"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-primary bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                Tümünü Gör
                <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aktifUrunler.map((urun) => (
                <div
                  key={urun.id}
                  className="group relative overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-5 hover:border-primary/50 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 hover:shadow-lg transition-all duration-200"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg text-primary">inventory_2</span>
                          </div>
                          <h3 className="font-semibold text-content-light dark:text-content-dark">{urun.urun}</h3>
                        </div>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark flex items-center gap-1.5 ml-12">
                          <span className="material-symbols-outlined text-xs">scale</span>
                          {urun.miktar}
                        </p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${urun.durumClass}`}>
                        {urun.durum}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-border-light/50 dark:border-border-dark/50">
                      <p className="text-lg font-bold text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">payments</span>
                        {urun.fiyat}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hızlı Erişim */}
          <section className="rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-1">Hızlı Erişim</h2>
              <p className="text-sm text-subtle-light dark:text-subtle-dark">Sık kullanılan sayfalara hızlı erişim</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hizliErisim.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="group relative overflow-hidden flex flex-col items-start gap-4 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-5 transition-all duration-300 hover:border-primary hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 dark:bg-primary/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors"></div>
                  <div className="relative w-full">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color} mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`material-symbols-outlined text-2xl ${item.iconColor}`}>
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="mb-2 text-base font-bold text-content-light dark:text-content-dark group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Detaylar</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CiftciPanel;

