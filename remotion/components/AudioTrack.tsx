import React, { useState } from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";

export const AudioTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [hasError, setHasError] = useState(false);

  // Volume envelope: smooth fade in and fade out
  const volume = interpolate(
    frame,
    [0, 15, durationInFrames - 45, durationInFrames],
    [0, 0.85, 0.85, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  if (hasError) return null;

  return (
    <Audio
      src={staticFile(VIDEO_CONFIG.assets.audio)}
      volume={volume}
      onError={() => {
        // Fallback to audio.wav if audio.mp3 is unavailable
        setHasError(true);
      }}
    />
  );
};
