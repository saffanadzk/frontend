import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface HeroArticleProps {
  article: Article;
  companionArticles?: Article[];
}

export default function HeroArticle({ article, companionArticles = [] }: HeroArticleProps) {
  const companion1 = companionArticles[0];
  const companion2 = companionArticles[1];

  return (
    <section className="border-b border-[#E2DFD6] bg-[#F6F4EE]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          
          {/* LEFT 55%: Cinematic Full-Height Featured Photo with Overlaid Narrative (Watershedd Reference) */}
          <div className="lg:col-span-7 relative min-h-[520px] sm:min-h-[620px] lg:min-h-[720px] overflow-hidden group bg-[#2D2C2A]" style={{ position: 'relative' }}>
            <Link href={`/articles/${article.slug}`} className="block w-full h-full">
              <Image
                src={article.image_url}
                alt={article.image_alt || article.title}
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Architectural Dark Vignette Overlay for Crisp Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:bg-black/45 transition-colors duration-500" />

              {/* Overlaid Editorial Text directly on Image */}
              <div className="absolute inset-0 p-8 sm:p-14 lg:p-16 flex flex-col justify-end text-white z-10">
                <div className="max-w-xl space-y-4">
                  {/* Category Kicker */}
                  <div className="inline-block">
                    <span className="watershedd-tag tracking-[0.3em] text-white/80 bg-white/15 backdrop-blur-md px-3.5 py-1">
                      {article.category?.name || 'FEATURED STUDY'}
                    </span>
                  </div>

                  {/* Headline (Watershedd signature high-contrast serif) */}
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] tracking-tight">
                    {article.title}
                  </h1>

                  {/* Lead excerpt */}
                  <p className="text-white/85 text-sm sm:text-base font-light leading-relaxed line-clamp-2 max-w-lg">
                    {article.excerpt}
                  </p>

                  {/* Action Link (View Project / Read Dispatch) */}
                  <div className="pt-4">
                    <span className="inline-flex items-center space-x-2 text-white border-b border-white/60 pb-1 font-sans text-[11px] uppercase tracking-[0.25em] group-hover:border-white transition-colors">
                      <span>Read Dispatch</span>
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT 45%: Warm Paper Asymmetrical Architectural Vignettes */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-[#F6F4EE] border-t lg:border-t-0 lg:border-l border-[#E2DFD6] space-y-8">
            
            {/* Top architectural vignette */}
            {companion1 && (
              <div className="space-y-4 group">
                <span className="watershedd-sub text-[#8F725A] block">
                  Companion Study · {companion1.category?.name}
                </span>

                <Link href={`/articles/${companion1.slug}`} className="block">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECEAE2]" style={{ position: 'relative' }}>
                    <Image
                      src={companion1.image_url}
                      alt={companion1.title}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <h3 className="mt-3 font-serif text-xl sm:text-2xl text-[#161514] font-normal leading-snug group-hover:text-[#8F725A] transition-colors">
                    {companion1.title}
                  </h3>
                  <p className="text-xs text-[#7A766F] font-light mt-1 line-clamp-2">
                    {companion1.excerpt}
                  </p>
                </Link>
              </div>
            )}

            {/* Bottom architectural vignette (Offset masonry style) */}
            {companion2 && (
              <div className="pt-6 border-t border-[#E2DFD6] group">
                <Link href={`/articles/${companion2.slug}`} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 relative aspect-[4/3] overflow-hidden bg-[#ECEAE2]" style={{ position: 'relative' }}>
                    <Image
                      src={companion2.image_url}
                      alt={companion2.title}
                      fill
                      unoptimized
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="col-span-8 space-y-1">
                    <span className="watershedd-tag text-[9px] text-[#A8A49C]">
                      {companion2.category?.name}
                    </span>
                    <h4 className="font-serif text-base text-[#161514] font-normal leading-snug group-hover:text-[#8F725A] transition-colors line-clamp-2">
                      {companion2.title}
                    </h4>
                    <span className="watershedd-sub text-[9px] text-[#7A766F] block pt-1">
                      {companion2.reading_time}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Bottom Status / Ethos kicker */}
            <div className="pt-6 border-t border-[#E2DFD6] flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#A8A49C]">
              <span>ATELIER Archive Vol. 01</span>
              <span>Updated Weekly</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
