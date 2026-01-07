import axios from 'axios';

const API_BASE_URL = '/api';
const API_KEY = 'test-key-123';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export interface RiskData {
  _id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  locality?: string;
  date?: Date;
  is_active: boolean;
  created_at: Date;
}

export async function getRisks(): Promise<RiskData[]> {
  const response = await api.get('/risks');
  return response.data;
}

export async function getRisk(id: string): Promise<RiskData> {
  const response = await api.get(`/risks/${id}`);
  return response.data;
}

export async function createRisk(data: Partial<RiskData> | Partial<RiskData>[]): Promise<RiskData | RiskData[]> {
  const response = await api.post('/risks', data);
  return response.data;
}

export async function updateRisk(id: string, data: Partial<RiskData>): Promise<RiskData> {
  const response = await api.patch(`/risks/${id}`, data);
  return response.data;
}

export async function deleteRisk(id: string): Promise<void> {
  await api.delete(`/risks/${id}`);
}

export async function toggleRiskStatus(id: string): Promise<RiskData> {
  const response = await api.patch(`/risks/${id}/toggle-status`);
  return response.data;
}
