import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { AssetVideo } from "../components/AssetVideo";
import { ClayBadge } from "../components/ClayBadge";
import { ClayCard } from "../components/ClayCard";
import { KineticText } from "../components/KineticText";
import { CaptionsBar } from "../components/CaptionsBar";
import { WhipTransition } from "../components/WhipTransition";

export const Scene1Intro: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = VIDEO_CONFIG.scenes.scene1_intro;

  // Background subtle clay parallax floating shapes
  const floatY = Math.sin((frame / fps) * 1.5) * 15;
  const floatX = Math.cos((frame / fps) * 1.2) * 12;

  // Entrance spring for the video frame card
  const videoCardSpring = spring({
    frame: frame - 6,
    fps,
    config: VIDEO_CONFIG.transitions.springConfig,
  });

  const videoScale = 0.9 + videoCardSpring * 0.1;
  const videoOpacity = Math.min(1, videoCardSpring * 1.5);

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
          padding: isVertical ? "60px 40px" : "60px 100px",
          gap: isVertical ? 40 : 80,
          boxSizing: "border-box",
        }}
      >
        {/* Decorative Clay Floating Spheres (Parallax) */}
        <div
          style={{
            position: "absolute",
            top: isVertical ? "4%" : "10%",
            left: isVertical ? "8%" : "5%",
            width: 120,
            height: 120,
            borderRadius: 9999,
            background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
            boxShadow: VIDEO_CONFIG.colors.clayCardShadow,
            transform: `translate(${floatX}px, ${floatY}px)`,
            opacity: 0.65,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? "16%" : "12%",
            right: isVertical ? "6%" : "6%",
            width: 90,
            height: 90,
            borderRadius: 9999,
            background: "linear-gradient(135deg, #FFEBE6 0%, #FFD5CC 100%)",
            boxShadow: VIDEO_CONFIG.colors.clayCardShadow,
            transform: `translate(${-floatX}px, ${-floatY}px)`,
            opacity: 0.7,
          }}
        />

        {/* Text Content Column */}
        <div
          style={{
            flex: isVertical ? "none" : 1,
            width: isVertical ? "100%" : "auto",
            display: "flex",
            flexDirection: "column",
            gap: isVertical ? 20 : 24,
            zIndex: 10,
            alignItems: isVertical ? "center" : "flex-start",
            textAlign: isVertical ? "center" : "left",
          }}
        >
          {/* Badge */}
          <ClayBadge label={config.badge} variant="coral" size={isVertical ? "md" : "lg"} />

          {/* Kinetic Title: "Student data. Finally useful." */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <KineticText
              text={config.titlePrimary}
              fontSize={isVertical ? 68 : 78}
              color={VIDEO_CONFIG.colors.navy}
              delayFrames={5}
            />
            <KineticText
              text={config.titleAccent}
              fontSize={isVertical ? 68 : 78}
              color={VIDEO_CONFIG.colors.coral}
              delayFrames={16}
            />
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: VIDEO_CONFIG.fonts.body,
              fontWeight: 700,
              fontSize: isVertical ? 26 : 24,
              color: VIDEO_CONFIG.colors.muted,
              lineHeight: 1.4,
              maxWidth: isVertical ? "90%" : 560,
            }}
          >
            {config.subtitle}
          </div>

          {/* Category Highlight Pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: isVertical ? "center" : "flex-start",
              marginTop: 6,
            }}
          >
            {config.highlightPills.map((pill, i) => (
              <ClayBadge key={pill} label={pill} variant="default" size="sm" />
            ))}
          </div>
        </div>

        {/* Video Card (Intro AI Clip framed in Clay Card) */}
        <div
          style={{
            flex: isVertical ? "none" : 1,
            width: isVertical ? "100%" : "auto",
            maxWidth: isVertical ? 640 : 760,
            transform: `scale(${videoScale})`,
            opacity: videoOpacity,
            zIndex: 10,
          }}
        >
          <ClayCard
            elevation="high"
            radius={36}
            style={{
              padding: 16,
              background: "#FFFFFF",
            }}
          >
            <div
              style={{
                width: "100%",
                height: isVertical ? 380 : 440,
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.3)",
                background: "#0F172A",
              }}
            >
              <AssetVideo assetPath={config.videoAsset} screenType="intro" />
            </div>
          </ClayCard>
        </div>

        {/* Burned-in High-Contrast Captions */}
        <CaptionsBar caption={config.caption} isVertical={isVertical} delayFrames={10} />
      </div>
    </WhipTransition>
  );
};
