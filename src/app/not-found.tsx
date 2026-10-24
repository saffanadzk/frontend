import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center space-y-6">
      <span className="text-[11px] uppercase tracking-[0.3em] text-[#8B7355] font-semibold">
        Error 404 — Archival Void
      </span>
      <h1 className="font-serif text-4xl sm:text-6xl text-[#151413]">
        Dispatch Not Found
      </h1>
      <p className="text-sm md:text-base text-[#5C5852] font-light leading-relaxed max-w-md mx-auto">
        The manuscript or architectural inquiry you requested has either dissolved into memory or has not yet been unsealed by our editorial board.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-block text-xs uppercase tracking-widest font-semibold py-3 px-8 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors"
        >
          Return to Journal Front
        </Link>
      </div>
    </div>
  );
}
