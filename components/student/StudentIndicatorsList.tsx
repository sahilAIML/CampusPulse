'use client';

import React from 'react';
import {
  BookOpen,
  CalendarCheck,
  Laptop,
  Trophy,
  Briefcase,
  Code2,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Target,
  Compass,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { DetailedStudentDossier } from '@/lib/data/student-portal';

interface StudentIndicatorsListProps {
  dossier: DetailedStudentDossier;
}

export function StudentIndicatorsList({ dossier }: StudentIndicatorsListProps) {
  const getIcon = (key: string) => {
    switch (key) {
      case 'academic':
        return <BookOpen className="h-4 w-4 text-[#FF7A59]" />;
      case 'attendance':
        return <CalendarCheck className="h-4 w-4 text-[#2EC4B6]" />;
      case 'lms':
        return <Laptop className="h-4 w-4 text-[#5B6CFF]" />;
      case 'engagement':
        return <Trophy className="h-4 w-4 text-[#FFC857]" />;
      case 'placement':
        return <Briefcase className="h-4 w-4 text-[#FF7A59]" />;
      case 'skills':
        return <Code2 className="h-4 w-4 text-[#2EC4B6]" />;
      case 'feedback':
        return <HeartHandshake className="h-4 w-4 text-[#5B6CFF]" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Encouraging Growth Focus Areas (Risk reframed constructively) */}
      <ClayCard className="p-6 border-2 border-[var(--clay-border)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#FF7A59]/10 text-[#FF7A59] flex items-center justify-center font-bold">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                Priority Growth Focus Areas
              </h3>
              <p className="text-xs text-[var(--clay-muted)]">
                Targeted opportunities with high point leverage. Never a barrier — only a roadmap.
              </p>
            </div>
          </div>
          <ClayBadge variant="sun" size="sm">
            Constructive Guidance
          </ClayBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {dossier.focus_areas.map((fa, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-extrabold text-[var(--clay-text)]">
                    {fa.title}
                  </span>
                  <ClayBadge
                    variant={fa.urgency === 'high' ? 'coral' : 'sun'}
                    size="sm"
                  >
                    {fa.urgency === 'high' ? 'Immediate Unlock' : 'Recommended'}
                  </ClayBadge>
                </div>
                <p className="text-xs text-[var(--clay-muted)] leading-relaxed mb-2.5">
                  {fa.reason}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[var(--clay-border)] text-[11px] font-bold text-[#FF7A59] flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{fa.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* 2. The 7 Institutional Success Indicators */}
      <ClayCard className="p-6 border-2 border-[var(--clay-border)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[var(--clay-text)]">
              Your 7 Success Indicators
            </h3>
            <p className="text-xs text-[var(--clay-muted)] mt-0.5">
              Identical indicators tracked by faculty mentors and campus leadership (100 pts total).
            </p>
          </div>
          <ClayBadge variant="teal" size="sm">
            100% Transparent
          </ClayBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dossier.indicators.map((ind) => {
            const pct = (ind.score / ind.max_weight) * 100;
            return (
              <div
                key={ind.key}
                className="p-4 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[var(--clay-pressed)] flex items-center justify-center">
                        {getIcon(ind.key)}
                      </div>
                      <span className="font-heading font-bold text-xs text-[var(--clay-text)]">
                        {ind.name}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-extrabold text-sm text-[var(--clay-text)]">
                        {ind.score.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--clay-muted)]">
                        /{ind.max_weight} pts
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[var(--clay-pressed)] overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct >= 75
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                          : pct >= 50
                          ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                          : 'bg-gradient-to-r from-rose-400 to-[#FF7A59]'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[var(--clay-muted)] leading-relaxed">
                    {ind.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--clay-border)] flex items-center justify-between text-[10px]">
                  <span className="text-[var(--clay-muted)] font-semibold">
                    Benchmarked Standing:
                  </span>
                  <span className="font-heading font-extrabold text-[var(--clay-text)]">
                    {ind.benchmark}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ClayCard>
    </div>
  );
}
