'use client';

import React from 'react';

interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'coral' | 'teal' | 'sun' | 'indigo' | 'risk-low' | 'risk-medium' | 'risk-high' | 'risk-critical';
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export function ClayBadge({
  children,
  variant = 'default',
  icon,
  className = '',
  size = 'md',
}: ClayBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-3.5 py-1.5 text-xs gap-2';

  const variantStyles = {
    default: 'bg-[var(--clay-card)] text-[var(--clay-text)] border-[var(--clay-border)]',
    coral: 'bg-[#FF7A59]/15 text-[#E05F3F] dark:text-[#FFA085] border-[#FF7A59]/30',
    teal: 'bg-[#2EC4B6]/15 text-[#1D857B] dark:text-[#5CE6DA] border-[#2EC4B6]/30',
    sun: 'bg-[#FFC857]/20 text-[#B8860B] dark:text-[#FFD782] border-[#FFC857]/40',
    indigo: 'bg-[#5B6CFF]/15 text-[#4454E5] dark:text-[#8D9BFF] border-[#5B6CFF]/30',
    'risk-low': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    'risk-medium': 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    'risk-high': 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
    'risk-critical': 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 font-extrabold',
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-[var(--shadow-clay-badge)] font-heading font-semibold select-none ${sizeClasses} ${variantStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
