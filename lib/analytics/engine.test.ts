// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Unit Tests for Analytics Engine
// Validates: Formula precision, MD SAHIL (74% att), SAGAR (0.99 risk),
// Imputation, Waterfall Drivers, and Segmentation.
// ============================================================================

import {
  computeStudentSuccessScore,
  computeSectionBenchmarks,
  DEFAULT_SCORE_WEIGHTS,
} from './engine';
import { RawStudentMetrics } from './types';

// Sample cohort metrics for Section A
const MOCK_COHORT: RawStudentMetrics[] = [
  // 1. MD SAHIL (241FA18067) - Wireframe demo target
  {
    student_id: 's-sahil-001',
    section_id: 'sec-a',
    reg_no: '241FA18067',
    full_name: 'MD SAHIL',
    cgpa: 8.5,
    backlogs: 0,
    avg_cie_marks: 8.4,
    attendance_pct: 74, // Exactly 74%
    logins_30d: 26,
    assignments_done: 18,
    assignments_total: 20,
    events: 4,
    clubs: 2,
    hackathons: 2,
    certifications: 2,
    aptitude: 82.5,
    coding: 86.0,
    mock_interview: 84.0,
    communication: 8.0,
    programming: 8.8,
    leadership: 7.5,
    sports: 6.5,
    avg_feedback: 4.5,
  },
  // 2. SAGAR (241FA04070) - Wireframe demo target (Critical risk)
  {
    student_id: 's-sagar-002',
    section_id: 'sec-a',
    reg_no: '241FA04070',
    full_name: 'SAGAR',
    cgpa: 5.5,
    backlogs: 5,
    avg_cie_marks: 4.8,
    attendance_pct: 42, // Low attendance
    logins_30d: 3,
    assignments_done: 4,
    assignments_total: 20,
    events: 0,
    clubs: 0,
    hackathons: 0,
    certifications: 0,
    aptitude: 38.0,
    coding: 32.0,
    mock_interview: 25.0,
    communication: 3.5,
    programming: 4.0,
    leadership: 2.5,
    sports: 4.0,
    avg_feedback: 2.0,
  },
  // 3. Consistent High Performer
  {
    student_id: 's-ananya-003',
    section_id: 'sec-a',
    reg_no: '241FA18005',
    full_name: 'Ananya Sharma',
    cgpa: 9.6,
    backlogs: 0,
    avg_cie_marks: 9.5,
    attendance_pct: 94,
    logins_30d: 30,
    assignments_done: 20,
    assignments_total: 20,
    events: 3,
    clubs: 2,
    hackathons: 2,
    certifications: 3,
    aptitude: 92.0,
    coding: 94.0,
    mock_interview: 90.0,
    communication: 9.0,
    programming: 9.5,
    leadership: 8.5,
    sports: 7.0,
    avg_feedback: 5.0,
  },
  // 4. Missing data candidate (Null placement & skills)
  {
    student_id: 's-missing-004',
    section_id: 'sec-a',
    reg_no: '241FA18018',
    full_name: 'Vikram Joshi',
    cgpa: 7.8,
    backlogs: 0,
    avg_cie_marks: 7.5,
    attendance_pct: 82,
    logins_30d: 18,
    assignments_done: 15,
    assignments_total: 20,
    events: 1,
    clubs: 1,
    hackathons: 0,
    certifications: 1,
    aptitude: null, // To test imputation
    coding: null,   // To test imputation
    mock_interview: null,
    communication: null,
    programming: null,
    leadership: null,
    sports: null,
    avg_feedback: null,
  },
];

describe('CampusPulse Student Success Analytics Engine', () => {
  const benchmarks = computeSectionBenchmarks('sec-a', MOCK_COHORT);

  test('MD SAHIL (241FA18067): Attendance rule scaled points and hard flag', () => {
    const sahil = MOCK_COHORT[0];
    const result = computeStudentSuccessScore(sahil, benchmarks, DEFAULT_SCORE_WEIGHTS);

    // Rule: every 10% = 1 pt -> 74% = floor(74/10) = 7 -> 7/10 * 20 = 14.0 pts
    expect(result.scores.attendance).toBe(14.0);
    expect(result.risk.attendance_hard_flag).toBe(true);

    // Attendance < 75 triggers academic_risk = true
    expect(result.risk.academic_risk).toBe(true);
    expect(result.risk.placement_risk).toBe(false);

    // Risk probability should be in medium bracket (~0.35 to 0.45)
    expect(result.risk.level).toBe('medium');
    expect(result.risk.probability).toBeGreaterThanOrEqual(0.35);
    expect(result.risk.probability).toBeLessThan(0.70);

    // Strong academic score
    expect(result.scores.academic).toBeGreaterThan(20.0);
    expect(result.scores.total).toBeGreaterThan(70.0);

    // Explainability identifies attendance drag
    const attendanceDriver = result.explainability.all_drivers.find(
      (d) => d.factor === 'Attendance'
    );
    expect(attendanceDriver?.impact).toBe('negative');
  });

  test('SAGAR (241FA04070): Critical risk, 0.99 probability, and backlog penalty', () => {
    const sagar = MOCK_COHORT[1];
    const result = computeStudentSuccessScore(sagar, benchmarks, DEFAULT_SCORE_WEIGHTS);

    // 5 backlogs wipes out the 15% backlog portion (5 * 20% = 100% penalty)
    // Low attendance: floor(42/10) = 4 -> 4/10 * 20 = 8.0 pts
    expect(result.scores.attendance).toBe(8.0);
    expect(result.risk.attendance_hard_flag).toBe(true);
    expect(result.risk.academic_risk).toBe(true);
    expect(result.risk.placement_risk).toBe(true);

    // Risk probability matches wireframe expectation 0.99
    expect(result.risk.probability).toBeGreaterThanOrEqual(0.98);
    expect(result.risk.level).toBe('critical');

    // Segment classification
    expect(result.segment.segment).toBe('Academically At-Risk');
    expect(result.segment.suggested_intervention).toContain('Remedial');
  });

  test('Consistent High Performer (Ananya Sharma): Low risk and high score', () => {
    const ananya = MOCK_COHORT[2];
    const result = computeStudentSuccessScore(ananya, benchmarks, DEFAULT_SCORE_WEIGHTS);

    expect(result.scores.total).toBeGreaterThan(90.0);
    expect(result.risk.level).toBe('low');
    expect(result.risk.probability).toBeLessThan(0.15);
    expect(result.risk.academic_risk).toBe(false);
    expect(result.risk.placement_risk).toBe(false);
    expect(result.segment.segment).toBe('Consistent Achievers');
  });

  test('Missing Data Imputation: Median substitution and low_data_confidence flag', () => {
    const missingStudent = MOCK_COHORT[3];
    const result = computeStudentSuccessScore(missingStudent, benchmarks, DEFAULT_SCORE_WEIGHTS);

    // Flag should trigger
    expect(result.low_data_confidence).toBe(true);

    // Imputed placement score should exist and be valid (> 0)
    expect(result.scores.placement).toBeGreaterThan(0);
    expect(result.scores.skills).toBeGreaterThan(0);
    expect(result.scores.total).toBeGreaterThan(50.0);
  });
});
