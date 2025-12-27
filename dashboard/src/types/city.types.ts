/**
 * City Types and Interface Definitions
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Geo {
  coordinates: Coordinates;
  bounds: Bounds;
  timezone: string;
  area_km2: number;
  population: number;
  density_per_km2: number;
  elevation_m: number;
}

export interface Climate {
  type: string;
  summer_temp_c: string;
  winter_temp_c: string;
  monsoon_months: string[];
  annual_rainfall_mm: number;
}

export interface AirQuality {
  avg_aqi: number;
  classification: string;
  worst_months: string[];
  best_months: string[];
}

export interface Water {
  source: string[];
  supply_hours_per_day: number;
  quality_rating: string;
  availability: string;
}

export interface Environment {
  climate: Climate;
  air_quality: AirQuality;
  water: Water;
  green_cover_percent: number;
  noise_pollution: string;
}

export interface Power {
  provider: string[];
  avg_daily_cuts: number;
  avg_cut_duration_mins: number;
  reliability_score: number;
  industrial_connectivity: string;
}

export interface Internet {
  fiber_providers: string[];
  avg_speed_mbps: number;
  reliability_score: number;
  '4g_coverage': string;
  '5g_available': boolean;
}

export interface Housing {
  avg_rent_1bhk: number;
  avg_rent_2bhk: number;
  avg_rent_3bhk: number;
  avg_property_price_per_sqft: number;
  availability: string;
}

export interface Infrastructure {
  power: Power;
  internet: Internet;
  housing: Housing;
  public_transport: string[];
  road_quality: string;
  metro_connectivity: boolean;
  airport_distance_km: number;
  railway_stations: number;
}

export interface ThreatProfile {
  crime_rate: string;
  common_crimes: string[];
  safe_score: number;
  safe_areas: string[];
  areas_to_avoid: string[];
}

export interface Police {
  stations_count: number;
  response_time_mins: number;
  emergency_number: string;
  dedicated_cyber_cell: boolean;
}

export interface Security {
  threat_profile: ThreatProfile;
  police: Police;
  cctv_coverage: string;
  women_safety_rating: string;
}

export interface Zone {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  key_localities: string[];
  suitable_for: string[];
  avg_security_rating: number;
  cctv_demand: string;
  popular_camera_types: string[];
}

export interface SEO {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  og_image?: string;
  canonical_url?: string;
}

export interface Office {
  address: string;
  coordinates: Coordinates;
  contact_phone: string;
  contact_email: string;
  working_days: string[];
}

export interface Hours {
  monday_friday: string;
  saturday: string;
  sunday: string;
  holidays: string;
}

export interface Operations {
  office?: Office;
  hours?: Hours;
  service_areas: string[];
  coverage_radius_km: number;
  avg_response_time_hrs: number;
}

export interface FeaturedReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  project_type: string;
  location: string;
  verified: boolean;
}

export interface Reviews {
  total_count: number;
  avg_rating: number;
  rating_distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  featured: FeaturedReview[];
}

export interface Media {
  banner_url: string;
  gallery: string[];
  infrastructure: string[];
  office_photos: string[];
}

export interface City {
  slug: string;
  name: string;
  display_name: string;
  state: string;
  country: string;
  is_active: boolean;
  priority: number;
  tags: string[];
  media?: Media;
  geo: Geo;
  environment: Environment;
  infrastructure: Infrastructure;
  security: Security;
  zones: Zone[];
  seo: SEO;
  operations?: Operations;
  reviews?: Reviews;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
