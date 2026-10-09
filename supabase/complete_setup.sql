-- ============================================================================
-- CAMPUSPULSE: COMPLETE DATABASE INITIALIZATION SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================================


-- ============================================================================
-- SOURCE: supabase/migrations/20261009000001_initial_schema.sql
-- ============================================================================

-- ============================================================================
-- CAMPUSPULSE: SMART CAMPUS ANALYTICS
-- Migration 001: Initial Core Schema
-- Tables, UUIDs, Indexes, Foreign Keys, Triggers
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- Automatic updated_at timestamp trigger function
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE TRIGGER set_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 2. DEPARTMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- 'CSE', 'ECE', 'AIDS', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments(code);

CREATE TRIGGER set_departments_timestamp
BEFORE UPDATE ON public.departments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 3. SECTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'A', 'B', 'C'
  dept_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  year INT NOT NULL CHECK (year >= 1 AND year <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_dept_year_section UNIQUE (dept_id, year, name)
);

CREATE INDEX IF NOT EXISTS idx_sections_dept_id ON public.sections(dept_id);
CREATE INDEX IF NOT EXISTS idx_sections_year ON public.sections(year);

CREATE TRIGGER set_sections_timestamp
BEFORE UPDATE ON public.sections
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 4. FACULTY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no TEXT NOT NULL UNIQUE, -- 'FAC210'
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  designation TEXT DEFAULT 'Assistant Professor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_reg_no ON public.faculty(reg_no);
CREATE INDEX IF NOT EXISTS idx_faculty_profile_id ON public.faculty(profile_id);

