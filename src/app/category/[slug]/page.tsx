import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategories, getPublishedArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Discipline Not Found' };
  }

  return {
    title: `${category.name} — Architectural & Spatial Review`,
    description: category.description || `Read curated essays and architectural features in ${category.name}.`,
    openGraph: {
      title: `${category.name} | ATELIER Journal`,
      description: category.description || `Curated essays in ${category.name}.`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const [categories, articlesRes] = await Promise.all([
    getCategories(),
    getPublishedArticles({ category: slug, page: currentPage, limit: 10 }),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const articles = articlesRes.data || [];
  const meta = articlesRes.meta;

  const leadArticle = articles[0];
  const sideArticle = articles[1];
  const restArticles = articles.slice(2);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 md:py-24 space-y-20">
      {/* Category Masthead Header */}
      <header className="border-b border-[#E2DFD6] pb-12 space-y-4 max-w-4xl">
        <div className="flex items-center space-x-2 watershedd-sub text-[#8F725A]">
          <Link href="/" className="hover:text-[#161514]">
            Field Notes
          </Link>
          <span>/</span>
          <span>Index</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl text-[#161514] font-normal tracking-tight leading-[1.1]">
          {currentCategory.name}
        </h1>

        {currentCategory.description && (
          <p className="text-[#5C5852] text-base md:text-lg font-light leading-relaxed max-w-2xl">
            {currentCategory.description}
          </p>
        )}

        <div className="watershedd-sub text-[10px] text-[#A8A49C] pt-2">
          {articles.length} Published Dispatches
        </div>
      </header>

      {/* Empty State */}
      {articles.length === 0 ? (
        <div className="py-24 text-center bg-[#ECEAE2] p-12 space-y-4">
          <p className="font-serif text-2xl text-[#161514]">
            No field notes currently archived under this discipline.
          </p>
          <p className="text-xs text-[#7A766F] uppercase tracking-wider">
            Our editorial staff is preparing new dispatches. Check back shortly.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 watershedd-sub text-[#161514] border-b border-[#161514] pb-1"
          >
            Return to All Field Notes
          </Link>
        </div>
      ) : (
        <div className="space-y-20">
          {/* Asymmetric Lead Duo */}
          {(leadArticle || sideArticle) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {leadArticle && (
                <div className="lg:col-span-8">
                  <ArticleCard article={leadArticle} variant="wide" />
                </div>
              )}
              {sideArticle && (
                <div className="lg:col-span-4 lg:pt-8">
                  <ArticleCard article={sideArticle} variant="portrait" />
                </div>
              )}
            </div>
          )}

          {/* Remaining Articles in Staggered Grid */}
          {restArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 pt-8 border-t border-[#E2DFD6]">
              {restArticles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="border-t border-[#E2DFD6] pt-10 flex justify-between items-center text-[11px] uppercase tracking-[0.25em] text-[#7A766F]">
          {currentPage > 1 ? (
            <Link
              href={`/category/${slug}?page=${currentPage - 1}`}
              className="hover:text-[#161514] border-b border-transparent hover:border-[#161514] pb-0.5"
            >
              ← Previous Entries
            </Link>
          ) : (
            <div />
          )}

          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>

          {currentPage < meta.last_page ? (
            <Link
              href={`/category/${slug}?page=${currentPage + 1}`}
              className="hover:text-[#161514] border-b border-transparent hover:border-[#161514] pb-0.5"
            >
              Next Entries →
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
