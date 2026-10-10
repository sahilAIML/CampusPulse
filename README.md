# 🎓 CampusPulse — Smart Campus Analytics & Decision Intelligence
### KPMG "Smart Campus Analytics" Challenge Solution
*Decision Intelligence, Explainable Early-Warning Analytics & ML-Driven Student Success*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/AI_Assistant-Google_Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![ML Model](https://img.shields.io/badge/ML_Model-Logistic_Regression_Inference-FF6F00?logo=scikit-learn)](https://github.com/sahilAIML/CampusPulse)
[![Font](https://img.shields.io/badge/Font-Oxanium-coral)](https://fonts.google.com/specimen/Oxanium)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA_Compliant-success)](#accessibility--design-system)

---

## 🌟 Executive Overview
**CampusPulse** transforms fragmented campus data (biometric RFID turnstiles, continuous internal evaluation marks, LMS engagement logs, coding profiles, and CDC placement assessments) into **actionable, explainable decision intelligence**. 

Unlike retrospective dashboards that report failures after semester finals, CampusPulse operates as a **leading-indicator early-warning platform**, empowering faculty mentors to intervene weeks ahead, forecasting machine-learning placement risk, and providing students with algorithmic, high-ROI improvement roadmaps.

---

## 🚀 Key Portal Experiences

### 1. 🏛️ Public Landing Page (`/`)
- **Cinematic HD Video Background**: Edge-to-edge campus background animation with dark frosted glassmorphism scrim and luminous white typography.
- **Interactive Block Puzzle Simulation**: Smooth 8x8 tactile arcade simulation with automatic polyomino placement, streak multipliers, combo clears, and piece staging tray.
- **Live Institutional Metric Chips**: Animated count-ups for students tracked ($120+$), at-risk caught early ($28$), average CGPA ($7.64$), and placement rate ($88.5\%$).
- **Official Circulars & Announcements**: Category-filtered notices (exam timetables, hackathons, placement drives, campus fests).
- **Placement Explorer (`/placements`)**: Interactive 8-year trend ComposedChart (2019–2026) and recruiter hiring statistics (Amazon, Blinkit, TCS, Cognizant, Infosys, HCL).
- **PulseBot AI Guide**: Real-time floating assistant powered by Google Gemini API answering curriculum, login, and navigation questions.

---

### 2. 🎓 Student Self-Service Space (`/student`)
- **Trained ML Placement Risk Prediction**:
  - Live prediction card powered by a trained logistic regression model (`lib/ml/placement_model_trained.json`).
  - **Dynamic Risk Adjustment**: As students complete coding tasks, submit assignments, and practice interviews, their placement risk dynamically decreases in real time.
- **Encouraging Success Score Gauge**: 0–100 Success Score framed with positive reinforcement, highlighting "Priority Growth Focus Areas".
- **"How to Improve" High-ROI Action Plan**: Sensitivity engine ranking actions by **highest points gained for least required effort** (e.g., *+10% attendance = +2.4 points*). Includes live simulated score preview!
- **The 7 Success Indicators**: Academic (30), Attendance (20), LMS (10), Engagement (10), Placement (15), Skills (10), Feedback (5).
- **Upcoming Examinations & Test Launcher**: Scheduled internal tests with syllabus scopes and direct links to timed exam attempt screens (`/student/exam/[id]`).
- **Verified Coding Profiles**: Real-time sync cards for LeetCode, CodeChef, GitHub, and LinkedIn.
- **100% Anonymous Grievance Channel**: Confidential feedback channel for lab hardware, pacing, or stress with zero student metadata attached.

---

### 3. 👨‍🏫 Faculty Intelligence Portal (`/faculty`)
- **Section Filtering**: Tactile pill toggles for Section A, Section B, Section C, and Institutional All.
- **Instant Student Search**: Search by roll number (e.g., `241FA18067`) or student name with instant autocomplete suggestions.
- **Cohort KPI Row**: Real-time cards for average Success Score, students at risk, and attendance below 75% with trend sparklines.
- **"Needs Attention" Priority Table**: Sortable roster displaying Marks, Backlogs, CGPA, Attendance, and Compound Risk Index ($0.0 - 1.0$).
- **Deep-Dive Student Drawer**: 
  - Circular score gauge & 7-indicator radar chart.
  - **"Why This Score?" Waterfall**: 100% mathematical explainability breakdown.
  - Intervention assignment form with mentor notes and compliance audit tracking.
- **Dynamic Exam Generator (`/faculty` Exams Tab)**: Dynamic MCQ builder, section targeting, CSV question import, and publish workflows.
- **Leaderboard & "Appoint Marks" Engine**: Direct mark allocation with instant Success Score and class standing recomputation.

---

### 4. 🛡️ Institutional Administration & Governance (`/admin`)
- **Institutional Overview & Risk Heatmap**: Department comparisons (CSE, AI & DS, ECE, IT) and a Section $\times$ Dimension Risk Heatmap across all 7 indicators.
- **Official Vignan CSE Faculty Directory (123 Profiles)**:
  - Complete integration of the official **Vignan University CSE Faculty dataset** (`vignan_cse_faculty.csv`).
  - **Designation Breakdown**: Counters for Professors, Associate Professors, and Assistant Professors.
  - **Live Search & Domain Chips**: Filter by Faculty ID (`CSE_001` to `CSE_123`), Name, Designation, or Research Topics (*Machine Learning, Deep Learning, Image Processing, Cloud, Networks, Cyber Security*).
  - **Dual Layout Toggle**: Switch between responsive Grid Cards and full Data Table.
  - **Comprehensive Dossiers**: High-resolution official photos, workload hours, assigned sections, cabin hours, and direct links to official Vignan University profiles.
  - **CSV Export**: Direct one-click download of the complete `vignan_cse_faculty.csv`.
- **Single-ID Profile Dossier Lookup**: Query any Faculty ID (`CSE_001`) or Student Roll No (`241FA18067`) to generate comprehensive dossiers with full workloads or coding links.
- **Live Score Weight Tuning**: Interactive sliders for all 7 indicators with real-time mathematical recomputation previews showing affected cohort scores and at-risk deltas.
- **Student CSV Ingestion Engine**: Strict validation engine reporting valid vs failed rows, duplicate roll numbers, and detailed field anomaly tables.
- **User Management & RBAC**: Role privileges and status toggles for students, faculty, and administrators.
- **Announcements & Placements CRUD**: Real-time create, view, and delete operations.
- **Immutable Audit Trail**: Compliance ledger tracking actors, timestamps, severities, and targets.

---

### 5. ⚡ Guided Interactive Demo Mode
- Accessible globally via the floating **"⚡ Guided Story: At-Risk Recovery"** button.
- 4-step guided story:
  1. **Discover At-Risk Student**: Highlights SAGAR (`241FA04070`), CGPA 5.4, 5 backlogs, 61.2% attendance.
  2. **See the Explanation**: View the -15 pt arrear penalty, attendance flag, and low LMS activity.
  3. **Assign Intervention**: Prescribes Saturday Remedial Tutoring and Biometric Check-in Mentorship.
  4. **Watch the Score Recover!**: Live animated simulation where attendance hits 78.4%, backlogs reduce, and Success Score climbs from **36.2 $\rightarrow$ 68.5**!

---

## 🔑 Verified Login Credentials

| Role | Name / Identifier | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | MD SAHIL (`241FA18067`) | `241fa18067@campus.edu.in` | `Password@123` | [`/student`](http://localhost:3000/student) |
| **Student (At-Risk)** | SAGAR (`241FA04070`) | `241fa04070@campus.edu.in` | `Password@123` | [`/student`](http://localhost:3000/student) |
| **Faculty (Mentor)** | Prof. Ananya Sharma (`FAC210`) | `ananya.sharma@campus.edu.in` | `Password@123` | [`/faculty`](http://localhost:3000/faculty) |
| **Faculty (Alternate)** | Dr. K.V. Krishna Kishore (`CSE_001`) | `k.v.krishna.kishore@campus.edu.in` | `Password@123` | [`/faculty`](http://localhost:3000/faculty) |
| **Admin** | Dr. K. Ramanathan (`ADM001`) | `admin@campus.edu.in` | `Password@123` | [`/admin`](http://localhost:3000/admin) |

*Note: 1-click Quick Login shortcuts are also available directly on the landing page auth modal and login screen.*

---

## 📊 Datasets Included

1. **Vignan CSE Faculty Dataset ([`vignan_cse_faculty.csv`](public/vignan_cse_faculty.csv))**:
   - 123 verified faculty profiles from Vignan University Department of Computer Science & Engineering.
   - Contains: `faculty_id`, `name`, `designation`, `department`, `research_interests`, `photo_url`, `profile_url`, `source`.
   - Structured JSON dataset at [`lib/data/vignan_faculty.json`](lib/data/vignan_faculty.json).

2. **Master Student Cohort Dataset ([`students_complete_master_dataset.csv`](public/students_complete_master_dataset.csv))**:
   - 120 verified B.Tech CSE Year 3 students across Sections A, B, and C.
   - Contains: Roll numbers, demographics, CGPA, attendance percentages, CIE-1/2 marks, backlogs, coding handles, placement readiness, and behavioral segments.

3. **Trained ML Model Weights ([`lib/ml/placement_model_trained.json`](lib/ml/placement_model_trained.json))**:
   - Normalized Logistic Regression weights trained on the 120-student cohort to predict placement risk probability ($0.0 - 1.0$).

---

## 🏗️ Architecture & Data Access Layer (DAL)

CampusPulse enforces a **typed data-access abstraction** located in `/lib/data/*`. UI components **never call database clients directly**.

```
CampusPulse App
│
├── /app/
│   ├── layout.tsx            # Global layout, Oxanium font & HD background video
│   ├── page.tsx              # Landing page & Block Puzzle simulation
│   ├── /student/             # Student self-service & ML Placement Risk
│   ├── /faculty/             # Faculty dashboard, cohort table & exam builder
│   ├── /admin/               # Admin governance & Vignan Faculty Directory
│   └── /api/chat/            # Gemini-powered PulseBot API route
│
├── /components/
│   ├── /hero/                # BlockPuzzleSimulation & StatChips
│   ├── /admin/               # FacultyDirectory, ProfileLookup, WeightTuner, CSVImporter
│   ├── /faculty/             # PriorityTable, AnalyticsGrid, ExamGenerator, StudentDrawer
│   ├── /student/             # PlacementRiskCard, SensitivityPlan, IndicatorCards
│   └── /chatbot/             # CampusPulseChatbot UI
│
├── /lib/
│   ├── /data/                # Typed Data Access Layer (students, faculty, admin, auth)
│   ├── /ml/                  # ML Placement inference engine & trained weights
│   └── /analytics/           # Success score formula & benchmark engine
│
└── /supabase/migrations/
    ├── 20261009000001_initial_schema.sql  # Relational schema with RLS policies
    └── 20261009000002_views.sql           # Database views & seed data
```

---

## 🎨 Design System, Aesthetics & Theme System

### 🌓 Universal Black, White & B&W Theme System
CampusPulse features a multi-mode theme switcher accessible across **every single portal**:
- **☀️ White Theme (Light Mode)**: Crisp, clean light aesthetic with high-contrast slate typography and soft claymorphic shadows.
- **🌙 Black Theme (Dark Mode)**: Deep dark obsidian/slate aesthetic with luminous glowing highlights and white typography.
- **🏁 B&W Theme (High-Contrast Monochrome)**: Pure black-and-white high-contrast mode with grayscale filter for enhanced readability and focus.

#### Available Everywhere:
- **Student Portal (`/student`)**: Header quick-selector & exam control bar (`/student/exam/[id]`).
- **Faculty Portal (`/faculty`)**: Sticky header bar & sidebar navigation drawer.
- **Admin Portal (`/admin`)**: Institutional governance header & desktop admin sidebar.
- **Login Portal (`/login`)**: Direct theme switcher above credentials card.
- **Landing Navigation (`/`)**: Desktop navbar & responsive mobile drawer.
- **Zero-Flicker Pre-Hydration**: Stored in `localStorage` (`campuspulse_theme`) and applied inline before DOM rendering to eliminate theme flashes.

---

### ✨ Visual Design & Typography
- **Global Typography**: Google Font **Oxanium** applied across all headings, cards, and data metrics.
- **Tactile Claymorphism**: Soft double shadows, specular highlights, and pastel accents (Coral `#FF7A59`, Teal `#2EC4B6`, Indigo `#5B6CFF`, Amber `#FFA116`).
- **High-Contrast Typography**: Luminous white text with drop shadows rendered over edge-to-edge campus animation.
- **WCAG AA Compliance**: High contrast ratios and visible keyboard focus states (`*:focus-visible`).
- **Prefers-Reduced-Motion**: Respects system motion accessibility settings.

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or yarn

### 1. Installation
```bash
git clone https://github.com/sahilAIML/CampusPulse.git
cd CampusPulse
npm install
```

### 2. Environment Configuration
Create a `.env.local` file:
```env
DATA_MODE=mock
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_optional
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Execution
```bash
npm run build
npm run start
```

---

## 📚 Deliverables & Documentation
- [Student Success Score Mathematical Note](docs/SUCCESS_SCORE_NOTE.md): Formal 1-page explainability whitepaper and formulas.
- [6-Slide Pitch Deck Presentation Outline](docs/PITCH_DECK_6_SLIDES.md): Problem, data integration, algorithm, heatmap, demo, and impact.
- [Official Vignan CSE Faculty CSV](public/vignan_cse_faculty.csv): 123 verified university faculty members.
- [Master Student Dataset CSV](public/students_complete_master_dataset.csv): 120 verified student cohort telemetry records.
- [Database Migration Schema](supabase/migrations/20261009000001_initial_schema.sql): Complete PostgreSQL schema with indexes and RLS.

---

*Built with ❤️ for the KPMG Smart Campus Analytics Challenge. 100% Explainable. Built for Student Success.*
