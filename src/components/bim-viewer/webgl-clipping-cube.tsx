import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { useIfcLoader } from "@/hooks/use-ifc-loader";
import LoadingSpinner from "./LoadingSpinner";

const WebglClippingCube: React.FC = () => {
  const initializedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ifcContainerRef, loadIfc, loading, ifcWorldRef, model } = useIfcLoader();

  const [activePlaneIndex, setActivePlaneIndex] = useState(-1);
  const planesRef = useRef<THREE.Plane[]>([]);
  const materialsRef = useRef<any[]>([]);
  const bboxRef = useRef<THREE.Box3 | null>(null);
  const baseConstantsRef = useRef<number[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const guiRef = useRef<GUI | null>(null);

    let planes: THREE.Plane[];
    let planeHelpers: THREE.PlaneHelper[];

  const initThreeJS = useCallback(() => {
    if (!model || !ifcWorldRef.current || initializedRef.current) return;

    initializedRef.current = true;
    const scene = ifcWorldRef.current.scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(2, 2, 2);

    // Lighting
    scene.three.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.three.add(dirLight);

    /// 🔹 Compute Bounding Box
    const bbox = new THREE.Box3();
    model.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundingBox();
            child.updateMatrixWorld(true);
            bbox.expandByObject(child);
        }
    });
    bboxRef.current = bbox;
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());

    // 🟢 Define base constants for planes
    baseConstantsRef.current = [
        -(bbox.max.x + 10),  // X+
        bbox.min.x - 10,     // X-
        -(bbox.max.y + 10),  // Y+
        bbox.min.y - 10,     // Y-
        -(bbox.max.z + 10),  // Z+
        bbox.min.z - 10      // Z-
    ];

    // 🟢 Create clipping planes
    planes = [
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), baseConstantsRef.current[0]), // X+
        new THREE.Plane(new THREE.Vector3(1, 0, 0), baseConstantsRef.current[1]),  // X-
        new THREE.Plane(new THREE.Vector3(0, -1, 0), baseConstantsRef.current[2]), // Y+
        new THREE.Plane(new THREE.Vector3(0, 1, 0), baseConstantsRef.current[3]),  // Y-
        new THREE.Plane(new THREE.Vector3(0, 0, -1), baseConstantsRef.current[4]), // Z+
        new THREE.Plane(new THREE.Vector3(0, 0, 1), baseConstantsRef.current[5])   // Z-
    ];
    planesRef.current = planes;

    // 🔹 Create PlaneHelpers
    planeHelpers = planes.map((plane, index) => {
        const helperSize = Math.max(size.x, size.y, size.z); // Ensure large enough size
        const helper = new THREE.PlaneHelper(plane, helperSize, 0xffff00); // Red color for visibility

        switch (index) {
            case 0: helper.position.set(bbox.max.x, center.y, center.z); break; // X+
            case 1: helper.position.set(bbox.min.x, center.y, center.z); break; // X-
            case 2: helper.position.set(center.x, bbox.max.y, center.z); break; // Y+
            case 3: helper.position.set(center.x, bbox.min.y, center.z); break; // Y-
            case 4: helper.position.set(center.x, center.y, bbox.max.z); break; // Z+
            case 5: helper.position.set(center.x, center.y, bbox.min.z); break; // Z-
        }

        return helper;
    });

    planeHelpers.forEach((ph) => {
        ph.visible = true;
        scene.three.add(ph);
    });
    
    console.log(model);
    // 🔹 Handle Materials and Clipping
        materialsRef.current = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
        
            const originalMaterial = Array.isArray(child.material)
                ? child.material.map(mat => mat.clone())
                : child.material.clone();
        
            const applyClipping = (mat: THREE.Material) => {
                mat = mat.clone();
                Object.assign(mat, {
                    clippingPlanes: [],
                    clipShadows: true,
                    stencilWrite: true,
                    stencilRef: 1,
                    stencilZPass: THREE.ReplaceStencilOp,
                    side: THREE.DoubleSide
                });
                return mat;
            };
        
            const clippingMaterial = Array.isArray(originalMaterial)
                ? originalMaterial.map(applyClipping)
                : applyClipping(originalMaterial);
        
            child.material = clippingMaterial;
        
            materialsRef.current.push({
                original: originalMaterial,
                clipping: Array.isArray(clippingMaterial) ? clippingMaterial[0] : clippingMaterial
            });
        });

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      stencil: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x263238);
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    renderer.autoClearStencil = false;
    ifcContainerRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 100;
    controlsRef.current = controls;

    // GUI setup
    const gui = new GUI();
    guiRef.current = gui;

    const clippingFolder = gui.addFolder('Clipping Control');
    clippingFolder.add({ activePlane: -1 }, 'activePlane', {
      'None': -1,
      'X+ (Right)': 0,
      'X- (Left)': 1,
      'Y+ (Top)': 2,
      'Y- (Bottom)': 3,
      'Z+ (Back)': 4,
      'Z- (Front)': 5,
    })
    .name('Active Plane')
    .onChange((value: number) => setActivePlaneIndex(value));
    clippingFolder.open();

    planes.forEach((plane, index) => {
      const folder = gui.addFolder(`Plane ${["X+", "X-", "Y+", "Y-", "Z+", "Z-"][index]}`);
      folder.add(plane, 'constant', -100, 100, 0.1)
        .name('Position')
        .onChange(() => planeHelpers[index].updateMatrixWorld());
      folder.add(planeHelpers[index], 'visible').name('Show Helper');
    });

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Cleanup
    return () => {
      gui.destroy();
      renderer.dispose();
      controls.dispose();
      scene.three.clear();
      planeHelpers.forEach(ph => scene.three.remove(ph));
      ifcContainerRef.current?.removeChild(renderer.domElement);
    };
  }, [model, ifcWorldRef]);

  useEffect(() => {
    if (loading) return;
    initThreeJS();
  }, [model]);

  useEffect(() => {
    if (!model || materialsRef.current.length === 0) return;

    materialsRef.current.forEach(({ clipping }) => {
      const planes = activePlaneIndex === -1
        ? []
        : [planesRef.current[activePlaneIndex]];

      if (Array.isArray(clipping)) {
        clipping.forEach(mat => {
          mat.clippingPlanes = planes;
          mat.needsUpdate = true;
        });
      } else {
        clipping.clippingPlanes = planes;
        clipping.needsUpdate = true;
      }
    });
  }, [activePlaneIndex, model]);

  useEffect(() => {
    const handleResize = () => {
      if (!rendererRef.current || !controlsRef.current) return;
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      loadIfc(buffer);
    };
    reader.readAsArrayBuffer(file);
  }, [loadIfc]);

  return (
    <div className="w-full h-full relative">
    <div ref={ifcContainerRef} className="absolute inset-0 z-10" />

    {loading && <LoadingSpinner />}

    <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-lg z-20 space-x-2">
        <input
            type="file"
            ref={fileInputRef}
            accept=".ifc"
            onChange={handleFileChange}
            className="hidden"
        />
        <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
        >
            Upload IFC
        </button>
    </div>
</div>
  );
};

export default WebglClippingCube;