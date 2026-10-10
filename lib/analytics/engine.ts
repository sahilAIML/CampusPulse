// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// TypeScript Twin Analytics Engine (Exact Functional Parity with Postgres)
// ============================================================================

import {
  ScoreWeightsConfig,
  DEFAULT_SCORE_WEIGHTS,
  RawStudentMetrics,
  SectionBenchmarks,
  ComponentBreakdown,
  RiskAssessment,
  RiskLevel,
  ExplainabilityDriver,
  WaterfallExplainability,
  StudentSegment,
  SegmentClassification,
  StudentSuccessResult,
} from './types';

export { DEFAULT_SCORE_WEIGHTS };

// Helper: Median calculation
function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Computes Section Benchmarks from a cohort of raw student records.
 */
export function computeSectionBenchmarks(
  sectionId: string,
  students: RawStudentMetrics[],
  weights: ScoreWeightsConfig = DEFAULT_SCORE_WEIGHTS
): SectionBenchmarks {
  const sectionStudents = students.filter((s) => s.section_id === sectionId);
  const cohort = sectionStudents.length > 0 ? sectionStudents : students;

  const cgpas = cohort.map((s) => s.cgpa);
  const attendances = cohort.map((s) => s.attendance_pct);
  const codings = cohort.map((s) => s.coding ?? 50);
  const aptitudes = cohort.map((s) => s.aptitude ?? 50);
  const interviews = cohort.map((s) => s.mock_interview ?? 50);

  // Compute individual raw components without benchmark to establish section average
  const scoredCohort = cohort.map((s) => {
    // 1. Academic
    const cgpaPart = (s.cgpa / 10.0) * 0.50;
    const ciePart = ((s.avg_cie_marks ?? 7.0) / 10.0) * 0.35;
    const backlogPart = Math.max(0.0, 1.0 - s.backlogs * 0.20) * 0.15;
    const acadPts = (cgpaPart + ciePart + backlogPart) * weights.academic_weight;

    // 2. Attendance
    const attPts = (Math.floor(s.attendance_pct / 10.0) / 10.0) * weights.attendance_weight;

    // 3. LMS
    const lmsPts =
      (Math.min(1.0, s.logins_30d / 30.0) * 0.40 +
        s.assignments_done / Math.max(1, s.assignments_total) * 0.60) *
      weights.lms_weight;

    // 4. Engagement
    const engPts =
      Math.min(1.0, (s.events * 1.0 + s.clubs * 1.5 + s.hackathons * 3.0 + s.certifications * 2.5) / 15.0) *
      weights.engagement_weight;

    // 5. Placement
    const placePts =
      (((s.aptitude ?? 50) + (s.coding ?? 50) + (s.mock_interview ?? 50)) / 300.0) *
      weights.placement_weight;

    // 6. Skills
    const skillPts =
      (((s.communication ?? 6) + (s.programming ?? 6) + (s.leadership ?? 5) + (s.sports ?? 5)) / 40.0) *
      weights.skills_weight;

    // 7. Feedback
    const feedPts = ((s.avg_feedback ?? 4.0) / 5.0) * weights.feedback_weight;

    return {
      acad: acadPts,
      att: attPts,
      lms: lmsPts,
      eng: engPts,
      place: placePts,
      skills: skillPts,
      feed: feedPts,
      total: acadPts + attPts + lmsPts + engPts + placePts + skillPts + feedPts,
    };
  });

  const n = Math.max(1, scoredCohort.length);
  return {
    section_id: sectionId,
    median_cgpa: Number(calculateMedian(cgpas).toFixed(2)),
    median_attendance: Number(calculateMedian(attendances).toFixed(1)),
    median_coding: Number(calculateMedian(codings).toFixed(1)),
    median_aptitude: Number(calculateMedian(aptitudes).toFixed(1)),
    median_interview: Number(calculateMedian(interviews).toFixed(1)),
    avg_academic_pts: Number((scoredCohort.reduce((acc, c) => acc + c.acad, 0) / n).toFixed(2)),
    avg_attendance_pts: Number((scoredCohort.reduce((acc, c) => acc + c.att, 0) / n).toFixed(2)),
    avg_lms_pts: Number((scoredCohort.reduce((acc, c) => acc + c.lms, 0) / n).toFixed(2)),
    avg_engagement_pts: Number((scoredCohort.reduce((acc, c) => acc + c.eng, 0) / n).toFixed(2)),
    avg_placement_pts: Number((scoredCohort.reduce((acc, c) => acc + c.place, 0) / n).toFixed(2)),
    avg_skills_pts: Number((scoredCohort.reduce((acc, c) => acc + c.skills, 0) / n).toFixed(2)),
    avg_feedback_pts: Number((scoredCohort.reduce((acc, c) => acc + c.feed, 0) / n).toFixed(2)),
    avg_total_pts: Number((scoredCohort.reduce((acc, c) => acc + c.total, 0) / n).toFixed(2)),
  };
}

