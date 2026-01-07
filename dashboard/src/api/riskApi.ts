import axios from 'axios';
import type { ICrimeStat, IRiskProfile, IRiskParameter } from '../types/risk.types';

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

export const riskApi = {
    stats: createCrud<ICrimeStat>('/risks/stats'),
    profiles: createCrud<IRiskProfile>('/risks/profiles'),
    parameters: createCrud<IRiskParameter>('/risks/parameters'),
};
