import mongoose, { Schema, Document } from 'mongoose';

// ============== INTERFACES ==============

export interface ICityMedia {
  banner_url: string;
  gallery: string[];
  infrastructure: string[];
  office_photos: string[];
  // 🆕 NEW FIELDS
  thumbnail: string;
  video_url: string;
  testimonial_videos: string[];
}

export interface ICity extends Document {
  slug: string;
  name: string;
  display_name: string;
  state: string;
  country: string;
  is_active: boolean;
  priority: number;
  tags: string[];
  media: ICityMedia;

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

const CitySchema: Schema = new Schema({
  // EXISTING FIELDS (unchanged)
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  display_name: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  tags: [String],

  // 🆕 NEW BASIC FIELDS
  name_local: { type: String, default: null },
  short_code: { type: String, default: null },
  tier: { type: String, default: 'tier_2' },
  established_year: { type: Number, default: null },

  media: {
    banner_url: { type: String, default: null },
    gallery: [String],
    infrastructure: [String],
    office_photos: [String],
    // 🆕 NEW
    thumbnail: { type: String, default: null },
    video_url: { type: String, default: null },
    testimonial_videos: [String]
  },

  geo: {
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    bounds: {
      north: Number,
      south: Number,
      east: Number,
      west: Number
    },
    timezone: String,
    area_km2: Number,
    population: Number,
    density_per_km2: Number,
    elevation_m: Number,
    // 🆕 NEW
    place_id: { type: String, default: null },
    plus_code: { type: String, default: null }
  },

  environment: {
    climate: {
      type: { type: String },
      summer_temp_c: String,
      winter_temp_c: String,
      monsoon_months: [String],
      annual_rainfall_mm: Number
    },
    air_quality: {
      avg_aqi: Number,
      classification: String,
      worst_months: [String],
      best_months: [String]
    },
    water: {
      source: [String],
      supply_hours_per_day: Number,
      quality_rating: String,
      availability: String
    },
    green_cover_percent: Number,
    noise_pollution: String,
    // 🆕 NEW
    dust_level: { type: String, default: null },
    humidity_avg_percent: { type: Number, default: null },
    camera_friendly_months: [String]
  },

  infrastructure: {
    power: {
      provider: [String],
      avg_daily_cuts: Number,
      avg_cut_duration_mins: Number,
      reliability_score: Number,
      industrial_connectivity: String,
      // 🆕 NEW
      voltage_stability: { type: String, default: null },
      solar_adoption_percent: { type: Number, default: 0 },
      ups_penetration_percent: { type: Number, default: 0 }
    },
    internet: {
      fiber_providers: [String],
      avg_speed_mbps: Number,
      reliability_score: Number,
      '4g_coverage': String,
      '5g_available': Boolean,
      // 🆕 NEW
      broadband_providers: [String],
      cable_providers: [String],
      avg_latency_ms: { type: Number, default: null }
    },
    housing: {
      avg_rent_1bhk: Number,
      avg_rent_2bhk: Number,
      avg_rent_3bhk: Number,
      avg_property_price_per_sqft: Number,
      availability: String,
      // 🆕 NEW
      dominant_construction_type: { type: String, default: null },
      avg_building_age_years: { type: Number, default: null },
      gated_community_percent: { type: Number, default: 0 }
    },
    public_transport: [String],
    road_quality: String,
    metro_connectivity: Boolean,
    airport_distance_km: Number,
    railway_stations: Number,
    // 🆕 NEW
    smart_city_project: { type: Boolean, default: false },
    traffic_congestion_level: { type: String, default: null },
    ev_charging_stations: { type: Number, default: 0 }
  },

  security: {
    threat_profile: {
      crime_rate: String,
      common_crimes: [String],
      safe_score: Number,
      safe_areas: [String],
      areas_to_avoid: [String]
    },
    police: {
      stations_count: Number,
      response_time_mins: Number,
      emergency_number: String,
      dedicated_cyber_cell: Boolean,
      // 🆕 NEW
      commissioner_office: { type: String, default: null },
      online_fir_available: { type: Boolean, default: false }
    },
    cctv_coverage: String,
    women_safety_rating: String,
    // 🆕 NEW
    safe_city_project: { type: Boolean, default: false },
    govt_cctv_count: { type: Number, default: 0 },
    private_security_agencies: [String],
    neighborhood_watch_active: { type: Boolean, default: false }
  },

  zones: [{
    id: String,
    name: String,
    slug: String,
    description: String,
    type: { type: String },
    key_localities: [String],
    suitable_for: [String],
    avg_security_rating: Number,
    cctv_demand: String,
    popular_camera_types: [String]
  }],

  seo: {
    meta_title: String,
    meta_description: String,
    keywords: [String],
    og_image: String,
    canonical_url: String,
    // 🆕 NEW
    focus_keyword: { type: String, default: null },
    secondary_keywords: [String],
    long_tail_keywords: [String],
    local_keywords: [String],
    schema_type: { type: String, default: 'LocalBusiness' }
  },

  operations: {
    office: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      contact_phone: String,
      contact_email: String,
      working_days: [String]
    },
    hours: {
      monday_friday: String,
      saturday: String,
      sunday: String,
      holidays: String
    },
    service_areas: [String],
    coverage_radius_km: Number,
    avg_response_time_hrs: Number,
    // 🆕 NEW
    team_size: { type: Number, default: 0 },
    technicians_count: { type: Number, default: 0 },
    vehicles_count: { type: Number, default: 0 },
    warehouse_address: { type: String, default: null },
    emergency_available: { type: Boolean, default: false },
    installation_capacity_per_day: { type: Number, default: 5 }
  },

  reviews: {
    total_count: Number,
    avg_rating: Number,
    rating_distribution: {
      '1': Number,
      '2': Number,
      '3': Number,
      '4': Number,
      '5': Number
    },
    featured: [{
      id: String,
      author: String,
      rating: Number,
      date: String,
      text: String,
      project_type: String,
      location: String,
      verified: Boolean
    }],
    // 🆕 NEW
    google_review_url: { type: String, default: null },
    google_place_rating: { type: Number, default: null },
    justdial_rating: { type: Number, default: null },
    platforms: [{
      name: String,
      url: String,
      rating: Number,
      count: Number
    }]
  },

  // 🆕 NEW TOP-LEVEL SECTIONS (all with defaults)

  demographics: {
    total_households: { type: Number, default: null },
    urban_percent: { type: Number, default: null },
    rural_percent: { type: Number, default: null },
    literacy_rate: { type: Number, default: null },
    avg_household_income: { type: Number, default: null },
    income_distribution: {
      lower: { type: Number, default: 0 },
      lower_middle: { type: Number, default: 0 },
      middle: { type: Number, default: 0 },
      upper_middle: { type: Number, default: 0 },
      upper: { type: Number, default: 0 }
    },
    languages: [String],
    major_communities: [String],
    working_population_percent: { type: Number, default: null }
  },

  economy: {
    gdp_rank_in_state: { type: Number, default: null },
    major_industries: [String],
    it_parks: [String],
    industrial_areas: [String],
    commercial_hubs: [String],
    employment_rate: { type: Number, default: null },
    startup_ecosystem: { type: String, default: null },
    ease_of_business_rank: { type: Number, default: null }
  },

  market: {
    cctv_market_size: { type: String, default: null },
    growth_rate_percent: { type: Number, default: null },
    competition_level: { type: String, default: 'medium' },
    major_competitors: [String],
    price_sensitivity: { type: String, default: 'medium' },
    preferred_brands: [String],
    demand_trend: { type: String, default: 'stable' },
    seasonal_peaks: [String],
    b2b_potential: { type: String, default: 'medium' },
    b2c_potential: { type: String, default: 'medium' },
    govt_tender_frequency: { type: String, default: null }
  },

  customer_profile: {
    primary_segments: [String],
    decision_factors: [String],
    avg_budget_residential: { type: Number, default: null },
    avg_budget_commercial: { type: Number, default: null },
    preferred_contact_method: { type: String, default: 'phone' },
    preferred_language: { type: String, default: 'hindi' },
    trust_factors: [String],
    common_objections: [String],
    payment_preferences: [String],
    emi_adoption: { type: String, default: 'low' }
  },

  service_config: {
    pricing_tier: { type: String, default: 'standard' },
    price_multiplier: { type: Number, default: 1.0 },
    min_order_value: { type: Number, default: 0 },
    free_survey_available: { type: Boolean, default: true },
    same_day_service: { type: Boolean, default: false },
    amc_popular: { type: Boolean, default: false },
    rental_service: { type: Boolean, default: false },
    installation_warranty_months: { type: Number, default: 12 },
    product_warranty_months: { type: Number, default: 24 }
  },

  content: {
    tagline: { type: String, default: null },
    short_description: { type: String, default: null },
    long_description: { type: String, default: null },
    unique_selling_points: [String],
    pain_points_addressed: [String],
    success_stories_count: { type: Number, default: 0 },
    case_studies: [{
      id: String,
      title: String,
      client_type: String,
      cameras_installed: Number,
      slug: String
    }],
    faqs: [{
      question: String,
      answer: String
    }]
  },

  stats: {
    total_installations: { type: Number, default: 0 },
    installations_this_month: { type: Number, default: 0 },
    installations_this_year: { type: Number, default: 0 },
    total_customers: { type: Number, default: 0 },
    repeat_customers: { type: Number, default: 0 },
    referral_rate_percent: { type: Number, default: 0 },
    avg_project_value: { type: Number, default: 0 },
    largest_project_value: { type: Number, default: 0 },
    localities_covered: { type: Number, default: 0 },
    pincodes_served: { type: Number, default: 0 }
  },

  social: {
    whatsapp_number: { type: String, default: null },
    facebook_page: { type: String, default: null },
    instagram_handle: { type: String, default: null },
    youtube_channel: { type: String, default: null },
    google_business_url: { type: String, default: null },
    justdial_url: { type: String, default: null },
    indiamart_url: { type: String, default: null }
  },

  legal: {
    gst_applicable: { type: Boolean, default: true },
    service_tax_percent: { type: Number, default: 18 },
    local_permits_required: [String],
    police_noc_required: { type: Boolean, default: false },
    rwa_permission_common: { type: Boolean, default: false }
  }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ============== INDEXES ==============
CitySchema.index({ state: 1 });

// Virtual Population for Zones
CitySchema.virtual('related_zones', {
  ref: 'Zone',
  localField: '_id',
  foreignField: 'city_id'
});

// Ensure virtuals are included in toJSON/toObject
CitySchema.set('toJSON', { virtuals: true });
CitySchema.set('toObject', { virtuals: true });

CitySchema.index({ is_active: 1, priority: -1 });
CitySchema.index({ 'geo.coordinates': '2dsphere' });
CitySchema.index({ tags: 1 });
CitySchema.index({ tier: 1 });

export default mongoose.model<ICity>('City', CitySchema);