/**
 * Computes transparent logistic risk probability.
 */
export function calculateLogisticRisk(
  attendancePct: number,
  academicScore: number,
  backlogs: number,
  placementScore: number,
  lmsScore: number,
  weights: ScoreWeightsConfig
): RiskAssessment {
  const attendanceHardFlag = attendancePct < weights.attendance_threshold_pct;

  // Deficits scaled 0 to 1
  const deficitAtt = Math.max(0.0, (weights.attendance_threshold_pct - attendancePct) / weights.attendance_threshold_pct);
  const deficitAcad = Math.max(0.0, 1.0 - academicScore / weights.academic_weight);
  const deficitBacklogs = Math.min(1.0, backlogs / 4.0);
  const deficitPlacement = Math.max(0.0, 1.0 - placementScore / weights.placement_weight);
  const deficitLms = Math.max(0.0, 1.0 - lmsScore / weights.lms_weight);

  // Calibrated logistic regression weights
  const logit =
    -3.20 +
    4.00 * deficitAtt +
    2.80 * deficitAcad +
    3.60 * deficitBacklogs +
    2.10 * deficitPlacement +
    1.20 * deficitLms;

  let probability = Number((1.0 / (1.0 + Math.exp(-logit))).toFixed(3));
  if (probability > 0.999) probability = 0.999;
  if (probability < 0.01) probability = 0.01;

  let level: RiskLevel = 'low';
  if (probability >= 0.85) level = 'critical';
  else if (probability >= 0.70) level = 'high';
  else if (probability >= 0.35) level = 'medium';

  const academicRisk =
    academicScore < 0.50 * weights.academic_weight ||
    backlogs >= 2 ||
    attendanceHardFlag;

  const placementRisk = placementScore < 0.50 * weights.placement_weight;

  return {
    probability,
    level,
    academic_risk: academicRisk,
    placement_risk: placementRisk,
    attendance_hard_flag: attendanceHardFlag,
    deficits: {
      attendance: Number(deficitAtt.toFixed(2)),
      academic: Number(deficitAcad.toFixed(2)),
      backlogs: Number(deficitBacklogs.toFixed(2)),
      placement: Number(deficitPlacement.toFixed(2)),
      lms: Number(deficitLms.toFixed(2)),
    },
  };
}

/**
 * Builds waterfall explainability drivers comparing student metrics to section averages.
 */
