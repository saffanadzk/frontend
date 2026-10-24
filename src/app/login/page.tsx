'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 sm:py-28">
      <div className="text-center space-y-3 mb-10">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8F725A] font-medium block">
          Editorial Access
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#161514] font-normal tracking-tight">
          Sign In to ATELIER
        </h1>
        <p className="text-xs text-[#7A766F] font-light max-w-xs mx-auto leading-relaxed">
          Access your personal library, contribute field notes, or enter the editorial desk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FFFFFF] p-8 sm:p-10 border border-[#E2DFD6] shadow-sm">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
            Email or Username
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#F6F4EE] border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514] transition-colors"
            placeholder="admin or user@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#F6F4EE] border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-xs uppercase tracking-[0.25em] font-medium py-3.5 bg-[#161514] text-white hover:bg-[#8F725A] transition-colors disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <p className="text-center text-xs text-[#7A766F] pt-2 font-light">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-normal text-[#161514] border-b border-[#161514] hover:text-[#8F725A] transition-colors">
            Register as Reader
          </Link>
        </p>
      </form>
    </div>
  );
}
