'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Github } from 'lucide-react';
import { ClayBadge } from '../ui/ClayBadge';

export function Footer() {
  return (
    <footer className="w-full mt-16 sm:mt-24 border-t border-[var(--clay-border)] bg-[var(--clay-card)] shadow-[var(--shadow-clay-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-2xl bg-[#FF7A59] flex items-center justify-center text-white shadow-[var(--shadow-clay-coral)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[var(--clay-text)]">
                Campus<span className="text-[#FF7A59]">Pulse</span>
              </span>
            </div>
            <p className="text-sm text-[var(--clay-muted)] max-w-md leading-relaxed mb-4">
              Student Success Platform engineered for higher-education governance. Converts fragmented SIS, RFID attendance, and CIE assessment telemetry into actionable early-warning decision intelligence.
            </p>
            <div className="flex items-center gap-2">
              <ClayBadge variant="teal" size="sm" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                KPMG Smart Campus Analytics Challenge
              </ClayBadge>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-extrabold text-sm text-[var(--clay-text)] uppercase tracking-wider mb-3">
              Campus Portals
            </h4>
            <ul className="space-y-2 text-sm font-semibold text-[var(--clay-muted)]">
              <li>
                <Link href="/#announcements" className="hover:text-[#FF7A59] transition-colors">
                  Official Announcements
                </Link>
              </li>
              <li>
                <Link href="/#placements" className="hover:text-[#2EC4B6] transition-colors">
                  Placement Trends & Records
                </Link>
              </li>
              <li>
                <span className="text-xs text-[var(--clay-muted)] opacity-75">
                  Student Success Score Engine v1.0
                </span>
              </li>
            </ul>
          </div>

          {/* System Telemetry & Architecture */}
          <div>
            <h4 className="font-heading font-extrabold text-sm text-[var(--clay-text)] uppercase tracking-wider mb-3">
              System Architecture
            </h4>
            <div className="space-y-2.5 text-xs text-[var(--clay-muted)]">
              <div className="p-3 rounded-2xl bg-[var(--clay-pressed)] border border-[var(--clay-border)]">
                <span className="font-bold text-[var(--clay-text)] block mb-0.5">Data Access Layer:</span>
                <span className="tabular-nums text-emerald-600 dark:text-emerald-400 font-extrabold">
                  DATA_MODE = mock | zero UI drift
                </span>
              </div>
              <p className="text-[11px] leading-tight text-[var(--clay-muted)]">
                Ready for drop-in live Supabase PostgreSQL connection with schema auto-introspection.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--clay-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--clay-muted)]">
          <p>© 2026 CampusPulse • Built for Indian Colleges & Autonomous Universities.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[var(--clay-text)] transition-colors">
              WCAG AA Contrast Compliant
            </span>
            <span>•</span>
            <span className="hover:text-[var(--clay-text)] transition-colors">
              Claymorphism 3D Strict
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
