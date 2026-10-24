'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Article } from '@/types';
import { ArrowLeft, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function EditorialReviewPage() {
  const { user, token, loading: authLoading, isEditorOrAdmin } = useAuth();
  const router = useRouter();

  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isEditorOrAdmin)) {
      router.push('/dashboard');
      return;
    }

    if (token) {
      fetchPendingArticles();
    }
  }, [token, user, authLoading, isEditorOrAdmin, router]);

  const fetchPendingArticles = async () => {
    try {
      const res = await fetch(`${API_BASE}/editor/articles/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        setPendingArticles(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    if (!confirm('Approve and immediately publish this article to the live journal?')) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/editor/articles/${id}/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        setFeedbackMessage('Article approved and published to the live journal.');
        setSelectedArticle(null);
        fetchPendingArticles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedArticle || !rejectionNote.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/editor/articles/${selectedArticle.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ rejection_note: rejectionNote }),
      });

      if (res.ok) {
        setFeedbackMessage('Revision notes returned to contributor. Article status set to rejected.');
        setRejectModalOpen(false);
        setRejectionNote('');
        setSelectedArticle(null);
        fetchPendingArticles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="font-serif text-xl text-[#706B63]">Opening editorial review desk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 space-y-10">
      {/* Top back nav */}
      <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#706B63] hover:text-[#151413] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Workbench</span>
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-[#8B7355] font-semibold">
          Editor Review Desk
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-5xl text-[#151413]">
          Pending Editorial Submissions ({pendingArticles.length})
        </h1>
        <p className="text-xs text-[#706B63] font-light">
          Review manuscripts submitted by contributors. Validate photographic resolution, architectural accuracy, and publish to the live site.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex justify-between items-center">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-600 hover:text-emerald-950">
            ✕
          </button>
        </div>
      )}

      {pendingArticles.length === 0 ? (
        <div className="py-24 text-center bg-[#FFFFFF] border border-[#E5E0D6] p-8 space-y-3">
          <p className="font-serif text-2xl text-[#151413]">
            No pending submissions awaiting review.
          </p>
          <p className="text-xs text-[#706B63]">
            All submitted contributor manuscripts have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submissions List */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5E0D6] divide-y divide-[#E5E0D6]">
            {pendingArticles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-6 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F3EFE8] border-l-4 border-l-[#151413]' : 'hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8E8A83] mb-1.5">
                    <span className="text-[#8B7355] font-semibold">{art.category?.name}</span>
                    <span>By {art.author?.name}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#151413] leading-snug mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#706B63] line-clamp-2 font-light">
                    {art.excerpt}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Review Pane */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5E0D6] p-8 space-y-6">
            {selectedArticle ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D6] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8B7355] font-semibold block">
                      Manuscript Inspection
                    </span>
                    <span className="text-xs text-[#706B63]">
                      Author: <strong className="text-[#151413]">{selectedArticle.author?.name}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs uppercase tracking-widest">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setRejectModalOpen(true)}
                      className="inline-flex items-center space-x-1.5 py-2 px-4 border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <XCircle size={14} />
                      <span>Request Revision</span>
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handlePublish(selectedArticle.id)}
                      className="inline-flex items-center space-x-1.5 py-2 px-6 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors font-semibold"
                    >
                      <CheckCircle size={14} />
                      <span>Publish Live</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-3xl text-[#151413]">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-sm text-[#5C5852] italic font-light">
                    &ldquo;{selectedArticle.excerpt}&rdquo;
                  </p>
                </div>

                {/* Photo Inspection */}
                <div className="relative aspect-[16/10] w-full border border-[#E5E0D6] overflow-hidden bg-[#EAE7DF]">
                  <Image
                    src={selectedArticle.image_url}
                    alt={selectedArticle.image_alt || selectedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-[11px] text-[#706B63] space-y-1 bg-[#FBF9F5] p-3 border border-[#E5E0D6]">
                  <div>Alt text: <em>{selectedArticle.image_alt}</em></div>
                  <div>URL: <code className="text-[10px]">{selectedArticle.image_url}</code></div>
                </div>

                {/* Content */}
                <div className="space-y-2 pt-4 border-t border-[#E5E0D6]">
                  <span className="text-xs uppercase tracking-wider text-[#706B63] font-semibold block">
                    Full Content Manuscript
                  </span>
                  <div className="bg-[#FBF9F5] p-6 border border-[#E5E0D6] max-h-96 overflow-y-auto font-mono text-xs text-[#2D2B29] whitespace-pre-wrap leading-relaxed">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-32 text-center text-[#8E8A83] space-y-2">
                <Eye size={28} className="mx-auto text-[#D1C9BC]" />
                <p className="font-serif text-lg">Select a submission from the left queue to review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject with notes Modal */}
      {rejectModalOpen && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-lg w-full p-8 border border-[#E5E0D6] shadow-xl space-y-6">
            <div className="flex items-center space-x-2 text-amber-700">
              <AlertTriangle size={20} />
              <h3 className="font-serif text-xl text-[#151413]">
                Editorial Revision Note
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              Provide constructive, specific feedback explaining why the manuscript was returned and what changes are required before publication.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold mb-2">
                Revision Guidance for {selectedArticle.author?.name} *
              </label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                rows={4}
                required
                placeholder="e.g. Please clarify the structural joinery techniques in section 2 and provide a higher resolution architectural detail photograph..."
                className="w-full bg-[#FBF9F5] border border-[#E5E0D6] p-3 text-xs text-[#151413] focus:outline-none focus:border-[#151413] resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-[#E5E0D6] text-xs uppercase tracking-widest">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="py-2.5 px-5 border border-[#E5E0D6] text-[#5C5852] hover:border-[#151413]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !rejectionNote.trim()}
                onClick={handleReject}
                className="py-2.5 px-6 bg-red-700 text-white hover:bg-red-800 font-semibold disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Return to Contributor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
