import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { addAxesWithTextLabelsToScene } from "@/lib/AxesUtils";
import { addKeyPointsToScene } from "@/lib/PointUtils";
import { anchorVector, updateBoundingBoxByArrow } from "@/lib/BoudingBox";

const ModelIfc: React.FC = () => {
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const transformControlsRef = useRef<TransformControls[]>([]);
    const planesRef = useRef<THREE.Plane[]>([]);
    const arrowsRef = useRef<THREE.ArrowHelper[]>([]);
    const materialsRef = useRef<{ original: THREE.Material | THREE.Material[], clipping: THREE.Material }[]>([]);
    const [sectionActive, setSectionActive] = useState(true);
    const boxHelperRef = useRef<THREE.BoxHelper | null>(null);
    let globalScene: THREE.Scene | null = null;

    useEffect(() => {
        if (!ifcContainerRef.current) return;

        // Initialize components
        const components = new OBC.Components();
        const world = components.get(OBC.Worlds).create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBC.SimpleRenderer
        >();

        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, ifcContainerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        world.scene.three.background = new THREE.Color(0xcccccc);
        world.scene.setup();

        // Setup Orbit Controls
        const controls = new OrbitControls(world.camera.three, world.renderer.three.domElement);
        controls.enableDamping = false;
        controls.dampingFactor = 0.1;
        controlsRef.current = controls;


        worldRef.current = world;
        loadIfcModel();

        // Set globalScene to worldRef.current!.scene.three once it's available
        globalScene = worldRef.current!.scene.three as THREE.Scene;; 

        // Safely use globalScene
        if (globalScene) {
            addAxesWithTextLabelsToScene({ scene: { three: globalScene } }, 10, 0.5); // Axes size: 10 units
        }

        const animate = () => {
            if (!worldRef.current || !worldRef.current.renderer) return;

            requestAnimationFrame(animate);
            controls.update();
            worldRef.current.renderer.update();
        };
        animate();

        return () => {
            controls.dispose();
            transformControlsRef.current.forEach(control => control.dispose());
            components.dispose();
            worldRef.current = null; // Reset worldRef khi unmount
        };
    }, []);

    const loadIfcModel = async () => {
        if (!worldRef.current) return;

        try {
            const ifcLoader = worldRef.current.components.get(OBC.IfcLoader);
            await ifcLoader.setup();

            // const response = await fetch("/ifc/small.ifc");
            const response = await fetch("/ifc/Archicad.ifc");
            if (!response.ok) throw new Error("Can't upload IFC");

            const buffer = await response.arrayBuffer();
            const model = await ifcLoader.load(new Uint8Array(buffer));


            materialsRef.current = [];
            model.traverse((child: { isMesh: boolean; material: THREE.Material | THREE.Material[]; }) => {
                if (!child.isMesh) return;

                const originalMaterial = Array.isArray(child.material)
                    ? child.material.map((mat: { clone: () => any; }) => mat.clone())
                    : child.material.clone();
                const applyClipping = (mat: THREE.Material) => {
                    mat = mat.clone();
                    Object.assign(mat, {
                        clippingPlanes: planesRef.current,
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
            worldRef.current.scene.three.add(model);
            createClippingPlanes(model);

            if (boxHelperRef.current) {
                worldRef.current!.scene.three.remove(boxHelperRef.current);
            }
            // Tạo mới BoxHelper
            boxHelperRef.current = new THREE.BoxHelper(model, 0xff0000);
            worldRef.current!.scene.three.add(boxHelperRef.current);


        } catch (error) {
            console.error("Error loading IFC:", error);
        }
    };

    const createClippingPlanes = (model: THREE.Object3D) => {
        if (!worldRef.current) return;

        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());

        planesRef.current = [
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), bbox.max.x),   // X-
            new THREE.Plane(new THREE.Vector3(1, 0, 0), -bbox.min.x),  // X+
            new THREE.Plane(new THREE.Vector3(0, -1, 0), bbox.max.y),   // Y-
            new THREE.Plane(new THREE.Vector3(0, 1, 0), -bbox.min.y),  // Y+
            new THREE.Plane(new THREE.Vector3(0, 0, -1), bbox.max.z),   // Z-
            new THREE.Plane(new THREE.Vector3(0, 0, 1), -bbox.min.z),  // Z+
        ];

        // addPlaneHelpersToScene(worldRef.current!, planesRef.current, false)
        createArrowHelpers(bbox, center);
        updateClipping();
    };

    const createArrowHelpers = (bbox: THREE.Box3, center: THREE.Vector3) => {
        if (!worldRef.current) return;

        const positions = [
            new THREE.Vector3(bbox.max.x, center.y, center.z), // X+
            new THREE.Vector3(bbox.min.x, center.y, center.z), // X-
            new THREE.Vector3(center.x, bbox.max.y, center.z), // Y+
            new THREE.Vector3(center.x, bbox.min.y, center.z), // Y-
            new THREE.Vector3(center.x, center.y, bbox.max.z), // Z+
            new THREE.Vector3(center.x, center.y, bbox.min.z), // Z-
        ];

        // Add key points to the scene
        const vectorOnElements =  addKeyPointsToScene(worldRef.current!, positions);

        const directions = [
            new THREE.Vector3(-1, 0, 0),  // X+ (phải)
            new THREE.Vector3(1, 0, 0),   // X- (trái)
            new THREE.Vector3(0, -1, 0),  // Y+ (xuống)
            new THREE.Vector3(0, 1, 0),   // Y- (lên)
            new THREE.Vector3(0, 0, -1),  // Z+ (vào)
            new THREE.Vector3(0, 0, 1),   // Z- (ra)
        ];

        arrowsRef.current = [];
        transformControlsRef.current = [];

        directions.forEach((dir, index) => {
            const arrow = new THREE.ArrowHelper(dir.normalize(), positions[index], 0.5, 0xff0000);
            arrow.visible = false; // Ban đầu ẩn tất cả mũi tên
            arrowsRef.current.push(arrow);

            const control = new TransformControls(
                worldRef.current!.camera.three,
                worldRef.current!.renderer.three.domElement
            );
            control.attach(arrow);
            control.setMode("translate");
            control.setSpace("local");
            control.visible = false; // Ban đầu ẩn tất cả TransformControls

            // Set default visibility of TransformControls axes
            control.showX = false;
            control.showY = false;
            control.showZ = false;
            // Check if the arrow direction is parallel to any axis of TransformControls
            if ((dir.x === 1 || dir.x === -1) && dir.y === 0 && dir.z === 0) {
                control.showY = true; // Show X-axis
            }
            if ((dir.y === 1 || dir.y === -1) && dir.x === 0 && dir.z === 0) {
                control.showY = true; // Show Y-axis
            }
            if ((dir.z === 1 || dir.z === -1) && dir.x === 0 && dir.y === 0) {
                control.showY = true; // Show Z-axis
            }

            control.addEventListener("dragging-changed", (event) => {
                controlsRef.current!.enabled = !event.value;
                if (event.value) {
                    // Khi kéo, ẩn các mũi tên khác
                    arrowsRef.current.forEach((otherArrow, otherIndex) => {
                        if (otherIndex !== index) {
                            otherArrow.visible = false;
                        }
                    });

                } else {
                    // Khi thả, hiển thị lại tất cả nếu sectionActive = true
                    arrowsRef.current.forEach(arrow => {
                        arrow.visible = sectionActive;
                    });
                }
            });


            control.addEventListener("objectChange", () => {
                const arrowPosition = arrow.position.clone();
                // Cập nhật vị trí của mũi tên
                arrow.position.copy(arrowPosition);
                updateClippingPlane(index);
                updateClipping();
                updateBoundingBoxByArrow(arrowsRef.current, planesRef.current, boxHelperRef, worldRef.current.scene.three);
                if (vectorOnElements) {
                    const newPoint = anchorVector(vectorOnElements[index], arrow.position);
                    vectorOnElements.forEach((vector) => {
                        worldRef.current?.scene.three.remove(vector);
                    });
                    const p = addKeyPointsToScene(worldRef.current!, [newPoint]);
                }

            });


            worldRef.current!.scene.three.add(arrow, control);
            transformControlsRef.current.push(control);
        });

        // console.log("Arrows created:", arrowsRef.current);
        // console.log("Transform Controls created:", transformControlsRef.current);
    };

    const updateClippingPlane = (index: number) => {
        const arrow = arrowsRef.current[index];
        const plane = planesRef.current[index];

        plane.constant = -arrow.position.dot(plane.normal); // Cập nhật constant dựa trên vị trí mũi tên
        // console.log(`Updated plane ${index}:`, plane, ', Position:', arrow.position);
    };


    const updateClipping = () => {
        if (!worldRef.current) return;
        const renderer = worldRef.current.renderer.three;
        renderer.localClippingEnabled = sectionActive;

        if (sectionActive) {
            materialsRef.current.forEach(({ clipping }) => {
                clipping.clippingPlanes = planesRef.current;
                clipping.needsUpdate = true;
            });
        }
    };





    const toggleSectionBox = () => {
        setSectionActive(prev => {
            const newState = !prev;
            // console.log("Section Active:", newState);
            if (newState) {
                // Hiển thị mũi tên và TransformControls
                arrowsRef.current.forEach(arrow => {
                    arrow.visible = false;
                    worldRef.current?.scene.three.add(arrow);
                });
                transformControlsRef.current.forEach(control => {
                    control.visible = true;
                    // control.children.forEach(child => {
                    //     console.log(child.position)
                    // })
                    worldRef.current?.scene.three.add(control);
                });
                updateClipping();
            } else {
                // Ẩn mũi tên và TransformControls
                arrowsRef.current.forEach(arrow => {
                    arrow.visible = false;
                    worldRef.current?.scene.three.remove(arrow);
                });
                transformControlsRef.current.forEach(control => {
                    control.visible = false;
                    worldRef.current?.scene.three.remove(control);
                });
                updateClipping();
            }

            return newState;
        });
    };

    return (
        <div className="relative w-screen h-screen">
            <div ref={ifcContainerRef} className="w-full h-full" />
            <button
                onClick={toggleSectionBox}
                className={`absolute top-5 left-5 p-2 rounded text-white ${sectionActive ? 'bg-red-500' : 'bg-blue-500'
                    }`}
            >
                {sectionActive ? 'Tắt SectionBox' : 'Bật SectionBox'}
            </button>
        </div>
    );
};

export default ModelIfc;