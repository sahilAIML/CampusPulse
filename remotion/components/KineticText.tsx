import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";

interface KineticTextProps {
  text: string;
  delayFrames?: number;
  staggerFrames?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  style?: React.CSSProperties;
  color?: string;
  fontSize?: number;
  highlightWords?: Record<string, string>; // word -> color
  fontFamily?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  delayFrames = 0,
  staggerFrames = 4,
  as = "h1",
  style,
  color = VIDEO_CONFIG.colors.navy,
  fontSize = 64,
  highlightWords = {},
  fontFamily = VIDEO_CONFIG.fonts.heading,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  const Tag = as;

  return (
    <Tag
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${fontSize * 0.28}px`,
        margin: 0,
        padding: 0,
        fontFamily,
        fontSize,
        fontWeight: fontFamily === VIDEO_CONFIG.fonts.heading ? 800 : 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delayFrames + i * staggerFrames;
        const spr = spring({
          frame: frame - wordDelay,
          fps,
          config: VIDEO_CONFIG.transitions.springConfig,
        });

        const translateY = (1 - spr) * (fontSize * 0.6);
        const opacity = Math.min(1, Math.max(0, spr * 1.5));
        const scale = 0.85 + spr * 0.15;

        // Check if word has custom highlight color
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
        const wordColor = highlightWords[cleanWord] || color;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: wordColor,
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              transformOrigin: "bottom center",
            }}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
};
