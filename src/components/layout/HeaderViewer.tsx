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
import VisibleSettings from "../bim-viewer/settings/VisibleSettings";
import CombineModelBtn from "../bim-viewer/CombineModelBtn";


const HeaderViewer: React.FC<ModelIfcProps> = (
  {
    onToggle,
    coordinateSysActive,
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
    isFreeControlElements,
    isFitView,
    isVisibleSettings,
    isVertical,
    hasCombineModels,
  }
) => {

  return (
    <>
      <header className={`z-50 backdrop-blur-md text-white  md:px-6 py-2 shadow-md shadow-zinc-600 border-zinc-600 round-lg border`}>
        <div className="flex flex-col gap-2">
        <div className={`${isVertical ? "max-h-none" : "max-h-48"} overflow-y-auto overflow-x-hidden`}>
            <div className={`flex gap-2 ${isVertical ? "flex-col items-start" : "flex-wrap items-center"}`}>
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
              <PlansViews onToggle={() => onToggle("havePlansViews")} isActive={havePlansViews} />
              <WorldSettings onToggle={() => onToggle("haveWorldSettings")} isActive={haveWorldSettings} />
              <VisibleSettings onToggle={() => onToggle("isVisibleSettings")} isActive={isVisibleSettings} />
              <CombineModelBtn onToggle={() => onToggle("hasCombineModels")} isActive={hasCombineModels} />
            </div>
          </div>

        </div>
      </header>

    </>
  );
};

export default HeaderViewer;

