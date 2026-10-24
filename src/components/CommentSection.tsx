'use client';

import React, { useState } from 'react';
import { Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface CommentSectionProps {
  articleId: number;
  initialComments: Comment[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !token) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to post comment.');
      } else {
        setContent('');
        setComments([data.comment, ...comments]);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-[#E5E0D6] pt-16 mt-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E0D6]">
        <h3 className="font-serif text-2xl text-[#151413]">
          Reflections & Discourse ({comments.length})
        </h3>
        <span className="text-[11px] uppercase tracking-widest text-[#8E8A83]">
          Curated Readers
        </span>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#706B63] mb-2">
              Add your perspective
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Share thoughts on the spatial theory, material tactility, or craftsmanship..."
              className="w-full bg-[#FFFFFF] border border-[#E5E0D6] p-4 text-sm text-[#151413] focus:outline-none focus:border-[#151413] resize-none"
              required
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="text-xs uppercase tracking-[0.2em] font-semibold py-2.5 px-6 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Reflection'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 p-6 bg-[#F3EFE8] text-center space-y-2 border border-[#E5E0D6]">
          <p className="text-sm text-[#5C5852]">
            Join the conversation. Sign in to post your architectural reflection.
          </p>
          <Link
            href="/login"
            className="inline-block text-xs uppercase tracking-widest font-semibold text-[#151413] border-b border-[#151413] pb-0.5"
          >
            Sign In to Participate
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="mt-12 space-y-8">
        {comments.length === 0 ? (
          <p className="text-sm text-[#8E8A83] italic">
            No reflections yet. Be the first to share an insight.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-[#E5E0D6] pb-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#706B63]">
                <span className="font-semibold text-[#151413]">{comment.user?.name}</span>
                <span className="text-[11px] text-[#8E8A83]">{comment.created_at}</span>
              </div>
              <p className="text-sm text-[#2D2B29] leading-relaxed font-light">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
