import React from 'react';
import Image from 'next/image';

interface Curator {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const curators: Curator[] = [
  {
    name: 'Elena Rostova',
    role: 'Principal Architectural Curator',
    bio: 'Elena is a Zurich-trained architect specializing in tectonic joinery and mass timber construction, holding a Master of Architecture from ETH Zurich.',
    image: '/curators/elena.jpg',
  },
  {
    name: 'Julian Vance',
    role: 'Material Culture & Object Lead',
    bio: 'Julian is a project architect and tactile object curator with extensive experience in detailing monolithic stone, joinery, and bespoke interior environments.',
    image: '/curators/julian.jpg',
  },
  {
    name: 'Maya Thorne',
    role: 'Interior Designer & Spatial Essayist',
    bio: 'Maya is a Melbourne-trained interior designer and writer, holding a Bachelor (Hons) in Interior Design and exploring slow living rituals.',
    image: '/curators/maya.jpg',
  },
];

export default function CuratorsSection() {
  return (
    <section id="team-roster" className="bg-[#182E2B] text-white py-20 md:py-32 border-t border-b border-[#24423E]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 space-y-16">
        
        {/* Section Masthead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-8 gap-6">
          <div className="space-y-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8EA8A1] block font-medium">
              The Curatorial Board
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white">
              Voices of the Publication
            </h2>
          </div>
          <p className="text-sm font-light text-[#A8BEB8] max-w-md leading-relaxed">
            Curating field notes, material essays, and spatial critiques from studios across Zurich, Melbourne, and Tokyo.
          </p>
        </div>

        {/* 3-Column Portrait Gallery (Elena, Julian, Maya) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {curators.map((curator) => (
            <div key={curator.name} className="space-y-6 group">
              {/* Portrait Image Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#122421]" style={{ position: 'relative' }}>
                <Image
                  src={curator.image}
                  alt={curator.name}
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Curator Info */}
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                  {curator.name}
                </h3>
                
                <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#9FBDB5] italic font-medium">
                  {curator.role}
                </p>

                <p className="text-xs sm:text-sm text-[#C2D4CF] font-light leading-relaxed pt-1">
                  {curator.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-[#8EA8A1]">
          <span>ATELIER Curatorial Board</span>
          <span>Independent Architecture Journal</span>
        </div>

      </div>
    </section>
  );
}
