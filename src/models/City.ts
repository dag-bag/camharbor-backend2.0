import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  slug: string;
  name: string;
  display_name: string;
  state: string;
  country: string;
  is_active: boolean;
  priority: number;
  tags: string[];
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
  };
  infrastructure: {
    power: {
      provider: string[];
      avg_daily_cuts: number;
      avg_cut_duration_mins: number;
      reliability_score: number;
      industrial_connectivity: string;
    };
    internet: {
      fiber_providers: string[];
      avg_speed_mbps: number;
      reliability_score: number;
      '4g_coverage': string;
      '5g_available': boolean;
    };
    housing: {
      avg_rent_1bhk: number;
      avg_rent_2bhk: number;
      avg_rent_3bhk: number;
      avg_property_price_per_sqft: number;
      availability: string;
    };
    public_transport: string[];
    road_quality: string;
    metro_connectivity: boolean;
    airport_distance_km: number;
    railway_stations: number;
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
    };
    cctv_coverage: string;
    women_safety_rating: string;
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
  };
}

const CitySchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  display_name: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  tags: [String],
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
    elevation_m: Number
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
    noise_pollution: String
  },
  infrastructure: {
    power: {
      provider: [String],
      avg_daily_cuts: Number,
      avg_cut_duration_mins: Number,
      reliability_score: Number,
      industrial_connectivity: String
    },
    internet: {
      fiber_providers: [String],
      avg_speed_mbps: Number,
      reliability_score: Number,
      '4g_coverage': String,
      '5g_available': Boolean
    },
    housing: {
      avg_rent_1bhk: Number,
      avg_rent_2bhk: Number,
      avg_rent_3bhk: Number,
      avg_property_price_per_sqft: Number,
      availability: String
    },
    public_transport: [String],
    road_quality: String,
    metro_connectivity: Boolean,
    airport_distance_km: Number,
    railway_stations: Number
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
      dedicated_cyber_cell: Boolean
    },
    cctv_coverage: String,
    women_safety_rating: String
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
    canonical_url: String
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
    avg_response_time_hrs: Number
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
    }]
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<ICity>('City', CitySchema);
