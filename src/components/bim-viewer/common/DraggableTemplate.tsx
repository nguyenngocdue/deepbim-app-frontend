import { useEffect, useRef, useState, ReactNode } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

interface DraggableTemplateProps {
  title?: string;
  children?: (isVertical: boolean) => ReactNode;
  initialPosition?: { x: number; y: number };
  hasDirection?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export default function DraggableTemplate({
  title = "",
  children,
  initialPosition = { x: 100, y: 100 },
  hasDirection = true,
  visible = true,
  onClose,
}: DraggableTemplateProps) {
  const nodeRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [ratio, setRatio] = useState({
    x: initialPosition.x / window.innerWidth,
    y: initialPosition.y / window.innerHeight,
  });

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    const clampedX = Math.max(0, Math.min(data.x, window.innerWidth - 100));
    const clampedY = Math.max(0, Math.min(data.y, window.innerHeight - 100));
    setPosition({ x: clampedX, y: clampedY });
    setRatio({
      x: clampedX / window.innerWidth,
      y: clampedY / window.innerHeight,
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: Math.min(window.innerWidth - 100, ratio.x * window.innerWidth),
        y: Math.min(window.innerHeight - 100, ratio.y * window.innerHeight),
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ratio]);

  if (!visible) return null;

  return (
    <Draggable
      handle=".drag-handle"
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
    >
      <div
        ref={nodeRef}
        className="fixed rounded-lg border-zinc-800 shadow-lg text-white text-sm overflow-auto border-lg"
        style={{ top: 0, left: 0 }}
      >
        {/* Header */}
        <div className="drag-handle flex justify-between items-center p-1 text-xs text-slate-300 cursor-move">
          <span className="truncate">{title}</span>
          <div className="flex justify-between items-center gap-1 ml-auto">
            {hasDirection && (
              <button
                onClick={() => setIsVertical((prev) => !prev)}
                className=""
                title="Toggle layout direction"
              >
                {isVertical ? "↔" : "↕"}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="px-2 text-sm rounded bg-red-600 hover:bg-red-500 text-white"
                title="Close"
              >
                ✕
              </button>
            )}
            <div className="p-2 max-h-[90vh] overflow-auto ">
              {children?.(isVertical)}
            </div>
          </div>
        </div>

      </div>
    </Draggable>
  );
}
