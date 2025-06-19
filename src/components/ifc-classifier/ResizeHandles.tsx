import { PanelResizeHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface ResizeHandleHorizontalProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isLeftSide?: boolean;
}

export function ResizeHandleHorizontal({
  className,
  collapsed = false,
  onToggle,
  isLeftSide = false,
}: ResizeHandleHorizontalProps) {
  return (
    <PanelResizeHandle className={cn("w-2 flex items-center justify-center group transition-colors hover:bg-muted/80 active:bg-muted rounded cursor-col-resize", className)}>
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="w-0.5 h-8 bg-border group-hover:bg-muted-foreground/60 group-active:bg-muted-foreground/80 rounded-full transition-colors" />
        {onToggle && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center justify-center",
              "w-8 h-10 rounded-md cursor-pointer group/button",
              "hover:bg-muted/50 active:bg-muted/70",
              isLeftSide
                ? collapsed
                  ? "left-full"
                  : "right-full"
                : collapsed
                  ? "right-full"
                  : "left-full"
            )}
            title={collapsed ? "Expand panel" : "Collapse panel"}
          >
            <button
              className={cn(
                "rounded-full w-6 h-6 flex items-center justify-center",
                "bg-background border border-border shadow-sm group-hover/button:bg-muted group-hover/button:ring-2 group-hover/button:ring-ring transition-all",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              )}
            >
              {isLeftSide ? (
                collapsed ? <ChevronsRight className="w-3 h-3" /> : <ChevronsLeft className="w-3 h-3" />
              ) : (
                collapsed ? <ChevronsLeft className="w-3 h-3" /> : <ChevronsRight className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>
    </PanelResizeHandle>
  );
}

export function ResizeHandleVertical({ className }: { className?: string }) {
  return (
    <PanelResizeHandle className={cn("h-2 flex items-center justify-center group transition-colors hover:bg-muted/80 active:bg-muted rounded cursor-row-resize", className)}>
      <div className="h-0.5 w-8 bg-border group-hover:bg-muted-foreground/60 group-active:bg-muted-foreground/80 rounded-full transition-colors" />
    </PanelResizeHandle>
  );
}