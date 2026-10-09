'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, LogIn, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlockPuzzleSimulation } from '@/components/hero/BlockPuzzleSimulation';
import { StatChips } from '@/components/hero/StatChips';
import { AnnouncementsSection } from '@/components/announcements/AnnouncementsSection';
import { PlacementsSection } from '@/components/placements/PlacementsSection';
import { AuthModal } from '@/components/auth/AuthModal';
import { ClayButton } from '@/components/ui/ClayButton';
import { ClayBadge } from '@/components/ui/ClayBadge';
import { ClayCard } from '@/components/ui/ClayCard';
import { getAnnouncements } from '@/lib/data/announcements';
import { getPlacements, getTopRecruiters } from '@/lib/data/placements';
import { getCampusPulseStats } from '@/lib/data/stats';
import { Announcement, PlacementRecord, RecruiterMetric, CampusPulseStats, UserRole } from '@/lib/data/types';

export default function LandingPage() {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Data states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [recruiters, setRecruiters] = useState<RecruiterMetric[]>([]);
  const [stats, setStats] = useState<CampusPulseStats>({
    students_tracked: 120,
    at_risk_caught_early: 28,
    placement_rate_pct: 88.5,
    active_interventions: 18,
    sections_monitored: 3,
    average_cgpa: 7.64,
  });

  useEffect(() => {
    async function loadData() {
      const [annData, placeData, recData, statsData] = await Promise.all([
        getAnnouncements(),
        getPlacements(),
        getTopRecruiters(),
        getCampusPulseStats(),
      ]);
      setAnnouncements(annData);
      setPlacements(placeData);
      setRecruiters(recData);
      setStats(statsData);
    }
    loadData();
  }, []);

  const handleOpenAuth = (role?: UserRole) => {
    if (role) setSelectedRole(role);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--clay-bg)] text-[var(--clay-text)] relative">
      {/* Sticky Clay Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Hero Section */}
      <main className="flex-1">
        <section className="relative w-full pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Value Proposition & Headlines */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                {/* Challenge Badge */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <ClayBadge variant="coral" icon={<Sparkles className="h-3.5 w-3.5" />}>
                    Smart Campus Analytics • KPMG Challenge
                  </ClayBadge>
                </div>

                {/* Bold Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.15] mb-5 drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)]">
                  Transform student data into{' '}
                  <span className="text-white font-black drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)]">
                    actionable intelligence.
                  </span>
                </h1>

                {/* One-Line Value Statement */}
                <p className="text-base sm:text-lg md:text-xl text-white/95 font-medium max-w-2xl leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  CampusPulse bridges fragmented SIS records, biometric attendance, and CIE marks into explainable early-warning indicators and targeted interventions for faculty and administrators.
                </p>

                {/* Two Clay Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <ClayButton
                    variant="coral"
                    size="lg"
                    onClick={() => handleOpenAuth('student')}
                    className="w-full sm:w-auto"
                  >
                    <span>Student Access</span>
                    <ArrowRight className="h-4 w-4" />
                  </ClayButton>

                  <ClayButton
                    variant="default"
                    size="lg"
                    onClick={() => handleOpenAuth('faculty')}
                    className="w-full sm:w-auto"
                  >
                    <LogIn className="h-4 w-4 text-[#2EC4B6]" />
                    <span>Faculty & Admin Access</span>
                  </ClayButton>
                </div>

                {/* Quick Trust Highlights */}
                <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-bold text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2EC4B6]" />
                    100% Explainable Scores (0-100)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#FF7A59]" />
                    Section-Level RLS Scoped
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#5B6CFF]" />
                    Role-Based Access Control
                  </span>
                </div>
              </div>

              {/* Right Column: Smooth Block Puzzle Gameplay Simulation */}
              <div className="lg:col-span-5 w-full flex justify-center">
                <BlockPuzzleSimulation />
              </div>
            </div>
          </div>
        </section>

        {/* Live Stat Chips with Count-Up */}
        <section className="w-full px-4 sm:px-8 -mt-2 sm:-mt-6 mb-12 sm:mb-16">
          <StatChips stats={stats} />
        </section>

        {/* Announcements Section (Official Circulars, Exam Schedules, Fests) */}
        <AnnouncementsSection initialAnnouncements={announcements} />

        {/* Placements Section (8-Yr Trends, Company Filters, Recharts Bar Chart) */}
        <PlacementsSection initialPlacements={placements} recruiters={recruiters} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Clay Auth / Role Select Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={selectedRole}
        onSuccess={(role) => {
          if (role === 'faculty') {
            router.push('/faculty');
          } else if (role === 'admin') {
            router.push('/admin');
          } else if (role === 'student') {
            router.push('/student');
          }
        }}
      />
    </div>
  );
}
