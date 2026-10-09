// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Mock Data Store (Identical Schema & Content as Supabase Seed)
// ============================================================================

import {
  Announcement,
  PlacementRecord,
  CampusPulseStats,
  AuthUser,
  RecruiterMetric,
} from './types';

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    title: 'Mid-Term Exam Schedule (CIE-2) Released',
    body: 'Continuous Internal Evaluation (CIE-2) will commence from October 20th. Hall tickets will be issued strictly to candidates with minimum 75% attendance.',
    type: 'exam',
    audience: 'all',
    created_at: '2026-10-08T09:30:00Z',
    created_by_name: 'Dr. K. Ramanathan',
    created_by_role: 'admin',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    title: 'Blinkit & Tier-1 Placement Boot Camp',
    body: 'Special 4-week coding marathon on advanced trees, DP and system design begins this Saturday in Seminar Hall B. Mandatory for shortlisted students.',
    type: 'extra_class',
    audience: 'students',
    created_at: '2026-10-07T14:15:00Z',
    created_by_name: 'Prof. Ananya Sharma',
    created_by_role: 'faculty',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    title: 'DAA Lab Timings Rescheduled',
    body: 'Design and Analysis of Algorithms Lab for Section A and Section B shifted from 2:00 PM to 3:30 PM this Thursday due to network rack maintenance in Block 4.',
    type: 'time_change',
    audience: 'all',
    created_at: '2026-10-06T11:00:00Z',
    created_by_name: 'Prof. Ananya Sharma',
    created_by_role: 'faculty',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    title: 'Annual TechFest "INVENTO 2026" Registrations Open',
    body: 'Annual intra-college hackathon, robotics arena and project symposium is live! Cash prizes worth INR 5 Lakhs up for grabs across 8 tracks.',
    type: 'fest',
    audience: 'all',
    created_at: '2026-10-04T16:45:00Z',
    created_by_name: 'Dr. K. Ramanathan',
    created_by_role: 'admin',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    title: 'Inter-Branch Cricket Tournament Finals',
    body: 'Final showdown between CSE Section A vs ECE Section B this Friday at 4:00 PM on the Main Sports Oval. Come cheer for your team!',
    type: 'sports',
    audience: 'all',
    created_at: '2026-10-03T10:20:00Z',
    created_by_name: 'Prof. Rajesh Varma',
    created_by_role: 'faculty',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    title: 'Remedial Attendance Clinic & Doubt Clearing',
    body: 'Mandatory doubt-clearing and makeup attendance clinic for students below 75% threshold in Algorithms and Operating Systems.',
    type: 'reschedule',
    audience: 'students',
    created_at: '2026-10-02T08:15:00Z',
    created_by_name: 'Dr. Sneha Reddy',
    created_by_role: 'faculty',
  },
];

