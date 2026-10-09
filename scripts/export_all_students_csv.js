const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------------------
// Deterministic 120-Student Generation (CSE Year 3: Sections A, B, C)
// Matches SQL Seed and CampusPulse analytics engine
// ----------------------------------------------------------------------------
const firstNames = [
  'Aarav', 'Aditya', 'Akash', 'Ananya', 'Aniket', 'Anushka', 'Arjun', 'Bhavya',
  'Chaitanya', 'Deepak', 'Divya', 'Gautam', 'Harsh', 'Ishaan', 'Kavya', 'Kiran',
  'Manish', 'Meera', 'Nikhil', 'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rhea',
  'Rohan', 'Rohit', 'Sanjana', 'Sneha', 'Sourabh', 'Suhani', 'Tanvi', 'Tarun',
  'Utkarsh', 'Varun', 'Vikas', 'Yash', 'Zoya', 'Karthik', 'Swati', 'Harini',
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Iyer', 'Nair', 'Deshmukh',
  'Gupta', 'Kumar', 'Singh', 'Choudhury', 'Joshi', 'Mehta', 'Bhat', 'Menon',
  'Pillai', 'Hegde', 'Kulkarni', 'Sen', 'Das', 'Chatterjee', 'Mishra', 'Agarwal',
];

const sectionNames = ['Section A', 'Section B', 'Section C'];
const sectionIds = ['sec-a', 'sec-b', 'sec-c'];
const prefixes = ['241FA18', '241FA04', '241FA05'];

// Special Interventions map
const interventionsMap = {
  '241FA18067': 'Attendance Warning: One-on-one tutorial session arranged. Target: attend 12 consecutive lectures to exceed 75% cutoff.',
  '241FA04070': 'Parent Meeting Escalated & Saturday Remedial Class: Guardian summoned regarding 5 backlogs and 42% attendance.',
};

