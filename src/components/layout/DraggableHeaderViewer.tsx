import { useRef, useState } from "react";
import Draggable from "react-draggable";
import HeaderViewer from "./HeaderViewer";

export default function DraggableHeaderViewer({
  onToggle,
  onToggleTheme,
  currentTheme,
  handleFileSelect,
  navigationMode,
  onModelReady,
  states,
}: any) {
  const nodeRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);

  return (
    <Draggable handle=".drag-handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className="fixed top-10 left-10 z-50 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg overflow-auto"
      >
        {/* Thanh kéo + nút đổi hướng */}
        <div className="drag-handle flex justify-between items-center px-2 py-1 bg-zinc-800 text-xs text-slate-300">
          <button
            onClick={() => setIsVertical((prev) => !prev)}
            className=" px-1 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            {isVertical ? "↔" : "↕"}
          </button>
        {/* Nội dung */}
        <HeaderViewer
          onToggle={onToggle}
          onToggleTheme={onToggleTheme}
          currentTheme={currentTheme}
          handleFileSelect={handleFileSelect}
          navigationMode={navigationMode}
          onModelReady={onModelReady}
          isVertical={isVertical} // thêm prop này
          {...states}
        />
        </div>

      </div>
    </Draggable>
  );
}
