import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { useIfcLoader } from "@/hooks/use-ifc-loader";
import { IfcLoader } from "@thatopen/components";
import LoadingSpinner from "./loading-spinner";
import ViewCube from "./common/ViewCube";

const WebglClippingStencil: React.FC = () => {
    const initializedRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const ifcLoaderRef = useRef<IfcLoader | null>(null);
    const { ifcContainerRef, loadIfc, loading, ifcWorldRef, model } = useIfcLoader();
    const [isReady, setIsReady] = useState(false);

    const [activePlaneIndex, setActivePlaneIndex] = useState(-1); // -1 = no active plane
    const [globalOffset, setGlobalOffset] = useState(0);
    const planesRef = useRef<THREE.Plane[]>([]);
    const materialsRef = useRef<{ original: THREE.Material | THREE.Material[], clipping: THREE.Material }[]>([]);
    const bboxRef = useRef<THREE.Box3 | null>(null);
    const baseConstantsRef = useRef<number[]>([]);
    const [showHatch, setShowHatch] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    let renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene;
    let controls: OrbitControls;
    let planes: THREE.Plane[];
    let planeHelpers: THREE.PlaneHelper[];
    let clock: THREE.Clock;
    let object: THREE.Group;
    let hatchMaterial: THREE.ShaderMaterial;

    useEffect(() => {
        if (!model || initializedRef.current) return;
        initializedRef.current = true;
        setIsReady(true);

        // 🔹 Initialize Three.js Scene
        clock = new THREE.Clock();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(2, 2, 2);
        scene.add(new THREE.AmbientLight(0xffffff, 1.5));

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);

        // 🔹 Compute Bounding Box
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
            const helperSize = Math.max(size.x, size.y, size.z) * 2; // Ensure large enough size
            const helper = new THREE.PlaneHelper(plane, helperSize, 0xff0000); // Red color for visibility

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

        planeHelpers.forEach(ph => {
            ph.visible = true;
            scene.add(ph);
        });
        

        // 🔹 Handle Materials and Clipping
        materialsRef.current = [];
        model.traverse((child) => {
            if (child.isMesh) {
                const originalMaterial = Array.isArray(child.material)
                    ? child.material.map(mat => mat.clone())
                    : child.material.clone();

                // Create clipping material
                const clippingMaterial = Array.isArray(originalMaterial)
                    ? originalMaterial.map(mat => {
                        const newMat = mat.clone();
                        newMat.clippingPlanes = [];
                        newMat.clipShadows = true;
                        newMat.stencilWrite = true;
                        newMat.stencilRef = 1;
                        newMat.stencilZPass = THREE.ReplaceStencilOp;
                        newMat.side = THREE.DoubleSide; // Ensure solid rendering
                        return newMat;
                    })
                    : originalMaterial.clone();

                if (!Array.isArray(clippingMaterial)) {
                    clippingMaterial.clippingPlanes = [];
                    clippingMaterial.clipShadows = true;
                    clippingMaterial.stencilWrite = true;
                    clippingMaterial.stencilRef = 1;
                    clippingMaterial.stencilZPass = THREE.ReplaceStencilOp;
                    clippingMaterial.side = THREE.DoubleSide; // Ensure solid rendering
                }

                child.material = Array.isArray(clippingMaterial)
                    ? clippingMaterial
                    : clippingMaterial;

                materialsRef.current.push({
                    original: originalMaterial,
                    clipping: Array.isArray(clippingMaterial)
                        ? clippingMaterial[0]
                        : clippingMaterial
                });
            }
        });

        console.log(materialsRef)
        
        // 🔹 Create Hatch Material
        hatchMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(0xff0000) },
                uViewport: { value: new THREE.Vector2() }
            },
            vertexShader: `
                varying vec3 vViewPosition;
                void main() {
                    vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform vec2 uViewport;
                varying vec3 vViewPosition;

                void main() {
                    if (gl_FragCoord.z < 0.99) discard;
                    float scale = 10.0;
                    vec2 coord = gl_FragCoord.xy / uViewport * scale;
                    if (fract(coord.x + coord.y) > 0.5) discard;
                    gl_FragColor = vec4(uColor, 1.0);
                }
            `,
            depthTest: true,
            depthWrite: false,
            stencilWrite: true,
            stencilRef: 1,
            stencilFunc: THREE.NotEqualStencilFunc,
            stencilZPass: THREE.ReplaceStencilOp
        });

        console.log(hatchMaterial);

        // 🔹 Renderer Setup
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            stencil: true,
            preserveDrawingBuffer: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x263238);
        renderer.localClippingEnabled = true;
        renderer.shadowMap.enabled = true;
        renderer.autoClearStencil = false;
        ifcContainerRef.current?.appendChild(renderer.domElement);

        // 🔹 Controls Setup
        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 20;
        controls.update();

        // 🔹 GUI Setup
        const gui = new GUI();

        const clippingFolder = gui.addFolder('Clipping Control');
        clippingFolder.add({ activePlane: activePlaneIndex }, 'activePlane', {
            'None': -1,
            'X+ (Right)': 0,
            'X- (Left)': 1,
            'Y+ (Top)': 2,
            'Y- (Bottom)': 3,
            'Z+ (Back)': 4,
            'Z- (Front)': 5
        }).name('Active Plane')
          .onChange((value) => {
              setActivePlaneIndex(value);
          });

        clippingFolder.add({ offset: 0 }, 'offset', -10, 10, 0.1)
            .name('Global Offset')
            .onChange((value) => {
                setGlobalOffset(value);
            });

        clippingFolder.add({ showHatch: false }, 'showHatch')
            .name('Show Hatch')
            .onChange((value) => {
                setShowHatch(value);
                materialsRef.current.forEach(({ clipping }) => {
                    if (Array.isArray(clipping)) {
                        clipping.forEach(mat => {
                            mat.stencilWrite = value;
                            mat.needsUpdate = true;
                        });
                    } else {
                        clipping.stencilWrite = value;
                        clipping.needsUpdate = true;
                    }
                });
            });
        clippingFolder.open();

        planes.forEach((plane, index) => {
            const axis = ["x", "x", "y", "y", "z", "z"][index];
            const folder = gui.addFolder(`Plane ${["X+", "X-", "Y+", "Y-", "Z+", "Z-"][index]}`);

            folder.add(plane, 'constant', -100, 100, 0.1)
                .name('Position')
                .onChange(() => {
                    planeHelpers[index].updateMatrixWorld();
                });

            folder.add(planeHelpers[index], 'visible').name('Show Helper');
        });

        // 🔹 Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();

            hatchMaterial.uniforms.uViewport.value.set(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio
            );

            renderer.clear();
            renderer.render(scene, camera);

            if (showHatch) {
                renderer.clearStencil();
                renderer.render(scene, camera);
                renderer.render(new THREE.Scene(), camera);
            }
        };
        animate();

        return () => {
            gui.destroy();
            renderer.dispose();
            window.removeEventListener('resize', handleResize);
        };
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
        if (!planesRef.current || !baseConstantsRef.current) return;

        planesRef.current.forEach((plane, index) => {
            if (index % 2 === 0) {
                plane.constant = baseConstantsRef.current[index] - globalOffset;
            } else {
                plane.constant = baseConstantsRef.current[index] + globalOffset;
            }
        });
    }, [globalOffset]);

    const handleResize = () => {
        if (!camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                if (reader.result) {
                    const buffer = new Uint8Array(reader.result as ArrayBuffer);
                    loadIfc(buffer);
                }
            };
        }
    };

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

            {isReady && cameraRef.current && rendererRef.current && controlsRef.current && (
                <ViewCube camera={cameraRef.current} renderer={rendererRef.current} controls={controlsRef.current} />
            )}
        </div>
    );
};

export default WebglClippingStencil;