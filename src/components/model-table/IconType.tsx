import { LucideGitPullRequestCreateArrow } from "lucide-react";
import { TiArrowMoveOutline } from "react-icons/ti";
import { LuPencil, LuTrash2, LuLogIn, LuLogOut, LuArrowLeft } from "react-icons/lu";
import { BiSolidShow } from "react-icons/bi";
import { TbAdjustmentsCancel } from "react-icons/tb";
import { FaRegPaperPlane } from "react-icons/fa"; // dùng cho apply

export const renderIcon = (iconType: string) => {
  switch (iconType) {
    case "create":
      return <LucideGitPullRequestCreateArrow className="h-5 w-5 text-green-400 dark:text-green-300" />;
    case "move":
      return <TiArrowMoveOutline className="h-5 w-5 text-cyan-400 dark:text-cyan-300" />;
    case "edit":
    case "update":
      return <LuPencil className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />;
    case "delete":
      return <LuTrash2 className="h-5 w-5 text-red-400 dark:text-red-300" />;
    case "view":
      return <BiSolidShow className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />;
    case "cancel":
      return <TbAdjustmentsCancel className="h-5 w-5 text-gray-400 dark:text-gray-300" />;
    case "apply":
      return <FaRegPaperPlane className="h-5 w-5 text-emerald-400 dark:text-emerald-300" />;
    case "signin":
      return <LuLogIn className="h-5 w-5 text-orange-400 dark:text-orange-300" />;
    case "signout":
      return <LuLogOut className="h-5 w-5 text-rose-400 dark:text-rose-300" />;
    case "back":
      return <LuArrowLeft className="h-5 w-5 text-slate-400 dark:text-slate-300" />;
    default:
      return null;
  }
};
