import * as OBC from "@thatopen/components";
import { useEffect } from "react";
import * as THREE from 'three';

interface ViewPointProps {
  isFitView: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useSetViewPoint({
  isFitView,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: ViewPointProps) {

  useEffect(() => {
    if (!isFitView) return;
  
    const components = componentRef.current;
    const world = worldRef.current;
    const container = ifcContainerRef.current;
    const model = modelRef.current;
  
    if (!components || !world || !container || !model) {
      console.error("Invalid references");
      return;
    }
  
    world.camera.controls?.reset(true);
  
  }, [
    isFitView,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
  ]);
  

}
