/**
 * CampusPulse Video Configuration
 * Single source of truth for all text, durations, colours, and assets.
 * 
 * Target: 40 seconds @ 30 FPS = 1200 frames
 * Rhythm: 120 BPM (1 beat = 15 frames, cuts aligned to the musical beat)
 */

export interface SceneTiming {
  durationInSeconds: number;
  durationInFrames: number;
}

export interface ClickTarget {
  x: number; // Normalized coordinate (0 to 1, relative to screen width)
  y: number; // Normalized coordinate (0 to 1, relative to screen height)
  zoom: number; // Scale factor, defaults to 1.1x
}

export const VIDEO_CONFIG = {
  // Global Timing
  fps: 30,
  bpm: 120,
  totalDurationSeconds: 40,
  totalDurationFrames: 1200, // 40s * 30fps

  // Set to true to show high-fidelity pixel-perfect CampusPulse UI simulations
  // Set to false when you drop your actual screen recordings into public/assets/
  useSimulatedScreensByDefault: true,

  // Compositions Dimensions
  dimensions: {
    landscape: {
      width: 1920,
      height: 1080,
    },
    vertical: {
      width: 1080,
      height: 1920,
    },
  },

  // Brand Palette: Pure Claymorphism (No AI purple gradients, no glass blur)
  colors: {
    base: "#EEF1F6",       // Clay canvas base
    surface: "#F5F7FA",    // Subtle elevated surface
    card: "#FFFFFF",       // White clay card
    coral: "#FF7A59",      // Primary accent coral
    coralDark: "#E65C38",
    coralSoft: "#FFEBE6",
    teal: "#2EC4B6",       // Secondary accent teal
    tealDark: "#1E9D91",
    tealSoft: "#E6F9F7",
    sun: "#FFC857",        // Tertiary accent sun
    sunDark: "#DDA527",
    sunSoft: "#FFF8E7",
    navy: "#0F172A",       // Headings & high contrast text
    slate: "#1E293B",      // Body copy & prominent labels
    muted: "#64748B",      // Secondary metadata & captions
    subtle: "#94A3B8",     // Subtle accents & borders
    border: "#E2E8F0",
    
    // Clay Shadow Presets
    clayCardShadow: "16px 16px 32px rgba(166, 180, 200, 0.45), -14px -14px 28px rgba(255, 255, 255, 0.95)",
    clayCardInset: "inset 2px 2px 4px rgba(255, 255, 255, 0.7), inset -2px -2px 4px rgba(166, 180, 200, 0.2)",
    clayPillShadow: "8px 8px 18px rgba(166, 180, 200, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.95)",
    clayLaptopShadow: "0 35px 70px -15px rgba(100, 116, 139, 0.4), 0 15px 30px -10px rgba(100, 116, 139, 0.25)",
    clayPhoneShadow: "0 30px 60px -12px rgba(100, 116, 139, 0.45), -12px -12px 25px rgba(255, 255, 255, 0.9)",
  },

  // Typography
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Nunito', sans-serif",
    headingWeight: 800,
    bodyWeight: 700,
  },

  // Author & Challenge Metadata
  meta: {
    productName: "CampusPulse",
    tagline: "Student data. Finally useful.",
    challengeTag: "Built for the KPMG Smart Campus Analytics Challenge",
    creatorName: "Sahil", // Editable creator name
    liveUrl: "https://campuspulse.bytexl.live/",
    displayUrl: "campuspulse.bytexl.live",
  },

  // Asset Files (Located in public/assets/)
  assets: {
    intro: "assets/intro.mp4",
    outro: "assets/outro.mp4",
    landing: "assets/landing.mp4",
    faculty: "assets/faculty.mp4",
    student: "assets/student.mp4",
    admin: "assets/admin.mp4",
    mobile: "assets/mobile.mp4",
    audio: "assets/audio.wav",
    audioFallback: "assets/audio.wav",
  },

  // Transitions
  transitions: {
    whipDurationFrames: 6, // 6-frame snappy whip cut on the beat
    springConfig: {
      damping: 14,
      mass: 0.8,
      stiffness: 120,
    },
    bouncySpring: {
      damping: 10,
      mass: 0.6,
      stiffness: 150,
    },
  },

  // Scene-by-Scene Breakdown (0-40s)
  scenes: {
    // 0-4s: Intro AI clip + Kinetic Title
    scene1_intro: {
      durationInSeconds: 4,
      durationInFrames: 120, // Frames 0 - 120 (8 beats)
      badge: "DECISION INTELLIGENCE",
      titlePrimary: "Student data.",
      titleAccent: "Finally useful.",
      subtitle: "From fragmented campus silos to explainable early-warning intelligence.",
      caption: "Student data. Finally useful.",
      videoAsset: "assets/intro.mp4",
      highlightPills: ["Biometrics", "LMS Footprints", "CIE Assessments", "Career Readiness"],
    },

    // 4-9s: Big Stat Counters Pop In
    scene2_stats: {
      durationInSeconds: 5,
      durationInFrames: 150, // Frames 120 - 270 (10 beats)
      sectionBadge: "INSTITUTIONAL METRICS",
      heading: "Actionable Telemetry at Scale",
      caption: "120 students unified. 7 data sources. 0-100 explainable score.",
      stats: [
        {
          id: "students",
          value: "120",
          suffix: "+",
          label: "students unified",
          description: "Live CSE cohort telemetry",
          accent: "#FF7A59", // Coral
          delayFrames: 5,
        },
        {
          id: "sources",
          value: "7",
          suffix: "",
          label: "data sources",
          description: "RFID, LMS, CIE, CDC, GitHub",
          accent: "#2EC4B6", // Teal
          delayFrames: 25,
        },
        {
          id: "score",
          value: "0–100",
          suffix: "",
          label: "explainable score",
          description: "Mathematical Student Success Index",
          accent: "#FFC857", // Sun
          delayFrames: 45,
        },
      ],
    },

    // 9-16s: Faculty Dashboard Footage
    scene3_faculty: {
      durationInSeconds: 7,
      durationInFrames: 210, // Frames 270 - 480 (14 beats)
      portalBadge: "FACULTY INTELLIGENCE PORTAL",
      callout: "Spot at-risk students early",
      subtext: "Live cohort filters, RFID attendance drop alerts & compound risk radar.",
      caption: "Spot at-risk students early with leading-indicator analytics.",
      videoAsset: "assets/faculty.mp4",
      chips: ["Section Cohorts", "Compound Risk Index", "Early Alerts"],
      clickTarget: {
        x: 0.65,
        y: 0.44,
        zoom: 1.12,
      },
      clickActionLabel: "Needs Attention Roster",
      clickFrameOffset: 45, // click occurs 1.5s into the scene
    },

    // 16-22s: Explainable Score Drawer
    scene4_drawer: {
      durationInSeconds: 6,
      durationInFrames: 180, // Frames 480 - 660 (12 beats)
      portalBadge: "STUDENT SUCCESS SCORE (SSS)",
      callout: "See exactly WHY",
      subtext: "100% mathematical waterfall breakdown — zero opaque AI hallucinations.",
      caption: "See exactly WHY. 100% explainable mathematical breakdown.",
      videoAsset: "assets/student.mp4",
      chips: ["Academic (30%)", "Biometric (20%)", "LMS (10%)", "Placement (15%)"],
      clickTarget: {
        x: 0.72,
        y: 0.48,
        zoom: 1.15,
      },
      clickActionLabel: "Explainability Waterfall",
      clickFrameOffset: 40,
    },

    // 22-27s: Segments + Interventions
    scene5_segments: {
      durationInSeconds: 5,
      durationInFrames: 150, // Frames 660 - 810 (10 beats)
      portalBadge: "PRESCRIPTIVE ACTION ROADMAPS",
      callout: "Targeted action, not guesswork",
      subtext: "Sensitivity-driven recommendations: +10% attendance yields +2.4 score points.",
      caption: "Targeted action, not guesswork. Algorithmic student roadmaps.",
      videoAsset: "assets/faculty.mp4",
      chips: ["High-ROI Actions", "One-Click Interventions", "Audit Trail"],
      clickTarget: {
        x: 0.48,
        y: 0.54,
        zoom: 1.12,
      },
      clickActionLabel: "Assign Remedial Intervention",
      clickFrameOffset: 35,
    },

    // 27-33s: Placement Trends + Admin Lookup
    scene6_trends: {
      durationInSeconds: 6,
      durationInFrames: 180, // Frames 810 - 990 (12 beats)
      portalBadge: "INSTITUTIONAL PLACEMENT EXPLORER",
      callout: "Real-time trends & zero guesswork",
      subtext: "8-year multi-company hiring trends (2019–2026) & instant roll number lookup.",
      caption: "Placement trends and admin lookup with fast rhythmic cuts.",
      videoAsset: "assets/admin.mp4",
      chips: ["Amazon & Blinkit Stats", "Salary Benchmarks", "Instant Roll Search"],
      clickTarget: {
        x: 0.52,
        y: 0.42,
        zoom: 1.12,
      },
      clickActionLabel: "8-Year Placement Chart",
      clickFrameOffset: 30,
    },

    // 33-37s: Phone Mockup
    scene7_mobile: {
      durationInSeconds: 4,
      durationInFrames: 120, // Frames 990 - 1110 (8 beats)
      portalBadge: "CROSS-PLATFORM ARCHITECTURE",
      callout: "Responsive on every device",
      subtext: "Optimized touch ergonomics for students on the move and faculty in lecture halls.",
      caption: "Responsive on every device. Real-time notifications on the go.",
      videoAsset: "assets/mobile.mp4",
      chips: ["Touch Native", "Instant Mobile Alerts", "Offline PWA Sync"],
      clickTarget: {
        x: 0.50,
        y: 0.50,
        zoom: 1.08,
      },
      clickActionLabel: "Mobile Success Gauge",
      clickFrameOffset: 25,
    },

    // 37-40s: Outro Clip + Final Brag Card
    scene8_outro: {
      durationInSeconds: 3,
      durationInFrames: 90, // Frames 1110 - 1200 (6 beats)
      badge: "CAMPUSPULSE LIVE",
      productName: "CampusPulse",
      tagline: "Student data. Finally useful.",
      challengeTag: "Built for the KPMG Smart Campus Analytics Challenge",
      creatorName: "Sahil",
      liveUrl: "https://campuspulse.bytexl.live/",
      caption: "CampusPulse. Built for the KPMG Smart Campus Analytics Challenge.",
      videoAsset: "assets/outro.mp4",
    },
  },
} as const;

export type VideoConfig = typeof VIDEO_CONFIG;
