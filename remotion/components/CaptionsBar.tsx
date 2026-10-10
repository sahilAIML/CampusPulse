import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";

interface CaptionsBarProps {
  caption: string;
  isVertical?: boolean;
  delayFrames?: number;
}

export const CaptionsBar: React.FC<CaptionsBarProps> = ({
  caption,
  isVertical = false,
  delayFrames = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: VIDEO_CONFIG.transitions.springConfig,
  });

  const translateY = (1 - entrance) * 30;
  const opacity = Math.min(1, Math.max(0, entrance * 1.5));

  // Safe bottom margin:
  // On 9:16 vertical (Shorts / Reels / TikTok), UI icons take up the bottom 180-240px.
  // On 16:9 landscape, 44px is optimal.
  const bottomMargin = isVertical ? 220 : 44;
  const maxWidth = isVertical ? 920 : 1280;
  const fontSize = isVertical ? 34 : 26;

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomMargin,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        zIndex: 100,
        width: "auto",
        maxWidth,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #0F172A 0%, #1E293B 100%)",
          color: "#FFFFFF",
          padding: isVertical ? "16px 36px" : "12px 30px",
          borderRadius: 9999,
          boxShadow: "0 16px 32px rgba(0,0,0,0.35), inset 1px 1px 2px rgba(255,255,255,0.25)",
          border: "1.5px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Coral Accent Indicator Dot */}
        <div
          style={{
            width: isVertical ? 14 : 10,
            height: isVertical ? 14 : 10,
            borderRadius: 9999,
            background: VIDEO_CONFIG.colors.coral,
            flexShrink: 0,
            boxShadow: `0 0 10px ${VIDEO_CONFIG.colors.coral}`,
          }}
        />

        <span
          style={{
            fontFamily: VIDEO_CONFIG.fonts.heading,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            color: "#FFFFFF",
          }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
};
