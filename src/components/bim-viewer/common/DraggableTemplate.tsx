import { useEffect, useRef, useState, ReactNode } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

interface DraggableTemplateProps {
  title?: string;
  children?: (isVertical: boolean) => ReactNode;
  initialPosition?: { x: number; y: number };
  hasDirection?: boolean;
}

export default function DraggableTemplate({
  title = "",
  children,
  initialPosition = { x: 100, y: 100 },
  hasDirection = true,
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

  return (
    <Draggable
      handle=".drag-handle"
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
    >
      <div
        ref={nodeRef}
        className="fixed rounded-lg border border-zinc-800 shadow-lg " //overflow-auto max-h-[90vh]
        style={{ top: 0, left: 0 }}
      >
        {/* Header */}
        <div className="drag-handle flex justify-between items-center p-2 bg-zinc-800 text-xs text-slate-300">
          {title && <span>{title}</span>}
          <div className="flex items-center gap-1">
            {hasDirection && (
              <button
                onClick={() => setIsVertical((prev) => !prev)}
                className="px-1 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                {isVertical ? "↔" : "↕"}
              </button>
            )}
            <div>
                {children?.(isVertical)}
            </div>
          </div>
        </div>

      </div>
    </Draggable>
  );
}
