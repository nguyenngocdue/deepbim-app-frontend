import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FaCubes,
  FaUserCog,
} from "react-icons/fa";
import ViewFit from "../bim-viewer/view-fit";
import CameraSetting from "../bim-viewer/CameraSetting";
import SectionBox from "../bim-viewer/SectionBox";
import CoordinateSystem from "../bim-viewer/CoordinateSystem";
import UploadModel from "../bim-viewer/UploadModel";
import HighlightElement from "../bim-viewer/HighlightElement";
import ClippingEdges from "../bim-viewer/ClippingEdges";
import EdgeMeasurement from "../bim-viewer/EdgeMeasurement";
import FaceMeasurement from "../bim-viewer/FaceMeasurement";
import Grids from "../bim-viewer/Grids";
import VolumeMeasurement from "../bim-viewer/VolumeMeasurement";
import PlansViews from "../bim-viewer/PlansViews";
import LengthMeasurement from "../bim-viewer/LengthMeasurements";
import LengthMeasurements from "../bim-viewer/LengthMeasurements";

interface HeaderViewerProps {
  onToggle: (stateName: string) => void; // Hàm chung để toggle trạng thái
  sectionActive: boolean; // Trạng thái Section Box
  coordinateSysActive: boolean; // Trạng thái Coordinate System
  uploadModelActive: boolean;
  handleFileSelect: (filePath: Uint8Array | null) => void;
  isHighlightEnabled: boolean,
  isClippingEdges: boolean,
  isEdgeMeasurement: boolean,
  isFaceMeasurement: boolean,
  haveGrids: boolean,
  hasVolumeMeasurement: boolean
  havePlansViews: boolean;
  haveLengthMeasurements: boolean;
  isOrthoPerspective:boolean
}
const HeaderViewer: React.FC<HeaderViewerProps> = (
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
  }
) => {

  return (
    <>
      <header className="z-50 absolute top-0 left-10 right-10 w-[calc(100%-5rem)] bg-black/50 backdrop-blur-md text-white px-4 md:px-6 py-2 shadow-md">
  <div className="flex flex-col gap-2">
    
    {/* Logo Section */}
    <div className="flex items-center justify-between text-purple-500 text-xl font-bold gap-2">
      <div className="flex items-center gap-2">
        <FaCubes />
        <span className="hidden sm:inline">DeepBIM</span>
        <span className="text-xs text-gray-400 hidden md:inline">Powered by Nissan</span>
      </div>
    </div>

{/* Toolbar Section */}
<div className="max-h-48 overflow-y-auto overflow-x-hidden">
  <div className="flex flex-wrap gap-2 items-center">
    <Button variant="ghost" size="icon">
      <FaUserCog className="text-lg" />
    </Button>
    <Separator orientation="vertical" className="h-6" />

    <ViewFit />
    <CameraSetting onToggle={() => onToggle("isOrthoPerspective")} isActive={isOrthoPerspective} />
    <SectionBox onToggle={() => onToggle("sectionActive")} isActive={sectionActive} />
    <CoordinateSystem onToggle={() => onToggle("coordinateSysActive")} isActive={coordinateSysActive} />
    <UploadModel onToggle={handleFileSelect} isActive={coordinateSysActive} />
    <HighlightElement onToggle={() => onToggle("isHighlightEnabled")} isActive={isHighlightEnabled} />
    <ClippingEdges onToggle={() => onToggle("isClippingEdges")} isActive={isClippingEdges} />
    <EdgeMeasurement onToggle={() => onToggle("isEdgeMeasurement")} isActive={isEdgeMeasurement} />
    <FaceMeasurement onToggle={() => onToggle("isFaceMeasurement")} isActive={isFaceMeasurement} />
    <Grids onToggle={() => onToggle("haveGrids")} isActive={haveGrids} />
    <VolumeMeasurement onToggle={() => onToggle("hasVolumeMeasurement")} isActive={hasVolumeMeasurement} />
    <PlansViews onToggle={() => onToggle("havePlansViews")} isActive={havePlansViews} />
    <LengthMeasurements onToggle={() => onToggle("haveLengthMeasurements")} isActive={haveLengthMeasurements} />
  </div>
</div>

  </div>
</header>

    </>
  );
};

export default HeaderViewer;
