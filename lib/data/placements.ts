// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Data Access Layer: Placements (Mock / Supabase Switcher)
// ============================================================================

import { PlacementRecord, YearPlacementAggregate, RecruiterMetric } from './types';
import { MOCK_PLACEMENTS, MOCK_RECRUITERS } from './mock-store';
import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';

export async function getPlacements(filter?: {
  year?: number | 'all';
  company?: string | 'all';
}): Promise<PlacementRecord[]> {
  if (!isSupabaseConfigured()) {
    let list = [...MOCK_PLACEMENTS];
    if (filter?.year && filter.year !== 'all') {
      list = list.filter((p) => p.year === Number(filter.year));
    }
    if (filter?.company && filter.company !== 'all') {
      list = list.filter((p) => p.company.toLowerCase() === filter.company?.toLowerCase());
    }
    return list.sort((a, b) => b.year - a.year || b.package_lpa - a.package_lpa);
  }

  const supabase = getSupabaseClient();
  if (!supabase) return MOCK_PLACEMENTS;

  let query = supabase.from('placements').select('*').order('year', { ascending: false });

  if (filter?.year && filter.year !== 'all') {
    query = query.eq('year', Number(filter.year));
  }
  if (filter?.company && filter.company !== 'all') {
    query = query.eq('company', filter.company);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.warn('[Placements DAL] Supabase error fallback to mock:', error?.message);
    return MOCK_PLACEMENTS;
  }
  return data;
}

export async function getPlacementAggregates(filter?: {
  company?: string | 'all';
}): Promise<YearPlacementAggregate[]> {
  const all = await getPlacements({
    company: filter?.company === 'all' ? undefined : filter?.company,
  });

  const yearMap = new Map<number, { placed: number; eligible: number; packages: number[] }>();

  for (const item of all) {
    const existing = yearMap.get(item.year) ?? { placed: 0, eligible: 0, packages: [] };
    existing.placed += item.students_placed;
    existing.eligible += item.total_eligible;
    existing.packages.push(item.package_lpa);
    yearMap.set(item.year, existing);
  }

  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);

  return sortedYears.map((yr) => {
    const data = yearMap.get(yr)!;
    const notPlaced = Math.max(0, data.eligible - data.placed);
    const rate = data.eligible > 0 ? (data.placed / data.eligible) * 100 : 0;
    const avgPkg = data.packages.length > 0 ? data.packages.reduce((a, b) => a + b, 0) / data.packages.length : 0;
    const maxPkg = data.packages.length > 0 ? Math.max(...data.packages) : 0;

    return {
      year: yr,
      total_placed: data.placed,
      total_eligible: data.eligible,
      not_placed: notPlaced,
      placement_rate_pct: Number(rate.toFixed(1)),
      avg_package_lpa: Number(avgPkg.toFixed(2)),
      max_package_lpa: Number(maxPkg.toFixed(2)),
    };
  });
}

export async function getTopRecruiters(): Promise<RecruiterMetric[]> {
  return MOCK_RECRUITERS;
}
