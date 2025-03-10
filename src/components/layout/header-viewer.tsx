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
} from "react-icons/fa";
import { FaCubesStacked } from "react-icons/fa6";

const HeaderViewer = () => {
  // Event handlers
  const handleClick = (action: string) => {
    console.log(`Clicked on: ${action}`);
  };

  return (
    <header className="absolute top-0 left-10 w-[60%] bg-black/50 backdrop-blur-md text-white px-6 py-2 shadow-md flex items-center">
      {/* 🔹 Wrapper (Ensures full-width background) */}
      <div className="flex items-center w-full justify-between">
        {/* 🔹 LOGO */}
        <div className="text-xl font-bold text-purple-500 flex items-center gap-2">
          <FaCubes />
          DeepBIM
          <span className="text-xs text-gray-400">Powered by Nissan</span>
        </div>

        {/* 🔹 NAVIGATION & TOOLS (All aligned left) */}
        <div className="flex items-center gap-4 flex-grow">
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
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="icon" onClick={() => handleClick("Share")}>
            <FaShareAlt className="text-lg" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleClick("Settings")}>
            <FaCog className="text-lg" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderViewer;
