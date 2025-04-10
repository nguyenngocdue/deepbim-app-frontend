import { addAxesWithTextLabelsToScene, removeAxesWithTextLabelsFromScene } from "@/lib/AxesUtils";
import { useEffect, useRef } from "react";

interface UseCoordinateSystemProps {
  coordinateSysActive: boolean;
  worldRef: React.RefObject<any>;
}

export function useCoordinateSystem({
  coordinateSysActive,
  worldRef,
}: UseCoordinateSystemProps): void {
  const axesRef = useRef<any>(null); // Dùng useRef để lưu trữ các đối tượng đã thêm vào

  const world = worldRef.current;
  useEffect(() => {
    if (coordinateSysActive && worldRef.current) {
      // Thêm trục tọa độ và nhãn vào scene
      axesRef.current = addAxesWithTextLabelsToScene(world);
    } else if (axesRef.current && worldRef.current) {
      // Xóa các đối tượng khi không còn cần thiết
      world.scene.three.remove(axesRef.current);
      axesRef.current = null; // Đảm bảo dọn dẹp bộ nhớ
    }
    if(!coordinateSysActive){
      removeAxesWithTextLabelsFromScene(world);
    }
  }, [coordinateSysActive, worldRef]);
}
