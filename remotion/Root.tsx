import React from "react";
import { Composition } from "remotion";
import { VIDEO_CONFIG } from "./config";
import { CampusPulseLandscape } from "./compositions/CampusPulseLandscape";
import { CampusPulseVertical } from "./compositions/CampusPulseVertical";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2StatCounters } from "./scenes/Scene2StatCounters";
import { Scene3Faculty } from "./scenes/Scene3Faculty";
import { Scene4Drawer } from "./scenes/Scene4Drawer";
import { Scene5Segments } from "./scenes/Scene5Segments";
import { Scene6Trends } from "./scenes/Scene6Trends";
import { Scene7Mobile } from "./scenes/Scene7Mobile";
import { Scene8Outro } from "./scenes/Scene8Outro";

import "./styles.css";

export const RemotionRoot: React.FC = () => {
  const { fps, totalDurationFrames, dimensions, scenes } = VIDEO_CONFIG;

  return (
    <>
      {/* 1. Primary Landscape Video (1920x1080, 40s @ 30fps) */}
      <Composition
        id="CampusPulseLandscape"
        component={CampusPulseLandscape}
        durationInFrames={totalDurationFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      {/* 2. Vertical Mobile Cut (1080x1920, 40s @ 30fps) */}
      <Composition
        id="CampusPulseVertical"
        component={CampusPulseVertical}
        durationInFrames={totalDurationFrames}
        fps={fps}
        width={dimensions.vertical.width}
        height={dimensions.vertical.height}
      />

      {/* --- Individual Scene Compositions for Rapid Studio Preview --- */}
      <Composition
        id="Scene1-Intro"
        component={() => <Scene1Intro isVertical={false} />}
        durationInFrames={scenes.scene1_intro.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene2-StatCounters"
        component={() => <Scene2StatCounters isVertical={false} />}
        durationInFrames={scenes.scene2_stats.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene3-Faculty"
        component={() => <Scene3Faculty isVertical={false} />}
        durationInFrames={scenes.scene3_faculty.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene4-Drawer"
        component={() => <Scene4Drawer isVertical={false} />}
        durationInFrames={scenes.scene4_drawer.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene5-Segments"
        component={() => <Scene5Segments isVertical={false} />}
        durationInFrames={scenes.scene5_segments.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene6-Trends"
        component={() => <Scene6Trends isVertical={false} />}
        durationInFrames={scenes.scene6_trends.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene7-Mobile"
        component={() => <Scene7Mobile isVertical={false} />}
        durationInFrames={scenes.scene7_mobile.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />

      <Composition
        id="Scene8-Outro"
        component={() => <Scene8Outro isVertical={false} />}
        durationInFrames={scenes.scene8_outro.durationInFrames}
        fps={fps}
        width={dimensions.landscape.width}
        height={dimensions.landscape.height}
      />
    </>
  );
};
