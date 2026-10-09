-- ============================================================================
-- CAMPUSPULSE: SMART CAMPUS ANALYTICS
-- Migration 002: Analytical Views
-- v_student_unified, v_section_summary, v_placement_trend
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. VIEW: v_student_unified
-- Single cohesive, null-safe student view joining all academic, behavioral,
-- engagement, and risk score dimensions.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_student_unified AS
WITH student_marks AS (
  SELECT
    student_id,
    ROUND(AVG(COALESCE(f1, 0.0)), 2) AS avg_f1,
    ROUND(AVG(COALESCE(f2, 0.0)), 2) AS avg_f2,
    ROUND(AVG(COALESCE(semester_exam, 0.0)), 2) AS avg_semester_exam,
    COUNT(id) AS evaluated_subjects_count
  FROM public.academic_marks
  GROUP BY student_id
),
student_att AS (
  SELECT
    student_id,
    SUM(COALESCE(held, 0)) AS total_classes_held,
    SUM(COALESCE(attended, 0)) AS total_classes_attended,
    CASE 
      WHEN SUM(COALESCE(held, 0)) > 0 
      THEN ROUND((SUM(COALESCE(attended, 0))::NUMERIC / SUM(held)::NUMERIC) * 100.0, 2)
      ELSE 0.00
    END AS attendance_pct
  FROM public.attendance
  GROUP BY student_id
),
student_feed AS (
  SELECT
    student_id,
    ROUND(AVG(rating)::NUMERIC, 2) AS avg_feedback_rating,
    COUNT(id) AS feedback_count
  FROM public.feedback
  WHERE student_id IS NOT NULL
  GROUP BY student_id
),
student_interv AS (
  SELECT
    student_id,
    COUNT(id) FILTER (WHERE status IN ('pending', 'in_progress', 'escalated')) AS active_interventions_count,
    COUNT(id) AS total_interventions_count
  FROM public.interventions
  GROUP BY student_id
),
student_exam AS (
  SELECT
    student_id,
    COUNT(id) AS exams_attempted,
    ROUND(AVG(score), 2) AS avg_exam_score
  FROM public.exam_attempts
  GROUP BY student_id
)
SELECT
  -- Student Identity
  s.id AS student_id,
  s.reg_no,
  COALESCE(p.full_name, 'Unknown Student') AS full_name,
  COALESCE(p.email, LOWER(s.reg_no) || '@college.edu.in') AS email,
  p.avatar_url,
  p.role AS profile_role,

  -- Section & Dept Hierarchy
  s.section_id,
  sec.name AS section_name,
  sec.year AS academic_year,
  d.id AS dept_id,
  d.name AS dept_name,
  d.code AS dept_code,

  -- Academic Profile
  COALESCE(s.cgpa, 0.00) AS cgpa,
  COALESCE(s.backlogs, 0) AS backlogs,
  COALESCE(sm.avg_f1, 0.00) AS avg_f1,
  COALESCE(sm.avg_f2, 0.00) AS avg_f2,
  COALESCE(sm.avg_semester_exam, 0.00) AS avg_semester_exam,
  COALESCE(sm.evaluated_subjects_count, 0) AS evaluated_subjects_count,

  -- Attendance Metrics
  COALESCE(sa.total_classes_held, 0) AS total_classes_held,
  COALESCE(sa.total_classes_attended, 0) AS total_classes_attended,
  COALESCE(sa.attendance_pct, 0.00) AS attendance_pct,

  -- LMS Engagement
  COALESCE(lms.logins_30d, 0) AS lms_logins_30d,
  COALESCE(lms.assignments_done, 0) AS lms_assignments_done,
  COALESCE(lms.assignments_total, 0) AS lms_assignments_total,
  CASE 
    WHEN COALESCE(lms.assignments_total, 0) > 0 
    THEN ROUND((COALESCE(lms.assignments_done, 0)::NUMERIC / lms.assignments_total::NUMERIC) * 100.0, 2)
    ELSE 0.00
  END AS lms_completion_pct,
  COALESCE(lms.avg_time_min, 0.0) AS lms_avg_time_min,

  -- Extracurricular & Co-curricular
  COALESCE(eng.events, 0) AS engagement_events,
  COALESCE(eng.clubs, 0) AS engagement_clubs,
  COALESCE(eng.hackathons, 0) AS engagement_hackathons,
  COALESCE(eng.certifications, 0) AS engagement_certifications,
  (COALESCE(eng.events, 0) + COALESCE(eng.clubs, 0) + COALESCE(eng.hackathons, 0) * 2 + COALESCE(eng.certifications, 0) * 2) AS engagement_score_raw,

  -- Placement Readiness (0-100)
  COALESCE(pr.aptitude, 0.00) AS placement_aptitude,
  COALESCE(pr.coding, 0.00) AS placement_coding,
  COALESCE(pr.mock_interview, 0.00) AS placement_mock_interview,
  ROUND(((COALESCE(pr.aptitude, 0.00) + COALESCE(pr.coding, 0.00) + COALESCE(pr.mock_interview, 0.00)) / 3.0), 2) AS placement_readiness_avg,

  -- Skills Matrix (0-10)
  COALESCE(sk.communication, 0.0) AS skill_communication,
  COALESCE(sk.programming, 0.0) AS skill_programming,
  COALESCE(sk.leadership, 0.0) AS skill_leadership,
  COALESCE(sk.sports, 0.0) AS skill_sports,
  ROUND(((COALESCE(sk.communication, 0.0) + COALESCE(sk.programming, 0.0) + COALESCE(sk.leadership, 0.0) + COALESCE(sk.sports, 0.0)) / 4.0), 2) AS skill_composite_avg,

  -- Portfolios & Profiles
  s.leetcode_url,
  s.codechef_url,
  s.linkedin_url,
  s.github_url,

  -- Feedback & Interventions
  COALESCE(sf.avg_feedback_rating, 0.00) AS avg_feedback_rating,
  COALESCE(sf.feedback_count, 0) AS feedback_count,
  COALESCE(si.active_interventions_count, 0) AS active_interventions_count,
  COALESCE(si.total_interventions_count, 0) AS total_interventions_count,

  -- Exams
  COALESCE(se.exams_attempted, 0) AS exams_attempted,
  COALESCE(se.avg_exam_score, 0.00) AS avg_exam_score,

  -- Success & Early Warning AI Scores
  COALESCE(ss.total, 0.00) AS success_score_total,
  COALESCE(ss.academic, 0.00) AS score_academic,
  COALESCE(ss.attendance, 0.00) AS score_attendance,
  COALESCE(ss.lms, 0.00) AS score_lms,
  COALESCE(ss.engagement, 0.00) AS score_engagement,
  COALESCE(ss.placement, 0.00) AS score_placement,
  COALESCE(ss.skills, 0.00) AS score_skills,
  COALESCE(ss.feedback, 0.00) AS score_feedback,
  COALESCE(ss.risk_probability, 0.000) AS risk_probability,
  COALESCE(ss.risk_level, 'low') AS risk_level,
  COALESCE(ss.academic_risk, FALSE) AS academic_risk,
  COALESCE(ss.placement_risk, FALSE) AS placement_risk,
  COALESCE(ss.segment, 'Consistent Performer') AS segment,
  COALESCE(ss.drivers, '[]'::jsonb) AS risk_drivers,
  ss.computed_at AS score_computed_at,

  -- Metadata
  s.created_at AS student_created_at,
  s.updated_at AS student_updated_at

