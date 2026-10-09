'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, Megaphone, Briefcase, LogIn, ShieldAlert, GraduationCap, Users } from 'lucide-react';
import { ClayButton } from '../ui/ClayButton';
import { ClayBadge } from '../ui/ClayBadge';

interface MobileMenuBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (role?: 'student' | 'faculty' | 'admin') => void;
}

export function MobileMenuBottomSheet({
  isOpen,
  onClose,
  onOpenAuth,
}: MobileMenuBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Clay Bottom Sheet */}
      <div className="relative w-full rounded-t-[36px] bg-[var(--clay-card)] border-t border-[var(--clay-border)] shadow-[var(--shadow-clay-card)] p-6 z-10 animate-in slide-in-from-bottom duration-300 max-h-[85dvh] overflow-y-auto">
        {/* Drag handle */}
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[var(--clay-muted)]/40" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#FF7A59] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg tracking-tight block">CampusPulse</span>
              <span className="text-[10px] text-[var(--clay-muted)] block font-bold uppercase tracking-wider">
                Smart Campus Analytics
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="h-10 w-10 rounded-2xl bg-[var(--clay-card)] flex items-center justify-center shadow-[var(--shadow-clay-btn)] text-[var(--clay-muted)] active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-3 mb-6">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] font-heading font-bold text-sm text-[var(--clay-text)] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 text-[#FF7A59]" />
            <span>Home</span>
          </Link>
          <Link
            href="/#announcements"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] font-heading font-bold text-sm text-[var(--clay-text)] active:scale-[0.98]"
          >
            <Megaphone className="h-4 w-4 text-[#2EC4B6]" />
            <span>Announcements</span>
            <ClayBadge variant="teal" size="sm" className="ml-auto">Active</ClayBadge>
          </Link>
          <Link
            href="/#placements"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] font-heading font-bold text-sm text-[var(--clay-text)] active:scale-[0.98]"
          >
            <Briefcase className="h-4 w-4 text-[#FFC857]" />
            <span>Placements</span>
            <ClayBadge variant="sun" size="sm" className="ml-auto">8-Yr Trends</ClayBadge>
          </Link>
          <Link
            href="/student"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] font-heading font-bold text-sm text-[var(--clay-text)] active:scale-[0.98]"
          >
            <GraduationCap className="h-4 w-4 text-[#5B6CFF]" />
            <span>Student Portal</span>
          </Link>
          <Link
            href="/faculty"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] font-heading font-bold text-sm text-[var(--clay-text)] active:scale-[0.98]"
          >
            <Users className="h-4 w-4 text-[#2EC4B6]" />
            <span>Faculty Portal</span>
          </Link>
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn)] font-heading font-bold text-sm text-[var(--clay-text)] active:scale-[0.98]"
          >
            <ShieldAlert className="h-4 w-4 text-[#FF7A59]" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Main CTA */}
        <ClayButton
          variant="coral"
          size="lg"
          fullWidth
          onClick={() => {
            onClose();
            onOpenAuth();
          }}
        >
          <LogIn className="h-5 w-5" />
          <span>Sign In to CampusPulse</span>
        </ClayButton>
      </div>
    </div>
  );
}