export const MOCK_PLACEMENTS: PlacementRecord[] = [
  // 2019
  { id: 'p19-1', company: 'TCS', year: 2019, students_placed: 135, total_eligible: 160, package_lpa: 3.8 },
  { id: 'p19-2', company: 'Cognizant', year: 2019, students_placed: 92, total_eligible: 140, package_lpa: 4.0 },
  { id: 'p19-3', company: 'HCL', year: 2019, students_placed: 58, total_eligible: 100, package_lpa: 3.65 },
  { id: 'p19-4', company: 'Infosys', year: 2019, students_placed: 110, total_eligible: 150, package_lpa: 3.6 },
  { id: 'p19-5', company: 'Wipro', year: 2019, students_placed: 74, total_eligible: 115, package_lpa: 3.5 },
  { id: 'p19-6', company: 'Amazon', year: 2019, students_placed: 6, total_eligible: 45, package_lpa: 19.5 },

  // 2020
  { id: 'p20-1', company: 'TCS', year: 2020, students_placed: 118, total_eligible: 155, package_lpa: 3.8 },
  { id: 'p20-2', company: 'Cognizant', year: 2020, students_placed: 80, total_eligible: 130, package_lpa: 4.2 },
  { id: 'p20-3', company: 'HCL', year: 2020, students_placed: 52, total_eligible: 95, package_lpa: 3.75 },
  { id: 'p20-4', company: 'Infosys', year: 2020, students_placed: 95, total_eligible: 140, package_lpa: 3.6 },
  { id: 'p20-5', company: 'Capgemini', year: 2020, students_placed: 65, total_eligible: 110, package_lpa: 4.0 },
  { id: 'p20-6', company: 'Amazon', year: 2020, students_placed: 8, total_eligible: 50, package_lpa: 22.0 },

  // 2021
  { id: 'p21-1', company: 'TCS', year: 2021, students_placed: 160, total_eligible: 180, package_lpa: 4.0 },
  { id: 'p21-2', company: 'Cognizant', year: 2021, students_placed: 125, total_eligible: 165, package_lpa: 4.5 },
  { id: 'p21-3', company: 'HCL', year: 2021, students_placed: 84, total_eligible: 120, package_lpa: 4.25 },
  { id: 'p21-4', company: 'Infosys', year: 2021, students_placed: 140, total_eligible: 175, package_lpa: 4.0 },
  { id: 'p21-5', company: 'Capgemini', year: 2021, students_placed: 88, total_eligible: 130, package_lpa: 4.5 },
  { id: 'p21-6', company: 'Amazon', year: 2021, students_placed: 14, total_eligible: 60, package_lpa: 26.0 },

  // 2022
  { id: 'p22-1', company: 'TCS', year: 2022, students_placed: 185, total_eligible: 200, package_lpa: 4.25 },
  { id: 'p22-2', company: 'Cognizant', year: 2022, students_placed: 145, total_eligible: 180, package_lpa: 4.8 },
  { id: 'p22-3', company: 'HCL', year: 2022, students_placed: 105, total_eligible: 135, package_lpa: 4.5 },
  { id: 'p22-4', company: 'Infosys', year: 2022, students_placed: 165, total_eligible: 195, package_lpa: 4.25 },
  { id: 'p22-5', company: 'Capgemini', year: 2022, students_placed: 110, total_eligible: 150, package_lpa: 4.75 },
  { id: 'p22-6', company: 'Amazon', year: 2022, students_placed: 18, total_eligible: 70, package_lpa: 31.5 },

  // 2023
  { id: 'p23-1', company: 'TCS', year: 2023, students_placed: 140, total_eligible: 190, package_lpa: 4.25 },
  { id: 'p23-2', company: 'Cognizant', year: 2023, students_placed: 115, total_eligible: 175, package_lpa: 4.8 },
  { id: 'p23-3', company: 'HCL', year: 2023, students_placed: 90, total_eligible: 130, package_lpa: 4.5 },
  { id: 'p23-4', company: 'Infosys', year: 2023, students_placed: 120, total_eligible: 180, package_lpa: 4.25 },
  { id: 'p23-5', company: 'Capgemini', year: 2023, students_placed: 85, total_eligible: 140, package_lpa: 5.0 },
  { id: 'p23-6', company: 'Amazon', year: 2023, students_placed: 12, total_eligible: 65, package_lpa: 32.0 },

  // 2024
  { id: 'p24-1', company: 'TCS', year: 2024, students_placed: 150, total_eligible: 200, package_lpa: 4.5 },
  { id: 'p24-2', company: 'Cognizant', year: 2024, students_placed: 130, total_eligible: 185, package_lpa: 5.2 },
  { id: 'p24-3', company: 'HCL', year: 2024, students_placed: 98, total_eligible: 140, package_lpa: 4.75 },
  { id: 'p24-4', company: 'Blinkit', year: 2024, students_placed: 14, total_eligible: 45, package_lpa: 16.5 },
  { id: 'p24-5', company: 'Infosys', year: 2024, students_placed: 135, total_eligible: 190, package_lpa: 4.5 },
  { id: 'p24-6', company: 'Amazon', year: 2024, students_placed: 15, total_eligible: 75, package_lpa: 34.0 },

  // 2025
  { id: 'p25-1', company: 'TCS', year: 2025, students_placed: 165, total_eligible: 210, package_lpa: 4.8 },
  { id: 'p25-2', company: 'Cognizant', year: 2025, students_placed: 142, total_eligible: 190, package_lpa: 5.5 },
  { id: 'p25-3', company: 'HCL', year: 2025, students_placed: 112, total_eligible: 150, package_lpa: 5.0 },
  { id: 'p25-4', company: 'Blinkit', year: 2025, students_placed: 22, total_eligible: 55, package_lpa: 18.2 },
  { id: 'p25-5', company: 'Infosys', year: 2025, students_placed: 145, total_eligible: 200, package_lpa: 4.8 },
  { id: 'p25-6', company: 'Amazon', year: 2025, students_placed: 19, total_eligible: 80, package_lpa: 36.5 },

  // 2026
  { id: 'p26-1', company: 'TCS', year: 2026, students_placed: 175, total_eligible: 220, package_lpa: 5.0 },
  { id: 'p26-2', company: 'Cognizant', year: 2026, students_placed: 150, total_eligible: 200, package_lpa: 5.75 },
  { id: 'p26-3', company: 'HCL', year: 2026, students_placed: 120, total_eligible: 160, package_lpa: 5.25 },
  { id: 'p26-4', company: 'Blinkit', year: 2026, students_placed: 28, total_eligible: 60, package_lpa: 20.0 },
  { id: 'p26-5', company: 'Infosys', year: 2026, students_placed: 155, total_eligible: 205, package_lpa: 5.0 },
  { id: 'p26-6', company: 'Amazon', year: 2026, students_placed: 22, total_eligible: 85, package_lpa: 38.0 },
];

