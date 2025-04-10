import * as OBC from "@thatopen/components";
import { useEffect } from "react";

interface ViewPointProps {
  isFitView: boolean;
  worldRef: React.RefObject<OBC.World | null>;
}

export function useSetViewPoint({
  isFitView,
  worldRef,
}: ViewPointProps) {

  useEffect(() => {
    if (!isFitView || !worldRef.current) return;
    const world = worldRef.current;
    world.camera.controls?.reset(true);
  
  }, [
    isFitView,
    worldRef,
  ]);
  

}
