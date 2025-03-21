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

interface HeaderViewerProps {
  onToggle: (stateName: string) => void; // Hàm chung để toggle trạng thái
  sectionActive: boolean; // Trạng thái Section Box
  coordinateSyssActive: boolean; // Trạng thái Coordinate System
}
const HeaderViewer: React.FC<HeaderViewerProps> = ( {onToggle, sectionActive, coordinateSyssActive}) => {


  const handleClick = (item : string) => {
    console.log(item)
  }
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
            <Button variant="ghost" size="icon" onClick={() => handleClick("Users")}>
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
              onToggle={() => onToggle("coordinateSyssActive")}
              isActive={coordinateSyssActive}
              />

          </div>
        </header>
    </>
  );
};

export default HeaderViewer;
