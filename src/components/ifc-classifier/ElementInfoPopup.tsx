import React from "react";
import clsx from "clsx";

type ElementInfo = {
  globalId?: string;
  name?: string;
  type_name?: string;
  type_value?: string;
};

type Props = {
  elementInfo: ElementInfo | null;
  position: { x: number; y: number };
};

const ElementInfoPopup: React.FC<Props> = ({ elementInfo, position }) => {
  if (!elementInfo) return null;

  return (
    <div
      className={clsx(
        "absolute z-50 w-[340px] rounded-lg border shadow-xl text-sm",
        "bg-accent text-gray-900 border-gray-200",                // light theme
        "dark:bg-zinc-950 dark:text-white dark:border-[#2A2F3A]" // dark theme
      )}
      style={{
        left: position.x + 16,
        top: position.y + 16,
        pointerEvents: "none",
      }}
    >
      {/* Header */}
      <div className={clsx(
        "px-4 py-2 text-xs font-semibold tracking-wide uppercase border-b",
        "text-gray-600 border-gray-200",
        "dark:text-zinc-400 dark:border-[#2A2F3A]"
      )}>
        Basic Information
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <InfoRow label="IFC Class" value={elementInfo.type_name} />
        <InfoRow label="Name" value={elementInfo.name} />
        <InfoRow label="Object Type" value={elementInfo.type_value} />
        <InfoRow label="Global ID" value={elementInfo.globalId} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{label}</span>
    <span className="text-sm text-right break-all text-gray-900 dark:text-white w-[180px]">{value || "-"}</span>
  </div>
);

export default ElementInfoPopup;
