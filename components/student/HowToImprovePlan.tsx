'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Laptop,
  BookOpen,
  Trophy,
  Briefcase,
  ArrowRight,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import {
  DetailedStudentDossier,
  StudentImprovementAction,
} from '@/lib/data/student-portal';

interface HowToImprovePlanProps {
  dossier: DetailedStudentDossier;
  actions: StudentImprovementAction[];
}

export function HowToImprovePlan({ dossier, actions }: HowToImprovePlanProps) {
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>(['act-att-1', 'act-lms-1']);

  const toggleAction = (id: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate live projected gain
  const totalGain = actions
    .filter((a) => selectedActionIds.includes(a.id))
    .reduce((sum, a) => sum + a.pointsGain, 0);

  const projectedScore = Math.min(100, dossier.success_score + totalGain);
  const totalEffortHours = actions
    .filter((a) => selectedActionIds.includes(a.id))
    .reduce((sum, a) => sum + a.effortHours, 0);

  return (
    <ClayCard className="p-6 sm:p-8 border-2 border-[var(--clay-border)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[var(--clay-text)]">
              "How to Improve" High-ROI Action Plan
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--clay-muted)]">
            Algorithmic sensitivity analysis: rank-ordered by <span className="font-bold text-[var(--clay-text)]">maximum points gained for the least required effort</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClayBadge variant="sun" size="sm" icon={<Flame className="h-3 w-3" />}>
            Marginal Gains Engine
          </ClayBadge>
          <ClayBadge variant="teal" size="sm">
            Zero Guesswork
          </ClayBadge>
        </div>
      </div>

      {/* Live Interactive Projection Banner */}
      <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-[var(--clay-card)] via-[var(--clay-pressed)]/50 to-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2EC4B6] to-[#1BA89A] flex items-center justify-center text-white shadow-[var(--shadow-clay-btn)] flex-shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                Simulated Score Projection
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-heading font-extrabold text-[var(--clay-muted)] line-through">
                  {dossier.success_score.toFixed(1)}
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--clay-muted)]" />
                <span className="text-3xl font-heading font-extrabold text-emerald-600">
                  {projectedScore.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  +{totalGain.toFixed(1)} pts
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase block">
                Selected Actions
              </span>
              <span className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                {selectedActionIds.length} of {actions.length}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase block">
                Est. Time Required
              </span>
              <span className="font-heading font-extrabold text-base text-[#5B6CFF]">
                ~{totalEffortHours.toFixed(1)} hrs
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase block">
                Efficiency Ratio
              </span>
              <span className="font-heading font-extrabold text-base text-[#FF7A59]">
                {totalEffortHours > 0 ? (totalGain / totalEffortHours).toFixed(2) : '0'} pts/hr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3.5">
        {actions.map((act) => {
          const isSelected = selectedActionIds.includes(act.id);
          return (
            <div
              key={act.id}
              onClick={() => toggleAction(act.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-[var(--clay-card)] border-[#2EC4B6] shadow-[var(--shadow-clay-card-hover)] ring-2 ring-[#2EC4B6]/20'
                  : 'bg-[var(--clay-card)] border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] opacity-85 hover:opacity-100 hover:border-[var(--clay-muted)]'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  aria-label="Toggle action"
                  className={`mt-0.5 h-6 w-6 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#2EC4B6] text-white shadow-[var(--shadow-clay-btn)]'
                      : 'border-2 border-[var(--clay-border)] bg-[var(--clay-pressed)] text-transparent'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-heading font-extrabold text-sm sm:text-base text-[var(--clay-text)]">
                      {act.title}
                    </span>
                    <ClayBadge
                      variant={act.effortLevel === 'Low' ? 'teal' : act.effortLevel === 'Medium' ? 'sun' : 'coral'}
                      size="sm"
                    >
                      {act.badgeText}
                    </ClayBadge>
                    <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase bg-[var(--clay-pressed)] px-2 py-0.5 rounded-lg border border-[var(--clay-border)]">
                      {act.category}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--clay-muted)] leading-relaxed mb-2">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--clay-text)]">
                    <span className="flex items-center gap-1 text-[var(--clay-muted)]">
                      <Clock className="h-3 w-3 text-[#5B6CFF]" />
                      Effort: ~{act.effortHours} hrs ({act.effortLevel} effort)
                    </span>
                    <span className="text-[#FF7A59]">
                      • Specific Next Step: {act.actionText}
                    </span>
                  </div>
                </div>
              </div>

              {/* ROI & Points Metric Pill */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--clay-border)] flex-shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                    Point Yield
                  </span>
                  <span className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-600 block">
                    +{act.pointsGain.toFixed(1)} pts
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--clay-muted)] sm:mt-1">
                  Ratio: {act.roiRatio.toFixed(2)} pts/hr
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ClayCard>
  );
}