export function generateWaterfallDrivers(
  scores: ComponentBreakdown,
  benchmarks: SectionBenchmarks,
  metrics: RawStudentMetrics,
  imputedCoding: number
): WaterfallExplainability {
  const drivers: ExplainabilityDriver[] = [
    {
      factor: 'Attendance',
      delta: Number((scores.attendance - benchmarks.avg_attendance_pts).toFixed(2)),
      student_val: `${metrics.attendance_pct}%`,
      benchmark_val: `${benchmarks.median_attendance}%`,
      impact: scores.attendance >= benchmarks.avg_attendance_pts ? 'positive' : 'negative',
      text:
        metrics.attendance_pct < 75.0
          ? `Attendance ${metrics.attendance_pct}% is below the mandatory 75% threshold (${(scores.attendance - benchmarks.avg_attendance_pts).toFixed(1)} pts vs section)`
          : `Consistent ${metrics.attendance_pct}% attendance provides score resilience (+${(scores.attendance - benchmarks.avg_attendance_pts).toFixed(1)} pts)`,
    },
    {
      factor: 'Academic Performance',
      delta: Number((scores.academic - benchmarks.avg_academic_pts).toFixed(2)),
      student_val: `CGPA ${metrics.cgpa} (${metrics.backlogs} backlogs)`,
      impact: scores.academic >= benchmarks.avg_academic_pts ? 'positive' : 'negative',
      text:
        metrics.backlogs > 0
          ? `${metrics.backlogs} active backlogs causing academic score penalty (${(scores.academic - benchmarks.avg_academic_pts).toFixed(1)} pts vs section)`
          : `Solid CGPA of ${metrics.cgpa} with zero backlogs (+${(scores.academic - benchmarks.avg_academic_pts).toFixed(1)} pts)`,
    },
    {
      factor: 'Placement Readiness',
      delta: Number((scores.placement - benchmarks.avg_placement_pts).toFixed(2)),
      student_val: `Coding ${Math.round(imputedCoding)}/100`,
      impact: scores.placement >= benchmarks.avg_placement_pts ? 'positive' : 'negative',
      text:
        imputedCoding < 50
          ? `Coding benchmark at ${Math.round(imputedCoding)}/100 needs diagnostic intervention`
          : `Strong coding & aptitude diagnostic (+${(scores.placement - benchmarks.avg_placement_pts).toFixed(1)} pts)`,
    },
    {
      factor: 'LMS Engagement',
      delta: Number((scores.lms - benchmarks.avg_lms_pts).toFixed(2)),
      student_val: `${metrics.logins_30d} logins, ${metrics.assignments_done}/${metrics.assignments_total} submitted`,
      impact: scores.lms >= benchmarks.avg_lms_pts ? 'positive' : 'negative',
      text:
        scores.lms < benchmarks.avg_lms_pts
          ? `LMS submission deficit of ${(scores.lms - benchmarks.avg_lms_pts).toFixed(1)} pts vs section cohort`
          : `High LMS activity with ${metrics.logins_30d} monthly portal logins`,
    },
    {
      factor: 'Extracurricular Engagement',
      delta: Number((scores.engagement - benchmarks.avg_engagement_pts).toFixed(2)),
      student_val: `${metrics.hackathons} hackathons, ${metrics.certifications} certs`,
      impact: scores.engagement >= benchmarks.avg_engagement_pts ? 'positive' : 'negative',
      text:
        metrics.hackathons > 0
          ? `Participation in ${metrics.hackathons} hackathons and ${metrics.certifications} certifications (+${(scores.engagement - benchmarks.avg_engagement_pts).toFixed(1)} pts)`
          : `Minimal extracurricular event participation`,
    },
    {
      factor: 'Technical Skills Matrix',
      delta: Number((scores.skills - benchmarks.avg_skills_pts).toFixed(2)),
      student_val: `Prog ${metrics.programming ?? 6}/10, Comm ${metrics.communication ?? 6}/10`,
      impact: scores.skills >= benchmarks.avg_skills_pts ? 'positive' : 'negative',
      text: `Composite skill rating variance of ${(scores.skills - benchmarks.avg_skills_pts).toFixed(1)} pts`,
    },
  ];

  const positives = drivers
    .filter((d) => d.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);

  const negatives = drivers
    .filter((d) => d.delta < 0)
    .sort((a, b) => a.delta - b.delta) // Most negative first
    .slice(0, 3);

  let primaryDrag = 'Performance is well aligned with section benchmarks.';
  if (negatives.length > 0) {
    const worst = negatives[0];
    primaryDrag = `${worst.factor} (${worst.student_val}) is the biggest drag (${worst.delta} pts).`;
  }

  return {
    top_positive: positives,
    top_negative: negatives,
    all_drivers: drivers,
    primary_drag_text: primaryDrag,
  };
}

/**
 * Classifies student into 1 of 5 Named Segments with actionable intervention guidance.
 */
