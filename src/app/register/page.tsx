'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register(name, email, password, passwordConfirmation);
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center space-y-2 mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355] font-semibold">
          Editorial Community
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-[#151413]">
          Create Reader Account
        </h1>
        <p className="text-xs text-[#706B63] font-light">
          Join our architectural readership to curate bookmarks and join spatial discourse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#FFFFFF] p-8 border border-[#E5E0D6]">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5C5852] mb-1.5 font-medium">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
            placeholder="Clara Thorne"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5C5852] mb-1.5 font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
            placeholder="clara@atelier.com"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5C5852] mb-1.5 font-medium">
            Password (Min 8 characters)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5C5852] mb-1.5 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={8}
            className="w-full bg-[#FBF9F5] border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#151413] focus:outline-none focus:border-[#151413]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-xs uppercase tracking-[0.2em] font-semibold py-3 bg-[#151413] text-[#FBF9F5] hover:bg-[#8B7355] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>

        <p className="text-center text-xs text-[#706B63] pt-2">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-[#151413] border-b border-[#151413]">
            Sign In here
          </Link>
        </p>
      </form>
    </div>
  );
}
