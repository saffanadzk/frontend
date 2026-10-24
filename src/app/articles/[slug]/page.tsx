import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, getArticleComments } from '@/lib/api';
import BookmarkButton from '@/components/BookmarkButton';
import CommentSection from '@/components/CommentSection';
import ArticleCard from '@/components/ArticleCard';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Dispatch Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  return {
    title: article.seo_title || `${article.title} | ATELIER`,
    description: article.seo_description || article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      url: articleUrl,
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: [article.author?.name || 'ATELIER Editor'],
      images: [
        {
          url: article.image_url,
          alt: article.image_alt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      images: [article.image_url],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const { article, related } = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const comments = await getArticleComments(article.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Schema.org Article Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.image_url],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.author?.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ATELIER Journal',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-default.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
  };

  return (
    <>
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 md:py-24 space-y-12 md:space-y-16">
        {/* Editorial Top Kicker & Headline */}
        <header className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-center space-x-2 watershedd-sub text-[#8F725A]">
            <Link href="/" className="hover:text-[#161514]">
              Field Notes
            </Link>
            <span>/</span>
            <Link
              href={`/category/${article.category?.slug}`}
              className="hover:text-[#161514]"
            >
              {article.category?.name}
            </Link>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#161514] font-normal leading-[1.12] tracking-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#5C5852] font-light leading-relaxed max-w-2xl mx-auto">
            {article.excerpt}
          </p>

          <div className="pt-4 border-t border-b border-[#E2DFD6] py-3.5 flex flex-wrap items-center justify-between gap-4 watershedd-sub text-[#7A766F]">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-[#161514]">{article.author?.name}</span>
              <span>·</span>
              <span>{article.published_at_formatted}</span>
              <span>·</span>
              <span>{article.reading_time}</span>
            </div>

            <div>
              <BookmarkButton articleId={article.id} initialBookmarked={article.is_bookmarked} />
            </div>
          </div>
        </header>

        {/* Full-width Photography Frame (Watershedd signature) */}
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-[16/10] md:aspect-[21/10] w-full overflow-hidden bg-[#E2DFD6]" style={{ position: 'relative' }}>
            <Image
              src={article.image_url}
              alt={article.image_alt || article.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          </div>
          {article.image_alt && (
            <p className="mt-3 watershedd-sub text-[10px] text-[#A8A49C] text-center font-light">
              {article.image_alt}
            </p>
          )}
        </div>

        {/* Reading Column */}
        <div className="max-w-3xl mx-auto">
          <div
            className="editorial-prose"
            dangerouslySetInnerHTML={{
              __html: formatArticleBody(article.content),
            }}
          />

          {/* Author Colophon */}
          <div className="mt-20 pt-8 border-t border-[#E2DFD6] flex items-center space-x-6">
            <div className="w-14 h-14 rounded-full bg-[#ECEAE2] border border-[#D1C9BC] flex items-center justify-center font-serif text-lg font-normal text-[#161514] flex-shrink-0">
              {article.author?.name?.charAt(0) || 'A'}
            </div>
            <div className="space-y-1">
              <span className="watershedd-sub text-[#8F725A] block">
                Dispatches by {article.author?.name}
              </span>
              <p className="text-xs text-[#5C5852] leading-relaxed font-light">
                {article.author?.bio || 'Curator and writer exploring tectonic architecture, materiality, and slow spatial design.'}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection articleId={article.id} initialComments={comments} />
        </div>

        {/* Related Field Notes */}
        {related.length > 0 && (
          <section className="mt-24 pt-16 border-t border-[#E2DFD6]">
            <div className="pb-8 mb-8 border-b border-[#E2DFD6]">
              <span className="watershedd-sub text-[#8F725A] block mb-1">
                Further Inquiries
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-[#161514] font-normal">
                Related {article.category?.name} Studies
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {related.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function formatArticleBody(rawContent: string): string {
  if (!rawContent) return '';

  return rawContent
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('## ')) {
        return `<h2>${trimmed.replace(/^##\s+/, '')}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3>${trimmed.replace(/^###\s+/, '')}</h3>`;
      }
      if (trimmed.startsWith('> ')) {
        return `<blockquote>${trimmed.replace(/^>\s+/, '').replace(/^"/, '').replace(/"$/, '')}</blockquote>`;
      }
      if (trimmed.startsWith('- ')) {
        const listItems = trimmed
          .split('\n')
          .map((li) => `<li>${li.replace(/^-\s+/, '')}</li>`)
          .join('');
        return `<ul>${listItems}</ul>`;
      }
      return `<p>${trimmed}</p>`;
    })
    .join('');
}