export function classifySegment(
  metrics: RawStudentMetrics,
  scores: ComponentBreakdown,
  risk: RiskAssessment,
  imputedPlacementAvg: number
): SegmentClassification {
  // 1. High Academics / Low Placement Readiness
  if (metrics.cgpa >= 7.5 && imputedPlacementAvg < 55.0) {
    return {
      segment: 'High Academics / Low Placement Readiness',
      suggested_intervention: 'Enroll in intensive DSA coding bootcamp & 1-on-1 mock interview drill',
      rationale: `Strong academic standing (CGPA ${metrics.cgpa}) but placement aptitude/coding score (${Math.round(imputedPlacementAvg)}%) lags behind campus hiring thresholds.`,
    };
  }

  // 2. Consistent Achievers
  if (
    metrics.cgpa >= 7.5 &&
    metrics.attendance_pct >= 75.0 &&
    metrics.backlogs === 0 &&
    risk.level === 'low'
  ) {
    return {
      segment: 'Consistent Achievers',
      suggested_intervention: 'Nominate for tier-1 product hackathons, student mentor roles, and research assistantships',
      rationale: 'Exemplary stability across attendance, CIE marks, LMS, and zero backlog risk.',
    };
  }

  // 3. Disengaged but Capable
  if (
    metrics.cgpa >= 6.5 &&
    (metrics.attendance_pct < 75.0 || scores.lms < 5.0) &&
    (metrics.coding ?? 50) >= 60.0
  ) {
    return {
      segment: 'Disengaged but Capable',
      suggested_intervention: 'Schedule personalized faculty counseling to identify root causes of attendance drop',
      rationale: `Demonstrates high technical capability (coding ${metrics.coding}/100) but risks debarment due to attendance slipping to ${metrics.attendance_pct}%.`,
    };
  }

  // 4. Academically At-Risk
  if (metrics.backlogs >= 2 || metrics.cgpa < 6.0 || scores.academic < 15.0) {
    return {
      segment: 'Academically At-Risk',
      suggested_intervention: 'Mandatory remedial tutorial clinic and bi-weekly guardian progress review',
      rationale: `${metrics.backlogs} pending backlogs and low academic score index demand structured remediation before end-semester exams.`,
    };
  }

  // 5. Skill-Strong, Marks-Weak
  if (metrics.cgpa < 7.0 && ((metrics.programming ?? 5) >= 7.5 || metrics.hackathons >= 2)) {
    return {
      segment: 'Skill-Strong, Marks-Weak',
      suggested_intervention: 'Provide structured exam writing strategies and CIE concept reinforcement',
      rationale: `High practical and extracurricular aptitude (${metrics.hackathons} hackathons) contrast with modest examination marks (CGPA ${metrics.cgpa}).`,
    };
  }

  // Fallback to Consistent Achievers if no distress flags
  return {
    segment: 'Consistent Achievers',
    suggested_intervention: 'Regular mentoring and ongoing milestone reviews',
    rationale: 'Steady performance across fundamental parameters.',
  };
}

/**
 * Main analytical evaluation function for a single student.
 */
