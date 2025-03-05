import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FiZoomIn, FiZoomOut, FiRefreshCcw, FiScissors, FiTrash2, FiEye, FiMove, FiRotateCw, FiMaximize2, FiUpload, FiDownload, FiSun, FiLayers } from "react-icons/fi";

export default function Toolbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-16 bg-gray-200 flex items-center justify-between px-6 shadow-md">
      {/* Navigation & View */}
      <div className="flex gap-3">
        <Button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"><FiZoomIn /> Zoom In</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"><FiZoomOut /> Zoom Out</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"><FiRefreshCcw /> Reset</Button>
      </div>
      
      {/* Clipping Tools */}
      <div className="flex gap-3">
        <Button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"><FiScissors /> Clip Plane</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"><FiEye /> Vertical Clip</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"><FiTrash2 /> Clear Clips</Button>
      </div>
      
      {/* Model Manipulation */}
      <div className="flex gap-3">
        <Button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"><FiMove /> Move</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"><FiRotateCw /> Rotate</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"><FiMaximize2 /> Scale</Button>
      </div>
      
      {/* File & View Options */}
      <div className="flex gap-3">
        <Button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"><FiUpload /> Import</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"><FiDownload /> Export</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"><FiSun /> Lighting</Button>
        <Button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"><FiLayers /> Grid</Button>
      </div>
    </div>
  );
}