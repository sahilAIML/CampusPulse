'use client';

import React from 'react';
import {
  Sparkles,
  Award,
  TrendingUp,
  Target,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { DetailedStudentDossier } from '@/lib/data/student-portal';

interface StudentScoreGaugeProps {
  dossier: DetailedStudentDossier;
}

export function StudentScoreGauge({ dossier }: StudentScoreGaugeProps) {
  const score = dossier.success_score;
  const maxScore = 100;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  // Encouraging tier title
  const getEncouragement = (s: number) => {
    if (s >= 85) return { tier: 'Excellence Tier', message: 'Outstanding mastery across academic and co-curricular dimensions!' };
    if (s >= 70) return { tier: 'High-Potential Achiever', message: 'You have solid momentum! Addressing key focus areas will elevate you into the top tier.' };
    if (s >= 50) return { tier: 'Progress in Motion', message: 'Steady progress. Targeted daily habits will yield quick, substantial score gains.' };
    return { tier: 'Growth & Recovery Journey', message: 'Every step counts. Dedicated support and clinics are available to accelerate your progress.' };
  };

  const encouragement = getEncouragement(score);

  return (
    <ClayCard className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[var(--clay-card)] to-[var(--clay-pressed)]/40 border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)]">
      {/* Decorative ambient clay glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#FF7A59]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#2EC4B6]/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
        {/* Left: Tactile Clay Score Gauge */}
        <div className="relative flex flex-col items-center justify-center flex-shrink-0">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circular Track */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-[var(--clay-border)]"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="url(#studentGaugeGradient)"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="studentGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7A59" />
                  <stop offset="50%" stopColor="#FFC857" />
                  <stop offset="100%" stopColor="#2EC4B6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Display */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[var(--clay-muted)]">
                Success Score
              </span>
              <div className="flex items-baseline">
                <span className="text-4xl sm:text-5xl font-heading font-extrabold text-[var(--clay-text)] tracking-tight">
                  {score.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-[var(--clay-muted)] ml-1">/100</span>
              </div>
              <ClayBadge
                variant={score >= 70 ? 'teal' : score >= 50 ? 'sun' : 'coral'}
                size="sm"
                className="mt-1"
              >
                {dossier.segment}
              </ClayBadge>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[var(--clay-muted)] mt-2">
            Section {dossier.section} • Rank #{dossier.section_rank} of {dossier.total_in_section}
          </span>
        </div>

        {/* Right: Positive Feedback & Core Metrics Pill */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
            <ClayBadge variant="coral" icon={<Sparkles className="h-3 w-3" />}>
              Personal Standing
            </ClayBadge>
            <ClayBadge variant="indigo" icon={<Award className="h-3 w-3" />}>
              {dossier.percentile}th Percentile
            </ClayBadge>
            <ClayBadge variant="teal" icon={<ShieldCheck className="h-3 w-3" />}>
              Active Semester {dossier.semester}
            </ClayBadge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--clay-text)] tracking-tight">
            {encouragement.tier}
          </h2>
          <p className="text-sm text-[var(--clay-muted)] mt-1.5 leading-relaxed max-w-xl">
            {encouragement.message}
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
              <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                Cumulative GPA
              </span>
              <span className="text-lg font-heading font-extrabold text-[var(--clay-text)] mt-0.5 block">
                {dossier.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 block">
                {dossier.backlogs === 0 ? '0 Backlogs' : `${dossier.backlogs} Backlogs`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
              <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                Biometric Att.
              </span>
              <span className={`text-lg font-heading font-extrabold mt-0.5 block ${
                dossier.attendance_pct >= 75 ? 'text-emerald-600' : 'text-[#FF7A59]'
              }`}>
                {dossier.attendance_pct.toFixed(1)}%
              </span>
              <span className="text-[10px] font-semibold text-[var(--clay-muted)] block">
                {dossier.attendance_pct >= 75 ? 'Safe Standing' : '1.0% to Safe Tier'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
              <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                Placement Index
              </span>
              <span className="text-lg font-heading font-extrabold text-[#5B6CFF] mt-0.5 block">
                76.0%
              </span>
              <span className="text-[10px] font-semibold text-[var(--clay-muted)] block">
                Aptitude & Coding
              </span>
            </div>
          </div>
        </div>
      </div>
    </ClayCard>
  );
}
