import React, { useEffect, useState } from "react";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "../../components/bim-viewer/ModelIfc";


import DraggableHeaderViewer from "../../components/layout/DraggableHeaderViewer";
import LeftHeader from "@/sections/LeftHeader";
import { useLanguage } from "@/context/LanguageContext";
import { UserManager } from "@/services/UserManager";
import VisibilityManager from "@/features/bim-viewer/modals/visibility-manger";
import DraggableRightBarViewer from "@/components/layout/DraggableRightBarViewer";
import CombineModelManager from "@/features/bim-viewer/modals/combine-model";

const MainViewer: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const [onModelReady, setOnModelReady] = useState(false);

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


  const sidebarTabs = [
      {
        name: "Combine Model",
        value: "Combine Model",
        content: <CombineModelManager />,
      }
    ];
  
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
            {/* HEADER */}
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
                  onToggle={toggleState}
                  navigationMode="Orbit"
                  setOnModelReady={setOnModelReady}
                  isVertical={false}
                />
              {
                states.hasCombineModels &&
                <DraggableRightBarViewer
                  currentTheme={theme}
                  hasDirection={false}
                  sidebarTabs={sidebarTabs}
                />
              }
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
