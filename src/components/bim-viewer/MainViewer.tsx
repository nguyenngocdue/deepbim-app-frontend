import React, { useRef, useState } from "react";
import GeometrySceneViewCube from "./geometry-scene-viewcube";
import HeaderViewer from "../layout/header-viewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";

const MainViewer: React.FC = () => {

  const [sectionActive, setSectionActive] = useState(false);
  const toggleSectionActive = () => {
    setSectionActive((prev) => !prev);
};


  return (
    <ViewCubeProvider>
      <ViewCubeProvider2>
        <div className="relative">
          <div className="absolute top-[10px] right-0 left-0">
            {/* ✅ Ensure function exists before calling */}
            <HeaderViewer onToggle={toggleSectionActive} sectionActive={sectionActive}/>
          </div>
          <ModelIfc sectionActive={sectionActive}/>
        </div>
      </ViewCubeProvider2>
    </ViewCubeProvider>
  );
};

export default MainViewer;
