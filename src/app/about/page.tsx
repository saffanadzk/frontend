import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getEditorialConfig } from '@/lib/api';
import CuratorsSection from '@/components/CuratorsSection';
import { Compass, Sparkles, Feather, ArrowDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Journal & Curators — Spatial Philosophy & Architecture',
  description: 'Learn about the editorial mission, curatorial board, and slower cadence behind ATELIER Journal.',
};

export default async function AboutPage() {
  const config = await getEditorialConfig();

  return (
    <div className="bg-[#F6F4EE] text-[#161514] overflow-hidden">

      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: THE ARCHITECTURAL ARCH HERO (Warm Linen #F6F4EE)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 pt-16 sm:pt-24 pb-16 text-center space-y-8">

        {/* Kicker & Title */}
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="watershedd-sub text-[#8F725A] block tracking-[0.32em]">
            Editorial Manifesto & Cadence
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#161514] font-normal tracking-tight leading-[1.08]">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-[#7A766F] font-light tracking-wide uppercase">
            A Curated Review of Architecture, Spaces & Spatial Culture
          </p>
        </div>

        {/* Grand Arch Cutout Window Photo (Inspired by Watershedd's architectural framing) */}
        <div className="max-w-4xl mx-auto pt-4">
          <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[560px] rounded-t-[140px] sm:rounded-t-[220px] overflow-hidden shadow-2xl border border-[#E2DFD6]/80 bg-[#161514]">
            <Image
              src="/about/arch-hero.jpg"
              alt="Rugged Windswept Coastal Cliff Bay at Golden Hour"
              fill
              priority
              unoptimized
              className="object-cover scale-100 hover:scale-105 transition-transform duration-[7000ms] ease-out"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Overlay Emblem Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 text-white/90 text-[10px] uppercase tracking-[0.3em] font-light bg-black/30 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20">
              <Compass size={13} className="text-[#C5A880]" />
              <span>Grounded in Landscape & Material Honesty</span>
            </div>
          </div>
        </div>

        {/* Minimal Curatorial Monogram */}
        <div className="pt-4 flex flex-col items-center space-y-2 text-[#8F725A]">
          <span className="w-[1px] h-10 bg-[#8F725A]/40" />
          <span className="text-[10px] tracking-[0.35em] uppercase font-light">
            ATELIER · EST. {config.founding_year}
          </span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: ASYMMETRICAL STAGGERED EDITORIAL (Linen #F6F4EE)
          Woven narrative paired with architectural photography
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24 border-t border-[#E2DFD6]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column (5 Cols): Primary Architectural Photograph Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#E2DFD6] shadow-sm bg-[#ECEAE2]">
              <Image
                src="/hero-cinema.jpg"
                alt="Cantilevered Monolithic Ocean Villa at Dusk"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover hover:scale-105 transition-transform duration-[6000ms] ease-out"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#7A766F] pt-1">
              <span>Fig. 01 — Monolithic Cliffside Villa</span>
              <span className="font-mono">Cape Town</span>
            </div>
          </div>

          {/* Right Column (7 Cols): Editorial Ethos Headline & Deep Text Narrative */}
          <div className="lg:col-span-7 space-y-8 lg:pl-6">
            <div className="space-y-4">
              <span className="watershedd-sub text-[#8F725A] block">
                Founding Philosophy · Slower Cadence
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#161514] font-normal tracking-tight leading-[1.14]">
                Architecture as an enduring frame for slow contemplation.
              </h2>
            </div>

            <div className="space-y-6 text-[#2D2C2A] text-base sm:text-lg font-light leading-relaxed">
              <p>
                Founded in {config.founding_year},{' '}
                <strong className="font-medium text-[#161514]">
                  {config.brand_name}
                </strong>{' '}
                was born from a desire to create a deliberate antidote to disposable design commentary. In an era where architecture is increasingly consumed as transient digital thumbnails, we cultivate a slower, more contemplative cadence.
              </p>

              <p>
                We do not operate as a commercial design agency or generic aggregator. Every feature story, spatial essay, and visual documentary published across our pages is curated through an exacting editorial review process, celebrating the architects, interiorists, and artisanal makers who shape lasting human shelters.
              </p>
            </div>

            {/* Offset Secondary Vignette Photo: Stone Pavilion in Wildflower Meadow */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#E2DFD6] shadow-sm bg-[#ECEAE2]">
                <Image
                  src="/about/stone-pavilion.jpg"
                  alt="Restored Limestone Villa in Wildflower Meadow"
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="object-cover hover:scale-105 transition-transform duration-[6000ms] ease-out"
                />
              </div>
              <div className="space-y-2 text-xs text-[#7A766F] font-light leading-relaxed">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#161514] block font-medium">
                  Fig. 02 — Place & Provenance
                </span>
                <p>
                  Buildings conceived in dialogue with wild flora, seasonal light, and local stone masonry.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: WARM TERRACOTTA / SANDSTONE TONAL BLOCK
          Deep tactile warmth, arched portal photograph, signature quote
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#B6896E] text-[#FAF8F5] py-20 sm:py-32 px-6 sm:px-12 lg:px-20 transition-colors">
        <div className="max-w-[1440px] mx-auto space-y-16 sm:space-y-24">

          {/* Curatorial Codex Header & Grand Pull Quote */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.35em] text-[#FAF8F5]/80 bg-black/15 px-4 py-1.5 rounded-full border border-white/15">
              <Feather size={12} className="text-[#F6F4EE]" />
              <span>Curatorial Codex</span>
            </div>

            <blockquote className="font-serif italic text-2xl sm:text-4xl lg:text-5xl text-[#FAF8F5] leading-[1.25] tracking-tight font-light">
              &ldquo;We believe the most enduring buildings are rooted in place, shaped by natural light, and enriched by the honesty of raw materials.&rdquo;
            </blockquote>
          </div>

          {/* Staggered Dual Column: Arched Interior Portal + Material Essay */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column (5 Cols): Pill Arch Portal Photo */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-3">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-t-full rounded-b-[40px] overflow-hidden border border-white/20 shadow-2xl bg-black/20">
                <Image
                  src="/about/interior-arch.jpg"
                  alt="Minimalist Arched Lime Plaster Room with Wooden Ladder"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover hover:scale-105 transition-transform duration-[6000ms] ease-out"
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#FAF8F5]/75 font-light pt-2">
                Fig. 03 — Tactile Lime Plaster & Living Oak
              </span>
            </div>

            {/* Right Column (7 Cols): Material Dialogue Narrative */}
            <div className="lg:col-span-7 space-y-8 text-[#FAF8F5]/90">
              <div className="space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#FAF8F5]/70 block font-light">
                  Material Honesty & Mass
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                  The Dialogue Between Mass and Void
                </h3>
              </div>

              <div className="space-y-6 text-base sm:text-lg font-light leading-relaxed">
                <p>
                  Our journal explores the dialogue between mass and void: monolithic concrete residences carved into windswept cliffs, timber pavilions constructed with timeless interlocking joinery, and private interior sanctuaries where lime plasters breathe alongside unlacquered metals.
                </p>
                <p>
                  By focusing on timeless materiality rather than ephemeral trends, ATELIER provides an enduring archival reference for architects, designers, and patrons who value spaces that age with grace and dignity.
                </p>
              </div>

              {/* 4 Architectural Focus Pillars (Mini Pills) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-4 text-[11px] uppercase tracking-wider font-medium text-[#FAF8F5]">
                <div className="border border-white/25 px-4 py-3 bg-white/5 backdrop-blur-sm">
                  01 · Monolithic Concrete & Stone
                </div>
                <div className="border border-white/25 px-4 py-3 bg-white/5 backdrop-blur-sm">
                  02 · Precision Timber Joinery
                </div>
                <div className="border border-white/25 px-4 py-3 bg-white/5 backdrop-blur-sm">
                  03 · Natural Light Choreography
                </div>
                <div className="border border-white/25 px-4 py-3 bg-white/5 backdrop-blur-sm">
                  04 · Tactile Lime Wash & Patina
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 4: THREE CURATORIAL PILLARS (Warm Limestone #EAE6DD)
          Structured architectural lens (Inspired by Watershedd's discipline grid)
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#EAE6DD] text-[#161514] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-t border-[#DED8CA]">
        <div className="max-w-[1440px] mx-auto space-y-16">

          <div className="max-w-2xl space-y-3">
            <span className="watershedd-sub text-[#8F725A] block">
              Curatorial Criteria
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161514] font-normal tracking-tight">
              The Three Lenses of ATELIER
            </h2>
            <p className="text-xs sm:text-sm text-[#7A766F] font-light">
              Every monograph, project critique, and visual essay is selected through three foundational principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">

            {/* Pillar 01 */}
            <div className="bg-white/80 p-8 border border-[#DED8CA] space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECEAE2]">
                <Image
                  src="/hero-cinema.jpg"
                  alt="Monolithic Tectonics"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <span className="font-mono text-xs text-[#8F725A] block tracking-widest font-semibold">
                  01 / TECTONICS & MASS
                </span>
                <h3 className="font-serif text-xl text-[#161514] font-medium">
                  Rooted in Topography
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5852] font-light leading-relaxed">
                  Structures that emerge naturally from their terrain, celebrating raw basalt, board-formed concrete, and structural honesty that outlasts decades.
                </p>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="bg-white/80 p-8 border border-[#DED8CA] space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECEAE2]">
                <Image
                  src="/hero-pavilion.jpg"
                  alt="Atmospheric Stillness & Reflections"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <span className="font-mono text-xs text-[#8F725A] block tracking-widest font-semibold">
                  02 / SPATIAL STILLNESS
                </span>
                <h3 className="font-serif text-xl text-[#161514] font-medium">
                  Choreography of Light
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5852] font-light leading-relaxed">
                  Spaces that prioritize acoustic calm, reflecting pools, and subtle interplay of morning sun and evening shadow over ostentatious decoration.
                </p>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="bg-white/80 p-8 border border-[#DED8CA] space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECEAE2]">
                <Image
                  src="/about/interior-arch.jpg"
                  alt="Generational Craftsmanship"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <span className="font-mono text-xs text-[#8F725A] block tracking-widest font-semibold">
                  03 / TACTILE CRAFTSMANSHIP
                </span>
                <h3 className="font-serif text-xl text-[#161514] font-medium">
                  Living Materials & Patina
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5852] font-light leading-relaxed">
                  Honoring the artisan builders, wood joiners, and lime plasterers whose hands imbue domestic spaces with warmth and humanity.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 5: THE EDITORIAL BOARD & CURATORS (Deep Mineral Teal #182E2B)
          ───────────────────────────────────────────────────────────── */}
      <div id="curators">
        <CuratorsSection />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 6: CURATORIAL DESKS & DISPATCH CORRESPONDENCE
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 py-20 border-t border-[#E2DFD6] grid grid-cols-1 md:grid-cols-3 gap-10 text-xs">

        {/* Curatorial Desks */}
        <div className="space-y-3">
          <span className="watershedd-sub text-[#8F725A] block">
            Curatorial Desks
          </span>
          <p className="text-[#5C5852] font-light leading-relaxed">
            ATELIER Journal Editorial Desks<br />
            Published between London, Zurich & Kyoto.<br />
            Distributed digitally worldwide.
          </p>
        </div>

        {/* Monograph Submissions */}
        <div className="space-y-3">
          <span className="watershedd-sub text-[#8F725A] block">
            Submissions & Monographs
          </span>
          <p className="text-[#5C5852] font-light leading-relaxed">
            We welcome architectural monograph proposals, spatial photo-essays, and material research manuscripts.
          </p>
          <a
            href={`mailto:${config.contact_email}`}
            className="inline-block font-medium text-[#161514] border-b border-[#161514] pb-0.5 hover:text-[#8F725A] hover:border-[#8F725A] transition-colors"
          >
            {config.contact_email}
          </a>
        </div>

        {/* ISSN & Archival Note */}
        <div className="space-y-3">
          <span className="watershedd-sub text-[#8F725A] block">
            Archival Preservation
          </span>
          <p className="text-[#5C5852] font-light leading-relaxed">
            All published editions are archived in digital and print-ready formats, indexed for academic and design reference.
          </p>
        </div>

      </section>

    </div>
  );
}
