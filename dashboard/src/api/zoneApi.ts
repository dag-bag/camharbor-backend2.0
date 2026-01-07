import axios from 'axios';
import type { Zone } from '../types/zone.types';
import type { ApiResponse } from '../types/city.types';

// Reuse the configuration from existing APIs implicitly or explicitly
// Here reusing the same pattern as cityApi.ts
const API_BASE_URL = '/api'; 
const API_KEY = 'test-key-123'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

export const zoneApi = {
  listZones: async (page = 1, limit = 100) => {
    const response = await apiClient.get<ApiResponse<Zone[]>>('/zones', {
      params: { page, limit },
    });
    return response.data;
  },
  
  listZonesByCity: async (citySlugOrId: string) => {
    const response = await apiClient.get<ApiResponse<Zone[]>>(`/cities/${citySlugOrId}/zones`);
    return response.data;
  },

  getZoneBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Zone>>(`/zones/${slug}`);
    return response.data;
  },

  createZone: async (zoneData: Partial<Zone> | Partial<Zone>[]) => {
    const response = await apiClient.post<ApiResponse<Zone | Zone[]>>('/zones', zoneData);
    return response.data;
  },

  updateZone: async (id: string, zoneData: Partial<Zone>) => {
    const response = await apiClient.put<ApiResponse<Zone>>(`/zones/${id}`, zoneData);
    return response.data;
  },

  deleteZone: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/zones/${id}`);
    return response.data;
  },
};
