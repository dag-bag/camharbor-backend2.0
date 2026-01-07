import axios from 'axios';
import type { Locality } from '../types/locality.types';

const API_BASE_URL = '/api';
const API_KEY = 'test-key-123';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export async function getLocalities(): Promise<Locality[]> {
  const response = await api.get('/localities');
  return response.data;
}

export async function getLocality(id: string): Promise<Locality> {
  const response = await api.get(`/localities/${id}`);
  return response.data;
}

export async function createLocality(data: Partial<Locality> | Partial<Locality>[]): Promise<Locality | Locality[]> {
  const response = await api.post('/localities', data);
  return response.data;
}

export async function updateLocality(id: string, data: Partial<Locality>): Promise<Locality> {
  const response = await api.patch(`/localities/${id}`, data);
  return response.data;
}

export async function deleteLocality(id: string): Promise<void> {
  await api.delete(`/localities/${id}`);
}

export async function toggleLocalityStatus(id: string): Promise<Locality> {
  const response = await api.patch(`/localities/${id}/toggle-status`);
  return response.data;
}
