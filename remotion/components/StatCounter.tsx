import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { ClayCard } from "./ClayCard";

interface StatCounterProps {
  value: string; // e.g. "120", "7", "0–100"
  suffix?: string; // e.g. "+"
  label: string;
  description: string;
  accent: string;
  delayFrames: number;
  width?: number | string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  suffix = "",
  label,
  description,
  accent,
  delayFrames,
  width = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bouncy spring entrance
  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: VIDEO_CONFIG.transitions.bouncySpring,
  });

  const scale = interpolate(entrance, [0, 1], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(entrance, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(entrance, [0, 0.4, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate animated number if it is a single integer
  let displayValue = value;
  const numericVal = parseInt(value, 10);
  if (!isNaN(numericVal) && !value.includes("–") && !value.includes("-")) {
    const countProgress = interpolate(frame - delayFrames, [0, 24], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    displayValue = Math.round(countProgress * numericVal).toString();
  }

  return (
    <div
      style={{
        width,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        transformOrigin: "center bottom",
      }}
    >
      <ClayCard
        elevation="high"
        radius={36}
        style={{
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent top stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 36,
            right: 36,
            height: 6,
            background: accent,
            borderRadius: "0 0 6px 6px",
          }}
        />

        {/* Counter Number */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: VIDEO_CONFIG.fonts.heading,
              fontWeight: 800,
              fontSize: 84,
              lineHeight: 1,
              color: accent,
              letterSpacing: "-0.04em",
            }}
          >
            {displayValue}
          </span>
          {suffix && (
            <span
              style={{
                fontFamily: VIDEO_CONFIG.fonts.heading,
                fontWeight: 800,
                fontSize: 52,
                color: accent,
                lineHeight: 1,
              }}
            >
              {suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily: VIDEO_CONFIG.fonts.heading,
            fontWeight: 800,
            fontSize: 26,
            color: VIDEO_CONFIG.colors.navy,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>

        {/* Subtitle / Description */}
        <div
          style={{
            fontFamily: VIDEO_CONFIG.fonts.body,
            fontWeight: 700,
            fontSize: 16,
            color: VIDEO_CONFIG.colors.muted,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </ClayCard>
    </div>
  );
};
