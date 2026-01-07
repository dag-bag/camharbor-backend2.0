export interface ICrimeStat {
  _id: string;
  city_id: string;
  zone_id?: string;
  locality_id?: string;
  year: number;
  month?: number;
  total_crimes: number;
  breakdown: {
    theft?: number;
    burglary?: number;
    vandalism?: number;
    assault?: number;
    other?: number;
  };
  source?: string;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

export interface IRiskProfile {
  _id: string;
  city_id: string;
  zone_id?: string;
  locality_id?: string;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  risk_score: number;
  dominant_crimes: string[];
  night_risk: number;
  outdoor_risk: number;
  commercial_risk: number;
  last_calculated_at: string;
}

export interface IRiskParameter {
  _id: string;
  name: string;
  slug: string;
  min_score: number;
  max_score: number;
  required_capabilities: string[];
  recommended_products_category?: string[];
  is_active: boolean;
}
