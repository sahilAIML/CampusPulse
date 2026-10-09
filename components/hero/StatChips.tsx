'use client';

import React from 'react';
import { Users, ShieldAlert, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { CountUp } from '../ui/CountUp';
import { CampusPulseStats } from '@/lib/data/types';

interface StatChipsProps {
  stats: CampusPulseStats;
}

export function StatChips({ stats }: StatChipsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
      {/* 1. Students Tracked */}
      <ClayCard
        hoverable
        className="p-5 sm:p-6 flex items-center gap-4 group transition-transform"
      >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5B6CFF] to-[#4554DB] flex items-center justify-center text-white shadow-[var(--shadow-clay-btn)] flex-shrink-0 group-hover:scale-105 transition-transform">
          <Users className="h-7 w-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider">
            Students Tracked
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--clay-text)] tracking-tight">
            <CountUp end={stats.students_tracked} duration={1200} />
          </div>
          <span className="text-xs font-semibold text-[var(--clay-muted)] mt-0.5">
            3 Sections (CSE Year 3)
          </span>
        </div>
      </ClayCard>

      {/* 2. At-Risk Caught Early */}
      <ClayCard
        hoverable
        className="p-5 sm:p-6 flex items-center gap-4 group transition-transform"
      >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)] flex-shrink-0 group-hover:scale-105 transition-transform">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider">
            At-Risk Caught Early
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-rose-600 dark:text-rose-400 tracking-tight flex items-baseline gap-1">
            <CountUp end={stats.at_risk_caught_early} duration={1400} />
            <span className="text-xs font-bold text-rose-500 uppercase">Alerts</span>
          </div>
          <span className="text-xs font-semibold text-[var(--clay-muted)] mt-0.5">
            {stats.active_interventions} Active Interventions
          </span>
        </div>
      </ClayCard>

      {/* 3. Placement Rate */}
      <ClayCard
        hoverable
        className="p-5 sm:p-6 flex items-center gap-4 group transition-transform"
      >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2EC4B6] to-[#1E8B81] flex items-center justify-center text-white shadow-[var(--shadow-clay-teal)] flex-shrink-0 group-hover:scale-105 transition-transform">
          <TrendingUp className="h-7 w-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider">
            Placement Rate
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400 tracking-tight">
            <CountUp end={stats.placement_rate_pct} decimals={1} suffix="%" duration={1600} />
          </div>
          <span className="text-xs font-semibold text-[var(--clay-muted)] mt-0.5">
            Avg Package: 5.6 LPA
          </span>
        </div>
      </ClayCard>
    </div>
  );
}
