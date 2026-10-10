import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ClickTarget, VIDEO_CONFIG } from "../config";
import { ClickTargetHighlight } from "./ClickTargetHighlight";

interface PhoneFrameProps {
  children: React.ReactNode;
  width?: number; // Screen width in px
  height?: number; // Screen height in px
  clickTarget?: ClickTarget;
  clickFrameOffset?: number;
  clickActionLabel?: string;
  style?: React.CSSProperties;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  width = 380,
  height = 800,
  clickTarget,
  clickFrameOffset = 25,
  clickActionLabel,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow 1.08x - 1.1x zoom
  const targetX = clickTarget?.x ?? 0.5;
  const targetY = clickTarget?.y ?? 0.5;
  const maxZoom = clickTarget?.zoom ?? 1.1;

  const zoomProgress = interpolate(frame, [10, 60], [1.0, maxZoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bezelThickness = 14;

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        background: "linear-gradient(145deg, #F8FAFC 0%, #E2E8F0 100%)",
        borderRadius: 50,
        padding: bezelThickness,
        boxShadow:
          "20px 20px 40px rgba(160, 175, 195, 0.45), -16px -16px 32px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(166, 180, 200, 0.25)",
        border: "1.5px solid rgba(255, 255, 255, 0.9)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Dynamic Island / Speaker Pill */}
      <div
        style={{
          position: "absolute",
          top: bezelThickness + 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 22,
          background: "#0F172A",
          borderRadius: 9999,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {/* Camera dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: "#1E293B",
            marginLeft: "auto",
            marginRight: 10,
          }}
        />
      </div>

      {/* Screen Viewport with Zoom */}
      <div
        style={{
          width,
          height,
          borderRadius: 38,
          overflow: "hidden",
          position: "relative",
          background: "#0F172A",
          boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.35)",
        }}
      >
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
  );
};
