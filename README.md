# 🎓 CampusPulse — Student Success Platform
### KPMG "Smart Campus Analytics" Challenge Solution
*Decision Intelligence & Explainable Early-Warning Analytics for Higher Education*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA_Compliant-success)](#accessibility--design-system)

---

## 🌟 Executive Overview
**CampusPulse** transforms fragmented campus data (biometric RFID turnstiles, continuous internal evaluation marks, LMS logs, coding profiles, and CDC placement assessments) into **actionable, explainable decision intelligence**. 

Unlike retrospective dashboards that report failures after semester finals, CampusPulse operates as a **leading-indicator early warning system**, empowering faculty mentors to intervene weeks ahead and providing students with algorithmic, high-ROI improvement roadmaps.

---

## 🚀 Key Portal Experiences

### 1. 🏛️ Public Landing Page (`/`)
- **Signature Claymorphism Scene**: Soft tactile 3D graduation cap and interactive floating graph elements.
- **Live Institutional Metric Chips**: Animated count-ups for students tracked ($1,280+$), at-risk caught early ($28$), and placement rate ($88.5\%$).
- **Announcements Circulars**: Category filter chips (exam schedules, fests, timetable updates, placement drives) with clay card layouts.
- **Placements Explorer (`/placements`)**: Interactive 8-year trend ComposedChart (2019–2026) and recruiter hiring statistics.
- **Instant Role-Based Auth Modal**: 1-click evaluation shortcuts for Student, Faculty, and Admin personas.

### 2. 👨‍🏫 Faculty Intelligence Portal (`/faculty`)
- **Section Filtering**: Tactile pill toggles for Section A, Section B, Section C, and Institutional All.
- **Instant Student Search**: Search by roll number (e.g., `241FA18067`) or name with instant autocomplete suggestions.
- **Cohort KPI Row**: Real-time cards for average Success Score, students at risk, and attendance below 75% with trend sparklines.
- **"Needs Attention" Priority Table**: Sortable roster displaying Marks, Backlogs, CGPA, Attendance, and Compound Risk Index ($0.0 - 1.0$).
- **Deep-Dive Student Drawer**: 
  - Circular score gauge & 7-indicator radar chart.
  - **"Why This Score?" Waterfall**: 100% mathematical explainability breakdown.
  - Intervention assignment form with mentor notes and audit tracking.
- **Dynamic Exam Generator (`/faculty` Exams Tab)**: Dynamic MCQ builder, section targeting, CSV question import, and publish workflows.
- **Tie-Aware Exam Results**: Question accuracy breakdown, class average, topper score, and rank distribution.

### 3. 🎓 Student Self-Service Space (`/student`)
- **Encouraging Score Gauge**: Success Score (0–100) framed with positive reinforcement; risk is presented as **"Priority Growth Focus Areas"**.
- **"How to Improve" High-ROI Action Plan**: Sensitivity engine ranking actions by **highest points gained for least required effort** (e.g., *+10% attendance = +2.4 points*). Includes a live simulated score preview!
- **The 7 Success Indicators**: Academic (30), Attendance (20), LMS (10), Engagement (10), Placement (15), Skills (10), Feedback (5).
- **Upcoming Examinations & Test Launcher**: Scheduled internal tests with syllabus scopes and direct links to timed exam attempt screens (`/student/exam/[id]`).
- **Verified Coding Profiles**: Real-time sync cards for LeetCode, CodeChef, GitHub, and LinkedIn.
- **100% Anonymous Feedback Channel**: Confidential grievance submission for lab hardware, pacing, or stress with zero student metadata attached.

### 4. 🛡️ Institutional Administration & Governance (`/admin`)
- **Institutional Overview & Risk Heatmap**: Department comparisons (CSE, AI & DS, ECE, IT) and a Section $\times$ Dimension Risk Heatmap across all 7 indicators.
- **Single-ID Profile Dossier Lookup**: Enter either Faculty ID (`FAC210`) or Student Roll No (`241FA18067`) to generate comprehensive dossiers with full workloads or coding links.
- **Live Score Weight Tuning**: Interactive sliders for all 7 indicators with real-time mathematical recomputation previews showing affected cohort scores and at-risk deltas.
- **Student CSV Importer**: Strict validation engine reporting valid vs failed rows, duplicate roll numbers, and detailed field anomaly tables.
- **User Management**: Role modification (Student / Faculty / Admin) and account status toggles.
- **Announcements & Placements CRUD**: Real-time create, view, and delete operations.
- **Immutable Audit Trail**: Compliance ledger tracking actors, timestamps, severities, and targets.

### 5. ⚡ Guided Interactive Demo Mode
- Accessible globally via the floating **"⚡ Guided Story: At-Risk Recovery"** button.
- 4-step guided story:
  1. **Discover At-Risk Student**: Highlights SAGAR (`241FA04070`), CGPA 5.4, 5 backlogs, 61.2% attendance.
  2. **See the Explanation**: View the -15 pt arrear penalty, attendance flag, and low LMS activity.
  3. **Assign Intervention**: Prescribes Saturday Remedial Tutoring and Biometric Check-in Mentorship.
  4. **Watch the Score Recover!**: Live animated simulation where attendance hits 78.4%, backlogs reduce, and Success Score climbs from **36.2 $\rightarrow$ 68.5**!

---

## 🏗️ Architecture & Data Access Layer (DAL)

CampusPulse enforces a **typed data-access abstraction** located in `/lib/data/*`. UI components **never call database clients directly**.

```
CampusPulse App
│
├── /lib/data/
│   ├── auth.ts              # Authentication & persona session management
│   ├── students.ts          # Student records, section cohorts & drawer analytics
│   ├── faculty.ts           # Faculty profiles, assigned sections & workloads
│   ├── admin.ts             # Department metrics, heatmap, weight tuning & CSV ingest
│   ├── student-portal.ts    # Student self-service, sensitivity improvements & exams
│   ├── announcements.ts     # Institutional notices & circulars
│   ├── placements.ts        # Placement drive records & 8-year trends
│   ├── types.ts             # Comprehensive TypeScript data contracts
│   └── supabase-client.ts   # Dual-mode switcher (MockAdapter vs Live Supabase)
│
└── /supabase/migrations/
    ├── 20261009000001_initial_schema.sql  # Relational schema with RLS policies
    └── 20261009000002_seed_data.sql       # Realistic Indian engineering college cohort
```

### Dual-Mode Data Switching
Switch modes seamlessly via `.env.local`:
```bash
# Mock Mode (Zero dependencies, instant local execution)
DATA_MODE=mock

# Live Supabase Mode (Connects to PostgreSQL instance)
DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎨 Accessibility & Design System
- **Strict Claymorphism**: Soft tactile double shadows, warm off-white canvas (`#EEF1F6` / `#F3EEE7`), coral (`#FF7A59`), teal (`#2EC4B6`), and indigo (`#5B6CFF`).
- **WCAG AA Contrast**: High-contrast typography designed for readability across light and dark clay palettes.
- **Keyboard Navigation**: Global focus-visible rings (`*:focus-visible`) across all interactive cards, pills, and inputs.
- **Prefers-Reduced-Motion**: Automatically disables all non-essential transitions and float animations when system motion sensitivity is enabled.
- **Multi-Device Responsiveness**: Verified layouts across `360px` (mobile), `768px` (tablet), `1024px` (laptop), and `1440px` (desktop).

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or yarn

### 1. Installation
```bash
git clone https://github.com/your-org/campuspulse.git
cd campuspulse
npm install
```

### 2. Environment Configuration
Create a `.env.local` file:
```env
DATA_MODE=mock
```

### 3. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Start
```bash
npm run build
npm run start
```

---

## 📚 Deliverables & Documentation
- [Student Success Score Mathematical Note](docs/SUCCESS_SCORE_NOTE.md): Formal 1-page explainability whitepaper and formulas.
- [6-Slide Pitch Deck Presentation Outline](docs/PITCH_DECK_6_SLIDES.md): Problem, data integration, algorithm, heatmap, demo, and impact.
- [Database Migration Schema](supabase/migrations/20261009000001_initial_schema.sql): Complete PostgreSQL schema with indexes and RLS.

---
*Built with ❤️ for the KPMG Smart Campus Analytics Challenge. 100% Explainable. Built for Student Success.*
