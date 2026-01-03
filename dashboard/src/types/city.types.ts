/**
 * 🔴 DO NOT EDIT MANUALLY
 * This file is auto-generated from src/models/City.ts
 * Run `npm run sync:types` in backend to update.
 */

export interface CityMedia {
  banner_url: string;
  gallery: string[];
  infrastructure: string[];
  office_photos: string[];
  // 🆕 NEW FIELDS
  thumbnail: string;
  video_url: string;
  testimonial_videos: string[];
}

export interface City  {
  slug: string;
  name: string;
  display_name: string;
  state: string;
  country: string;
  is_active: boolean;
  priority: number;
  tags: string[];
  media: Media;

  // 🆕 NEW: Basic Info Additions
  name_local: string;
  short_code: string;
  tier: string;
  established_year: number;

  geo: {
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
    timezone: string;
    area_km2: number;
    population: number;
    density_per_km2: number;
    elevation_m: number;
    // 🆕 NEW GEO FIELDS
    place_id: string;
    plus_code: string;
  };

  environment: {
    climate: {
      type: string;
      summer_temp_c: string;
      winter_temp_c: string;
      monsoon_months: string[];
      annual_rainfall_mm: number;
    };
    air_quality: {
      avg_aqi: number;
      classification: string;
      worst_months: string[];
      best_months: string[];
    };
    water: {
      source: string[];
      supply_hours_per_day: number;
      quality_rating: string;
      availability: string;
    };
    green_cover_percent: number;
    noise_pollution: string;
    // 🆕 NEW ENVIRONMENT FIELDS
    dust_level: string;
    humidity_avg_percent: number;
    camera_friendly_months: string[];
  };

  infrastructure: {
    power: {
      provider: string[];
      avg_daily_cuts: number;
      avg_cut_duration_mins: number;
      reliability_score: number;
      industrial_connectivity: string;
      // 🆕 NEW POWER FIELDS
      voltage_stability: string;
      solar_adoption_percent: number;
      ups_penetration_percent: number;
    };
    internet: {
      fiber_providers: string[];
      avg_speed_mbps: number;
      reliability_score: number;
      '4g_coverage': string;
      '5g_available': boolean;
      // 🆕 NEW INTERNET FIELDS
      broadband_providers: string[];
      cable_providers: string[];
      avg_latency_ms: number;
    };
    housing: {
      avg_rent_1bhk: number;
      avg_rent_2bhk: number;
      avg_rent_3bhk: number;
      avg_property_price_per_sqft: number;
      availability: string;
      // 🆕 NEW HOUSING FIELDS
      dominant_construction_type: string;
      avg_building_age_years: number;
      gated_community_percent: number;
    };
    public_transport: string[];
    road_quality: string;
    metro_connectivity: boolean;
    airport_distance_km: number;
    railway_stations: number;
    // 🆕 NEW INFRASTRUCTURE FIELDS
    smart_city_project: boolean;
    traffic_congestion_level: string;
    ev_charging_stations: number;
  };

  security: {
    threat_profile: {
      crime_rate: string;
      common_crimes: string[];
      safe_score: number;
      safe_areas: string[];
      areas_to_avoid: string[];
    };
    police: {
      stations_count: number;
      response_time_mins: number;
      emergency_number: string;
      dedicated_cyber_cell: boolean;
      // 🆕 NEW POLICE FIELDS
      commissioner_office: string;
      online_fir_available: boolean;
    };
    cctv_coverage: string;
    women_safety_rating: string;
    // 🆕 NEW SECURITY FIELDS
    safe_city_project: boolean;
    govt_cctv_count: number;
    private_security_agencies: string[];
    neighborhood_watch_active: boolean;
  };

