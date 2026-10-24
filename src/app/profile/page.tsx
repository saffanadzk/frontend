'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Shield, PenTool, BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth();
  
  // Profile edit states
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Contributor application states
  const [field, setField] = useState('Architecture & Spatial Design');
  const [portfolio, setPortfolio] = useState('');
  const [pitch, setPitch] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appMsg, setAppMsg] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#161514]">
          Member Profile
        </h1>
        <p className="text-sm text-[#7A766F] font-light">
          Please sign in to access and manage your ATELIER profile.
        </p>
        <div>
          <Link
            href="/login"
            className="inline-block px-8 py-3.5 bg-[#161514] text-white text-xs uppercase tracking-[0.25em] font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await fetch(`${API_BASE}/me/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, bio }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileMsg('Profil berhasil diperbarui.');
        await refreshUser();
      } else {
        setProfileMsg(data.message || 'Gagal memperbarui profil.');
      }
    } catch {
      setProfileMsg('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleApplyContributor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingApp(true);
    setAppMsg(null);
    setAppError(null);

    try {
      const res = await fetch(`${API_BASE}/me/apply-contributor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ field, portfolio, pitch }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppMsg('Permohonan kontributor Anda berhasil dikirim. Dewan Redaksi akan meninjau portofolio Anda.');
        await refreshUser();
      } else {
        setAppError(data.message || 'Gagal mengirim permohonan.');
      }
    } catch {
      setAppError('Terjadi kesalahan koneksi saat mengirim permohonan.');
    } finally {
      setSubmittingApp(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-16">
      
      {/* 1. PROFILE HEADER */}
      <header className="border-b border-[#E2DFD6] pb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-[#161514] text-white flex items-center justify-center font-serif text-3xl font-light">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#161514] font-normal">
                {user.name}
              </h1>
              <span className={`px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-medium rounded-full ${
                user.role === 'admin' ? 'bg-[#161514] text-white' :
                user.role === 'editor' ? 'bg-[#182E2B] text-white' :
                user.role === 'contributor' ? 'bg-[#8F725A] text-white' :
                'bg-[#ECEAE2] text-[#161514]'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#7A766F] font-light">
              {user.email} · Terdaftar sejak {new Date(user.created_at || Date.now()).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick workspace portal buttons depending on role */}
        <div className="flex items-center space-x-3">
          {['contributor', 'editor', 'admin'].includes(user.role) && (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium px-4 py-2.5 border border-[#161514] text-[#161514] hover:bg-[#161514] hover:text-white transition-colors"
            >
              <PenTool size={13} />
              <span>Contributor Desk</span>
            </Link>
          )}

          {['editor', 'admin'].includes(user.role) && (
            <Link
              href="/dashboard/editorial-review"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium px-4 py-2.5 bg-[#182E2B] text-white hover:bg-[#122421] transition-colors"
            >
              <Shield size={13} />
              <span>Review Desk</span>
            </Link>
          )}

          {user.role === 'admin' && (
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium px-4 py-2.5 bg-[#161514] text-white hover:bg-[#8F725A] transition-colors"
            >
              <User size={13} />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </header>

      {/* 2. EDIT PROFILE SECTION */}
      <section className="bg-white border border-[#E2DFD6] p-8 sm:p-10 space-y-6">
        <div className="border-b border-[#E2DFD6] pb-4">
          <span className="watershedd-sub text-[#8F725A] block">
            Informasi Personal
          </span>
          <h2 className="font-serif text-2xl text-[#161514] font-normal">
            Kelola Profil Saya
          </h2>
        </div>

        {profileMsg && (
          <div className="p-3 bg-[#F6F4EE] border border-[#E2DFD6] text-xs text-[#161514]">
            {profileMsg}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#F6F4EE] border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
              Alamat Email (Akun)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-[#ECEAE2] border border-[#E2DFD6] px-4 py-3 text-sm text-[#7A766F] cursor-not-allowed"
            />
            <span className="text-[10px] text-[#A8A49C] block">Email akun tidak dapat diubah secara mandiri untuk alasan keamanan.</span>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
              Biografi Singkat / Deskripsi Penulis
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan latar belakang arsitektur atau minat desain Anda..."
              className="w-full bg-[#F6F4EE] border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514]"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-8 py-3.5 bg-[#161514] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#8F725A] transition-colors disabled:opacity-50"
          >
            {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
          </button>
        </form>
      </section>

      {/* 3. KHUSUS READER: AJUKAN DIRI SEBAGAI CONTRIBUTOR */}
      {user.role === 'reader' && (
        <section className="bg-[#FAF8F5] border border-[#E2DFD6] p-8 sm:p-10 space-y-6">
          <div className="border-b border-[#E2DFD6] pb-4">
            <span className="watershedd-sub text-[#8F725A] block">
              Program Penulis ATELIER
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#161514] font-normal">
              Ajukan Diri Sebagai Penulis Kontributor
            </h2>
            <p className="text-xs text-[#7A766F] font-light mt-1">
              Sebagai Reader, Anda dapat mengajukan diri menjadi Penulis Kontributor untuk mempublikasikan riset spasial dan esai desain arsitektur di ATELIER Journal. Permohonan Anda akan ditinjau langsung oleh Admin.
            </p>
          </div>

          {/* Status Alert */}
          {user.application_status === 'pending' ? (
            <div className="p-6 bg-white border border-[#C5A880] space-y-3">
              <div className="flex items-center space-x-3 text-[#8F725A]">
                <Clock size={20} />
                <h3 className="font-serif text-lg font-normal text-[#161514]">
                  Permohonan Anda Sedang Ditinjau
                </h3>
              </div>
              <p className="text-xs text-[#5C5852] leading-relaxed">
                Permohonan untuk bidang <strong>{user.application_field}</strong> telah kami terima dan sedang dalam proses evaluasi oleh Dewan Redaksi. Anda akan diberitahu begitu Admin menyetujui akun Anda.
              </p>
            </div>
          ) : user.application_status === 'rejected' ? (
            <div className="p-6 bg-red-50 border border-red-200 space-y-2">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle size={18} />
                <span className="font-medium text-xs">Permohonan Sebelumnya Belum Disetujui</span>
              </div>
              <p className="text-xs text-red-600">
                Anda dapat memperbarui tautan portofolio dan pitch ide artikel di bawah ini untuk mengajukan permohonan ulang.
              </p>
            </div>
          ) : null}

          {/* Form Pengajuan (Hanya tampil jika belum pending) */}
          {user.application_status !== 'pending' && (
            <form onSubmit={handleApplyContributor} className="space-y-6 max-w-xl">
              {appMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-800 flex items-center space-x-2">
                  <CheckCircle size={15} />
                  <span>{appMsg}</span>
                </div>
              )}

              {appError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                  {appError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
                  Bidang Keahlian / Minat Penulisan
                </label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full bg-white border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514]"
                >
                  <option value="Architecture & Spatial Design">Architecture & Spatial Design</option>
                  <option value="Interior Architecture & Living">Interior Architecture & Living</option>
                  <option value="Material & Object Craft">Material & Object Craft</option>
                  <option value="Art & Cultural Commentary">Art & Cultural Commentary</option>
                  <option value="Sustainable & Biophilic Building">Sustainable & Biophilic Building</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
                  Portofolio / Tautan Tulisan Sebelumnya (Opsional)
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://behance.net/username atau https://yourportfolio.com"
                  className="w-full bg-white border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#5C5852] font-medium">
                  Pitch Ide Artikel Pertama Anda
                </label>
                <textarea
                  rows={4}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  required
                  placeholder="Jelaskan topik arsitektur atau studi material yang ingin Anda tulis untuk ATELIER Journal..."
                  className="w-full bg-white border border-[#E2DFD6] px-4 py-3 text-sm text-[#161514] focus:outline-none focus:border-[#161514]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingApp}
                className="px-8 py-3.5 bg-[#182E2B] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#122421] transition-colors disabled:opacity-50"
              >
                {submittingApp ? 'Mengirim...' : 'Kirim Permohonan ke Admin'}
              </button>
            </form>
          )}
        </section>
      )}

      {/* 4. SAVED LIBRARY QUICK LINK */}
      <section className="border-t border-[#E2DFD6] pt-10 flex items-center justify-between text-xs uppercase tracking-wider text-[#7A766F]">
        <div className="flex items-center space-x-2">
          <BookOpen size={16} />
          <span>Koleksi Disimpan:</span>
          <Link href="/saved" className="text-[#161514] font-medium underline">
            Buka Saved Library Saya
          </Link>
        </div>
        <Link href="/" className="hover:text-[#161514]">
          ← Kembali ke Beranda
        </Link>
      </section>

    </div>
  );
}
