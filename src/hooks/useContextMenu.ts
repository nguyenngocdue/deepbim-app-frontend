import { useEffect, useState } from "react";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  // Đóng khi click bên ngoài, resize, scroll
  useEffect(() => {
    const handle = () => setContextMenu(null);
    window.addEventListener("click", handle);
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("click", handle);
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, []);

  // Hàm mở menu tại vị trí chuột
  const openContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    // Giả sử menu 220x320px, bạn chỉnh theo chiều menu thật sự của bạn
    const menuWidth = 220, menuHeight = 320;
    let x = event.clientX, y = event.clientY;
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 4;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 4;
    setContextMenu({ x, y });
  };

  return { contextMenu, setContextMenu, openContextMenu };
}
