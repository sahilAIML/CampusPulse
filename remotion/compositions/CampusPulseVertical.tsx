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

export const CampusPulseVertical: React.FC = () => {
  const { scenes } = VIDEO_CONFIG;

  return (
    <FontLoader>
      <AbsoluteFill style={{ backgroundColor: VIDEO_CONFIG.colors.base }}>
        {/* Synchronized 120 BPM Audio Track */}
        <AudioTrack />

        {/* Master Sequencer (40 Seconds Total = 1200 Frames, 9:16 Portrait Cut) */}
        <Series>
          {/* 0-4s: Intro AI Clip + Kinetic Title */}
          <Series.Sequence durationInFrames={scenes.scene1_intro.durationInFrames}>
            <Scene1Intro isVertical={true} />
          </Series.Sequence>

          {/* 4-9s: Big Stat Counters Pop In */}
          <Series.Sequence durationInFrames={scenes.scene2_stats.durationInFrames}>
            <Scene2StatCounters isVertical={true} />
          </Series.Sequence>

          {/* 9-16s: Faculty Dashboard Footage */}
          <Series.Sequence durationInFrames={scenes.scene3_faculty.durationInFrames}>
            <Scene3Faculty isVertical={true} />
          </Series.Sequence>

          {/* 16-22s: Explainable Score Drawer */}
          <Series.Sequence durationInFrames={scenes.scene4_drawer.durationInFrames}>
            <Scene4Drawer isVertical={true} />
          </Series.Sequence>

          {/* 22-27s: Segments + Interventions */}
          <Series.Sequence durationInFrames={scenes.scene5_segments.durationInFrames}>
            <Scene5Segments isVertical={true} />
          </Series.Sequence>

          {/* 27-33s: Placement Trends + Admin Lookup */}
          <Series.Sequence durationInFrames={scenes.scene6_trends.durationInFrames}>
            <Scene6Trends isVertical={true} />
          </Series.Sequence>

          {/* 33-37s: Phone Mockup */}
          <Series.Sequence durationInFrames={scenes.scene7_mobile.durationInFrames}>
            <Scene7Mobile isVertical={true} />
          </Series.Sequence>

          {/* 37-40s: Outro Clip + Brag Card */}
          <Series.Sequence durationInFrames={scenes.scene8_outro.durationInFrames}>
            <Scene8Outro isVertical={true} />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </FontLoader>
  );
};
