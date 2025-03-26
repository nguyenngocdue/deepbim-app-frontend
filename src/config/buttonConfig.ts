import FreeControlElements from "@/components/bim-viewer/FreeControlElements";
import { MdOutlineControlCamera } from "react-icons/md";

// buttonConfig.ts
export const buttonConfig = [
    {
      id: "camera-setting",
      icon: "<MdOutlineGpsFixed />",
      label: "Perspec",
      toggleKey: "isOrthoPerspective",
      Component: FreeControlElements,
    }
  ];