function generateCohort() {
  const students = [];

  for (let sIdx = 0; sIdx < 3; sIdx++) {
    for (let idx = 1; idx <= 40; idx++) {
      const studentId = `stu-${sIdx}-${idx}`;
      const sectionId = sectionIds[sIdx];
      const sectionName = sectionNames[sIdx];

      // 1. MD SAHIL (241FA18067 - Section A)
      if (sIdx === 0 && idx === 27) {
        students.push({
          student_id: studentId,
          section_id: sectionId,
          section_name: sectionName,
          reg_no: '241FA18067',
          full_name: 'MD SAHIL',
          email: '241fa18067@college.edu.in',
          cgpa: 8.5,
          backlogs: 0,
          avg_cie_marks: 8.4,
          attendance_pct: 74.0,
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
          leetcode_url: 'https://leetcode.com/u/mdsahil',
          codechef_url: 'https://www.codechef.com/users/mdsahil',
          linkedin_url: 'https://linkedin.com/in/mdsahil',
          github_url: 'https://github.com/sahilAIML',
        });
        continue;
      }

      // 2. SAGAR (241FA04070 - Section B Critical)
      if (sIdx === 1 && idx === 30) {
        students.push({
          student_id: studentId,
          section_id: sectionId,
          section_name: sectionName,
          reg_no: '241FA04070',
          full_name: 'SAGAR',
          email: '241fa04070@college.edu.in',
          cgpa: 5.5,
          backlogs: 5,
          avg_cie_marks: 4.8,
          attendance_pct: 42.0,
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
          leetcode_url: 'https://leetcode.com/u/sagar_profile',
          codechef_url: 'https://www.codechef.com/users/sagar',
          linkedin_url: 'https://linkedin.com/in/sagar',
          github_url: 'https://github.com/sagar-dev',
        });
        continue;
      }

      // 3. Aniket Rao (High marks, low attendance medical leave)
      if (sIdx === 0 && idx === 12) {
        students.push({
          student_id: studentId,
          section_id: sectionId,
          section_name: sectionName,
          reg_no: `${prefixes[sIdx]}${String(idx).padStart(3, '0')}`,
          full_name: 'Aniket Rao',
          email: `${prefixes[sIdx].toLowerCase()}${String(idx).padStart(3, '0')}@college.edu.in`,
          cgpa: 9.15,
          backlogs: 0,
          avg_cie_marks: 9.2,
          attendance_pct: 66.0,
          logins_30d: 29,
          assignments_done: 19,
          assignments_total: 20,
          events: 1,
          clubs: 1,
          hackathons: 1,
          certifications: 3,
          aptitude: 92.0,
          coding: 88.0,
          mock_interview: 90.0,
          communication: 8.5,
          programming: 9.0,
          leadership: 8.0,
          sports: 3.0,
          avg_feedback: 4.8,
          leetcode_url: `https://leetcode.com/u/aniket_rao`,
          codechef_url: `https://www.codechef.com/users/aniket_rao`,
          linkedin_url: `https://linkedin.com/in/aniket-rao`,
          github_url: `https://github.com/aniket-rao`,
        });
        continue;
      }

      const regNo = `${prefixes[sIdx]}${String(idx).padStart(3, '0')}`;
      const fn = firstNames[(idx * 7 + sIdx * 13) % firstNames.length];
      const ln = lastNames[(idx * 11 + sIdx * 5) % lastNames.length];
      const fullName = `${fn} ${ln}`;
      const email = `${regNo.toLowerCase()}@college.edu.in`;
      const cleanUser = `${fn.toLowerCase()}_${ln.toLowerCase()}`;

      if (idx % 8 === 0) {
        // Struggling cohort
        students.push({
          student_id: studentId,
          section_id: sectionId,
          section_name: sectionName,
          reg_no: regNo,
          full_name: fullName,
          email,
          cgpa: Number((5.2 + (idx % 12) * 0.12).toFixed(2)),
          backlogs: 2 + (idx % 3),
          avg_cie_marks: Number((4.5 + (idx % 8) * 0.2).toFixed(1)),
          attendance_pct: Number((52 + (idx * 3) % 18).toFixed(1)),
          logins_30d: 5 + (idx % 6),
          assignments_done: 6 + (idx % 6),
          assignments_total: 20,
          events: idx % 2,
          clubs: idx % 2,
          hackathons: 0,
          certifications: idx % 2,
          aptitude: 45 + (idx % 15),
          coding: 38 + (idx % 18),
          mock_interview: 40 + (idx % 12),
          communication: 4.0,
          programming: 4.5,
          leadership: 3.5,
          sports: 4.5,
          avg_feedback: 2.5,
          leetcode_url: `https://leetcode.com/u/${cleanUser}`,
          codechef_url: `https://www.codechef.com/users/${cleanUser}`,
          linkedin_url: `https://linkedin.com/in/${cleanUser}`,
          github_url: `https://github.com/${cleanUser}`,
        });
      } else if (idx % 4 === 0) {
        // Borderline cohort
        students.push({
          student_id: studentId,
          section_id: sectionId,
          section_name: sectionName,
          reg_no: regNo,
          full_name: fullName,
          email,
          cgpa: Number((6.8 + (idx % 8) * 0.1).toFixed(2)),
          backlogs: idx % 2,
          avg_cie_marks: Number((6.6 + (idx % 6) * 0.2).toFixed(1)),
          attendance_pct: Number((71 + (idx % 8)).toFixed(1)),
          logins_30d: 15 + (idx % 8),
          assignments_done: 13 + (idx % 4),
          assignments_total: 20,
          events: 1 + (idx % 2),
          clubs: 1,
          hackathons: idx % 2,
          certifications: 1,
          aptitude: 66 + (idx % 12),
          coding: 64 + (idx % 15),
          mock_interview: 68 + (idx % 10),
          communication: 6.5,
          programming: 6.8,
          leadership: 6.0,
          sports: 5.5,
          avg_feedback: 3.8,
          leetcode_url: `https://leetcode.com/u/${cleanUser}`,
          codechef_url: `https://www.codechef.com/users/${cleanUser}`,
          linkedin_url: `https://linkedin.com/in/${cleanUser}`,
          github_url: `https://github.com/${cleanUser}`,
        });
      } else {
        // High performer cohort
        const cgpaVal = Math.min(9.85, Number((7.6 + (idx % 20) * 0.1).toFixed(2)));
        students.push({
          student_id: studentId,
          section_id: sectionId,
          section_name: sectionName,
          reg_no: regNo,
          full_name: fullName,
          email,
          cgpa: cgpaVal,
          backlogs: 0,
          avg_cie_marks: Number((7.8 + (idx % 10) * 0.18).toFixed(1)),
          attendance_pct: Number((82 + (idx % 16)).toFixed(1)),
          logins_30d: 22 + (idx % 8),
          assignments_done: 17 + (idx % 4),
          assignments_total: 20,
          events: 2 + (idx % 3),
          clubs: 1 + (idx % 2),
          hackathons: 1 + (idx % 2),
          certifications: 2 + (idx % 2),
          aptitude: 78 + (idx % 18),
          coding: 76 + (idx % 20),
          mock_interview: 82 + (idx % 14),
          communication: 7.5,
          programming: 8.2,
          leadership: 7.0,
          sports: 6.5,
          avg_feedback: 4.6,
          leetcode_url: `https://leetcode.com/u/${cleanUser}`,
          codechef_url: `https://www.codechef.com/users/${cleanUser}`,
          linkedin_url: `https://linkedin.com/in/${cleanUser}`,
          github_url: `https://github.com/${cleanUser}`,
        });
      }
    }
  }

  return students;
}