FROM public.students s
LEFT JOIN public.profiles p ON s.profile_id = p.id
JOIN public.sections sec ON s.section_id = sec.id
JOIN public.departments d ON sec.dept_id = d.id
LEFT JOIN student_marks sm ON sm.student_id = s.id
LEFT JOIN student_att sa ON sa.student_id = s.id
LEFT JOIN public.lms_activity lms ON lms.student_id = s.id
LEFT JOIN public.engagement eng ON eng.student_id = s.id
LEFT JOIN public.placement_readiness pr ON pr.student_id = s.id
LEFT JOIN public.skills sk ON sk.student_id = s.id
LEFT JOIN student_feed sf ON sf.student_id = s.id
LEFT JOIN student_interv si ON si.student_id = s.id
LEFT JOIN student_exam se ON se.student_id = s.id
LEFT JOIN public.success_scores ss ON ss.student_id = s.id;

-- ----------------------------------------------------------------------------
-- 2. VIEW: v_section_summary
-- Aggregated section-level performance metrics, risk breakdown, and alert thresholds.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_section_summary AS
SELECT
  sec.id AS section_id,
  sec.name AS section_name,
  sec.year AS academic_year,
  d.id AS dept_id,
  d.name AS dept_name,
  d.code AS dept_code,
  COUNT(u.student_id) AS total_students,
  ROUND(AVG(u.cgpa), 2) AS avg_cgpa,
  ROUND(AVG(u.attendance_pct), 2) AS avg_attendance_pct,
  ROUND(AVG(u.success_score_total), 2) AS avg_success_score,
  ROUND(AVG(u.risk_probability)::NUMERIC, 3) AS avg_risk_probability,
  SUM(u.backlogs) AS total_backlogs,
  COUNT(u.student_id) FILTER (WHERE u.risk_level = 'critical') AS critical_risk_count,
  COUNT(u.student_id) FILTER (WHERE u.risk_level = 'high') AS high_risk_count,
  COUNT(u.student_id) FILTER (WHERE u.risk_level = 'medium') AS medium_risk_count,
  COUNT(u.student_id) FILTER (WHERE u.risk_level = 'low') AS low_risk_count,
  COUNT(u.student_id) FILTER (WHERE u.attendance_pct < 75.0) AS attendance_shortage_count,
  COUNT(u.student_id) FILTER (WHERE u.active_interventions_count > 0) AS students_with_active_interventions
FROM public.sections sec
JOIN public.departments d ON sec.dept_id = d.id
LEFT JOIN public.v_student_unified u ON u.section_id = sec.id
GROUP BY sec.id, sec.name, sec.year, d.id, d.name, d.code;

-- ----------------------------------------------------------------------------
-- 3. VIEW: v_placement_trend
-- Multi-year placement metrics, company offers, salary bands, and success rates.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_placement_trend AS
SELECT
  p.year,
  p.company,
  p.students_placed,
  p.total_eligible,
  ROUND((p.students_placed::NUMERIC / NULLIF(p.total_eligible, 0)::NUMERIC) * 100.0, 2) AS placement_rate_pct,
  p.package_lpa,
  -- Aggregated year level stats via window functions
  ROUND(AVG(p.package_lpa) OVER (PARTITION BY p.year), 2) AS year_avg_package_lpa,
  MAX(p.package_lpa) OVER (PARTITION BY p.year) AS year_max_package_lpa,
  SUM(p.students_placed) OVER (PARTITION BY p.year) AS year_total_placed,
  SUM(p.total_eligible) OVER (PARTITION BY p.year) AS year_total_eligible
FROM public.placements p
ORDER BY p.year DESC, p.package_lpa DESC;
