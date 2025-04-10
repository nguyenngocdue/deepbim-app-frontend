import { createBoundingBoxMesh } from "@/lib/BoudingBox";
import { GetFragmentsGroup } from "@/lib/FragmentUtils";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three';
import * as FreeformControls from 'three-freeform-controls';
import { EVENTS } from 'three-freeform-controls';
import * as OBCF from "@thatopen/components-front";

interface FreeControlElementsProps {
  isFreeControlElements: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useFreeControlElements({
  isFreeControlElements,
  componentRef,
  worldRef,
  ifcContainerRef,
}: FreeControlElementsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  if (!isFreeControlElements) return;
  if (!components || !world || !container) return;

  const fragmentsGroup = GetFragmentsGroup(world)
  if (!fragmentsGroup) return;

  const highlighter = components.get(OBCF.Highlighter);
  highlighter.enabled = false;
  highlighter.zoomToSelection = false;

  const allControls: THREE.Object3D[] = [];


  // Store original world-space transforms
  const originalTransforms = new Map<THREE.Object3D, {
    position: THREE.Vector3;
    rotation: THREE.Quaternion;
    scale: THREE.Vector3;
  }>();

  fragmentsGroup!.traverse((child) => {
    if (child instanceof THREE.Object3D) {
      child.updateMatrixWorld(true);
      originalTransforms.set(child, {
        position: child.getWorldPosition(new THREE.Vector3()),
        rotation: child.getWorldQuaternion(new THREE.Quaternion()),
        scale: child.getWorldScale(new THREE.Vector3())
      });
    }
  });

  fragmentsGroup!.updateMatrixWorld(true);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Initialize the Freeform Controls Manager
  const controlsManager = new FreeformControls.ControlsManager(
    world.camera.three,
    container
  );
  world.scene.three.add(controlsManager);

  // Disable orbit controls while dragging
  controlsManager.listen(EVENTS.DRAG_START, () => {
    world.camera.controls.enabled = false;
  });
  controlsManager.listen(EVENTS.DRAG_STOP, () => {
    world.camera.controls.enabled = true;
  });

  // Handle click interaction
  const handleDbClick = (event: MouseEvent) => {
    if (!world.camera.three) return;

    // Convert mouse position to normalized device coordinates (NDC)
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, world.camera.three);
    const intersects = raycaster.intersectObjects(fragmentsGroup!.children, true);

    if (intersects.length === 0) return;

    const selectedMesh = intersects[0].object as THREE.Mesh;

    // Calculate the mesh's center in world coordinates
    const box = new THREE.Box3().setFromObject(selectedMesh);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Create a proxy object at the mesh's center
    const proxy = new THREE.Object3D();
    proxy.name = "Proxy"; // For easier tracking later
    proxy.position.copy(center);
    world.scene.three.add(proxy);

    // Convert mesh position to local space of the proxy
    selectedMesh.updateMatrixWorld(true);
    selectedMesh.position.sub(center);
    proxy.add(selectedMesh);

    // Attach transform controls to the proxy
    const controls = controlsManager.anchor(proxy, {
      hideOtherHandlesOnDrag: true,
      showHelperPlane: true,
      highlightAxis: true,
      snapTranslation: { x: true, y: true, z: true },
    });
    //Customer color
    applyGizmoColors(controls)
    controls.updateMatrixWorld(true);
    controls.visible = true;
    allControls.push(controls);
  };

  // Listen for Delete key to reset all controlled objects to original transform
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Delete") {
      controlsManager.destroy();

      originalTransforms.forEach((transform, object) => {
        const parent = object.parent;

        // Step 1: Remove object from proxy and reattach to original model if needed
        if (parent && parent.name === "Proxy") {
          parent.remove(object);
          fragmentsGroup!.add(object);
        }

        if (!object.parent) return;

        // Step 2: Convert world transform back to local space of the current parent
        const localPosition = transform.position.clone();
        const localQuaternion = transform.rotation.clone();
        const localScale = transform.scale.clone();

        object.parent.worldToLocal(localPosition);

        // Step 3: Apply original transform
        object.position.copy(localPosition);
        object.quaternion.copy(localQuaternion);
        object.scale.copy(localScale);
        object.updateMatrixWorld(true);
      });

      console.log("All objects reset to their original world transforms.");
    }
    if (event.key.toLowerCase() === "h") {
      allControls.forEach(ctrl => (ctrl.visible = false));
    }
    if (event.key.toLowerCase() === "v") {
      allControls.forEach(ctrl => (ctrl.visible = true));
    }
  };

  // Listen for click events to trigger control anchoring
  window.addEventListener("dblclick", handleDbClick);
  window.addEventListener("keydown", handleKeyDown);

  // Cleanup event listeners when the component unmounts
  return () => {
    window.removeEventListener("click", handleDbClick);
    window.removeEventListener("keydown", handleKeyDown);
  };
}

function applyGizmoColors(controls: any) {
  // Arrows
  controls.translationXP.setColor('#e74c3c'); // Red
  controls.translationYN.setColor('#27ae60'); // Green
  controls.translationZP.setColor('#2980b9'); // Blue

  // Rings
  controls.rotationX.setColor('#ff9f43');     // Orange
  controls.rotationY.setColor('#f1c40f');     // Yellow
  controls.rotationZ.setColor('#9b59b6');     // Purple

  // Hide XY plane
  controls.pickPlaneXY.visible = false;
}



