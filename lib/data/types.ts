// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Typed Data-Access Layer - Contract Interfaces
// ============================================================================

export type AnnouncementType =
  | 'time_change'
  | 'reschedule'
  | 'fest'
  | 'extra_class'
  | 'sports'
  | 'exam';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  audience: string;
  created_at: string;
  created_by_name?: string;
  created_by_role?: string;
}

export interface PlacementRecord {
  id: string;
  company: string;
  year: number;
  students_placed: number;
  total_eligible: number;
  package_lpa: number;
  roles?: string[];
}

export interface YearPlacementAggregate {
  year: number;
  total_placed: number;
  total_eligible: number;
  not_placed: number;
  placement_rate_pct: number;
  avg_package_lpa: number;
  max_package_lpa: number;
}

export interface RecruiterMetric {
  company: string;
  total_hires: number;
  avg_package_lpa: number;
  top_year: number;
  industry: string;
}

export interface CampusPulseStats {
  students_tracked: number;
  at_risk_caught_early: number;
  placement_rate_pct: number;
  active_interventions: number;
  sections_monitored: number;
  average_cgpa: number;
}

export type UserRole = 'admin' | 'faculty' | 'student';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  reg_no?: string; // e.g. 241FA18067 or FAC210
  section?: string;
}

export interface SchemaValidationResult {
  status: 'valid' | 'mismatch' | 'unreachable';
  connected: boolean;
  missing_tables: string[];
  missing_columns: { table: string; column: string }[];
  details: string;
}
