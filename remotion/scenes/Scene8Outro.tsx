import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { AssetVideo } from "../components/AssetVideo";
import { ClayBadge } from "../components/ClayBadge";
import { ClayCard } from "../components/ClayCard";
import { KineticText } from "../components/KineticText";
import { CaptionsBar } from "../components/CaptionsBar";

export const Scene8Outro: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = VIDEO_CONFIG.scenes.scene8_outro;

  // Final pop spring
  const popSpring = spring({
    frame: frame - 4,
    fps,
    config: VIDEO_CONFIG.transitions.bouncySpring,
  });

  return (
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
        padding: isVertical ? "60px 40px 180px" : "60px 100px",
        gap: isVertical ? 36 : 70,
        boxSizing: "border-box",
      }}
    >
      {/* Outro Video Preview Card */}
      <div
        style={{
          width: isVertical ? "100%" : 560,
          maxWidth: isVertical ? 500 : 560,
          transform: `scale(${0.9 + popSpring * 0.1})`,
          opacity: popSpring,
          zIndex: 5,
        }}
      >
        <ClayCard elevation="high" radius={32} style={{ padding: 14 }}>
          <div
            style={{
              width: "100%",
              height: isVertical ? 280 : 380,
              borderRadius: 22,
              overflow: "hidden",
              background: "#0F172A",
            }}
          >
            <AssetVideo assetPath={config.videoAsset} screenType="outro" />
          </div>
        </ClayCard>
      </div>

      {/* Main Brag Reel Card */}
      <div
        style={{
          width: isVertical ? "100%" : 720,
          transform: `scale(${popSpring})`,
          opacity: popSpring,
          zIndex: 10,
        }}
      >
        <ClayCard
          elevation="high"
          radius={38}
          style={{
            padding: isVertical ? "36px 30px" : "48px 44px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            textAlign: isVertical ? "center" : "left",
            alignItems: isVertical ? "center" : "flex-start",
          }}
        >
          {/* Badge */}
          <ClayBadge label={config.badge} variant="coral" size={isVertical ? "md" : "lg"} />

          {/* Product Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h1
              style={{
                fontFamily: VIDEO_CONFIG.fonts.heading,
                fontWeight: 800,
                fontSize: isVertical ? 64 : 76,
                color: VIDEO_CONFIG.colors.navy,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: "-0.04em",
              }}
            >
              {config.productName}
            </h1>
            <div
              style={{
                fontFamily: VIDEO_CONFIG.fonts.heading,
                fontWeight: 800,
                fontSize: isVertical ? 26 : 30,
                color: VIDEO_CONFIG.colors.coral,
                letterSpacing: "-0.02em",
              }}
            >
              {config.tagline}
            </div>
          </div>

          {/* KPMG Challenge Attribution */}
          <div
            style={{
              fontFamily: VIDEO_CONFIG.fonts.body,
              fontWeight: 700,
              fontSize: isVertical ? 18 : 20,
              color: VIDEO_CONFIG.colors.slate,
              lineHeight: 1.4,
              borderLeft: isVertical ? "none" : `4px solid ${VIDEO_CONFIG.colors.teal}`,
              paddingLeft: isVertical ? 0 : 16,
            }}
          >
            {config.challengeTag}
          </div>

          {/* Creator & Live URL Row */}
          <div
            style={{
              display: "flex",
              flexDirection: isVertical ? "column" : "row",
              alignItems: "center",
              gap: 16,
              width: "100%",
              marginTop: 10,
            }}
          >
            {/* Live URL Pill Button */}
            <div
              style={{
                background: VIDEO_CONFIG.colors.navy,
                color: "#FFFFFF",
                padding: "16px 32px",
                borderRadius: 9999,
                fontFamily: VIDEO_CONFIG.fonts.heading,
                fontWeight: 800,
                fontSize: isVertical ? 20 : 22,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>{VIDEO_CONFIG.meta.displayUrl}</span>
              <span style={{ color: VIDEO_CONFIG.colors.coral }}>➔</span>
            </div>

            {/* Author Credit */}
            <div
              style={{
                fontFamily: VIDEO_CONFIG.fonts.heading,
                fontWeight: 800,
                fontSize: 18,
                color: VIDEO_CONFIG.colors.muted,
              }}
            >
              Engineered by <span style={{ color: VIDEO_CONFIG.colors.navy }}>{config.creatorName}</span>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Burned-in High-Contrast Captions */}
      <CaptionsBar caption={config.caption} isVertical={isVertical} delayFrames={6} />
    </div>
  );
};
