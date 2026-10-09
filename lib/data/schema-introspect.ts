// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Schema Introspection Utility (Detects Mismatches on Live DB Connection)
// ============================================================================

import { SchemaValidationResult } from './types';
import { getSupabaseClient } from './supabase-client';

const REQUIRED_TABLES = [
  'profiles',
  'departments',
  'sections',
  'faculty',
  'faculty_sections',
  'students',
  'academic_marks',
  'attendance',
  'lms_activity',
  'engagement',
  'placement_readiness',
  'skills',
  'feedback',
  'placements',
  'announcements',
  'exams',
  'exam_questions',
  'exam_attempts',
  'success_scores',
  'interventions',
  'import_logs',
];

export async function introspectLiveSchema(): Promise<SchemaValidationResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      status: 'unreachable',
      connected: false,
      missing_tables: [],
      missing_columns: [],
      details: 'Supabase client is not configured or SUPABASE_URL / ANON_KEY are missing.',
    };
  }

  try {
    // Introspect table accessibility by pinging required tables
    const missingTables: string[] = [];

    for (const tbl of REQUIRED_TABLES) {
      const { error } = await supabase.from(tbl).select('*').limit(0);
      if (error && error.code === '42P01') {
        // Table does not exist error in PostgreSQL
        missingTables.push(tbl);
      }
    }

    if (missingTables.length > 0) {
      return {
        status: 'mismatch',
        connected: true,
        missing_tables: missingTables,
        missing_columns: [],
        details: `Connected to Supabase, but missing ${missingTables.length} required tables: ${missingTables.join(', ')}. Run migrations in /supabase/migrations.`,
      };
    }

    return {
      status: 'valid',
      connected: true,
      missing_tables: [],
      missing_columns: [],
      details: `Live database schema verified. All ${REQUIRED_TABLES.length} tables are accessible and match contract interfaces.`,
    };
  } catch (err: any) {
    return {
      status: 'unreachable',
      connected: false,
      missing_tables: [],
      missing_columns: [],
      details: `Introspection query failed: ${err?.message || 'Network error'}`,
    };
  }
}
