export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  brand: string;
  product_model: string;
  specs: Record<string, any>;
  base_price: number;
  capabilities: string[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface IProductAvailability {
  _id: string;
  product_id: string;
  city_id?: string;
  zone_id?: string;
  locality_id?: string;
  is_available: boolean;
  reason?: string;
}

export interface IProductRecommendation {
  _id: string;
  service_id?: string;
  product_id: string;
  city_id?: string;
  zone_id?: string;
  locality_id?: string;
  priority: number;
  reason: string;
}
