import mongoose, { Schema, Document, Types } from 'mongoose';

// ============== INTERFACES ==============

export interface IZone extends Document {
  // ─────────────────────────────────────────────
  // 1. IDENTITY & PARENT
  // ─────────────────────────────────────────────
  name: string;
  slug: string; // e.g., "south-delhi", "whitefield-bangalore"
  city_id: Types.ObjectId;
  city_name: string;
  
  // Classification
  type: 'residential' | 'commercial' | 'industrial' | 'mixed' | 'luxury';
  
  // Status
  is_active: boolean;      // Visible on website?
  is_serviceable: boolean; // Do we take orders here?
  
  // ─────────────────────────────────────────────
  // 2. GEOGRAPHY (For Assigning Technicians)
  // ─────────────────────────────────────────────
  geo: {
    pincodes: string[]; // CRITICAL: Matches user input to zone
    latitude: number;
    longitude: number;
    localities: string[]; // List of sub-areas (e.g., "Saket", "Hauz Khas")
    landmark_boundary: string; // e.g., "South of Ring Road"
  };

  // ─────────────────────────────────────────────
  // 3. OPERATIONS & LOGISTICS
  // ─────────────────────────────────────────────
  operations: {
    hub_center: string; // Which office manages this? e.g. "Okhla Hub"
    distance_from_hub_km: number;
    
    // Team Assignment
    primary_technician_team: string; // e.g., "Team Alpha"
    
    // Cost Logic
    visit_charge: number; // e.g., 500 (Higher for far zones)
    min_order_value: number; // e.g., 5000
    
    // Constraints
    requires_society_permission: boolean; // Warning for technician
    night_work_allowed: boolean;
  };

  // ─────────────────────────────────────────────
  // 4. MARKET PROFILE (For Sales Pitch)
  // ─────────────────────────────────────────────
  market: {
    spending_capacity: 'high' | 'medium' | 'low';
    crime_rate: 'high' | 'moderate' | 'low'; // Sales trigger
    
    // What sells here?
    popular_product_type: 'wifi_camera' | 'ip_setup' | 'analog_hd';
    competition_density: 'high' | 'medium' | 'low';
  };

  // ─────────────────────────────────────────────
  // 5. LANDING PAGE CONTENT (Programmatic SEO)
  // ─────────────────────────────────────────────
  content: {
    page_title: string; // e.g., "CCTV Installation Services in South Delhi"
    hero_image: string;
    
    description_short: string; // For cards
    description_long: string; // Markdown supported for bottom of page
    
    // Dynamic SEO Text
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    
    // Social Proof specific to this zone
    zone_specific_testimonials: Array<{
      customer_name: string;
      locality: string;
      text: string;
    }>;
  };

  // ─────────────────────────────────────────────
  // 6. METRICS
  // ─────────────────────────────────────────────
  stats: {
    total_installations: number;
    active_inquiries: number;
    last_installation_date: Date;
  };

  // ─────────────────────────────────────────────
  // 7. SEO METADATA
  // ─────────────────────────────────────────────
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };

  created_at: Date;
  updated_at: Date;
}

// ============== SCHEMA ==============

const ZoneSchema: Schema = new Schema({
  // ===== IDENTITY =====
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  city_id: { type: Schema.Types.ObjectId, ref: 'City', required: true, index: true },
  city_name: { type: String, required: true },
  
  type: { 
    type: String, 
    enum: ['residential', 'commercial', 'industrial', 'mixed', 'luxury'],
    default: 'mixed' 
  },
  
  is_active: { type: Boolean, default: true, index: true },
  is_serviceable: { type: Boolean, default: true },

  // ===== GEOGRAPHY =====
  geo: {
    pincodes: [{ type: String, index: true }], // Indexed for fast search
    latitude: Number,
    longitude: Number,
    localities: [String], // Array of strings is enough, no need for complex objects
    landmark_boundary: String
  },

  // ===== OPERATIONS =====
  operations: {
    hub_center: String,
    distance_from_hub_km: Number,
    primary_technician_team: String,
    
    visit_charge: { type: Number, default: 0 },
    min_order_value: { type: Number, default: 0 },
    
    requires_society_permission: { type: Boolean, default: false },
    night_work_allowed: { type: Boolean, default: false }
  },

  // ===== MARKET PROFILE =====
  market: {
    spending_capacity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    crime_rate: { type: String, enum: ['high', 'moderate', 'low'], default: 'moderate' },
    popular_product_type: String,
    competition_density: String
  },

  // ===== CONTENT (LANDING PAGE) =====
  content: {
    page_title: String,
    hero_image: String,
    description_short: String,
    description_long: String, // Markdown
    
    faqs: [{
      question: String,
      answer: String
    }],
    
    zone_specific_testimonials: [{
      customer_name: String,
      locality: String,
      text: String
    }]
  },

  // ===== METRICS =====
  stats: {
    total_installations: { type: Number, default: 0 },
    active_inquiries: { type: Number, default: 0 },
    last_installation_date: Date
  },

  // ===== SEO =====
  seo: {
    meta_title: String,
    meta_description: String,
    keywords: [String]
  }

}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

// ============== INDEXES ==============
ZoneSchema.index({ 'geo.pincodes': 1 }); // Fast pincode lookup
ZoneSchema.index({ city_id: 1, is_active: 1 }); // List active zones in a city
ZoneSchema.index({ name: 'text', 'geo.localities': 'text' }); // Search by Zone Name or Locality Name

export default mongoose.model<IZone>('Zone', ZoneSchema);
