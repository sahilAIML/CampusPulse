'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import { DetailedStudentDossier } from '@/lib/data/student-portal';
import { logoutUser } from '@/lib/data/auth';
import { useRouter } from 'next/navigation';
import { EditProfileModal } from './EditProfileModal';
import { ThemeToggle } from '../ui/ThemeToggle';

interface StudentPortalHeaderProps {
  dossier: DetailedStudentDossier;
  onProfileUpdated: (updated: DetailedStudentDossier) => void;
}

export function StudentPortalHeader({
  dossier,
  onProfileUpdated,
}: StudentPortalHeaderProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <>
      <header className="mb-6 p-5 sm:p-6 rounded-[32px] bg-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Greeting & Badges */}
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)] flex-shrink-0">
              <GraduationCap className="h-7 w-7" />
              <div className="absolute top-1 left-1.5 h-3.5 w-4 rounded-full bg-white/40 blur-[1px]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <ClayBadge variant="coral" icon={<Sparkles className="h-3 w-3" />}>
                  Authenticated Student Dossier
                </ClayBadge>
                <ClayBadge variant="teal" icon={<ShieldCheck className="h-3 w-3" />}>
                  Roll No: {dossier.reg_no}
                </ClayBadge>
                <span className="text-xs font-bold text-[var(--clay-muted)]">
                  {dossier.department} • Section {dossier.section}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[var(--clay-text)] tracking-tight">
                Welcome back, {dossier.full_name}!
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Black / White / B&W Theme Option */}
            <ThemeToggle size="sm" />

            {/* Edit Profile & Coding Links Button */}
            <ClayButton
              variant="default"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#5B6CFF]" />
              <span>Edit Profile & Links</span>
            </ClayButton>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] text-xs font-heading font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Sign Out of CampusPulse"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        dossier={dossier}
        onProfileUpdated={onProfileUpdated}
      />
    </>
  );
}
