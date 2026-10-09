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
