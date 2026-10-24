export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articles_count?: number;
  published_articles_count?: number;
}

export interface Author {
  id: number;
  name: string;
  avatar: string | null;
  bio: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_alt: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  rejection_note?: string | null;
  category: Category;
  author: Author;
  seo_title: string;
  seo_description: string;
  reading_time: string;
  published_at: string | null;
  published_at_formatted: string | null;
  created_at?: string;
  updated_at?: string;
  is_bookmarked?: boolean;
  comments_count?: number;
}

export interface Comment {
  id: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  created_at: string;
  created_at_iso?: string;
}

export interface EditorialConfig {
  brand_name: string;
  tagline: string;
  description: string;
  founding_year: number;
  contact_email: string;
  navigation: Array<{ label: string; href: string }>;
  socials: Array<{ name: string; url: string }>;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'reader' | 'contributor' | 'editor' | 'admin';
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
