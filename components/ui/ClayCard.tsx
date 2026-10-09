'use client';

import React from 'react';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  pressed?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
}

export function ClayCard({
  children,
  className = '',
  hoverable = false,
  pressed = false,
  elevation = 'md',
  ...props
}: ClayCardProps) {
  const baseClasses =
    'relative rounded-3xl border border-[var(--clay-border)] bg-[var(--clay-card)] text-[var(--clay-text)] transition-all duration-200';

  const shadowClasses = pressed
    ? 'shadow-[var(--shadow-clay-card-pressed)] scale-[0.98]'
    : hoverable
    ? 'shadow-[var(--shadow-clay-card)] hover:shadow-[var(--shadow-clay-card-hover)] hover:-translate-y-[2px] active:scale-[0.98] active:shadow-[var(--shadow-clay-card-pressed)]'
    : 'shadow-[var(--shadow-clay-card)]';

  return (
    <div className={`${baseClasses} ${shadowClasses} ${className}`} {...props}>
      {/* Specular highlight rim */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-black/5 dark:from-white/10 dark:to-black/20" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
