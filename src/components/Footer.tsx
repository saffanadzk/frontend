'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EditorialConfig } from '@/types';

interface FooterProps {
  config: EditorialConfig;
}

export default function Footer({ config }: FooterProps) {
  const pathname = usePathname();
  
  // sembunyikan footer login
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }
  
  return (
    <footer className="bg-[#161514] text-[#F6F4EE] border-t border-[#262422] mt-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20 md:py-28 space-y-16 md:space-y-24">
        {/* Top: Large Architectural Thesis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline border-b border-[#2B2A27] pb-16">
          <div className="lg:col-span-7 space-y-4">
            <span className="watershedd-sub text-[#A8A49C] block">
              Editorial Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F6F4EE] font-normal leading-[1.1] tracking-tight">
              Spaces that support life, inspire quiet moments, and hold memories over time.
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:pl-12">
            <p className="text-[#A8A49C] text-sm md:text-base leading-relaxed font-light">
              {config.description}
            </p>
            <div>
              <a
                href={`mailto:${config.contact_email}`}
                className="watershedd-sub text-[#F6F4EE] border-b border-[#F6F4EE] pb-1 hover:text-[#8F725A] hover:border-[#8F725A] transition-colors"
              >
                Inquire & Correspond: {config.contact_email}
              </a>
            </div>
          </div>
        </div>

        {/* Middle: Locations, Discipline Index, Social */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 text-[11px] uppercase tracking-[0.25em]">
          <div className="col-span-2 md:col-span-4 space-y-3">
            <span className="text-[#7A766F] block">Curatorial Desks</span>
            <p className="text-[#F6F4EE] font-medium leading-loose">
              London · Cornwall · Zurich · Kyoto<br />
              <span className="text-[#A8A49C] font-light">Published globally in print & digital.</span>
            </p>
          </div>

          <div className="col-span-1 md:col-span-4 space-y-2.5">
            <span className="text-[#7A766F] block">Index</span>
            <ul className="space-y-2 text-[#A8A49C]">
              {config.navigation.map((nav) => (
                <li key={nav.href}>
                  <Link href={nav.href} className="hover:text-white transition-colors">
                    {nav.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-4 space-y-2.5">
            <span className="text-[#7A766F] block">Discourse</span>
            <div className="flex flex-col space-y-2 text-[#A8A49C]">
              {config.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {soc.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Colophon */}
        <div className="border-t border-[#2B2A27] pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.25em] text-[#7A766F]">
          <p>© {config.founding_year} {config.brand_name} Architecture Journal. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-light">Typeset in Newsreader & Plus Jakarta Sans</p>
        </div>
      </div>
    </footer>
  );
}
