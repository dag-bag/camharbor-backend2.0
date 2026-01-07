import mongoose, { Schema, Document, Types } from 'mongoose';

// ============== INTERFACES ==============

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
  polygon?: number[][]; // Optional for precise boundary mapping
  area_km2?: number;
  place_id?: string;
  plus_code?: string;
}

export interface ILocality extends Document {
  // Basic Info
  slug: string;
  name: string;
  display_name: string;
  name_local?: string;
  city_id: Types.ObjectId;
  zone_id?: Types.ObjectId; // Optional reference to Zone
  
  // Identifiers
  pincodes: string[];
  primary_pincode: string;
  
  // Status
  is_active: boolean;
  is_serviceable: boolean;
  priority: number;
  tier?: string;

  // Geo
  geo: ILocalityGeo;

  // SEO
  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
    schema_type?: string;
  };

  // Risk/Crime placeholders (will be expanded in Risk schemas, but good to have high-level overrides here if needed)
  risk_factor?: number; // 1-10 scale

  // Enhanced Business Data
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
}

// ============== SCHEMA ==============

const LocalitySchema: Schema = new Schema({
  // Basic Info
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  display_name: { type: String, required: true },
  name_local: { type: String, default: null },
  
  city_id: { type: Schema.Types.ObjectId, ref: 'City', required: true, index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },

  // Identifiers
  pincodes: [{ type: String, index: true }],
  primary_pincode: { type: String, required: true, index: true },

  // Status
  is_active: { type: Boolean, default: true, index: true },
  is_serviceable: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  tier: { type: String, default: 'tier_2' },

  // Geo
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
    polygon: [[Number]], // Array of arrays of numbers for simple polygon
    area_km2: Number,
    place_id: String,
    plus_code: String
  },

  // SEO
  seo: {
    meta_title: String,
    meta_description: String,
    keywords: [String],
    schema_type: { type: String, default: 'Place' }
  },

  risk_factor: { type: Number, default: 0 },

  // Enhanced Business Data
  demographics: {
    population_density: String, // e.g. "High", "Medium"
    avg_income_level: String, // "High", "Middle", "Low"
    housing_type: String // "Apartments", "Villas", "Mixed"
  },
  infrastructure: {
    power_stability: { type: String, enum: ['Excellent', 'Good', 'Poor'], default: 'Good' },
    internet_quality: { type: String, enum: ['Fiber', 'DSL', 'Mobile Only'], default: 'Fiber' },
    road_width: String
  }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ============== INDEXES ==============
LocalitySchema.index({ city_id: 1, slug: 1 }, { unique: true }); // Ensure unique slug per city if needed, though top-level slug is unique
LocalitySchema.index({ 'geo.coordinates': '2dsphere' });

export default mongoose.model<ILocality>('Locality', LocalitySchema);
