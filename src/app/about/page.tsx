import React from 'react';
import type { Metadata } from 'next';
import { getEditorialConfig } from '@/lib/api';
import Link from 'next/link';
import CuratorsSection from '@/components/CuratorsSection';

export const metadata: Metadata = {
  title: 'About the Journal & Curators — Spatial Philosophy & Architecture',
  description: 'Learn about the editorial mission, curatorial board, and slower cadence behind ATELIER Journal.',
};

export default async function AboutPage() {
  const config = await getEditorialConfig();

  return (
    <div className="space-y-20 md:space-y-32">
      {/* 1. EDITORIAL MANIFESTO HEADER */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-28 space-y-12">
        <header className="space-y-4 border-b border-[#E2DFD6] pb-12">
          <span className="watershedd-sub text-[#8F725A] block">
            Editorial Ethos
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#161514] font-normal tracking-tight leading-[1.12]">
            Architecture as an enduring frame for slow contemplation.
          </h1>
        </header>

        <div className="space-y-8 text-[#2D2C2A] text-base md:text-lg font-light leading-relaxed">
          <p>
            Founded in {config.founding_year}, <strong className="font-medium text-[#161514]">{config.brand_name}</strong> was born from a desire to create a deliberate antidote to disposable design commentary. In an era where architecture is increasingly consumed as transient digital thumbnails, we cultivate a slower, more contemplative cadence.
          </p>

          <p>
            Our journal explores the dialogue between mass and void: monolithic concrete residences carved into windswept cliffs, timber pavilions constructed with timeless interlocking joinery, and private interior sanctuaries where lime plasters breathe alongside unlacquered metals.
          </p>

          <blockquote className="my-12 pl-8 border-l-2 border-[#161514] font-serif italic text-xl md:text-2xl text-[#161514] leading-snug">
            &ldquo;We believe the most enduring buildings are rooted in place, shaped by natural light, and enriched by the honesty of raw materials.&rdquo;
          </blockquote>

          <p>
            We do not operate as a commercial design agency or generic aggregator. Every feature story, spatial essay, and visual documentary published across our pages is curated through an exacting editorial review process, celebrating the architects, interiorists, and artisanal makers who shape lasting human shelters.
          </p>
        </div>
      </section>

      {/* 2. THE EDITORIAL BOARD & CURATORS (Belongs right here on the About page!) */}
      <div id="curators">
        <CuratorsSection />
      </div>

      {/* 3. CURATORIAL DESKS & CORRESPONDENCE */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-24 border-t border-[#E2DFD6] pt-16 grid grid-cols-1 md:grid-cols-2 gap-10 text-xs uppercase tracking-wider">
        <div className="space-y-3">
          <span className="watershedd-sub text-[#8F725A] block">
            Curatorial Headquarters
          </span>
          <p className="text-[#5C5852] font-light leading-relaxed">
            ATELIER Journal Editorial Desk<br />
            Curated between London, Zurich & Kyoto.<br />
            Published digitally with global distribution.
          </p>
        </div>

        <div className="space-y-3">
          <span className="watershedd-sub text-[#8F725A] block">
            Submissions & Correspondence
          </span>
          <p className="text-[#5C5852] font-light leading-relaxed">
            For architectural monograph submissions, press releases, or essay proposals:
          </p>
          <a
            href={`mailto:${config.contact_email}`}
            className="inline-block font-semibold text-[#161514] border-b border-[#161514] pb-0.5 mt-1 hover:text-[#8F725A] hover:border-[#8F725A] transition-colors"
          >
            {config.contact_email}
          </a>
        </div>
      </section>
    </div>
  );
}
