import React from 'react';
import Link from 'next/link';
import { getCategories, getEditorialConfig, getPublishedArticles } from '@/lib/api';
import CinematicHero from '@/components/CinematicHero';
import FeaturedStory from '@/components/FeaturedStory';
import ArticleCard from '@/components/ArticleCard';
import { ArrowUpRight } from 'lucide-react';

export default async function HomePage() {
  const [config, categories, articlesRes] = await Promise.all([
    getEditorialConfig(),
    getCategories(),
    getPublishedArticles({ limit: 12 }),
  ]);

  const articles = articlesRes.data || [];
  const featuredArticle = articles[0];
  
  // 3 Articles for "Notes from our ongoing explorations in architecture" (Gambar 3)
  const blogArticles = articles.slice(1, 4);

  return (
    <div className="space-y-12 sm:space-y-20 md:space-y-28">
      
      {/* 1. CINEMATIC HERO (Exact Match for User Mockup) */}
      <CinematicHero />

      {/* 2. FEATURED STORY ASYMMETRICAL SPLIT (Exact Match for User Mockup) */}
      {featuredArticle && <FeaturedStory article={featuredArticle} />}

      {/* 3. DISCIPLINE INDEX (MINIMALIST HORIZONTAL FILTER) */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        <div className="border-t border-b border-[#E2DFD6] py-5 flex flex-wrap items-center justify-between gap-6">
          <span className="watershedd-sub text-[#161514] font-medium">
            Discipline Index
          </span>
          <div className="flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-[#7A766F]">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="hover:text-[#161514] transition-colors pb-0.5"
              >
                {cat.name}
                {cat.published_articles_count !== undefined && (
                  <span className="text-[9px] text-[#A8A49C] ml-1 font-light">
                    ({cat.published_articles_count})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BLOG SECTION: NOTES FROM ONGOING EXPLORATIONS (Exact Match for Gambar 3) */}
      <section id="journal-feed" className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-[#161514] font-normal tracking-tight leading-[1.15]">
            Notes from our ongoing explorations in architecture.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5852] font-light leading-relaxed">
            This journal gathers insights from research, material development, and everyday spatial observations. All articles published through our Laravel editorial desk appear automatically here.
          </p>
        </div>

        {/* 3-Column Grid from Gambar 3 (Dynamically Sourced from Laravel REST API) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-2">
          {blogArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* 5. MEET THE TEAM TEASER PORTAL (Teaser only! Directs cleanly to /about#curators) */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        <div className="border border-[#E2DFD6] bg-[#ECEAE2]/60 p-8 sm:p-14 lg:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8 group">
          <div className="max-w-2xl space-y-4">
            <span className="watershedd-sub text-[#8F725A] block">
              Curatorial Board
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#161514] font-normal leading-[1.15]">
              Meet the Editorial Board
            </h3>
            <p className="text-sm sm:text-base text-[#5C5852] font-light leading-relaxed">
              Elena Rostova, Julian Vance, and Maya Thorne lead our spatial research across mass timber, tactile objects, and interior dwelling. Discover the minds shaping our dispatches.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/about#curators"
              className="inline-flex items-center space-x-2 bg-[#161514] text-white hover:bg-[#8F725A] px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-colors"
            >
              <span>Explore Profiles</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CURATORIAL STATEMENT (Single Clean Quote on Linen) */}
      <section className="bg-[#ECEAE2] py-20 md:py-28 border-t border-b border-[#DCD9CE]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="watershedd-sub text-[#8F725A]">
            Curatorial Statement
          </span>
          <p className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#161514] font-normal leading-[1.25] tracking-tight">
            &ldquo;We believe the most enduring buildings are rooted in place, shaped by natural light, and enriched by the honesty of raw materials.&rdquo;
          </p>
          <div className="watershedd-sub text-[10px] text-[#7A766F] pt-2">
            ATELIER Journal · Spatial Dispatches
          </div>
        </div>
      </section>

    </div>
  );
}
