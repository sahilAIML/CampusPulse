-- ============================================================================
-- CAMPUSPULSE: SMART CAMPUS ANALYTICS
-- Migration 004: Analytics Engine & Configurable Success Score Engine
-- Weights configuration table, Postgres analytical function, and automated triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SCORE WEIGHTS CONFIG TABLE (Tunable by Administrators)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.score_weights_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_weight NUMERIC(5,2) NOT NULL DEFAULT 30.00,
  attendance_weight NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  lms_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  engagement_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  placement_weight NUMERIC(5,2) NOT NULL DEFAULT 15.00,
  skills_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  feedback_weight NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  attendance_threshold_pct NUMERIC(5,2) NOT NULL DEFAULT 75.00,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_total_weights CHECK (
    (academic_weight + attendance_weight + lms_weight + engagement_weight + placement_weight + skills_weight + feedback_weight) = 100.00
  )
);

-- Seed default weights
INSERT INTO public.score_weights_config (
  academic_weight, attendance_weight, lms_weight, engagement_weight,
  placement_weight, skills_weight, feedback_weight, attendance_threshold_pct, active
) VALUES (
  30.00, 20.00, 10.00, 10.00, 15.00, 10.00, 5.00, 75.00, TRUE
)
ON CONFLICT DO NOTHING;

-- RLS for score_weights_config
ALTER TABLE public.score_weights_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "score_weights_read_all" ON public.score_weights_config
  FOR SELECT TO authenticated, anon
  USING (TRUE);

