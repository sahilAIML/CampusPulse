import React from "react";
import { VIDEO_CONFIG } from "../config";

interface ClayCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  tint?: "default" | "coral" | "teal" | "sun" | "dark";
  elevation?: "low" | "medium" | "high";
  radius?: number;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  style,
  className = "",
  tint = "default",
  elevation = "medium",
  radius = 32,
}) => {
  let background = "#FFFFFF";
  let border = "1px solid rgba(255, 255, 255, 0.85)";

  if (tint === "coral") {
    background = "linear-gradient(135deg, #FFF9F7 0%, #FFEFEA 100%)";
    border = "1px solid rgba(255, 122, 89, 0.25)";
  } else if (tint === "teal") {
    background = "linear-gradient(135deg, #F3FCFB 0%, #E6FAF8 100%)";
    border = "1px solid rgba(46, 196, 182, 0.25)";
  } else if (tint === "sun") {
    background = "linear-gradient(135deg, #FFFDF5 0%, #FFF9E6 100%)";
    border = "1px solid rgba(255, 200, 87, 0.3)";
  } else if (tint === "dark") {
    background = "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)";
    border = "1px solid rgba(255, 255, 255, 0.1)";
  }

  // Soft double shadow based on elevation
  let shadow = VIDEO_CONFIG.colors.clayCardShadow + ", " + VIDEO_CONFIG.colors.clayCardInset;
  if (elevation === "low") {
    shadow = "8px 8px 16px rgba(166, 180, 200, 0.35), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.6)";
  } else if (elevation === "high") {
    shadow = "22px 22px 44px rgba(160, 175, 195, 0.5), -18px -18px 36px rgba(255, 255, 255, 1), inset 3px 3px 6px rgba(255, 255, 255, 0.9), inset -3px -3px 6px rgba(175, 190, 210, 0.25)";
  }

  if (tint === "dark") {
    shadow = "16px 16px 32px rgba(0, 0, 0, 0.4), -8px -8px 20px rgba(255, 255, 255, 0.05), inset 1px 1px 2px rgba(255, 255, 255, 0.15)";
  }

  return (
    <div
      className={className}
      style={{
        background,
        borderRadius: radius,
        boxShadow: shadow,
        border,
        boxSizing: "border-box",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
