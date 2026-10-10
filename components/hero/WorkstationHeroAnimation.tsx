'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Cpu,
  Sparkles,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Terminal,
  Activity,
  CheckCircle2,
} from 'lucide-react';

type ScreenTheme = 'analytics' | 'terminal' | 'cyber';

export function WorkstationHeroAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [screenTheme, setScreenTheme] = useState<ScreenTheme>('analytics');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [cpuFanDegree, setCpuFanDegree] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate CPU fans continuously when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCpuFanDegree((prev) => (prev + 12) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Code editor lines streaming effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveCodeLine((prev) => (prev + 1) % 6);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Gentle interactive parallax on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // -4 to +4 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[480px] select-none flex flex-col items-center"
    >
      {/* Dynamic Ambient Glow Behind Card */}
      <div className="absolute -top-6 -left-6 w-60 h-60 rounded-full bg-[#FF7A59]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-[#2EC4B6]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#5B6CFF]/20 blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Clay Card Container */}
      <div className="relative w-full rounded-[38px] bg-[var(--clay-card)]/90 backdrop-blur-xl border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)] p-4 sm:p-5 flex flex-col items-center transition-all">
        {/* Specular clay sheen reflection on top */}
        <div className="absolute top-2.5 left-6 right-6 h-6 rounded-full bg-white/40 blur-[2px] pointer-events-none" />

        {/* Header Telemetry Bar */}
        <div className="w-full flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[var(--clay-border)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#5B6CFF] to-[#3B4CCA] text-white flex items-center justify-center font-bold shadow-[var(--shadow-clay-badge)]">
              <Monitor className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                Workstation Perspective
              </span>
              <span className="font-heading font-extrabold text-xs text-[var(--clay-text)] flex items-center gap-1.5">
                <span>Desk & Ergonomic Chair</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>

          {/* Realtime 60FPS Status Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-[var(--clay-pressed)] border border-[var(--clay-border)]">
            <Activity className="h-3.5 w-3.5 text-[#2EC4B6] animate-pulse" />
            <span className="text-[10px] font-heading font-extrabold text-[var(--clay-text)]">
              60 FPS Loop
            </span>
          </div>
        </div>

        {/* Interactive Scene SVG Container */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B0F19]/90 to-[#131B2E]/95 border border-[var(--clay-border)]/40 shadow-inner flex items-center justify-center p-1 sm:p-2">
          {/* Subtle Top Ambient Neon Glow on Wall */}
          <div
            className={`absolute top-0 left-1/4 right-1/4 h-28 blur-3xl pointer-events-none transition-colors duration-700 ${
              screenTheme === 'analytics'
                ? 'bg-[#2EC4B6]/25'
                : screenTheme === 'terminal'
                ? 'bg-[#5B6CFF]/30'
                : 'bg-[#FF7A59]/30'
            }`}
          />

          {/* SVG Canvas (540 x 430 viewBox) */}
          <svg
            viewBox="0 0 540 430"
            className="w-full h-auto max-h-[380px] drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="deskTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#253248" />
                <stop offset="100%" stopColor="#182234" />
              </linearGradient>

              <linearGradient id="deskBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="40%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="monitorFrameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="monitorScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#090D16" />
                <stop offset="100%" stopColor="#0F1626" />
              </linearGradient>

              <linearGradient id="chairMeshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D3748" />
                <stop offset="50%" stopColor="#1A202C" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>

              <linearGradient id="chairSpineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A5568" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#2D3748" />
              </linearGradient>

              <linearGradient id="chromePistonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="40%" stopColor="#F8FAFC" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              <linearGradient id="keyboardRgbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF7A59" />
                <stop offset="50%" stopColor="#2EC4B6" />
                <stop offset="100%" stopColor="#5B6CFF" />
              </linearGradient>

              <radialGradient id="screenAmbientRadial" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor={
                    screenTheme === 'analytics'
                      ? '#2EC4B6'
                      : screenTheme === 'terminal'
                      ? '#5B6CFF'
                      : '#FF7A59'
                  }
                  stopOpacity="0.45"
                />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ========================================================
                LAYER 1: BACKGROUND ROOM WALL & MONITOR AMBIENT BACKGLOW
               ======================================================== */}
            {/* Monitor Bias Light Wash against wall */}
            <ellipse
              cx="260"
              cy="125"
              rx="180"
              ry="95"
              fill="url(#screenAmbientRadial)"
              className="transition-all duration-700"
            />

            {/* Ambient floating dust/code particles */}
            {isPlaying && (
              <g opacity="0.6">
                <circle cx="90" cy="70" r="1.5" fill="#2EC4B6">
                  <animate attributeName="cy" values="70;55;70" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="440" cy="80" r="2" fill="#FF7A59">
                  <animate attributeName="cy" values="80;60;80" dur="5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle cx="360" cy="50" r="1.5" fill="#5B6CFF">
                  <animate attributeName="cy" values="50;35;50" dur="3.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="110" r="1.2" fill="#FFA116">
                  <animate attributeName="cy" values="110;90;110" dur="4.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* ========================================================
                LAYER 2: DESK STRUCTURE & LEGS (FACING IN FRONT)
               ======================================================== */}
            {/* Left Desk Leg */}
            <rect x="75" y="240" width="14" height="150" rx="3" fill="url(#legGrad)" />
            <rect x="68" y="386" width="28" height="6" rx="2" fill="#0F172A" />

            {/* Right Desk Leg */}
            <rect x="445" y="240" width="14" height="150" rx="3" fill="url(#legGrad)" />
            <rect x="438" y="386" width="28" height="6" rx="2" fill="#0F172A" />

            {/* Desk Cable Management Bar */}
            <rect x="89" y="255" width="356" height="6" rx="3" fill="#1E293B" opacity="0.6" />

            {/* Desk Top Bevel (Side edge depth) */}
            <polygon
              points="40,240 500,240 510,248 30,248"
              fill="url(#deskBevelGrad)"
            />

            {/* Desk Top Main Surface (Isometric slate top) */}
            <polygon
              points="55,190 485,190 500,240 40,240"
              fill="url(#deskTopGrad)"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* Desk Surface Specular Edge Highlight */}
            <line x1="42" y1="240" x2="498" y2="240" stroke="#64748B" strokeWidth="1.5" opacity="0.7" />

            {/* Extended Desk Mat / Oversized Gaming Mousepad */}
            <polygon
              points="115,200 415,200 435,236 95,236"
              fill="#0B0F19"
              stroke="#2EC4B6"
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />

            {/* ========================================================
                LAYER 3: DESKTOP ACCESSORIES (MUG, PLANT, CPU TOWER)
               ======================================================== */}
            {/* Minimalist Potted Succulent Plant on Left Desk */}
            <g transform="translate(68, 192)">
              {/* Ceramic Pot */}
              <polygon points="4,22 18,22 15,35 7,35" fill="#E2E8F0" />
              <ellipse cx="11" cy="22" rx="7" ry="2" fill="#CBD5E1" />
              {/* Succulent Leaves */}
              <path d="M11,22 Q7,12 5,16 Q9,21 11,22" fill="#10B981" />
              <path d="M11,22 Q15,12 17,16 Q13,21 11,22" fill="#059669" />
              <path d="M11,22 Q11,8 11,14" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Ceramic Coffee Mug with Continuous Rising Steam */}
            <g transform="translate(100, 202)">
              {/* Mug Body */}
              <rect x="0" y="8" width="16" height="18" rx="3" fill="#F8FAFC" />
              <ellipse cx="8" cy="8" rx="8" ry="2.5" fill="#E2E8F0" />
              <ellipse cx="8" cy="8" rx="6.5" ry="1.8" fill="#78350F" /> {/* Hot Coffee */}
              {/* Mug Handle */}
              <path d="M16,11 C20,11 20,20 16,21" stroke="#F8FAFC" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Continuous Steam Wisps */}
              {isPlaying && (
                <g opacity="0.6">
                  <path d="M6,6 Q4,0 7,-6 Q9,-12 6,-18" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round">
                    <animate attributeName="d" values="M6,6 Q4,0 7,-6 Q9,-12 6,-18; M6,6 Q8,0 5,-6 Q3,-12 6,-18; M6,6 Q4,0 7,-6 Q9,-12 6,-18" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                  </path>
                  <path d="M10,6 Q12,1 9,-5 Q7,-11 10,-16" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round">
                    <animate attributeName="d" values="M10,6 Q12,1 9,-5 Q7,-11 10,-16; M10,6 Q8,1 11,-5 Q13,-11 10,-16; M10,6 Q12,1 9,-5 Q7,-11 10,-16" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite" />
                  </path>
                </g>
              )}
            </g>

            {/* Desktop CPU Tower (PC Case) on Right Side */}
            <g transform="translate(425, 120)">
              {/* Main Case Chassis */}
              <rect x="0" y="0" width="62" height="115" rx="6" fill="#0B0F19" stroke="#334155" strokeWidth="1.5" />
              {/* Tempered Glass Window */}
              <rect x="4" y="8" width="54" height="96" rx="4" fill="#030712" opacity="0.9" />

              {/* Internal RGB Liquid Cooling Tubes */}
              <path d="M15,25 Q35,45 28,60" stroke="#FF7A59" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M22,25 Q42,45 35,60" stroke="#2EC4B6" strokeWidth="2" fill="none" opacity="0.8" />

              {/* Glowing RAM Modules */}
              <rect x="36" y="22" width="2" height="14" fill="#5B6CFF" className="animate-pulse" />
              <rect x="40" y="22" width="2" height="14" fill="#2EC4B6" className="animate-pulse" />
              <rect x="44" y="22" width="2" height="14" fill="#FF7A59" className="animate-pulse" />

              {/* GPU Backplate with RGB logo */}
              <rect x="10" y="58" width="42" height="10" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="0.5" />
              <line x1="14" y1="63" x2="48" y2="63" stroke="#2EC4B6" strokeWidth="1.5" />

              {/* Two Rotating RGB Intake Fans */}
              {/* Top Fan */}
              <g transform="translate(31, 35)">
                <circle cx="0" cy="0" r="14" stroke="#2EC4B6" strokeWidth="1.5" fill="#0F172A" />
                <g transform={`rotate(${cpuFanDegree})`}>
                  <path d="M-10,0 L10,0 M0,-10 L0,10 M-7,-7 L7,7 M-7,7 L7,-7" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                </g>
                <circle cx="0" cy="0" r="4" fill="#1E293B" stroke="#2EC4B6" strokeWidth="1" />
              </g>

              {/* Bottom Fan */}
              <g transform="translate(31, 85)">
                <circle cx="0" cy="0" r="14" stroke="#FF7A59" strokeWidth="1.5" fill="#0F172A" />
                <g transform={`rotate(${cpuFanDegree})`}>
                  <path d="M-10,0 L10,0 M0,-10 L0,10 M-7,-7 L7,7 M-7,7 L7,-7" stroke="#FF7A59" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                </g>
                <circle cx="0" cy="0" r="4" fill="#1E293B" stroke="#FF7A59" strokeWidth="1" />
              </g>

              {/* Case Power Button & I/O */}
              <circle cx="10" cy="4" r="1.5" fill="#2EC4B6" />
              <rect x="16" y="3" width="5" height="2" rx="0.5" fill="#475569" />
            </g>

            {/* ========================================================
                LAYER 4: COMPUTER DESKTOP MONITOR & REALTIME SCREEN DISPLAY
               ======================================================== */}
            {/* Monitor Heavy Aluminum Stand / Arm */}
            <g transform="translate(260, 185)">
              <polygon points="-24,12 24,12 18,3 -18,3" fill="#334155" />
              <rect x="-6" y="-30" width="12" height="34" rx="2" fill="url(#chromePistonGrad)" />
            </g>

            {/* Ultrawide Monitor Outer Bezel / Chassis (Curved aesthetic) */}
            <g transform="translate(260, 115)">
              {/* Outer monitor frame */}
              <rect
                x="-175"
                y="-75"
                width="350"
                height="140"
                rx="14"
                fill="url(#monitorFrameGrad)"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Monitor Screen Glass Area */}
              <rect
                x="-168"
                y="-68"
                width="336"
                height="122"
                rx="8"
                fill="url(#monitorScreenGrad)"
                stroke="#1E293B"
                strokeWidth="1"
              />

              {/* Screen Top Chrome / Window Titlebar */}
              <rect x="-168" y="-68" width="336" height="15" rx="8" fill="#0A0E1A" />
              {/* Window dots */}
              <circle cx="-158" cy="-60" r="3" fill="#FF7A59" />
              <circle cx="-148" cy="-60" r="3" fill="#FFA116" />
              <circle cx="-138" cy="-60" r="3" fill="#2EC4B6" />
              {/* Titlebar text */}
              <text x="-122" y="-57" fill="#64748B" fontSize="7" fontFamily="monospace" fontWeight="bold">
                CampusPulse OS v2.4 • Active Monitor
              </text>
              <text x="120" y="-57" fill="#2EC4B6" fontSize="7" fontFamily="monospace" fontWeight="bold">
                ● LIVE
              </text>

              {/* ---------------- SCREEN THEME CONTENT ---------------- */}
              {screenTheme === 'analytics' && (
                <g>
                  {/* Left Column: Live Analytics Radar & Bar Charts */}
                  <rect x="-160" y="-45" width="150" height="92" rx="4" fill="#0D1322" stroke="#1E293B" strokeWidth="0.8" />
                  <text x="-152" y="-35" fill="#94A3B8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                    STUDENT READINESS INDEX
                  </text>
                  <text x="-152" y="-22" fill="#2EC4B6" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                    94.8%
                  </text>
                  <text x="-105" y="-23" fill="#10B981" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                    ▲ +4.2% MoM
                  </text>

                  {/* Dynamic Bar Charts (4 Columns) */}
                  <g transform="translate(-152, -10)">
                    {/* Bar 1 */}
                    <rect x="0" y="8" width="12" height="36" rx="2" fill="#1E293B" />
                    <rect x="0" y="16" width="12" height="28" rx="2" fill="#2EC4B6">
                      {isPlaying && (
                        <animate attributeName="height" values="28;34;22;28" dur="3s" repeatCount="indefinite" />
                      )}
                    </rect>
                    {/* Bar 2 */}
                    <rect x="18" y="8" width="12" height="36" rx="2" fill="#1E293B" />
                    <rect x="18" y="12" width="12" height="32" rx="2" fill="#5B6CFF">
                      {isPlaying && (
                        <animate attributeName="height" values="32;24;35;32" dur="2.7s" repeatCount="indefinite" />
                      )}
                    </rect>
                    {/* Bar 3 */}
                    <rect x="36" y="8" width="12" height="36" rx="2" fill="#1E293B" />
                    <rect x="36" y="20" width="12" height="24" rx="2" fill="#FF7A59">
                      {isPlaying && (
                        <animate attributeName="height" values="24;32;20;24" dur="3.3s" repeatCount="indefinite" />
                      )}
                    </rect>
                    {/* Bar 4 */}
                    <rect x="54" y="8" width="12" height="36" rx="2" fill="#1E293B" />
                    <rect x="54" y="10" width="12" height="34" rx="2" fill="#10B981">
                      {isPlaying && (
                        <animate attributeName="height" values="34;26;36;34" dur="2.9s" repeatCount="indefinite" />
                      )}
                    </rect>
                  </g>

                  {/* Circular Radar / Gauge Dial */}
                  <g transform="translate(-40, 5)">
                    <circle cx="0" cy="0" r="18" stroke="#1E293B" strokeWidth="4" fill="none" />
                    <circle cx="0" cy="0" r="18" stroke="#2EC4B6" strokeWidth="4" fill="none" strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round" />
                    <text x="0" y="3" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontWeight="bold">
                      A+
                    </text>
                  </g>

                  {/* Right Column: Undulating Continuous Pulse Wave (ECG/Telemetry) */}
                  <rect x="0" y="-45" width="160" height="92" rx="4" fill="#0D1322" stroke="#1E293B" strokeWidth="0.8" />
                  <text x="8" y="-35" fill="#94A3B8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                    CONTINUOUS STUDENT PULSE STREAM
                  </text>
                  <text x="8" y="-23" fill="#5B6CFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    RLS: ACTIVE • SECTIONS: 3
                  </text>

                  {/* Grid Lines on Chart */}
                  <line x1="8" y1="-10" x2="152" y2="-10" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="8" y1="12" x2="152" y2="12" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="8" y1="34" x2="152" y2="34" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />

                  {/* Oscillating Sine Waveform */}
                  {isPlaying ? (
                    <path
                      d="M8,12 Q25,-4 45,12 T85,12 T125,12 L152,12"
                      stroke="#2EC4B6"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="d"
                        values="
                          M8,12 Q25,-4 45,12 T85,12 T125,12 L152,12;
                          M8,12 Q25,28 45,12 T85,-4 T125,24 L152,12;
                          M8,12 Q25,4 45,12 T85,28 T125,-2 L152,12;
                          M8,12 Q25,-4 45,12 T85,12 T125,12 L152,12
                        "
                        dur="3.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                  ) : (
                    <path
                      d="M8,12 Q25,-4 45,12 T85,12 T125,12 L152,12"
                      stroke="#2EC4B6"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Telemetry Metric Badges */}
                  <g transform="translate(8, 28)">
                    <rect x="0" y="0" width="42" height="12" rx="3" fill="#1E293B" />
                    <text x="21" y="9" textAnchor="middle" fill="#2EC4B6" fontSize="6" fontWeight="bold">
                      CGPA: 8.42
                    </text>

                    <rect x="48" y="0" width="42" height="12" rx="3" fill="#1E293B" />
                    <text x="69" y="9" textAnchor="middle" fill="#FF7A59" fontSize="6" fontWeight="bold">
                      RISK: 0.0%
                    </text>

                    <rect x="96" y="0" width="46" height="12" rx="3" fill="#1E293B" />
                    <text x="119" y="9" textAnchor="middle" fill="#5B6CFF" fontSize="6" fontWeight="bold">
                      ATTEND: 96%
                    </text>
                  </g>
                </g>
              )}

              {screenTheme === 'terminal' && (
                <g>
                  {/* Fullscreen Code IDE Editor */}
                  <rect x="-160" y="-45" width="320" height="92" rx="4" fill="#0A0F1D" stroke="#1E293B" strokeWidth="0.8" />
                  {/* File Tabs */}
                  <rect x="-160" y="-45" width="85" height="14" fill="#1E293B" />
                  <text x="-152" y="-36" fill="#2EC4B6" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                    student_model.py
                  </text>
                  <rect x="-70" y="-45" width="75" height="14" fill="#0F172A" />
                  <text x="-64" y="-36" fill="#64748B" fontSize="6.5" fontFamily="monospace">
                    attendance_rls.sql
                  </text>

                  {/* Code Lines with Syntax Colors */}
                  <g transform="translate(-150, -22)" fontFamily="monospace" fontSize="7">
                    <text x="0" y="0" fill={activeCodeLine === 0 ? '#FFFFFF' : '#64748B'}>
                      <tspan fill="#FF7A59">import</tspan> torch, campuspulse_core
                    </text>
                    <text x="0" y="11" fill={activeCodeLine === 1 ? '#FFFFFF' : '#94A3B8'}>
                      <tspan fill="#5B6CFF">def</tspan> <tspan fill="#2EC4B6">evaluate_student_risk</tspan>(student_id):
                    </text>
                    <text x="10" y="22" fill={activeCodeLine === 2 ? '#FFFFFF' : '#94A3B8'}>
                      model = campuspulse.load(<tspan fill="#FFA116">"v4-rls"</tspan>)
                    </text>
                    <text x="10" y="33" fill={activeCodeLine === 3 ? '#FFFFFF' : '#94A3B8'}>
                      score = model.predict(weights=[0.85, 0.94])
                    </text>
                    <text x="10" y="44" fill={activeCodeLine === 4 ? '#FFFFFF' : '#94A3B8'}>
                      <tspan fill="#FF7A59">return</tspan> score.explainable_factors()
                    </text>
                    <text x="0" y="55" fill="#10B981" fontWeight="bold">
                      &gt; [SUCCESS] 120 Students Scored: 0 At-Risk Alert
                      <tspan fill="#2EC4B6" className="animate-pulse"> _</tspan>
                    </text>
                  </g>
                </g>
              )}

              {screenTheme === 'cyber' && (
                <g>
                  {/* Cyber Matrix Mode */}
                  <rect x="-160" y="-45" width="320" height="92" rx="4" fill="#050811" stroke="#FF7A59" strokeWidth="0.8" />
                  <text x="-150" y="-32" fill="#FF7A59" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    [NEURAL MATRIX: CAMPUS DEPLOYMENT]
                  </text>

                  {/* Matrix stream cascades */}
                  <g fontFamily="monospace" fontSize="6.5" fill="#2EC4B6" opacity="0.8">
                    <text x="-140" y="-18">01010101 241fa18067@campus.edu.in [OK]</text>
                    <text x="-140" y="-8">11001010 RLS_TOKEN_VERIFIED =&gt; SECTION_B</text>
                    <text x="-140" y="2">10101100 PLACEMENTS: 88.5% HIGH PRIORITY</text>
                    <text x="-140" y="12">00110101 RECRUITERS: GOOGLE, MICROSOFT, TCS</text>
                    <text x="-140" y="22">11100010 MODEL LATENCY: 12ms // 60 FPS SYNC</text>
                    <text x="-140" y="34" fill="#FF7A59" fontWeight="bold">
                      &gt;&gt; SYSTEM REPUTATION: 100/100 EXPLAINABLE
                      <tspan fill="#FFA116" className="animate-pulse"> █</tspan>
                    </text>
                  </g>

                  {/* Hexagon Graphic */}
                  <polygon
                    points="110,-10 130,-22 150,-10 150,14 130,26 110,14"
                    stroke="#FF7A59"
                    strokeWidth="1.5"
                    fill="#FF7A59"
                    fillOpacity="0.1"
                  />
                  <text x="130" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
                    AI 100
                  </text>
                </g>
              )}

              {/* Bottom Monitor Chin Brand Logo */}
              <text x="0" y="62" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="bold" letterSpacing="1">
                CAMPUS PULSE ULTRA
              </text>
            </g>

            {/* Keyboard & Mouse (On Desk Mat, facing away towards monitor) */}
            {/* RGB Mechanical Keyboard */}
            <g transform="translate(195, 206)">
              <rect x="0" y="0" width="105" height="24" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              {/* Keyboard RGB Ambient Underglow Bar */}
              <rect x="3" y="21" width="99" height="2" rx="1" fill="url(#keyboardRgbGrad)" />
              {/* Keyboard Keys in Rows */}
              <g fill="#1E293B" stroke="#0B0F19" strokeWidth="0.5">
                {/* Row 1 */}
                <rect x="4" y="3" width="7" height="4" rx="1" />
                <rect x="13" y="3" width="7" height="4" rx="1" />
                <rect x="22" y="3" width="7" height="4" rx="1" />
                <rect x="31" y="3" width="7" height="4" rx="1" />
                <rect x="40" y="3" width="7" height="4" rx="1" />
                <rect x="49" y="3" width="7" height="4" rx="1" />
                <rect x="58" y="3" width="7" height="4" rx="1" />
                <rect x="67" y="3" width="7" height="4" rx="1" />
                <rect x="76" y="3" width="7" height="4" rx="1" />
                <rect x="85" y="3" width="16" height="4" rx="1" fill="#2EC4B6" />
                {/* Row 2 */}
                <rect x="4" y="9" width="9" height="4" rx="1" />
                <rect x="15" y="9" width="7" height="4" rx="1" />
                <rect x="24" y="9" width="7" height="4" rx="1" />
                <rect x="33" y="9" width="7" height="4" rx="1" />
                <rect x="42" y="9" width="7" height="4" rx="1" />
                <rect x="51" y="9" width="7" height="4" rx="1" />
                <rect x="60" y="9" width="7" height="4" rx="1" />
                <rect x="69" y="9" width="7" height="4" rx="1" />
                <rect x="78" y="9" width="7" height="4" rx="1" />
                <rect x="87" y="9" width="14" height="4" rx="1" />
                {/* Spacebar Row */}
                <rect x="4" y="15" width="12" height="4" rx="1" />
                <rect x="18" y="15" width="10" height="4" rx="1" />
                <rect x="30" y="15" width="46" height="4" rx="1" fill="#334155" />
                <rect x="78" y="15" width="11" height="4" rx="1" />
                <rect x="91" y="15" width="10" height="4" rx="1" />
              </g>
            </g>

            {/* Ergonomic Wireless Mouse */}
            <g transform="translate(320, 210)">
              <rect x="0" y="0" width="14" height="20" rx="7" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
              <line x1="7" y1="2" x2="7" y2="8" stroke="#0F172A" strokeWidth="0.8" />
              {/* Glowing Scroll Wheel */}
              <rect x="6" y="4" width="2" height="4" rx="1" fill="#2EC4B6" />
            </g>

            {/* ========================================================
                LAYER 5: ERGONOMIC TASK CHAIR (FACING OPPOSITE TO US)
                (Viewed from behind, facing forward into the desk & monitor)
               ======================================================== */}
            {/* Soft Ambient Contact Shadow on Floor beneath chair wheels */}
            <ellipse
              cx="260"
              cy="406"
              rx="90"
              ry="16"
              fill="#000000"
              opacity="0.65"
              filter="url(#glowBlur)"
            />

            {/* Chair Main Assembly with Continuous Breathing & Swivel Motion */}
            <g
              transform={`translate(260, 280) rotate(${
                isPlaying ? mouseOffset.x * 0.8 : 0
              }) translate(-260, -280)`}
              className="transition-transform duration-300 ease-out"
            >
              {/* Animated Continuous Hover/Breathing on the Chair */}
              <g>
                {isPlaying && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 0,-4; 0,0"
                    dur="3.8s"
                    repeatCount="indefinite"
                  />
                )}

                {/* --- 5-STAR CASTER BASE & WHEELS (ON THE FLOOR) --- */}
                {/* 5 Radial Spider Legs in Perspective */}
                <g transform="translate(260, 388)">
                  {/* Leg 1: Front-Left */}
                  <polygon points="-8,-4 -58,12 -54,16 -4,-1" fill="url(#chairSpineGrad)" />
                  {/* Leg 2: Front-Right */}
                  <polygon points="8,-4 58,12 54,16 4,-1" fill="url(#chairSpineGrad)" />
                  {/* Leg 3: Back-Left */}
                  <polygon points="-6,-6 -44,-8 -42,-4 -2,-3" fill="#334155" />
                  {/* Leg 4: Back-Right */}
                  <polygon points="6,-6 44,-8 42,-4 2,-3" fill="#334155" />
                  {/* Leg 5: Direct Center Rear towards us */}
                  <polygon points="-4,-2 0,22 4,-2" fill="url(#chairSpineGrad)" />

                  {/* 5 Caster Wheels with Hubs */}
                  {/* Wheel 1 */}
                  <g transform="translate(-56, 14)">
                    <rect x="-4" y="-3" width="8" height="6" rx="2" fill="#0F172A" />
                    <circle cx="0" cy="0" r="1.5" fill="#94A3B8" />
                  </g>
                  {/* Wheel 2 */}
                  <g transform="translate(56, 14)">
                    <rect x="-4" y="-3" width="8" height="6" rx="2" fill="#0F172A" />
                    <circle cx="0" cy="0" r="1.5" fill="#94A3B8" />
                  </g>
                  {/* Wheel 3 */}
                  <g transform="translate(-43, -6)">
                    <rect x="-3" y="-3" width="6" height="5" rx="1.5" fill="#0F172A" />
                  </g>
                  {/* Wheel 4 */}
                  <g transform="translate(43, -6)">
                    <rect x="-3" y="-3" width="6" height="5" rx="1.5" fill="#0F172A" />
                  </g>
                  {/* Wheel 5 (Center rear) */}
                  <g transform="translate(0, 22)">
                    <rect x="-4" y="-2" width="8" height="6" rx="2" fill="#0F172A" />
                    <circle cx="0" cy="1" r="1.5" fill="#94A3B8" />
                  </g>

                  {/* Central Swivel Wheel Hub Cone */}
                  <ellipse cx="0" cy="-4" rx="10" ry="5" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
                </g>

                {/* --- HYDRAULIC GAS-LIFT PISTON CYLINDER --- */}
                <rect
                  x="254"
                  y="342"
                  width="12"
                  height="44"
                  rx="3"
                  fill="url(#chromePistonGrad)"
                  stroke="#1E293B"
                  strokeWidth="0.8"
                />
                {/* Telescoping Piston Ring Collar */}
                <rect x="252" y="354" width="16" height="4" rx="1" fill="#0F172A" />

                {/* --- UNDER-SEAT TILT MECHANISM HOUSING --- */}
                <polygon
                  points="232,338 288,338 280,348 240,348"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="1"
                />
                {/* Tilt Tension Knob */}
                <ellipse cx="260" cy="346" rx="8" ry="3" fill="#475569" />

                {/* --- CHAIR SEAT PAN (LOWER CUSHION EDGE SEEN FROM BEHIND) --- */}
                <path
                  d="M195,332 C195,340 325,340 325,332 L315,315 C315,322 205,322 205,315 Z"
                  fill="#111827"
                  stroke="#334155"
                  strokeWidth="1"
                />

                {/* --- LEFT & RIGHT ARMRESTS (ANGLED FORWARD TOWARD DESK) --- */}
                {/* Left Armrest Support & Pad */}
                <g transform="translate(186, 262)">
                  {/* Metallic upright support rod */}
                  <path d="M12,58 L12,24 L18,18" stroke="url(#chairSpineGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Contoured Left Arm Pad */}
                  <rect x="6" y="10" width="18" height="26" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                  {/* Specular armrest highlight */}
                  <line x1="10" y1="13" x2="18" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Right Armrest Support & Pad */}
                <g transform="translate(316, 262)">
                  {/* Metallic upright support rod */}
                  <path d="M10,58 L10,24 L4,18" stroke="url(#chairSpineGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Contoured Right Arm Pad */}
                  <rect x="-2" y="10" width="18" height="26" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                  {/* Specular armrest highlight */}
                  <line x1="4" y1="13" x2="12" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* --- CHAIR BACKREST (VIEWED DIRECTLY FROM BEHIND) --- */}
                {/* Outer Ergonomic Backrest Frame & Breathable Mesh */}
                <g>
                  {/* Mesh Upholstery Shell */}
                  <path
                    d="M205,235 C198,280 206,318 220,324 C236,328 284,328 300,324 C314,318 322,280 315,235 C310,205 298,198 260,198 C222,198 210,205 205,235 Z"
                    fill="url(#chairMeshGrad)"
                    stroke="#334155"
                    strokeWidth="2"
                  />

                  {/* High-tech Breathable Mesh Pattern (Horizontal & Vertical Sub-ribs) */}
                  <g stroke="#1F2937" strokeWidth="0.8" opacity="0.75">
                    <line x1="216" y1="220" x2="304" y2="220" />
                    <line x1="212" y1="235" x2="308" y2="235" />
                    <line x1="210" y1="250" x2="310" y2="250" />
                    <line x1="210" y1="265" x2="310" y2="265" />
                    <line x1="212" y1="280" x2="308" y2="280" />
                    <line x1="216" y1="295" x2="304" y2="295" />
                    <line x1="222" y1="310" x2="298" y2="310" />
                  </g>

                  {/* EXTERNAL ERGONOMIC SPINE / SKELETON (HERMAN MILLER / EMBODY STYLE) */}
                  {/* Central Spine Column */}
                  <path
                    d="M255,188 L265,188 L267,330 L253,330 Z"
                    fill="url(#chairSpineGrad)"
                    stroke="#1E293B"
                    strokeWidth="1"
                  />
                  {/* Spine Specular Highlight Centerline */}
                  <line x1="260" y1="190" x2="260" y2="328" stroke="#F1F5F9" strokeWidth="1.2" opacity="0.6" />

                  {/* Articulating Lumbar Support Vertebrae Ribs */}
                  {/* Rib 1 (Upper thoracic) */}
                  <path d="M228,228 Q260,234 292,228" stroke="url(#chairSpineGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  {/* Rib 2 (Mid-back) */}
                  <path d="M222,252 Q260,260 298,252" stroke="url(#chairSpineGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Rib 3 (Lumbar Lower - Primary Support Strap) */}
                  <rect x="220" y="278" width="80" height="14" rx="7" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx="260" cy="285" rx="10" ry="4" fill="#5B6CFF" opacity="0.8" />
                  <line x1="230" y1="285" x2="290" y2="285" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" />
                  {/* Rib 4 (Sacral lower bridge) */}
                  <path d="M226,308 Q260,314 294,308" stroke="url(#chairSpineGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>

                {/* --- ERGONOMIC HEADREST AT TOP (VIEWED FROM REAR) --- */}
                <g transform="translate(260, 172)">
                  {/* Chrome Mounting Bracket connecting to spine */}
                  <path d="M-8,16 L-4,0 L4,0 L8,16 Z" fill="url(#chairSpineGrad)" stroke="#1E293B" strokeWidth="0.8" />

                  {/* Contoured Headrest Pillow (Facing forward away from us) */}
                  <rect
                    x="-44"
                    y="-16"
                    width="88"
                    height="28"
                    rx="12"
                    fill="url(#chairMeshGrad)"
                    stroke="#475569"
                    strokeWidth="1.8"
                  />
                  {/* Rear headrest accent shell */}
                  <ellipse cx="0" cy="-2" rx="28" ry="6" fill="#1E293B" />
                  {/* Specular curved reflection on top */}
                  <path d="M-30,-12 Q0,-16 30,-12" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Interactive Screen Mode Switcher Chips */}
        <div className="w-full mt-3.5 pt-2.5 border-t border-[var(--clay-border)] flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setScreenTheme('analytics')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] font-heading font-extrabold transition-all ${
                screenTheme === 'analytics'
                  ? 'bg-[#2EC4B6] text-white shadow-[var(--shadow-clay-badge)]'
                  : 'bg-[var(--clay-pressed)] text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <Activity className="h-3 w-3" />
              <span>Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setScreenTheme('terminal')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] font-heading font-extrabold transition-all ${
                screenTheme === 'terminal'
                  ? 'bg-[#5B6CFF] text-white shadow-[var(--shadow-clay-badge)]'
                  : 'bg-[var(--clay-pressed)] text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <Terminal className="h-3 w-3" />
              <span>IDE Code</span>
            </button>

            <button
              type="button"
              onClick={() => setScreenTheme('cyber')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] font-heading font-extrabold transition-all ${
                screenTheme === 'cyber'
                  ? 'bg-[#FF7A59] text-white shadow-[var(--shadow-clay-badge)]'
                  : 'bg-[var(--clay-pressed)] text-[var(--clay-muted)] hover:text-[var(--clay-text)]'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Cyber Net</span>
            </button>
          </div>

          {/* Pause / Resume Animation Loop Button */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[var(--clay-pressed)] hover:bg-[var(--clay-card)] text-[var(--clay-muted)] hover:text-[var(--clay-text)] text-[10px] font-heading font-extrabold transition-colors border border-[var(--clay-border)]"
            title={isPlaying ? 'Pause Continuous Animation' : 'Resume Animation'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 text-[#FF7A59]" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-[#2EC4B6]" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkstationHeroAnimation;
