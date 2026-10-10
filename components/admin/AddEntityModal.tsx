'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Hash,
  BookOpen,
  Calendar,
  Layers,
  Award,
  TrendingUp,
  Briefcase,
  Code2,
  Building2,
  Clock,
  MapPin,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayInput } from '../ui/ClayInput';
import { ClayButton } from '../ui/ClayButton';
import { ClayBadge } from '../ui/ClayBadge';
import { addStudentProfile, addFacultyProfile, NewStudentInput, NewFacultyInput } from '@/lib/data/admin';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'student' | 'faculty';
  onSuccess?: () => void;
}

export function AddEntityModal({
  isOpen,
  onClose,
  initialTab = 'student',
  onSuccess,
}: AddEntityModalProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'faculty'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Student Form State
  const [stuName, setStuName] = useState('');
  const [stuRegNo, setStuRegNo] = useState('');
  const [stuEmail, setStuEmail] = useState('');
  const [stuSection, setStuSection] = useState('Section A');
  const [stuDept, setStuDept] = useState('Computer Science & Engineering');
  const [stuCgpa, setStuCgpa] = useState('8.2');
  const [stuAttendance, setStuAttendance] = useState('84.5');
  const [stuCie1, setStuCie1] = useState('25');
  const [stuCie2, setStuCie2] = useState('24');
  const [stuAssignments, setStuAssignments] = useState('18');
  const [stuBacklogs, setStuBacklogs] = useState('0');
  const [stuSegment, setStuSegment] = useState('High Achiever');
  const [stuLeetcode, setStuLeetcode] = useState('');
  const [stuGithub, setStuGithub] = useState('');

  // Faculty Form State
  const [facName, setFacName] = useState('');
  const [facId, setFacId] = useState('CSE_124');
  const [facEmail, setFacEmail] = useState('');
  const [facDesignation, setFacDesignation] = useState('Associate Professor');
  const [facDept, setFacDept] = useState('Computer Science & Engineering');
  const [facSection, setFacSection] = useState('Section A');
  const [facOffice, setFacOffice] = useState('Block-A, Room 304');
  const [facWorkload, setFacWorkload] = useState('16');
  const [facResearch, setFacResearch] = useState('Artificial Intelligence, Machine Learning, Cloud Systems');
  const [facCourses, setFacCourses] = useState('Design & Analysis of Algorithms, Machine Learning');
  const [facPhotoUrl, setFacPhotoUrl] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
    setSuccessMessage(null);
    setErrorMessage(null);
  }, [initialTab, isOpen]);

  // Auto-generate @campus.edu.in email for student when roll number changes
  useEffect(() => {
    if (stuRegNo.trim()) {
      const clean = stuRegNo.trim().toLowerCase();
      setStuEmail(`${clean}@campus.edu.in`);
    }
  }, [stuRegNo]);

  // Auto-generate @campus.edu.in email for faculty when name changes
  useEffect(() => {
    if (facName.trim()) {
      const slug = facName
        .toLowerCase()
        .replace(/^(dr\.|prof\.)\s*/i, '')
        .trim()
        .replace(/\s+/g, '.');
      setFacEmail(`${slug}@campus.edu.in`);
    }
  }, [facName]);

  if (!isOpen) return null;

  // Estimated Live Preview Calculation for Student
  const numericCgpa = parseFloat(stuCgpa) || 0;
  const numericAttendance = parseFloat(stuAttendance) || 0;
  const numericBacklogs = parseInt(stuBacklogs, 10) || 0;
  const estimatedScore = Math.max(
    10,
    Math.min(
      99,
      Math.round(
        (numericCgpa / 10) * 30 +
          (numericAttendance / 100) * 20 +
          (numericBacklogs === 0 ? 15 : Math.max(0, 15 - numericBacklogs * 5)) +
          18
      )
    )
  );
  const estimatedRisk =
    numericAttendance < 75 || numericBacklogs > 2 || numericCgpa < 6.0
      ? 'High / Critical Risk'
      : numericCgpa < 7.5
      ? 'Medium Attention'
      : 'Low Placement Risk (Safe)';

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!stuName.trim() || !stuRegNo.trim()) {
      setErrorMessage('Please provide student full name and institutional registration number.');
      return;
    }
    if (numericCgpa < 0 || numericCgpa > 10) {
      setErrorMessage('CGPA must be a valid number between 0.0 and 10.0.');
      return;
    }
    if (numericAttendance < 0 || numericAttendance > 100) {
      setErrorMessage('Attendance must be a valid percentage between 0 and 100%.');
      return;
    }

    try {
      setLoading(true);
      await addStudentProfile({
        full_name: stuName.trim(),
        reg_no: stuRegNo.trim().toUpperCase(),
        email: stuEmail.trim(),
        section: stuSection,
        department: stuDept,
        cgpa: numericCgpa,
        attendance_pct: numericAttendance,
        cie1_marks: parseFloat(stuCie1) || 24,
        cie2_marks: parseFloat(stuCie2) || 22,
        assignments_marks: parseFloat(stuAssignments) || 18,
        backlogs: numericBacklogs,
        placement_status: stuSegment,
        leetcode_handle: stuLeetcode.trim() || undefined,
        github_handle: stuGithub.trim() || undefined,
      });

      setLoading(false);
      setSuccessMessage(`Successfully registered student ${stuName} (${stuRegNo.toUpperCase()}) with email ${stuEmail}!`);
      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Failed to enroll student. Please check entered metrics.');
    }
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!facName.trim() || !facId.trim()) {
      setErrorMessage('Please provide faculty full name and official Faculty ID.');
      return;
    }

    try {
      setLoading(true);
      await addFacultyProfile({
        full_name: facName.trim(),
        faculty_id: facId.trim().toUpperCase(),
        email: facEmail.trim(),
        designation: facDesignation,
        department: facDept,
        assigned_sections: [facSection],
        office_location: facOffice.trim(),
        workload_hours_per_week: parseInt(facWorkload, 10) || 16,
        research_interests: facResearch.trim(),
        courses_taught: facCourses.split(',').map((c) => c.trim()).filter(Boolean),
        photo_url: facPhotoUrl.trim() || undefined,
      });

      setLoading(false);
      setSuccessMessage(`Successfully registered faculty member ${facName} (${facId.toUpperCase()}) with email ${facEmail}!`);
      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Failed to register faculty profile.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-entity-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Card */}
      <ClayCard className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 z-10 shadow-[var(--shadow-clay-card-hover)] border-2 border-[var(--clay-border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 id="add-entity-modal-title" className="font-heading font-extrabold text-xl text-[var(--clay-text)] tracking-tight">
                Add Institutional Member
              </h2>
              <span className="text-xs font-semibold text-[var(--clay-muted)] block">
                Direct Administrator Enrolment • Enforces @campus.edu.in Directory Standards
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-[var(--clay-muted)] hover:text-[var(--clay-text)] shadow-[var(--shadow-clay-btn)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher: Student vs Faculty */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--clay-pressed)]/70 border border-[var(--clay-border)] mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-heading font-extrabold text-xs transition-all ${
              activeTab === 'student'
                ? 'bg-[var(--clay-card)] text-[#FF7A59] shadow-sm border border-[var(--clay-border)]'
                : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Add Student (Full Results)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('faculty');
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-heading font-extrabold text-xs transition-all ${
              activeTab === 'faculty'
                ? 'bg-[var(--clay-card)] text-[#2EC4B6] shadow-sm border border-[var(--clay-border)]'
                : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Add Faculty (Profile & Roster)</span>
          </button>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form: ADD STUDENT */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            {/* 1. Identity */}
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--clay-pressed)]/40 border border-[var(--clay-border)]">
              <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[var(--clay-muted)] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#FF7A59]" />
                1. Student Identity & Institutional Contact
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ClayInput
                  label="Student Full Name *"
                  placeholder="e.g. Aditi Sharma"
                  value={stuName}
                  onChange={(e) => setStuName(e.target.value)}
                  required
                />
                <ClayInput
                  label="Roll / Registration Number *"
                  placeholder="e.g. 241FA18121"
                  value={stuRegNo}
                  onChange={(e) => setStuRegNo(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ClayInput
                  label="Institutional Email (ends with @campus.edu.in) *"
                  type="email"
                  placeholder="241fa18121@campus.edu.in"
                  icon={<Mail className="h-4 w-4" />}
                  value={stuEmail}
                  onChange={(e) => setStuEmail(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-heading font-bold text-[var(--clay-text)] mb-1">
                    Section Assignment *
                  </label>
                  <select
                    value={stuSection}
                    onChange={(e) => setStuSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-bold text-[var(--clay-text)] shadow-sm outline-none cursor-pointer"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[var(--clay-text)] mb-1">
                  Department
                </label>
                <select
                  value={stuDept}
                  onChange={(e) => setStuDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-bold text-[var(--clay-text)] shadow-sm outline-none cursor-pointer"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science (AI & DS)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering (ECE)</option>
                </select>
              </div>
            </div>

            {/* 2. Basic Academic Results Required */}
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--clay-pressed)]/40 border border-[var(--clay-border)]">
              <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[var(--clay-muted)] flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#2EC4B6]" />
                2. Academic Examination Results & Attendance Telemetry
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ClayInput
                  label="CGPA (0 - 10) *"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={stuCgpa}
                  onChange={(e) => setStuCgpa(e.target.value)}
                  required
                />
                <ClayInput
                  label="Attendance % *"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={stuAttendance}
                  onChange={(e) => setStuAttendance(e.target.value)}
                  required
                />
                <ClayInput
                  label="CIE-1 Marks (/30)"
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={stuCie1}
                  onChange={(e) => setStuCie1(e.target.value)}
                />
                <ClayInput
                  label="CIE-2 Marks (/30)"
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={stuCie2}
                  onChange={(e) => setStuCie2(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ClayInput
                  label="Assignment Score (/20)"
                  type="number"
                  min="0"
                  max="20"
                  value={stuAssignments}
                  onChange={(e) => setStuAssignments(e.target.value)}
                />
                <ClayInput
                  label="Active Backlogs (0, 1, 2..)"
                  type="number"
                  min="0"
                  max="10"
                  value={stuBacklogs}
                  onChange={(e) => setStuBacklogs(e.target.value)}
                />
                <div>
                  <label className="block text-xs font-heading font-bold text-[var(--clay-text)] mb-1">
                    Placement Readiness
                  </label>
                  <select
                    value={stuSegment}
                    onChange={(e) => setStuSegment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-bold text-[var(--clay-text)] shadow-sm outline-none cursor-pointer"
                  >
                    <option value="High Achiever">High Achiever</option>
                    <option value="Consistent Performer">Consistent Performer</option>
                    <option value="Needs Guidance">Needs Guidance</option>
                    <option value="Attendance Risk">Attendance Risk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Live Preview Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#5B6CFF]/10 via-[#2EC4B6]/10 to-[#FF7A59]/10 border border-[var(--clay-border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#5B6CFF]" />
                <span className="font-bold text-[var(--clay-text)]">
                  Computed Success Score Preview: <strong className="text-[#FF7A59] font-extrabold">{estimatedScore} / 100</strong>
                </span>
              </div>
              <ClayBadge
                variant={numericAttendance < 75 || numericBacklogs > 0 ? 'risk-critical' : 'risk-low'}
                size="sm"
              >
                {estimatedRisk}
              </ClayBadge>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)]"
              >
                Cancel
              </button>
              <ClayButton
                type="submit"
                variant="coral"
                size="md"
                disabled={loading}
              >
                <span>{loading ? 'Enrolling...' : 'Enrol Student & Generate Telemetry'}</span>
              </ClayButton>
            </div>
          </form>
        )}

        {/* Form: ADD FACULTY */}
        {activeTab === 'faculty' && (
          <form onSubmit={handleFacultySubmit} className="space-y-4">
            {/* 1. Faculty Identity */}
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--clay-pressed)]/40 border border-[var(--clay-border)]">
              <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[var(--clay-muted)] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#2EC4B6]" />
                1. Faculty Identity & Official Credential
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ClayInput
                  label="Faculty Full Name (with Title) *"
                  placeholder="e.g. Dr. P. Rajesh Kumar"
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  required
                />
                <ClayInput
                  label="Faculty ID (e.g. CSE_124) *"
                  placeholder="e.g. CSE_124"
                  value={facId}
                  onChange={(e) => setFacId(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ClayInput
                  label="Official Institutional Email (ends with @campus.edu.in) *"
                  type="email"
                  placeholder="p.rajesh.kumar@campus.edu.in"
                  icon={<Mail className="h-4 w-4" />}
                  value={facEmail}
                  onChange={(e) => setFacEmail(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-heading font-bold text-[var(--clay-text)] mb-1">
                    Designation *
                  </label>
                  <select
                    value={facDesignation}
                    onChange={(e) => setFacDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-bold text-[var(--clay-text)] shadow-sm outline-none cursor-pointer"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Mentorship, Workload & Research */}
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--clay-pressed)]/40 border border-[var(--clay-border)]">
              <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-[var(--clay-muted)] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#5B6CFF]" />
                2. Academic Department, Mentorship Section & Workload
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-[var(--clay-text)] mb-1">
                    Assigned Mentorship Section
                  </label>
                  <select
                    value={facSection}
                    onChange={(e) => setFacSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-bold text-[var(--clay-text)] shadow-sm outline-none cursor-pointer"
                  >
                    <option value="Section A">Section A (CSE Year 3)</option>
                    <option value="Section B">Section B (CSE Year 3)</option>
                    <option value="Section C">Section C (CSE Year 3)</option>
                    <option value="All Sections">All Sections</option>
                  </select>
                </div>

                <ClayInput
                  label="Office / Cabin Room"
                  placeholder="Block-A, Room 304"
                  value={facOffice}
                  onChange={(e) => setFacOffice(e.target.value)}
                />

                <ClayInput
                  label="Workload Hours / Week"
                  type="number"
                  min="4"
                  max="40"
                  value={facWorkload}
                  onChange={(e) => setFacWorkload(e.target.value)}
                />
              </div>

              <ClayInput
                label="Research Specializations & Domains"
                placeholder="Artificial Intelligence, Computer Vision, Cloud Infrastructure"
                value={facResearch}
                onChange={(e) => setFacResearch(e.target.value)}
              />

              <ClayInput
                label="Courses Taught (comma-separated)"
                placeholder="Design & Analysis of Algorithms, Machine Learning"
                value={facCourses}
                onChange={(e) => setFacCourses(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-xs font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)]"
              >
                Cancel
              </button>
              <ClayButton
                type="submit"
                variant="teal"
                size="md"
                disabled={loading}
              >
                <span>{loading ? 'Registering...' : 'Register Faculty & Add to Directory'}</span>
              </ClayButton>
            </div>
          </form>
        )}
      </ClayCard>
    </div>
  );
}
