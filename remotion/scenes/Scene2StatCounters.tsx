import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { ClayBadge } from "../components/ClayBadge";
import { StatCounter } from "../components/StatCounter";
import { CaptionsBar } from "../components/CaptionsBar";
import { WhipTransition } from "../components/WhipTransition";

export const Scene2StatCounters: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = VIDEO_CONFIG.scenes.scene2_stats;

  // Header entrance spring
  const headerSpring = spring({
    frame: frame - 2,
    fps,
    config: VIDEO_CONFIG.transitions.springConfig,
  });

  return (
    <WhipTransition durationInFrames={config.durationInFrames} whipDuration={VIDEO_CONFIG.transitions.whipDurationFrames}>
      <div
        className="clay-base"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isVertical ? "flex-start" : "center",
          padding: isVertical ? "100px 40px 180px" : "60px 80px",
          gap: isVertical ? 32 : 50,
          boxSizing: "border-box",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
            opacity: headerSpring,
            transform: `translateY(${(1 - headerSpring) * 30}px)`,
          }}
        >
          <ClayBadge label={config.sectionBadge} variant="dark" size="sm" />
          <h2
            style={{
              fontFamily: VIDEO_CONFIG.fonts.heading,
              fontWeight: 800,
              fontSize: isVertical ? 48 : 56,
              color: VIDEO_CONFIG.colors.navy,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {config.heading}
          </h2>
        </div>

        {/* The 3 Big Stat Counters */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isVertical ? 22 : 36,
            width: "100%",
            maxWidth: isVertical ? 580 : 1380,
          }}
        >
          {config.stats.map((stat, i) => (
            <StatCounter
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              accent={stat.accent}
              delayFrames={stat.delayFrames}
              width={isVertical ? "100%" : 420}
            />
          ))}
        </div>

        {/* Burned-in High-Contrast Captions */}
        <CaptionsBar caption={config.caption} isVertical={isVertical} delayFrames={8} />
      </div>
    </WhipTransition>
  );
};
