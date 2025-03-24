import React, { useRef, useState } from "react";
import HeaderViewer from "../layout/header-viewer";
import { ViewCubeProvider } from "@/context/view-cube-context";
import { ViewCubeProvider2 } from "@/context/view-cube-context2";
import ModelIfc from "./ModelIfc";

const MainViewer: React.FC = () => {

  // State quản lý các trạng thái toggle
  const [states, setStates] = useState({
    sectionActive: false,
    coordinateSyssActive: false,
    coordinateSysActive: false,
    isHighlightEnabled:false,
    isClippingEdges:false,
  });

  // Hàm chung để toggle trạng thái
  const toggleState = (stateName: keyof typeof states) => {
    setStates((prev) => ({
        ...prev,
        [stateName]: !prev[stateName],
    }));
};

 // State và hàm xử lý file path
 const [selectedFile, setselectedFile] = useState<Uint8Array | null>(null);
 const handleFileSelect = (filePath: Uint8Array | null) => {
     if (filePath) {
         setselectedFile(filePath);
         console.log("File path received:", filePath);
     } else {
         console.log("No file selected");
     }
 };


  return (
    <ViewCubeProvider>
      <ViewCubeProvider2>
        <div className="relative">
          <div className="absolute top-[10px] right-0 left-0">
            {/* ✅ Ensure function exists before calling */}
            <HeaderViewer 
                onToggle={toggleState}
                sectionActive={states.sectionActive}
                coordinateSyssActive={states.coordinateSyssActive}
                handleFileSelect={handleFileSelect}
                coordinateSysActive={states.coordinateSysActive}
                isHighlightEnabled={states.isHighlightEnabled}
                isClippingEdges={states.isClippingEdges}
                />
          </div>
          <ModelIfc 
            sectionActive={states.sectionActive} 
            coordinateSyssActive={states.coordinateSyssActive} 
            selectedFile={selectedFile} 
            onFileSelect={handleFileSelect}
            coordinateSysActive={states.coordinateSysActive}
            isHighlightEnabled={states.isHighlightEnabled}
            isClippingEdges={states.isClippingEdges}
            />
        </div>
      </ViewCubeProvider2>
    </ViewCubeProvider>
  );
};

export default MainViewer;
