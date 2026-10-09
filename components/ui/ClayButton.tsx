'use client';

import React from 'react';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'coral' | 'teal' | 'sun' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function ClayButton({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ClayButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[38px] rounded-xl',
    md: 'px-6 py-3 text-base min-h-[46px] rounded-2xl',
    lg: 'px-8 py-4 text-lg min-h-[54px] rounded-3xl',
  }[size];

  const variantClasses = {
    default:
      'bg-[var(--clay-card)] text-[var(--clay-text)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] hover:shadow-[var(--shadow-clay-btn-hover)]',
    coral:
      'bg-[#FF7A59] text-white border border-white/40 shadow-[var(--shadow-clay-coral)] hover:bg-[#FF886B]',
    teal:
      'bg-[#2EC4B6] text-white border border-white/40 shadow-[var(--shadow-clay-teal)] hover:bg-[#3BD4C6]',
    sun:
      'bg-[#FFC857] text-gray-900 border border-white/50 shadow-[var(--shadow-clay-btn)] hover:bg-[#FFD16F]',
    ghost:
      'bg-transparent text-[var(--clay-text)] border border-transparent hover:bg-black/5 dark:hover:bg-white/5',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 font-heading font-bold select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6CFF] ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:-translate-y-[2px] active:scale-[0.97] active:shadow-[var(--shadow-clay-btn-pressed)]'
      } ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Specular soft light overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-transparent via-white/10 to-white/25" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
