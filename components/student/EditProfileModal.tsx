'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Code2,
  Github,
  Linkedin,
  Trophy,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ClayButton } from '../ui/ClayButton';
import { ClayInput } from '../ui/ClayInput';
import { ClayBadge } from '../ui/ClayBadge';
import { DetailedStudentDossier, updateStudentProfile } from '@/lib/data/student-portal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: DetailedStudentDossier;
  onProfileUpdated: (updated: DetailedStudentDossier) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  dossier,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(dossier.full_name);
  const [leetcodeUrl, setLeetcodeUrl] = useState(dossier.coding_profiles.leetcode.url);
  const [githubUrl, setGithubUrl] = useState(dossier.coding_profiles.github.url);
  const [linkedinUrl, setLinkedinUrl] = useState(dossier.coding_profiles.linkedin.url);
  const [codechefUrl, setCodechefUrl] = useState(dossier.coding_profiles.codechef.url);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      const updated = await updateStudentProfile(dossier.reg_no, {
        full_name: fullName,
        leetcode_url: leetcodeUrl,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        codechef_url: codechefUrl,
      });

      setIsSaving(false);
      setSuccessMessage('Profile and verified coding links successfully updated!');
      onProfileUpdated(updated);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsSaving(false);
      alert(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Clay Dialog */}
      <div className="relative w-full max-w-xl rounded-[36px] bg-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card-hover)] p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close edit profile dialog"
          className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-center text-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)] hover:text-[var(--clay-text)] active:scale-95 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-[#5B6CFF] text-white flex items-center justify-center shadow-[var(--shadow-clay-btn)]">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--clay-text)]">
              Update Student Dossier
            </h3>
            <span className="text-xs font-bold text-[var(--clay-muted)] block">
              Roll No: {dossier.reg_no} • Section {dossier.section}
            </span>
          </div>
        </div>

        {/* Security / Immutability Notice */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[var(--clay-pressed)]/60 border border-[var(--clay-border)] flex items-start gap-2.5 text-xs text-[var(--clay-muted)]">
          <ShieldCheck className="h-4 w-4 text-[#2EC4B6] flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-[var(--clay-text)]">Integrity Notice:</strong> Academic CGPA ({dossier.cgpa}), CIE marks, and biometric attendance ({dossier.attendance_pct}%) are certified by the university examination cell and cannot be altered.
          </span>
        </div>

        {successMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <ClayInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your official student name"
            required
            icon={<User className="h-4 w-4 text-[#5B6CFF]" />}
          />

          {/* LeetCode URL */}
          <ClayInput
            label="LeetCode Profile URL"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            placeholder="https://leetcode.com/your_handle"
            icon={<Code2 className="h-4 w-4 text-amber-500" />}
          />

          {/* GitHub URL */}
          <ClayInput
            label="GitHub Profile URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/your_handle"
            icon={<Github className="h-4 w-4 text-[var(--clay-text)]" />}
          />

          {/* LinkedIn URL */}
          <ClayInput
            label="LinkedIn Profile URL"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/your_profile"
            icon={<Linkedin className="h-4 w-4 text-[#5B6CFF]" />}
          />

          {/* CodeChef URL */}
          <ClayInput
            label="CodeChef Profile URL"
            value={codechefUrl}
            onChange={(e) => setCodechefUrl(e.target.value)}
            placeholder="https://codechef.com/users/your_handle"
            icon={<Trophy className="h-4 w-4 text-orange-500" />}
          />

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--clay-border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-heading font-bold text-[var(--clay-muted)] hover:text-[var(--clay-text)]"
            >
              Cancel
            </button>
            <ClayButton
              type="submit"
              variant="coral"
              size="md"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </ClayButton>
          </div>
        </form>
      </div>
    </div>
  );
}
