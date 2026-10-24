import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  variant?: 'wide' | 'portrait' | 'medium' | 'standard';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  // 1. WIDE CINEMATIC ESSAY
  if (variant === 'wide') {
    return (
      <article className="group space-y-5">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E2DFD6]" style={{ position: 'relative' }}>
          <Link href={`/articles/${article.slug}`}>
            <Image
              src={article.image_url}
              alt={article.image_alt || article.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </Link>
          {article.category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="watershedd-tag text-white bg-black/40 backdrop-blur-sm px-3 py-1">
                {article.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {article.category && (
            <span className="watershedd-sub text-[#8F725A] block">
              {article.category.name}
            </span>
          )}
          <Link href={`/articles/${article.slug}`} className="block">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#161514] font-normal leading-[1.2] group-hover:text-[#8F725A] transition-colors">
              {article.title}
            </h2>
          </Link>
          <p className="text-[#5C5852] text-sm md:text-base leading-relaxed font-light max-w-3xl">
            {article.excerpt}
          </p>
          <div className="watershedd-sub text-[10px] text-[#A8A49C] pt-1">
            <span>By {article.author?.name}</span>
            <span className="mx-2">·</span>
            <span>{article.published_at_formatted}</span>
            <span className="mx-2">·</span>
            <span>{article.reading_time}</span>
          </div>
        </div>
      </article>
    );
  }

  // 2. PORTRAIT VERTICAL STUDY
  if (variant === 'portrait') {
    return (
      <article className="group space-y-4">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E2DFD6]" style={{ position: 'relative' }}>
          <Link href={`/articles/${article.slug}`}>
            <Image
              src={article.image_url}
              alt={article.image_alt || article.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </Link>
          {article.category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="watershedd-tag text-white bg-black/40 backdrop-blur-sm px-3 py-1">
                {article.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2.5 pt-1">
          {article.category && (
            <span className="watershedd-sub text-[#8F725A] block">
              {article.category.name}
            </span>
          )}
          <Link href={`/articles/${article.slug}`} className="block">
            <h3 className="font-serif text-xl md:text-2xl text-[#161514] font-normal leading-snug group-hover:text-[#8F725A] transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-[#5C5852] text-xs md:text-sm leading-relaxed font-light line-clamp-3">
            {article.excerpt}
          </p>
          <span className="text-[11px] text-[#7A766F] font-light block pt-1">
            {article.published_at_formatted}
          </span>
        </div>
      </article>
    );
  }

  // 3. STANDARD & BLOG STUDY CARD (Exact Reference from Gambar 3)
  return (
    <article className="group space-y-4">
      {/* Clean Aspect Ratio Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E2DFD6]" style={{ position: 'relative' }}>
        <Link href={`/articles/${article.slug}`}>
          <Image
            src={article.image_url}
            alt={article.image_alt || article.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        </Link>
      </div>

      {/* Category Kicker with Underline (Gambar 3 Reference) */}
      <div className="space-y-2 pt-1">
        {article.category && (
          <div className="pb-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#161514] font-medium border-b border-[#161514] inline-block pb-0.5">
              {article.category.name}
            </span>
          </div>
        )}

        {/* Serif Headline */}
        <Link href={`/articles/${article.slug}`} className="block">
          <h3 className="font-serif text-xl sm:text-2xl text-[#161514] font-normal leading-[1.25] group-hover:text-[#8F725A] transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* Date Stamp (Gambar 3 Reference) */}
        <div className="pt-2 flex items-center justify-between text-xs text-[#7A766F] font-light">
          <span>{article.published_at_formatted}</span>
          <span className="watershedd-sub text-[9px] text-[#A8A49C]">
            {article.reading_time}
          </span>
        </div>
      </div>
    </article>
  );
}
