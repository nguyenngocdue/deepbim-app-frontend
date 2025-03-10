import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FaCubes,
  FaUserCog,
  FaClipboardList,
  FaExpand,
  FaMap,
  FaCut,
  FaRuler,
  FaImage,
  FaMousePointer,
  FaShareAlt,
  FaCog,
  FaHome,
} from "react-icons/fa";
import { FaCubesStacked } from "react-icons/fa6";

const HeaderViewer = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Auto-detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // ✅ Nếu <768px → Menu xuống dưới
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Event handlers
  const handleClick = (action: string) => {
    console.log(`Clicked on: ${action}`);
  };

  return (
    <>
      {/* 🔹 Desktop Header (Giữ Icon Căn Trái) */}
      {!isMobile && (
        <header className="absolute top-0 left-10 w-[65%] bg-black/50 backdrop-blur-md text-white px-4 md:px-6 py-2 shadow-md flex items-center">
          {/* 🔹 LOGO */}
          <div className="text-xl font-bold text-purple-500 flex items-center gap-2">
            <FaCubes />
            <span className="hidden sm:inline">DeepBIM</span>
            <span className="text-xs text-gray-400 hidden md:inline">Powered by Nissan</span>
          </div>

          {/* 🔹 Giữ các icon bên trái */}
          <div className="flex items-center gap-4 ml-6">
            {/* Main Navigation */}
            <Button variant="ghost" size="icon" onClick={() => handleClick("Users")}>
              <FaUserCog className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Clipboard")}>
              <FaClipboardList className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Cubes")}>
              <FaCubes className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Expand")}>
              <FaExpand className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Map")}>
              <FaMap className="text-lg" />
            </Button>

            {/* Separator */}
            <Separator orientation="vertical" className="h-6" />

            {/* Tools */}
            <Button variant="default" size="icon" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleClick("Select")}>
              <FaMousePointer className="text-white text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("3D Model")}>
              <FaCubesStacked className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Measure")}>
              <FaRuler className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Cut")}>
              <FaCut className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Screenshot")}>
              <FaImage className="text-lg" />
            </Button>

            {/* 🔹 SETTINGS & SHARE */}
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" onClick={() => handleClick("Home")}>
              <FaHome className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Share")}>
              <FaShareAlt className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Settings")}>
              <FaCog className="text-lg" />
            </Button>
          </div>
        </header>
      )}

      {/* 🔹 Mobile Bottom Toolbar (Không thay đổi) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-lg p-3 flex overflow-x-auto gap-3 z-50 shadow-lg justify-start px-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {/* Main Navigation */}
            <Button variant="ghost" size="icon" onClick={() => handleClick("Users")}>
              <FaUserCog className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Clipboard")}>
              <FaClipboardList className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Cubes")}>
              <FaCubes className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Expand")}>
              <FaExpand className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Map")}>
              <FaMap className="text-lg" />
            </Button>

            {/* Separator */}
            <Separator orientation="vertical" className="h-6 bg-gray-500" />

            {/* Tool Options */}
            <Button variant="default" size="icon" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleClick("Select")}>
              <FaMousePointer className="text-white text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("3D Model")}>
              <FaCubesStacked className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Measure")}>
              <FaRuler className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Cut")}>
              <FaCut className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Screenshot")}>
              <FaImage className="text-lg" />
            </Button>

            {/* 🔹 SETTINGS & SHARE */}
            <Separator orientation="vertical" className="h-6 bg-gray-500" />
            <Button variant="ghost" size="icon" onClick={() => handleClick("Home")}>
              <FaHome className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Share")}>
              <FaShareAlt className="text-lg" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleClick("Settings")}>
              <FaCog className="text-lg" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderViewer;
