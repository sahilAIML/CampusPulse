'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Zap,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';

interface GuidedStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidedStoryModal({ isOpen, onClose }: GuidedStoryModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [interventionAssigned, setInterventionAssigned] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(36.2);
  const [animatedRisk, setAnimatedRisk] = useState(0.99);
  const [animatedAtt, setAnimatedAtt] = useState(61.2);
  const [animatedBacklogs, setAnimatedBacklogs] = useState(5);

  useEffect(() => {
    if (step === 4) {
      setIsRecovering(true);
      // Animate score recovery over 2 seconds
      const startTime = Date.now();
      const duration = 2000;
      const initialScore = 36.2;
      const targetScore = 68.5;
      const initialRisk = 0.99;
      const targetRisk = 0.28;
      const initialAtt = 61.2;
      const targetAtt = 78.4;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const ease = 1 - (1 - progress) * (1 - progress);

        setAnimatedScore(initialScore + (targetScore - initialScore) * ease);
        setAnimatedRisk(initialRisk - (initialRisk - targetRisk) * ease);
        setAnimatedAtt(initialAtt + (targetAtt - initialAtt) * ease);

        if (progress >= 0.5) {
          setAnimatedBacklogs(2); // backlogs reduced
        }

        if (progress >= 1) {
          clearInterval(timer);
          setIsRecovering(false);
        }
      }, 50);

      return () => clearInterval(timer);
    } else {
      setAnimatedScore(36.2);
      setAnimatedRisk(0.99);
      setAnimatedAtt(61.2);
      setAnimatedBacklogs(5);
    }
  }, [step]);

  if (!isOpen) return null;

  const resetStory = () => {
    setStep(1);
    setInterventionAssigned(false);
    setAnimatedScore(36.2);
    setAnimatedRisk(0.99);
    setAnimatedAtt(61.2);
    setAnimatedBacklogs(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-[36px] bg-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card-hover)] p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close guided story"
          className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-center text-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)] hover:text-[var(--clay-text)] active:scale-95 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Story Stepper Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-[#FF7A59] text-white flex items-center justify-center shadow-[var(--shadow-clay-coral)]">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#FF7A59] block">
                Guided Interactive Demo Experience
              </span>
              <h3 className="text-xl font-heading font-extrabold text-[var(--clay-text)]">
                The At-Risk Recovery Journey
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { num: 1, label: '1. Discover At-Risk' },
              { num: 2, label: '2. Explainability' },
              { num: 3, label: '3. Assign Intervention' },
              { num: 4, label: '4. Watch Score Recover' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl font-heading font-bold transition-all border ${
                  step === s.num
                    ? 'bg-[#FF7A59] text-white border-[#E05F3F] shadow-[var(--shadow-clay-coral)]'
                    : step > s.num
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-[var(--clay-pressed)] text-[var(--clay-muted)] border-[var(--clay-border)]'
                }`}
              >
                <span className="block text-[11px] truncate">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* STEP 1: FIND AT-RISK STUDENT */}
        {/* ------------------------------------------------------------------ */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-extrabold text-rose-600 uppercase tracking-wider">
                  Target Student Identified by Early-Warning Engine
                </span>
                <ClayBadge variant="coral" size="sm">
                  Risk Index: 0.99 (Critical)
                </ClayBadge>
              </div>
              <h4 className="font-heading font-extrabold text-lg text-[var(--clay-text)]">
                SAGAR • Roll No: 241FA04070 (Section B)
              </h4>
              <p className="text-xs text-[var(--clay-muted)] mt-1">
                Caught 4 weeks before mid-terms through biometric attendance drops and LMS inactivity patterns.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
                <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase block">Success Score</span>
                <span className="text-xl font-heading font-extrabold text-rose-500">36.2 / 100</span>
                <span className="text-[10px] text-[var(--clay-muted)] block">Lowest in Section B</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
                <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase block">Attendance</span>
                <span className="text-xl font-heading font-extrabold text-rose-500">61.2%</span>
                <span className="text-[10px] text-rose-500 font-bold block">Hard Flag &lt;75%</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
                <span className="text-[10px] font-bold text-[var(--clay-muted)] uppercase block">Backlogs</span>
                <span className="text-xl font-heading font-extrabold text-rose-500">5 Arrears</span>
                <span className="text-[10px] text-[var(--clay-muted)] block">-15 pt penalty</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--clay-border)] flex justify-end">
              <ClayButton variant="coral" size="md" onClick={() => setStep(2)}>
                <span>Deep-Dive Explainability</span>
                <ArrowRight className="h-4 w-4" />
              </ClayButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 2: EXPLAINABILITY BREAKDOWN */}
        {/* ------------------------------------------------------------------ */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--clay-pressed)]/60 border border-[var(--clay-border)]">
              <h4 className="font-heading font-extrabold text-sm text-[var(--clay-text)] mb-1">
                "Why This Score?" (Mathematical Indicator Waterfall)
              </h4>
              <p className="text-xs text-[var(--clay-muted)] leading-relaxed">
                CampusPulse uses zero black-box calculations. Every point drop corresponds to specific institutional thresholds.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-[var(--clay-text)] block">
                    1. Arrear Penalty (-15.0 pts)
                  </span>
                  <span className="text-[11px] text-[var(--clay-muted)]">
                    5 backlogs × 20% penalty applied to academic weight (30 pts $\rightarrow$ 8.5 pts).
                  </span>
                </div>
                <span className="font-mono font-extrabold text-rose-500">-15.0</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-[var(--clay-text)] block">
                    2. Biometric Attendance Violation (-11.0 pts)
                  </span>
                  <span className="text-[11px] text-[var(--clay-muted)]">
                    61.2% triggers statutory exam debarment rule (&lt; 75%).
                  </span>
                </div>
                <span className="font-mono font-extrabold text-rose-500">-11.0</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-[var(--clay-text)] block">
                    3. LMS Assignment Non-Submission (-6.5 pts)
                  </span>
                  <span className="text-[11px] text-[var(--clay-muted)]">
                    Only 5 logins in 30 days; 6 labs pending in Data Structures.
                  </span>
                </div>
                <span className="font-mono font-extrabold text-rose-500">-6.5</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--clay-border)] flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)]"
              >
                ← Back
              </button>
              <ClayButton variant="coral" size="md" onClick={() => setStep(3)}>
                <span>Prescribe Targeted Intervention</span>
                <ArrowRight className="h-4 w-4" />
              </ClayButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 3: ASSIGN INTERVENTION */}
        {/* ------------------------------------------------------------------ */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/20">
              <span className="text-xs font-heading font-extrabold text-amber-600 uppercase tracking-wider block mb-1">
                Prescriptive Decision Intelligence
              </span>
              <p className="text-xs text-[var(--clay-muted)]">
                Assigning institutional resources directly linked to root causes identified in the waterfall.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
                <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                  Action 1: Remedial Saturday Tutoring
                </span>
                <span className="text-xs font-heading font-extrabold text-[var(--clay-text)] block mt-0.5">
                  DSA & Signals Remedial Clinic (Lab 304 with Dr. Ananya Sharma)
                </span>
                <span className="text-[11px] text-[#2EC4B6] font-semibold block mt-0.5">
                  Targets clearing 2 backlogs $\rightarrow$ +5.8 points gain
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)]">
                <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                  Action 2: Biometric Attendance Buddy
                </span>
                <span className="text-xs font-heading font-extrabold text-[var(--clay-text)] block mt-0.5">
                  Paired with Peer Topper Kunal Deshmukh for morning check-ins
                </span>
                <span className="text-[11px] text-[#2EC4B6] font-semibold block mt-0.5">
                  Targets crossing 75% boundary $\rightarrow$ +6.5 points gain
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--clay-border)] flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)]"
              >
                ← Back
              </button>
              <ClayButton
                variant="coral"
                size="md"
                onClick={() => {
                  setInterventionAssigned(true);
                  setStep(4);
                }}
              >
                <HeartHandshake className="h-4 w-4" />
                <span>Deploy Intervention & Watch Score Recover</span>
              </ClayButton>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 4: WATCH THE SCORE RECOVER */}
        {/* ------------------------------------------------------------------ */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-center">
              <ClayBadge variant="teal" size="sm" icon={<Award className="h-3 w-3" />}>
                4-Week Post-Intervention Recompute
              </ClayBadge>
              <h4 className="font-heading font-extrabold text-xl text-[var(--clay-text)] mt-1.5">
                🎉 Significant Student Turnaround Achieved!
              </h4>
              <p className="text-xs text-[var(--clay-muted)] max-w-md mx-auto mt-1">
                Remedial clinics attended, arrears reduced, and biometric attendance cleared the safe 75% statutory norm.
              </p>
            </div>

            {/* Live Animated Metric Gauges */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-3xl bg-[var(--clay-card)] border-2 border-emerald-500/40 shadow-[var(--shadow-clay-card)]">
                <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                  Success Score
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600">
                    {animatedScore.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-[var(--clay-muted)]">/100</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                  +32.3 pts Gain 🚀
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-[var(--clay-card)] border-2 border-emerald-500/40 shadow-[var(--shadow-clay-card)]">
                <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                  Attendance
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600">
                    {animatedAtt.toFixed(1)}%
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                  Safe Tier Unlocked ✅
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-[var(--clay-card)] border-2 border-emerald-500/40 shadow-[var(--shadow-clay-card)]">
                <span className="text-[10px] font-heading font-bold text-[var(--clay-muted)] uppercase block">
                  Risk Level
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600">
                    {animatedRisk.toFixed(2)}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                  Low Risk (Safe)
                </span>
              </div>
            </div>

            {/* Segment Transition Pill */}
            <div className="p-3.5 rounded-2xl bg-[var(--clay-pressed)] border border-[var(--clay-border)] flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-[var(--clay-muted)]">
                Behavioral Segment Re-Classification:
              </span>
              <div className="flex items-center gap-2 font-heading font-extrabold">
                <span className="text-rose-500 line-through">Struggling Starter</span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--clay-muted)]" />
                <span className="text-emerald-600">Steady Striver</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--clay-border)] flex items-center justify-between">
              <button
                onClick={resetStory}
                className="text-xs font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)] flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Replay Story</span>
              </button>
              <ClayButton variant="coral" size="md" onClick={onClose}>
                <span>Complete Demonstration</span>
              </ClayButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
