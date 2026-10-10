import React, { useState } from "react";
import { OffthreadVideo, staticFile, Video } from "remotion";
import { VIDEO_CONFIG } from "../config";
import {
  FacultyDashboardScreen,
  ExplainableDrawerScreen,
  SegmentsInterventionScreen,
  PlacementAdminScreen,
  MobileStudentScreen,
} from "./ScreenSimulators";

interface AssetVideoProps {
  assetPath: string;
  screenType?: "faculty" | "drawer" | "segments" | "trends" | "mobile" | "intro" | "outro" | "generic";
  style?: React.CSSProperties;
  forceSimulator?: boolean; // Can be toggled in config if pure CSS simulation is preferred
}

export const AssetVideo: React.FC<AssetVideoProps> = ({
  assetPath,
  screenType = "generic",
  style,
  forceSimulator = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const isSimulator = forceSimulator || VIDEO_CONFIG.useSimulatedScreensByDefault || hasError;

  if (isSimulator && screenType !== "intro" && screenType !== "outro" && screenType !== "generic") {
    if (screenType === "faculty") return <FacultyDashboardScreen />;
    if (screenType === "drawer") return <ExplainableDrawerScreen />;
    if (screenType === "segments") return <SegmentsInterventionScreen />;
    if (screenType === "trends") return <PlacementAdminScreen />;
    if (screenType === "mobile") return <MobileStudentScreen />;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0F172A",
        ...style,
      }}
    >
      <OffthreadVideo
        src={staticFile(assetPath)}
        onError={() => setHasError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};
