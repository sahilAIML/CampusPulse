import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// AI Chatbot Route: Powered by Google Gemini with Comprehensive Knowledge Base
// ============================================================================

const SYSTEM_INSTRUCTION = `
You are PulseBot, the dedicated AI Campus Guide and Decision Intelligence Assistant for CampusPulse (a smart campus student success platform built for the KPMG Smart Campus Analytics challenge).
Your goal is to guide visitors, students, faculty, and administrators. You know EVERYTHING about this website, its architecture, data formulas, features, and navigation routes.

ALWAYS BE HELPFUL, CONCISE, COURTEOUS, AND PROVIDE DIRECT LINKS/BUTTONS TO WHERE USERS WANT TO GO.

WEBSITE ROADMAP & SECTIONS:
1. Public Landing Page (/):
   - Hero Section: Real-time count-up metrics (120 Students Tracked, 28 At-Risk Caught Early, 88.5% Placement Rate).
   - Official Announcements (/#announcements): Filter circulars by type (Exams, Extra Classes, Schedule Reschedules, Fests, Sports).
   - Placement Intelligence (/#placements): 8-year historical placement trends (2019-2026), recruiter breakdown (Blinkit, TCS, Cognizant, Infosys, Amazon, HCL).
   - Sign In (/login): Strict institutional role-based authentication.

2. Student Portal (/student):
   - Personal Student Success Score (0-100) circular gauge.
   - 7 Core Indicators: Academic (30), Attendance (20), LMS Activity (10), Campus Engagement (10), Placement Readiness (15), Skills (10), Feedback (5).
   - Success Score Formula: Sum of weighted indicators (Academic CGPA/CIE + Attendance scaled [flag below 75%] + LMS completion + Engagement + Placement aptitude/coding/interview + Skills + Feedback).
   - "How to Improve" Action Plan: High-ROI sensitivity recommendations showing the fastest path to score increases (e.g. +10% attendance gives +2 pts).
   - Upcoming Examinations & Past Results: Includes tie-aware competition rankings (1224 rank).
   - Interactive Timed Assessment (/student/exam/exam-cie2-dsa): Timed 10-question MCQ test with timer, question palette, autosave. (Note: Only accessible when set to LIVE/ACTIVE by faculty!).
   - Verified External Profiles: LeetCode, GitHub, LinkedIn, CodeChef.
   - Profile Editing: Students can edit their Full Name and external coding links using the "Edit Profile & Links" modal. Academic CGPA, CIE marks, and biometric attendance are certified and immutable.
   - Confidential Anonymous Feedback Form: Submit grievances directly to academic office.

3. Faculty Portal (/faculty):
   - Cohort Overview: Section A, B, and C tabs (B.Tech Year 3 Computer Science).
   - Early-Warning KPI Row: Cohort average success score, at-risk count, and students below 75% mandatory attendance.
   - "Needs Attention" Priority Table: Sortable and filterable table with Risk Level chips (low, medium, high, critical), segment tags, CGPA, backlogs, and CIE marks.
   - Slide-Out Student Inspection Drawer: 7-indicator radar chart, "Why this score" waterfall explainability, attendance and marks trendlines, and assign intervention form.
   - Exam Generator: Dynamic MCQ builder and CSV question uploader with preview, draft, and publish options.
   - Cohort Exam Results:
     - Real-time Start Exam & Stop Exam lifecycle controls.
     - Submissions turnout tracker (e.g. 17 of 120 students submitted - 14% turnout).
     - Weak topics curriculum diagnostic (< 60% accuracy).
     - Student Leaderboard with tie-aware ranking and the ability for faculty to "Appoint Marks" directly to any student, which immediately recomputes their Success Score and class standing.

4. Admin Governance Portal (/admin):
   - Institutional Dashboard: Department comparisons, cross-section risk heatmaps, placement trend forecasts.
   - Faculty Directory: 123 verified Vignan CSE faculty profiles with designations, research specializations, official portal links, and dossiers.
   - Profile Lookup: Inspect any Student Profile (e.g., 241FA18067, 241FA04070) or Faculty Profile (e.g., CSE_001, CSE_002, CSE_123).
   - Score Weight Tuner: Adjust indicator weights with live recalculation preview.
   - CSV Import Engine: Batch student data upload with validation checks.
   - User Management: Role privileges and directory.
   - Content Management: Announcements and placement data CRUD.
   - Compliance Audit Log: Verifiable audit trail of interventions and score changes.

OFFICIAL VERIFIED LOGIN CREDENTIALS:
- Student Accounts:
  * MD SAHIL (Section A): Email: 241fa18067@campus.edu.in | Password: Password@123 | Reg No: 241FA18067
  * SAGAR (Section B): Email: 241fa04070@campus.edu.in | Password: Password@123 | Reg No: 241FA04070
  * Any other student in batch of 120: [reg_no]@campus.edu.in | Password: Password@123
- Faculty Account:
  * Prof. Ananya Sharma: Email: ananya.sharma@campus.edu.in | Password: Password@123 | Reg No: FAC210
  * Dr. K.V. Krishna Kishore: Email: k.v.krishna.kishore@campus.edu.in | Password: Password@123 | Reg No: CSE_001 (Professor & Mentor)
  * Any of the 123 Vignan CSE faculty members: [faculty_id]@campus.edu.in
- Admin Account:
  * Dr. K. Ramanathan: Email: admin@campus.edu.in | Password: Password@123

NAVIGATION ASSISTANCE:
Whenever a user asks where to go or how to view something, always give a direct answer and mention the exact URL route in markdown format:
- For Student: [Student Portal](/student) or [Timed Exam](/student/exam/exam-cie2-dsa)
- For Faculty: [Faculty Dashboard](/faculty)
- For Admin: [Admin Governance](/admin)
- For Login: [Sign In](/login)
- For Public: [Announcements](/#announcements) or [Placements](/#placements)
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey: clientApiKey } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey =
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    // 1. If Gemini API Key is available, call Google Gemini 1.5 Flash API
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('placeholder')) {
      try {
        // Format messages for Gemini API
        const contents = messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }],
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({
              reply: candidateText,
              provider: 'gemini',
            });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('[Gemini API Warning]', errData);
          // Fall through to smart institutional responder if API key has issues
        }
      } catch (geminiError) {
        console.warn('[Gemini API Error, falling back to local reasoning]', geminiError);
      }
    }

    // 2. High-Fidelity Built-in Institutional Knowledge Engine Fallback
    const reply = generateSmartInstitutionalReply(lastUserMessage);
    return NextResponse.json({
      reply,
      provider: 'institutional-engine',
    });
  } catch (error: any) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------------
// Built-in Knowledge Base Engine (Guarantees zero downtime and complete accuracy)
// ----------------------------------------------------------------------------
function generateSmartInstitutionalReply(query: string): string {
  const q = query.toLowerCase();

  // 1. Credentials / Login questions
  if (q.includes('login') || q.includes('credential') || q.includes('password') || q.includes('email') || q.includes('sign in')) {
    return `### Institutional Login Credentials:

