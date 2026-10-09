'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldAlert, Award, Sparkles } from 'lucide-react';

export function ClayScene() {
  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center select-none overflow-hidden">
      {/* Background ambient clay glow blurs */}
      <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[#FF7A59]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#2EC4B6]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#5B6CFF]/15 blur-3xl pointer-events-none" />

      {/* Floating Clay Blob 1 (Warm Sun Coral) */}
      <motion.div
        animate={{
          y: [-12, 14, -12],
          rotate: [-3, 5, -3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-8 left-6 sm:left-12 z-0 hidden xs:block"
      >
        <svg width="120" height="120" viewBox="0 0 200 200" className="drop-shadow-xl filter">
          <defs>
            <radialGradient id="clayCoralGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFA68D" />
              <stop offset="45%" stopColor="#FF7A59" />
              <stop offset="100%" stopColor="#D95332" />
            </radialGradient>
          </defs>
          <path
            fill="url(#clayCoralGrad)"
            d="M44.7,-64.5C57.4,-56.3,67.1,-43.7,72.6,-29.4C78.1,-15.1,79.5,0.8,75.4,15.7C71.3,30.6,61.8,44.4,49.2,54.7C36.7,65,21.1,71.8,4.9,73.5C-11.3,75.3,-28.1,72,-42.6,63.2C-57.1,54.4,-69.3,40.1,-74.6,23.7C-79.9,7.4,-78.3,-11,-70.7,-26.4C-63.2,-41.7,-49.7,-53.9,-35.3,-61.4C-20.9,-68.9,-5.6,-71.7,4.8,-70.1C15.2,-68.5,32,-72.7,44.7,-64.5Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Floating Clay Blob 2 (Soft Mint Teal) */}
      <motion.div
        animate={{
          y: [16, -14, 16],
          rotate: [4, -4, 4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-6 right-6 sm:right-14 z-0 hidden xs:block"
      >
        <svg width="130" height="130" viewBox="0 0 200 200" className="drop-shadow-xl filter">
          <defs>
            <radialGradient id="clayTealGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6EE7DC" />
              <stop offset="50%" stopColor="#2EC4B6" />
              <stop offset="100%" stopColor="#1E8B81" />
            </radialGradient>
          </defs>
          <path
            fill="url(#clayTealGrad)"
            d="M48.2,-63.9C62.1,-55.8,72.8,-41.4,77.9,-25.1C83,-8.9,82.4,9.2,75.6,24.8C68.9,40.4,55.9,53.4,40.8,62.8C25.7,72.2,8.4,78,-9.6,78.2C-27.6,78.4,-46.3,73.1,-58.9,61.5C-71.5,49.9,-78,32.1,-79.3,14.5C-80.6,-3.1,-76.7,-20.5,-67.7,-34.7C-58.6,-48.9,-44.4,-59.8,-29.4,-67.3C-14.4,-74.8,1.4,-78.9,16.5,-76.3C31.5,-73.7,34.3,-72,48.2,-63.9Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Central Hero Composition: Tactile 3D Graduation Cap & Analytical Waveform */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Soft 3D Tactile Platform Card */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-[44px] bg-[var(--clay-card)] border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)] flex flex-col items-center justify-center p-6 transition-all duration-300">
          {/* Specular clay sheen top reflection */}
          <div className="absolute top-3 left-6 right-6 h-8 rounded-full bg-white/40 blur-[2px] pointer-events-none" />

          {/* 3D Graduation Cap SVG with Clay Shading */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative mb-3 sm:mb-5"
          >
            <svg
              width="150"
              height="110"
              viewBox="0 0 200 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              <defs>
                <linearGradient id="capTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A5568" />
                  <stop offset="50%" stopColor="#2D3748" />
                  <stop offset="100%" stopColor="#1A202C" />
                </linearGradient>
                <linearGradient id="capRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#718096" />
                  <stop offset="100%" stopColor="#2D3748" />
                </linearGradient>
                <linearGradient id="tasselGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="60%" stopColor="#FFC857" />
                  <stop offset="100%" stopColor="#FFA000" />
                </linearGradient>
              </defs>

              {/* Lower skull cap */}
              <ellipse cx="100" cy="85" rx="52" ry="24" fill="url(#capRimGrad)" />
              <path
                d="M48 85C48 102 72 116 100 116C128 116 152 102 152 85L152 92C152 109 128 123 100 123C72 123 48 109 48 92Z"
                fill="#1A202C"
              />

              {/* Upper diamond mortarboard with puffy clay volume */}
              <polygon
                points="100,22 185,55 100,88 15,55"
                fill="url(#capTopGrad)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              {/* Beveled edge depth */}
              <polygon
                points="15,55 100,88 100,94 15,61"
                fill="#1A202C"
              />
              <polygon
                points="185,55 100,88 100,94 185,61"
                fill="#171923"
              />

              {/* Gold button on mortarboard */}
              <circle cx="100" cy="55" r="7" fill="url(#tasselGold)" stroke="#FFE082" strokeWidth="1.5" />

              {/* Hanging tassel cord */}
              <path
                d="M100 55 Q 140 65 150 95"
                stroke="url(#tasselGold)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tassel fringe puff */}
              <ellipse cx="150" cy="98" rx="6" ry="10" fill="url(#tasselGold)" />
            </svg>
          </motion.div>

          {/* 3D Predictive Analytics Mini Bars inside Platform */}
          <div className="flex items-end gap-2.5 sm:gap-3.5 h-16 sm:h-20 w-44 sm:w-56 justify-center px-4 py-2 rounded-2xl bg-[var(--clay-pressed)]/50 shadow-inner">
            <motion.div
              initial={{ height: 10 }}
              animate={{ height: ['35%', '65%', '50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 sm:w-6 rounded-t-xl bg-[#2EC4B6] shadow-[var(--shadow-clay-teal)]"
              title="Attendance (20%)"
            />
            <motion.div
              initial={{ height: 10 }}
              animate={{ height: ['60%', '90%', '75%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="w-5 sm:w-6 rounded-t-xl bg-[#5B6CFF] shadow-md"
              title="Academic Marks (30%)"
            />
            <motion.div
              initial={{ height: 10 }}
              animate={{ height: ['40%', '82%', '70%'] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="w-5 sm:w-6 rounded-t-xl bg-[#FF7A59] shadow-[var(--shadow-clay-coral)]"
              title="Placement Readiness (15%)"
            />
            <motion.div
              initial={{ height: 10 }}
              animate={{ height: ['50%', '78%', '65%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="w-5 sm:w-6 rounded-t-xl bg-[#FFC857] shadow-md"
              title="LMS & Engagement (20%)"
            />
          </div>
        </div>

        {/* Floating Interactive Badge 1: Early Warning Intervened */}
        <motion.div
          animate={{
            x: [-8, 6, -8],
            y: [-4, 6, -4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -right-6 sm:-right-10 z-20"
        >
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-card-hover)] select-none">
            <div className="h-7 w-7 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--clay-muted)] block leading-none">
                Risk Prob. Detected
              </span>
              <span className="text-xs font-extrabold font-heading text-rose-600 dark:text-rose-400 tabular-nums">
                0.99 ➔ 0.38 Early Catch
              </span>
            </div>
          </div>
        </motion.div>

        {/* Floating Interactive Badge 2: MD SAHIL Demo Marker */}
        <motion.div
          animate={{
            x: [6, -8, 6],
            y: [6, -4, 6],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="absolute -bottom-4 -left-6 sm:-left-12 z-20"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-card-hover)] select-none">
            <div className="h-7 w-7 rounded-xl bg-[#2EC4B6]/20 text-[#1E8B81] dark:text-[#5CE6DA] flex items-center justify-center font-bold text-xs">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--clay-muted)] block leading-none">
                Top Performer Telemetry
              </span>
              <span className="text-xs font-extrabold font-heading text-[var(--clay-text)] tabular-nums">
                241FA18067 • CGPA 8.5
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
