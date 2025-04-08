import React from "react";

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
      <ul className="text-sm p-2 space-y-1 w-48 font-medium">
        {[
          { label: "Show all elements", action: "showAll" },
          { label: "Isolate", action: "isolate" },
          { label: "Hide", action: "hide" },
          { label: "Hide by category", action: "hideByCategory" },
          { label: "Focus", action: "focus" },
          { label: "Properties", action: "properties" },
        ].map((item) => (
          <li
            key={item.action}
            onClick={() => {
              onAction(item.action);
              onClose();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
