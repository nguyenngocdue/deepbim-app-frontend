import React, { useEffect, useState } from "react";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "../../components/bim-viewer/ModelIfc";
import FaceMeasurementGuide from "../../components/bim-viewer/guides/FaceMeasurementGuide";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FooterTabViewer from "../../components/layout/FooterTabViewer";
import RightSidebarViewer from "../../components/layout/RightSidebarViewer";
import DraggableHeaderViewer from "../../components/layout/DraggableHeaderViewer";
import LeftHeader from "@/sections/LeftHeader";
import { useLanguage } from "@/context/LanguageContext";
import { UserManager } from "@/services/UserManager";
import VisibilityManager from "@/features/bim-viewer/modals/visibility-manger";
import CombineModelManager from "@/features/bim-viewer/modals/combine-model";
import DraggableRightBarViewer from "@/components/layout/DraggableRightBarViewer";

const MainViewer: React.FC = () => {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const fetchUserSetting = async () => {
      await UserManager.fetch();
    }
    fetchUserSetting();

  }, [])

  const [states, setStates] = useState({
    sectionActive: false,
    coordinateSyssActive: false,
    coordinateSysActive: false,
    isHighlightEnabled: true,
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
    isVisibleSettings: false,
    hasCombineModels:false,
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
  return (
    <>
      <ViewCubeProvider>
        <ViewCubeProvider2>
          <div className={`h-screen ${themeClass}`}>

            {/* {!isModelReady && <FullscreenLoader progress={progress} message="Loading 3D model..." />} */}

            {/* HEADER */}
            <DraggableHeaderViewer
              onToggle={toggleState}
              onToggleTheme={toggleTheme}
              currentTheme={theme}
              handleFileSelect={() => { }}
              navigationMode="Orbit"
              states={states}
            />

            <PanelGroup direction="vertical" className="h-full">

              {/* MAIN */}
              <Panel defaultSize={80} className={themeClass}>
                <PanelGroup direction="horizontal" className="h-full">
                  {/* CENTER */}
                  <Panel defaultSize={60} minSize={30} className={themeClass}>
                    <div className="h-full w-full bg-black relative">

                      <div className="absolute top-0 z-50 right-0 p-4">
                        <LeftHeader
                          toggleLanguage={toggleLanguage}
                          language={language.toUpperCase()}
                          toggleTheme={toggleTheme}
                          theme={theme}
                          className=""
                        />
                      </div>

                      <ModelIfc
                        {...states}
                      />
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
                  {
                    states.hasCombineModels && 
                      <DraggableRightBarViewer
                        onToggle={toggleState}
                        onToggleTheme={toggleTheme}
                        currentTheme={theme}
                        handleFileSelect={() => { }}
                        navigationMode="Orbit"
                        states={states}
                        hasDirection={false}
                      />
                  }
                </PanelGroup>
              </Panel>
            </PanelGroup>

          </div>
        </ViewCubeProvider2>
      </ViewCubeProvider>
      {
        states.isVisibleSettings &&
        <VisibilityManager
          open={true}
          onClose={() => toggleState('isVisibleSettings')}  
        />
      }
       {/* {
        states.hasCombineModels &&
        <CombineModelManager
          open={true}
          onClose={() => toggleState('hasCombineModels')}  
        />
      } */}
    </>
  );

};

export default MainViewer;
