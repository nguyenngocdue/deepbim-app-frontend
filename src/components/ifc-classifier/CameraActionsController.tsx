import { forwardRef, useImperativeHandle, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SelectedElementInfo } from "./viewer";

export interface CameraActions {
  zoomToExtents: () => void;
  zoomToSelected: (selection: SelectedElementInfo | null) => void;
}

const CameraActionsController = forwardRef<CameraActions, {}>((props, ref) => {
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

  const startAnimation = (
    endPos: THREE.Vector3,
    endTarget: THREE.Vector3,
    duration = 0.75
  ) => {
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
        pCamera.getWorldDirection(currentCamDir);
        let newCamPos: THREE.Vector3;
        if (
          Math.abs(currentCamDir.y) > 0.9 ||
          Math.abs(currentCamDir.dot(new THREE.Vector3(0, 0, 1))) < 0.1
        ) {
          newCamPos = new THREE.Vector3(
            center.x + distance * 0.707,
            center.y + distance * 0.707,
            center.z + distance * 0.707
          );
        } else {
          newCamPos = center.clone().add(currentCamDir.multiplyScalar(-distance));
        }
        startAnimation(newCamPos, center.clone());
        console.log("CameraActionsController: Zoom to extents (fit sphere) animation started.");
      } else {
        console.warn("CameraActionsController: Camera is not PerspectiveCamera for zoomToExtents.");
      }
    },
    zoomToSelected: (selection: SelectedElementInfo | null) => {
      console.log("CameraActionsController: zoomToSelected called with", selection);
      if (!selection || !(camera instanceof THREE.PerspectiveCamera)) return;
      let selectedMesh: THREE.Mesh | null = null;
      scene.traverse((object) => {
        if (selectedMesh) return;
        if (
          object instanceof THREE.Mesh &&
          object.userData.modelID === selection.modelID &&
          object.userData.expressID === selection.expressID
        ) {
          selectedMesh = object;
        }
      });
      if (!selectedMesh) return;
      const bbox = new THREE.Box3().setFromObject(selectedMesh);
      const center = bbox.getCenter(new THREE.Vector3());
      const sphere = bbox.getBoundingSphere(new THREE.Sphere());
      const radius = sphere.radius;
      const pCamera = camera as THREE.PerspectiveCamera;
      const fov = pCamera.fov * (Math.PI / 180);
      const aspect = pCamera.aspect;
      let distance = radius / Math.sin(fov / 2);
      const effectiveRadiusForHorizontalFit = radius / Math.sin(Math.atan(Math.tan(fov / 2) * aspect));
      distance = Math.max(distance, effectiveRadiusForHorizontalFit);
      distance *= 1.5;
      if (distance === 0 || !isFinite(distance) || distance < 0.1) distance = 5;
      if (distance < pCamera.near * 2) distance = pCamera.near * 2 + radius;
      const currentCamDir = new THREE.Vector3();
      pCamera.getWorldDirection(currentCamDir);
      const newCamPos = center.clone().add(currentCamDir.multiplyScalar(-distance));
      startAnimation(newCamPos, center.clone());
      console.log("CameraActionsController: Zoom to selected (fit sphere) animation started.");
    },
  }));

  return null;
});

CameraActionsController.displayName = "CameraActionsController";

export default CameraActionsController;