CREATE TRIGGER set_faculty_timestamp
BEFORE UPDATE ON public.faculty
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 5. FACULTY_SECTIONS (Section Assignments)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_faculty_section UNIQUE (faculty_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_faculty_sections_faculty_id ON public.faculty_sections(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_sections_section_id ON public.faculty_sections(section_id);

CREATE TRIGGER set_faculty_sections_timestamp
BEFORE UPDATE ON public.faculty_sections
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 6. STUDENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no TEXT NOT NULL UNIQUE, -- '241FA18067'
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  cgpa NUMERIC(3,2) CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
  backlogs INT NOT NULL DEFAULT 0 CHECK (backlogs >= 0),
  leetcode_url TEXT,
  codechef_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_reg_no ON public.students(reg_no);
CREATE INDEX IF NOT EXISTS idx_students_section_id ON public.students(section_id);
CREATE INDEX IF NOT EXISTS idx_students_profile_id ON public.students(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON public.students(cgpa);
CREATE INDEX IF NOT EXISTS idx_students_backlogs ON public.students(backlogs);

CREATE TRIGGER set_students_timestamp
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 7. ACADEMIC_MARKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  f1 NUMERIC(4,1) CHECK (f1 >= 0.0 AND f1 <= 10.0), -- scored out of 10
  f2 NUMERIC(4,1) CHECK (f2 >= 0.0 AND f2 <= 10.0), -- scored out of 10
  semester_exam NUMERIC(5,2) CHECK (semester_exam >= 0.0),
  max_marks NUMERIC(5,2) NOT NULL DEFAULT 100.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_subject_marks UNIQUE (student_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_academic_marks_student_id ON public.academic_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_academic_marks_subject ON public.academic_marks(subject);

CREATE TRIGGER set_academic_marks_timestamp
BEFORE UPDATE ON public.academic_marks
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 8. ATTENDANCE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  held INT NOT NULL CHECK (held >= 0),
  attended INT NOT NULL CHECK (attended >= 0 AND attended <= held),
  month TEXT NOT NULL, -- e.g. '2026-08', '2026-09', 'Overall'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_subject_month UNIQUE (student_id, subject, month)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject ON public.attendance(subject);
CREATE INDEX IF NOT EXISTS idx_attendance_month ON public.attendance(month);

CREATE TRIGGER set_attendance_timestamp
BEFORE UPDATE ON public.attendance
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 9. LMS_ACTIVITY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lms_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  logins_30d INT NOT NULL DEFAULT 0 CHECK (logins_30d >= 0),
  assignments_done INT NOT NULL DEFAULT 0 CHECK (assignments_done >= 0),
  assignments_total INT NOT NULL DEFAULT 0 CHECK (assignments_total >= 0),
  avg_time_min NUMERIC(6,1) NOT NULL DEFAULT 0 CHECK (avg_time_min >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_activity_student_id ON public.lms_activity(student_id);

CREATE TRIGGER set_lms_activity_timestamp
BEFORE UPDATE ON public.lms_activity
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 10. ENGAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  events INT NOT NULL DEFAULT 0 CHECK (events >= 0),
  clubs INT NOT NULL DEFAULT 0 CHECK (clubs >= 0),
  hackathons INT NOT NULL DEFAULT 0 CHECK (hackathons >= 0),
  certifications INT NOT NULL DEFAULT 0 CHECK (certifications >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_engagement_student_id ON public.engagement(student_id);

CREATE TRIGGER set_engagement_timestamp
BEFORE UPDATE ON public.engagement
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 11. PLACEMENT_READINESS (0-100 scale)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  aptitude NUMERIC(5,2) CHECK (aptitude >= 0.0 AND aptitude <= 100.0),
  coding NUMERIC(5,2) CHECK (coding >= 0.0 AND coding <= 100.0),
  mock_interview NUMERIC(5,2) CHECK (mock_interview >= 0.0 AND mock_interview <= 100.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_placement_readiness_student_id ON public.placement_readiness(student_id);

CREATE TRIGGER set_placement_readiness_timestamp
BEFORE UPDATE ON public.placement_readiness
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 12. SKILLS (0-10 scale)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  communication NUMERIC(3,1) CHECK (communication >= 0.0 AND communication <= 10.0),
  programming NUMERIC(3,1) CHECK (programming >= 0.0 AND programming <= 10.0),
  leadership NUMERIC(3,1) CHECK (leadership >= 0.0 AND leadership <= 10.0),
  sports NUMERIC(3,1) CHECK (sports >= 0.0 AND sports <= 10.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_student_id ON public.skills(student_id);

CREATE TRIGGER set_skills_timestamp
BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 13. FEEDBACK
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  author_role TEXT NOT NULL CHECK (author_role IN ('faculty', 'student', 'admin', 'mentor')),
  category TEXT NOT NULL CHECK (category IN ('academics', 'conduct', 'placement', 'attendance', 'general')),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_student_id ON public.feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_faculty_id ON public.feedback(faculty_id);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);

CREATE TRIGGER set_feedback_timestamp
BEFORE UPDATE ON public.feedback
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 14. PLACEMENTS (Historical & Trends)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  year INT NOT NULL CHECK (year >= 2000 AND year <= 2050),
  students_placed INT NOT NULL CHECK (students_placed >= 0),
  total_eligible INT NOT NULL CHECK (total_eligible >= students_placed),
  package_lpa NUMERIC(5,2) NOT NULL CHECK (package_lpa >= 0.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_company_year UNIQUE (company, year)
);

CREATE INDEX IF NOT EXISTS idx_placements_year ON public.placements(year);
CREATE INDEX IF NOT EXISTS idx_placements_company ON public.placements(company);

CREATE TRIGGER set_placements_timestamp
BEFORE UPDATE ON public.placements
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 15. ANNOUNCEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('time_change', 'reschedule', 'fest', 'extra_class', 'sports', 'exam')),
  audience TEXT NOT NULL DEFAULT 'all', -- 'all', 'faculty', 'students', or section_id string
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_type ON public.announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON public.announcements(audience);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);

CREATE TRIGGER set_announcements_timestamp
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 16. EXAMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  total_marks NUMERIC(5,2) NOT NULL CHECK (total_marks > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exams_section_id ON public.exams(section_id);
CREATE INDEX IF NOT EXISTS idx_exams_status ON public.exams(status);

CREATE TRIGGER set_exams_timestamp
BEFORE UPDATE ON public.exams
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 17. EXAM_QUESTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL, -- e.g. ["Option A", "Option B", "Option C", "Option D"]
  correct_index INT NOT NULL CHECK (correct_index >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON public.exam_questions(exam_id);

CREATE TRIGGER set_exam_questions_timestamp
BEFORE UPDATE ON public.exam_questions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 18. EXAM_ATTEMPTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0.0),
  rank_cached INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_exam_attempt UNIQUE (exam_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student_id ON public.exam_attempts(student_id);

CREATE TRIGGER set_exam_attempts_timestamp
BEFORE UPDATE ON public.exam_attempts
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 19. SUCCESS_SCORES (Computed Analytics & Early Warning)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.success_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total NUMERIC(5,2) NOT NULL CHECK (total >= 0.0 AND total <= 100.0),
  academic NUMERIC(5,2) NOT NULL CHECK (academic >= 0.0 AND academic <= 100.0),
  attendance NUMERIC(5,2) NOT NULL CHECK (attendance >= 0.0 AND attendance <= 100.0),
  lms NUMERIC(5,2) NOT NULL CHECK (lms >= 0.0 AND lms <= 100.0),
  engagement NUMERIC(5,2) NOT NULL CHECK (engagement >= 0.0 AND engagement <= 100.0),
  placement NUMERIC(5,2) NOT NULL CHECK (placement >= 0.0 AND placement <= 100.0),
  skills NUMERIC(5,2) NOT NULL CHECK (skills >= 0.0 AND skills <= 100.0),
  feedback NUMERIC(5,2) NOT NULL CHECK (feedback >= 0.0 AND feedback <= 100.0),
  risk_probability NUMERIC(4,3) NOT NULL CHECK (risk_probability >= 0.000 AND risk_probability <= 1.000),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  academic_risk BOOLEAN NOT NULL DEFAULT FALSE,
  placement_risk BOOLEAN NOT NULL DEFAULT FALSE,
  segment TEXT NOT NULL CHECK (segment IN ('High Flyer', 'Consistent Performer', 'Attendance Risk', 'Academic Support Needed', 'Disengaged', 'Critical Intervention')),
  drivers JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of factor explanations e.g. [{"factor": "attendance", "impact": "negative", "detail": "Attendance < 75%"}]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_success_scores_student_id ON public.success_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_success_scores_risk_level ON public.success_scores(risk_level);
CREATE INDEX IF NOT EXISTS idx_success_scores_segment ON public.success_scores(segment);
CREATE INDEX IF NOT EXISTS idx_success_scores_total ON public.success_scores(total);

CREATE TRIGGER set_success_scores_timestamp
BEFORE UPDATE ON public.success_scores
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 20. INTERVENTIONS (Faculty Action Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('mentoring', 'remedial_class', 'parent_meeting', 'counseling', 'placement_training', 'attendance_warning')),
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON public.interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_created_by ON public.interventions(created_by);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON public.interventions(status);

CREATE TRIGGER set_interventions_timestamp
BEFORE UPDATE ON public.interventions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 21. IMPORT_LOGS (Audit & Cleansing Ingestion Tracker)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- e.g. 'sis_students_csv', 'marks_cie_csv', 'attendance_rfid_csv'
  rows_ok INT NOT NULL DEFAULT 0 CHECK (rows_ok >= 0),
  rows_failed INT NOT NULL DEFAULT 0 CHECK (rows_failed >= 0),
  errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_logs_source ON public.import_logs(source);
CREATE INDEX IF NOT EXISTS idx_import_logs_created_at ON public.import_logs(created_at DESC);

CREATE TRIGGER set_import_logs_timestamp
BEFORE UPDATE ON public.import_logs
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ============================================================================
-- SOURCE: supabase/migrations/20261009000002_views.sql
-- ============================================================================

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


-- ============================================================================
-- SOURCE: supabase/migrations/20261009000003_rls_policies.sql
-- ============================================================================

-- ============================================================================
-- CAMPUSPULSE: SMART CAMPUS ANALYTICS
-- Migration 003: Row Level Security (RLS) & Policies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- Optimized lookup functions for role and scope enforcement in policies.
-- ----------------------------------------------------------------------------

-- Get user role from profiles
CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN COALESCE(v_role, 'anon');
END;
$$;

-- Check if current authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN public.auth_role() = 'admin';
END;
$$;

-- Get faculty ID for current auth user
CREATE OR REPLACE FUNCTION public.current_faculty_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_faculty_id UUID;
BEGIN
  SELECT id INTO v_faculty_id
  FROM public.faculty
  WHERE profile_id = auth.uid();
  RETURN v_faculty_id;
END;
$$;

-- Get student ID for current auth user
CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_student_id UUID;
BEGIN
  SELECT id INTO v_student_id
  FROM public.students
  WHERE profile_id = auth.uid();
  RETURN v_student_id;
END;
$$;

-- Check if current user is faculty assigned to given section
CREATE OR REPLACE FUNCTION public.is_faculty_for_section(target_section_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM public.faculty_sections fs
    JOIN public.faculty f ON fs.faculty_id = f.id
    WHERE f.profile_id = auth.uid()
      AND fs.section_id = target_section_id
  );
END;
$$;

-- Check if current user is faculty assigned to given student's section
CREATE OR REPLACE FUNCTION public.is_faculty_for_student(target_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_section_id UUID;
BEGIN
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;

  SELECT section_id INTO v_section_id
  FROM public.students
  WHERE id = target_student_id;

  IF v_section_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN public.is_faculty_for_section(v_section_id);
END;
$$;

-- ----------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY ACROSS ALL TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. POLICIES: PROFILES
-- ----------------------------------------------------------------------------
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "profiles_read_all_authenticated" ON public.profiles
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ----------------------------------------------------------------------------
-- 4. POLICIES: DEPARTMENTS & SECTIONS
-- ----------------------------------------------------------------------------
CREATE POLICY "departments_read_public" ON public.departments
  FOR SELECT TO authenticated, anon
  USING (TRUE);

CREATE POLICY "departments_admin_all" ON public.departments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "sections_read_public" ON public.sections
  FOR SELECT TO authenticated, anon
  USING (TRUE);

CREATE POLICY "sections_admin_all" ON public.sections
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. POLICIES: FACULTY & FACULTY_SECTIONS
-- ----------------------------------------------------------------------------
CREATE POLICY "faculty_read_authenticated" ON public.faculty
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "faculty_admin_all" ON public.faculty
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "faculty_sections_read" ON public.faculty_sections
  FOR SELECT TO authenticated
  USING (public.is_admin() OR faculty_id = public.current_faculty_id());

CREATE POLICY "faculty_sections_admin_all" ON public.faculty_sections
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. POLICIES: STUDENTS
-- ----------------------------------------------------------------------------
CREATE POLICY "students_admin_all" ON public.students
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "students_faculty_select" ON public.students
  FOR SELECT TO authenticated
  USING (
    public.auth_role() = 'faculty' 
    AND public.is_faculty_for_section(section_id)
  );

CREATE POLICY "students_faculty_update" ON public.students
  FOR UPDATE TO authenticated
  USING (
    public.auth_role() = 'faculty' 
    AND public.is_faculty_for_section(section_id)
  )
  WITH CHECK (
    public.auth_role() = 'faculty' 
    AND public.is_faculty_for_section(section_id)
  );

CREATE POLICY "students_self_select" ON public.students
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "students_self_update" ON public.students
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 7. POLICIES: ACADEMIC_MARKS
-- ----------------------------------------------------------------------------
CREATE POLICY "academic_marks_admin_all" ON public.academic_marks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "academic_marks_faculty_all" ON public.academic_marks
  FOR ALL TO authenticated
  USING (public.is_faculty_for_student(student_id))
  WITH CHECK (public.is_faculty_for_student(student_id));

CREATE POLICY "academic_marks_student_select" ON public.academic_marks
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 8. POLICIES: ATTENDANCE
-- ----------------------------------------------------------------------------
CREATE POLICY "attendance_admin_all" ON public.attendance
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "attendance_faculty_all" ON public.attendance
  FOR ALL TO authenticated
  USING (public.is_faculty_for_student(student_id))
  WITH CHECK (public.is_faculty_for_student(student_id));

CREATE POLICY "attendance_student_select" ON public.attendance
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 9. POLICIES: LMS_ACTIVITY
-- ----------------------------------------------------------------------------
CREATE POLICY "lms_admin_all" ON public.lms_activity
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "lms_faculty_select" ON public.lms_activity
  FOR SELECT TO authenticated
  USING (public.is_faculty_for_student(student_id));

CREATE POLICY "lms_student_select" ON public.lms_activity
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 10. POLICIES: ENGAGEMENT
-- ----------------------------------------------------------------------------
CREATE POLICY "engagement_admin_all" ON public.engagement
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "engagement_faculty_select" ON public.engagement
  FOR SELECT TO authenticated
  USING (public.is_faculty_for_student(student_id));

CREATE POLICY "engagement_student_select" ON public.engagement
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

CREATE POLICY "engagement_student_update" ON public.engagement
  FOR UPDATE TO authenticated
  USING (student_id = public.current_student_id())
  WITH CHECK (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 11. POLICIES: PLACEMENT_READINESS
-- ----------------------------------------------------------------------------
CREATE POLICY "placement_readiness_admin_all" ON public.placement_readiness
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "placement_readiness_faculty_all" ON public.placement_readiness
  FOR ALL TO authenticated
  USING (public.is_faculty_for_student(student_id))
  WITH CHECK (public.is_faculty_for_student(student_id));

CREATE POLICY "placement_readiness_student_select" ON public.placement_readiness
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 12. POLICIES: SKILLS
-- ----------------------------------------------------------------------------
CREATE POLICY "skills_admin_all" ON public.skills
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "skills_faculty_all" ON public.skills
  FOR ALL TO authenticated
  USING (public.is_faculty_for_student(student_id))
  WITH CHECK (public.is_faculty_for_student(student_id));

CREATE POLICY "skills_student_select" ON public.skills
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 13. POLICIES: FEEDBACK
-- ----------------------------------------------------------------------------
CREATE POLICY "feedback_admin_all" ON public.feedback
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "feedback_faculty_select" ON public.feedback
  FOR SELECT TO authenticated
  USING (
    faculty_id = public.current_faculty_id()
    OR (student_id IS NOT NULL AND public.is_faculty_for_student(student_id))
  );

CREATE POLICY "feedback_faculty_insert" ON public.feedback
  FOR INSERT TO authenticated
  WITH CHECK (public.auth_role() = 'faculty');

CREATE POLICY "feedback_student_select" ON public.feedback
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

CREATE POLICY "feedback_student_insert" ON public.feedback
  FOR INSERT TO authenticated
  WITH CHECK (public.auth_role() = 'student' AND student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 14. POLICIES: PLACEMENTS (Public read for campus analytics)
-- ----------------------------------------------------------------------------
CREATE POLICY "placements_read_public" ON public.placements
  FOR SELECT TO authenticated, anon
  USING (TRUE);

CREATE POLICY "placements_admin_all" ON public.placements
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 15. POLICIES: ANNOUNCEMENTS (Public read)
-- ----------------------------------------------------------------------------
CREATE POLICY "announcements_read_public" ON public.announcements
  FOR SELECT TO authenticated, anon
  USING (TRUE);

CREATE POLICY "announcements_admin_faculty_write" ON public.announcements
  FOR ALL TO authenticated
  USING (public.is_admin() OR public.auth_role() = 'faculty')
  WITH CHECK (public.is_admin() OR public.auth_role() = 'faculty');

-- ----------------------------------------------------------------------------
-- 16. POLICIES: EXAMS & EXAM_QUESTIONS
-- ----------------------------------------------------------------------------
CREATE POLICY "exams_admin_all" ON public.exams
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "exams_faculty_all" ON public.exams
  FOR ALL TO authenticated
  USING (public.is_faculty_for_section(section_id))
  WITH CHECK (public.is_faculty_for_section(section_id));

CREATE POLICY "exams_student_select" ON public.exams
  FOR SELECT TO authenticated
  USING (
    section_id = (SELECT section_id FROM public.students WHERE profile_id = auth.uid())
    AND status IN ('scheduled', 'active', 'completed')
  );

CREATE POLICY "exam_questions_admin_faculty" ON public.exam_questions
  FOR ALL TO authenticated
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.exams e
      WHERE e.id = exam_questions.exam_id
        AND public.is_faculty_for_section(e.section_id)
    )
  );

CREATE POLICY "exam_questions_student_select" ON public.exam_questions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.students s ON s.section_id = e.section_id
      WHERE e.id = exam_questions.exam_id
        AND s.profile_id = auth.uid()
        AND e.status IN ('active', 'completed')
    )
  );

-- ----------------------------------------------------------------------------
-- 17. POLICIES: EXAM_ATTEMPTS
-- ----------------------------------------------------------------------------
CREATE POLICY "exam_attempts_admin_all" ON public.exam_attempts
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "exam_attempts_faculty_select" ON public.exam_attempts
  FOR SELECT TO authenticated
  USING (public.is_faculty_for_student(student_id));

CREATE POLICY "exam_attempts_student_all" ON public.exam_attempts
  FOR ALL TO authenticated
  USING (student_id = public.current_student_id())
  WITH CHECK (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 18. POLICIES: SUCCESS_SCORES
-- ----------------------------------------------------------------------------
CREATE POLICY "success_scores_admin_all" ON public.success_scores
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "success_scores_faculty_select" ON public.success_scores
  FOR SELECT TO authenticated
  USING (public.is_faculty_for_student(student_id));

CREATE POLICY "success_scores_student_select" ON public.success_scores
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 19. POLICIES: INTERVENTIONS
-- ----------------------------------------------------------------------------
CREATE POLICY "interventions_admin_all" ON public.interventions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "interventions_faculty_all" ON public.interventions
  FOR ALL TO authenticated
  USING (public.is_faculty_for_student(student_id))
  WITH CHECK (public.is_faculty_for_student(student_id));

CREATE POLICY "interventions_student_select" ON public.interventions
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- 20. POLICIES: IMPORT_LOGS
-- ----------------------------------------------------------------------------
CREATE POLICY "import_logs_admin_all" ON public.import_logs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "import_logs_faculty_select" ON public.import_logs
  FOR SELECT TO authenticated
  USING (public.auth_role() = 'faculty');


-- ============================================================================
-- SOURCE: supabase/migrations/20261009000004_analytics_engine.sql
-- ============================================================================

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


-- ============================================================================
-- SOURCE: supabase/seed.sql
-- ============================================================================

-- ============================================================================
-- CAMPUSPULSE: SMART CAMPUS ANALYTICS
-- Database Seed Data (120 Students, 3 Sections, Realistic & Messy Correlated Data)
-- Includes: MD SAHIL (241FA18067), SAGAR (241FA04070), 8-yr Placement Trends
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.departments (id, name, code) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Computer Science & Engineering', 'CSE'),
  ('d1000000-0000-0000-0000-000000000002', 'Electronics & Communication Engineering', 'ECE'),
  ('d1000000-0000-0000-0000-000000000003', 'Artificial Intelligence & Data Science', 'AIDS')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- ----------------------------------------------------------------------------
-- 2. SECTIONS (Year 3 B.Tech)
-- ----------------------------------------------------------------------------
INSERT INTO public.sections (id, name, dept_id, year) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'A', 'd1000000-0000-0000-0000-000000000001', 3),
  ('s1000000-0000-0000-0000-000000000002', 'B', 'd1000000-0000-0000-0000-000000000001', 3),
  ('s1000000-0000-0000-0000-000000000003', 'C', 'd1000000-0000-0000-0000-000000000001', 3)
ON CONFLICT (dept_id, year, name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. AUTH USERS & PROFILES (ADMIN & FACULTY)
-- ----------------------------------------------------------------------------
-- Note: inserting dummy entries in auth.users if auth schema is present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES
      ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@campus.edu.in', crypt('AdminPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. K. Ramanathan"}', NOW(), NOW()),
      ('f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ananya.sharma@campus.edu.in', crypt('FacultyPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Prof. Ananya Sharma"}', NOW(), NOW()),
      ('f0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rajesh.varma@campus.edu.in', crypt('FacultyPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Prof. Rajesh Varma"}', NOW(), NOW()),
      ('f0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sneha.reddy@campus.edu.in', crypt('FacultyPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Sneha Reddy"}', NOW(), NOW()),
      ('u0000000-0000-0000-0000-000000000067', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '241fa18067@college.edu.in', crypt('StudentPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"MD SAHIL"}', NOW(), NOW()),
      ('u0000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '241fa04070@college.edu.in', crypt('StudentPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"SAGAR"}', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert Profiles
INSERT INTO public.profiles (id, role, full_name, email, avatar_url) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'Dr. K. Ramanathan', 'admin@campus.edu.in', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('f0000000-0000-0000-0000-000000000001', 'faculty', 'Prof. Ananya Sharma', 'ananya.sharma@campus.edu.in', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('f0000000-0000-0000-0000-000000000002', 'faculty', 'Prof. Rajesh Varma', 'rajesh.varma@campus.edu.in', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
  ('f0000000-0000-0000-0000-000000000003', 'faculty', 'Dr. Sneha Reddy', 'sneha.reddy@campus.edu.in', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('u0000000-0000-0000-0000-000000000067', 'student', 'MD SAHIL', '241fa18067@college.edu.in', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
  ('u0000000-0000-0000-0000-000000000070', 'student', 'SAGAR', '241fa04070@college.edu.in', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- ----------------------------------------------------------------------------
-- 4. FACULTY DETAILS & SECTION MAPPING
-- ----------------------------------------------------------------------------
INSERT INTO public.faculty (id, reg_no, profile_id, designation) VALUES
  ('fac00000-0000-0000-0000-000000000001', 'FAC210', 'f0000000-0000-0000-0000-000000000001', 'Associate Professor & Class Incharge'),
  ('fac00000-0000-0000-0000-000000000002', 'FAC211', 'f0000000-0000-0000-0000-000000000002', 'Assistant Professor & Lab Coordinator'),
  ('fac00000-0000-0000-0000-000000000003', 'FAC212', 'f0000000-0000-0000-0000-000000000003', 'Professor & Head of Academic Council')
ON CONFLICT (reg_no) DO NOTHING;

INSERT INTO public.faculty_sections (faculty_id, section_id) VALUES
  ('fac00000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001'), -- FAC210 -> Section A
  ('fac00000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000002'), -- FAC211 -> Section B
  ('fac00000-0000-0000-0000-000000000003', 's1000000-0000-0000-0000-000000000003')  -- FAC212 -> Section C
ON CONFLICT (faculty_id, section_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. GENERATE 120 REALISTIC, CORRELATED, MESSY STUDENTS (40 PER SECTION)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  v_first_names TEXT[] := ARRAY[
    'Aarav', 'Aditya', 'Akash', 'Ananya', 'Aniket', 'Anushka', 'Arjun', 'Bhavya', 
    'Chaitanya', 'Deepak', 'Divya', 'Gautam', 'Harsh', 'Ishaan', 'Kavya', 'Kiran', 
    'Manish', 'Meera', 'Nikhil', 'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rhea', 
    'Rohan', 'Rohit', 'Sanjana', 'Sneha', 'Sourabh', 'Suhani', 'Tanvi', 'Tarun', 
    'Utkarsh', 'Varun', 'Vikas', 'Yash', 'Zoya', 'Karthik', 'Swati', 'Harini'
  ];
  v_last_names TEXT[] := ARRAY[
    'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Iyer', 'Nair', 'Deshmukh', 
    'Gupta', 'Kumar', 'Singh', 'Choudhury', 'Joshi', 'Mehta', 'Bhat', 'Menon', 
    'Pillai', 'Hegde', 'Kulkarni', 'Sen', 'Das', 'Chatterjee', 'Mishra', 'Agarwal'
  ];
  v_subjects TEXT[] := ARRAY[
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Computer Networks',
    'Design & Analysis of Algorithms',
    'Operating Systems'
  ];

  v_section_ids UUID[] := ARRAY[
    's1000000-0000-0000-0000-000000000001'::UUID, -- Section A
    's1000000-0000-0000-0000-000000000002'::UUID, -- Section B
    's1000000-0000-0000-0000-000000000003'::UUID  -- Section C
  ];
  v_section_prefixes TEXT[] := ARRAY['241FA18', '241FA04', '241FA05'];

  v_sec_idx INT;
  v_stu_idx INT;
  v_reg_no TEXT;
  v_name TEXT;
  v_student_id UUID;
  v_profile_id UUID;
  v_cgpa NUMERIC(3,2);
  v_backlogs INT;
  v_att_pct INT;
  v_f1 NUMERIC(4,1);
  v_f2 NUMERIC(4,1);
  v_sem NUMERIC(5,2);
  v_logins INT;
  v_done INT;
  v_total_assign INT := 20;
  v_time NUMERIC(6,1);
  v_events INT;
  v_clubs INT;
  v_hackathons INT;
  v_certs INT;
  v_aptitude NUMERIC(5,2);
  v_coding NUMERIC(5,2);
  v_interview NUMERIC(5,2);
  v_comm NUMERIC(3,1);
  v_prog NUMERIC(3,1);
  v_lead NUMERIC(3,1);
  v_sports NUMERIC(3,1);
  v_risk_prob NUMERIC(4,3);
  v_risk_level TEXT;
  v_acad_risk BOOLEAN;
  v_place_risk BOOLEAN;
  v_segment TEXT;
  v_drivers JSONB;
  v_sub TEXT;
  v_classes_held INT := 45;
  v_classes_att INT;
  v_total_score NUMERIC(5,2);

BEGIN
  -- Loop across 3 sections
  FOR v_sec_idx IN 1..3 LOOP
    -- 40 students per section
    FOR v_stu_idx IN 1..40 LOOP

      -- ----------------------------------------------------------------------
      -- Determine identity and registration numbers
      -- ----------------------------------------------------------------------
      IF v_sec_idx = 1 AND v_stu_idx = 27 THEN
        -- EXACT DEMO WIREFRAME REQUIREMENT: MD SAHIL
        v_reg_no := '241FA18067';
        v_name := 'MD SAHIL';
        v_profile_id := 'u0000000-0000-0000-0000-000000000067'::UUID;
        v_cgpa := 8.50;
        v_backlogs := 0;
        v_att_pct := 74; -- Exactly 74% attendance alert trigger
        v_risk_prob := 0.380;
        v_risk_level := 'medium';
        v_acad_risk := FALSE;
        v_place_risk := FALSE;
        v_segment := 'Attendance Risk';
        v_drivers := '[{"factor": "attendance", "status": "warning", "detail": "Attendance at 74% (below 75% mandatory threshold)"}, {"factor": "coding", "status": "positive", "detail": "Strong coding readiness score 86/100"}]'::jsonb;
        v_aptitude := 82.50;
        v_coding := 86.00;
        v_interview := 84.00;
        v_comm := 8.0;
        v_prog := 8.8;
        v_lead := 7.5;
        v_sports := 6.5;
        v_logins := 26;
        v_done := 18;
        v_time := 48.5;
        v_events := 4;
        v_clubs := 2;
        v_hackathons := 2;
        v_certs := 2;

      ELSIF v_sec_idx = 2 AND v_stu_idx = 30 THEN
        -- EXACT DEMO WIREFRAME REQUIREMENT: SAGAR
        v_reg_no := '241FA04070';
        v_name := 'SAGAR';
        v_profile_id := 'u0000000-0000-0000-0000-000000000070'::UUID;
        v_cgpa := 5.50;
        v_backlogs := 5;
        v_att_pct := 42; -- Extremely low attendance
        v_risk_prob := 0.990; -- Critical risk 0.99
        v_risk_level := 'critical';
        v_acad_risk := TRUE;
        v_place_risk := TRUE;
        v_segment := 'Critical Intervention';
        v_drivers := '[{"factor": "attendance", "status": "critical", "detail": "Critical attendance shortage at 42%"}, {"factor": "backlogs", "status": "critical", "detail": "5 active backlogs across core subjects"}, {"factor": "lms", "status": "critical", "detail": "Only 3 LMS logins and 4/20 assignments submitted"}]'::jsonb;
        v_aptitude := 38.00;
        v_coding := 32.00;
        v_interview := 25.00;
        v_comm := 3.5;
        v_prog := 4.0;
        v_lead := 2.5;
        v_sports := 4.0;
        v_logins := 3;
        v_done := 4;
        v_time := 12.0;
        v_events := 0;
        v_clubs := 0;
        v_hackathons := 0;
        v_certs := 0;

      ELSIF v_sec_idx = 1 AND v_stu_idx = 12 THEN
        -- SPECIAL OUTLIER 1: Aniket Rao (High marks, low attendance due to medical)
        v_reg_no := v_section_prefixes[v_sec_idx] || LPAD(v_stu_idx::TEXT, 3, '0');
        v_name := 'Aniket Rao';
        v_profile_id := gen_random_uuid();
        v_cgpa := 9.15;
        v_backlogs := 0;
        v_att_pct := 66; -- Medical leave
        v_risk_prob := 0.460;
        v_risk_level := 'medium';
        v_acad_risk := FALSE;
        v_place_risk := FALSE;
        v_segment := 'Attendance Risk';
        v_drivers := '[{"factor": "attendance", "status": "warning", "detail": "Hospitalization leave applied (Dengue fever)"}, {"factor": "academics", "status": "positive", "detail": "Top 5% CGPA 9.15"}]'::jsonb;
        v_aptitude := 92.00;
        v_coding := 88.00;
        v_interview := 90.00;
        v_comm := 8.5;
        v_prog := 9.0;
        v_lead := 8.0;
        v_sports := 3.0;
        v_logins := 29;
        v_done := 19;
        v_time := 55.0;
        v_events := 1;
        v_clubs := 1;
        v_hackathons := 1;
        v_certs := 3;

      ELSIF v_sec_idx = 2 AND v_stu_idx = 15 THEN
        -- SPECIAL OUTLIER 2: Tarun Teja (Low CGPA, Backlogs, but Hackathon prodigy)
        v_reg_no := v_section_prefixes[v_sec_idx] || LPAD(v_stu_idx::TEXT, 3, '0');
        v_name := 'Tarun Teja';
        v_profile_id := gen_random_uuid();
        v_cgpa := 6.10;
        v_backlogs := 2;
        v_att_pct := 71;
        v_risk_prob := 0.620;
        v_risk_level := 'high';
        v_acad_risk := TRUE;
        v_place_risk := FALSE;
        v_segment := 'Academic Support Needed';
        v_drivers := '[{"factor": "backlogs", "status": "warning", "detail": "2 backlog subjects pending clearance"}, {"factor": "hackathons", "status": "positive", "detail": "Won 4 national hackathons; 500+ Leetcode"}]'::jsonb;
        v_aptitude := 74.00;
        v_coding := 95.00;
        v_interview := 80.00;
        v_comm := 7.0;
        v_prog := 9.5;
        v_lead := 8.5;
        v_sports := 5.0;
        v_logins := 22;
        v_done := 14;
        v_time := 42.0;
        v_events := 6;
        v_clubs := 3;
        v_hackathons := 5;
        v_certs := 4;

      ELSE
        -- GENERATE REALISTIC CORRELATED PROFILES
        v_reg_no := v_section_prefixes[v_sec_idx] || LPAD(v_stu_idx::TEXT, 3, '0');
        v_name := v_first_names[1 + ((v_stu_idx * 7 + v_sec_idx * 13) % array_length(v_first_names, 1))] || ' ' || 
                  v_last_names[1 + ((v_stu_idx * 11 + v_sec_idx * 5) % array_length(v_last_names, 1))];
        v_profile_id := gen_random_uuid();

        -- Realistic bell curve with correlation between attendance and performance
        -- 65% good performers, 22% average/moderate, 13% struggling
        IF (v_stu_idx % 8 = 0) THEN
          -- Struggling cohort
          v_att_pct := 48 + (v_stu_idx * 3) % 20; -- 48% to 67%
          v_cgpa := 5.20 + ((v_stu_idx % 12) * 0.12);
          v_backlogs := 2 + (v_stu_idx % 4);
          v_risk_prob := 0.780 + ((v_stu_idx % 15) * 0.012);
          v_risk_level := CASE WHEN v_risk_prob > 0.88 THEN 'critical' ELSE 'high' END;
          v_acad_risk := TRUE;
          v_place_risk := TRUE;
          v_segment := CASE WHEN v_risk_prob > 0.88 THEN 'Critical Intervention' ELSE 'Academic Support Needed' END;
          v_drivers := jsonb_build_array(
            jsonb_build_object('factor', 'attendance', 'status', 'critical', 'detail', 'Low attendance: ' || v_att_pct || '%'),
            jsonb_build_object('factor', 'backlogs', 'status', 'critical', 'detail', v_backlogs || ' backlogs detected')
          );
          v_aptitude := 42.0 + (v_stu_idx % 18);
          v_coding := 35.0 + (v_stu_idx % 22);
          v_interview := 40.0 + (v_stu_idx % 15);
          v_comm := 4.0 + ((v_stu_idx % 3) * 0.5);
          v_prog := 4.5 + ((v_stu_idx % 3) * 0.5);
          v_lead := 4.0;
          v_sports := 4.0 + (v_stu_idx % 4);
          v_logins := 4 + (v_stu_idx % 8);
          v_done := 5 + (v_stu_idx % 7);
          v_time := 15.0 + (v_stu_idx % 10);
          v_events := (v_stu_idx % 2);
          v_clubs := (v_stu_idx % 2);
          v_hackathons := 0;
          v_certs := (v_stu_idx % 2);

        ELSIF (v_stu_idx % 4 = 0) THEN
          -- Moderate / Borderline cohort
          v_att_pct := 70 + (v_stu_idx % 10); -- 70% to 79%
          v_cgpa := 6.80 + ((v_stu_idx % 10) * 0.10);
          v_backlogs := (v_stu_idx % 2);
          v_risk_prob := 0.320 + ((v_stu_idx % 15) * 0.015);
          v_risk_level := 'medium';
          v_acad_risk := (v_backlogs > 0);
          v_place_risk := FALSE;
          v_segment := CASE WHEN v_att_pct < 75 THEN 'Attendance Risk' ELSE 'Consistent Performer' END;
          v_drivers := jsonb_build_array(
            jsonb_build_object('factor', 'attendance', 'status', 'warning', 'detail', 'Attendance hovering near border: ' || v_att_pct || '%'),
            jsonb_build_object('factor', 'assignments', 'status', 'neutral', 'detail', 'Average submission timeline')
          );
          v_aptitude := 65.0 + (v_stu_idx % 15);
          v_coding := 62.0 + (v_stu_idx % 18);
          v_interview := 68.0 + (v_stu_idx % 12);
          v_comm := 6.5 + ((v_stu_idx % 3) * 0.4);
          v_prog := 6.8 + ((v_stu_idx % 3) * 0.4);
          v_lead := 6.0 + (v_stu_idx % 2);
          v_sports := 5.5 + (v_stu_idx % 3);
          v_logins := 15 + (v_stu_idx % 10);
          v_done := 13 + (v_stu_idx % 5);
          v_time := 32.0 + (v_stu_idx % 12);
          v_events := 1 + (v_stu_idx % 3);
          v_clubs := 1 + (v_stu_idx % 2);
          v_hackathons := (v_stu_idx % 2);
          v_certs := 1 + (v_stu_idx % 2);

        ELSE
          -- High performers / Consistent cohort
          v_att_pct := 82 + (v_stu_idx % 17); -- 82% to 98%
          v_cgpa := 7.60 + ((v_stu_idx % 22) * 0.10);
          IF v_cgpa > 9.85 THEN v_cgpa := 9.85; END IF;
          v_backlogs := 0;
          v_risk_prob := 0.040 + ((v_stu_idx % 12) * 0.010);
          v_risk_level := 'low';
          v_acad_risk := FALSE;
          v_place_risk := FALSE;
          v_segment := CASE WHEN v_cgpa >= 8.7 THEN 'High Flyer' ELSE 'Consistent Performer' END;
          v_drivers := jsonb_build_array(
            jsonb_build_object('factor', 'academics', 'status', 'positive', 'detail', 'High academic index & 0 backlogs'),
            jsonb_build_object('factor', 'attendance', 'status', 'positive', 'detail', 'Consistent ' || v_att_pct || '% attendance')
          );
          v_aptitude := 78.0 + (v_stu_idx % 20);
          v_coding := 75.0 + (v_stu_idx % 22);
          v_interview := 80.0 + (v_stu_idx % 18);
          v_comm := 7.5 + ((v_stu_idx % 4) * 0.5);
          v_prog := 8.0 + ((v_stu_idx % 4) * 0.4);
          v_lead := 7.0 + ((v_stu_idx % 3) * 0.5);
          v_sports := 6.0 + ((v_stu_idx % 4) * 0.5);
          v_logins := 22 + (v_stu_idx % 12);
          v_done := 17 + (v_stu_idx % 4);
          v_time := 44.0 + (v_stu_idx % 20);
          v_events := 2 + (v_stu_idx % 4);
          v_clubs := 1 + (v_stu_idx % 3);
          v_hackathons := 1 + (v_stu_idx % 3);
          v_certs := 2 + (v_stu_idx % 3);
        END IF;

      END IF;

      -- ----------------------------------------------------------------------
      -- Create Profile
      -- ----------------------------------------------------------------------
      INSERT INTO public.profiles (id, role, full_name, email, avatar_url)
      VALUES (
        v_profile_id,
        'student',
        v_name,
        LOWER(v_reg_no) || '@college.edu.in',
        'https://images.unsplash.com/photo-' || 
          CASE (v_stu_idx % 6)
            WHEN 0 THEN '1535713875002-d1d0cf377fde'
            WHEN 1 THEN '1494790108377-be9c29b29330'
            WHEN 2 THEN '1570295999919-56ceb5ecca61'
            WHEN 3 THEN '1580489944761-15a19d654956'
            WHEN 4 THEN '1527980965255-d3b416303d12'
            ELSE '1534528741775-53994a69daeb'
          END || '?w=150'
      )
      ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

      -- ----------------------------------------------------------------------
      -- Create Student record with realistic messy link nulls
      -- ----------------------------------------------------------------------
      INSERT INTO public.students (
        id, reg_no, profile_id, section_id, cgpa, backlogs,
        leetcode_url, codechef_url, linkedin_url, github_url
      ) VALUES (
        gen_random_uuid(),
        v_reg_no,
        v_profile_id,
        v_section_ids[v_sec_idx],
        v_cgpa,
        v_backlogs,
        CASE WHEN (v_stu_idx % 5 = 0) THEN NULL ELSE 'https://leetcode.com/' || LOWER(v_reg_no) END,
        CASE WHEN (v_stu_idx % 4 = 0) THEN NULL ELSE 'https://codechef.com/users/' || LOWER(v_reg_no) END,
        'https://linkedin.com/in/' || LOWER(REPLACE(v_name, ' ', '-')),
        CASE WHEN (v_stu_idx % 6 = 0) THEN NULL ELSE 'https://github.com/' || LOWER(REPLACE(v_name, ' ', '')) END
      )
      RETURNING id INTO v_student_id;

      -- ----------------------------------------------------------------------
      -- Academic Marks (5 core subjects with realistic CIE F1, F2 and Sem Exam)
      -- ----------------------------------------------------------------------
      FOREACH v_sub IN ARRAY v_subjects LOOP
        -- f1, f2 out of 10; semester out of 100
        v_f1 := ROUND(((v_cgpa / 10.0) * 8.5 + (random() * 1.5))::NUMERIC, 1);
        IF v_f1 > 10.0 THEN v_f1 := 10.0; END IF;
        
        -- Messy data: some nulls in f2 for upcoming/missed assessments
        IF (v_stu_idx % 14 = 0 AND v_sub = 'Operating Systems') THEN
          v_f2 := NULL;
        ELSE
          v_f2 := ROUND(((v_cgpa / 10.0) * 8.2 + (random() * 1.8))::NUMERIC, 1);
          IF v_f2 > 10.0 THEN v_f2 := 10.0; END IF;
        END IF;

        v_sem := ROUND(((v_cgpa / 10.0) * 85.0 + (random() * 10.0))::NUMERIC, 1);
        IF v_sem > 98.0 THEN v_sem := 98.0; END IF;

        INSERT INTO public.academic_marks (student_id, subject, f1, f2, semester_exam, max_marks)
        VALUES (v_student_id, v_sub, v_f1, v_f2, v_sem, 100.0);

        -- Attendance per subject
        v_classes_att := ROUND((v_classes_held * (v_att_pct / 100.0) + (random() * 3.0 - 1.5))::NUMERIC);
        IF v_classes_att > v_classes_held THEN v_classes_att := v_classes_held; END IF;
        IF v_classes_att < 0 THEN v_classes_att := 0; END IF;

        INSERT INTO public.attendance (student_id, subject, held, attended, month)
        VALUES (v_student_id, v_sub, v_classes_held, v_classes_att, 'Overall');
      END LOOP;

      -- ----------------------------------------------------------------------
      -- LMS Activity
      -- ----------------------------------------------------------------------
      INSERT INTO public.lms_activity (student_id, logins_30d, assignments_done, assignments_total, avg_time_min)
      VALUES (v_student_id, v_logins, v_done, v_total_assign, v_time);

      -- ----------------------------------------------------------------------
      -- Engagement
      -- ----------------------------------------------------------------------
      INSERT INTO public.engagement (student_id, events, clubs, hackathons, certifications)
      VALUES (v_student_id, v_events, v_clubs, v_hackathons, v_certs);

      -- ----------------------------------------------------------------------
      -- Placement Readiness
      -- Messy: absent on mock interview day for some students
      -- ----------------------------------------------------------------------
      INSERT INTO public.placement_readiness (student_id, aptitude, coding, mock_interview)
      VALUES (
        v_student_id,
        v_aptitude,
        v_coding,
        CASE WHEN (v_stu_idx % 12 = 0) THEN NULL ELSE v_interview END
      );

      -- ----------------------------------------------------------------------
      -- Skills Matrix (0-10)
      -- ----------------------------------------------------------------------
      INSERT INTO public.skills (student_id, communication, programming, leadership, sports)
      VALUES (v_student_id, v_comm, v_prog, v_lead, v_sports);

      -- ----------------------------------------------------------------------
      -- Success Scores (Calculated Total AI Metric)
      -- ----------------------------------------------------------------------
      v_total_score := ROUND((
        (v_cgpa * 4.0) + 
        (v_att_pct * 0.25) + 
        (LEAST(100.0, (v_logins * 2.5 + (v_done::NUMERIC/v_total_assign)*50.0)) * 0.15) + 
        ((v_aptitude + v_coding + COALESCE(v_interview, 60.0)) / 3.0 * 0.20)
      )::NUMERIC, 2);
      IF v_total_score > 98.0 THEN v_total_score := 98.0; END IF;

      INSERT INTO public.success_scores (
        student_id, total, academic, attendance, lms, engagement, placement, skills, feedback,
        risk_probability, risk_level, academic_risk, placement_risk, segment, drivers
      ) VALUES (
        v_student_id,
        v_total_score,
        ROUND((v_cgpa * 10.0)::NUMERIC, 2),
        v_att_pct,
        ROUND(((v_done::NUMERIC / v_total_assign::NUMERIC) * 100.0)::NUMERIC, 2),
        LEAST(100.0, (v_events * 10 + v_hackathons * 25 + v_certs * 20)),
        ROUND(((v_aptitude + v_coding + COALESCE(v_interview, 50.0)) / 3.0)::NUMERIC, 2),
        ROUND(((v_comm + v_prog + v_lead + v_sports) * 2.5)::NUMERIC, 2),
        78.50,
        v_risk_prob,
        v_risk_level,
        v_acad_risk,
        v_place_risk,
        v_segment,
        v_drivers
      );

      -- ----------------------------------------------------------------------
      -- Feedback
      -- ----------------------------------------------------------------------
      IF (v_stu_idx % 3 = 0) THEN
        INSERT INTO public.feedback (student_id, faculty_id, author_role, category, rating, text)
        VALUES (
          v_student_id,
          CASE v_sec_idx 
            WHEN 1 THEN 'fac00000-0000-0000-0000-000000000001'::UUID
            WHEN 2 THEN 'fac00000-0000-0000-0000-000000000002'::UUID
            ELSE 'fac00000-0000-0000-0000-000000000003'::UUID
          END,
          'faculty',
          CASE WHEN v_backlogs > 0 THEN 'academics' WHEN v_att_pct < 75 THEN 'attendance' ELSE 'general' END,
          CASE WHEN v_risk_level = 'critical' THEN 2 WHEN v_risk_level = 'high' THEN 3 WHEN v_risk_level = 'medium' THEN 4 ELSE 5 END,
          CASE 
            WHEN v_reg_no = '241FA18067' THEN 'Capable coder with solid concepts. However, attendance is slipping to 74% - must attend extra tutorial hours to avoid hall ticket condonation penalty.'
            WHEN v_reg_no = '241FA04070' THEN 'Severe disengagement observed. Missed 3 consecutive lab evaluations and CIE-2 tests. Urgent parental counselling meeting recommended.'
            WHEN v_att_pct < 75 THEN 'Attendance notice issued. Student cited commuting difficulties; directed to academic counselor.'
            WHEN v_cgpa >= 8.5 THEN 'Exemplary classroom participation and problem-solving skills in algorithm lab.'
            ELSE 'Steady progress shown in assignments. Needs more practice on recursive tree structures.'
          END
        );
      END IF;

      -- ----------------------------------------------------------------------
      -- Active Interventions for High / Critical Risk Students
      -- ----------------------------------------------------------------------
      IF (v_risk_level IN ('high', 'critical')) OR (v_reg_no = '241FA18067') THEN
        INSERT INTO public.interventions (student_id, created_by, type, note, status, due_date)
        VALUES (
          v_student_id,
          CASE v_sec_idx 
            WHEN 1 THEN 'fac00000-0000-0000-0000-000000000001'::UUID
            WHEN 2 THEN 'fac00000-0000-0000-0000-000000000002'::UUID
            ELSE 'fac00000-0000-0000-0000-000000000003'::UUID
          END,
          CASE 
            WHEN v_reg_no = '241FA18067' THEN 'attendance_warning'
            WHEN v_reg_no = '241FA04070' THEN 'parent_meeting'
            WHEN v_backlogs > 0 THEN 'remedial_class'
            ELSE 'mentoring'
          END,
          CASE 
            WHEN v_reg_no = '241FA18067' THEN 'One-on-one session completed. Goal set to attend next 12 consecutive lectures to surpass 75% cutoff before mid-sem freeze.'
            WHEN v_reg_no = '241FA04070' THEN 'Summoned guardian regarding 5 pending backlogs and 42% attendance. Action plan agreed with weekly signoff.'
            WHEN v_backlogs > 0 THEN 'Enrolled in Saturday Remedial Clinic for Data Structures & Algorithms backlog clearance.'
            ELSE 'Academic counseling scheduled to address early-semester attendance slump.'
          END,
          CASE 
            WHEN v_reg_no = '241FA04070' THEN 'escalated'
            WHEN v_reg_no = '241FA18067' THEN 'in_progress'
            WHEN v_stu_idx % 2 = 0 THEN 'pending'
            ELSE 'in_progress'
          END,
          CURRENT_DATE + INTERVAL '14 days'
        );
      END IF;

    END LOOP;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 6. HISTORICAL PLACEMENT DATA (8 YEARS: 2019 - 2026)
-- Companies: TCS, Cognizant, HCL, Blinkit, Infosys, Amazon, Wipro, Capgemini
-- ----------------------------------------------------------------------------
INSERT INTO public.placements (company, year, students_placed, total_eligible, package_lpa) VALUES
  -- 2019
  ('TCS', 2019, 135, 160, 3.80),
  ('Cognizant', 2019, 92, 140, 4.00),
  ('HCL', 2019, 58, 100, 3.65),
  ('Infosys', 2019, 110, 150, 3.60),
  ('Wipro', 2019, 74, 115, 3.50),
  ('Amazon', 2019, 6, 45, 19.50),

  -- 2020 (Pandemic adjustments)
  ('TCS', 2020, 118, 155, 3.80),
  ('Cognizant', 2020, 80, 130, 4.20),
  ('HCL', 2020, 52, 95, 3.75),
  ('Infosys', 2020, 95, 140, 3.60),
  ('Capgemini', 2020, 65, 110, 4.00),
  ('Amazon', 2020, 8, 50, 22.00),

  -- 2021 (Tech boom begins)
  ('TCS', 2021, 160, 180, 4.00),
  ('Cognizant', 2021, 125, 165, 4.50),
  ('HCL', 2021, 84, 120, 4.25),
  ('Infosys', 2021, 140, 175, 4.00),
  ('Capgemini', 2021, 88, 130, 4.50),
  ('Amazon', 2021, 14, 60, 26.00),

  -- 2022 (Peak hiring boom)
  ('TCS', 2022, 185, 200, 4.25),
  ('Cognizant', 2022, 145, 180, 4.80),
  ('HCL', 2022, 105, 135, 4.50),
  ('Infosys', 2022, 165, 195, 4.25),
  ('Capgemini', 2022, 110, 150, 4.75),
  ('Amazon', 2022, 18, 70, 31.50),

  -- 2023 (Market consolidation)
  ('TCS', 2023, 140, 190, 4.25),
  ('Cognizant', 2023, 115, 175, 4.80),
  ('HCL', 2023, 90, 130, 4.50),
  ('Infosys', 2023, 120, 180, 4.25),
  ('Capgemini', 2023, 85, 140, 5.00),
  ('Amazon', 2023, 12, 65, 32.00),

  -- 2024 (Quick-commerce & product tech entrants like Blinkit)
  ('TCS', 2024, 150, 200, 4.50),
  ('Cognizant', 2024, 130, 185, 5.20),
  ('HCL', 2024, 98, 140, 4.75),
  ('Blinkit', 2024, 14, 45, 16.50),
  ('Infosys', 2024, 135, 190, 4.50),
  ('Amazon', 2024, 15, 75, 34.00),

  -- 2025
  ('TCS', 2025, 165, 210, 4.80),
  ('Cognizant', 2025, 142, 190, 5.50),
  ('HCL', 2025, 112, 150, 5.00),
  ('Blinkit', 2025, 22, 55, 18.20),
  ('Infosys', 2025, 145, 200, 4.80),
  ('Amazon', 2025, 19, 80, 36.50),

  -- 2026 (Current Academic Cycle Projections & Offers)
  ('TCS', 2026, 175, 220, 5.00),
  ('Cognizant', 2026, 150, 200, 5.75),
  ('HCL', 2026, 120, 160, 5.25),
  ('Blinkit', 2026, 28, 60, 20.00),
  ('Infosys', 2026, 155, 205, 5.00),
  ('Amazon', 2026, 22, 85, 38.00)
ON CONFLICT (company, year) DO UPDATE SET 
  students_placed = EXCLUDED.students_placed,
  total_eligible = EXCLUDED.total_eligible,
  package_lpa = EXCLUDED.package_lpa;

-- ----------------------------------------------------------------------------
-- 7. ANNOUNCEMENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.announcements (id, title, body, type, audience, created_by) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Mid-Term Exam Schedule Released', 'Continuous Internal Evaluation (CIE-2) will commence from October 20th. Hall tickets will be issued only to candidates with minimum 75% attendance.', 'exam', 'all', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'Blinkit & Tier-1 Placement Boot Camp', 'Special 4-week coding marathon on advanced trees, DP and system design begins this Saturday in Seminar Hall B.', 'extra_class', 'students', 'f0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'DAA Lab Timings Rescheduled', 'Design and Analysis of Algorithms Lab for Section A and Section B shifted from 2:00 PM to 3:30 PM this Thursday due to network upgrade.', 'time_change', 'all', 'f0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000004', 'Annual TechFest "INVENTO 2026" Registrations', 'Annual intra-college hackathon and technical symposium is live! Win prizes worth INR 5 Lakhs.', 'fest', 'all', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000005', 'Inter-Branch Cricket Tournament Finals', 'Final showdown between CSE Section A vs ECE Section B this Friday at 4 PM on the Main Sports Oval.', 'sports', 'all', 'f0000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000006', 'Remedial Attendance Clinic Session', 'Mandatory doubt clearing and makeup attendance clinic for students below 75% threshold in Algorithms.', 'reschedule', 'students', 'f0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. SAMPLE EXAM, QUESTIONS & STUDENT ATTEMPTS
-- ----------------------------------------------------------------------------
INSERT INTO public.exams (id, name, section_id, created_by, total_marks, status) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'CIE-1: Algorithms & Data Structures Diagnostic', 's1000000-0000-0000-0000-000000000001', 'fac00000-0000-0000-0000-000000000001', 30.0, 'completed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exam_questions (exam_id, text, options, correct_index) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'What is the tightest worst-case time complexity of QuickSort?', '["O(N log N)", "O(N^2)", "O(log N)", "O(N)"]'::jsonb, 1),
  ('e0000000-0000-0000-0000-000000000001', 'Which data structure is primarily used in Dijkstra algorithm for finding the next minimum vertex?', '["Max Heap", "Min Priority Queue", "Stack", "Circular Queue"]'::jsonb, 1),
  ('e0000000-0000-0000-0000-000000000001', 'In B-Trees of order M, what is the maximum number of children an internal node can have?', '["M / 2", "M - 1", "M", "2M"]'::jsonb, 2)
ON CONFLICT DO NOTHING;

-- Attempts for Section A key students
DO $$
DECLARE
  v_sahil_id UUID;
  v_exam_id UUID := 'e0000000-0000-0000-0000-000000000001'::UUID;
BEGIN
  SELECT id INTO v_sahil_id FROM public.students WHERE reg_no = '241FA18067';
  IF v_sahil_id IS NOT NULL THEN
    INSERT INTO public.exam_attempts (exam_id, student_id, score, rank_cached)
    VALUES (v_exam_id, v_sahil_id, 28.50, 3)
    ON CONFLICT (exam_id, student_id) DO NOTHING;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 9. IMPORT LOGS AUDIT (Simulating SIS & Attendance Ingestion Cleansing)
-- ----------------------------------------------------------------------------
INSERT INTO public.import_logs (id, source, rows_ok, rows_failed, errors) VALUES
  ('l0000000-0000-0000-0000-000000000001', 'sis_students_batch_import.csv', 120, 2, '[{"row": 43, "reg_no": "241FA18012", "error": "Duplicate registration number detected. Record merged."}, {"row": 89, "reg_no": "INVALID_REG", "error": "Malformed registration ID. Skipped."}]'::jsonb),
  ('l0000000-0000-0000-0000-000000000002', 'rfid_biometric_attendance_sep.csv', 118, 2, '[{"row": 15, "reg_no": "241FA04070", "error": "Attended (48) exceeded held sessions (45). Clamped to 45."}, {"row": 92, "reg_no": "241FA05022", "error": "Missing subject code. Assigned default core stream."}]'::jsonb),
  ('l0000000-0000-0000-0000-000000000003', 'cie_midsem_marks_f1_f2.csv', 120, 0, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

COMMIT;

