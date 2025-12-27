import axios from 'axios';
import type { City, ApiResponse } from '../types/city.types';

// Use relative path to leverage Vite proxy
const API_BASE_URL = '/api'; 
// In a real app, this should securely fetched or the endpoint should not require it if same-origin + cookie
const API_KEY = 'test-key-123'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

export const cityApi = {
  listCities: async (page = 1, limit = 100) => {
    const response = await apiClient.get<ApiResponse<City[]>>('/cities', {
      params: { page, limit },
    });
    return response.data;
  },
  getActiveCities: async () => {
    const response = await apiClient.get<ApiResponse<City[]>>('/cities/active');
    return response.data;
  },
  getCityBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<City>>(`/cities/${slug}`);
    return response.data;
  },
  createCity: async (cityData: Partial<City> | Partial<City>[]) => {
    const response = await apiClient.post<ApiResponse<City | City[]>>('/cities', cityData);
    return response.data;
  },
  updateCity: async (slug: string, cityData: Partial<City>) => {
    const response = await apiClient.put<ApiResponse<City>>(`/cities/${slug}`, cityData);
    return response.data;
  },
  toggleCityStatus: async (slug: string) => {
    const response = await apiClient.patch<ApiResponse<any>>(`/cities/${slug}/status`);
    return response.data;
  },
  deleteCity: async (slug: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/cities/${slug}`);
    return response.data;
  },
  deleteCities: async (slugs: string[]) => {
    const response = await apiClient.delete<ApiResponse<any>>('/cities', { data: { slugs } });
    return response.data;
  },
};
