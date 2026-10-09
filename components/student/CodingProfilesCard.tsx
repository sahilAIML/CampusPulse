'use client';

import React from 'react';
import {
  Code2,
  Github,
  Linkedin,
  Trophy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  GitBranch,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { DetailedStudentDossier } from '@/lib/data/student-portal';

interface CodingProfilesCardProps {
  codingProfiles: DetailedStudentDossier['coding_profiles'];
}

export function CodingProfilesCard({ codingProfiles }: CodingProfilesCardProps) {
  const { leetcode, codechef, linkedin, github } = codingProfiles;

  return (
    <ClayCard className="p-6 border-2 border-[var(--clay-border)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[var(--clay-text)]">
            Verified Coding & Professional Profiles
          </h3>
          <p className="text-xs text-[var(--clay-muted)]">
            Continuous sync feeds directly into your Placement Readiness and Practical Skills indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClayBadge variant="teal" size="sm" icon={<ShieldCheck className="h-3 w-3" />}>
            Verified SIS Link
          </ClayBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. LeetCode */}
        <div className="p-4 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Code2 className="h-4 w-4" />
                </div>
                <span className="font-heading font-extrabold text-xs text-[var(--clay-text)]">
                  LeetCode
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Synced" />
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Solved:</span>
                <span className="font-heading font-extrabold text-[var(--clay-text)]">
                  {leetcode.problems_solved} Qs
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Rating:</span>
                <span className="font-mono font-bold text-[#FF7A59]">
                  {leetcode.contest_rating}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Standing:</span>
                <span className="font-bold text-[10px] text-emerald-600">
                  {leetcode.ranking}
                </span>
              </div>
            </div>
          </div>

          <a
            href={leetcode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2 border-t border-[var(--clay-border)] text-[11px] font-heading font-bold text-[#FF7A59] hover:underline flex items-center justify-between"
          >
            <span>@{leetcode.username}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* 2. CodeChef */}
        <div className="p-4 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                  <Trophy className="h-4 w-4" />
                </div>
                <span className="font-heading font-extrabold text-xs text-[var(--clay-text)]">
                  CodeChef
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Synced" />
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Division:</span>
                <span className="font-heading font-extrabold text-[#FFC857]">
                  {codechef.stars}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Rating:</span>
                <span className="font-mono font-bold text-[var(--clay-text)]">
                  {codechef.rating}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Global Rank:</span>
                <span className="font-bold text-[10px] text-[var(--clay-muted)]">
                  #{codechef.global_rank.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <a
            href={codechef.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2 border-t border-[var(--clay-border)] text-[11px] font-heading font-bold text-[#FF7A59] hover:underline flex items-center justify-between"
          >
            <span>@{codechef.username}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* 3. GitHub */}
        <div className="p-4 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-zinc-500/10 text-[var(--clay-text)] flex items-center justify-center font-bold">
                  <Github className="h-4 w-4" />
                </div>
                <span className="font-heading font-extrabold text-xs text-[var(--clay-text)]">
                  GitHub
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Synced" />
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Repos:</span>
                <span className="font-heading font-extrabold text-[var(--clay-text)]">
                  {github.public_repos} public
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Commits (2026):</span>
                <span className="font-mono font-bold text-[#2EC4B6]">
                  {github.commits_this_year}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[var(--clay-muted)]">Top Stack:</span>
                <span className="font-bold text-[10px] text-[var(--clay-text)] truncate max-w-[90px]">
                  {github.top_language}
                </span>
              </div>
            </div>
          </div>

          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2 border-t border-[var(--clay-border)] text-[11px] font-heading font-bold text-[#FF7A59] hover:underline flex items-center justify-between"
          >
            <span>@{github.username}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* 4. LinkedIn */}
        <div className="p-4 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-btn)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-blue-500/10 text-[#5B6CFF] flex items-center justify-center font-bold">
                  <Linkedin className="h-4 w-4" />
                </div>
                <span className="font-heading font-extrabold text-xs text-[var(--clay-text)]">
                  LinkedIn
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Synced" />
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-[11px] text-[var(--clay-muted)] block line-clamp-2 leading-tight">
                {linkedin.headline}
              </span>
              <div className="flex items-baseline justify-between text-xs pt-1">
                <span className="text-[var(--clay-muted)]">Network:</span>
                <span className="font-bold text-[var(--clay-text)]">
                  {linkedin.connections} connections
                </span>
              </div>
            </div>
          </div>

          <a
            href={linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-2 border-t border-[var(--clay-border)] text-[11px] font-heading font-bold text-[#5B6CFF] hover:underline flex items-center justify-between"
          >
            <span>View Profile</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </ClayCard>
  );
}
