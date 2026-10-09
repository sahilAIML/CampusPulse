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