CREATE POLICY "score_weights_admin_all" ON public.score_weights_config
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. POSTGRES ANALYTICS FUNCTION: recompute_student_success_scores
-- Computes explainable success scores (0-100), risk probabilities,
-- waterfall explainability drivers, and named segmentation for students.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recompute_student_success_scores(
  p_student_id UUID DEFAULT NULL,
  p_section_id UUID DEFAULT NULL
)
RETURNS TABLE (
  processed_students INT,
  updated_at_ts TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cfg RECORD;
  v_processed INT := 0;
BEGIN
  -- Fetch active config weights
  SELECT * INTO v_cfg 
  FROM public.score_weights_config 
  WHERE active = TRUE 
  ORDER BY created_at DESC 
  LIMIT 1;

  IF v_cfg IS NULL THEN
    v_cfg.academic_weight := 30.00;
    v_cfg.attendance_weight := 20.00;
    v_cfg.lms_weight := 10.00;
    v_cfg.engagement_weight := 10.00;
    v_cfg.placement_weight := 15.00;
    v_cfg.skills_weight := 10.00;
    v_cfg.feedback_weight := 5.00;
    v_cfg.attendance_threshold_pct := 75.00;
  END IF;

  -- Temporary calculations CTE & Upsert
  WITH student_raw AS (
    SELECT 
      s.id AS student_id,
      s.section_id,
      s.reg_no,
      COALESCE(s.cgpa, 0.00) AS cgpa,
      COALESCE(s.backlogs, 0) AS backlogs,
      -- Marks
      COALESCE((
        SELECT AVG(COALESCE((m.f1 + m.f2)/2.0, m.f1, m.f2, 0.0))
        FROM public.academic_marks m WHERE m.student_id = s.id
      ), 0.00) AS avg_cie_marks, -- out of 10
      -- Attendance
      COALESCE((
        SELECT CASE 
          WHEN SUM(COALESCE(a.held, 0)) > 0 
          THEN (SUM(COALESCE(a.attended, 0))::NUMERIC / SUM(a.held)::NUMERIC) * 100.0 
          ELSE 0.00 END
        FROM public.attendance a WHERE a.student_id = s.id
      ), 0.00) AS attendance_pct,
      -- LMS
      COALESCE(l.logins_30d, 0) AS logins_30d,
      COALESCE(l.assignments_done, 0) AS assignments_done,
      COALESCE(l.assignments_total, 20) AS assignments_total,
      -- Engagement
      COALESCE(e.events, 0) AS events,
      COALESCE(e.clubs, 0) AS clubs,
      COALESCE(e.hackathons, 0) AS hackathons,
      COALESCE(e.certifications, 0) AS certifications,
      -- Placement
      pr.aptitude AS pr_aptitude,
      pr.coding AS pr_coding,
      pr.mock_interview AS pr_mock_interview,
      -- Skills
      sk.communication AS sk_comm,
      sk.programming AS sk_prog,
      sk.leadership AS sk_lead,
      sk.sports AS sk_sports,
      -- Feedback
      COALESCE((SELECT AVG(rating) FROM public.feedback fb WHERE fb.student_id = s.id), 4.0) AS avg_feedback
    FROM public.students s
    LEFT JOIN public.lms_activity l ON l.student_id = s.id
    LEFT JOIN public.engagement e ON e.student_id = s.id
    LEFT JOIN public.placement_readiness pr ON pr.student_id = s.id
    LEFT JOIN public.skills sk ON sk.student_id = s.id
    WHERE (p_student_id IS NULL OR s.id = p_student_id)
      AND (p_section_id IS NULL OR s.section_id = p_section_id)
  ),
  -- Section Medians for Missing Value Imputation
  section_benchmarks AS (
    SELECT 
      section_id,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY cgpa) AS med_cgpa,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY attendance_pct) AS med_att,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY COALESCE(pr_coding, 50.0)) AS med_coding,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY COALESCE(pr_aptitude, 50.0)) AS med_aptitude,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY COALESCE(pr_mock_interview, 50.0)) AS med_interview
    FROM student_raw
    GROUP BY section_id
  ),
  normalized_components AS (
    SELECT
      r.student_id,
      r.section_id,
      r.reg_no,
      -- Imputation checks
      (r.pr_aptitude IS NULL OR r.pr_coding IS NULL OR r.pr_mock_interview IS NULL OR r.sk_comm IS NULL) AS low_data_confidence,
      
      -- 1. ACADEMIC COMPONENT (Weight 30)
      -- CGPA (50%) + CIE F1/F2 (35%) - Backlog Penalty (15% base, -20% of that per backlog)
      ROUND((
        ( (r.cgpa / 10.0) * 0.50 +
          (LEAST(10.0, r.avg_cie_marks) / 10.0) * 0.35 +
          (GREATEST(0.0, 1.0 - (r.backlogs * 0.20))) * 0.15
        ) * v_cfg.academic_weight
      )::NUMERIC, 2) AS score_academic,

      -- 2. ATTENDANCE COMPONENT (Weight 20)
      -- Rule: every 10% = 1 pt (74% -> 7), scaled to 10, then multiplied by weight
      ROUND((
        (FLOOR(r.attendance_pct / 10.0) / 10.0) * v_cfg.attendance_weight
      )::NUMERIC, 2) AS score_attendance,
      (r.attendance_pct < v_cfg.attendance_threshold_pct) AS attendance_hard_flag,
      r.attendance_pct,

      -- 3. LMS COMPONENT (Weight 10)
      -- Login frequency (40%) + Assignment completion (60%)
      ROUND((
        ( LEAST(1.0, r.logins_30d::NUMERIC / 30.0) * 0.40 +
          (r.assignments_done::NUMERIC / GREATEST(1, r.assignments_total)::NUMERIC) * 0.60
        ) * v_cfg.lms_weight
      )::NUMERIC, 2) AS score_lms,

      -- 4. ENGAGEMENT COMPONENT (Weight 10)
      -- Capped & normalised (Events*1 + Clubs*1.5 + Hackathons*3 + Certs*2.5) / 15.0
      ROUND((
        LEAST(1.0, (r.events * 1.0 + r.clubs * 1.5 + r.hackathons * 3.0 + r.certifications * 2.5) / 15.0) * v_cfg.engagement_weight
      )::NUMERIC, 2) AS score_engagement,

      -- 5. PLACEMENT READINESS COMPONENT (Weight 15)
      -- Aptitude, Coding, Mock Interview (imputing section median if missing)
      ROUND((
        ( (COALESCE(r.pr_aptitude, b.med_aptitude, 50.0) / 100.0) +
          (COALESCE(r.pr_coding, b.med_coding, 50.0) / 100.0) +
          (COALESCE(r.pr_mock_interview, b.med_interview, 50.0) / 100.0)
        ) / 3.0 * v_cfg.placement_weight
      )::NUMERIC, 2) AS score_placement,
      COALESCE(r.pr_coding, b.med_coding, 50.0) AS coding_val,
      COALESCE(r.pr_aptitude, b.med_aptitude, 50.0) AS aptitude_val,
      COALESCE(r.pr_mock_interview, b.med_interview, 50.0) AS interview_val,

      -- 6. SKILLS COMPONENT (Weight 10)
      -- Comm, Prog, Lead, Sports (0-10)
      ROUND((
        ( (COALESCE(r.sk_comm, 6.0) / 10.0) +
          (COALESCE(r.sk_prog, 6.0) / 10.0) +
          (COALESCE(r.sk_lead, 5.0) / 10.0) +
          (COALESCE(r.sk_sports, 5.0) / 10.0)
        ) / 4.0 * v_cfg.skills_weight
      )::NUMERIC, 2) AS score_skills,
      COALESCE(r.sk_prog, 6.0) AS skill_prog_val,

      -- 7. FEEDBACK COMPONENT (Weight 5)
      ROUND((
        (r.avg_feedback / 5.0) * v_cfg.feedback_weight
      )::NUMERIC, 2) AS score_feedback,

      -- Raw baseline values for risk & segment rules
      r.cgpa,
      r.backlogs,
      r.hackathons
    FROM student_raw r
    JOIN section_benchmarks b ON b.section_id = r.section_id
  ),
  aggregated_scores AS (
    SELECT
      nc.*,
      ROUND((nc.score_academic + nc.score_attendance + nc.score_lms + nc.score_engagement + nc.score_placement + nc.score_skills + nc.score_feedback)::NUMERIC, 2) AS total_score,
      
      -- Risk Conditions
      (nc.score_academic < (0.50 * v_cfg.academic_weight) OR nc.backlogs >= 2 OR nc.attendance_hard_flag) AS is_academic_risk,
      (((nc.aptitude_val + nc.coding_val + nc.interview_val)/3.0 < 50.0) OR (nc.coding_val < 40.0 AND nc.cgpa >= 7.0)) AS is_placement_risk,

      -- Deficits for Logistic Regression
      GREATEST(0.0, (v_cfg.attendance_threshold_pct - nc.attendance_pct) / v_cfg.attendance_threshold_pct) AS deficit_att,
      GREATEST(0.0, 1.0 - (nc.score_academic / v_cfg.academic_weight)) AS deficit_acad,
      LEAST(1.0, nc.backlogs / 4.0) AS deficit_backlogs,
      GREATEST(0.0, 1.0 - (nc.score_placement / v_cfg.placement_weight)) AS deficit_placement,
      GREATEST(0.0, 1.0 - (nc.score_lms / v_cfg.lms_weight)) AS deficit_lms
    FROM normalized_components nc
  ),
  final_analytics AS (
    SELECT
      a.*,
      -- Logistic combination calibrated for SAGAR (0.99) & MD SAHIL (0.38)
      ROUND((
        1.0 / (1.0 + EXP(-(
          -3.20 + 
          (4.00 * a.deficit_att) + 
          (2.80 * a.deficit_acad) + 
          (3.60 * a.deficit_backlogs) + 
          (2.10 * a.deficit_placement) + 
          (1.20 * a.deficit_lms)
        )))
      )::NUMERIC, 3) AS risk_prob,

      -- Named Segment Assignment (K-Means Centroid / Rule Partition)
      CASE
        WHEN a.cgpa >= 7.5 AND ((a.aptitude_val + a.coding_val + a.interview_val)/3.0) < 55.0 
          THEN 'High Academics / Low Placement Readiness'
        WHEN a.cgpa >= 7.5 AND a.attendance_pct >= 75.0 AND a.backlogs = 0 AND a.total_score >= 75.0
          THEN 'Consistent Achievers'
        WHEN a.cgpa >= 6.5 AND (a.attendance_pct < 75.0 OR a.score_lms < 5.0) AND a.coding_val >= 60.0
          THEN 'Disengaged but Capable'
        WHEN a.backlogs >= 2 OR a.cgpa < 6.0 OR a.score_academic < 15.0
          THEN 'Academically At-Risk'
        WHEN a.cgpa < 7.0 AND (a.skill_prog_val >= 7.5 OR a.hackathons >= 2)
          THEN 'Skill-Strong, Marks-Weak'
        ELSE 'Consistent Achievers'
      END AS segment_name,

      -- Section benchmark comparison for Explainability Waterfall Drivers
      AVG(a.total_score) OVER (PARTITION BY a.section_id) AS sec_avg_total,
      AVG(a.score_academic) OVER (PARTITION BY a.section_id) AS sec_avg_acad,
      AVG(a.score_attendance) OVER (PARTITION BY a.section_id) AS sec_avg_att,
      AVG(a.score_lms) OVER (PARTITION BY a.section_id) AS sec_avg_lms,
      AVG(a.score_engagement) OVER (PARTITION BY a.section_id) AS sec_avg_eng,
      AVG(a.score_placement) OVER (PARTITION BY a.section_id) AS sec_avg_place,
      AVG(a.score_skills) OVER (PARTITION BY a.section_id) AS sec_avg_skills
    FROM aggregated_scores a
  ),
  with_explainability AS (
    SELECT
      f.*,
      CASE 
        WHEN f.risk_prob >= 0.85 THEN 'critical'
        WHEN f.risk_prob >= 0.70 THEN 'high'
        WHEN f.risk_prob >= 0.35 THEN 'medium'
        ELSE 'low'
      END AS final_risk_level,
      
      -- Drivers Waterfall JSON construction
      jsonb_build_array(
        jsonb_build_object(
          'factor', 'Attendance',
          'delta', ROUND((f.score_attendance - f.sec_avg_att)::NUMERIC, 2),
          'current_val', f.attendance_pct || '%',
          'benchmark_val', ROUND((f.sec_avg_att * 5.0)::NUMERIC, 1) || '%',
          'impact', CASE WHEN (f.score_attendance - f.sec_avg_att) < 0 THEN 'negative' ELSE 'positive' END,
          'text', CASE 
            WHEN f.attendance_pct < 75.0 THEN 'Attendance ' || f.attendance_pct || '% is a critical drag (' || ROUND((f.score_attendance - f.sec_avg_att)::NUMERIC, 1) || ' pts vs section)'
            ELSE 'Consistent ' || f.attendance_pct || '% attendance provides strong stability (+' || ROUND((f.score_attendance - f.sec_avg_att)::NUMERIC, 1) || ' pts)'
          END
        ),
        jsonb_build_object(
          'factor', 'Academic Performance',
          'delta', ROUND((f.score_academic - f.sec_avg_acad)::NUMERIC, 2),
          'current_val', 'CGPA ' || f.cgpa || ' (' || f.backlogs || ' backlogs)',
          'impact', CASE WHEN (f.score_academic - f.sec_avg_acad) < 0 THEN 'negative' ELSE 'positive' END,
          'text', CASE 
            WHEN f.backlogs > 0 THEN f.backlogs || ' backlogs incurring heavy penalty (' || ROUND((f.score_academic - f.sec_avg_acad)::NUMERIC, 1) || ' pts)'
            ELSE 'Strong academic base with CGPA ' || f.cgpa || ' (+' || ROUND((f.score_academic - f.sec_avg_acad)::NUMERIC, 1) || ' pts)'
          END
        ),
        jsonb_build_object(
          'factor', 'Placement Readiness',
          'delta', ROUND((f.score_placement - f.sec_avg_place)::NUMERIC, 2),
          'current_val', 'Coding ' || ROUND(f.coding_val::NUMERIC, 0) || '/100',
          'impact', CASE WHEN (f.score_placement - f.sec_avg_place) < 0 THEN 'negative' ELSE 'positive' END,
          'text', CASE 
            WHEN f.coding_val < 50 THEN 'Low coding diagnostic of ' || ROUND(f.coding_val::NUMERIC, 0) || '/100 drags placement readiness'
            ELSE 'High coding and aptitude readiness (+' || ROUND((f.score_placement - f.sec_avg_place)::NUMERIC, 1) || ' pts)'
          END
        ),
        jsonb_build_object(
          'factor', 'LMS & Assignments',
          'delta', ROUND((f.score_lms - f.sec_avg_lms)::NUMERIC, 2),
          'impact', CASE WHEN (f.score_lms - f.sec_avg_lms) < 0 THEN 'negative' ELSE 'positive' END,
          'text', 'LMS engagement difference of ' || ROUND((f.score_lms - f.sec_avg_lms)::NUMERIC, 1) || ' pts vs section average'
        )
      ) AS computed_drivers
    FROM final_analytics f
  )
  -- Perform Upsert into success_scores
  INSERT INTO public.success_scores (
    student_id, computed_at, total, academic, attendance, lms, engagement, placement,
    skills, feedback, risk_probability, risk_level, academic_risk, placement_risk,
    segment, drivers
  )
  SELECT
    w.student_id,
    NOW(),
    w.total_score,
    w.score_academic,
    w.score_attendance,
    w.score_lms,
    w.score_engagement,
    w.score_placement,
    w.score_skills,
    w.score_feedback,
    w.risk_prob,
    w.final_risk_level,
    w.is_academic_risk,
    w.is_placement_risk,
    w.segment_name,
    w.computed_drivers
  FROM with_explainability w
  ON CONFLICT (student_id) DO UPDATE SET
    computed_at = EXCLUDED.computed_at,
    total = EXCLUDED.total,
    academic = EXCLUDED.academic,
    attendance = EXCLUDED.attendance,
    lms = EXCLUDED.lms,
    engagement = EXCLUDED.engagement,
    placement = EXCLUDED.placement,
    skills = EXCLUDED.skills,
    feedback = EXCLUDED.feedback,
    risk_probability = EXCLUDED.risk_probability,
    risk_level = EXCLUDED.risk_level,
    academic_risk = EXCLUDED.academic_risk,
    placement_risk = EXCLUDED.placement_risk,
    segment = EXCLUDED.segment,
    drivers = EXCLUDED.drivers;

  GET DIAGNOSTICS v_processed = ROW_COUNT;

  RETURN QUERY SELECT v_processed, NOW();
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. RECOMPUTE TRIGGER FUNCTIONS
-- Recalculates scores when academic marks or attendance are modified.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_recompute_on_student_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.recompute_student_success_scores(
    COALESCE(NEW.student_id, OLD.student_id),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind triggers to underlying tables
DROP TRIGGER IF EXISTS trg_recompute_marks ON public.academic_marks;
CREATE TRIGGER trg_recompute_marks
AFTER INSERT OR UPDATE OR DELETE ON public.academic_marks
FOR EACH ROW EXECUTE FUNCTION public.trigger_recompute_on_student_change();

DROP TRIGGER IF EXISTS trg_recompute_attendance ON public.attendance;
CREATE TRIGGER trg_recompute_attendance
AFTER INSERT OR UPDATE OR DELETE ON public.attendance
FOR EACH ROW EXECUTE FUNCTION public.trigger_recompute_on_student_change();

DROP TRIGGER IF EXISTS trg_recompute_placement ON public.placement_readiness;
CREATE TRIGGER trg_recompute_placement
AFTER INSERT OR UPDATE OR DELETE ON public.placement_readiness
FOR EACH ROW EXECUTE FUNCTION public.trigger_recompute_on_student_change();