Here are the official access credentials for all roles:

- **Student Access**:
  - **Email**: \`241fa18067@campus.edu.in\` (MD SAHIL • Sec A) or \`241fa04070@campus.edu.in\` (SAGAR • Sec B)
  - **Password**: \`Password@123\`
  - [Click here to Sign In](/login)

- **Faculty Access**:
  - **Email**: \`ananya.sharma@campus.edu.in\` (Prof. Ananya Sharma • FAC210)
  - **Password**: \`Password@123\`
  - [Go to Faculty Dashboard](/faculty)

- **Administrator Access**:
  - **Email**: \`admin@campus.edu.in\` (Dr. K. Ramanathan)
  - **Password**: \`Password@123\`
  - [Go to Admin Governance](/admin)`;
  }

  // 2. Student Portal / Profile questions
  if (q.includes('student') && (q.includes('edit') || q.includes('profile') || q.includes('view') || q.includes('score') || q.includes('portal'))) {
    return `### Student Success Portal (/student)

In the [Student Portal](/student), students can:
1. **View Personal Success Score (0-100)**: A comprehensive rating based on Academics, Attendance, LMS, Engagement, Placement Readiness, Skills, and Feedback.
2. **"How to Improve" Action Plan**: Sensitivity recommendations showing high-ROI tasks to quickly boost scores.
3. **Edit Profile & Coding Links**: Students can update their **Full Name** and links to **LeetCode**, **GitHub**, **LinkedIn**, and **CodeChef**.
4. **Certified Immutability**: Academic CGPA, CIE marks, and biometric attendance are certified and read-only.
5. **Upcoming Exams & Results**: View test schedules and tie-aware standings.
6. **Anonymous Feedback**: Submit confidential issues directly to academic coordinators.

👉 [Open Student Portal](/student)`;
  }

  // 3. Faculty / Exam questions
  if (q.includes('faculty') || q.includes('exam') || q.includes('appoint') || q.includes('start') || q.includes('stop') || q.includes('result')) {
    return `### Faculty Exam & Cohort Intelligence (/faculty)

The [Faculty Dashboard](/faculty) enables faculty members to:
1. **Cohort Analytics**: Monitor Year 3 Sections A, B, and C with early warnings for attendance below 75%.
2. **Needs Attention Table**: Priority roster with risk probabilities (0.00 - 1.00) and actionable interventions.
3. **Generate Exams**: Create dynamic MCQ assessments with options, explanations, or bulk CSV uploads.
4. **Exam Lifecycle Controls**:
   - **Start Exam**: Sets the exam status to LIVE, allowing students to submit answers.
   - **Stop Exam**: Concludes the test session and freezes submissions.
5. **Leaderboard Grading**: View submission turnout (e.g. *17 of 120 submitted*) and click **"Appoint Marks"** to moderate scores, which immediately recalculates rankings and student Success Scores.

👉 [Open Faculty Dashboard](/faculty)`;
  }

  // 4. Admin Governance
  if (q.includes('admin') || q.includes('governance') || q.includes('heatmap') || q.includes('weight') || q.includes('audit')) {
    return `### Institutional Governance (/admin)

Administrators have comprehensive institution-wide oversight:
1. **Department Benchmarks & Heatmaps**: Cross-section comparisons and risk heatmaps.
2. **Profile Lookup**: Full dossier inspection for any Student (e.g. \`241FA18067\`) or Faculty (\`FAC210\`).
3. **Score Weight Tuner**: Fine-tune indicator weights with live recalculation preview.
4. **CSV Importer**: Batch upload student metric records with verification.
5. **Compliance Audit Ledger**: Tamper-proof history of interventions and mark modifications.

👉 [Open Admin Governance](/admin)`;
  }

  // 5. Success Score Formula
  if (q.includes('formula') || q.includes('calculate') || q.includes('success score') || q.includes('weights')) {
    return `### Student Success Score Formula (0 - 100)

The score is calculated from 7 normalized indicators:
- **Academic (30 pts)**: CGPA (50%) + Avg CIE Marks (35%) - Backlog penalties (15%).
- **Attendance (20 pts)**: Scaled against biometric records, with an immediate alert below 75%.
- **LMS Activity (10 pts)**: 30-day login frequency and assignment completion rate.
- **Engagement (10 pts)**: Hackathons, clubs, campus events, and certifications.
- **Placement Readiness (15 pts)**: Aptitude, technical coding, and mock interview performance.
- **Holistic Skills (10 pts)**: Communication, programming, leadership, and sports.
- **Feedback (5 pts)**: Course satisfaction and mentor feedback.

Admins can customize these weights in the [Weight Tuner](/admin).`;
  }

  // 6. Placement / Recruiters
  if (q.includes('placement') || q.includes('company') || q.includes('package') || q.includes('tcs') || q.includes('blinkit')) {
    return `### Campus Placement Analytics (/#placements)

CampusPulse tracks 8 years of historical campus placement data (2019-2026):
- **Current Placement Rate**: 88.5%
- **Top Recruiters**: Blinkit (up to 20 LPA), Amazon (up to 38 LPA), TCS, Cognizant, Infosys, and HCL.
- **Interactive Year & Company Filters**: Analyze placement ratios and salary trends.

👉 [View Placements Section](/#placements)`;
  }

  // 7. Announcements
  if (q.includes('announcement') || q.includes('circular') || q.includes('fest') || q.includes('notice')) {
    return `### Official Campus Announcements (/#announcements)

All circulars are categorized and filterable:
- **Exams**: Mid-term schedules (CIE-2) and hall ticket guidelines.
- **Placement Bootcamps**: Blinkit and Tier-1 preparation tracks.
- **Schedule Changes**: Laboratory and lecture reschedule alerts.
- **Fests**: Annual TechFest "INVENTO 2026" registrations.
- **Sports**: Inter-branch cricket tournament fixtures.

👉 [View Announcements Section](/#announcements)`;
  }

  // General Overview
  return `### Welcome to CampusPulse!

**CampusPulse** is an intelligent Student Success & Decision Analytics platform built for the KPMG Smart Campus Analytics challenge. It converts fragmented college records into actionable early-warning insights.

**Quick Navigation Guide:**
- 🎓 **Students**: View your Success Score, improvement roadmap, exams, and edit profile links at [Student Portal](/student).
- 👩‍🏫 **Faculty**: Monitor section cohorts, generate MCQs, start/stop exams, and appoint leaderboard marks at [Faculty Dashboard](/faculty).
- 🏛️ **Administrators**: Analyze risk heatmaps, profile lookups, score weights, and audit trails at [Admin Governance](/admin).
- 📢 **Campus Community**: Browse [Announcements](/#announcements) and [Placement Trends](/#placements).
- 🔑 **Authentication**: Sign in using institutional credentials at [Sign In](/login).

What would you like to explore or do next?`;
}
