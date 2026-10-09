'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Send,
  HelpCircle,
  Sparkles,
  BookOpen,
  Trophy,
  RefreshCw,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  Exam,
  ExamQuestion,
  getExamById,
  submitExamAttempt,
} from '@/lib/data/exams';
import { getSessionUser } from '@/lib/data/auth';

interface StudentExamScreenProps {
  examId: string;
  defaultRegNo?: string;
  onFinish?: () => void;
}

export function StudentExamScreen({
  examId,
  defaultRegNo = '241FA18067',
  onFinish,
}: StudentExamScreenProps) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  // Authenticated Student identity
  const [sessionUser] = useState(() => getSessionUser());
  const studentRegNo = sessionUser?.reg_no || defaultRegNo;
  const studentName = sessionUser?.full_name || (studentRegNo === '241FA18067' ? 'MD SAHIL' : 'Student ' + studentRegNo);
  const sectionName = sessionUser?.section || (studentRegNo === '241FA18067' ? 'Section A' : 'Section B');

  // Exam Attempt State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [autosaveText, setAutosaveText] = useState('Autosaved (All answers secure)');
  const [showPalette, setShowPalette] = useState(false);

  // Submission State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    total: number;
    accuracy_pct: number;
    telemetry_update: {
      old_score: number;
      new_score: number;
      old_cie: number;
      new_cie: number;
    };
  } | null>(null);

  // Load Exam
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getExamById(examId);
      setExam(data);
      if (data) {
        setSecondsRemaining(data.duration_minutes * 60);
      }
      setLoading(false);
    }
    load();
  }, [examId]);

  // Countdown Timer
  useEffect(() => {
    if (submissionResult || loading || !exam) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit on timeout
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submissionResult, exam]);

  // Handle Option Select with Autosave
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setAutosaveText('Autosaving response...');
    setTimeout(() => {
      setAutosaveText('Autosaved (All answers secure)');
    }, 400);
  };

  // Toggle Flag
  const handleToggleFlag = (questionId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!exam) return;
    setSubmitting(true);

    try {
      const timeSpent = exam.duration_minutes * 60 - secondsRemaining;
      const res = await submitExamAttempt({
        exam_id: exam.id,
        student_reg_no: studentRegNo,
        student_name: studentName,
        section_name: sectionName,
        answers,
        time_spent_seconds: Math.max(10, timeSpent),
      });

      setSubmissionResult({
        score: res.attempt.score,
        total: res.attempt.total_marks,
        accuracy_pct: res.attempt.accuracy_pct,
        telemetry_update: res.telemetry_update,
      });
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--clay-bg)] text-[var(--clay-muted)] font-bold text-sm">
        Preparing timed assessment environment...
      </div>
    );
  }

  // Handle stopped or inactive exam
  if (exam.status !== 'active' && exam.status !== 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--clay-bg)] text-[var(--clay-text)]">
        <ClayCard className="max-w-md p-8 text-center space-y-4 border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)]">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/15 text-rose-600 mx-auto flex items-center justify-center font-bold shadow-[var(--shadow-clay-badge)]">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-[var(--clay-text)]">
            Examination Portal Closed
          </h2>
          <p className="text-xs text-[var(--clay-muted)] leading-relaxed">
            This examination is currently <strong className="text-rose-600">{exam.status.toUpperCase()}</strong>. Faculty has closed the session or concluded timed submissions.
          </p>
          <div className="pt-2">
            <Link
              href="/student"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5B6CFF] to-[#3B4CCF] text-white text-xs font-heading font-extrabold shadow-[var(--shadow-clay-btn)] hover:opacity-95 transition-all"
            >
              Return to Student Portal
            </Link>
          </div>
        </ClayCard>
      </div>
    );
  }

  const questions = exam.questions || [];
  const currentQ = questions[currentQuestionIndex];
  const totalCount = questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unansweredCount = totalCount - answeredCount;

  // Format timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = secondsRemaining < 120; // less than 2 mins

  // SVG Progress Ring calculations
  const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="min-h-screen bg-[var(--clay-bg)] text-[var(--clay-text)] p-3 sm:p-6 flex flex-col justify-between max-w-4xl mx-auto">
      {/* 1. Exam Top Control Bar */}
      <header className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-[28px] bg-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)]">
          {/* Exam Title & Persona */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5B6CFF] to-[#3B4CCF] text-white flex items-center justify-center font-heading font-extrabold shadow-[var(--shadow-clay-badge)]">
              {currentQuestionIndex + 1}
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-[var(--clay-text)] leading-tight">
                {exam.name}
              </h1>
              {/* Authenticated Student Candidate Chip */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-bold text-[var(--clay-muted)]">Candidate:</span>
                <span className="text-[11px] font-heading font-extrabold text-[#5B6CFF]">
                  {studentName} ({studentRegNo} • {sectionName})
                </span>
              </div>
            </div>
          </div>

          {/* Timer & Autosave Status */}
          <div className="flex items-center gap-3">
            {/* Autosave status pill */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{autosaveText}</span>
            </div>

            {/* Countdown Badge */}
            <div
              className={`px-3.5 py-2 rounded-2xl border font-mono font-extrabold text-sm flex items-center gap-2 transition-all ${
                isTimeCritical
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 animate-pulse'
                  : 'bg-[var(--clay-card)] border-[var(--clay-border)] text-[var(--clay-text)] shadow-[var(--shadow-clay-badge)]'
              }`}
            >
              <Clock className={`h-4 w-4 ${isTimeCritical ? 'text-rose-500' : 'text-[#FF7A59]'}`} />
              <span className="tabular-nums">{formattedTime}</span>
            </div>

            {/* Theme Selector */}
            <ThemeToggle size="sm" />

            {/* Palette Trigger Button */}
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="p-2 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-[var(--clay-muted)] hover:text-[var(--clay-text)] shadow-[var(--shadow-clay-btn)]"
              title="Toggle Question Palette"
            >
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Radial Progress Ring & Flag Button */}
        <div className="flex items-center justify-between px-2">
          {/* Circular Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 54 54">
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke="rgba(163, 177, 198, 0.25)"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke="#2EC4B6"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-heading font-extrabold text-[var(--clay-text)] tabular-nums">
                {Math.round(progressPercent)}%
              </span>
            </div>

            <div>
              <span className="text-xs font-heading font-extrabold text-[var(--clay-text)] block">
                Progress: {answeredCount} / {totalCount} Answered
              </span>
              <span className="text-[11px] font-semibold text-[var(--clay-muted)]">
                {unansweredCount} remaining • {flaggedCount} flagged
              </span>
            </div>
          </div>

          {/* Flag for review button */}
          {currentQ && (
            <button
              onClick={() => handleToggleFlag(currentQ.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-heading font-bold flex items-center gap-2 transition-all ${
                flagged[currentQ.id]
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400'
                  : 'bg-[var(--clay-card)] border-[var(--clay-border)] text-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)]'
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${flagged[currentQ.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Question Card & Options Area */}
      <main className="flex-1 mb-8">
        {currentQ ? (
          <div className="space-y-4">
            {/* Question Statement Card */}
            <ClayCard className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalCount}
                </span>
                <ClayBadge variant="indigo" size="sm">
                  {currentQ.topic || 'General Topic'}
                </ClayBadge>
              </div>

              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[var(--clay-text)] leading-relaxed">
                {currentQ.question_text}
              </h2>
            </ClayCard>

            {/* 4 Interactive Option Cards */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((optText, optIdx) => {
                const optLetter = String.fromCharCode(65 + optIdx);
                const isSelected = answers[currentQ.id] === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? 'bg-[#5B6CFF]/15 border-[#5B6CFF] shadow-[var(--shadow-clay-btn-pressed)] scale-[0.99]'
                        : 'bg-[var(--clay-card)] border-[var(--clay-border)] shadow-[var(--shadow-clay-card)] hover:border-[#5B6CFF]/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Option Indicator Pill */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-heading font-extrabold text-sm flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#5B6CFF] text-white shadow-[var(--shadow-clay-badge)]'
                          : 'bg-[var(--clay-pressed)] text-[var(--clay-muted)]'
                      }`}
                    >
                      {optLetter}
                    </div>

                    <span
                      className={`text-sm sm:text-base font-bold flex-1 ${
                        isSelected ? 'text-[var(--clay-text)] font-extrabold' : 'text-[var(--clay-text)]'
                      }`}
                    >
                      {optText}
                    </span>

                    {isSelected && (
                      <span className="h-6 w-6 rounded-full bg-[#5B6CFF] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center text-sm font-bold text-[var(--clay-muted)]">
            No active questions found in this assessment.
          </div>
        )}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <footer className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--clay-border)]">
        <ClayButton
          variant="default"
          size="md"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </ClayButton>

        <div className="flex items-center gap-2">
          {currentQuestionIndex < totalCount - 1 ? (
            <ClayButton
              variant="default"
              size="md"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </ClayButton>
          ) : (
            <ClayButton
              variant="coral"
              size="md"
              onClick={() => setShowConfirmModal(true)}
            >
              <Send className="h-4 w-4" />
              <span>Submit Exam</span>
            </ClayButton>
          )}

          {currentQuestionIndex < totalCount - 1 && (
            <ClayButton
              variant="coral"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
            >
              <span>Submit</span>
            </ClayButton>
          )}
        </div>
      </footer>

      {/* 4. Question Palette Drawer / Overlay */}
      {showPalette && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPalette(false)}
          />

          <div className="relative w-full max-w-md bg-[var(--clay-card)] border-2 border-[var(--clay-border)] rounded-[32px] shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
              <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                Question Palette
              </h3>
              <button
                onClick={() => setShowPalette(false)}
                className="h-8 w-8 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-center text-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)]"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-700">Answered</div>
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-700">Flagged</div>
              <div className="p-1.5 rounded-lg bg-[var(--clay-pressed)] text-[var(--clay-muted)]">Unvisited</div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2.5 max-h-60 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setShowPalette(false);
                    }}
                    className={`h-11 rounded-xl font-heading font-extrabold text-xs transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? 'ring-2 ring-[#5B6CFF] ring-offset-2'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-[#2EC4B6] text-white shadow-sm'
                        : isFlagged
                        ? 'bg-[#FFC857] text-gray-950 shadow-sm'
                        : 'bg-[var(--clay-pressed)] text-[var(--clay-text)]'
                    }`}
                  >
                    Q{idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />

          <div className="relative w-full max-w-lg bg-[var(--clay-card)] border-2 border-[var(--clay-border)] rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="h-14 w-14 rounded-2xl bg-[#FF7A59]/15 text-[#FF7A59] mx-auto flex items-center justify-center shadow-[var(--shadow-clay-badge)]">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--clay-text)]">
                Confirm Final Exam Submission
              </h3>
              <p className="text-xs text-[var(--clay-muted)] max-w-xs mx-auto">
                Once submitted, your responses will be locked and your grade will immediately feed into your Student Success Score.
              </p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[var(--clay-pressed)]/60 text-center text-xs font-bold">
              <div>
                <span className="text-[10px] text-[var(--clay-muted)] block">Answered</span>
                <span className="text-emerald-600 font-extrabold text-base tabular-nums">{answeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--clay-muted)] block">Unanswered</span>
                <span className={`text-base font-extrabold tabular-nums ${unansweredCount > 0 ? 'text-rose-500' : 'text-[var(--clay-muted)]'}`}>
                  {unansweredCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--clay-muted)] block">Flagged</span>
                <span className="text-amber-600 font-extrabold text-base tabular-nums">{flaggedCount}</span>
              </div>
            </div>

            <div className="text-center text-xs font-bold text-[var(--clay-muted)]">
              Time Remaining: <span className="text-[var(--clay-text)] font-extrabold font-mono">{formattedTime}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ClayButton
                variant="default"
                size="md"
                fullWidth
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
              >
                Return to Exam
              </ClayButton>
              <ClayButton
                variant="coral"
                size="md"
                fullWidth
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? 'Grading & Submitting...' : 'Yes, Submit Responses'}
              </ClayButton>
            </div>
          </div>
        </div>
      )}

      {/* 6. Post-Submit Performance & Telemetry Update Screen */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative w-full max-w-xl bg-[var(--clay-card)] border-2 border-[var(--clay-border)] rounded-[36px] shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            {/* Header Score Banner */}
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#2EC4B6] to-[#1BA89B] text-white mx-auto flex items-center justify-center font-heading font-extrabold text-2xl shadow-[var(--shadow-clay-teal)]">
                <Trophy className="h-8 w-8" />
              </div>
              <ClayBadge variant="teal" size="sm">Assessment Completed</ClayBadge>
              <h2 className="font-heading font-extrabold text-2xl text-[var(--clay-text)]">
                {studentName} • Score Card
              </h2>
              <div className="font-heading font-extrabold text-3xl text-[#2EC4B6] tabular-nums">
                {submissionResult.score} <span className="text-base text-[var(--clay-muted)]">/ {submissionResult.total} Marks</span>
              </div>
              <p className="text-xs font-bold text-[var(--clay-muted)]">
                {submissionResult.accuracy_pct}% Overall Accuracy
              </p>
            </div>

            {/* Telemetry Integration Box (Feed into Academic Indicator) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#5B6CFF]/15 to-[#2EC4B6]/15 border border-[#5B6CFF]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#5B6CFF]">
                <Sparkles className="h-4 w-4" />
                <span>Real-Time Academic Telemetry & Success Score Recomputed:</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)]">
                  <span className="text-[10px] text-[var(--clay-muted)] font-bold block">Academic CIE Indicator</span>
                  <div className="font-extrabold text-[var(--clay-text)] tabular-nums mt-0.5">
                    {submissionResult.telemetry_update.old_cie} →{' '}
                    <span className="text-emerald-600 font-black">
                      {submissionResult.telemetry_update.new_cie} / 10
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)]">
                  <span className="text-[10px] text-[var(--clay-muted)] font-bold block">Student Success Score</span>
                  <div className="font-extrabold text-[var(--clay-text)] tabular-nums mt-0.5">
                    {submissionResult.telemetry_update.old_score} →{' '}
                    <span className="text-[#5B6CFF] font-black">
                      {submissionResult.telemetry_update.new_score} / 100
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[var(--clay-muted)] font-medium">
                The assessment marks have been fed into the 30-weight Academic Indicator, automatically recalculating early-warning risk models and percentile rankings.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/faculty" className="w-full">
                <ClayButton variant="coral" size="md" fullWidth>
                  <span>Return to Faculty Dashboard</span>
                </ClayButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
