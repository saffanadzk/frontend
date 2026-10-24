'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function SavedArticlesPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (token) {
      fetchBookmarks();
    }
  }, [token, user, authLoading, router]);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`${API_BASE}/me/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        setArticles(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <p className="font-serif text-xl text-[#706B63]">Opening your personal archives...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 space-y-12">
      <header className="border-b border-[#E5E0D6] pb-8 space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355] font-semibold">
          Personal Reading Room
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-[#151413]">
          Saved Dispatches & Studies
        </h1>
        <p className="text-sm text-[#706B63]">
          {articles.length} bookmarked articles saved for contemplative reading.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-24 text-center bg-[#F3EFE8] border border-[#E5E0D6] space-y-4">
          <p className="font-serif text-2xl text-[#151413]">
            Your personal library is currently empty.
          </p>
          <p className="text-xs text-[#706B63]">
            While reading any article in the journal, click &ldquo;Save to Library&rdquo; to store it here.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-xs uppercase tracking-widest font-semibold px-6 py-2.5 bg-[#151413] text-[#FBF9F5]"
          >
            Explore Journal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      )}
    </div>
  );
}
