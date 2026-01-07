export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  type?: string;
  category?: string;
  brand?: string;
  product_model?: string;
  price?: number;
  specs?: Record<string, any>;
  capabilities?: string[];
  stock_status?: 'in_stock' | 'out_of_stock' | 'backorder';
  supplier_name?: string;
  supplier_lead_time_days?: number;
  minimum_order_quantity?: number;
  is_active: boolean;
  priority?: number;
  created_at?: string;
  updated_at?: string;
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

// Type alias for convenience
export type Product = IProduct;
export type ProductAvailability = IProductAvailability;
export type ProductRecommendation = IProductRecommendation;
