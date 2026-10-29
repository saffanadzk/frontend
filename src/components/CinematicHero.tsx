'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const HERO_IMAGES = [
  {
    src: '/atelier-hero.jpg',
    alt: 'Modern Concrete Villa Terrace Overlooking Sunset Ocean with Olive Tree',
  },
  {
    src: '/hero-cinema.jpg',
    alt: 'Cantilevered Ocean Villa with Infinity Pool at Twilight',
  },
  {
    src: '/hero-pavilion.jpg',
    alt: 'Minimalist Japanese-Nordic Water Pavilion & Stone Courtyard at Dusk',
  },
];

const SLIDE_INTERVAL = 5500; // 5.5 seconds per slide

export default function CinematicHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  // Smooth automatic background slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      className="relative w-full min-h-[660px] sm:min-h-[760px] lg:min-h-[860px] bg-[#161514] text-white overflow-hidden border-b border-[#2D2C2A] flex items-center"
      style={{ position: 'relative' }}
      aria-label="ATELIER Architectural Hero Showcase"
    >
      {/* 1. CINEMATIC 3-SLIDE BACKGROUND SLIDER (Auto-transition, no UI controls) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {HERO_IMAGES.map((image, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={image.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                unoptimized
                sizes="100vw"
                className={`object-cover transition-transform duration-[7000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'
                  }`}
              />
            </div>
          );
        })}

        {/* Dual gradient vignettes for maximum text legibility and cinematic atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-1" />
      </div>

      {/* 2. OVERLAID EDITORIAL NARRATIVE (Left-Aligned, Pure & Clean) */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32 flex flex-col justify-between h-full">

        <div className="max-w-xl sm:max-w-2xl space-y-6 pt-8 sm:pt-12">
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
            Exploring the spaces we inhabit, the object we create, and the ideas that shape the way we live.
          </p>

          {/* Call to action link with long dash */}
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
        <div className="absolute bottom-10 right-8 sm:right-16 hidden lg:flex flex-col items-center space-y-2 text-[9px] uppercase tracking-[0.3em] text-[#DCD9CE]">
          <span className="w-[1px] h-8 bg-white/40" />
          <span className="text-center leading-relaxed">
            SCROLL <br /> DOWN
          </span>
        </div>

      </div>
    </section>
  );
}
