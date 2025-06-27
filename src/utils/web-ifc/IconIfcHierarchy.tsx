import React, { JSX } from "react";
import {
  FileText,
  Landmark,
  Building,
  LayersIcon,
  Cuboid,
  HelpCircle,
} from "lucide-react";

type IfcIconProps = {
  type: string;
  isRootModelNode?: boolean;
  className?: string;
};

const IconIfcHierarchy: React.FC<IfcIconProps> = ({ type, isRootModelNode = false, className = "w-4 h-4 mr-2" }) => {
  if (isRootModelNode) {
    return <FileText className={`${className} text-sky-500`} />;
  }

  const iconMap: { keyword: string; icon: JSX.Element }[] = [
    { keyword: "IfcProject", icon: <Landmark className={`${className} text-purple-500`} /> },
    { keyword: "IfcSite", icon: <Landmark className={`${className} text-orange-500`} /> },
    { keyword: "IfcBuilding", icon: <Building className={`${className} text-blue-500`} /> },
    { keyword: "IfcBuildingStorey", icon: <LayersIcon className={`${className} text-green-500`} /> },
    { keyword: "IfcSpace", icon: <Cuboid className={`${className} text-teal-400`} /> },
    { keyword: "IfcWall", icon: <Cuboid className={`${className} text-gray-400`} /> },
    { keyword: "IfcSlab", icon: <Cuboid className={`${className} text-gray-400`} /> },
    { keyword: "IfcBeam", icon: <Cuboid className={`${className} text-gray-400`} /> },
    { keyword: "IfcColumn", icon: <Cuboid className={`${className} text-gray-400`} /> },
    { keyword: "IfcElement", icon: <Cuboid className={`${className} text-gray-400`} /> },
    { keyword: "IfcProxy", icon: <Cuboid className={`${className} text-gray-400`} /> },
  ];

  for (const entry of iconMap) {
    if (type.includes(entry.keyword)) {
      return entry.icon;
    }
  }

  return <HelpCircle className={`${className} text-zinc-400`} />;
};

export default IconIfcHierarchy;
