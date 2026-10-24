'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

interface FeaturedStoryProps {
  article: Article;
}

export default function FeaturedStory({ article }: FeaturedStoryProps) {
  if (!article) return null;

  return (
    <section id="featured-story" className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN 40%: Editorial Text Narrative (Exact User Mockup Reference) */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8F725A] block font-medium">
            Featured Story
          </span>

          <Link href={`/articles/${article.slug}`} className="block group">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl text-[#161514] font-normal leading-[1.12] tracking-tight group-hover:text-[#8F725A] transition-colors">
              {article.title}
            </h2>
          </Link>

          <p className="text-sm sm:text-base text-[#5C5852] font-light leading-relaxed max-w-md">
            {article.excerpt}
          </p>

          <div className="pt-4">
            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-medium text-[#161514] border-b border-[#161514] pb-1 hover:text-[#8F725A] hover:border-[#8F725A] transition-colors"
            >
              <span>Read The Story</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN 60%: Landscape Architectural Photo (Exact User Mockup Reference) */}
        <div className="lg:col-span-7 space-y-4">
          <Link href={`/articles/${article.slug}`} className="block group">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECEAE2]" style={{ position: 'relative' }}>
              <Image
                src={article.image_url}
                alt={article.image_alt || article.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
          </Link>

          {/* Minimal Pagination / Slide metadata */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#7A766F] pt-2">
            <span>{article.category?.name || 'Architecture'} · {article.reading_time}</span>
            <div className="flex items-center space-x-3">
              <span>01 / 04</span>
              <span className="text-[#A8A49C]">‹ / ›</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
