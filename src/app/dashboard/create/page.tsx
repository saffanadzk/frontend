'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Category } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, FileText, Globe } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function CreateArticlePage() {
  const router = useRouter();
  const { user, token, loading: authLoading, isStaff } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isStaff)) {
      router.push('/login');
      return;
    }

    // Load available categories
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.data || []);
        if (json.data?.length > 0) {
          setCategoryId(json.data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, [authLoading, user, isStaff, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (!title || !categoryId || !excerpt || !content || !imageFile || !imageAlt) {
      setError('Please fill in all required fields, including the featured image and alt text.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', categoryId.toString());
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('image', imageFile);
    formData.append('image_alt', imageAlt);
    if (seoTitle) formData.append('seo_title', seoTitle);
    if (seoDescription) formData.append('seo_description', seoDescription);
    formData.append('action', action);

    try {
      const res = await fetch(`${API_BASE}/articles`, {
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
        setError(errorMsg || 'Failed to create article.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Network communication error with editorial backend.');
    } finally {
      setSubmitting(false);
    }
  };

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
          Drafting New Manuscript
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl text-[#151413]">
          Compose Editorial Article
        </h1>
        <p className="text-xs text-[#706B63] font-light">
          Craft essays, photographic studies, or tectonic reviews for the journal.
        </p>
      </div>

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
              placeholder="e.g. The Silence of Board-Formed Concrete"
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
            Editorial Excerpt / Abstract * (1-2 sentences)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            required
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] p-4 text-sm text-[#151413] focus:outline-none focus:border-[#151413] resize-none"
            placeholder="A brief compelling summary introducing the spatial study..."
          />
        </div>

        {/* Featured Image Upload */}
        <div className="space-y-4 border-t border-b border-[#E5E0D6] py-6">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
              Featured Architectural Photography *
            </label>
            <p className="text-[11px] text-[#8E8A83]">
              High resolution JPG, PNG, or WebP (max 5MB). Editorial standard 16:9 or 4:3.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <label className="cursor-pointer border-2 border-dashed border-[#D1C9BC] hover:border-[#151413] p-6 text-center w-full sm:w-64 transition-colors">
              <Upload size={24} className="mx-auto text-[#8E8A83] mb-2" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#151413] block">
                Select Photo
              </span>
              <span className="text-[10px] text-[#8E8A83]">Click to browse files</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </label>

            {imagePreview && (
              <div className="relative aspect-[16/10] w-64 border border-[#E5E0D6] overflow-hidden bg-[#EAE7DF]">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-medium mb-1">
              Descriptive Image Alt Text * (Essential for accessibility & SEO)
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              required
              className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-2 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
              placeholder="e.g. Low angle perspective of monolithic concrete walls framing morning ocean light"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs uppercase tracking-wider text-[#5C5852] font-semibold">
              Article Body Content *
            </label>
            <span className="text-[10px] text-[#8E8A83]">
              Supports Markdown (`## Heading`, `### Subheading`, `&gt; Quote`, `- List`)
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] p-4 text-sm font-mono text-[#151413] focus:outline-none focus:border-[#151413]"
            placeholder="## Section Heading&#10;&#10;Architecture unfolds as a rhythm between light and mass...&#10;&#10;> A deliberate pull quote honoring materiality.&#10;&#10;Paragraph text continues here..."
          />
        </div>

        {/* SEO Metadata Accordion / Fields */}
        <div className="space-y-4 pt-4 border-t border-[#E5E0D6]">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#706B63] font-semibold">
            <Globe size={14} />
            <span>Search Engine Optimization (SEO) Fields (Optional)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-[#706B63] mb-1">Custom SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-3 py-2 text-xs text-[#151413] focus:outline-none focus:border-[#151413]"
                placeholder="Leave blank to use Article Title | ATELIER"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#706B63] mb-1">Custom Meta Description</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-3 py-2 text-xs text-[#151413] focus:outline-none focus:border-[#151413]"
                placeholder="Leave blank to use Excerpt"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-6 border-t border-[#E5E0D6]">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
            className="text-xs uppercase tracking-[0.2em] font-semibold py-3 px-6 border border-[#151413] text-[#151413] hover:bg-[#F3EFE8] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save as Draft'}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('submit')}
            className="text-xs uppercase tracking-[0.2em] font-semibold py-3 px-8 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit for Editorial Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
