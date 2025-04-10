import { useEffect, useState } from "react";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  // Hide context menu on any left click
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) setContextMenu(null);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // Show context menu at mouse position
  const openContextMenu = (
    event: React.MouseEvent,
    container: HTMLDivElement | null
  ) => {
    event.preventDefault();
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setContextMenu({ x, y });
  };

  return {
    contextMenu,
    setContextMenu,
    openContextMenu,
  };
}
