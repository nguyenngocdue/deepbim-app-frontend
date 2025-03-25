// src/features/bim-viewer/useIfcLoader.ts
import * as THREE from 'three';
import * as OBC from "@thatopen/components";

interface UseIfcLoaderProps {
    worldRef: React.RefObject<any>;
    componentRef: React.RefObject<OBC.Components | null>;
    modelRef: React.RefObject<THREE.Object3D | null>;
    boxHelperRef: React.RefObject<THREE.BoxHelper | null>;
  }
  
  export async function useIfcLoader({
    worldRef,
    componentRef,
    modelRef,
    boxHelperRef,
  }: UseIfcLoaderProps): Promise<void> {

    if (!componentRef.current) return;
  
    try {
      const ifcLoader = componentRef.current?.get(OBC.IfcLoader);
      await ifcLoader.setup();
  
      // const response = await fetch("/ifc/231017_Test_Sprinkler_R24.ifc");
      // const response = await fetch("/ifc/Equipment.ifc");
      const response = await fetch("/ifc/small.ifc");
      // const response = await fetch("/ifc/Archicad.ifc");
      // const response = await fetch("/ifc/Model_R24.ifc");
      // const response = await fetch("/ifc/road_3.ifc");
      if (!response.ok) throw new Error("Can't upload IFC");
      const buffer = await response.arrayBuffer();
      const model = await ifcLoader.load(new Uint8Array(buffer));
  
      modelRef.current = model;
      worldRef.current.scene.three.add(model);
  
      if (boxHelperRef.current) {
        worldRef.current.scene.three.remove(boxHelperRef.current);
      }
    } catch (error) {
      console.error("Error loading IFC:", error);
    }
  }
  