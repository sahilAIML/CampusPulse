import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { AssetVideo } from "../components/AssetVideo";
import { ClayBadge } from "../components/ClayBadge";
import { ClayCard } from "../components/ClayCard";
import { LaptopFrame } from "../components/LaptopFrame";
import { CaptionsBar } from "../components/CaptionsBar";
import { WhipTransition } from "../components/WhipTransition";

export const Scene3Faculty: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = VIDEO_CONFIG.scenes.scene3_faculty;

  // Callout card entrance spring
  const calloutSpring = spring({
    frame: frame - 4,
    fps,
    config: VIDEO_CONFIG.transitions.springConfig,
  });

  return (
    <WhipTransition durationInFrames={config.durationInFrames} whipDuration={VIDEO_CONFIG.transitions.whipDurationFrames}>
      <div
        className="clay-base"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          padding: isVertical ? "60px 40px 180px" : "40px 80px",
          gap: isVertical ? 30 : 60,
          boxSizing: "border-box",
        }}
      >
        {/* Left / Top Side: Callout Information Card */}
        <div
          style={{
            width: isVertical ? "100%" : 440,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            zIndex: 10,
            transform: `translateY(${(1 - calloutSpring) * 30}px)`,
            opacity: calloutSpring,
          }}
        >
          <ClayBadge label={config.portalBadge} variant="coral" size="sm" />

          <h2
            style={{
              fontFamily: VIDEO_CONFIG.fonts.heading,
              fontWeight: 800,
              fontSize: isVertical ? 44 : 50,
              color: VIDEO_CONFIG.colors.navy,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {config.callout}
          </h2>

          <div
            style={{
              fontFamily: VIDEO_CONFIG.fonts.body,
              fontWeight: 700,
              fontSize: isVertical ? 20 : 19,
              color: VIDEO_CONFIG.colors.muted,
              lineHeight: 1.45,
            }}
          >
            {config.subtext}
          </div>

          {/* Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {config.chips.map((chip) => (
              <ClayBadge key={chip} label={chip} variant="default" size="sm" />
            ))}
          </div>
        </div>

        {/* Laptop Device Frame with 1.1x Zoom & Click Target */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            transform: isVertical ? "scale(0.82)" : "scale(1)",
            transformOrigin: "center center",
          }}
        >
          <LaptopFrame
            width={isVertical ? 960 : 1080}
            height={isVertical ? 540 : 608}
            clickTarget={config.clickTarget}
            clickFrameOffset={config.clickFrameOffset}
            clickActionLabel={config.clickActionLabel}
          >
            <AssetVideo assetPath={config.videoAsset} screenType="faculty" />
          </LaptopFrame>
        </div>

        {/* Burned-in High-Contrast Captions */}
        <CaptionsBar caption={config.caption} isVertical={isVertical} delayFrames={8} />
      </div>
    </WhipTransition>
  );
};
