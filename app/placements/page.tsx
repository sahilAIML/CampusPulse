'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlacementsSection } from '@/components/placements/PlacementsSection';
import { AuthModal } from '@/components/auth/AuthModal';
import { getPlacements, getTopRecruiters } from '@/lib/data/placements';
import { PlacementRecord, RecruiterMetric, UserRole } from '@/lib/data/types';

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [recruiters, setRecruiters] = useState<RecruiterMetric[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  useEffect(() => {
    async function load() {
      const [placeData, recData] = await Promise.all([
        getPlacements(),
        getTopRecruiters(),
      ]);
      setPlacements(placeData);
      setRecruiters(recData);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--clay-bg)] text-[var(--clay-text)]">
      <Navbar onOpenAuth={(role) => {
        if (role) setSelectedRole(role);
        setAuthModalOpen(true);
      }} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 pt-6 w-full">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-heading font-extrabold text-[var(--clay-muted)] hover:text-[#2EC4B6] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Campus Pulse</span>
          </Link>
        </div>

        <PlacementsSection initialPlacements={placements} recruiters={recruiters} />
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={selectedRole}
      />
    </div>
  );
}
