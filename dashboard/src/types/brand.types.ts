export interface Brand {
  _id?: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  
  logo?: {
    light?: string;
    dark?: string;
  };
  cover_image?: string;
  
  status: {
    is_active: boolean;
    is_authorized_dealer: boolean;
    partner_tier?: string;
    authorization_certificate?: string;
  };

  support?: {
    india_service_url?: string;
    india_contact_number?: string;
    india_support_email?: string;
    whatsapp_support?: string;
    
    warranty_info?: {
      policy_url?: string;
      text_summary?: string;
      is_international_valid?: boolean;
    };
  };

  resources?: Array<{
    type: 'firmware' | 'manual' | 'brochure' | 'roadmap' | 'software' | 'mobile_app';
    title: string;
    url: string;
    updated_at?: Date;
  }>;

  product_series?: string[];
  mount_systems?: string[];
  
  current_offers?: Array<{
    title: string;
    description?: string;
    banner_image?: string;
    link?: string;
    valid_until?: Date;
  }>;

  brand_video?: {
    url?: string;
    thumbnail?: string;
  };
  
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  
  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };

  sort_order: number;
  featured: boolean;
  
  created_at?: string;
  updated_at?: string;
}

export interface BrandFilter {
  page?: number;
  limit?: number;
  is_active?: boolean;
  is_authorized?: boolean;
  featured?: boolean;
  search?: string;
}
