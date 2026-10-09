'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Play, Pause, Flame } from 'lucide-react';

// Grid size: 8x8 (Standard Block Puzzle)
const GRID_SIZE = 8;

interface Cell {
  color: string | null;
  clearing?: boolean;
}

interface Piece {
  id: string;
  shape: number[][]; // 2D array: 1 = block, 0 = empty
  color: string;
  name: string;
}

// Curated colorful pieces matching CampusPulse's design tokens
const PIECES: Piece[] = [
  {
    id: 'p-cube-2',
    name: '2x2 Box',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#2EC4B6', // Teal
  },
  {
    id: 'p-bar-3',
    name: '3x1 Bar',
    shape: [[1, 1, 1]],
    color: '#FF7A59', // Coral
  },
  {
    id: 'p-bar-2v',
    name: '2x1 Vertical',
    shape: [[1], [1]],
    color: '#5B6CFF', // Indigo
  },
  {
    id: 'p-corner-3',
    name: 'L-Corner',
    shape: [
      [1, 0],
      [1, 1],
    ],
    color: '#FFA116', // Sun Amber
  },
  {
    id: 'p-t-shape',
    name: 'T-Shape',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#A855F7', // Purple
  },
  {
    id: 'p-cube-1',
    name: '1x1 Dot',
    shape: [[1]],
    color: '#10B981', // Emerald
  },
];

// Curated scripted simulation moves for an expert 60fps gameplay experience
interface MoveStep {
  pieceIndex: number;
  targetRow: number;
  targetCol: number;
  expectedClears: { rows?: number[]; cols?: number[] };
}

