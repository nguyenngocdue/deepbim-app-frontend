import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface OriginalWorldCameraProps {
  isOriginalWorldCamera: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export async function useOriginalWorldCamera({
  isOriginalWorldCamera,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: OriginalWorldCameraProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;


  if (isOriginalWorldCamera) {
    const viewpoints = components.get(OBC.Viewpoints);
    const viewpoint = viewpoints.create(world, { title: "My Viewpoint" }); // You can set an optional title for UI purposes
  
    // const updateViewpointCamera = async () => {
    //   console.log("Position before updating", viewpoint.position);
    //   viewpoint.updateCamera();
    //   console.log("Position after updating", viewpoint.position);
    // };
    // updateViewpointCamera()

    const setWorldCamera = async () => {
      const initialPosition = new THREE.Vector3();
      world.camera.controls.getPosition(initialPosition);
      console.log("Camera position before updating", initialPosition);
      await viewpoint.go(world);
      const finalPosition = new THREE.Vector3();
      world.camera.controls.getPosition(finalPosition);
      console.log("Camera position before updating", finalPosition);
    };
    setWorldCamera()

    viewpoint.selectionComponents.add(
      "2idC0G3ezCdhA9WVjWe",
      "2idC0G3ezCdhA9WVjWe$Pp",
    );

    const walls = await model.getAllPropertiesOfType(WEBIFC.IFCWALLSTANDARDCASE);
    if (walls) {
      const expressIDs = Object.values(walls).map((attrs) => attrs.expressID);
      const fragmentIdMap = model.getFragmentMap(expressIDs);
      viewpoint.addComponentsFromMap(fragmentIdMap);
    }

    const reportComponents = () => {
      const selectionGuids = viewpoint.selectionComponents;
      const selectionFragmentIdMap = viewpoint.selection;
      console.log(selectionGuids, selectionFragmentIdMap);
    };
    reportComponents()
    
    
  }
}
