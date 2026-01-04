import axios from 'axios';
import type { Brand, BrandFilter } from '../types/brand.types';

const API_URL = 'http://localhost:5000/api/brands';

export const brandApi = {
  // Create single or bulk brands
  createBrand: async (data: any) => {
    try {
      const response = await axios.post(API_URL, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to create brand' 
      };
    }
  },

  // Get all brands with filtering
  listBrands: async (filter: BrandFilter = {}) => {
    try {
      const params = new URLSearchParams();
      if (filter.page) params.append('page', filter.page.toString());
      if (filter.limit) params.append('limit', filter.limit.toString());
      if (filter.search) params.append('search', filter.search);
      if (filter.is_active !== undefined) params.append('is_active', filter.is_active.toString());
      if (filter.is_authorized !== undefined) params.append('is_authorized', filter.is_authorized.toString());
      if (filter.featured !== undefined) params.append('featured', filter.featured.toString());

      const response = await axios.get(`${API_URL}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch brands');
    }
  },

  // Get single brand by slug
  getBrandBySlug: async (slug: string) => {
    try {
      const response = await axios.get(`${API_URL}/${slug}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch brand' 
      };
    }
  },

  // Update brand
  updateBrand: async (slug: string, data: Partial<Brand>) => {
    try {
      const response = await axios.put(`${API_URL}/${slug}`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update brand' 
      };
    }
  },

  // Delete single brand
  deleteBrand: async (slug: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${slug}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete brand' 
      };
    }
  },

  // Bulk delete brands
  deleteBrands: async (slugs: string[]) => {
    try {
      const response = await axios.delete(API_URL, { data: { slugs } });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete brands' 
      };
    }
  },

  // Toggle brand status
  toggleBrandStatus: async (slug: string) => {
    try {
      const response = await axios.patch(`${API_URL}/${slug}/toggle-status`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to toggle status' 
      };
    }
  }
};
