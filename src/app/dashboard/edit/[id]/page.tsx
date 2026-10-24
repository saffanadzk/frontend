'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Category, Article } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, Globe } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditPageProps) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;
  const router = useRouter();
  const { user, token, loading: authLoading, isStaff } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState('');
  const [rejectionNote, setRejectionNote] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isStaff)) {
      router.push('/login');
      return;
    }

    if (token) {
      Promise.all([
        fetch(`${API_BASE}/categories`).then((r) => r.json()),
        fetch(`${API_BASE}/my/articles/${articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }).then((r) => r.json()),
      ])
        .then(([catsData, artData]) => {
          setCategories(catsData.data || []);
          const art: Article = artData.article;
          if (art) {
            setTitle(art.title);
            setCategoryId(art.category?.id || '');
            setExcerpt(art.excerpt);
            setContent(art.content);
            setExistingImageUrl(art.image_url);
            setImageAlt(art.image_alt);
            setSeoTitle(art.seo_title || '');
            setSeoDescription(art.seo_description || '');
            setStatus(art.status);
            setRejectionNote(art.rejection_note || null);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user, isStaff, token, articleId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (action?: 'draft' | 'submit') => {
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    if (categoryId) formData.append('category_id', categoryId.toString());
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);
    formData.append('image_alt', imageAlt);
    if (seoTitle) formData.append('seo_title', seoTitle);
    if (seoDescription) formData.append('seo_description', seoDescription);
    if (action) formData.append('action', action);

    try {
      const res = await fetch(`${API_BASE}/my/articles/${articleId}/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        setError(errorMsg || 'Failed to update article.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Network communication error with editorial backend.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="font-serif text-xl text-[#706B63]">Loading manuscript data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10">
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
          Editing Article #{articleId} ({status})
        </span>
      </div>

      {rejectionNote && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-600 text-xs text-amber-900 space-y-1">
          <span className="font-semibold block uppercase tracking-wider text-[10px]">
            Editorial Revision Required:
          </span>
          <p className="font-light italic">{rejectionNote}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-8 bg-[#FFFFFF] p-8 md:p-12 border border-[#E5E0D6]" onSubmit={(e) => e.preventDefault()}>
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-3 text-base text-[#151413] focus:outline-none focus:border-[#151413] font-serif"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
              Discipline / Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-3 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
            Editorial Excerpt / Abstract *
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            required
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] p-4 text-sm text-[#151413] focus:outline-none focus:border-[#151413] resize-none"
          />
        </div>

        {/* Featured Image */}
        <div className="space-y-4 border-t border-b border-[#E5E0D6] py-6">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
              Featured Architectural Photography
            </label>
            <p className="text-[11px] text-[#8E8A83]">
              Upload a new file only if you wish to replace the current photo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <label className="cursor-pointer border-2 border-dashed border-[#D1C9BC] hover:border-[#151413] p-6 text-center w-full sm:w-64 transition-colors">
              <Upload size={24} className="mx-auto text-[#8E8A83] mb-2" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#151413] block">
                Replace Photo
              </span>
              <span className="text-[10px] text-[#8E8A83]">Click to choose file</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <div className="relative aspect-[16/10] w-64 border border-[#E5E0D6] overflow-hidden bg-[#EAE7DF]">
              <Image
                src={imagePreview || existingImageUrl}
                alt="Article Photo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-medium mb-1">
              Descriptive Image Alt Text *
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              required
              className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-2 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
            Article Body Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            required
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] p-4 text-sm font-mono text-[#151413] focus:outline-none focus:border-[#151413]"
          />
        </div>

        {/* SEO Metadata */}
        <div className="space-y-4 pt-4 border-t border-[#E5E0D6]">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#706B63] font-semibold">
            <Globe size={14} />
            <span>Search Engine Optimization (SEO)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-[#706B63] mb-1">Custom SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-3 py-2 text-xs text-[#151413] focus:outline-none focus:border-[#151413]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#706B63] mb-1">Custom Meta Description</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-3 py-2 text-xs text-[#151413] focus:outline-none focus:border-[#151413]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-6 border-t border-[#E5E0D6]">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleUpdate('draft')}
            className="text-xs uppercase tracking-[0.2em] font-semibold py-3 px-6 border border-[#151413] text-[#151413] hover:bg-[#F3EFE8] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Save Draft Updates'}
          </button>

          {['draft', 'rejected'].includes(status) && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleUpdate('submit')}
              className="text-xs uppercase tracking-[0.2em] font-semibold py-3 px-8 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
