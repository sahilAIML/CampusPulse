import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ClickTarget, VIDEO_CONFIG } from "../config";
import { ClickTargetHighlight } from "./ClickTargetHighlight";

interface LaptopFrameProps {
  children: React.ReactNode;
  width?: number; // Screen width in px
  height?: number; // Screen height in px
  clickTarget?: ClickTarget;
  clickFrameOffset?: number;
  clickActionLabel?: string;
  style?: React.CSSProperties;
}

export const LaptopFrame: React.FC<LaptopFrameProps> = ({
  children,
  width = 1120,
  height = 630,
  clickTarget,
  clickFrameOffset = 30,
  clickActionLabel,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow 1.1x zoom on click targets
  const targetX = clickTarget?.x ?? 0.5;
  const targetY = clickTarget?.y ?? 0.5;
  const maxZoom = clickTarget?.zoom ?? 1.12;

  // Smooth ease in of the zoom over 60 frames (2 seconds)
  const zoomProgress = interpolate(frame, [15, 75], [1.0, maxZoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bezelThickness = 14;
  const topBezelHeight = 22;
  const bottomBezelHeight = 22;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 35px 60px rgba(148, 163, 184, 0.45))",
        ...style,
      }}
    >
      {/* Laptop Screen Lid */}
      <div
        style={{
          width: width + bezelThickness * 2,
          background: "linear-gradient(145deg, #F1F5F9 0%, #E2E8F0 100%)",
          borderRadius: 24,
          padding: `${topBezelHeight}px ${bezelThickness}px ${bottomBezelHeight}px`,
          boxShadow:
            "12px 12px 24px rgba(166, 180, 200, 0.4), -10px -10px 20px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(166, 180, 200, 0.25)",
          border: "1.5px solid rgba(255, 255, 255, 0.9)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Webcam Lens */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 7,
            height: 7,
            borderRadius: 9999,
            background: "#1E293B",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
          }}
        />

        {/* Inner Screen Viewport with Zoom */}
        <div
          style={{
            width,
            height,
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            background: "#0F172A",
            boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* Zoomable Content Container */}
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: `${targetX * 100}% ${targetY * 100}%`,
              transform: `scale(${zoomProgress})`,
              transition: "transform 0.05s linear",
              position: "relative",
            }}
          >
            {children}

            {/* Click Highlight Ripple if click target is specified */}
            {clickTarget && (
              <ClickTargetHighlight
                x={targetX}
                y={targetY}
                frameOffset={clickFrameOffset}
                label={clickActionLabel}
              />
            )}
          </div>
        </div>
      </div>

      {/* Laptop Base Deck & Hinge */}
      <div
        style={{
          width: width * 1.14,
          height: 18,
          background: "linear-gradient(180deg, #CBD5E1 0%, #94A3B8 100%)",
          borderRadius: "0 0 18px 18px",
          boxShadow:
            "0 14px 28px rgba(100, 116, 139, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.8)",
          position: "relative",
          marginTop: -2,
        }}
      >
        {/* Trackpad Notch indent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 140,
            height: 6,
            background: "#94A3B8",
            borderRadius: "0 0 6px 6px",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
};
