import axios from 'axios';
import type { ILocality } from '../types/locality.types';

const API_BASE_URL = '/api';
const API_KEY = 'test-key-123';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

export const localityApi = {
  getAll: async (params?: { page?: number; limit?: number; city_id?: string; zone_id?: string; q?: string }) => {
    const response = await apiClient.get<{ success: boolean; data: ILocality[]; pagination: any }>('/localities', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: ILocality }>(`/localities/${id}`);
    return response.data;
  },
  create: async (data: Partial<ILocality>) => {
    const response = await apiClient.post<{ success: boolean; data: ILocality }>('/localities', data);
    return response.data;
  },
  update: async (id: string, data: Partial<ILocality>) => {
    const response = await apiClient.put<{ success: boolean; data: ILocality }>(`/localities/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: {} }>(`/localities/${id}`);
    return response.data;
  },
};
