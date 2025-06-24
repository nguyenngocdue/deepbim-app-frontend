import { useEffect, useFrame, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIFCContext, SelectedElementInfo } from "@/context/ifc/ifc-context";
import { forwardRef, useImperativeHandle } from "react";

// Define the layer for outlines
export const OUTLINE_SELECTION_LAYER = 10;

export function SpinningBox() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="magenta" />
    </mesh>
  );
}

export function GlobalInteractionHandler() {
  const { scene, camera, gl, raycaster } = useThree();
  const { toggleElementSelection, selectedElements, loadedModels, userHiddenElements, clearSelection } = useIFCContext();
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const DRAG_THRESHOLD = 5;

  useEffect(() => {
    if (!gl.domElement || !toggleElementSelection) return;
    console.log("GlobalInteractionHandler: Attaching mouse event listeners.");

    const handleMouseDown = (event: MouseEvent) => {
      console.log("GlobalInteractionHandler: Mouse down", event.clientX, event.clientY);
      mouseDownPos.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = (event: MouseEvent) => {
      console.log("GlobalInteractionHandler: Mouse up", event.clientX, event.clientY);
      if (!mouseDownPos.current) {
        console.log("GlobalInteractionHandler: Mouse up without mousedown recorded.");
        return;
      }

      const deltaX = Math.abs(event.clientX - mouseDownPos.current.x);
      const deltaY = Math.abs(event.clientY - mouseDownPos.current.y);
      mouseDownPos.current = null;

      if (deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) {
        console.log("GlobalInteractionHandler: Click detected (within drag threshold).");
        const rect = gl.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        console.log("GlobalInteractionHandler: Raycasting with mouse coords:", mouse.x, mouse.y);

        raycaster.setFromCamera(mouse, camera);
        const modelMeshGroups = scene.children.filter(
          (child) => child.name.startsWith("IFCModelGroup_") && child instanceof THREE.Group
        ) as THREE.Group[];

        if (modelMeshGroups.length === 0) {
          console.log("GlobalInteractionHandler: No IFCModelGroup found in scene. Deselecting.");
          clearSelection();
          return;
        }
        console.log(`GlobalInteractionHandler: Found ${modelMeshGroups.length} model groups for raycasting.`);

        const allIntersects = raycaster.intersectObjects(modelMeshGroups, true);
        const visibleIntersects = allIntersects.filter((intersect) => intersect.object.visible);
        console.log(`GlobalInteractionHandler: Raycast allIntersects: ${allIntersects.length}, visibleIntersects: ${visibleIntersects.length}`);

        if (visibleIntersects.length > 0) {
          const firstIntersect = visibleIntersects[0].object;
          if (firstIntersect.userData && firstIntersect.userData.expressID !== undefined && firstIntersect.userData.modelID !== undefined) {
            const clickedModelID = firstIntersect.userData.modelID;
            const clickedExpressID = firstIntersect.userData.expressID;
            const selectionInfo: SelectedElementInfo = {
              modelID: clickedModelID,
              expressID: clickedExpressID,
            };
            console.log("GlobalInteractionHandler: Clicked on element:", selectionInfo);
            const additive = event.ctrlKey || event.metaKey;
            console.log("GlobalInteractionHandler: Toggling selection:", selectionInfo, "additive", additive);
            toggleElementSelection(selectionInfo, additive);
          } else {
            console.log("GlobalInteractionHandler: Clicked on object without valid IFC user data. Deselecting.");
            clearSelection();
          }
        } else {
          console.log("GlobalInteractionHandler: Clicked on empty space. Deselecting.");
          clearSelection();
        }
      } else {
        console.log("GlobalInteractionHandler: Drag detected (exceeded drag threshold). No selection change.");
      }
    };

    const canvasElement = gl.domElement;
    canvasElement.addEventListener("mousedown", handleMouseDown);
    canvasElement.addEventListener("mouseup", handleMouseUp);
    console.log("GlobalInteractionHandler: Mouse event listeners attached.");

    return () => {
      console.log("GlobalInteractionHandler: Removing mouse event listeners.");
      canvasElement.removeEventListener("mousedown", handleMouseDown);
      canvasElement.removeEventListener("mouseup", handleMouseUp);
      mouseDownPos.current = null;
    };
  }, [gl, camera, raycaster, toggleElementSelection, selectedElements, clearSelection, scene, loadedModels, userHiddenElements]);

  return null;
}

export interface CameraActions {
  zoomToExtents: () => void;
  zoomToSelected: (selection: SelectedElementInfo | null) => void;
}

export const CameraActionsController = forwardRef<CameraActions, {}>((props, ref) => {
  const { scene, camera, controls, clock } = useThree();
  const animationRef = useRef<{
    active: boolean;
    startTime: number;
    duration: number;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
  } | null>(null);

  const startAnimation = (endPos: THREE.Vector3, endTarget: THREE.Vector3, duration = 0.75) => {
    if (!controls || !camera) return;
    animationRef.current = {
      active: true,
      startTime: clock.getElapsedTime(),
      duration,
      startPos: camera.position.clone(),
      endPos,
      startTarget: (controls as any).target.clone(),
      endTarget,
    };
  };

  useFrame(() => {
    if (!animationRef.current?.active || !controls || !camera) return;
    const anim = animationRef.current;
    const elapsedTime = clock.getElapsedTime() - anim.startTime;
    let progress = Math.min(elapsedTime / anim.duration, 1);
    progress = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(anim.startPos, anim.endPos, progress);
    (controls as any).target.lerpVectors(anim.startTarget, anim.endTarget, progress);
    camera.lookAt((controls as any).target);
    (controls as any).update();
    if (progress >= 1) {
      animationRef.current.active = false;
      camera.position.copy(anim.endPos);
      (controls as any).target.copy(anim.endTarget);
      camera.lookAt((controls as any).target);
      (controls as any).update();
    }
  });

  useImperativeHandle(ref, () => ({
    zoomToExtents: () => {
      console.log("CameraActionsController: zoomToExtents called for animation");
      const modelGroups = scene.children.filter(
        (child) => child.name.startsWith("IFCModelGroup_") && child instanceof THREE.Group
      ) as THREE.Group[];
      if (modelGroups.length === 0) return;

      const overallBbox = new THREE.Box3();
      modelGroups.forEach((group, index) => {
        index === 0 ? overallBbox.setFromObject(group) : overallBbox.expandByObject(group);
      });

      if (overallBbox.isEmpty()) {
        if (controls as any) (controls as any).reset?.();
        return;
      }

      const center = overallBbox.getCenter(new THREE.Vector3());
      const sphere = overallBbox.getBoundingSphere(new THREE.Sphere());
      const radius = sphere.radius;

      if (camera instanceof THREE.PerspectiveCamera) {
        const pCamera = camera as THREE.PerspectiveCamera;
        const fov = pCamera.fov * (Math.PI / 180);
        const aspect = pCamera.aspect;
        let distance = radius / Math.sin(fov / 2);
        const effectiveRadiusForHorizontalFit = radius / Math.sin(Math.atan(Math.tan(fov / 2) * aspect));
        distance = Math.max(distance, effectiveRadiusForHorizontalFit);
        distance *= 1.1;
        if (distance === 0 || !isFinite(distance) || distance < 0.1) distance = 10;

        const currentCamDir = new THREE.Vector3();
        pCamera