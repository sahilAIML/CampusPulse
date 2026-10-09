'use client';

import React from 'react';
import { Award, ShieldAlert, Calendar, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { CountUp } from '../ui/CountUp';
import { StudentListItem } from '@/lib/data/students';

interface FacultyKpiRowProps {
  students: StudentListItem[];
}

export function FacultyKpiRow({ students }: FacultyKpiRowProps) {
  const n = Math.max(1, students.length);
  const avgScore = Number((students.reduce((acc, s) => acc + s.success_score, 0) / n).toFixed(1));
  const atRiskCount = students.filter((s) => s.risk_level === 'high' || s.risk_level === 'critical').length;
  const attendanceBelow75Count = students.filter((s) => s.attendance_pct < 75.0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 w-full">
      {/* 1. Average Success Score */}
      <ClayCard hoverable className="p-5 sm:p-6 flex flex-col justify-between group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#5B6CFF] text-white flex items-center justify-center shadow-[var(--shadow-clay-btn)]">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                Avg Success Score
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" /> +2.4 pts vs CIE-1
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--clay-text)] tracking-tight">
            <CountUp end={avgScore} decimals={1} duration={1200} />
            <span className="text-xs font-bold text-[var(--clay-muted)] ml-1">/ 100</span>
          </div>

          {/* SVG Curved Sparkline */}
          <div className="w-24 h-10">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M0,32 Q25,28 40,20 T70,14 T100,6"
                fill="none"
                stroke="#5B6CFF"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="6" r="4.5" fill="#5B6CFF" />
            </svg>
          </div>
        </div>
      </ClayCard>

      {/* 2. At-Risk Count */}
      <ClayCard hoverable className="p-5 sm:p-6 flex flex-col justify-between group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] text-white flex items-center justify-center shadow-[var(--shadow-clay-coral)]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                At-Risk Students
              </span>
              <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5 mt-0.5">
                Critical & High Probability
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-rose-600 dark:text-rose-400 tracking-tight">
            <CountUp end={atRiskCount} duration={1400} />
            <span className="text-xs font-bold text-[var(--clay-muted)] ml-1">flagged</span>
          </div>

          {/* SVG Sparkline */}
          <div className="w-24 h-10">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M0,12 Q20,18 45,15 T75,28 T100,22"
                fill="none"
                stroke="#FF7A59"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="22" r="4.5" fill="#FF7A59" />
            </svg>
          </div>
        </div>
      </ClayCard>

      {/* 3. Attendance Below 75% */}
      <ClayCard hoverable className="p-5 sm:p-6 flex flex-col justify-between group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FFC857] to-[#E5AF3E] text-gray-900 flex items-center justify-center shadow-[var(--shadow-clay-btn)]">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                Attendance &lt; 75%
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 mt-0.5">
                Debarment Risk Threshold
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-amber-600 dark:text-amber-400 tracking-tight">
            <CountUp end={attendanceBelow75Count} duration={1300} />
            <span className="text-xs font-bold text-[var(--clay-muted)] ml-1">students</span>
          </div>

          {/* SVG Sparkline */}
          <div className="w-24 h-10">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M0,8 Q30,12 50,22 T80,32 T100,30"
                fill="none"
                stroke="#FFC857"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="30" r="4.5" fill="#FFC857" />
            </svg>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
