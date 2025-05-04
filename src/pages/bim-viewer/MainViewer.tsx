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
    hasCombineModels: false,
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
  // const themeClass = theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-100 text-black";
  const themeClass = theme === "dark" ? "" : "";
  return (
    <>
      <ViewCubeProvider>
        <ViewCubeProvider2>
          <DraggableHeaderViewer
            onToggle={toggleState}
            onToggleTheme={toggleTheme}
            currentTheme={theme}
            handleFileSelect={() => { }}
            navigationMode="Orbit"
            states={states}
          />
          <div className={` ${themeClass} h-full`}>

            {/* {!isModelReady && <FullscreenLoader progress={progress} message="Loading 3D model..." />} */}

            {/* HEADER */}
            <PanelGroup direction="vertical">
              <Panel defaultSize={60} minSize={30} >
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
    </>
  );

};

export default MainViewer;
