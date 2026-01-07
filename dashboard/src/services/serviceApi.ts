import axios from 'axios';
import type { Service } from '../types/service.types';

const API_BASE_URL = '/api';
const API_KEY = 'test-key-123';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export async function getServices(): Promise<Service[]> {
  const response = await api.get('/services');
  return response.data;
}

export async function getService(id: string): Promise<Service> {
  const response = await api.get(`/services/${id}`);
  return response.data;
}

export async function createService(data: Partial<Service> | Partial<Service>[]): Promise<Service | Service[]> {
  const response = await api.post('/services', data);
  return response.data;
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const response = await api.patch(`/services/${id}`, data);
  return response.data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}

export async function toggleServiceStatus(id: string): Promise<Service> {
  const response = await api.patch(`/services/${id}/toggle-status`);
  return response.data;
}
