'use client';

import React from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme, ThemeMode } from '@/lib/theme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
  showLabels?: boolean;
}

export function ThemeToggle({
  className = '',
  size = 'md',
  showLabels = true,
}: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();

  // If not mounted yet (SSR hydration), show neutral fallback
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-[var(--clay-pressed)]/70 border border-[var(--clay-border)] opacity-80 ${className}`}
        aria-hidden="true"
      >
        <div className="h-7 w-7 rounded-xl bg-[var(--clay-card)] animate-pulse" />
      </div>
    );
  }

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      mode: 'white',
      label: 'White',
      icon: <Sun className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-[#FFC857]`} />,
      activeColor: 'text-amber-500',
    },
    {
      mode: 'black',
      label: 'Black',
      icon: <Moon className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-[#5B6CFF]`} />,
      activeColor: 'text-[#5B6CFF]',
    },
    {
      mode: 'bw',
      label: 'B&W',
      icon: <Contrast className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-neutral-200`} />,
      activeColor: 'text-white',
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector: White, Black, or B&W"
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-[var(--clay-pressed)]/80 border border-[var(--clay-border)] shadow-[var(--shadow-clay-pill)] select-none ${className}`}
    >
      {options.map((opt) => {
        const isActive = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.mode)}
            title={`${opt.label} Theme`}
            className={`flex items-center gap-1.5 rounded-xl font-heading font-extrabold transition-all duration-200 ${
              size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
            } ${
              isActive
                ? 'bg-[var(--clay-card)] shadow-[var(--shadow-clay-btn-pressed)] border border-[var(--clay-border)] scale-[0.98] ' +
                  opt.activeColor
                : 'text-[var(--clay-muted)] hover:text-[var(--clay-text)] hover:bg-[var(--clay-card)]/40 active:scale-95'
            }`}
          >
            {opt.icon}
            {showLabels && (
              <span className="hidden sm:inline font-bold">
                {opt.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
