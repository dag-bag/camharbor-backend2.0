import axios from 'axios';
import type { Product } from '../types/product.types';

const API_BASE_URL = '/api';
const API_KEY = 'test-key-123';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export async function getProducts(): Promise<Product[]> {
  const response = await api.get('/products');
  return response.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function createProduct(data: Partial<Product> | Partial<Product>[]): Promise<Product | Product[]> {
  const response = await api.post('/products', data);
  return response.data;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function toggleProductStatus(id: string): Promise<Product> {
  const response = await api.patch(`/products/${id}/toggle-status`);
  return response.data;
}
