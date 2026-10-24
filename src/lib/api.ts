import {
  Article,
  Category,
  Comment,
  EditorialConfig,
  PaginatedResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Fetch public editorial brand configuration.
 */
export async function getEditorialConfig(): Promise<EditorialConfig> {
  try {
    const res = await fetch(`${API_BASE}/editorial-config`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch editorial config');
    return await res.json();
  } catch (error) {
    // Elegant fallback if backend is momentarily unreachable
    return {
      brand_name: 'ATELIER',
      tagline: 'Journal of Architecture, Spaces & Spatial Culture',
      description: 'A premium digital editorial magazine exploring monolithic architecture, interior living, craftsmanship, and contemporary design perspectives.',
      founding_year: 2026,
      contact_email: 'editorial@atelier-journal.com',
      navigation: [
        { label: 'Journal', href: '/' },
        { label: 'Architecture', href: '/category/architecture-spaces' },
        { label: 'Interior', href: '/category/interior-living' },
        { label: 'Art & Culture', href: '/category/art-culture' },
        { label: 'Objects', href: '/category/product-object-design' },
        { label: 'Visual', href: '/category/visual-creative' },
        { label: 'About', href: '/about' },
      ],
      socials: [
        { name: 'Instagram', url: 'https://instagram.com' },
        { name: 'Pinterest', url: 'https://pinterest.com' },
        { name: 'Substack', url: 'https://substack.com' },
      ],
    };
  }
}

/**
 * Fetch published categories.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch published articles with optional category and search filters.
 */
export async function getPublishedArticles(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Article>> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());

  try {
    const url = `${API_BASE}/articles${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error('Failed to fetch articles');
    return await res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: [] };
  }
}

/**
 * Fetch single published article by slug with related articles.
 */
export async function getArticleBySlug(slug: string): Promise<{
  article: Article | null;
  related: Article[];
}> {
  try {
    const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      if (res.status === 404) return { article: null, related: [] };
      throw new Error(`Failed to fetch article: ${res.status}`);
    }

    const data = await res.json();
    return {
      article: data.article || null,
      related: data.related || [],
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return { article: null, related: [] };
  }
}

/**
 * Fetch approved comments for an article.
 */
export async function getArticleComments(articleId: number): Promise<Comment[]> {
  try {
    const res = await fetch(`${API_BASE}/articles/${articleId}/comments`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}
