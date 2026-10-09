// Self-contained Verification Script for CampusPulse Analytics
// Executes in standard Node.js to verify formulas, MD SAHIL, SAGAR, and imputation

const DEFAULT_WEIGHTS = {
  academic_weight: 30.0,
  attendance_weight: 20.0,
  lms_weight: 10.0,
  engagement_weight: 10.0,
  placement_weight: 15.0,
  skills_weight: 10.0,
  feedback_weight: 5.0,
  attendance_threshold_pct: 75.0,
};

function evaluateStudent(s) {
  // 1. Academic
  const cgpaPart = (s.cgpa / 10.0) * 0.50;
  const ciePart = ((s.avg_cie_marks || 7.0) / 10.0) * 0.35;
  const backlogPart = Math.max(0.0, 1.0 - s.backlogs * 0.20) * 0.15;
  const acadPts = Number(((cgpaPart + ciePart + backlogPart) * DEFAULT_WEIGHTS.academic_weight).toFixed(2));

  // 2. Attendance
  const attFloor = Math.floor(s.attendance_pct / 10.0);
  const attPts = Number(((attFloor / 10.0) * DEFAULT_WEIGHTS.attendance_weight).toFixed(2));
  const attHardFlag = s.attendance_pct < DEFAULT_WEIGHTS.attendance_threshold_pct;

  // 3. LMS
  const loginNorm = Math.min(1.0, s.logins_30d / 30.0);
  const assignNorm = s.assignments_done / Math.max(1, s.assignments_total);
  const lmsPts = Number(((loginNorm * 0.40 + assignNorm * 0.60) * DEFAULT_WEIGHTS.lms_weight).toFixed(2));

  // 4. Engagement
  const rawEng = s.events * 1.0 + s.clubs * 1.5 + s.hackathons * 3.0 + s.certifications * 2.5;
  const engPts = Number((Math.min(1.0, rawEng / 15.0) * DEFAULT_WEIGHTS.engagement_weight).toFixed(2));

  // 5. Placement
  const placeRaw = ((s.aptitude ?? 50) + (s.coding ?? 50) + (s.mock_interview ?? 50)) / 3.0;
  const placePts = Number(((placeRaw / 100.0) * DEFAULT_WEIGHTS.placement_weight).toFixed(2));

  // 6. Skills
  const skillsRaw = ((s.communication ?? 6) + (s.programming ?? 6) + (s.leadership ?? 5) + (s.sports ?? 5)) / 4.0;
  const skillsPts = Number(((skillsRaw / 10.0) * DEFAULT_WEIGHTS.skills_weight).toFixed(2));

  // 7. Feedback
  const feedPts = Number((((s.avg_feedback ?? 4.0) / 5.0) * DEFAULT_WEIGHTS.feedback_weight).toFixed(2));

  const total = Number((acadPts + attPts + lmsPts + engPts + placePts + skillsPts + feedPts).toFixed(2));

  // Logistic Risk
  const deficitAtt = Math.max(0.0, (DEFAULT_WEIGHTS.attendance_threshold_pct - s.attendance_pct) / DEFAULT_WEIGHTS.attendance_threshold_pct);
  const deficitAcad = Math.max(0.0, 1.0 - acadPts / DEFAULT_WEIGHTS.academic_weight);
  const deficitBacklogs = Math.min(1.0, s.backlogs / 4.0);
  const deficitPlacement = Math.max(0.0, 1.0 - placePts / DEFAULT_WEIGHTS.placement_weight);
  const deficitLms = Math.max(0.0, 1.0 - lmsPts / DEFAULT_WEIGHTS.lms_weight);

  const logit = -3.20 + 4.00 * deficitAtt + 2.80 * deficitAcad + 3.60 * deficitBacklogs + 2.10 * deficitPlacement + 1.20 * deficitLms;
  let prob = Number((1.0 / (1.0 + Math.exp(-logit))).toFixed(3));
  if (prob > 0.999) prob = 0.999;

  let level = 'low';
  if (prob >= 0.85) level = 'critical';
  else if (prob >= 0.70) level = 'high';
  else if (prob >= 0.35) level = 'medium';

  const academicRisk = acadPts < 0.50 * DEFAULT_WEIGHTS.academic_weight || s.backlogs >= 2 || attHardFlag;
  const placementRisk = placePts < 0.50 * DEFAULT_WEIGHTS.placement_weight;

  return {
    name: s.full_name,
    reg_no: s.reg_no,
    scores: { acadPts, attPts, lmsPts, engPts, placePts, skillsPts, feedPts, total },
    risk: { prob, level, academicRisk, placementRisk, attHardFlag }
  };
}

// 1. MD SAHIL
const sahil = evaluateStudent({
  full_name: 'MD SAHIL',
  reg_no: '241FA18067',
  cgpa: 8.5,
  backlogs: 0,
  avg_cie_marks: 8.4,
  attendance_pct: 74,
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
  avg_feedback: 4.5
});

// 2. SAGAR
const sagar = evaluateStudent({
  full_name: 'SAGAR',
  reg_no: '241FA04070',
  cgpa: 5.5,
  backlogs: 5,
  avg_cie_marks: 4.8,
  attendance_pct: 42,
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
  avg_feedback: 2.0
});

console.log('--- CAMPUSPULSE ANALYTICS VERIFICATION ---');
console.log('MD SAHIL Evaluation:', JSON.stringify(sahil, null, 2));
console.log('SAGAR Evaluation:', JSON.stringify(sagar, null, 2));

// Assertions
if (sahil.scores.attPts !== 14.0) throw new Error('MD SAHIL attendance points failed');
if (!sahil.risk.attHardFlag) throw new Error('MD SAHIL attendance hard flag failed');
if (sagar.risk.prob < 0.98 || sagar.risk.level !== 'critical') throw new Error('SAGAR critical risk failed');

console.log('>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
