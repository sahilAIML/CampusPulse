'use client';

import React from 'react';

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const ClayInput = React.forwardRef<HTMLInputElement, ClayInputProps>(
  ({ label, error, icon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-heading text-xs font-bold text-[var(--clay-text)] ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[var(--clay-muted)] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-[var(--clay-text)] shadow-[var(--shadow-clay-input)] px-4 py-3 text-sm placeholder:text-[var(--clay-muted)] focus:outline-none focus:ring-2 focus:ring-[#FF7A59] transition-all min-h-[46px] ${
              icon ? 'pl-10' : ''
            } ${rightElement ? 'pr-11' : ''} ${error ? 'border-rose-500/60 ring-1 ring-rose-500' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center">{rightElement}</div>
          )}
        </div>
        {error && <span className="text-xs font-bold text-rose-500 ml-1">{error}</span>}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
