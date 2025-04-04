import React, { useEffect, useRef, useState } from "react";
import HeaderViewer from "../layout/HeaderViewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";
import FaceMeasurementGuide from "./guides/FaceMeasurementGuide";
import '../../App.css';
import ClassificationsTree from "./Classifications/ClassificationsTree";
import ElementProperties from "./element-properties/ElementProperties";
import { containerManager } from "@/services/ContainerManager";
import { worldManager } from "@/services/WorldManager";
import { ProSidebar, Menu, MenuItem, SubMenu, Sidebar } from "react-pro-sidebar";
import { FaBoxes, FaCube } from "react-icons/fa";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

const MainViewer: React.FC = () => {
  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
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
        <div className="h-screen flex flex-col bg-black text-white">
          {/* Header cố định */}
          <div className="border-b border-zinc-800 bg-zinc-900">
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
  
          {/* Resizable PanelGroup bên dưới */}
          <div className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              {/* Left Panel */}
              <Panel defaultSize={20} minSize={10} maxSize={40}>
                <div className="h-full overflow-auto bg-zinc-900 border-r border-zinc-800 p-4">
                  {isModelReady && <ClassificationsTree />}
                </div>
              </Panel>
  
              {/* Handle trái */}
              <PanelResizeHandle className="w-1 bg-zinc-700 cursor-ew-resize" />
  
              {/* Center Panel */}
              <Panel defaultSize={60} minSize={30}>
                <div className="h-full w-full bg-black relative">
                  <ModelIfc
                    onModelReady={() => setIsModelReady(true)}
                    {...states}
                  />
                </div>
              </Panel>
  
              {/* Handle phải */}
              <PanelResizeHandle className="w-1 bg-zinc-700 cursor-ew-resize" />
  
              {/* Right Panel */}
              <Panel defaultSize={20} minSize={10} maxSize={40}>
                <div className="h-full overflow-auto bg-zinc-900 border-l border-zinc-800 p-4">
                  {isModelReady && <ElementProperties />}
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </ViewCubeProvider2>
    </ViewCubeProvider>
  );
  

};

export default MainViewer;
