export interface ILocalityGeo {
  coordinates: {
    lat: number;
    lng: number;
  };
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  polygon?: number[][];
  area_km2?: number;
  place_id?: string;
  plus_code?: string;
}

export interface ILocality {
  _id: string;
  slug: string;
  name: string;
  display_name: string;
  name_local?: string;
  city_id: string; // ID as string for frontend
  zone_id?: string;
  
  pincodes: string[];
  primary_pincode: string;
  
  is_active: boolean;
  is_serviceable: boolean;
  priority: number;
  tier?: string;

  geo: ILocalityGeo;

  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
    schema_type?: string;
  };

  risk_factor?: number;

  demographics?: {
    population_density?: string;
    avg_income_level?: string;
    housing_type?: string;
  };
  infrastructure?: {
    power_stability?: 'Excellent' | 'Good' | 'Poor';
    internet_quality?: 'Fiber' | 'DSL' | 'Mobile Only';
    road_width?: string;
  };

  created_at: string;
  updated_at: string;
}
