import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { VIDEO_CONFIG } from "../config";
import { FontLoader } from "../components/FontLoader";
import { AudioTrack } from "../components/AudioTrack";
import { Scene1Intro } from "../scenes/Scene1Intro";
import { Scene2StatCounters } from "../scenes/Scene2StatCounters";
import { Scene3Faculty } from "../scenes/Scene3Faculty";
import { Scene4Drawer } from "../scenes/Scene4Drawer";
import { Scene5Segments } from "../scenes/Scene5Segments";
import { Scene6Trends } from "../scenes/Scene6Trends";
import { Scene7Mobile } from "../scenes/Scene7Mobile";
import { Scene8Outro } from "../scenes/Scene8Outro";

export const CampusPulseLandscape: React.FC = () => {
  const { scenes } = VIDEO_CONFIG;

  return (
    <FontLoader>
      <AbsoluteFill style={{ backgroundColor: VIDEO_CONFIG.colors.base }}>
        {/* Synchronized 120 BPM Audio Track */}
        <AudioTrack />

        {/* Master Sequencer (40 Seconds Total = 1200 Frames) */}
        <Series>
          {/* 0-4s: Intro AI Clip + Kinetic Title */}
          <Series.Sequence durationInFrames={scenes.scene1_intro.durationInFrames}>
            <Scene1Intro isVertical={false} />
          </Series.Sequence>

          {/* 4-9s: Big Stat Counters Pop In */}
          <Series.Sequence durationInFrames={scenes.scene2_stats.durationInFrames}>
            <Scene2StatCounters isVertical={false} />
          </Series.Sequence>

          {/* 9-16s: Faculty Dashboard Footage with 1.1x Zoom */}
          <Series.Sequence durationInFrames={scenes.scene3_faculty.durationInFrames}>
            <Scene3Faculty isVertical={false} />
          </Series.Sequence>

          {/* 16-22s: Explainable Score Drawer */}
          <Series.Sequence durationInFrames={scenes.scene4_drawer.durationInFrames}>
            <Scene4Drawer isVertical={false} />
          </Series.Sequence>

          {/* 22-27s: Segments + Interventions */}
          <Series.Sequence durationInFrames={scenes.scene5_segments.durationInFrames}>
            <Scene5Segments isVertical={false} />
          </Series.Sequence>

          {/* 27-33s: Placement Trends + Admin Lookup */}
          <Series.Sequence durationInFrames={scenes.scene6_trends.durationInFrames}>
            <Scene6Trends isVertical={false} />
          </Series.Sequence>

          {/* 33-37s: Phone Mockup */}
          <Series.Sequence durationInFrames={scenes.scene7_mobile.durationInFrames}>
            <Scene7Mobile isVertical={false} />
          </Series.Sequence>

          {/* 37-40s: Outro Clip + Grand Finale Brag Card */}
          <Series.Sequence durationInFrames={scenes.scene8_outro.durationInFrames}>
            <Scene8Outro isVertical={false} />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </FontLoader>
  );
};