export const MOCK_RECRUITERS: RecruiterMetric[] = [
  { company: 'Blinkit', total_hires: 64, avg_package_lpa: 18.2, top_year: 2026, industry: 'Quick Commerce & Systems' },
  { company: 'Cognizant', total_hires: 979, avg_package_lpa: 4.8, top_year: 2026, industry: 'Digital Engineering' },
  { company: 'TCS', total_hires: 1228, avg_package_lpa: 4.3, top_year: 2026, industry: 'IT Consulting' },
  { company: 'HCL', total_hires: 689, avg_package_lpa: 4.4, top_year: 2026, industry: 'Enterprise Cloud' },
  { company: 'Amazon', total_hires: 104, avg_package_lpa: 31.0, top_year: 2026, industry: 'Big Tech Product' },
  { company: 'Infosys', total_hires: 1065, avg_package_lpa: 4.2, top_year: 2026, industry: 'Core Enterprise' },
];

export const MOCK_STATS: CampusPulseStats = {
  students_tracked: 120,
  at_risk_caught_early: 28,
  placement_rate_pct: 88.5,
  active_interventions: 18,
  sections_monitored: 3,
  average_cgpa: 7.64,
};

export const MOCK_AUTH_USERS: Record<string, AuthUser> = {
  admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@campus.edu.in',
    full_name: 'Dr. K. Ramanathan',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  faculty: {
    id: 'f0000000-0000-0000-0000-000000000001',
    email: 'ananya.sharma@campus.edu.in',
    full_name: 'Prof. Ananya Sharma',
    role: 'faculty',
    reg_no: 'FAC210',
    section: 'Section A (CSE Year 3)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  student_sahil: {
    id: 'u0000000-0000-0000-0000-000000000067',
    email: '241fa18067@college.edu.in',
    full_name: 'MD SAHIL',
    role: 'student',
    reg_no: '241FA18067',
    section: 'Section A',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  student_sagar: {
    id: 'u0000000-0000-0000-0000-000000000070',
    email: '241fa04070@college.edu.in',
    full_name: 'SAGAR',
    role: 'student',
    reg_no: '241FA04070',
    section: 'Section B',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
};
