// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Analytics Engine Type Definitions
// ============================================================================

export interface ScoreWeightsConfig {
  academic_weight: number;      // Default: 30
  attendance_weight: number;    // Default: 20
  lms_weight: number;           // Default: 10
  engagement_weight: number;    // Default: 10
  placement_weight: number;     // Default: 15
  skills_weight: number;        // Default: 10
  feedback_weight: number;      // Default: 5
  attendance_threshold_pct: number; // Default: 75%
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeightsConfig = {
  academic_weight: 30.0,
  attendance_weight: 20.0,
  lms_weight: 10.0,
  engagement_weight: 10.0,
  placement_weight: 15.0,
  skills_weight: 10.0,
  feedback_weight: 5.0,
  attendance_threshold_pct: 75.0,
};

export interface RawStudentMetrics {
  student_id: string;
  section_id: string;
  reg_no: string;
  full_name?: string;
  cgpa: number;
  backlogs: number;
  avg_cie_marks?: number; // F1, F2 average out of 10
  attendance_pct: number; // 0 - 100
  logins_30d: number;
  assignments_done: number;
  assignments_total: number;
  events: number;
  clubs: number;
  hackathons: number;
  certifications: number;
  aptitude?: number | null; // 0 - 100
  coding?: number | null;   // 0 - 100
  mock_interview?: number | null; // 0 - 100
  communication?: number | null; // 0 - 10
  programming?: number | null;   // 0 - 10
  leadership?: number | null;    // 0 - 10
  sports?: number | null;        // 0 - 10
  avg_feedback?: number | null;  // 1 - 5
}

export interface SectionBenchmarks {
  section_id: string;
  median_cgpa: number;
  median_attendance: number;
  median_coding: number;
  median_aptitude: number;
  median_interview: number;
  avg_academic_pts: number;
  avg_attendance_pts: number;
  avg_lms_pts: number;
  avg_engagement_pts: number;
  avg_placement_pts: number;
  avg_skills_pts: number;
  avg_feedback_pts: number;
  avg_total_pts: number;
}

export interface ComponentBreakdown {
  academic: number;    // Out of academic_weight
  attendance: number;  // Out of attendance_weight
  lms: number;         // Out of lms_weight
  engagement: number;  // Out of engagement_weight
  placement: number;   // Out of placement_weight
  skills: number;      // Out of skills_weight
  feedback: number;    // Out of feedback_weight
  total: number;       // Sum: 0 - 100
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
  probability: number; // 0.000 to 1.000 (e.g. 0.38, 0.99)
  level: RiskLevel;
  academic_risk: boolean;
  placement_risk: boolean;
  attendance_hard_flag: boolean;
  deficits: {
    attendance: number;
    academic: number;
    backlogs: number;
    placement: number;
    lms: number;
  };
}

export interface ExplainabilityDriver {
  factor: string;
  delta: number; // Difference from section average (+ or -)
  student_val: string;
  benchmark_val?: string;
  impact: 'positive' | 'negative' | 'neutral';
  text: string;
}

export interface WaterfallExplainability {
  top_positive: ExplainabilityDriver[];
  top_negative: ExplainabilityDriver[];
  all_drivers: ExplainabilityDriver[];
  primary_drag_text: string;
}

export type StudentSegment =
  | 'High Academics / Low Placement Readiness'
  | 'Consistent Achievers'
  | 'Disengaged but Capable'
  | 'Academically At-Risk'
  | 'Skill-Strong, Marks-Weak';

export interface SegmentClassification {
  segment: StudentSegment;
  suggested_intervention: string;
  rationale: string;
}

export interface StudentSuccessResult {
  student_id: string;
  reg_no: string;
  computed_at: string;
  scores: ComponentBreakdown;
  risk: RiskAssessment;
  explainability: WaterfallExplainability;
  segment: SegmentClassification;
  low_data_confidence: boolean;
}
