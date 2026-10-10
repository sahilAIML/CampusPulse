import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";

interface ClickTargetHighlightProps {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  frameOffset?: number; // frame at which click happens
  label?: string;
}

export const ClickTargetHighlight: React.FC<ClickTargetHighlightProps> = ({
  x,
  y,
  frameOffset = 30,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickFrame = frame - frameOffset;
  if (clickFrame < 0 || clickFrame > 90) return null;

  // Pulse spring
  const pulse = spring({
    frame: clickFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 180,
    },
  });

  const rippleScale = interpolate(clickFrame, [0, 45], [0.4, 2.2], {
    extrapolateRight: "clamp",
  });

  const rippleOpacity = interpolate(clickFrame, [0, 15, 45], [0.9, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* Outer Ripple */}
      <div
        style={{
          position: "absolute",
          width: 70,
          height: 70,
          borderRadius: 9999,
          border: `3px solid ${VIDEO_CONFIG.colors.coral}`,
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
          opacity: rippleOpacity,
          boxShadow: `0 0 15px ${VIDEO_CONFIG.colors.coral}`,
        }}
      />

      {/* Inner Dot */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 9999,
          background: VIDEO_CONFIG.colors.coral,
          border: "3px solid #FFFFFF",
          boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
          transform: `scale(${pulse})`,
        }}
      />

      {/* Optional action tag */}
      {label && clickFrame > 5 && clickFrame < 60 && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: `translateX(-50%) scale(${pulse})`,
            background: VIDEO_CONFIG.colors.navy,
            color: "#FFFFFF",
            fontFamily: VIDEO_CONFIG.fonts.heading,
            fontWeight: 800,
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 9999,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
