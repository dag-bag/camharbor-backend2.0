import axios from 'axios';
import type { Blog } from '../types/blog.types';

const API_BASE = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  error?: {
    message: string;
  };
}

export const blogApi = {
  // Create single or multiple blogs
  createBlog: async (data: Partial<Blog> | Partial<Blog>[]): Promise<ApiResponse<Blog | Blog[]>> => {
    const response = await axios.post(`${API_BASE}/blogs`, data);
    return response.data;
  },

  // List all blogs with optional filters
  listBlogs: async (
    page: number = 1, 
    limit: number = 20,
    filters?: {
      status?: 'draft' | 'published' | 'archived';
      category?: string;
      featured?: boolean;
      author?: string;
      search?: string;
    }
  ): Promise<ApiResponse<Blog[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.featured !== undefined && { featured: filters.featured.toString() }),
      ...(filters?.author && { author: filters.author }),
      ...(filters?.search && { search: filters.search }),
    });
    const response = await axios.get(`${API_BASE}/blogs?${params}`);
    return response.data;
  },

  // Get single blog by slug
  getBlogBySlug: async (slug: string): Promise<ApiResponse<Blog>> => {
    const response = await axios.get(`${API_BASE}/blogs/${slug}`);
    return response.data;
  },

  // Update blog
  updateBlog: async (slug: string, data: Partial<Blog>): Promise<ApiResponse<Blog>> => {
    const response = await axios.put(`${API_BASE}/blogs/${slug}`, data);
    return response.data;
  },

  // Delete single blog
  deleteBlog: async (slug: string): Promise<ApiResponse<{}>> => {
    const response = await axios.delete(`${API_BASE}/blogs/${slug}`);
    return response.data;
  },

  // Bulk delete blogs
  deleteBlogs: async (slugs: string[]): Promise<ApiResponse<{}>> => {
    const response = await axios.delete(`${API_BASE}/blogs`, {
      data: { slugs }
    });
    return response.data;
  },

  // Toggle blog status
  toggleBlogStatus: async (slug: string): Promise<ApiResponse<Blog>> => {
    const response = await axios.patch(`${API_BASE}/blogs/${slug}/toggle-status`);
    return response.data;
  }
};
