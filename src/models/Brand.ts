import mongoose, { Schema, Document } from 'mongoose';

// ============== INTERFACES ==============

export interface IBrand extends Document {
  // ===== IDENTITY & VISUALS =====
  name: string;
  slug: string; // e.g., 'sony', 'canon'
  tagline?: string; // e.g., "Be Alpha"
  description?: string; // Full markdown story
  
  logo?: {
    light?: string; // For dark backgrounds
    dark?: string;  // For light backgrounds
  };
  cover_image?: string; // Hero banner for the brand page
  
  // ===== AUTHORITY & TRUST (CRITICAL FOR INDIA) =====
  status: {
    is_active: boolean;
    is_authorized_dealer: boolean; // Triggers "Authorized Partner" badge
    partner_tier?: string; // e.g., "Platinum Partner", "Pro Dealer"
    authorization_certificate?: string; // URL to image of your dealer certificate (Builds massive trust)
  };

  // ===== SUPPORT HUB =====
  support?: {
    india_service_url?: string; // "Find Service Center" link
    india_contact_number?: string;
    india_support_email?: string;
    whatsapp_support?: string; // Very important for Indian commerce
    
    warranty_info?: {
      policy_url?: string; // Link to official PDF/Page
      text_summary?: string; // e.g., "2 Years Standard + 1 Year upon registration"
      is_international_valid?: boolean; // FAQ: "Does this have intl warranty?"
    };
  };

  // ===== RESOURCE LIBRARY (SEO GOLDMINE) =====
  resources?: Array<{
    type: 'firmware' | 'manual' | 'brochure' | 'roadmap' | 'software' | 'mobile_app';
    title: string; // e.g., "Lens Roadmap 2024-2025"
    url: string;   // External link or your hosted file
    updated_at?: Date;
  }>;

  // ===== PRODUCT NAVIGATION =====
  product_series?: string[]; // e.g., ["EOS R", "EOS M", "Cinema EOS"]
  mount_systems?: string[]; // e.g., ["E-Mount", "RF-Mount", "X-Mount"] - Critical for cameras
  
  // ===== MARKETING & SALES =====
  current_offers?: Array<{
    title: string; // e.g., "Summer Cashback Offer"
    description?: string;
    banner_image?: string;
    link?: string;
    valid_until?: Date;
  }>;

  // ===== MEDIA =====
  brand_video?: {
    url?: string; // Youtube/Vimeo
    thumbnail?: string;
  };
  
  // ===== SEO & FAQ =====
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  
  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };

  // ===== METRICS =====
  sort_order: number; // For custom ordering on homepage
  featured: boolean; // Show on "Our Top Brands"
  
  // TIMESTAMPS
  created_at: Date;
  updated_at: Date;
}

// ============== SCHEMA ==============

const BrandSchema: Schema = new Schema({
  // ===== IDENTITY =====
  name: { type: String, required: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  tagline: String,
  description: String,
  
  logo: {
    light: String,
    dark: String
  },
  cover_image: String,

  // ===== AUTHORITY =====
  status: {
    is_active: { type: Boolean, default: true, index: true },
    is_authorized_dealer: { type: Boolean, default: false },
    partner_tier: String,
    authorization_certificate: String 
  },

  // ===== SUPPORT HUB =====
  support: {
    india_service_url: String,
    india_contact_number: String,
    india_support_email: String,
    whatsapp_support: String,
    
    warranty_info: {
      policy_url: String,
      text_summary: String,
      is_international_valid: { type: Boolean, default: false }
    }
  },

  // ===== RESOURCES =====
  resources: [{
    type: { 
      enum: ['firmware', 'manual', 'brochure', 'roadmap', 'software', 'mobile_app'] 
    },
    title: String,
    url: String,
    updated_at: Date
  }],

  // ===== PRODUCT NAVIGATION =====
  product_series: [String],
  mount_systems: [String], // Important for cross-linking (e.g., Brand -> Lenses)

  // ===== MARKETING =====
  current_offers: [{
    title: String,
    description: String,
    banner_image: String,
    link: String,
    valid_until: Date
  }],

  // ===== MEDIA =====
  brand_video: {
    url: String,
    thumbnail: String
  },

  // ===== SEO & FAQ =====
  faqs: [{
    question: String,
    answer: String
  }],
  
  seo: {
    meta_title: String,
    meta_description: String,
    keywords: [String]
  },

  // ===== DISPLAY =====
  sort_order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }

}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

// Indexes
BrandSchema.index({ name: 'text', description: 'text', 'resources.title': 'text' });
BrandSchema.index({ 'status.is_authorized_dealer': 1 });

export default mongoose.model<IBrand>('Brand', BrandSchema);
