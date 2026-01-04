import mongoose, { Schema, Document } from 'mongoose';

// ============== INTERFACE ==============

export interface IBlog extends Document {
  // Core Info
  title: string;
  slug: string;
  excerpt: string;
  
  // Content
  content: string; // The raw Markdown string
  reading_time: number; // Minutes
  
  // Visuals
  cover_image: string;
  
  // Taxonomy (Simple Strings)
  category: string; 
  tags: string[];
  
  // Author (Simple String)
  author: string; 
  
  // SEO
  seo: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };

  // Status
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============== SCHEMA ==============

const BlogSchema = new Schema<IBlog>({
  // ===== IDENTIFICATION =====
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    lowercase: true,
    trim: true
  },
  excerpt: { 
    type: String, 
    maxlength: 300,
    trim: true
  },

  // ===== CONTENT =====
  content: { 
    type: String, 
    required: true 
  },
  reading_time: { 
    type: Number, 
    default: 0 
  },

  // ===== MEDIA =====
  cover_image: { 
    type: String,
    trim: true
  },

  // ===== TAXONOMY (Simple Strings) =====
  category: { 
    type: String, 
    required: true,
    index: true,
    trim: true
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],

  // ===== AUTHOR (Simple String) =====
  author: { 
    type: String, 
    required: true,
    trim: true
  },

  // ===== SEO =====
  seo: {
    meta_title: String,
    meta_description: String,
    keywords: [String]
  },

  // ===== STATE =====
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft',
    index: true
  },
  is_featured: { 
    type: Boolean, 
    default: false 
  },
  published_at: { 
    type: Date 
  }

}, { 
  timestamps: true 
});

// ============== INDEXES ==============
// Searchable by title, content (markdown), tags, author, or category
BlogSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text',
  author: 'text',
  category: 'text'
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
