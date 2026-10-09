'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  CheckCircle2,
  Lock,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import {
  StudentAnonymousFeedback,
  submitAnonymousFeedback,
} from '@/lib/data/student-portal';

export function AnonymousFeedbackForm() {
  const [category, setCategory] = useState<StudentAnonymousFeedback['category']>('Labs & Computing');
  const [severity, setSeverity] = useState<StudentAnonymousFeedback['severity']>('moderate');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setLoading(true);
    const result = await submitAnonymousFeedback({
      category,
      severity,
      details: details.trim(),
    });
    setLoading(false);
    setSubmittedToken(result.anonymousToken);
    setDetails('');
  };

  return (
    <ClayCard className="p-6 sm:p-8 border-2 border-[var(--clay-border)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-[#5B6CFF]/10 text-[#5B6CFF] flex items-center justify-center font-bold">
              <Lock className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[var(--clay-text)]">
              Anonymous Student Voice & Grievance Portal
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--clay-muted)]">
            Encountering obstacles in labs, lecture pacing, campus facilities, or stress? Share your voice with complete anonymity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClayBadge variant="indigo" size="sm" icon={<Lock className="h-3 w-3" />}>
            100% Cryptographically Disassociated
          </ClayBadge>
        </div>
      </div>

      {submittedToken ? (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 text-center animate-in zoom-in-95 duration-200">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-[var(--shadow-clay-btn)]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="font-heading font-extrabold text-lg text-[var(--clay-text)]">
            Feedback Securely Transmitted
          </h4>
          <p className="text-xs text-[var(--clay-muted)] max-w-md mx-auto mt-1 mb-4 leading-relaxed">
            Your grievance was dispatched directly to the Dean of Academics and Student Well-being Cell. No student identification or metadata was attached.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] mb-4">
            <span className="text-[11px] font-bold text-[var(--clay-muted)]">Anonymous Reference Key:</span>
            <span className="font-mono font-extrabold text-emerald-600 tracking-wider">
              {submittedToken}
            </span>
          </div>

          <div>
            <button
              onClick={() => setSubmittedToken(null)}
              className="text-xs font-heading font-bold text-[#FF7A59] hover:underline"
            >
              Submit another anonymous note
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider mb-2">
                Problem Domain / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--clay-card)] border-2 border-[var(--clay-border)] text-xs font-heading font-bold text-[var(--clay-text)] shadow-[var(--shadow-clay-btn)] focus:outline-none focus:border-[#5B6CFF]"
              >
                <option value="Teaching & Academics">Teaching & Academics (Lecture Pacing, Doubts)</option>
                <option value="Labs & Computing">Labs & Computing (Hardware, Internet, IDEs)</option>
                <option value="Hostel & Wi-Fi">Hostel & Wi-Fi Facilities</option>
                <option value="Exam Pacing">Exam Pacing & Assignment Clashes</option>
                <option value="Mental Well-being">Mental Well-being & Academic Pressure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider mb-2">
                Perceived Severity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'moderate', 'high', 'critical'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`py-2 rounded-xl text-xs font-heading font-extrabold capitalize transition-all border ${
                      severity === s
                        ? s === 'critical'
                          ? 'bg-rose-500 text-white border-rose-600 shadow-[var(--shadow-clay-btn)]'
                          : s === 'high'
                          ? 'bg-[#FF7A59] text-white border-[#E05F3F] shadow-[var(--shadow-clay-coral)]'
                          : s === 'moderate'
                          ? 'bg-[#FFC857] text-zinc-900 border-amber-400 shadow-[var(--shadow-clay-btn)]'
                          : 'bg-[#2EC4B6] text-white border-teal-600 shadow-[var(--shadow-clay-btn)]'
                        : 'bg-[var(--clay-card)] text-[var(--clay-muted)] border-[var(--clay-border)] hover:bg-[var(--clay-pressed)]/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider mb-2">
              Specific Problem Description
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the problem, location, or course context constructively (e.g. 'Lab 3 terminals row 4 keep dropping connection during timed tests...')"
              className="w-full p-4 rounded-2xl bg-[var(--clay-card)] border-2 border-[var(--clay-border)] text-xs text-[var(--clay-text)] placeholder-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)] focus:outline-none focus:border-[#5B6CFF]"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-[var(--clay-muted)]">
              <Info className="h-4 w-4 text-[#5B6CFF] flex-shrink-0" />
              <span>Zero trace guarantee: Headers and device IP stripped before storage.</span>
            </div>

            <ClayButton
              type="submit"
              variant="coral"
              size="md"
              disabled={loading || !details.trim()}
              className="sm:w-auto w-full"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Submitting Securely...' : 'Submit Anonymous Note'}</span>
            </ClayButton>
          </div>
        </form>
      )}
    </ClayCard>
  );
}
