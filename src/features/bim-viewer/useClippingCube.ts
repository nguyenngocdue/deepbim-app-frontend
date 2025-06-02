import { modelManager } from "@/services/ModelManager";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

interface UseClippingCubeParams {
  scene?: THREE.Scene;
  renderer?: THREE.WebGLRenderer;
  camera?: THREE.Camera;
  container?: HTMLDivElement;
  enabled: boolean;
}

function isClonableMaterial(mat: any): mat is THREE.Material {
  return mat && typeof mat.clone === "function";
}

function applyClippingMaterialSafe(mat: any, planes: THREE.Plane[]): THREE.Material {
  if (!isClonableMaterial(mat)) return mat;

  let cloned: THREE.Material;
  try {
    cloned = mat.clone();
  } catch {
    return mat;
  }

  cloned.clippingPlanes = planes;
  cloned.clipShadows = true;
  cloned.side = THREE.FrontSide; // ensures backface is not shown
  cloned.stencilWrite = false; // disable stencil
  cloned.transparent = true;
  cloned.depthWrite = true;

  return cloned;
}

export function useClippingCube({ scene, renderer, camera, container, enabled }: UseClippingCubeParams) {
  const [activePlaneIndex, setActivePlaneIndex] = useState(-1);
  const planesRef = useRef<THREE.Plane[]>([]);
  const materialsRef = useRef<any[]>([]);
  const guiRef = useRef<GUI | null>(null);
  const model = modelManager.getModel();

  useEffect(() => {
    if (!enabled || !scene || !renderer || !camera || !container || !model) return;

    const bbox = new THREE.Box3().setFromObject(model.object);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());

    const planes = [
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), -bbox.max.x),
      new THREE.Plane(new THREE.Vector3(1, 0, 0), bbox.min.x),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), -bbox.max.y),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), bbox.min.y),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), -bbox.max.z),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), bbox.min.z),
    ];
    planesRef.current = planes;

    const helpers = planes.map((plane, index) => {
      const helper = new THREE.PlaneHelper(plane, Math.max(size.x, size.y, size.z), 0xff0000);
      scene.add(helper);
      return helper;
    });

    const resultMaterials: any[] = [];
    model.object.traverse((child: any) => {
      if (!child.isMesh || !child.material) return;
      const original = Array.isArray(child.material) ? child.material : [child.material];
      const valid = original.filter(isClonableMaterial);
      if (valid.length === 0) return;
      const clipped = valid.map(mat => applyClippingMaterialSafe(mat, []));
      
      child.material = Array.isArray(child.material) ? clipped : clipped[0];
      resultMaterials.push({ original, clipping: clipped });
    });
    materialsRef.current = resultMaterials;
    renderer.localClippingEnabled = true;

    const gui = new GUI();
    guiRef.current = gui;
    const clipFolder = gui.addFolder("Clipping Planes");
    clipFolder.add({ activePlane: -1 }, "activePlane", {
      None: -1,
      "X+": 0,
      "X-": 1,
      "Y+": 2,
      "Y-": 3,
      "Z+": 4,
      "Z-": 5,
    }).name("Active Plane").onChange((value: number) => setActivePlaneIndex(value));

    planes.forEach((plane, index) => {
      const folder = gui.addFolder(`Plane ${["X+", "X-", "Y+", "Y-", "Z+", "Z-"][index]}`);
      folder.add(plane, "constant", -500, 500, 0.1).name("Position");
      folder.add(helpers[index], "visible").name("Show Helper");
    });
    clipFolder.open();

    return () => {
      gui.destroy();
      helpers.forEach(h => scene.remove(h));
    };
  }, [enabled, model, scene, renderer, camera, container]);

  useEffect(() => {
    if (!enabled) return;
    const plane = activePlaneIndex >= 0 ? planesRef.current[activePlaneIndex] : null;
    materialsRef.current.forEach(({ clipping }) => {
      clipping.forEach((mat: THREE.Material) => {
        mat.clippingPlanes = plane ? [plane] : [];
        mat.needsUpdate = true;
      });
    });
  }, [enabled, activePlaneIndex]);

  return {
    activePlaneIndex,
    setActivePlaneIndex,
    planes: planesRef.current,
  };
}
