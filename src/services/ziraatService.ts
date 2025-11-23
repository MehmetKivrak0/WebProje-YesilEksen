import api from './api';

export interface DashboardStats {
    productSummary: {
        pending: number;
        approved: number;
        revision: number;
    };
    farmSummary: {
        newApplications: number;
        inspections: number;
        approved: number;
    };
    totalFarmers: number;
    totalProducts: number;
}

export interface ProductApplication {

    id: string;
    name: string;
    applicant: string;
    status: string;
    lastUpdate: string;
    applicationNumber: string;
    sector: string;
    establishmentYear: number;
    employeeCount: string;
    email: string;
    applicationDate: string;
    taxNumber: string;
    description: string;
    documents: Array<{ name: string; url?: string }>;

}

export interface FarmApplication {
    id: string;
    name: string;
    owner: string;
    status: string;
    inspectionDate: string;
    lastUpdate?: string;
    applicationNumber: string;
    sector: string;
    establishmentYear: number;
    employeeCount: string;
    email: string;
    phone?: string;
    applicationDate: string;
    taxNumber: string;
    description: string;
    wasteTypes?: string[];
    documents: Array<{ 
        name: string; 
        status: string;
        url?: string; 
        farmerNote?: string;
    }>;
}

export const ziraatService = {

    getDashboardStats: async (): Promise<{ success: boolean; stats: DashboardStats }> => {
        const response = await api.get('/ziraat/dashboard/stats');
        return response.data;
    },
    getProductApplications: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }): Promise<{ success: boolean; applications: ProductApplication[]; pagination: any }> => {
        const response = await api.get('/ziraat/products/applications', { params });
        return response.data;
    },

    //Çiftlik Başvurusu Listesi
    getFarmApplications: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }): Promise<{ success: boolean; applications: FarmApplication[]; pagination: any }> => {
        const response = await api.get('/ziraat/farms/applications', { params });
        return response.data;
    },

    //Ürün Başvurusu Onayla
    approveProduct: async (id: string, data?: { note?: string }): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/ziraat/products/${id}/approve`, data);
        return response.data;
    },

    // Ürün Başvurusu Reddet
    rejectProduct: async (id: string, data: { reason: string }): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/ziraat/products/${id}/reject`, data);
        return response.data;
    },
    //Çiftlik Başvurusu Onayla
    approveFarm: async (id: string, data?: { note?: string }): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/ziraat/farms/${id}/approve`, data);
        return response.data;
    },

    //Çiftlik Başvurusu Reddet
    rejectFarm: async (id: string, data: { reason: string }): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/ziraat/farms/${id}/reject`, data);
        return response.data;
    },

    //Kayıtlı çiftçiler listesi
    getRegisteredFarmers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{ success: boolean; farmers: any[]; pagination: any }> => {
        const response = await api.get('/ziraat/farmers/registered', { params });
        return response.data;
    },
    //Dashboard Ürünleri
    getDashboardProducts: async (params?: {
        search?: string;
    }): Promise<{ success: boolean; products: any[] }> => {
        const response = await api.get('/ziraat/dashboard/products', { params });
        return response.data;
    },
    //Aktivite Logları
    getActivityLog: async (params?: {
        page?: number;
        limit?: number;
        type?: string;
    }): Promise<{ success: boolean; activities: any[]; pagination: any }> => {
        const response = await api.get('/ziraat/activity-log', { params });
        return response.data;
    },

    //Çiftlik Logları (Belirli bir çiftlik için)
    getFarmLogs: async (id: string): Promise<{ 
        success: boolean; 
        logs: {
            activities: any[];
            detailedActivities: any[];
            changeLogs: any[];
        }
    }> => {
        const response = await api.get(`/ziraat/farms/${id}/logs`);
        return response.data;
    },

    //Tüm Çiftlik Logları
    getAllFarmLogs: async (): Promise<{ 
        success: boolean; 
        logs: {
            activities: any[];
            detailedActivities: any[];
            changeLogs: any[];
        }
    }> => {
        const response = await api.get('/ziraat/farms/logs/all');
        return response.data;
    },

    //Belge Durumunu Güncelle
    updateDocumentStatus: async (belgeId: string, data: { 
        status: string; 
        reason?: string; 
        adminNote?: string;
    }): Promise<{ success: boolean; message: string }> => {
        const response = await api.put(`/ziraat/documents/${belgeId}`, data);
        return response.data;
    },
}