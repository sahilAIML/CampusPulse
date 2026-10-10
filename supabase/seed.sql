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
      ('u0000000-0000-0000-0000-000000000067', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '241fa18067@campus.edu.in', crypt('StudentPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"MD SAHIL"}', NOW(), NOW()),
      ('u0000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '241fa04070@campus.edu.in', crypt('StudentPass123!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"SAGAR"}', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert Profiles
INSERT INTO public.profiles (id, role, full_name, email, avatar_url) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'Dr. K. Ramanathan', 'admin@campus.edu.in', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('f0000000-0000-0000-0000-000000000001', 'faculty', 'Prof. Ananya Sharma', 'ananya.sharma@campus.edu.in', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('f0000000-0000-0000-0000-000000000002', 'faculty', 'Prof. Rajesh Varma', 'rajesh.varma@campus.edu.in', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
  ('f0000000-0000-0000-0000-000000000003', 'faculty', 'Dr. Sneha Reddy', 'sneha.reddy@campus.edu.in', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('u0000000-0000-0000-0000-000000000067', 'student', 'MD SAHIL', '241fa18067@campus.edu.in', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
  ('u0000000-0000-0000-0000-000000000070', 'student', 'SAGAR', '241fa04070@campus.edu.in', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')
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
        LOWER(v_reg_no) || '@campus.edu.in',
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
