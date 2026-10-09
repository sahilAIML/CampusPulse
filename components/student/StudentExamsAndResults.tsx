'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  FileCheck2,
  Trophy,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import {
  StudentExamSchedule,
  StudentExamResultItem,
} from '@/lib/data/student-portal';

interface StudentExamsAndResultsProps {
  upcomingExams: StudentExamSchedule[];
  results: StudentExamResultItem[];
}

export function StudentExamsAndResults({
  upcomingExams,
  results,
}: StudentExamsAndResultsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'results'>('upcoming');

  return (
    <ClayCard className="p-6 sm:p-8 border-2 border-[var(--clay-border)]">
      {/* Sub-tab Pill Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-[var(--clay-text)]">
            Examinations & Academic Standing
          </h3>
          <p className="text-xs text-[var(--clay-muted)] mt-0.5">
            Upcoming timed test schedules and tie-aware section performance rankings.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--clay-pressed)]/60 border border-[var(--clay-border)]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[var(--clay-card)] text-[#FF7A59] shadow-[var(--shadow-clay-btn)]'
                : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
            }`}
          >
            Upcoming Schedules ({upcomingExams.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-[var(--clay-card)] text-[#2EC4B6] shadow-[var(--shadow-clay-btn)]'
                : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
            }`}
          >
            Past Results & Rank ({results.length})
          </button>
        </div>
      </div>

      {/* 1. UPCOMING EXAMS TAB */}
      {activeTab === 'upcoming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-3xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <ClayBadge variant="indigo" size="sm">
                    {exam.subjectCode} • {exam.examType}
                  </ClayBadge>
                  <span className="text-[10px] font-bold text-[var(--clay-muted)] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {exam.durationMin} mins
                  </span>
                </div>

                <h4 className="font-heading font-extrabold text-base text-[var(--clay-text)] leading-snug mb-3">
                  {exam.title}
                </h4>

                <div className="space-y-1.5 text-xs text-[var(--clay-muted)] mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#FF7A59]" />
                    <span className="font-medium">{exam.date} • {exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-[#FFC857]" />
                    <span className="font-medium">Total Marks: {exam.totalMarks} pts</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--clay-pressed)]/50 border border-[var(--clay-border)] mb-4">
                  <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block mb-1">
                    Syllabus Scope
                  </span>
                  <ul className="text-[11px] text-[var(--clay-text)] space-y-0.5 list-disc list-inside">
                    {exam.syllabus.map((s, i) => (
                      <li key={i} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {exam.examRouteId ? (
                <Link
                  href={`/student/exam/${exam.examRouteId}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF7A59] to-[#E05F3F] text-white text-xs font-heading font-extrabold shadow-[var(--shadow-clay-coral)] hover:opacity-95 active:scale-95 transition-all"
                >
                  <span>Launch Timed Attempt</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <div className="text-center py-2 text-[11px] font-bold text-[var(--clay-muted)] bg-[var(--clay-pressed)] rounded-xl border border-[var(--clay-border)]">
                  Scheduled for Offline Room Exam
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. RESULTS & TIE-AWARE RANK TAB */}
      {activeTab === 'results' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--clay-pressed)]/80 text-[var(--clay-muted)] font-heading font-extrabold uppercase border-b border-[var(--clay-border)]">
              <tr>
                <th className="py-3.5 px-4">Subject & Exam</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-center">Grade</th>
                <th className="py-3.5 px-4 text-center">Class Avg</th>
                <th className="py-3.5 px-4 text-center">Topper</th>
                <th className="py-3.5 px-4 text-center">Tie-Aware Rank</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--clay-border)] font-semibold">
              {results.map((res) => (
                <tr key={res.id} className="hover:bg-[var(--clay-pressed)]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-heading font-extrabold text-[var(--clay-text)] block">
                      {res.subject}
                    </span>
                    <span className="text-[10px] text-[var(--clay-muted)]">
                      {res.code} • {res.examName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums">
                    <span className="font-heading font-extrabold text-sm text-[var(--clay-text)]">
                      {res.marksObtained}
                    </span>
                    <span className="text-[10px] text-[var(--clay-muted)]">/{res.totalMarks}</span>
                    <span className="block text-[10px] text-emerald-600 font-bold">
                      {res.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-heading font-extrabold bg-[#5B6CFF]/10 text-[#5B6CFF] border border-[#5B6CFF]/20">
                      {res.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-[var(--clay-muted)] tabular-nums font-mono">
                    {res.classAverage}
                  </td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 tabular-nums font-mono">
                    {res.topperMarks}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-heading font-extrabold">
                      <Trophy className="h-3 w-3" />
                      <span>Rank #{res.rank}</span>
                    </div>
                    <span className="block text-[9px] text-[var(--clay-muted)] mt-0.5">
                      of {res.totalStudents} peers
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[11px] text-[var(--clay-muted)]">
                    {res.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ClayCard>
  );
}
