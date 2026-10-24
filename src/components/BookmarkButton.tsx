'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  articleId: number;
  initialBookmarked?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function BookmarkButton({ articleId, initialBookmarked = false }: BookmarkButtonProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleBookmark = async () => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        const res = await fetch(`${API_BASE}/articles/${articleId}/bookmark`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          setIsBookmarked(false);
          showMessage('Removed from library');
        }
      } else {
        const res = await fetch(`${API_BASE}/articles/${articleId}/bookmark`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          setIsBookmarked(true);
          showMessage('Saved to library');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleBookmark}
        disabled={loading}
        className={`flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] px-3.5 py-2 border transition-all ${
          isBookmarked
            ? 'bg-[#161514] text-[#F6F4EE] border-[#161514]'
            : 'border-[#E2DFD6] text-[#7A766F] hover:border-[#161514] hover:text-[#161514]'
        }`}
        title={isBookmarked ? 'Article saved' : 'Save article'}
      >
        <Bookmark size={13} className={isBookmarked ? 'fill-current' : ''} />
        <span>{isBookmarked ? 'Saved to Library' : 'Save to Library'}</span>
      </button>

      {message && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#161514] text-[#F6F4EE] text-[9px] uppercase tracking-widest shadow-md whitespace-nowrap z-30">
          {message}
        </div>
      )}
    </div>
  );
}
