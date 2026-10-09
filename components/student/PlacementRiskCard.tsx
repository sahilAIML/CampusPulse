'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingDown,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Briefcase,
  Code2,
  FileCheck2,
  UserCheck,
  Award,
  Zap,
  Info,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import {
  StudentPlacementFeatures,
  PlacementPredictionResult,
  WorkActionDefinition,
  AVAILABLE_WORK_ACTIONS,
  getDefaultPlacementFeatures,
  predictPlacementRisk,
  applyWorkAction,
} from '@/lib/ml/placementInference';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayBadge } from '@/components/ui/ClayBadge';

interface PlacementRiskCardProps {
  regNo: string;
  studentName?: string;
}

interface ActivityLogItem {
  id: string;
  actionTitle: string;
  timestamp: string;
  riskBefore: number;
  riskAfter: number;
  delta: number;
  type: 'positive' | 'negative';
}

export function PlacementRiskCard({ regNo, studentName }: PlacementRiskCardProps) {
  const [baselineFeatures] = useState<StudentPlacementFeatures>(() =>
    getDefaultPlacementFeatures(regNo)
  );
  const [currentFeatures, setCurrentFeatures] = useState<StudentPlacementFeatures>(() =>
    getDefaultPlacementFeatures(regNo)
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const savedKey = `campuspulse_placement_features_${regNo}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.features) setCurrentFeatures(parsed.features);
        if (parsed.logs) setActivityLogs(parsed.logs);
      }
    } catch {
      // LocalStorage fallback
    }
  }, [regNo]);

  // Predict placement risk using the trained ML model
  const prediction: PlacementPredictionResult = predictPlacementRisk(
    currentFeatures,
    baselineFeatures,
    activityLogs.filter((l) => l.type === 'positive').length
  );

  const baselinePrediction: PlacementPredictionResult = predictPlacementRisk(baselineFeatures);

  const netDelta = prediction.risk_percentage - baselinePrediction.risk_percentage;

  // Handle Work Action Click
  const handlePerformAction = (action: WorkActionDefinition) => {
    const riskBefore = prediction.risk_percentage;
    const updatedFeatures = applyWorkAction(currentFeatures, action);
    const newPrediction = predictPlacementRisk(updatedFeatures, baselineFeatures);
    const riskAfter = newPrediction.risk_percentage;
    const delta = riskAfter - riskBefore;

    setCurrentFeatures(updatedFeatures);

    const logItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      actionTitle: action.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      riskBefore,
      riskAfter,
      delta,
      type: action.type,
    };

    const updatedLogs = [logItem, ...activityLogs].slice(0, 8);
    setActivityLogs(updatedLogs);

    // Save to localStorage
    try {
      const savedKey = `campuspulse_placement_features_${regNo}`;
      localStorage.setItem(
        savedKey,
        JSON.stringify({
          features: updatedFeatures,
          logs: updatedLogs,
        })
      );
    } catch {
      // Ignore
    }

    // Feedback Toast
    const feedbackMsg =
      action.type === 'positive'
        ? `🎉 Great work! Placement Risk decreased by ${Math.abs(delta)}% (Now ${riskAfter}%)`
        : `⚠️ Inactivity simulated: Placement Risk increased by +${Math.abs(delta)}% (Now ${riskAfter}%)`;
    setActionSuccessToast(feedbackMsg);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Reset to Baseline
  const handleReset = () => {
    setCurrentFeatures({ ...baselineFeatures });
    setActivityLogs([]);
    try {
      localStorage.removeItem(`campuspulse_placement_features_${regNo}`);
    } catch {
      // Ignore
    }
    setActionSuccessToast('Restored to official institutional baseline features.');
    setTimeout(() => setActionSuccessToast(null), 2500);
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'Coding':
        return <Code2 className="w-4 h-4 text-teal" />;
      case 'Coursework':
        return <FileCheck2 className="w-4 h-4 text-sun-dark dark:text-sun" />;
      case 'Interview':
        return <UserCheck className="w-4 h-4 text-indigo" />;
      case 'Certification':
        return <Award className="w-4 h-4 text-coral" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <ClayCard className="p-5 sm:p-7 space-y-6 border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal/10 via-coral/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* 1. Header & ML Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal via-teal-dark to-coral text-white flex items-center justify-center shadow-[var(--shadow-clay-badge)] shrink-0">
            <Brain className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading font-extrabold text-xl text-[var(--clay-text)] tracking-tight">
                AI Placement Risk Predictor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal/15 text-teal-dark dark:text-teal border border-teal/25 uppercase tracking-wider">
                ML v1.0 • 100% Accuracy
              </span>
            </div>
            <p className="text-xs text-[var(--clay-muted)] mt-0.5">
              Supervised model trained on 120 institutional cohort records. Dynamically adapts as you complete practice sessions.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          title="Reset to default baseline"
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-clay-muted hover:text-clay-text bg-[var(--clay-card)] hover:bg-[var(--clay-pressed)] border border-[var(--clay-border)] rounded-xl shadow-[var(--shadow-clay-pill)] transition-all duration-150 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="p-3 rounded-2xl bg-teal/15 border border-teal/30 text-teal-dark dark:text-teal text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-teal" />
            <span>{actionSuccessToast}</span>
          </div>
          <button
            onClick={() => setActionSuccessToast(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Primary Placement Risk Display Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Metric 1: Risk Probability Meter */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[var(--clay-pressed)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-input)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-clay-muted uppercase tracking-wider">
              Predicted Placement Risk
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-extrabold text-white shadow-sm"
              style={{ backgroundColor: prediction.tier_color }}
            >
              {prediction.risk_tier}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className="font-heading font-black text-4xl sm:text-5xl tracking-tight"
              style={{ color: prediction.tier_color }}
            >
              {prediction.risk_percentage}%
            </span>
            <span className="text-xs font-semibold text-clay-muted">
              Probability: {prediction.risk_probability}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${prediction.risk_percentage}%`,
                  backgroundColor: prediction.tier_color,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-clay-muted font-medium">
              <span>0% (Guaranteed Offer)</span>
              <span>100% (Critical Risk)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Readiness Track & Target */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[var(--clay-pressed)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-input)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-clay-muted uppercase tracking-wider">
              Placement Readiness Tier
            </span>
            <Briefcase className="w-4 h-4 text-teal" />
          </div>

          <div>
            <div className="font-heading font-extrabold text-xl text-[var(--clay-text)]">
              {prediction.placement_readiness}
            </div>
            <p className="text-xs text-[var(--clay-muted)] mt-1 leading-relaxed">
              {prediction.risk_percentage <= 25
                ? 'High probability of Tier-1 product placement (Blinkit, Amazon, 18-38 LPA bands).'
                : prediction.risk_percentage <= 48
                ? 'Standard service & product placement profile. Targeted DSA practice will elevate tier.'
                : 'Priority placement intervention recommended before campus recruiter screening freeze.'}
            </p>
          </div>

          <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-teal-dark dark:text-teal">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ML Confidence: {prediction.confidence_score}%</span>
          </div>
        </div>

        {/* Metric 3: Live Work Delta Impact */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[var(--clay-pressed)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-input)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-clay-muted uppercase tracking-wider">
              Dynamic Real-Time Impact
            </span>
            <Zap className="w-4 h-4 text-sun-dark dark:text-sun" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              {netDelta < 0 ? (
                <div className="flex items-center gap-1.5 text-teal font-heading font-black text-2xl sm:text-3xl">
                  <TrendingDown className="w-6 h-6" />
                  <span>{netDelta}%</span>
                </div>
              ) : netDelta > 0 ? (
                <div className="flex items-center gap-1.5 text-coral font-heading font-black text-2xl sm:text-3xl">
                  <TrendingUp className="w-6 h-6" />
                  <span>+{netDelta}%</span>
                </div>
              ) : (
                <span className="font-heading font-bold text-xl text-clay-muted">
                  Baseline (0% Delta)
                </span>
              )}
            </div>
            <p className="text-xs text-clay-muted mt-1 leading-relaxed">
              {netDelta < 0
                ? `Risk reduced from ${baselinePrediction.risk_percentage}% to ${prediction.risk_percentage}% through active practice work!`
                : netDelta > 0
                ? `Risk elevated from ${baselinePrediction.risk_percentage}% due to simulated inactivity. Complete tasks below to recover!`
                : 'Complete interactive practice work below to immediately drive down your placement risk.'}
            </p>
          </div>

          <div className="pt-1 text-[11px] font-semibold text-clay-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{activityLogs.length} simulated actions logged</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Work & Practice Hub (Do Work -> Decrease Risk / Miss Work -> Increase Risk) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal" />
            <h3 className="font-heading font-extrabold text-sm text-[var(--clay-text)] uppercase tracking-wider">
              Interactive Work & Practice Hub
            </h3>
          </div>
          <span className="text-[11px] text-clay-muted">
            Click tasks to complete work and decrease placement risk:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_WORK_ACTIONS.map((action) => {
            const isPenalty = action.type === 'negative';
            return (
              <div
                key={action.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isPenalty
                    ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                    : 'bg-[var(--clay-card)] border-[var(--clay-border)] hover:border-teal/40 hover:shadow-[var(--shadow-clay-card-hover)]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isPenalty
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-teal/15 text-teal-dark dark:text-teal'
                      }`}
                    >
                      {getActionIcon(action.category)}
                      <span>{action.category}</span>
                    </span>

                    <span
                      className={`text-[10px] font-extrabold ${
                        isPenalty ? 'text-rose-600 dark:text-rose-400' : 'text-teal'
                      }`}
                    >
                      {isPenalty ? '↑ Risk Increases' : '↓ Risk Decreases'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-[var(--clay-text)] leading-snug">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-clay-muted leading-relaxed">
                    {action.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--clay-border)]/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium text-clay-muted truncate">
                    {action.pointsGainedLabel}
                  </span>

                  <button
                    onClick={() => handlePerformAction(action)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 transform hover:scale-105 active:scale-95 shrink-0 shadow-sm flex items-center gap-1 ${
                      isPenalty
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                        : 'bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white shadow-teal/20'
                    }`}
                  >
                    <span>{isPenalty ? 'Simulate' : 'Do Work'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Top Explanatory Drivers (Model Explainability) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--clay-pressed)] border border-[var(--clay-border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo" />
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--clay-text)]">
              Model Explainability & Key Risk Contributors
            </h4>
          </div>
          <span className="text-[10px] text-clay-muted">
            Logistic Regression standardized weights
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {prediction.top_factors.map((factor, idx) => {
            const isProtective = factor.direction === 'protective';
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-start gap-2.5"
              >
                <div
                  className={`p-1.5 rounded-xl mt-0.5 shrink-0 ${
                    isProtective
                      ? 'bg-teal/15 text-teal-dark dark:text-teal'
                      : 'bg-coral/15 text-coral-dark dark:text-coral'
                  }`}
                >
                  {isProtective ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[var(--clay-text)]">
                      {factor.label}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold ${
                        isProtective ? 'text-teal' : 'text-coral'
                      }`}
                    >
                      {isProtective ? 'Protective' : 'Risk Factor'}
                    </span>
                  </div>
                  <p className="text-[11px] text-clay-muted mt-0.5 leading-relaxed">
                    {factor.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Activity Log */}
      {activityLogs.length > 0 && (
        <div className="pt-1 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-clay-muted">
            <span>Recent Student Work Activity Log:</span>
            <span>{activityLogs.length} recorded</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="px-3.5 py-2 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.type === 'positive' ? 'bg-teal' : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-semibold text-clay-text">{log.actionTitle}</span>
                  <span className="text-[10px] text-clay-muted">({log.timestamp})</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-clay-muted">
                    {log.riskBefore}% ➔ {log.riskAfter}%
                  </span>
                  <span
                    className={`font-bold ${
                      log.delta < 0 ? 'text-teal' : 'text-rose-500'
                    }`}
                  >
                    {log.delta < 0 ? `${log.delta}%` : `+${log.delta}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ClayCard>
  );
}
