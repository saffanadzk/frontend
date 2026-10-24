'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Bookmark, LogOut, PenTool, Shield, X, ArrowUpRight } from 'lucide-react';
import { EditorialConfig } from '@/types';

interface HeaderProps {
  config: EditorialConfig;
}

export default function Header({ config }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, isStaff } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <>
      {/* ATELIER Floating Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F6F4EE]/95 backdrop-blur-md border-b border-[#E2DFD6] transition-all">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          
          {/* ZONE 1 (LEFT): Minimalist Two-Line Menu Trigger (Exact User Mockup Reference) */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center space-x-3 text-[#161514] hover:opacity-70 transition-opacity"
              aria-label="Toggle Navigation Menu"
            >
              <div className="flex flex-col space-y-1.5 w-5 justify-center">
                <span className="w-5 h-[1.5px] bg-[#161514] transition-all group-hover:w-4" />
                <span className="w-3.5 h-[1.5px] bg-[#161514] transition-all group-hover:w-5" />
              </div>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] font-medium">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
          </div>

          {/* ZONE 2 (CENTER): Architectural Masthead Logo (Exact User Mockup Reference) */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.35em] text-[#161514] uppercase font-normal block transition-opacity group-hover:opacity-80">
                A T E L I E R
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#7A766F] block mt-0.5 font-light">
                Architecture & Design Review
              </span>
            </Link>
          </div>

          {/* ZONE 3 (RIGHT): About + Sign In / Account (Exact User Mockup Reference) */}
          <div className="flex items-center space-x-6 sm:space-x-8 text-[11px] uppercase tracking-[0.25em]">
            <Link
              href="/about"
              className={`transition-colors ${
                pathname === '/about' ? 'text-[#161514] font-semibold' : 'text-[#7A766F] hover:text-[#161514]'
              }`}
            >
              About
            </Link>

            {user && (
              <Link
                href="/saved"
                className="text-[#7A766F] hover:text-[#161514] transition-colors"
                title="Saved Articles"
              >
                <Bookmark size={15} />
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="text-[#161514] font-medium hover:text-[#8F725A] transition-colors flex items-center space-x-1.5 py-1 px-2 border border-transparent hover:border-[#E2DFD6]"
                >
                  <span className="uppercase tracking-[0.2em] font-medium text-[11px]">
                    {user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'editor'
                      ? 'Editor'
                      : user.role === 'contributor'
                      ? `${user.name.split(' ')[0]} (Contributor)`
                      : user.name.split(' ')[0]}
                  </span>
                </button>

                {accountMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-60 bg-[#F6F4EE] border border-[#E2DFD6] shadow-2xl py-2 z-50 text-[11px] uppercase tracking-wider"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-[#E2DFD6] mb-1 normal-case">
                      <p className="font-serif text-sm text-[#161514] font-medium truncate">{user.name}</p>
                      <p className="text-[10px] text-[#7A766F] font-mono lowercase truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 bg-[#161514] text-[#F6F4EE] uppercase tracking-[0.2em] font-medium">
                        Role: {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-[#161514] hover:bg-[#ECEAE2]"
                    >
                      <User size={13} />
                      <span>My Profile</span>
                    </Link>

                    {isStaff && (
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-[#161514] hover:bg-[#ECEAE2]"
                      >
                        <PenTool size={13} />
                        <span>Contributor Desk</span>
                      </Link>
                    )}

                    {['editor', 'admin'].includes(user.role) && (
                      <Link
                        href="/dashboard/editorial-review"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-[#161514] hover:bg-[#ECEAE2]"
                      >
                        <Shield size={13} />
                        <span>Review Pending</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-[#161514] hover:bg-[#ECEAE2]"
                      >
                        <Shield size={13} />
                        <span>Admin Control</span>
                      </Link>
                    )}

                    <Link
                      href="/saved"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-[#161514] hover:bg-[#ECEAE2]"
                    >
                      <Bookmark size={13} />
                      <span>Saved Library</span>
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center space-x-2.5 px-4 py-2.5 text-[#9E3E3E] hover:bg-red-50 border-t border-[#E2DFD6] mt-1"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[#161514] hover:text-[#8F725A] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Editorial Curtain Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#161514]/40 backdrop-blur-sm flex justify-start">
          <div className="w-full max-w-xl bg-[#F6F4EE] h-full shadow-2xl flex flex-col justify-between p-8 sm:p-12 overflow-y-auto border-r border-[#E2DFD6] animate-fadeIn">
            {/* Top drawer close button */}
            <div className="flex items-center justify-between pb-8 border-b border-[#E2DFD6]">
              <span className="watershedd-sub text-[#8F725A]">
                ATELIER Editorial Index
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-[#161514] hover:opacity-70 transition-opacity"
                aria-label="Close Navigation"
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation links styled with giant editorial serifs */}
            <div className="py-10 space-y-6">
              <span className="watershedd-sub text-[#A8A49C] block mb-4">
                Disciplines & Curations
              </span>
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`font-serif text-3xl sm:text-4xl text-[#161514] hover:text-[#8F725A] transition-colors flex items-center justify-between group ${
                    pathname === '/' ? 'italic' : ''
                  }`}
                >
                  <span>Featured Journal</span>
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {config.navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`font-serif text-3xl sm:text-4xl text-[#161514] hover:text-[#8F725A] transition-colors flex items-center justify-between group ${
                        isActive ? 'italic' : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}

                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`font-serif text-3xl sm:text-4xl text-[#161514] hover:text-[#8F725A] transition-colors flex items-center justify-between group ${
                    pathname === '/about' ? 'italic' : ''
                  }`}
                >
                  <span>About & Curators</span>
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </nav>
            </div>

            {/* Colophon & Contributor Desk Info */}
            <div className="pt-8 border-t border-[#E2DFD6] space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.2em] text-[#7A766F]">
                <div>
                  <span className="block text-[9px] text-[#A8A49C] mb-1 font-light">Publication</span>
                  <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#161514] block">
                    Our Ethos
                  </Link>
                  <Link href="/about#curators" onClick={() => setMenuOpen(false)} className="hover:text-[#161514] block mt-1">
                    Editorial Board
                  </Link>
                </div>
                <div>
                  <span className="block text-[9px] text-[#A8A49C] mb-1 font-light">Editorial Desk</span>
                  {user ? (
                    isStaff ? (
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-[#161514] block">
                        Contributor Portal
                      </Link>
                    ) : (
                      <span className="text-[#161514]">Reader Access</span>
                    )
                  ) : (
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:text-[#161514] block">
                      Staff Sign In
                    </Link>
                  )}
                </div>
              </div>

              <div className="watershedd-sub text-[9px] text-[#A8A49C] flex justify-between items-center pt-4 border-t border-[#E2DFD6]">
                <span>© {new Date().getFullYear()} ATELIER Journal</span>
                <span>Spatial Architecture Review</span>
              </div>
            </div>
          </div>

          {/* Click outside backdrop to close */}
          <div className="flex-1 h-full" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
