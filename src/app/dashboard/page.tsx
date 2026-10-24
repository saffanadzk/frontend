'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Article } from '@/types';
import { Plus, PenLine, Send, Trash2, AlertCircle, CheckCircle2, Clock, XCircle, Shield } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function ContributorDashboard() {
  const { user, token, loading: authLoading, isStaff, isEditorOrAdmin } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isStaff)) {
      router.push('/login');
      return;
    }

    if (token) {
      fetchMyArticles();
    }
  }, [token, user, authLoading, isStaff, router]);

  const fetchMyArticles = async () => {
    try {
      const res = await fetch(`${API_BASE}/my/articles?limit=50`, {
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

  const handleSubmitForReview = async (id: number) => {
    if (!confirm('Submit this draft to the editorial desk for review and publication?')) return;

    try {
      const res = await fetch(`${API_BASE}/my/articles/${id}/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        setActionMessage('Article submitted for editorial review.');
        fetchMyArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this article draft?')) return;

    try {
      const res = await fetch(`${API_BASE}/my/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        setActionMessage('Draft deleted successfully.');
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredArticles = filter === 'all'
    ? articles
    : articles.filter((a) => a.status === filter);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="font-serif text-xl text-[#706B63]">Loading contributor desk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 space-y-10">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E0D6] pb-8">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-[#8B7355] font-semibold mb-1">
            <span>Staff Portal</span>
            <span>·</span>
            <span className="capitalize">{user?.role} Desk</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#151413]">
            Editorial Workbench
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isEditorOrAdmin && (
            <Link
              href="/dashboard/editorial-review"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold py-3 px-5 border border-[#151413] text-[#151413] hover:bg-[#F3EFE8] transition-colors"
            >
              <Shield size={14} />
              <span>Pending Reviews</span>
            </Link>
          )}

          <Link
            href="/dashboard/create"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold py-3 px-6 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors"
          >
            <Plus size={16} />
            <span>Compose Dispatch</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-[#F3EFE8] border border-[#D1C9BC] text-xs text-[#151413] flex justify-between items-center">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-[#8E8A83] hover:text-[#151413]">
            ✕
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex space-x-4 border-b border-[#E5E0D6] pb-3 text-xs uppercase tracking-widest">
        {['all', 'draft', 'pending', 'published', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`pb-3 font-semibold transition-colors relative ${
              filter === st ? 'text-[#151413]' : 'text-[#8E8A83] hover:text-[#151413]'
            }`}
          >
            {st === 'all' ? 'All Submissions' : st}
            {filter === st && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#151413]" />
            )}
          </button>
        ))}
      </div>

      {/* Articles Table */}
      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFFFF] border border-[#E5E0D6] p-8 space-y-3">
          <p className="font-serif text-xl text-[#151413]">No articles in this queue.</p>
          <p className="text-xs text-[#706B63]">
            Ready to draft your next spatial study or architectural review?
          </p>
          <Link
            href="/dashboard/create"
            className="inline-block mt-3 text-xs uppercase tracking-widest font-semibold px-6 py-2.5 bg-[#151413] text-[#FBF9F5]"
          >
            Write an Article
          </Link>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E5E0D6] divide-y divide-[#E5E0D6]">
          {filteredArticles.map((art) => (
            <div key={art.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#FAF9F5] transition-colors">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <StatusBadge status={art.status} />
                  <span className="text-[11px] uppercase tracking-wider text-[#8E8A83]">
                    {art.category?.name}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-[#151413] hover:text-[#8B7355] transition-colors">
                  {art.status === 'published' ? (
                    <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                  ) : (
                    art.title
                  )}
                </h3>

                <p className="text-xs text-[#5C5852] font-light line-clamp-1 max-w-2xl">
                  {art.excerpt}
                </p>

                {/* Editorial rejection notes alert */}
                {art.status === 'rejected' && art.rejection_note && (
                  <div className="mt-3 p-3 bg-amber-50 border-l-2 border-amber-600 text-xs text-amber-900 space-y-1">
                    <span className="font-semibold block uppercase tracking-wider text-[10px]">
                      Editorial Revision Request:
                    </span>
                    <p className="font-light italic">{art.rejection_note}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3 text-xs uppercase tracking-widest">
                {art.status === 'published' ? (
                  <Link
                    href={`/articles/${art.slug}`}
                    className="py-2 px-4 border border-[#E5E0D6] hover:border-[#151413] text-[#151413] transition-colors"
                  >
                    View Live
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/edit/${art.id}`}
                      className="inline-flex items-center space-x-1.5 py-2 px-4 border border-[#E5E0D6] hover:border-[#151413] text-[#151413] transition-colors"
                    >
                      <PenLine size={13} />
                      <span>Edit</span>
                    </Link>

                    {['draft', 'rejected'].includes(art.status) && (
                      <button
                        onClick={() => handleSubmitForReview(art.id)}
                        className="inline-flex items-center space-x-1.5 py-2 px-4 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors"
                      >
                        <Send size={13} />
                        <span>Submit</span>
                      </button>
                    )}

                    {['draft', 'rejected'].includes(art.status) && (
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-2 text-[#9E3E3E] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'published':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 size={11} />
          <span>Published</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          <Clock size={11} />
          <span>Under Editorial Review</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200">
          <XCircle size={11} />
          <span>Revision Requested</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300">
          <AlertCircle size={11} />
          <span>Draft</span>
        </span>
      );
  }
}
