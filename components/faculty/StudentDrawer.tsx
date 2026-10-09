'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  BookOpen,
  Users,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import { ClayInput } from '../ui/ClayInput';
import { StudentDetail, getStudentDetail, assignIntervention } from '@/lib/data/students';

interface StudentDrawerProps {
  studentId: string | null;
  onClose: () => void;
  onInterventionAdded?: () => void;
}

export function StudentDrawer({
  studentId,
  onClose,
  onInterventionAdded,
}: StudentDrawerProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [trendMode, setTrendMode] = useState<'attendance' | 'marks'>('attendance');

  // Intervention form states
  const [intervType, setIntervType] = useState('mentoring');
  const [intervNote, setIntervNote] = useState('');
  const [intervDate, setIntervDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setStudent(null);
      return;
    }
    async function load() {
      setLoading(true);
      const detail = await getStudentDetail(studentId!);
      setStudent(detail);
      setLoading(false);
    }
    load();
  }, [studentId]);

  if (!studentId) return null;

  const handleAssignIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !intervNote.trim()) return;

    setSubmitting(true);
    await assignIntervention(student.reg_no, intervType, intervNote, intervDate);
    setSubmitting(false);
    setSubmitSuccess(true);
    setIntervNote('');

    // Reload student details to refresh interventions list
    const updated = await getStudentDetail(student.student_id);
    if (updated) setStudent(updated);
    if (onInterventionAdded) onInterventionAdded();

    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // 7-Indicator Radar Chart Data
  const radarData = student
    ? [
        { subject: 'Academic', score: student.analytics.scores.academic, fullMark: 30 },
        { subject: 'Attendance', score: student.analytics.scores.attendance, fullMark: 20 },
        { subject: 'LMS', score: student.analytics.scores.lms, fullMark: 10 },
        { subject: 'Engagement', score: student.analytics.scores.engagement, fullMark: 10 },
        { subject: 'Placement', score: student.analytics.scores.placement, fullMark: 15 },
        { subject: 'Skills', score: student.analytics.scores.skills, fullMark: 10 },
        { subject: 'Feedback', score: student.analytics.scores.feedback, fullMark: 5 },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Sliding in from Right) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-[var(--clay-card)] border-l-2 border-[var(--clay-border)] shadow-2xl overflow-y-auto p-6 sm:p-8 animate-in slide-in-from-right duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-5 border-b border-[var(--clay-border)] mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] text-white flex items-center justify-center font-heading font-extrabold text-lg shadow-[var(--shadow-clay-coral)]">
                {student?.full_name?.charAt(0) || 'S'}
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-xl text-[var(--clay-text)] flex items-center gap-2">
                  <span>{student?.full_name || 'Loading Student...'}</span>
                  {student && (
                    <ClayBadge
                      variant={
                        student.risk_level === 'critical'
                          ? 'risk-critical'
                          : student.risk_level === 'high'
                          ? 'risk-high'
                          : student.risk_level === 'medium'
                          ? 'risk-medium'
                          : 'risk-low'
                      }
                      size="sm"
                    >
                      Risk {student.risk_probability} ({student.risk_level.toUpperCase()})
                    </ClayBadge>
                  )}
                </h2>
                <span className="text-xs font-semibold text-[var(--clay-muted)] block tabular-nums">
                  {student?.reg_no} • {student?.section_name} • CGPA {student?.cgpa} • {student?.backlogs} Backlogs
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="h-10 w-10 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-center text-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)] active:scale-95 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {loading || !student ? (
            <div className="py-24 text-center text-sm font-bold text-[var(--clay-muted)]">
              Loading comprehensive telemetry...
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Score Gauge & Persona Segment Banner */}
              <ClayCard className="p-5 sm:p-6 bg-gradient-to-br from-[var(--clay-card)] to-[var(--clay-pressed)]/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Circular Radial Score Gauge */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 flex items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(163, 177, 198, 0.3)"
                          strokeWidth="10"
                          fill="none"
                        />
                        {/* Value arc */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={
                            student.success_score >= 75
                              ? '#2EC4B6'
                              : student.success_score >= 50
                              ? '#FFC857'
                              : '#FF7A59'
                          }
                          strokeWidth="10"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * student.success_score) / 100}
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-heading font-extrabold text-2xl text-[var(--clay-text)] tabular-nums leading-none">
                          {student.success_score}
                        </span>
                        <span className="text-[9px] font-bold text-[var(--clay-muted)] uppercase mt-0.5">
                          Score / 100
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                        Assigned Segment
                      </span>
                      <h4 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                        {student.segment}
                      </h4>
                      <p className="text-xs text-[var(--clay-muted)] mt-1 max-w-xs leading-tight">
                        {student.analytics.segment.rationale}
                      </p>
                    </div>
                  </div>

                  {/* Condonation & Placement Flag Badges */}
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <div
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        student.attendance_pct < 75
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>
                        Attendance: {student.attendance_pct}%{' '}
                        {student.attendance_pct < 75 ? '(Condonation Risk)' : '(Safe)'}
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-bold text-[var(--clay-muted)] flex items-center justify-between gap-4">
                      <span>Coding Score:</span>
                      <span className="text-[var(--clay-text)] font-extrabold tabular-nums">
                        {student.coding_score} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </ClayCard>

              {/* 2. "Why This Score" Waterfall Explainability */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                    Why This Score? (Explainability Waterfall)
                  </h3>
                  <ClayBadge variant="teal" size="sm">Section Benchmark Delta</ClayBadge>
                </div>

                <ClayCard className="p-5 space-y-3">
                  {/* Primary Drag Callout */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-semibold mb-4">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
                    <span>{student.analytics.explainability.primary_drag_text}</span>
                  </div>

                  {/* Horizontal Divergence Bars */}
                  {student.analytics.explainability.all_drivers.map((driver) => {
                    const isNeg = driver.delta < 0;
                    return (
                      <div key={driver.factor} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[var(--clay-text)]">{driver.factor}</span>
                          <span
                            className={`tabular-nums font-extrabold ${
                              isNeg ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isNeg ? '' : '+'}
                            {driver.delta} pts
                          </span>
                        </div>
                        {/* Delta Bar visual */}
                        <div className="h-2 w-full rounded-full bg-[var(--clay-pressed)] overflow-hidden flex">
                          <div
                            style={{ width: `${Math.min(100, Math.abs(driver.delta) * 12)}%` }}
                            className={`h-full rounded-full ${
                              isNeg ? 'bg-[#FF7A59]' : 'bg-[#2EC4B6]'
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-[var(--clay-muted)]">{driver.text}</p>
                      </div>
                    );
                  })}
                </ClayCard>
              </div>

              {/* 3. 7-Indicator Radar Chart */}
              <div>
                <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)] mb-3">
                  7-Dimension Competency Radar
                </h3>
                <ClayCard className="p-4 sm:p-6 flex items-center justify-center">
                  <div className="h-[250px] w-full max-w-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--clay-muted)" opacity={0.25} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--clay-text)', fontSize: 11 }} />
                        <PolarRadiusAxis stroke="var(--clay-muted)" opacity={0.2} domain={[0, 30]} />
                        <Radar
                          name="Competency"
                          dataKey="score"
                          stroke="#5B6CFF"
                          fill="#5B6CFF"
                          fillOpacity={0.45}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </ClayCard>
              </div>

              {/* 4. Monthly Attendance & Marks Trend Lines */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                    Performance Trend Lines
                  </h3>
                  <div className="flex items-center gap-1 bg-[var(--clay-pressed)] p-1 rounded-xl">
                    <button
                      onClick={() => setTrendMode('attendance')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all ${
                        trendMode === 'attendance'
                          ? 'bg-[var(--clay-card)] text-[var(--clay-text)] shadow-sm'
                          : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
                      }`}
                    >
                      Attendance Trend
                    </button>
                    <button
                      onClick={() => setTrendMode('marks')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all ${
                        trendMode === 'marks'
                          ? 'bg-[var(--clay-card)] text-[var(--clay-text)] shadow-sm'
                          : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
                      }`}
                    >
                      Marks Trajectory
                    </button>
                  </div>
                </div>

                <ClayCard className="p-4 sm:p-6">
                  {trendMode === 'attendance' ? (
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-semibold text-[var(--clay-muted)]">Monthly Attendance % (July - October)</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Target: ≥ 75%</span>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={student.attendance_trend}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="month" stroke="var(--clay-muted)" fontSize={11} />
                            <YAxis stroke="var(--clay-muted)" fontSize={11} domain={[0, 100]} unit="%" />
                            <Tooltip
                              formatter={(value: any, name: any) => [`${value}%`, name]}
                            />
                            <Line
                              type="monotone"
                              dataKey="attendance_pct"
                              name="Attendance %"
                              stroke="#2EC4B6"
                              strokeWidth={3}
                              dot={{ r: 5, fill: '#2EC4B6' }}
                              activeDot={{ r: 7 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-semibold text-[var(--clay-muted)]">Subject Assessments: F1, F2 vs Semester</span>
                        <span className="font-bold text-[#5B6CFF]">Formative Scaled /10</span>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={student.marks_trend}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="subject" stroke="var(--clay-muted)" fontSize={10} interval={0} />
                            <YAxis stroke="var(--clay-muted)" fontSize={11} domain={[0, 10]} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="f1"
                              name="Formative 1 (F1)"
                              stroke="#5B6CFF"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#5B6CFF' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="f2"
                              name="Formative 2 (F2)"
                              stroke="#FF7A59"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#FF7A59' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </ClayCard>
              </div>

              {/* 4b. Skills & Competencies Graph */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                    Skills & Placement Readiness Graph
                  </h3>
                  <ClayBadge variant="indigo" size="sm">Standardized 0-10</ClayBadge>
                </div>

                <ClayCard className="p-4 sm:p-6 space-y-3.5">
                  {student.skills_breakdown.map((s) => (
                    <div key={s.skill} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[var(--clay-text)]">{s.skill}</span>
                        <span className="tabular-nums font-extrabold text-[#5B6CFF]">
                          {s.score.toFixed(1)} / 10
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-[var(--clay-pressed)] overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (s.score / 10) * 100)}%` }}
                          className={`h-full rounded-full transition-all duration-700 ${
                            s.score >= 8
                              ? 'bg-[#2EC4B6]'
                              : s.score >= 6
                              ? 'bg-[#5B6CFF]'
                              : 'bg-[#FF7A59]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Placement readiness diagnostics */}
                  <div className="pt-3 border-t border-[var(--clay-border)] grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[var(--clay-pressed)]/50">
                      <span className="text-[10px] text-[var(--clay-muted)] block font-semibold">Coding</span>
                      <span className="text-xs font-extrabold text-[var(--clay-text)] tabular-nums">
                        {student.coding_score}/100
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[var(--clay-pressed)]/50">
                      <span className="text-[10px] text-[var(--clay-muted)] block font-semibold">Aptitude</span>
                      <span className="text-xs font-extrabold text-[var(--clay-text)] tabular-nums">
                        {student.raw_metrics?.aptitude ?? 75}/100
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[var(--clay-pressed)]/50">
                      <span className="text-[10px] text-[var(--clay-muted)] block font-semibold">Interview</span>
                      <span className="text-xs font-extrabold text-[var(--clay-text)] tabular-nums">
                        {student.raw_metrics?.mock_interview ?? 70}/100
                      </span>
                    </div>
                  </div>
                </ClayCard>
              </div>

              {/* 5. Assign Intervention Form */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                    Prescriptive Action & Log Intervention
                  </h3>
                  <ClayBadge variant="coral" size="sm">Faculty Action</ClayBadge>
                </div>

                <ClayCard className="p-5 sm:p-6">
                  {/* Prescribed Action Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#5B6CFF]/10 border border-[#5B6CFF]/30 text-xs text-[var(--clay-text)] font-semibold mb-5 flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-[#5B6CFF] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#5B6CFF] block">Algorithmic Recommendation:</span>
                      {student.analytics.segment.suggested_intervention}
                    </div>
                  </div>

                  {submitSuccess && (
                    <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Intervention successfully logged and scheduled!</span>
                    </div>
                  )}

                  <form onSubmit={handleAssignIntervention} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-heading font-extrabold text-[var(--clay-text)] block mb-1.5 ml-1">
                          Action Type
                        </label>
                        <select
                          value={intervType}
                          onChange={(e) => setIntervType(e.target.value)}
                          className="w-full rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-[var(--clay-text)] shadow-[var(--shadow-clay-input)] px-4 py-2.5 text-xs font-bold outline-none min-h-[44px]"
                        >
                          <option value="attendance_warning">Attendance Warning & Target</option>
                          <option value="mentoring">1-on-1 Faculty Mentoring</option>
                          <option value="remedial_class">Enroll in Remedial Clinic</option>
                          <option value="parent_meeting">Guardian / Parent Conference</option>
                          <option value="counseling">Academic Counseling</option>
                          <option value="placement_training">DSA Coding Sprint Bootcamp</option>
                        </select>
                      </div>

                      <ClayInput
                        label="Target Due Date"
                        type="date"
                        value={intervDate}
                        onChange={(e) => setIntervDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-heading font-extrabold text-[var(--clay-text)] block mb-1.5 ml-1">
                        Intervention Notes & Targets
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detail specific remedial goals, lecture commitments, or test clearance targets..."
                        value={intervNote}
                        onChange={(e) => setIntervNote(e.target.value)}
                        className="w-full rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-[var(--clay-text)] shadow-[var(--shadow-clay-input)] p-3 text-xs font-medium outline-none placeholder:text-[var(--clay-muted)] focus:ring-2 focus:ring-[#FF7A59] transition-all resize-none"
                        required
                      />
                    </div>

                    <ClayButton
                      type="submit"
                      variant="coral"
                      size="md"
                      fullWidth
                      disabled={submitting}
                    >
                      <Send className="h-4 w-4" />
                      <span>{submitting ? 'Logging...' : 'Assign & Notify Student'}</span>
                    </ClayButton>
                  </form>

                  {/* Active Interventions History */}
                  {student.interventions.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-[var(--clay-border)]">
                      <span className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block mb-3">
                        Active Interventions History ({student.interventions.length})
                      </span>
                      <div className="space-y-2">
                        {student.interventions.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-badge)] text-xs flex items-start justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-heading font-extrabold text-[var(--clay-text)] capitalize">
                                  {item.type.replace('_', ' ')}
                                </span>
                                <ClayBadge
                                  variant={item.status === 'escalated' ? 'risk-critical' : 'teal'}
                                  size="sm"
                                >
                                  {item.status.toUpperCase()}
                                </ClayBadge>
                              </div>
                              <p className="text-[11px] text-[var(--clay-muted)]">{item.note}</p>
                            </div>
                            {item.due_date && (
                              <span className="text-[10px] font-bold text-[var(--clay-muted)] flex-shrink-0 tabular-nums">
                                Due: {item.due_date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ClayCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