  zones: Array<{
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
  }>;

  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
    og_image: string;
    canonical_url: string;
    // 🆕 NEW SEO FIELDS
    focus_keyword: string;
    secondary_keywords: string[];
    long_tail_keywords: string[];
    local_keywords: string[];
    schema_type: string;
  };

  operations: {
    office: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      contact_phone: string;
      contact_email: string;
      working_days: string[];
    };
    hours: {
      monday_friday: string;
      saturday: string;
      sunday: string;
      holidays: string;
    };
    service_areas: string[];
    coverage_radius_km: number;
    avg_response_time_hrs: number;
    // 🆕 NEW OPERATIONS FIELDS
    team_size: number;
    technicians_count: number;
    vehicles_count: number;
    warehouse_address: string;
    emergency_available: boolean;
    installation_capacity_per_day: number;
  };

  reviews: {
    total_count: number;
    avg_rating: number;
    rating_distribution: {
      '1': number;
      '2': number;
      '3': number;
      '4': number;
      '5': number;
    };
    featured: Array<{
      id: string;
      author: string;
      rating: number;
      date: string;
      text: string;
      project_type: string;
      location: string;
      verified: boolean;
    }>;
    // 🆕 NEW REVIEW FIELDS
    google_review_url: string;
    google_place_rating: number;
    justdial_rating: number;
    platforms: Array<{
      name: string;
      url: string;
      rating: number;
      count: number;
    }>;
  };

  // 🆕 NEW TOP-LEVEL SECTIONS

  demographics: {
    total_households: number;
    urban_percent: number;
    rural_percent: number;
    literacy_rate: number;
    avg_household_income: number;
    income_distribution: {
      lower: number;
      lower_middle: number;
      middle: number;
      upper_middle: number;
      upper: number;
    };
    languages: string[];
    major_communities: string[];
    working_population_percent: number;
  };

  economy: {
    gdp_rank_in_state: number;
    major_industries: string[];
    it_parks: string[];
    industrial_areas: string[];
    commercial_hubs: string[];
    employment_rate: number;
    startup_ecosystem: string;
    ease_of_business_rank: number;
  };

  market: {
    cctv_market_size: string;
    growth_rate_percent: number;
    competition_level: string;
    major_competitors: string[];
    price_sensitivity: string;
    preferred_brands: string[];
    demand_trend: string;
    seasonal_peaks: string[];
    b2b_potential: string;
    b2c_potential: string;
    govt_tender_frequency: string;
  };

  customer_profile: {
    primary_segments: string[];
    decision_factors: string[];
    avg_budget_residential: number;
    avg_budget_commercial: number;
    preferred_contact_method: string;
    preferred_language: string;
    trust_factors: string[];
    common_objections: string[];
    payment_preferences: string[];
    emi_adoption: string;
  };

  service_config: {
    pricing_tier: string;
    price_multiplier: number;
    min_order_value: number;
    free_survey_available: boolean;
    same_day_service: boolean;
    amc_popular: boolean;
    rental_service: boolean;
    installation_warranty_months: number;
    product_warranty_months: number;
  };

  content: {
    tagline: string;
    short_description: string;
    long_description: string;
    unique_selling_points: string[];
    pain_points_addressed: string[];
    success_stories_count: number;
    case_studies: Array<{
      id: string;
      title: string;
      client_type: string;
      cameras_installed: number;
      slug: string;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };

  stats: {
    total_installations: number;
    installations_this_month: number;
    installations_this_year: number;
    total_customers: number;
    repeat_customers: number;
    referral_rate_percent: number;
    avg_project_value: number;
    largest_project_value: number;
    localities_covered: number;
    pincodes_served: number;
  };

  social: {
    whatsapp_number: string;
    facebook_page: string;
    instagram_handle: string;
    youtube_channel: string;
    google_business_url: string;
    justdial_url: string;
    indiamart_url: string;
  };

  legal: {
    gst_applicable: boolean;
    service_tax_percent: number;
    local_permits_required: string[];
    police_noc_required: boolean;
    rwa_permission_common: boolean;
  };
}

// ============== SCHEMA ==============

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
