import React, { useRef, useState } from "react";
import HeaderViewer from "../layout/HeaderViewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";
import FaceMeasurementGuide from "./guides/FaceMeasurementGuide";
import '../../App.css'
import ClassificationsTree from "./Classifications/ClassificationsTree";


const MainViewer: React.FC = () => {

  // State quản lý các trạng thái toggle
  const [states, setStates] = useState({
    sectionActive: false,
    coordinateSyssActive: false,
    coordinateSysActive: false,
    isHighlightEnabled: false,
    isClippingEdges: false,
    isEdgeMeasurement: false,
    isFaceMeasurement: false,
    haveGrids: false,
    hasVolumeMeasurement: false,
    havePlansViews: false,
    haveLengthMeasurements: false,
    isOrthoPerspective: false,
    haveAreaMeasureElements: false,
    haveAngleMeasurements: false,
    haveWorldSettings: false,
    isOriginalWorldCamera: false,
    isFreeControlElements: false,
    isPlaneHover: false,
    isFitView: false,
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
              isFitView={states.isFitView}
              isOrthoPerspective={states.isOrthoPerspective}
              sectionActive={states.sectionActive}
              coordinateSysActive={states.coordinateSysActive}
              isHighlightEnabled={states.isHighlightEnabled}
              isClippingEdges={states.isClippingEdges}
              isEdgeMeasurement={states.isEdgeMeasurement}
              isFaceMeasurement={states.isFaceMeasurement}
              haveGrids={states.haveGrids}
              hasVolumeMeasurement={states.hasVolumeMeasurement}
              havePlansViews={states.havePlansViews}
              haveLengthMeasurements={states.haveLengthMeasurements}
              haveAreaMeasureElements={states.haveAreaMeasureElements}
              haveAngleMeasurements={states.haveAngleMeasurements}
              haveWorldSettings={states.haveWorldSettings}
              isOriginalWorldCamera={states.isOriginalWorldCamera}
              isFreeControlElements={states.isFreeControlElements}
              isPlaneHover={states.isPlaneHover}
            />
          </div>
          <div className="">
            <ModelIfc
              sectionActive={states.sectionActive}
              isFitView={states.isFitView}
              isOrthoPerspective={states.isOrthoPerspective}
              coordinateSysActive={states.coordinateSysActive}
              isHighlightEnabled={states.isHighlightEnabled}
              isClippingEdges={states.isClippingEdges}
              isEdgeMeasurement={states.isEdgeMeasurement}
              isFaceMeasurement={states.isFaceMeasurement}
              haveGrids={states.haveGrids}
              hasVolumeMeasurement={states.hasVolumeMeasurement}
              havePlansViews={states.havePlansViews}
              haveLengthMeasurements={states.haveLengthMeasurements}
              haveAreaMeasureElements={states.haveAreaMeasureElements}
              haveAngleMeasurements={states.haveAngleMeasurements}
              haveWorldSettings={states.haveWorldSettings}
              isOriginalWorldCamera={states.isOriginalWorldCamera}
              isFreeControlElements={states.isFreeControlElements}
              isPlaneHover={states.isPlaneHover}
            />
            <FaceMeasurementGuide
              isEnabled={states.isFaceMeasurement}
            />
             <div className="absolute h-[85%] p-4 top-[10%]  left-0 z-50">
              <ClassificationsTree/>
            </div>
          </div>

        </div>
      </ViewCubeProvider2>
    </ViewCubeProvider>
  );
};

export default MainViewer;