// Compute 7-Indicator Success Score
function computeSuccessAnalytics(s) {
  // 1. Academic (Weight: 30)
  const cgpaPart = (s.cgpa / 10.0) * 0.50;
  const ciePart = ((s.avg_cie_marks || 7.0) / 10.0) * 0.35;
  const backlogPart = Math.max(0.0, 1.0 - s.backlogs * 0.20) * 0.15;
  const acadPts = (cgpaPart + ciePart + backlogPart) * 30.0;

  // 2. Attendance (Weight: 20)
  const attPts = (Math.floor(s.attendance_pct / 10.0) / 10.0) * 20.0;

  // 3. LMS (Weight: 10)
  const lmsPts = (Math.min(1.0, s.logins_30d / 30.0) * 0.40 + (s.assignments_done / Math.max(1, s.assignments_total)) * 0.60) * 10.0;

  // 4. Engagement (Weight: 10)
  const engPts = Math.min(1.0, (s.events * 1.0 + s.clubs * 1.5 + s.hackathons * 3.0 + s.certifications * 2.5) / 15.0) * 10.0;

  // 5. Placement (Weight: 15)
  const placePts = (((s.aptitude || 50) + (s.coding || 50) + (s.mock_interview || 50)) / 300.0) * 15.0;

  // 6. Skills (Weight: 10)
  const skillsPts = (((s.communication || 7) + (s.programming || 7) + (s.leadership || 6) + (s.sports || 6)) / 40.0) * 10.0;

  // 7. Feedback (Weight: 5)
  const feedPts = Math.min(1.0, (s.avg_feedback || 3.5) / 5.0) * 5.0;

  const totalScore = Number((acadPts + attPts + lmsPts + engPts + placePts + skillsPts + feedPts).toFixed(1));

  // Risk Probability
  const acadDeficit = Math.max(0, 1.0 - acadPts / 30.0);
  const attDeficit = s.attendance_pct < 75.0 ? Math.max(0, 1.0 - attPts / 20.0) * 1.5 : Math.max(0, 1.0 - attPts / 20.0);
  const lmsDeficit = Math.max(0, 1.0 - lmsPts / 10.0);
  const placeDeficit = Math.max(0, 1.0 - placePts / 15.0);

  const z = -2.5 + acadDeficit * 3.2 + attDeficit * 3.8 + lmsDeficit * 1.4 + placeDeficit * 1.8 + (s.backlogs > 0 ? s.backlogs * 0.5 : 0);
  const riskProb = Number((1.0 / (1.0 + Math.exp(-z))).toFixed(2));

  let riskLevel = 'low';
  if (riskProb >= 0.80) riskLevel = 'critical';
  else if (riskProb >= 0.60) riskLevel = 'high';
  else if (riskProb >= 0.35) riskLevel = 'medium';

  const academicRisk = acadPts < 15.0 || s.backlogs > 0;
  const placementRisk = placePts < 8.0;

  // Behavioral Segment
  let segment = 'Consistent Performer';
  if (totalScore >= 82) segment = 'High Achiever';
  else if (s.attendance_pct < 75.0 && totalScore < 70) segment = 'Attendance Risk';
  else if (placePts >= 12.0 && totalScore < 75) segment = 'Placement-Focused';
  else if (riskLevel === 'critical' || s.backlogs >= 2) segment = 'Comprehensive Support Needed';

  return {
    totalScore,
    acadPts: Number(acadPts.toFixed(1)),
    attPts: Number(attPts.toFixed(1)),
    lmsPts: Number(lmsPts.toFixed(1)),
    engPts: Number(engPts.toFixed(1)),
    placePts: Number(placePts.toFixed(1)),
    skillsPts: Number(skillsPts.toFixed(1)),
    feedPts: Number(feedPts.toFixed(1)),
    riskProb,
    riskLevel,
    academicRisk,
    placementRisk,
    segment,
  };
}

