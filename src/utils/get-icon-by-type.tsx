import {
  FileText,
  FileVideo,
  FileAudio,
  File as DefaultIcon,
  FileArchive,
  FileCode2,
  FileSpreadsheet,
} from "lucide-react";
import { FaFileImage, FaFileWord, FaFilePdf } from "react-icons/fa";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { mapExtensionToType } from "@/utils/file-type";
import { Avatar } from "@/components/ui/avatar";

const iconMap: Record<string, { icon: any; color: string }> = {
  pdf:      { icon: FaFilePdf , color: "text-red-600" },
  image:    { icon: FaFileImage , color: "text-blue-400" },
  video:    { icon: FileVideo, color: "text-purple-400" },
  audio:    { icon: FileAudio, color: "text-pink-400" },
  note:     { icon: FileText, color: "text-green-600" },
  archive:  { icon: FileArchive, color: "text-yellow-600" },
  code:     { icon: FileCode2, color: "text-cyan-500" },
  excel:    { icon: FileSpreadsheet, color: "text-green-500" },
  word:     { icon: FaFileWord, color: "text-blue-500" },
  ifc:      { icon: '/images/ifc_icon.png', color: "text-gray-500" },
  other:    { icon: DefaultIcon, color: "text-gray-500" },  
};

export function getIconByType(type?: string, extension?: string, url?: string) {
  let finalType = type;
  if (finalType && extension) {
    finalType = mapExtensionToType(extension);
  }
  finalType = finalType?.toLowerCase() || "other";
  // Nếu là icon custom url (như ifc logo)
  const iconConfig = iconMap[finalType] || iconMap.other;
  const Icon = iconConfig.icon;
  if (typeof Icon === "string") {
    const fallback = iconConfig.icon ? iconConfig.icon.charAt(0).toUpperCase() : "?";
    return (
      <Avatar className='object-cover h-8 w-8'>
        <AvatarImage src={iconConfig.icon} />
        <AvatarFallback className="bg-muted text-primary font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    );
  }
  return <Icon className={`w-6 h-6 ${iconConfig.color}`} />;
}
