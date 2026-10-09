'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Zap } from 'lucide-react';
import { GuidedStoryModal } from './GuidedStoryModal';

export function GuidedStoryFloatingButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 hidden sm:block">
        <button
          onClick={() => setModalOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#FF7A59] via-[#FFC857] to-[#2EC4B6] text-zinc-950 font-heading font-extrabold text-xs shadow-[var(--shadow-clay-card-hover)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/60"
        >
          <div className="h-6 w-6 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-inner">
            <Play className="h-3 w-3 fill-current ml-0.5" />
          </div>
          <span className="tracking-tight">
            ⚡ Guided Story: At-Risk Recovery
          </span>
          {/* Specular glare reflection */}
          <div className="absolute top-1 left-4 right-4 h-1.5 rounded-full bg-white/40 blur-[1px]" />
        </button>
      </div>

      <GuidedStoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
