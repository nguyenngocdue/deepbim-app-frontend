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
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTheme } from "@/context/theme-context";


const MainViewer: React.FC = () => {
 

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

  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  

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
          
          <div className={` h-full`}>
            {/* HEADER */}
                <div className="absolute top-0 z-50 right-0 p-4">
                  <div className=' flex items-center space-x-4'>
                    <ThemeSwitch iconColor={theme === "dark" ? "text-slate-600" : "text-yellow-400"} />
                    <ProfileDropdown />
                  </div>
                </div>
                <ModelIfc
                  {...states}
                  onToggle={toggleState}
                  navigationMode="Orbit"
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
