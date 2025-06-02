import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseClippingPlanesProps {
  component: any;
  world: any;
  container: HTMLDivElement | null;
  model: THREE.Object3D | null;
  loading: boolean;
}

export function useClippingPlanes({
  component,
  world,
  container,
  model,
  loading,
}: UseClippingPlanesProps) {
  const initializedRef = useRef(false);
  const [activePlaneIndex, setActivePlaneIndex] = useState(-1);
  const planesRef = useRef<THREE.Plane[]>([]);
  const materialsRef = useRef<any[]>([]);
  const bboxRef = useRef<THREE.Box3 | null>(null);
  const baseConstantsRef = useRef<number[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const guiRef = useRef<GUI | null>(null);

  const init = useCallback(() => {
    if (!model || !world || !container || initializedRef.current) return;
    initializedRef.current = true;

    const scene = world.scene;
    const bbox = new THREE.Box3();
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.updateMatrixWorld(true);
        bbox.expandByObject(child);
      }
    });

    bboxRef.current = bbox;
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());

    baseConstantsRef.current = [
      -(bbox.max.x + 10), bbox.min.x - 10,
      -(bbox.max.y + 10), bbox.min.y - 10,
      -(bbox.max.z + 10), bbox.min.z - 10,
    ];

    const planes = [
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), baseConstantsRef.current[0]),
      new THREE.Plane(new THREE.Vector3(1, 0, 0), baseConstantsRef.current[1]),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), baseConstantsRef.current[2]),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), baseConstantsRef.current[3]),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), baseConstantsRef.current[4]),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), baseConstantsRef.current[5]),
    ];
    planesRef.current = planes;

    const planeHelpers = planes.map((plane, index) => {
      const helper = new THREE.PlaneHelper(plane, Math.max(size.x, size.y, size.z), 0xffff00);
      const pos = [bbox.max, bbox.min, bbox.max, bbox.min, bbox.max, bbox.min];
      const axis = [0, 0, 1, 1, 2, 2];
      const set = new THREE.Vector3().copy(center);
      set.setComponent(axis[index], pos[index].getComponent(axis[index]));
      helper.position.copy(set);
      scene.three.add(helper);
      return helper;
    });

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        const original = Array.isArray(mat) ? mat.map(m => m.clone()) : mat.clone();
        const applyClip = (m: THREE.Material) => {
          m = m.clone();
          Object.assign(m, {
            clippingPlanes: [],
            clipShadows: true,
            stencilWrite: true,
            stencilRef: 1,
            stencilZPass: THREE.ReplaceStencilOp,
            side: THREE.DoubleSide,
          });
          return m;
        };
        const clipping = Array.isArray(original) ? original.map(applyClip) : applyClip(original);
        (child as THREE.Mesh).material = clipping;
        materialsRef.current.push({ original, clipping });
      }
    });

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(2, 2, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x263238);
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const gui = new GUI();
    guiRef.current = gui;

    const folder = gui.addFolder("Clipping Control");
    folder.add({ activePlane: -1 }, "activePlane", {
      "None": -1,
      "X+": 0, "X-": 1, "Y+": 2, "Y-": 3, "Z+": 4, "Z-": 5,
    }).onChange((v: number) => setActivePlaneIndex(v));
    folder.open();

    planes.forEach((plane, index) => {
      const pFolder = gui.addFolder(`Plane ${["X+", "X-", "Y+", "Y-", "Z+", "Z-"][index]}`);
      pFolder.add(plane, "constant", -100, 100, 0.1).name("Position");
    });

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      gui.destroy();
      renderer.dispose();
      controls.dispose();
      scene.three.clear();
      planeHelpers.forEach(ph => scene.three.remove(ph));
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [model, component, world, container]);

  useEffect(() => {
    if (!loading) init();
  }, [init, loading]);

  useEffect(() => {
    const planes = activePlaneIndex === -1 ? [] : [planesRef.current[activePlaneIndex]];
    materialsRef.current.forEach(({ clipping }) => {
      if (Array.isArray(clipping)) {
        clipping.forEach((m) => {
          m.clippingPlanes = planes;
          m.needsUpdate = true;
        });
      } else {
        clipping.clippingPlanes = planes;
        clipping.needsUpdate = true;
      }
    });
  }, [activePlaneIndex]);
}