function escapeCsvField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Generate dataset
const rawCohort = generateCohort();
const headers = [
  'Student_ID',
  'Registration_Number',
  'Full_Name',
  'Email',
  'Department',
  'Section',
  'Year',
  'CGPA',
  'Active_Backlogs',
  'Avg_CIE_Marks',
  'Attendance_Percentage',
  'Attendance_Below_75_Flag',
  'LMS_Logins_30d',
  'LMS_Assignments_Done',
  'LMS_Assignments_Total',
  'LMS_Completion_Percentage',
  'Campus_Events_Count',
  'Clubs_Count',
  'Hackathons_Count',
  'Certifications_Count',
  'Placement_Aptitude_Score',
  'Technical_Coding_Score',
  'Mock_Interview_Score',
  'Programming_Skill',
  'Communication_Skill',
  'Leadership_Skill',
  'Sports_Skill',
  'Feedback_Rating',
  'Overall_Success_Score',
  'Academic_Indicator_Points',
  'Attendance_Indicator_Points',
  'LMS_Indicator_Points',
  'Engagement_Indicator_Points',
  'Placement_Indicator_Points',
  'Skills_Indicator_Points',
  'Feedback_Indicator_Points',
  'Risk_Probability',
  'Risk_Level',
  'Academic_Risk',
  'Placement_Risk',
  'Behavioral_Segment',
  'Active_Interventions',
  'LeetCode_URL',
  'CodeChef_URL',
  'LinkedIn_URL',
  'GitHub_URL',
];

const rows = [headers.join(',')];

for (const s of rawCohort) {
  const analytics = computeSuccessAnalytics(s);
  const interv = interventionsMap[s.reg_no] || 'None assigned';
  const attBelow75 = s.attendance_pct < 75.0 ? 'YES' : 'NO';
  const lmsPct = Number(((s.assignments_done / s.assignments_total) * 100).toFixed(1));

  const row = [
    escapeCsvField(s.student_id),
    escapeCsvField(s.reg_no),
    escapeCsvField(s.full_name),
    escapeCsvField(s.email),
    escapeCsvField('Computer Science & Engineering'),
    escapeCsvField(s.section_name),
    escapeCsvField('Year 3 B.Tech'),
    escapeCsvField(s.cgpa),
    escapeCsvField(s.backlogs),
    escapeCsvField(s.avg_cie_marks),
    escapeCsvField(s.attendance_pct),
    escapeCsvField(attBelow75),
    escapeCsvField(s.logins_30d),
    escapeCsvField(s.assignments_done),
    escapeCsvField(s.assignments_total),
    escapeCsvField(lmsPct),
    escapeCsvField(s.events),
    escapeCsvField(s.clubs),
    escapeCsvField(s.hackathons),
    escapeCsvField(s.certifications),
    escapeCsvField(s.aptitude),
    escapeCsvField(s.coding),
    escapeCsvField(s.mock_interview),
    escapeCsvField(s.programming),
    escapeCsvField(s.communication),
    escapeCsvField(s.leadership),
    escapeCsvField(s.sports),
    escapeCsvField(s.avg_feedback),
    escapeCsvField(analytics.totalScore),
    escapeCsvField(analytics.acadPts),
    escapeCsvField(analytics.attPts),
    escapeCsvField(analytics.lmsPts),
    escapeCsvField(analytics.engPts),
    escapeCsvField(analytics.placePts),
    escapeCsvField(analytics.skillsPts),
    escapeCsvField(analytics.feedPts),
    escapeCsvField(analytics.riskProb),
    escapeCsvField(analytics.riskLevel),
    escapeCsvField(analytics.academicRisk ? 'TRUE' : 'FALSE'),
    escapeCsvField(analytics.placementRisk ? 'TRUE' : 'FALSE'),
    escapeCsvField(analytics.segment),
    escapeCsvField(interv),
    escapeCsvField(s.leetcode_url),
    escapeCsvField(s.codechef_url),
    escapeCsvField(s.linkedin_url),
    escapeCsvField(s.github_url),
  ];

  rows.push(row.join(','));
}

const csvContent = rows.join('\r\n');

// Write to root
const rootPath = path.join(__dirname, '..', 'students_complete_master_dataset.csv');
fs.writeFileSync(rootPath, csvContent, 'utf8');

// Also write to public folder for web browser downloads
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicPath = path.join(publicDir, 'students_complete_master_dataset.csv');
fs.writeFileSync(publicPath, csvContent, 'utf8');

console.log('Successfully generated complete student dataset CSV!');
console.log('Total students exported:', rawCohort.length);
console.log('Total columns per student:', headers.length);
console.log('Saved to:', rootPath);
console.log('Public route:', publicPath);
