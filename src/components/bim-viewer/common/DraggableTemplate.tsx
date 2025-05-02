import { useRef, useState, ReactNode } from "react";
import Draggable from "react-draggable";

interface DraggableTemplateProps {
    title?: string;
    children: (isVertical: boolean) => ReactNode;
}

export default function DraggableTemplate({ title = "", children }: DraggableTemplateProps) {
    const nodeRef = useRef(null);
    const [isVertical, setIsVertical] = useState(false);

    return (
        <Draggable handle=".drag-handle" nodeRef={nodeRef}>
            <div
                ref={nodeRef}
                className="fixed top-10 left-10 z-50 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg overflow-auto max-h-[90vh]"
            >
                {/* Header kéo và nút đổi hướng */}
                <div className="drag-handle flex justify-between items-center px-2 py-1 bg-zinc-800 text-xs text-slate-300">
                    {title && <span>{title}</span>}
                    <button
                        onClick={() => setIsVertical((prev) => !prev)}
                        className="px-1 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600"
                    >
                        {isVertical ? "↔" : "↕"}
                    </button>
                    <div className="p-0.5 cursor-pointer">
                        {children(isVertical)}
                    </div>
                </div>

            </div>
        </Draggable>
    );
}
