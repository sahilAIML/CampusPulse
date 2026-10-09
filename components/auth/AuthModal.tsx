'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { ClayButton } from '../ui/ClayButton';
import { ClayInput } from '../ui/ClayInput';
import { ClayBadge } from '../ui/ClayBadge';
import { UserRole } from '@/lib/data/types';
import { loginUser } from '@/lib/data/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess?: (role: UserRole) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultRole = 'student',
  onSuccess,
}: AuthModalProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await loginUser(email, password, role);
      setIsLoading(false);
      onClose();
      if (onSuccess) onSuccess(user.role);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Tactile Clay Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-[36px] bg-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card-hover)] p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] flex items-center justify-center text-[var(--clay-muted)] shadow-[var(--shadow-clay-btn)] hover:text-[var(--clay-text)] active:scale-95 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-[#FF7A59] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--clay-text)]">
              Sign In to CampusPulse
            </h3>
            <span className="text-xs font-bold text-[var(--clay-muted)] block">
              Decision Intelligence for Higher Education
            </span>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="text-xs font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[var(--clay-pressed)] border border-[var(--clay-border)]">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-heading font-bold text-xs select-none transition-all ${
                role === 'student'
                  ? 'bg-[var(--clay-card)] text-[#5B6CFF] shadow-[var(--shadow-clay-btn)]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-heading font-bold text-xs select-none transition-all ${
                role === 'faculty'
                  ? 'bg-[var(--clay-card)] text-[#2EC4B6] shadow-[var(--shadow-clay-btn)]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-heading font-bold text-xs select-none transition-all ${
                role === 'admin'
                  ? 'bg-[var(--clay-card)] text-[#FF7A59] shadow-[var(--shadow-clay-btn)]'
                  : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <ClayInput
            label="College Email Address"
            type="email"
            placeholder={
              role === 'student'
                ? '241fa18067@college.edu.in'
                : role === 'faculty'
                ? 'ananya.sharma@campus.edu.in'
                : 'admin@campus.edu.in'
            }
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <ClayInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--clay-muted)] hover:text-[var(--clay-text)] transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
          />

          <ClayButton
            type="submit"
            variant="coral"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to CampusPulse'}</span>
            <ArrowRight className="h-4 w-4" />
          </ClayButton>
        </form>

        <div className="mt-4 pt-3 border-t border-[var(--clay-border)] flex items-center justify-between text-[11px] text-[var(--clay-muted)]">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2EC4B6]" />
            Encrypted Session
          </span>
          <span>Contact Dean's office for credentials</span>
        </div>
      </div>
    </div>
  );
}
