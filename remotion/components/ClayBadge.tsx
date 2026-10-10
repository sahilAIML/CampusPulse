import React from "react";
import { VIDEO_CONFIG } from "../config";

interface ClayBadgeProps {
  label: string;
  variant?: "default" | "coral" | "teal" | "sun" | "dark";
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  label,
  variant = "default",
  size = "md",
  style,
}) => {
  let bg: string = "#FFFFFF";
  let color: string = VIDEO_CONFIG.colors.slate;
  let border: string = "1px solid rgba(255, 255, 255, 0.9)";

  if (variant === "coral") {
    bg = VIDEO_CONFIG.colors.coral;
    color = "#FFFFFF";
    border = "1px solid rgba(255, 255, 255, 0.4)";
  } else if (variant === "teal") {
    bg = VIDEO_CONFIG.colors.teal;
    color = "#FFFFFF";
    border = "1px solid rgba(255, 255, 255, 0.4)";
  } else if (variant === "sun") {
    bg = VIDEO_CONFIG.colors.sun;
    color = "#422800";
    border = "1px solid rgba(255, 255, 255, 0.6)";
  } else if (variant === "dark") {
    bg = VIDEO_CONFIG.colors.navy;
    color = "#FFFFFF";
    border = "1px solid rgba(255, 255, 255, 0.2)";
  }

  let padding = "8px 20px";
  let fontSize = 16;

  if (size === "sm") {
    padding = "5px 14px";
    fontSize = 13;
  } else if (size === "lg") {
    padding = "12px 28px";
    fontSize = 20;
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 9999,
        background: bg,
        color,
        fontFamily: VIDEO_CONFIG.fonts.heading,
        fontWeight: 800,
        fontSize,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding,
        boxShadow: VIDEO_CONFIG.colors.clayPillShadow,
        border,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {label}
    </div>
  );
};
