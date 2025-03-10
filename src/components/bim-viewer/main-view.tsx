import React, { useRef } from "react";
import GeometrySceneViewCube from "./geometry-scene-viewcube";
import HeaderViewer from "../layout/header-viewer";
import { GizmoProvider } from "@/context/gizmo-context";
import { ViewCubeProvider } from "@/context/view-cube-context";

const MainView: React.FC = () => {
  const resetViewRef = useRef<(() => void) | null>(null); // ✅ Ensure `resetViewRef.current` is either a function or null

  return (
    <ViewCubeProvider>
      <div className="relative">
        {/* ✅ Ensure `resetViewRef` is assigned a function */}
        <GeometrySceneViewCube onResetView={(resetFn) => (resetViewRef.current = resetFn)} />
        <div className="absolute top-[10px] right-0 left-0">
          {/* ✅ Ensure function exists before calling */}
          <HeaderViewer resetView={() => resetViewRef.current && resetViewRef.current()} />
        </div>
      </div>
    </ViewCubeProvider>
  );
};

export default MainView;
