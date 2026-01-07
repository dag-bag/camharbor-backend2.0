import axios from 'axios';
import type { IProduct, IProductAvailability, IProductRecommendation } from '../types/product.types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', 'X-API-Key': 'test-key-123' },
});

const createCrud = <T>(endpoint: string) => ({
  getAll: async (params?: any) => (await apiClient.get<{ success: boolean; count: number; data: T[] }>(endpoint, { params })).data,
  create: async (data: Partial<T>) => (await apiClient.post<{ success: boolean; data: T }>(endpoint, data)).data,
  update: async (id: string, data: Partial<T>) => (await apiClient.put<{ success: boolean; data: T }>(`${endpoint}/${id}`, data)).data,
  delete: async (id: string) => (await apiClient.delete<{ success: boolean; data: {} }>(`${endpoint}/${id}`)).data,
});

export const productApi = {
    master: createCrud<IProduct>('/products'),
    availability: createCrud<IProductAvailability>('/products/availability'),
    recommendations: createCrud<IProductRecommendation>('/products/recommendations'),
};
