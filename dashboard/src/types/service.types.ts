export interface IService {
  _id: string;
  name: string;
  slug: string;
  type: 'installation' | 'repair' | 'amc' | 'rental' | 'consultation';
  base_price: number;
  icon?: string;
  thumbnail?: string;
  is_active: boolean;
  priority: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface IServiceCoverage {
  _id: string;
  service_id: string;
  city_id: string;
  zone_id?: string;
  locality_id?: string;
  is_available: boolean;
  reason?: string;
}

export interface IServiceContent {
  _id: string;
  service_id: string;
  city_id: string;
  zone_id?: string;
  locality_id?: string;
  title: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface IServicePricing {
  _id: string;
  service_id: string;
  city_id?: string;
  zone_id?: string;
  locality_id?: string;
  base_price_override?: number;
  multiplier: number;
  valid_from?: string;
  valid_to?: string;
  reason?: string;
}

// Type alias for convenience
export type Service = IService;
