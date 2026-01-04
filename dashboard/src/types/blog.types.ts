export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  reading_time: number;
  cover_image: string;
  category: string;
  tags: string[];
  author: string;
  seo: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: string;
  createdAt: string;
  updatedAt: string;
}
