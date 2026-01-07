import axios from 'axios';
import type { IService, IServiceCoverage, IServiceContent, IServicePricing } from '../types/service.types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', 'X-API-Key': 'test-key-123' },
});

// Generic Helper
const createCrud = <T>(endpoint: string) => ({
  getAll: async (params?: any) => (await apiClient.get<{ success: boolean; count: number; data: T[] }>(endpoint, { params })).data,
  create: async (data: Partial<T>) => (await apiClient.post<{ success: boolean; data: T }>(endpoint, data)).data,
  update: async (id: string, data: Partial<T>) => (await apiClient.put<{ success: boolean; data: T }>(`${endpoint}/${id}`, data)).data,
  delete: async (id: string) => (await apiClient.delete<{ success: boolean; data: {} }>(`${endpoint}/${id}`)).data,
});

export const serviceApi = {
    master: {
        ...createCrud<IService>('/services'),
        getById: async (id: string) => (await apiClient.get<{success: boolean; data: IService}>(`/services/${id}`)).data // Not in generic CRUD above
    },
    coverage: createCrud<IServiceCoverage>('/services/coverage'),
    pricing: createCrud<IServicePricing>('/services/pricing'),
    content: createCrud<IServiceContent>('/services/content'),
};
