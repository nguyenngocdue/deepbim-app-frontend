import React, { useEffect, useState } from "react";
import HeaderViewer from "../layout/HeaderViewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";
import FaceMeasurementGuide from "./guides/FaceMeasurementGuide";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FooterTabViewer from "../layout/FooterTabViewer";
import RightSidebarViewer from "../layout/RightSidebarViewer";
import FullscreenLoader from "./common/FullscreenLoader";

const MainViewer: React.FC = () => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelActuallyReady, setModelActuallyReady] = useState(false);

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
    isIsolation: false,
  });

  const toggleState = (stateName: keyof typeof states) => {
    setStates((prev) => ({
      ...prev,
      [stateName]: !prev[stateName],
    }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const themeClass = theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-100 text-black";

  useEffect(() => {
    if (!modelActuallyReady && progress < 95) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 95)); // dừng ở 95%
      }, 100);
      return () => clearInterval(interval);
    }
  
    // khi ModelIfc báo ready thì boost lên 100
    if (modelActuallyReady && progress < 100) {
      const boost = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 100)); // tăng nhanh phần cuối
      }, 100);
      return () => clearInterval(boost);
    }
  
    if (modelActuallyReady && progress === 100) {
      const timeout = setTimeout(() => {
        setIsModelReady(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [progress, modelActuallyReady]);
  
  
  


  return (
    <ViewCubeProvider>
      <ViewCubeProvider2>
        <div className={`h-screen ${themeClass}`}>

        {!isModelReady && <FullscreenLoader progress={progress} message="Loading 3D model..." />}


          <PanelGroup direction="vertical" className="h-full">
            {/* HEADER */}
            <Panel defaultSize={9} minSize={5} maxSize={10} className={themeClass}>
              <div className="h-full">
                <HeaderViewer
                  onToggle={toggleState}
                  onToggleTheme={toggleTheme}
                  currentTheme={theme}
                  {...states}
                />
              </div>
            </Panel>
            <PanelResizeHandle className={`h-1 ${themeClass} cursor-ns-resize border-b border-zinc-800`} />

            {/* MAIN */}
            <Panel defaultSize={80} className={themeClass}>
              <PanelGroup direction="horizontal" className="h-full">
                {/* LEFT */}
                <PanelResizeHandle className={`w-1 ${themeClass} cursor-ns-resize`} />
                {/* CENTER */}
                <Panel defaultSize={60} minSize={30} className={themeClass}>
                  <div className="h-full w-full bg-black relative">
                    <ModelIfc
                      onModelReady={() => {
                        setModelActuallyReady(true);
                        }
                      }
                      {...states}
                    />
                    <FaceMeasurementGuide isEnabled={states.isFaceMeasurement} />
                    {isLeftCollapsed && (
                      <button
                        onClick={() => setIsLeftCollapsed(false)}
                        className="absolute top-2 right-2 z-50 p-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                        title="Expand left"
                      >
                        <FiChevronRight className="text-white" />
                      </button>
                    )}
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

                <PanelResizeHandle className={`w-1 ${themeClass} cursor-ns-resize`} />
                {/* RIGHT */}
                {/* <DataSiderBar
                  isCollapsed={isRightCollapsed}
                  onCollapse={() => setIsRightCollapsed(true)}
                  isModelReady={isModelReady}
                >
                  <RelationsTree />
                </DataSiderBar> */}
                <Panel defaultSize={20} minSize={5} maxSize={50} className={themeClass}>
                <RightSidebarViewer themeClass="h-full" />
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className={` ${themeClass} cursor-ns-resize`} />
              {/* FOOTER */}
              <Panel defaultSize={10} minSize={5} maxSize={100} className={themeClass}>
                  <FooterTabViewer themeClass={themeClass}/>
              </Panel>
          </PanelGroup>

        </div>
      </ViewCubeProvider2>
    </ViewCubeProvider>
  );
 
};

export default MainViewer;
