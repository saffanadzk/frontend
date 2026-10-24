'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Shield, Check, X, RefreshCw, AlertTriangle, ArrowLeft, Lock, UserCheck } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'reader' | 'contributor' | 'editor' | 'admin';
  bio?: string;
  application_status?: 'none' | 'pending' | 'approved' | 'rejected';
  application_field?: string;
  application_portfolio?: string;
  application_pitch?: string;
  articles_count?: number;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function AdminUsersPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // States for role promotion modal and in-flight updates
  const [promotingUser, setPromotingUser] = useState<UserData | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center space-y-4">
        <AlertTriangle size={36} className="mx-auto text-[#8F725A]" />
        <h1 className="font-serif text-3xl text-[#161514]">
          Akses Terbatas: Administrator
        </h1>
        <p className="text-sm text-[#7A766F] font-light">
          Halaman ini khusus untuk Administrator publikasi ATELIER Journal.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-[#161514] text-white text-xs uppercase tracking-widest"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Handle dropdown selection change
  const handleRoleSelectChange = (targetUser: UserData, newRole: string) => {
    if (newRole === targetUser.role) return;

    if (newRole === 'admin') {
      // Require explicit confirmation modal for Administrator promotion
      setPromotingUser(targetUser);
    } else {
      // Direct update for Reader, Contributor, or Editor
      executeRoleUpdate(targetUser.id, newRole, false);
    }
  };

  // Perform genuine database update via Laravel API
  const executeRoleUpdate = async (userId: number, newRole: string, confirmPromotion: boolean = false) => {
    setUpdatingUserId(userId);
    setActionMsg(null);

    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
          confirm_admin_promotion: confirmPromotion,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMsg({
          text: data.message || `Role pengguna berhasil disimpan ke database sebagai ${newRole}.`,
          isError: false,
        });

        // Update local state directly with verified record from Laravel
        if (data.user) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: data.user.role } : u))
          );
        } else {
          fetchUsers();
        }
      } else {
        setActionMsg({
          text: data.message || 'Gagal mengubah role pengguna di database.',
          isError: true,
        });
      }
    } catch {
      setActionMsg({
        text: 'Terjadi kesalahan koneksi saat menyimpan perubahan role ke server.',
        isError: true,
      });
    } finally {
      setUpdatingUserId(null);
      setPromotingUser(null);
    }
  };

  const handleApproveApp = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/approve-application`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        setActionMsg({ text: data.message, isError: false });
        fetchUsers();
      } else {
        setActionMsg({ text: data.message || 'Gagal menyetujui permohonan.', isError: true });
      }
    } catch {
      setActionMsg({ text: 'Terjadi kesalahan koneksi.', isError: true });
    }
  };

  const handleRejectApp = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/reject-application`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        setActionMsg({ text: data.message, isError: false });
        fetchUsers();
      } else {
        setActionMsg({ text: data.message || 'Gagal menolak permohonan.', isError: true });
      }
    } catch {
      setActionMsg({ text: 'Terjadi kesalahan koneksi.', isError: true });
    }
  };

  const pendingApps = users.filter((u) => u.application_status === 'pending');

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-16">
      
      {/* 1. HEADER */}
      <header className="border-b border-[#E2DFD6] pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="text-xs uppercase tracking-widest text-[#7A766F] hover:text-[#161514] flex items-center space-x-1">
              <ArrowLeft size={13} />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#161514] font-normal">
            Admin User & Role Control
          </h1>
          <p className="text-xs sm:text-sm text-[#7A766F] font-light">
            Kelola hak akses pengguna, otorisasi peran Contributor/Editor, dan pantau seluruh anggota terdaftar.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider px-4 py-2.5 border border-[#161514] hover:bg-[#161514] hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Segarkan Data</span>
        </button>
      </header>

      {/* ACTION MESSAGE BANNER */}
      {actionMsg && (
        <div
          className={`p-4 text-xs flex items-center justify-between border ${
            actionMsg.isError
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-[#F6F4EE] border-[#C5A880] text-[#161514]'
          }`}
        >
          <span className="font-medium">{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)} className="text-[#7A766F] hover:text-[#161514] ml-4">
            <X size={15} />
          </button>
        </div>
      )}

      {/* 2. DAFTAR PERMOHONAN KONTRIBUTOR MASUK (PENDING APPLICATIONS) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="watershedd-sub text-[#8F725A] block">
              Persetujuan Penulis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#161514] font-normal">
              Permohonan Contributor Baru ({pendingApps.length})
            </h2>
          </div>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-8 bg-white border border-[#E2DFD6] text-center text-xs text-[#7A766F] font-light">
            Tidak ada permohonan contributor baru yang sedang menunggu persetujuan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingApps.map((applicant) => (
              <div key={applicant.id} className="bg-white border border-[#C5A880] p-6 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-[#161514] font-normal">
                      {applicant.name}
                    </h3>
                    <p className="text-xs text-[#7A766F]">{applicant.email}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E2DFD6] text-[10px] uppercase tracking-wider text-[#8F725A]">
                      Bidang: {applicant.application_field}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] uppercase tracking-wider border border-amber-200">
                    Pending
                  </span>
                </div>

                {applicant.application_portfolio && (
                  <div className="text-xs">
                    <span className="text-[#7A766F] block text-[10px] uppercase tracking-wider">Portofolio:</span>
                    <a
                      href={applicant.application_portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#161514] underline truncate block"
                    >
                      {applicant.application_portfolio}
                    </a>
                  </div>
                )}

                <div className="text-xs space-y-1 bg-[#F6F4EE] p-3 border border-[#E2DFD6]">
                  <span className="text-[#7A766F] block text-[10px] uppercase tracking-wider font-medium">Pitch Ide Tulisan:</span>
                  <p className="text-[#2D2C2A] font-light leading-relaxed whitespace-pre-wrap">
                    {applicant.application_pitch}
                  </p>
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={() => handleApproveApp(applicant.id)}
                    className="flex-1 py-2.5 bg-[#182E2B] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#122421] transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Check size={14} />
                    <span>Setujui (Jadikan Contributor)</span>
                  </button>
                  <button
                    onClick={() => handleRejectApp(applicant.id)}
                    className="px-4 py-2.5 border border-red-300 text-red-700 text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. USER MANAGEMENT TABLE */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="watershedd-sub text-[#8F725A] block">
            Direktori Akun
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#161514] font-normal">
            Daftar Seluruh Pengguna Terdaftar ({users.length})
          </h2>
        </div>

        <div className="bg-white border border-[#E2DFD6] overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F4EE] border-b border-[#E2DFD6] text-[10px] uppercase tracking-[0.2em] text-[#5C5852]">
              <tr>
                <th className="py-4 px-6 font-medium">Pengguna</th>
                <th className="py-4 px-6 font-medium">Email</th>
                <th className="py-4 px-6 font-medium">Artikel Diterbitkan</th>
                <th className="py-4 px-6 font-medium">Role Saat Ini</th>
                <th className="py-4 px-6 font-medium text-right">Ubah Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DFD6]">
              {users.map((u) => {
                const isPrimaryAdmin = u.email === 'admin@atelier.local';
                const isCurrentSelf = u.id === user.id;

                return (
                  <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-4 px-6 font-medium text-[#161514]">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-full bg-[#161514] text-white flex items-center justify-center font-serif text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#161514]">{u.name}</p>
                          {isPrimaryAdmin && (
                            <span className="text-[9px] uppercase tracking-wider text-[#8F725A] block font-mono">
                              Master System Account
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#7A766F] font-mono text-[11px]">{u.email}</td>
                    <td className="py-4 px-6 text-[#5C5852]">{u.articles_count ?? 0} naskah</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-medium rounded-full ${
                        u.role === 'admin' ? 'bg-[#161514] text-white' :
                        u.role === 'editor' ? 'bg-[#182E2B] text-white' :
                        u.role === 'contributor' ? 'bg-[#8F725A] text-white' :
                        'bg-[#ECEAE2] text-[#161514]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isPrimaryAdmin ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#161514] text-[#F6F4EE] text-[10px] uppercase tracking-wider font-medium">
                          <Shield size={11} />
                          <span>Admin Utama (Protected)</span>
                        </span>
                      ) : isCurrentSelf ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#ECEAE2] text-[#7A766F] text-[10px] uppercase tracking-wider border border-[#E2DFD6] font-medium">
                          <Lock size={11} />
                          <span>Akun Anda (Terkunci)</span>
                        </span>
                      ) : (
                        <div className="inline-flex items-center space-x-2">
                          {updatingUserId === u.id && (
                            <RefreshCw size={12} className="animate-spin text-[#8F725A]" />
                          )}
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleSelectChange(u, e.target.value)}
                            disabled={updatingUserId === u.id}
                            className="bg-white border border-[#E2DFD6] px-3 py-1.5 text-xs text-[#161514] focus:outline-none focus:border-[#161514] cursor-pointer hover:border-[#8F725A] transition-colors"
                          >
                            <optgroup label="Akun Pengguna Biasa">
                              <option value="reader">Reader</option>
                              <option value="contributor">Contributor</option>
                              <option value="editor">Editor</option>
                            </optgroup>
                            <optgroup label="Tingkat Tinggi">
                              <option value="admin">Promote to Administrator...</option>
                            </optgroup>
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. MODAL: SPECIAL CONFIRMATION FOR PROMOTING TO ADMINISTRATOR */}
      {promotingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#C5A880] max-w-lg w-full p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-[#8F725A]">
              <AlertTriangle size={24} />
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Otorisasi Tingkat Tinggi</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-2xl text-[#161514]">
                Promote this user to Administrator?
              </h3>
              <p className="text-xs text-[#5C5852] leading-relaxed">
                Anda akan memberikan hak akses <strong className="text-[#161514]">Administrator Penuh</strong> kepada:
              </p>
              <div className="p-4 bg-[#F6F4EE] border border-[#E2DFD6] space-y-1">
                <p className="font-medium text-sm text-[#161514]">{promotingUser.name}</p>
                <p className="text-xs text-[#7A766F] font-mono">{promotingUser.email}</p>
                <p className="text-[11px] text-[#8F725A] mt-1">
                  Role saat ini: <span className="uppercase font-medium">{promotingUser.role}</span>
                </p>
              </div>
              <p className="text-[11px] text-[#9E3E3E] leading-relaxed">
                Perhatian: Sebagai Administrator, pengguna ini akan memiliki kendali penuh atas sistem, termasuk kemampuan mengelola pengguna lain, menyetujui artikel, dan mengakses semua setelan publikasi.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-4 border-t border-[#E2DFD6]">
              <button
                type="button"
                onClick={() => setPromotingUser(null)}
                className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#7A766F] hover:text-[#161514] font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => executeRoleUpdate(promotingUser.id, 'admin', true)}
                disabled={updatingUserId === promotingUser.id}
                className="px-6 py-2.5 bg-[#161514] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#2D2C2A] transition-colors flex items-center space-x-2"
              >
                {updatingUserId === promotingUser.id ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Shield size={13} />
                )}
                <span>Promote to Administrator</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
