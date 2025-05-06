import React from "react";
import { MdApps } from "react-icons/md";
import { BiBorderInner } from "react-icons/bi";
import { VscEyeClosed } from 'react-icons/vsc';
import { FiMaximize } from 'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { GrFormViewHide } from "react-icons/gr";
import { MdOutlineHideSource } from "react-icons/md";
import { TbSquareToggle } from "react-icons/tb";
import { BsToggle2Off } from "react-icons/bs";

interface ContextMenuProps {
  x: number;
  y: number;
  onAction: (action: string) => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onAction, onClose }) => {
  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg border text-green-900"
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ul className="text-sm p-2 space-y-1 w-48">
        {[
          { icon: <MdApps/>, label: "Show all elements", action: "showAll" },
          { icon: <TbSquareToggle />, label: "Toggle Last Hidden", action: "onToggleVisibility" },
          { icon: <BsToggle2Off  />, label: "Toggle Elements", action: "onToggleElements" },
          { icon: <BiBorderInner />, label: "Isolate", action: "isolate" },
          { icon: <GrFormViewHide/>, label: "Isolate by Category", action: "onIsolateByIFCCate" },
          { icon: <VscEyeClosed />, label: "Hide", action: "hide" },
          { icon: <MdOutlineHideSource/>, label: "Hide by Category", action: "hideByIFCType" },
          { icon: <FiMaximize/>, label: "Focus on selection", action: "focusSelection" },
          { icon: <AiOutlineInfoCircle/>, label: "Properties", action: "onShowProperties" },
        ].map((item) => (
          <li
            key={item.action}
            onClick={() => {
              onAction(item.action);
              onClose();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
