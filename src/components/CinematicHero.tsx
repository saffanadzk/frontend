'use client';

import React from 'react';
import Image from 'next/image';

export default function CinematicHero() {
  return (
    <section
      className="relative w-full min-h-[640px] sm:min-h-[740px] lg:min-h-[840px] bg-[#161514] text-white overflow-hidden border-b border-[#2D2C2A] flex items-center"
      style={{ position: 'relative' }}
    >
      {/* 1. CINEMATIC SUNSET OLIVE TERRACE BACKGROUND (Exact User Mockup Reference) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <Image
          src="/atelier-hero.jpg"
          alt="Modern Concrete Villa Terrace Overlooking Sunset Ocean"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover scale-100"
        />
        {/* Subtle dual gradient vignette to guarantee high-contrast readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* 2. OVERLAID EDITORIAL NARRATIVE (Left-Aligned, Exact User Mockup Reference) */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32 flex flex-col justify-between h-full">
        
        <div className="max-w-xl sm:max-w-2xl space-y-6 pt-10">
          {/* Kicker */}
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#E2DFD6] block font-light">
            A Journal for the Modern World
          </span>

          {/* Grand High-Contrast Serif Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white font-normal leading-[1.08] tracking-tight">
            Architecture, <br />
            Design, Art <br />
            <span className="italic font-light">and Culture</span>
          </h1>

          {/* Concise Subtitle Paragraph */}
          <p className="text-sm sm:text-base text-[#DCD9CE] font-light leading-relaxed max-w-lg pt-1">
            ATELIER is a digital magazine that explores the intersection of architecture, interior, art, and design — celebrating ideas, spaces, and the people shaping a more considered tomorrow.
          </p>

          {/* Call to action link with long dash (Exact User Mockup) */}
          <div className="pt-6">
            <a
              href="#featured-story"
              className="inline-flex items-center space-x-3 text-white text-xs uppercase tracking-[0.28em] font-medium hover:text-[#C5A880] transition-colors group"
            >
              <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all" />
              <span>Explore The Journal</span>
              <span className="text-sm">→</span>
            </a>
          </div>
        </div>

        {/* Bottom Right: Clean Scroll Down indicator */}
        <div className="absolute bottom-10 right-8 sm:right-16 hidden sm:flex flex-col items-center space-y-2 text-[9px] uppercase tracking-[0.3em] text-[#DCD9CE]">
          <span className="w-[1px] h-8 bg-white/40" />
          <span className="text-center leading-relaxed">
            SCROLL <br /> DOWN
          </span>
        </div>

      </div>
    </section>
  );
}
