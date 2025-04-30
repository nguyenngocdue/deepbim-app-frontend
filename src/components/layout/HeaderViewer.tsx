import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import {
  FaCubes,
  FaUserCog,
} from "react-icons/fa";
import ViewFit from "../bim-viewer/view-fit";
import CameraSetting from "../bim-viewer/CameraSetting";
import CoordinateSystem from "../bim-viewer/CoordinateSystem";
import ClippingEdges from "../bim-viewer/ClippingEdges";
import EdgeMeasurement from "../bim-viewer/EdgeMeasurement";
import FaceMeasurement from "../bim-viewer/FaceMeasurement";
import Grids from "../bim-viewer/Grids";
import VolumeMeasurement from "../bim-viewer/VolumeMeasurement";
import PlansViews from "../bim-viewer/PlansViews";
import LengthMeasurements from "../bim-viewer/LengthMeasurements";
import AreaMeasurements from "../bim-viewer/AreaMeasurements";
import AngleMeasurements from "../bim-viewer/AngleMeasurements";
import WorldSettings from "../bim-viewer/WorldSettings";
import { ModelIfcProps } from "@/props/ModelIfcProps";
import FreeControlElements from "../bim-viewer/FreeControlElements";
import LogoSection from "./LogoSection";


const HeaderViewer: React.FC<ModelIfcProps> = (
  {
    onToggle,
    sectionActive,
    coordinateSysActive,
    handleFileSelect,
    isHighlightEnabled,
    isClippingEdges,
    isEdgeMeasurement,
    isFaceMeasurement,
    haveGrids,
    hasVolumeMeasurement,
    havePlansViews,
    haveLengthMeasurements,
    isOrthoPerspective,
    haveAreaMeasureElements,
    haveAngleMeasurements,
    haveWorldSettings,
    isOriginalWorldCamera,
    isFreeControlElements,
    isPlaneHover,
    isFitView,
    onToggleTheme,
    currentTheme,
  }
) => {

  return (
    <>
      <header className={`z-50 backdrop-blur-md text-white  md:px-6 py-2 shadow-md`}>
        <div className="flex flex-col gap-2">

          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <LogoSection />
          </div>

          {/* Toolbar Section */}
          <div className="max-h-48 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="ghost" size="icon">
                <FaUserCog className="text-lg" />
              </Button>

              <ViewFit onToggle={() => onToggle("isFitView")} isActive={isFitView} />
              <CameraSetting onToggle={() => onToggle("isOrthoPerspective")} isActive={isOrthoPerspective} />
              <CoordinateSystem onToggle={() => onToggle("coordinateSysActive")} isActive={coordinateSysActive} />
              <Grids onToggle={() => onToggle("haveGrids")} isActive={haveGrids} />

              <FreeControlElements onToggle={() => onToggle("isFreeControlElements")} isActive={isFreeControlElements} />
              <ClippingEdges onToggle={() => onToggle("isClippingEdges")} isActive={isClippingEdges} />

              <EdgeMeasurement onToggle={() => onToggle("isEdgeMeasurement")} isActive={isEdgeMeasurement} />
              <FaceMeasurement onToggle={() => onToggle("isFaceMeasurement")} isActive={isFaceMeasurement} />
              <VolumeMeasurement onToggle={() => onToggle("hasVolumeMeasurement")} isActive={hasVolumeMeasurement} />
              <LengthMeasurements onToggle={() => onToggle("haveLengthMeasurements")} isActive={haveLengthMeasurements} />
              <AreaMeasurements onToggle={() => onToggle("haveAreaMeasureElements")} isActive={haveAreaMeasureElements} />
              <AngleMeasurements onToggle={() => onToggle("haveAngleMeasurements")} isActive={haveAngleMeasurements} />

              {/* <SectionBox onToggle={() => onToggle("sectionActive")} isActive={sectionActive} /> */}

              <PlansViews onToggle={() => onToggle("havePlansViews")} isActive={havePlansViews} />
              

              <WorldSettings onToggle={() => onToggle("haveWorldSettings")} isActive={haveWorldSettings} />

              {/* <OriginalWorldCamera onToggle={() => onToggle("isOriginalWorldCamera")} isActive={isOriginalWorldCamera} /> */}
              {/* <PlaneHover onToggle={() => onToggle("isPlaneHover")} isActive={isPlaneHover} /> */}

            </div>
          </div>
        </div>
      </header>

    </>
  );
};

export default HeaderViewer;

