import React, { useRef, useState } from "react";
import HeaderViewer from "../layout/header-viewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";

const MainViewer: React.FC = () => {

  // State quản lý các trạng thái toggle
  const [states, setStates] = useState({
    sectionActive: false,
    coordinateSyssActive: false,
  });

  // Hàm chung để toggle trạng thái
  const toggleState = (stateName: keyof typeof states) => {
    setStates((prev) => ({
        ...prev,
        [stateName]: !prev[stateName],
    }));
};


  return (
    <ViewCubeProvider>
      <ViewCubeProvider2>
        <div className="relative">
          <div className="absolute top-[10px] right-0 left-0">
            {/* ✅ Ensure function exists before calling */}
            <HeaderViewer 
                onToggle={toggleState}
                sectionActive={states.sectionActive}
                coordinateSyssActive={states.coordinateSyssActive}
                />
          </div>
          <ModelIfc sectionActive={states.sectionActive} coordinateSyssActive={states.coordinateSyssActive}/>
        </div>
      </ViewCubeProvider2>
    </ViewCubeProvider>
  );
};

export default MainViewer;
