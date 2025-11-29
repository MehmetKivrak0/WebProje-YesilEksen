import api from './api';

// Çiftçi Panel İstatistikleri
export interface CiftciPanelStats {
    toplamSatis: number;
    bekleyenOnay: number;
    aktifUrun: number;
    toplamGelir: number;
}

// Bekleyen Onay (Teklif)
export interface BekleyenOnay {
    id: string;
    urun: string;
    miktar: string;
    teklifFiyat: string;
    birimFiyat: string;
    alici: string;
    tarih: string;
    sure: string;
}

// Son Satış
export interface SonSatis {
    id: string;
    siparisNo?: string;
    urun: string;
    miktar: string;
    fiyat: string;
    durum: string;
    durumClass: string;
    alici: string;
    tarih: string;
}

// Aktif Ürün
export interface AktifUrun {
    id: string;
    urun: string;
    miktar: string;
    fiyat: string;
    durum: string;
    durumClass: string;
    resimUrl?: string;
}

export const ciftciService = {
    /**
     * Çiftçi panel istatistikleri
     * @param timeRange - 'hafta' | 'ay' | 'yil'
     */
    getPanelStats: async (timeRange: 'hafta' | 'ay' | 'yil' = 'ay'): Promise<{ success: boolean; stats: CiftciPanelStats }> => {
        const response = await api.get('/ciftlik/panel/stats', {
            params: { timeRange }
        });
        return response.data;
    },

    /**
     * Bekleyen onaylar (teklifler)
     */
    getPendingOffers: async (): Promise<{ success: boolean; offers: BekleyenOnay[] }> => {
        const response = await api.get('/ciftlik/panel/pending-offers');
        return response.data;
    },

    /**
     * Son satışlar
     */
    getRecentSales: async (): Promise<{ success: boolean; sales: SonSatis[] }> => {
        const response = await api.get('/ciftlik/panel/recent-sales');
        return response.data;
    },

    /**
     * Aktif ürünler
     */
    getActiveProducts: async (): Promise<{ success: boolean; products: AktifUrun[] }> => {
        // Not: Aktif ürünler için 'aktif' veya 'stokta' durumundaki ürünleri getir
        // Backend'de durum filtresi tek değer alıyor, bu yüzden önce 'aktif' sonra 'stokta' denenebilir
        // Veya backend'de IN clause kullanılabilir, şimdilik 'aktif' kullanıyoruz
        const response = await api.get('/ciftlik/urunler', {
            params: {
                durum: 'aktif', // Backend'de 'aktif' veya 'stokta' durumundaki ürünler için güncellenebilir
                limit: 10
            }
        });
        
        // Backend'den gelen veriyi frontend formatına dönüştür
        // Not: urunler tablosunda durum değerleri: 'aktif', 'onay_bekliyor', 'satildi', 'pasif', 'stokta'
        const products = response.data.products.map((product: any) => {
            const durumMap: Record<string, { text: string; class: string }> = {
                'aktif': { text: 'Aktif', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
                'stokta': { text: 'Stokta', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
                'onay_bekliyor': { text: 'Onay Bekliyor', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
                'satildi': { text: 'Satıldı', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
                'pasif': { text: 'Pasif', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
            };

            const durumInfo = durumMap[product.durum] || { text: product.durum, class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };

            return {
                id: product.id,
                urun: product.baslik || product.ad || 'Ürün Adı Yok', // Backend'den baslik veya ad gelebilir
                miktar: `${product.miktar || 0} ${product.birim || 'Ton'}`,
                fiyat: `${parseFloat(product.fiyat || 0).toLocaleString('tr-TR')} ₺ / ${product.birim || 'ton'}`,
                durum: durumInfo.text,
                durumClass: durumInfo.class,
                resimUrl: product.resim_url || undefined
            };
        });

        return {
            success: response.data.success,
            products
        };
    }
};

