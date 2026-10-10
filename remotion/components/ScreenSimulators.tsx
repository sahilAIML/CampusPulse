import React from "react";
import { VIDEO_CONFIG } from "../config";

export const FacultyDashboardScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        fontFamily: VIDEO_CONFIG.fonts.body,
        color: VIDEO_CONFIG.colors.slate,
        padding: "24px 32px",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderBottom: "1px solid #E2E8F0",
          paddingBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: VIDEO_CONFIG.colors.coral,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: VIDEO_CONFIG.fonts.heading,
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            P
          </div>
          <div>
            <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 20, color: VIDEO_CONFIG.colors.navy }}>
              Faculty Intelligence Portal
            </div>
            <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted }}>
              Department of Computer Science & Engineering • Vignan University
            </div>
          </div>
        </div>

        {/* Section Pill Filters */}
        <div style={{ display: "flex", gap: 8, background: "#EEF2F6", padding: 4, borderRadius: 12 }}>
          {["Section A", "Section B", "Section C", "Institutional All"].map((sec, i) => (
            <div
              key={sec}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: i === 0 ? "#FFFFFF" : "transparent",
                color: i === 0 ? VIDEO_CONFIG.colors.navy : VIDEO_CONFIG.colors.muted,
                boxShadow: i === 0 ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {sec}
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 20 }}>
        <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted, fontWeight: 700 }}>Average Success Score</div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 32, color: VIDEO_CONFIG.colors.teal, marginTop: 4 }}>
            76.4 <span style={{ fontSize: 16, color: VIDEO_CONFIG.colors.muted }}>/ 100</span>
          </div>
          <div style={{ fontSize: 12, color: "#10B981", marginTop: 4, fontWeight: 700 }}>▲ +3.2% vs last semester</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 16, border: `1px solid ${VIDEO_CONFIG.colors.coralSoft}` }}>
          <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted, fontWeight: 700 }}>Needs Attention (At-Risk)</div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 32, color: VIDEO_CONFIG.colors.coral, marginTop: 4 }}>
            28 <span style={{ fontSize: 16, color: VIDEO_CONFIG.colors.muted }}>students</span>
          </div>
          <div style={{ fontSize: 12, color: VIDEO_CONFIG.colors.coral, marginTop: 4, fontWeight: 700 }}>Compound risk index &gt; 0.65</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "16px 20px", borderRadius: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted, fontWeight: 700 }}>Attendance Shortfall &lt; 75%</div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 32, color: VIDEO_CONFIG.colors.sunDark, marginTop: 4 }}>
            14 <span style={{ fontSize: 16, color: VIDEO_CONFIG.colors.muted }}>alerts</span>
          </div>
          <div style={{ fontSize: 12, color: VIDEO_CONFIG.colors.sunDark, marginTop: 4, fontWeight: 700 }}>Statutory exam detention risk</div>
        </div>
      </div>

      {/* Needs Attention Table */}
      <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 16, color: VIDEO_CONFIG.colors.navy }}>
            Needs Attention Priority Roster (Sorted by Risk Index)
          </div>
          <div style={{ fontSize: 12, background: "#F1F5F9", padding: "4px 10px", borderRadius: 6, color: VIDEO_CONFIG.colors.muted }}>
            Showing 4 of 28 Priority Cohort
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr 1fr 1fr 1fr", gap: 12, padding: "8px 12px", background: "#F8FAFC", borderRadius: 8, fontSize: 12, fontWeight: 800, color: VIDEO_CONFIG.colors.muted }}>
          <div>STUDENT NAME & ROLL</div>
          <div>SECTION</div>
          <div>ATTENDANCE</div>
          <div>CIE MARKS</div>
          <div>SUCCESS SCORE</div>
          <div>ACTION</div>
        </div>

        {/* Highlighted Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 0.8fr 0.8fr 1fr 1fr 1fr",
            gap: 12,
            padding: "12px 12px",
            background: "#FFF5F2",
            borderRadius: 10,
            border: `1.5px solid ${VIDEO_CONFIG.colors.coral}`,
            marginTop: 8,
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(255, 122, 89, 0.15)",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: VIDEO_CONFIG.colors.navy }}>Sai Kumar V.</div>
            <div style={{ fontSize: 12, color: VIDEO_CONFIG.colors.coral, fontWeight: 700 }}>241FA18067</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>CSE - Sec A</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: VIDEO_CONFIG.colors.coral }}>68.4% (Detain)</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>52.0 / 100</div>
          <div>
            <span style={{ background: VIDEO_CONFIG.colors.coral, color: "#FFFFFF", padding: "4px 10px", borderRadius: 6, fontWeight: 800, fontSize: 13 }}>
              54 / 100
            </span>
          </div>
          <div>
            <span style={{ background: VIDEO_CONFIG.colors.navy, color: "#FFFFFF", padding: "6px 14px", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
              See Why ➔
            </span>
          </div>
        </div>

        {/* Other rows */}
        {[
          { name: "Pooja Sharma", roll: "241FA18089", sec: "CSE - Sec A", att: "71.2%", cie: "58.5", score: "58", risk: "0.74" },
          { name: "Karthik Reddy", roll: "241FA18042", sec: "CSE - Sec B", att: "73.0%", cie: "61.0", score: "61", risk: "0.68" },
        ].map((s) => (
          <div
            key={s.roll}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 0.8fr 0.8fr 1fr 1fr 1fr",
              gap: 12,
              padding: "10px 12px",
              borderBottom: "1px solid #F1F5F9",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: VIDEO_CONFIG.colors.slate }}>{s.name}</div>
              <div style={{ fontSize: 11, color: VIDEO_CONFIG.colors.muted }}>{s.roll}</div>
            </div>
            <div>{s.sec}</div>
            <div style={{ color: "#E65C38", fontWeight: 700 }}>{s.att}</div>
            <div>{s.cie}</div>
            <div>
              <span style={{ background: "#F1F5F9", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>
                {s.score} / 100
              </span>
            </div>
            <div>
              <span style={{ color: VIDEO_CONFIG.colors.coral, fontWeight: 700, fontSize: 12 }}>View Dossier</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ExplainableDrawerScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F8FAFC",
        display: "flex",
        fontFamily: VIDEO_CONFIG.fonts.body,
        overflow: "hidden",
      }}
    >
      {/* Background Dimmed View */}
      <div style={{ width: "40%", height: "100%", opacity: 0.35, padding: 24 }}>
        <FacultyDashboardScreen />
      </div>

      {/* Slide-in Drawer */}
      <div
        style={{
          width: "60%",
          height: "100%",
          background: "#FFFFFF",
          boxShadow: "-12px 0 36px rgba(0,0,0,0.12)",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderLeft: "1px solid #E2E8F0",
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 24, color: VIDEO_CONFIG.colors.navy }}>
                Sai Kumar V.
              </div>
              <span style={{ background: VIDEO_CONFIG.colors.coralSoft, color: VIDEO_CONFIG.colors.coral, fontWeight: 800, fontSize: 12, padding: "2px 8px", borderRadius: 6 }}>
                HIGH RISK (0.82)
              </span>
            </div>
            <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted, marginTop: 2 }}>
              Roll: 241FA18067 • B.Tech CSE (3rd Year) • Section A
            </div>
          </div>

          {/* SSS Score Gauge Badge */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: VIDEO_CONFIG.colors.muted, textTransform: "uppercase" }}>
              Student Success Score
            </div>
            <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 36, color: VIDEO_CONFIG.colors.coral, lineHeight: 1 }}>
              54 <span style={{ fontSize: 16, color: VIDEO_CONFIG.colors.muted }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* 7-Indicator Multi-Factor Breakdown */}
        <div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 15, color: VIDEO_CONFIG.colors.navy, marginBottom: 8 }}>
            The 7 Success Indicators
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Academic CIE (30%)", score: "14.2 / 30", pct: 47, color: VIDEO_CONFIG.colors.coral },
              { label: "Biometric Attendance (20%)", score: "13.6 / 20", pct: 68, color: VIDEO_CONFIG.colors.coral },
              { label: "LMS Engagement (10%)", score: "4.5 / 10", pct: 45, color: VIDEO_CONFIG.colors.sunDark },
              { label: "Placement Readiness (15%)", score: "8.5 / 15", pct: 56, color: VIDEO_CONFIG.colors.teal },
              { label: "Practical Skills (10%)", score: "5.2 / 10", pct: 52, color: VIDEO_CONFIG.colors.teal },
              { label: "Institutional Feedback (5%)", score: "3.5 / 5", pct: 70, color: "#10B981" },
            ].map((ind) => (
              <div key={ind.label} style={{ background: "#F8FAFC", padding: "8px 12px", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}>
                  <span>{ind.label}</span>
                  <span style={{ fontWeight: 800, color: ind.color }}>{ind.score}</span>
                </div>
                <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: `${ind.pct}%`, height: "100%", background: ind.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Score Waterfall Card */}
        <div
          style={{
            background: "#FFF9F7",
            borderRadius: 14,
            border: `1.5px solid ${VIDEO_CONFIG.colors.coral}`,
            padding: "16px 20px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: VIDEO_CONFIG.colors.coral, color: "#FFFFFF", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
              EXPLAINABILITY NOTE
            </span>
            <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 16, color: VIDEO_CONFIG.colors.navy }}>
              100% Mathematical Explainability Waterfall
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981", fontWeight: 700 }}>
              <span>+ Base Baseline Calibration</span>
              <span>+50.0 pts</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: VIDEO_CONFIG.colors.coral, fontWeight: 800 }}>
              <span>− Formative Assessment F1 &lt; 55% Benchmark</span>
              <span>−12.4 pts</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: VIDEO_CONFIG.colors.coral, fontWeight: 800 }}>
              <span>− Attendance Shortfall Penalty (&lt; 75% Statutory Limit)</span>
              <span>−10.0 pts</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981", fontWeight: 700 }}>
              <span>+ LeetCode Active Streak (184 Solved)</span>
              <span>+4.2 pts</span>
            </div>
            <div style={{ borderTop: "1.5px dashed #CBD5E1", paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15, color: VIDEO_CONFIG.colors.navy }}>
              <span>Net Calculated Student Success Score (SSS)</span>
              <span style={{ color: VIDEO_CONFIG.colors.coral }}>54.0 / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SegmentsInterventionScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F8FAFC",
        padding: "28px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: VIDEO_CONFIG.fonts.body,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 24, color: VIDEO_CONFIG.colors.navy }}>
            Prescriptive Interventions & Sensitivity Engine
          </div>
          <div style={{ fontSize: 14, color: VIDEO_CONFIG.colors.muted }}>
            Targeted high-ROI student recommendations — ranked by highest score gain for least effort.
          </div>
        </div>
        <div style={{ background: VIDEO_CONFIG.colors.teal, color: "#FFFFFF", padding: "8px 18px", borderRadius: 10, fontWeight: 800, fontSize: 13 }}>
          Automated Roadmap
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, flex: 1 }}>
        {/* Intervention Plan */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 16, color: VIDEO_CONFIG.colors.navy }}>
            Recommended Interventions for Sai Kumar (241FA18067)
          </div>

          {[
            {
              action: "Attend next 6 Discrete Math lectures",
              roi: "+2.4 pts",
              effort: "LOW EFFORT",
              impact: "Brings attendance from 68.4% to 75.2% (Clears Detention Risk)",
              color: "#10B981",
            },
            {
              action: "Complete Module 3 Data Structures Quiz",
              roi: "+1.8 pts",
              effort: "LOW EFFORT",
              impact: "Recovers LMS engagement shortfall and unlocks lab certification",
              color: "#10B981",
            },
            {
              action: "Submit DBMS Lab 4 remedial report",
              roi: "+1.5 pts",
              effort: "MEDIUM EFFORT",
              impact: "Satisfies internal evaluation compliance criteria",
              color: VIDEO_CONFIG.colors.teal,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: VIDEO_CONFIG.colors.navy }}>{item.action}</span>
                  <span style={{ background: "#E2E8F0", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>
                    {item.effort}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: VIDEO_CONFIG.colors.muted, marginTop: 2 }}>{item.impact}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: "#ECFDF5", color: item.color, fontWeight: 800, fontSize: 16, padding: "4px 10px", borderRadius: 8 }}>
                  {item.roi}
                </span>
              </div>
            </div>
          ))}

          {/* Action Button */}
          <div
            style={{
              marginTop: "auto",
              background: VIDEO_CONFIG.colors.coral,
              color: "#FFFFFF",
              padding: "14px 20px",
              borderRadius: 12,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(255, 122, 89, 0.3)",
            }}
          >
            Assign Remedial Roadmap & Notify Student ➔
          </div>
        </div>

        {/* Score Simulation Card */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 16, color: VIDEO_CONFIG.colors.navy }}>
            Simulated SSS Score Projection
          </div>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted, fontWeight: 700 }}>Current Score ➔ Projected</div>
            <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 44, color: VIDEO_CONFIG.colors.teal, marginTop: 4 }}>
              54 ➔ 62.7
            </div>
            <div style={{ fontSize: 13, color: "#10B981", fontWeight: 800, marginTop: 4 }}>
              ▲ Net +8.7 points gain
            </div>
          </div>
          <div style={{ background: "#F1F5F9", borderRadius: 12, padding: 14, fontSize: 12, color: VIDEO_CONFIG.colors.slate, lineHeight: 1.5 }}>
            By completing these 3 prescriptive interventions, the student transitions from <strong>High Risk</strong> to <strong>Stable Standing</strong> before semester finals.
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlacementAdminScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F8FAFC",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: VIDEO_CONFIG.fonts.body,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 22, color: VIDEO_CONFIG.colors.navy }}>
            Institutional Placement Explorer (2019–2026)
          </div>
          <div style={{ fontSize: 13, color: VIDEO_CONFIG.colors.muted }}>
            8-Year historical placement telemetry & real-time corporate hiring analytics
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
            Search Roll: 241FA18067
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 18, flex: 1 }}>
        {/* Placement Chart Simulation */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 20, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: VIDEO_CONFIG.colors.navy }}>
              Cohort Placement Percentage vs Total Offers
            </div>
            <div style={{ fontSize: 12, color: "#10B981", fontWeight: 800 }}>88.5% Highest Ever (2026)</div>
          </div>

          {/* Bar Chart Simulation */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flex: 1, paddingBottom: 10, borderBottom: "1px solid #CBD5E1" }}>
            {[
              { year: "2019", pct: 72, h: "62%" },
              { year: "2020", pct: 74, h: "65%" },
              { year: "2021", pct: 79, h: "71%" },
              { year: "2022", pct: 81, h: "75%" },
              { year: "2023", pct: 84, h: "80%" },
              { year: "2024", pct: 86, h: "84%" },
              { year: "2025", pct: 87, h: "87%" },
              { year: "2026", pct: 88.5, h: "94%" },
            ].map((col, i) => (
              <div key={col.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: i === 7 ? VIDEO_CONFIG.colors.coral : VIDEO_CONFIG.colors.muted }}>
                  {col.pct}%
                </span>
                <div
                  style={{
                    width: "100%",
                    height: col.h,
                    background: i === 7 ? VIDEO_CONFIG.colors.coral : i % 2 === 0 ? VIDEO_CONFIG.colors.teal : "#CBD5E1",
                    borderRadius: "6px 6px 0 0",
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: VIDEO_CONFIG.colors.muted }}>{col.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Stats */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: VIDEO_CONFIG.colors.navy }}>Top Hiring Partners</div>
          {[
            { company: "Amazon", pkg: "44.0 LPA", hires: "18 Placed", color: "#FF9900" },
            { company: "Blinkit", pkg: "28.5 LPA", hires: "12 Placed", color: "#F7CA18" },
            { company: "TCS Digital", pkg: "9.0 LPA", hires: "42 Placed", color: "#0078D4" },
            { company: "Cognizant", pkg: "6.5 LPA", hires: "36 Placed", color: "#1F77B4" },
          ].map((c) => (
            <div key={c.company} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#F8FAFC", borderRadius: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{c.company}</div>
                <div style={{ fontSize: 11, color: VIDEO_CONFIG.colors.muted }}>{c.hires}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 13, color: VIDEO_CONFIG.colors.navy }}>{c.pkg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MobileStudentScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F8FAFC",
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: VIDEO_CONFIG.fonts.body,
        overflow: "hidden",
      }}
    >
      {/* Top Mobile Status Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 18, color: VIDEO_CONFIG.colors.navy }}>
            CampusPulse Student
          </div>
          <div style={{ fontSize: 11, color: VIDEO_CONFIG.colors.muted }}>
            Sai Kumar • 241FA18067
          </div>
        </div>
        <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#10B981" }} />
      </div>

      {/* SSS Score Gauge Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          textAlign: "center",
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, color: VIDEO_CONFIG.colors.muted, textTransform: "uppercase" }}>
          Success Score Index
        </div>
        <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 44, color: VIDEO_CONFIG.colors.coral, lineHeight: 1.1, marginTop: 4 }}>
          54 <span style={{ fontSize: 18, color: VIDEO_CONFIG.colors.muted }}>/ 100</span>
        </div>
        <div style={{ display: "inline-block", background: VIDEO_CONFIG.colors.coralSoft, color: VIDEO_CONFIG.colors.coral, fontWeight: 800, fontSize: 11, padding: "3px 10px", borderRadius: 9999, marginTop: 6 }}>
          Priority Growth Focus
        </div>
      </div>

      {/* ML Placement Risk */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 14, border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
          <span>Trained ML Placement Risk</span>
          <span style={{ color: VIDEO_CONFIG.colors.sunDark }}>38% (Moderate)</span>
        </div>
        <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: "38%", height: "100%", background: VIDEO_CONFIG.colors.sun, borderRadius: 3 }} />
        </div>
      </div>

      {/* Coding Profiles Sync */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "10px 12px", border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 11, color: VIDEO_CONFIG.colors.muted, fontWeight: 700 }}>LeetCode Solved</div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 20, color: VIDEO_CONFIG.colors.teal }}>
            184
          </div>
        </div>
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "10px 12px", border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 11, color: VIDEO_CONFIG.colors.muted, fontWeight: 700 }}>GitHub Commits</div>
          <div style={{ fontFamily: VIDEO_CONFIG.fonts.heading, fontWeight: 800, fontSize: 20, color: VIDEO_CONFIG.colors.navy }}>
            142
          </div>
        </div>
      </div>
    </div>
  );
};