export function BlockPuzzleSimulation() {
  const [board, setBoard] = useState<Cell[][]>(() => createInitialBoard());
  const [tray, setTray] = useState<Piece[]>([PIECES[1], PIECES[0], PIECES[2]]);
  const [score, setScore] = useState(1280);
  const [streak, setStreak] = useState(2);
  const [floatingScore, setFloatingScore] = useState<{ text: string; id: number } | null>(null);
  const [activeFlyingPiece, setActiveFlyingPiece] = useState<{
    piece: Piece;
    targetRow: number;
    targetCol: number;
  } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Simulation script step pointer
  const stepRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function createInitialBoard(): Cell[][] {
    const b: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ color: null }))
    );

    // Initial pre-filled pattern with nice colors close to clearing
    b[1][1] = { color: '#5B6CFF' };
    b[1][2] = { color: '#5B6CFF' };
    b[2][5] = { color: '#FFA116' };
    b[2][6] = { color: '#FFA116' };

    // Row 3 almost full (missing cols 2, 3, 4)
    b[3][0] = { color: '#2EC4B6' };
    b[3][1] = { color: '#2EC4B6' };
    b[3][5] = { color: '#2EC4B6' };
    b[3][6] = { color: '#2EC4B6' };
    b[3][7] = { color: '#2EC4B6' };

    // Row 6 / Col 4 setup
    b[5][4] = { color: '#FF7A59' };
    b[6][4] = { color: '#FF7A59' };
    b[7][4] = { color: '#FF7A59' };

    b[6][0] = { color: '#A855F7' };
    b[6][1] = { color: '#A855F7' };
    b[7][0] = { color: '#A855F7' };
    b[7][1] = { color: '#A855F7' };

    return b;
  }

  // Pre-planned moves sequence that loops seamlessly
  const scriptMoves: MoveStep[] = [
    // Move 1: Place 3x1 bar at Row 3, Col 2 -> Completes Row 3!
    {
      pieceIndex: 0,
      targetRow: 3,
      targetCol: 2,
      expectedClears: { rows: [3] },
    },
    // Move 2: Place 2x2 cube at Row 4, Col 0
    {
      pieceIndex: 1,
      targetRow: 4,
      targetCol: 0,
      expectedClears: {},
    },
    // Move 3: Place 2x1 vertical at Row 3, Col 4 -> Completes Column 4!
    {
      pieceIndex: 2,
      targetRow: 3,
      targetCol: 4,
      expectedClears: { cols: [4] },
    },
    // Move 4: Place T-shape at Row 1, Col 4
    {
      pieceIndex: 0,
      targetRow: 1,
      targetCol: 4,
      expectedClears: {},
    },
    // Move 5: Place Corner at Row 5, Col 6
    {
      pieceIndex: 1,
      targetRow: 5,
      targetCol: 6,
      expectedClears: { rows: [6] },
    },
  ];

  // Automated gameplay loop
  useEffect(() => {
    if (isPaused) return;

    const runSimulationStep = () => {
      const stepIdx = stepRef.current % scriptMoves.length;
      const currentMove = scriptMoves[stepIdx];

      // Refresh tray if starting a new set
      if (stepIdx === 0) {
        setTray([PIECES[1], PIECES[0], PIECES[2]]);
      } else if (stepIdx === 3) {
        setTray([PIECES[4], PIECES[3], PIECES[5]]);
      }

      setTray((prevTray) => {
        const pieceToPlay = prevTray[currentMove.pieceIndex] || PIECES[0];

        // 1. Trigger smooth gliding animation from tray to target position
        setActiveFlyingPiece({
          piece: pieceToPlay,
          targetRow: currentMove.targetRow,
          targetCol: currentMove.targetCol,
        });

        // 2. Lock piece into grid after flight duration (600ms)
        setTimeout(() => {
          setBoard((prevBoard) => {
            const nextBoard = prevBoard.map((row) => row.map((cell) => ({ ...cell })));
            const { shape, color } = pieceToPlay;

            for (let r = 0; r < shape.length; r++) {
              for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                  const bR = currentMove.targetRow + r;
                  const bC = currentMove.targetCol + c;
                  if (bR < GRID_SIZE && bC < GRID_SIZE) {
                    nextBoard[bR][bC] = { color };
                  }
                }
              }
            }

            // 3. Check and trigger line clearing animation
            const rowsToClear: number[] = [];
            const colsToClear: number[] = [];

            // Detect full rows
            for (let r = 0; r < GRID_SIZE; r++) {
              if (nextBoard[r].every((c) => c.color !== null)) {
                rowsToClear.push(r);
              }
            }

            // Detect full columns
            for (let c = 0; c < GRID_SIZE; c++) {
              let full = true;
              for (let r = 0; r < GRID_SIZE; r++) {
                if (nextBoard[r][c].color === null) {
                  full = false;
                  break;
                }
              }
              if (full) colsToClear.push(c);
            }

            // Apply clearing shimmer effect if any full lines
            if (rowsToClear.length > 0 || colsToClear.length > 0) {
              rowsToClear.forEach((r) => {
                for (let c = 0; c < GRID_SIZE; c++) nextBoard[r][c].clearing = true;
              });
              colsToClear.forEach((c) => {
                for (let r = 0; r < GRID_SIZE; r++) nextBoard[r][c].clearing = true;
              });

              const pointsGained = (rowsToClear.length + colsToClear.length) * 160 + 40;
              setScore((s) => s + pointsGained);
              setStreak((st) => st + 1);
              setFloatingScore({
                text: `+${pointsGained} CLEAR!`,
                id: Date.now(),
              });

              // Remove cleared cells after shimmer (350ms)
              setTimeout(() => {
                setBoard((b) =>
                  b.map((row, r) =>
                    row.map((cell, c) => {
                      if (rowsToClear.includes(r) || colsToClear.includes(c)) {
                        return { color: null, clearing: false };
                      }
                      return cell;
                    })
                  )
                );
              }, 350);
            } else {
              setScore((s) => s + 20);
            }

            return nextBoard;
          });

          // Clear active flying piece
          setActiveFlyingPiece(null);

          // Remove played piece from tray
          setTray((t) => t.filter((_, idx) => idx !== currentMove.pieceIndex));
        }, 550);

        return prevTray;
      });

      stepRef.current += 1;

      // Loop restart after all moves completed
      if (stepRef.current >= scriptMoves.length) {
        setTimeout(() => {
          setBoard(createInitialBoard());
          setTray([PIECES[1], PIECES[0], PIECES[2]]);
          stepRef.current = 0;
        }, 1200);
      }
    };

    // Run next move every 1.8 seconds for super smooth, relaxed pacing
    timerRef.current = setInterval(runSimulationStep, 1900);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleReset = () => {
    setBoard(createInitialBoard());
    setTray([PIECES[1], PIECES[0], PIECES[2]]);
    setScore(1280);
    setStreak(1);
    stepRef.current = 0;
    setActiveFlyingPiece(null);
  };

  return (
    <div className="relative w-full max-w-[420px] select-none flex flex-col items-center">
      {/* Background ambient multi-color glow blurs */}
      <div className="absolute -top-8 -left-8 w-56 h-56 rounded-full bg-[#FF7A59]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-[#2EC4B6]/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#5B6CFF]/20 blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Arcade Console Card */}
      <div className="relative w-full rounded-[38px] bg-[var(--clay-card)]/90 backdrop-blur-xl border-2 border-[var(--clay-border)] shadow-[var(--shadow-clay-card)] p-5 sm:p-6 flex flex-col items-center transition-all">
        {/* Specular clay sheen top reflection */}
        <div className="absolute top-2.5 left-6 right-6 h-6 rounded-full bg-white/40 blur-[2px] pointer-events-none" />

        {/* Header Bar: Status & Score Telemetry */}
        <div className="w-full flex items-center justify-between gap-2 mb-4 pb-3.5 border-b border-[var(--clay-border)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF7A59] to-[#E05F3F] text-white flex items-center justify-center font-bold shadow-[var(--shadow-clay-coral)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider block">
                Simulation Live
              </span>
              <span className="font-heading font-extrabold text-xs text-[var(--clay-text)] flex items-center gap-1">
                <span>Block Puzzle</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>

          {/* Live Score Chip */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-2xl bg-[var(--clay-pressed)] border border-[var(--clay-border)] text-right">
              <span className="text-[9px] font-heading font-extrabold text-[var(--clay-muted)] uppercase block leading-none">
                Score
              </span>
              <span className="font-heading font-black text-sm sm:text-base text-[#5B6CFF] tabular-nums">
                {score.toLocaleString()}
              </span>
            </div>

            {/* Streak Flame Badge */}
            <div className="px-2.5 py-1.5 rounded-2xl bg-[#FF7A59]/15 border border-[#FF7A59]/30 text-[#FF7A59] flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-[#FF7A59]" />
              <span className="font-heading font-black text-xs tabular-nums">x{streak}</span>
            </div>
          </div>
        </div>

        {/* 8x8 Grid Puzzle Board */}
        <div className="relative p-2.5 sm:p-3 rounded-3xl bg-[var(--clay-pressed)]/80 border-2 border-[var(--clay-border)] shadow-inner">
          {/* Floating Score Pop-Up Animation */}
          <AnimatePresence>
            {floatingScore && (
              <motion.div
                key={floatingScore.id}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -24, scale: 1.15 }}
                exit={{ opacity: 0, y: -40, scale: 0.9 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#FF7A59] to-[#2EC4B6] text-white font-heading font-black text-xs sm:text-sm shadow-xl"
              >
                {floatingScore.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="grid grid-cols-8 gap-1 sm:gap-1.5"
            style={{ width: '256px', height: '256px' }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isClearing = cell.clearing;
                const hasBlock = cell.color !== null;

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    animate={
                      isClearing
                        ? {
                            scale: [1, 1.25, 0],
                            opacity: [1, 1, 0],
                            rotate: [0, 8, -8],
                          }
                        : hasBlock
                        ? { scale: [0.85, 1], opacity: 1 }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{ duration: isClearing ? 0.35 : 0.2 }}
                    className={`relative rounded-md sm:rounded-lg transition-colors ${
                      hasBlock
                        ? 'shadow-sm'
                        : 'bg-[var(--clay-card)]/50 border border-[var(--clay-border)]/40 hover:bg-[var(--clay-card)]/80'
                    }`}
                    style={{
                      backgroundColor: cell.color || undefined,
                      boxShadow: hasBlock
                        ? `inset 1.5px 1.5px 3px rgba(255,255,255,0.6), inset -1.5px -1.5px 3px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)`
                        : undefined,
                    }}
                  >
                    {hasBlock && (
                      <div className="absolute top-0.5 left-0.5 right-0.5 h-1 rounded-t-sm bg-white/40 pointer-events-none" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Piece Tray (Next Available Blocks) */}
        <div className="w-full mt-4 pt-3 border-t border-[var(--clay-border)]">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-heading font-extrabold text-[var(--clay-muted)] uppercase tracking-wider">
              Piece Staging Tray
            </span>
            <span className="text-[10px] font-bold text-[#2EC4B6]">
              Smooth Auto-Placement
            </span>
          </div>

          <div className="flex items-center justify-around gap-2 h-16 px-2 py-1.5 rounded-2xl bg-[var(--clay-pressed)]/50 border border-[var(--clay-border)]">
            {tray.length === 0 ? (
              <span className="text-[11px] font-bold text-[var(--clay-muted)] animate-pulse">
                Staging next wave...
              </span>
            ) : (
              tray.map((piece, pIdx) => (
                <motion.div
                  key={`${piece.id}-${pIdx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center justify-center p-1 rounded-xl bg-[var(--clay-card)] border border-[var(--clay-border)] shadow-[var(--shadow-clay-badge)]"
                >
                  <div className="flex flex-col gap-0.5">
                    {piece.shape.map((sRow, sR) => (
                      <div key={sR} className="flex gap-0.5">
                        {sRow.map((val, sC) => (
                          <div
                            key={sC}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${
                              val === 1 ? 'shadow-sm' : 'opacity-0'
                            }`}
                            style={{
                              backgroundColor: val === 1 ? piece.color : 'transparent',
                              boxShadow:
                                val === 1
                                  ? 'inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(0,0,0,0.2)'
                                  : 'none',
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="w-full mt-3 flex items-center justify-between text-xs text-[var(--clay-muted)] px-1">
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="flex items-center gap-1.5 font-heading font-extrabold hover:text-[#FF7A59] transition-colors"
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            <span>{isPaused ? 'Resume Play' : 'Pause Simulation'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 font-heading font-extrabold hover:text-[#5B6CFF] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Board</span>
          </button>
        </div>
      </div>
    </div>
  );
}
