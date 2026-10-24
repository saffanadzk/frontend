import { MetadataRoute } from 'next';
import { getCategories, getPublishedArticles } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic Categories
  try {
    const categories = await getCategories();
    categories.forEach((cat) => {
      routes.push({
        url: `${siteUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
  } catch (e) {
    console.error('Failed to fetch categories for sitemap', e);
  }

  // Dynamic Published Articles (Strictly published only)
  try {
    const articlesRes = await getPublishedArticles({ limit: 100 });
    const articles = articlesRes.data || [];
    articles.forEach((art) => {
      routes.push({
        url: `${siteUrl}/articles/${art.slug}`,
        lastModified: art.updated_at ? new Date(art.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  } catch (e) {
    console.error('Failed to fetch articles for sitemap', e);
  }

  return routes;
}
