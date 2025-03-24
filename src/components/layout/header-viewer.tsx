import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FaCubes,
  FaUserCog,
} from "react-icons/fa";
import ViewFit from "../bim-viewer/view-fit";
import CameraSetting from "../bim-viewer/camera-setting";
import SectionBox from "../bim-viewer/SectionBox";
import CoordinateSystem from "../bim-viewer/CoordinateSystem";
import UploadModel from "../bim-viewer/UploadModel";
import HighlightElement from "../bim-viewer/HighlightElement";
import ClippingEdges from "../bim-viewer/ClippingEdges";
import EdgeMeasurement from "../bim-viewer/EdgeMeasurement";
import FaceMeasurement from "../bim-viewer/FaceMeasurement";

interface HeaderViewerProps {
  onToggle: (stateName: string) => void; // Hàm chung để toggle trạng thái
  sectionActive: boolean; // Trạng thái Section Box
  coordinateSysActive: boolean; // Trạng thái Coordinate System
  uploadModelActive: boolean;
  handleFileSelect: (filePath: Uint8Array | null) => void;
  isHighlightEnabled:boolean,
  isClippingEdges:boolean,
  isEdgeMeasurement:boolean,
  isFaceMeasurement:boolean,
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
  }
) => {

  return (
    <>
        <header className="z-50  absolute top-0 left-10 w-[65%] bg-black/50 backdrop-blur-md text-white px-4 md:px-6 py-2 shadow-md flex items-center">
          <div className="text-xl font-bold text-purple-500 flex items-center gap-2">
            <FaCubes />
            <span className="hidden sm:inline">DeepBIM</span>
            <span className="text-xs text-gray-400 hidden md:inline">Powered by Nissan</span>
          </div>

          <div className="flex items-center gap-4 ml-6">
            {/* Main Navigation */}
            <Button variant="ghost" size="icon">
              <FaUserCog className="text-lg" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Tools */}
            <ViewFit />
            <CameraSetting/>
            <SectionBox 
              onToggle={() => onToggle("sectionActive")} // Gọi toggleState với tên trạng thái
              isActive={sectionActive}
            />
            <CoordinateSystem 
              onToggle={() => onToggle("coordinateSysActive")}
              isActive={coordinateSysActive}
              />
            <UploadModel
                onToggle={handleFileSelect}
                isActive={coordinateSysActive}
            />
            <HighlightElement
                onToggle={() => onToggle("isHighlightEnabled")}
                isActive={isHighlightEnabled}
            />
            <ClippingEdges
              onToggle={() => onToggle("isClippingEdges")}
              isActive={isClippingEdges}
            />
            <EdgeMeasurement
             onToggle={() => onToggle("isEdgeMeasurement")}
             isActive={isEdgeMeasurement}
            />
             <FaceMeasurement
             onToggle={() => onToggle("isFaceMeasurement")}
             isActive={isFaceMeasurement}
            />

          </div>
        </header>
    </>
  );
};

export default HeaderViewer;
