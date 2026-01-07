export interface Zone {
  _id: string;
  // ─────────────────────────────────────────────
  // 1. IDENTITY & PARENT
  // ─────────────────────────────────────────────
  name: string;
  slug: string; // e.g., "south-delhi", "whitefield-bangalore"
  city_id: string;
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
    popular_product_type: 'wifi_camera' | 'ip_setup' | 'analog_hd'; // or string if dynamic
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
    last_installation_date?: string;
  };

  // ─────────────────────────────────────────────
  // 7. SEO METADATA
  // ─────────────────────────────────────────────
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };

  created_at: string;
  updated_at: string;
}