export function computeStudentSuccessScore(
  student: RawStudentMetrics,
  benchmarks: SectionBenchmarks,
  weights: ScoreWeightsConfig = DEFAULT_SCORE_WEIGHTS
): StudentSuccessResult {
  // Check for missing data requiring imputation
  const lowDataConfidence =
    student.aptitude == null ||
    student.coding == null ||
    student.mock_interview == null ||
    student.communication == null ||
    student.programming == null;

  // Impute missing placement metrics from section benchmarks
  const imputedAptitude = student.aptitude ?? benchmarks.median_aptitude ?? 50.0;
  const imputedCoding = student.coding ?? benchmarks.median_coding ?? 50.0;
  const imputedInterview = student.mock_interview ?? benchmarks.median_interview ?? 50.0;

  // Impute missing skills metrics
  const imputedComm = student.communication ?? 6.0;
  const imputedProg = student.programming ?? 6.0;
  const imputedLead = student.leadership ?? 5.0;
  const imputedSports = student.sports ?? 5.0;

  // Impute feedback
  const imputedFeedback = student.avg_feedback ?? 4.0;

  // 1. Academic: CGPA (50%) + CIE (35%) - Backlog Penalty (15% base, -20% of that per backlog)
  const cgpaPart = (student.cgpa / 10.0) * 0.50;
  const ciePart = ((student.avg_cie_marks ?? (student.cgpa * 0.95)) / 10.0) * 0.35;
  const backlogPart = Math.max(0.0, 1.0 - student.backlogs * 0.20) * 0.15;
  const academicNorm = Math.min(1.0, Math.max(0.0, cgpaPart + ciePart + backlogPart));
  const scoreAcademic = Number((academicNorm * weights.academic_weight).toFixed(2));

  // 2. Attendance: rule "every 10% = 1 pt" (74% -> 7), scaled to 10, then multiplied by weight
  const attPointsOutOf10 = Math.floor(student.attendance_pct / 10.0);
  const attendanceNorm = Math.min(1.0, Math.max(0.0, attPointsOutOf10 / 10.0));
  const scoreAttendance = Number((attendanceNorm * weights.attendance_weight).toFixed(2));

  // 3. LMS: login frequency (40%) + assignment completion (60%)
  const loginNorm = Math.min(1.0, student.logins_30d / 30.0);
  const assignNorm = student.assignments_done / Math.max(1, student.assignments_total);
  const lmsNorm = Math.min(1.0, Math.max(0.0, loginNorm * 0.40 + assignNorm * 0.60));
  const scoreLms = Number((lmsNorm * weights.lms_weight).toFixed(2));

  // 4. Engagement: events + clubs + hackathons + certifications (capped at 15 raw)
  const rawEngagement =
    student.events * 1.0 +
    student.clubs * 1.5 +
    student.hackathons * 3.0 +
    student.certifications * 2.5;
  const engagementNorm = Math.min(1.0, Math.max(0.0, rawEngagement / 15.0));
  const scoreEngagement = Number((engagementNorm * weights.engagement_weight).toFixed(2));

  // 5. Placement: aptitude + coding + mock interview (0-100 each, averaged)
  const placementRawAvg = (imputedAptitude + imputedCoding + imputedInterview) / 3.0;
  const placementNorm = Math.min(1.0, Math.max(0.0, placementRawAvg / 100.0));
  const scorePlacement = Number((placementNorm * weights.placement_weight).toFixed(2));

  // 6. Skills: comm, prog, lead, sports (0-10)
  const skillsRawAvg = (imputedComm + imputedProg + imputedLead + imputedSports) / 4.0;
  const skillsNorm = Math.min(1.0, Math.max(0.0, skillsRawAvg / 10.0));
  const scoreSkills = Number((skillsNorm * weights.skills_weight).toFixed(2));

  // 7. Feedback: rating (1-5)
  const feedbackNorm = Math.min(1.0, Math.max(0.0, imputedFeedback / 5.0));
  const scoreFeedback = Number((feedbackNorm * weights.feedback_weight).toFixed(2));

  // Total Success Score (0-100)
  const scoreTotal = Number(
    (
      scoreAcademic +
      scoreAttendance +
      scoreLms +
      scoreEngagement +
      scorePlacement +
      scoreSkills +
      scoreFeedback
    ).toFixed(2)
  );

  const scores: ComponentBreakdown = {
    academic: scoreAcademic,
    attendance: scoreAttendance,
    lms: scoreLms,
    engagement: scoreEngagement,
    placement: scorePlacement,
    skills: scoreSkills,
    feedback: scoreFeedback,
    total: scoreTotal,
  };

  // Risk Assessment
  const risk = calculateLogisticRisk(
    student.attendance_pct,
    scoreAcademic,
    student.backlogs,
    scorePlacement,
    scoreLms,
    weights
  );

  // Explainability Waterfall
  const explainability = generateWaterfallDrivers(scores, benchmarks, student, imputedCoding);

  // Segmentation
  const segment = classifySegment(student, scores, risk, placementRawAvg);

  return {
    student_id: student.student_id,
    reg_no: student.reg_no,
    computed_at: new Date().toISOString(),
    scores,
    risk,
    explainability,
    segment,
    low_data_confidence: lowDataConfidence,
  };
}

/**
 * Batch processor for an entire section or institution.
 */
export function batchComputeStudentScores(
  students: RawStudentMetrics[],
  weights: ScoreWeightsConfig = DEFAULT_SCORE_WEIGHTS
): StudentSuccessResult[] {
  // Group students by section
  const sectionMap = new Map<string, RawStudentMetrics[]>();
  for (const s of students) {
    const list = sectionMap.get(s.section_id) ?? [];
    list.push(s);
    sectionMap.set(s.section_id, list);
  }

  const results: StudentSuccessResult[] = [];

  for (const [secId, secStudents] of Array.from(sectionMap.entries())) {
    const benchmarks = computeSectionBenchmarks(secId, secStudents, weights);
    for (const student of secStudents) {
      results.push(computeStudentSuccessScore(student, benchmarks, weights));
    }
  }

  return results;
}
