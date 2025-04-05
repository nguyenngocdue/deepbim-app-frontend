import React, { useState } from "react";
import HeaderViewer from "../layout/HeaderViewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";
import FaceMeasurementGuide from "./guides/FaceMeasurementGuide";
import ClassificationsTree from "./Classifications/ClassificationsTree";
import ElementProperties from "./element-properties/ElementProperties";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MainViewer: React.FC = () => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

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
          {/* Header */}
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

          {/* Body Panels */}
          <div className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
             
              {/* CENTER PANEL */}
              <Panel defaultSize={60} minSize={30}>
                <div className="h-full w-full bg-black relative">
                  <ModelIfc
                    onModelReady={() => setIsModelReady(true)}
                    {...states}
                  />
                  <FaceMeasurementGuide isEnabled={states.isFaceMeasurement} />

                  {/* Mở trái */}
                  {isLeftCollapsed && (
                    <button
                      onClick={() => setIsLeftCollapsed(false)}
                      className="absolute top-2 right-2 z-50 p-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                      title="Expand left"
                    >
                      <FiChevronRight className="text-white" />
                    </button>
                  )}

                  {/* Mở phải */}
                  {isRightCollapsed && (
                    <button
                      onClick={() => setIsRightCollapsed(false)}
                      className="absolute top-2 right-2 z-50 p-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                      title="Expand right"
                    >
                      <FiChevronLeft className="text-white" />
                    </button>
                  )}
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-zinc-700 cursor-ew-resize" />
               {/* LEFT PANEL */}
               <Panel
                defaultSize={20}
                minSize={10}
                maxSize={40}
                collapsed={isLeftCollapsed.toString()}
                collapsible
                hidden={isLeftCollapsed}
              >
                <div
                  className={`
                    h-full overflow-auto bg-zinc-900 border-r border-zinc-800 relative
                    ${isLeftCollapsed ? "hidden" : "block"}
                  `}
                >
                  <button
                    onClick={() => setIsLeftCollapsed(true)}
                    className="absolute top-2 left-2 z-50 p-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                    title="Collapse right"
                  >
                    <FiChevronLeft className="text-white" />
                  </button>

                  {isModelReady && <ClassificationsTree />}
                </div>
              </Panel>


              <PanelResizeHandle className="w-1 bg-zinc-700 cursor-ew-resize" />

              {/* RIGHT PANEL */}
              <Panel
                defaultSize={20}
                minSize={10}
                maxSize={40}
                collapsed={isRightCollapsed.toString()}
                collapsible
                hidden={isRightCollapsed}
              >
                <div
                  className={`
                    h-full overflow-auto bg-zinc-900 border-l border-zinc-800 relative
                    ${isRightCollapsed ? "hidden" : "block"}
                  `}
                >
                  <button
                    onClick={() => setIsRightCollapsed(true)}
                    className="absolute top-2 left-2 z-50 p-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                    title="Collapse right"
                  >
                    <FiChevronRight className="text-white" />
                  </button>

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
