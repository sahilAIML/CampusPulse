'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Megaphone,
  Briefcase,
  LogIn,
  Menu,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { ClayButton } from '../ui/ClayButton';
import { ClayBadge } from '../ui/ClayBadge';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileMenuBottomSheet } from './MobileMenuBottomSheet';

interface NavbarProps {
  onOpenAuth: (role?: 'student' | 'faculty' | 'admin') => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <header
        className={`sticky top-3 sm:top-5 z-40 w-full px-4 sm:px-8 transition-all duration-300 max-w-7xl mx-auto`}
      >
        <nav
          className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 rounded-3xl bg-[var(--clay-card)] border border-[var(--clay-border)] transition-all duration-300 ${
            isScrolled
              ? 'shadow-[var(--shadow-clay-card-hover)]'
              : 'shadow-[var(--shadow-clay-card)]'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
              <Sparkles className="h-5 w-5 animate-pulse" />
              {/* 3D clay specular reflection */}
              <div className="absolute top-1 left-1.5 h-3 w-4 rounded-full bg-white/40 blur-[1px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight leading-none text-[var(--clay-text)]">
                Campus<span className="text-[#FF7A59]">Pulse</span>
              </span>
              <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase tracking-wider mt-0.5 hidden xs:inline">
                Decision Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-[var(--clay-pressed)]/50 p-1.5 rounded-2xl border border-[var(--clay-border)]">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-heading font-bold transition-all ${
                pathname === '/'
                  ? 'bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] text-[#FF7A59]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/#announcements"
              className="px-4 py-2 rounded-xl text-sm font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)] transition-all flex items-center gap-1.5"
            >
              <Megaphone className="h-3.5 w-3.5 text-[#2EC4B6]" />
              <span>Announcements</span>
            </Link>
            <Link
              href="/#placements"
              className="px-4 py-2 rounded-xl text-sm font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)] transition-all flex items-center gap-1.5"
            >
              <Briefcase className="h-3.5 w-3.5 text-[#FFC857]" />
              <span>Placements</span>
            </Link>
            <Link
              href="/student"
              className={`px-3 py-2 rounded-xl text-sm font-heading font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/student'
                  ? 'bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] text-[#5B6CFF]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <span>Student</span>
            </Link>
            <Link
              href="/faculty"
              className={`px-3 py-2 rounded-xl text-sm font-heading font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/faculty'
                  ? 'bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] text-[#2EC4B6]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <span>Faculty</span>
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-xl text-sm font-heading font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/admin'
                  ? 'bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] text-[#FF7A59]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Status chip */}
            <div className="hidden xl:flex items-center">
              <ClayBadge variant="teal" size="sm" icon={<ShieldCheck className="h-3 w-3" />}>
                Encrypted & RLS Guarded
              </ClayBadge>
            </div>

            {/* Black / White / B&W Theme Option */}
            <ThemeToggle size="sm" />

            {/* Login / Access Button */}
            <ClayButton
              variant="coral"
              size="sm"
              onClick={() => onOpenAuth()}
              className="hidden sm:inline-flex"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </ClayButton>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="sm:hidden h-10 w-10 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-center text-[var(--clay-text)] shadow-[var(--shadow-clay-btn)] active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Bottom Sheet */}
      <MobileMenuBottomSheet
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAuth={onOpenAuth}
      />
    </>
  );
}
