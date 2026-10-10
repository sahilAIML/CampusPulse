import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface WhipTransitionProps {
  children: React.ReactNode;
  durationInFrames: number;
  whipDuration?: number; // 6 frames
  direction?: "left" | "right" | "up";
}

export const WhipTransition: React.FC<WhipTransitionProps> = ({
  children,
  durationInFrames,
  whipDuration = 6,
  direction = "left",
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // Entrance whip (first `whipDuration` frames)
  let entranceTranslate = 0;
  let entranceScale = 1;
  let entranceOpacity = 1;

  if (frame < whipDuration) {
    const progress = interpolate(frame, [0, whipDuration], [0, 1], {
      extrapolateRight: "clamp",
    });
    // Eased cubic entrance
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const offset = direction === "left" ? 140 : -140;
    entranceTranslate = (1 - easeOut) * offset;
    entranceScale = 0.96 + easeOut * 0.04;
    entranceOpacity = progress;
  }

  // Exit whip (last `whipDuration` frames)
  let exitTranslate = 0;
  let exitScale = 1;
  let exitOpacity = 1;

  if (frame > durationInFrames - whipDuration) {
    const progress = interpolate(
      frame,
      [durationInFrames - whipDuration, durationInFrames],
      [0, 1],
      { extrapolateLeft: "clamp" }
    );
    // Fast cubic acceleration exit
    const easeIn = Math.pow(progress, 3);
    const offset = direction === "left" ? -140 : 140;
    exitTranslate = easeIn * offset;
    exitScale = 1 - easeIn * 0.04;
    exitOpacity = 1 - progress;
  }

  const translateX = entranceTranslate + exitTranslate;
  const scale = entranceScale * exitScale;
  const opacity = Math.min(entranceOpacity, exitOpacity);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `translateX(${translateX}px) scale(${scale})`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
