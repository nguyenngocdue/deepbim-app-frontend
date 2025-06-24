import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIFCContext } from "@/context/ifc/ifc-context";

export default function GlobalInteractionHandler() {
  const { scene, camera, gl, raycaster } = useThree();
  const {
    toggleElementSelection,
    selectedElements,
    loadedModels,
    userHiddenElements,
    clearSelection,
  } = useIFCContext();

  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const DRAG_THRESHOLD = 5;

  useEffect(() => {
    if (!gl.domElement || !toggleElementSelection) return;
    // console.log("GlobalInteractionHandler: Attaching mouse event listeners.");

    const handleMouseDown = (event: MouseEvent) => {
      // console.log("GlobalInteractionHandler: Mouse down", event.clientX, event.clientY);
      mouseDownPos.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = (event: MouseEvent) => {
      // console.log("GlobalInteractionHandler: Mouse up", event.clientX, event.clientY);
      if (!mouseDownPos.current) {
        // console.log("GlobalInteractionHandler: Mouse up without mousedown recorded.");
        return;
      }
      const deltaX = Math.abs(event.clientX - mouseDownPos.current.x);
      const deltaY = Math.abs(event.clientY - mouseDownPos.current.y);
      mouseDownPos.current = null;
      if (deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) {
        // console.log("GlobalInteractionHandler: Click detected (within drag threshold).");
        const rect = gl.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        // console.log("GlobalInteractionHandler: Raycasting with mouse coords:", mouse.x, mouse.y);
        raycaster.setFromCamera(mouse, camera);
        const modelMeshGroups = scene.children.filter(
          (child) => child.name.startsWith("IFCModelGroup_") && child instanceof THREE.Group
        ) as THREE.Group[];
        if (modelMeshGroups.length === 0) {
          // console.log("GlobalInteractionHandler: No IFCModelGroup found in scene. Deselecting.");
          clearSelection();
          return;
        }
        // console.log(`GlobalInteractionHandler: Found ${modelMeshGroups.length} model groups for raycasting.`);
        const allIntersects = raycaster.intersectObjects(modelMeshGroups, true);
        const visibleIntersects = allIntersects.filter((intersect) => intersect.object.visible);
        // console.log(`GlobalInteractionHandler: Raycast allIntersects: ${allIntersects.length}, visibleIntersects: ${visibleIntersects.length}`);
        if (visibleIntersects.length > 0) {
          const firstIntersect = visibleIntersects[0].object;
          if (
            firstIntersect.userData &&
            firstIntersect.userData.expressID !== undefined &&
            firstIntersect.userData.modelID !== undefined
          ) {
            const clickedModelID = firstIntersect.userData.modelID;
            const clickedExpressID = firstIntersect.userData.expressID;
            const selectionInfo = {
              modelID: clickedModelID,
              expressID: clickedExpressID,
            };
            // console.log("GlobalInteractionHandler: Clicked on element:", selectionInfo);
            const additive = event.ctrlKey || event.metaKey;
            // console.log("GlobalInteractionHandler: Toggling selection:", selectionInfo, "additive", additive);
            toggleElementSelection(selectionInfo, additive);
          } else {
            // console.log("GlobalInteractionHandler: Clicked on object without valid IFC user data. Deselecting.");
            clearSelection();
          }
        } else {
          // console.log("GlobalInteractionHandler: Clicked on empty space. Deselecting.");
          clearSelection();
        }
      } else {
        // console.log("GlobalInteractionHandler: Drag detected (exceeded drag threshold). No selection change.");
      }
    };

    const canvasElement = gl.domElement;
    canvasElement.addEventListener("mousedown", handleMouseDown);
    canvasElement.addEventListener("mouseup", handleMouseUp);
    // console.log("GlobalInteractionHandler: Mouse event listeners attached.");
    return () => {
      // console.log("GlobalInteractionHandler: Removing mouse event listeners.");
      canvasElement.removeEventListener("mousedown", handleMouseDown);
      canvasElement.removeEventListener("mouseup", handleMouseUp);
      mouseDownPos.current = null;
    };
  }, [
    gl,
    camera,
    raycaster,
    toggleElementSelection,
    selectedElements,
    clearSelection,
    scene,
    loadedModels,
    userHiddenElements,
  ]);

  return null;
}