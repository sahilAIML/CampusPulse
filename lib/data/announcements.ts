// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Data Access Layer: Announcements (Mock / Supabase Switcher)
// ============================================================================

import { Announcement, AnnouncementType } from './types';
import { MOCK_ANNOUNCEMENTS } from './mock-store';
import { getSupabaseClient, isSupabaseConfigured } from './supabase-client';

export async function getAnnouncements(filter?: {
  type?: AnnouncementType | 'all';
  search?: string;
}): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    // Mock Mode
    let list = [...MOCK_ANNOUNCEMENTS];

    if (filter?.type && filter.type !== 'all') {
      list = list.filter((a) => a.type === filter.type);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Supabase Mode
  const supabase = getSupabaseClient();
  if (!supabase) return MOCK_ANNOUNCEMENTS;

  let query = supabase
    .from('announcements')
    .select(`
      id,
      title,
      body,
      type,
      audience,
      created_at,
      profiles:created_by (full_name, role)
    `)
    .order('created_at', { ascending: false });

  if (filter?.type && filter.type !== 'all') {
    query = query.eq('type', filter.type);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.warn('[Announcements DAL] Supabase error fallback to mock:', error?.message);
    return MOCK_ANNOUNCEMENTS;
  }

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    type: item.type,
    audience: item.audience,
    created_at: item.created_at,
    created_by_name: item.profiles?.full_name ?? 'Faculty Office',
    created_by_role: item.profiles?.role ?? 'faculty',
  }));
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const all = await getAnnouncements();
  return all.find((a) => a.id === id) ?? null;
}
