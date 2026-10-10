import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { AssetVideo } from "../components/AssetVideo";
import { ClayBadge } from "../components/ClayBadge";
import { PhoneFrame } from "../components/PhoneFrame";
import { CaptionsBar } from "../components/CaptionsBar";
import { WhipTransition } from "../components/WhipTransition";

export const Scene7Mobile: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = VIDEO_CONFIG.scenes.scene7_mobile;

  const phoneEntrance = spring({
    frame: frame - 4,
    fps,
    config: VIDEO_CONFIG.transitions.bouncySpring,
  });

  const calloutSpring = spring({
    frame: frame - 2,
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
          padding: isVertical ? "60px 40px 180px" : "40px 100px",
          gap: isVertical ? 30 : 80,
          boxSizing: "border-box",
        }}
      >
        {/* Callout Information */}
        <div
          style={{
            width: isVertical ? "100%" : 480,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            zIndex: 10,
            transform: `translateY(${(1 - calloutSpring) * 30}px)`,
            opacity: calloutSpring,
            textAlign: isVertical ? "center" : "left",
            alignItems: isVertical ? "center" : "flex-start",
          }}
        >
          <ClayBadge label={config.portalBadge} variant="teal" size="sm" />

          <h2
            style={{
              fontFamily: VIDEO_CONFIG.fonts.heading,
              fontWeight: 800,
              fontSize: isVertical ? 46 : 54,
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
              fontSize: isVertical ? 22 : 20,
              color: VIDEO_CONFIG.colors.muted,
              lineHeight: 1.45,
            }}
          >
            {config.subtext}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4, justifyContent: isVertical ? "center" : "flex-start" }}>
            {config.chips.map((chip) => (
              <ClayBadge key={chip} label={chip} variant="default" size="sm" />
            ))}
          </div>
        </div>

        {/* Phone Mockup inside Clay Chassis */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            transform: `scale(${0.85 + phoneEntrance * 0.15})`,
            opacity: phoneEntrance,
          }}
        >
          <PhoneFrame
            width={isVertical ? 360 : 380}
            height={isVertical ? 760 : 800}
            clickTarget={config.clickTarget}
            clickFrameOffset={config.clickFrameOffset}
            clickActionLabel={config.clickActionLabel}
          >
            <AssetVideo assetPath={config.videoAsset} screenType="mobile" />
          </PhoneFrame>
        </div>

        {/* Burned-in High-Contrast Captions */}
        <CaptionsBar caption={config.caption} isVertical={isVertical} delayFrames={8} />
      </div>
    </WhipTransition>
  );
};
