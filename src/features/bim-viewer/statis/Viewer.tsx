import React, { useEffect, useRef } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";


const Viewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cubeRef = useRef<HTMLDivElement | null>(null);
    const cubeRendererRef = useRef<THREE.WebGLRenderer | null>(null);


    useEffect(() => {
        const initializeViewer = async () => {
            if (!containerRef.current || !cubeRef.current) return;

            // Main Viewer Scene
            const components = new OBC.Components();
            const worlds = components.get(OBC.Worlds);
            const world = worlds.create<
                OBC.SimpleScene,
                OBC.SimpleCamera,
                OBC.SimpleRenderer
            >();

            world.scene = new OBC.SimpleScene(components);
            world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
            world.camera = new OBC.SimpleCamera(components);

            components.init();

            // Set up the main scene
            world.scene.setup();
            const grids = components.get(OBC.Grids);
            grids.create(world);

            // Set initial camera position
            world.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);

            // IFC Loader
            const fragments = new OBC.FragmentsManager(components);
            // const loadIfcModel = async () => {
            //     const response = await fetch(
            //         "https://thatopen.github.io/engine_components/resources/small.frag"
            //     );
            //     const arrayBuffer = await response.arrayBuffer();
            //     const buffer = new Uint8Array(arrayBuffer);
            //     const model = fragments.load(buffer);
            //     world.scene.three.add(model);
            // };
            // await loadIfcModel();

            

            // Add ViewCube
            const addViewCube = () => {
                // Ensure only one renderer is created
                if (!cubeRendererRef.current) {
                    cubeRendererRef.current = new THREE.WebGLRenderer({ alpha: true });
                    cubeRendererRef.current.setSize(150, 150);
                    cubeRendererRef.current.setClearColor(0x000000, 0); // Transparent background
                    cubeRef.current?.appendChild(cubeRendererRef.current.domElement);
                }

                const cubeRenderer = cubeRendererRef.current;
                const cubeScene = new THREE.Scene();
                const cubeCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);
                cubeCamera.position.set(50, 50, 50);
                cubeCamera.lookAt(0, 0, 0);

                // Create static cube with textured materials
                const geometry = new THREE.BoxGeometry(40, 40, 40);
                const createMaterial = (color: string, label: string) => {
                    const canvas = document.createElement("canvas");
                    canvas.width = 256;
                    canvas.height = 256;

                    const ctx = canvas.getContext("2d")!;
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.font = "Bold 48px Arial";
                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(label, canvas.width / 2, canvas.height / 2);

                    const texture = new THREE.CanvasTexture(canvas);
                    return new THREE.MeshBasicMaterial({ map: texture });
                };

                const materials = [
                    createMaterial("#ff0000", "Front"), // Front
                    createMaterial("#00ff00", "Back"),  // Back
                    createMaterial("#0000ff", "Top"),   // Top
                    createMaterial("#ffff00", "Bottom"), // Bottom
                    createMaterial("#ff00ff", "Left"),  // Left
                    createMaterial("#00ffff", "Right"), // Right
                ];
                const cube = new THREE.Mesh(geometry, materials);
                cubeScene.add(cube);

                const axesHelper = new THREE.AxesHelper(30);
                cubeScene.add(axesHelper);

                // Raycaster for detecting cube face clicks
                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();

                const handleCubeClick = (event: MouseEvent) => {
                    const bounds = cubeRenderer.domElement.getBoundingClientRect();
                    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
                    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

                    raycaster.setFromCamera(mouse, cubeCamera);
                    const intersects = raycaster.intersectObject(cube);

                    if (intersects.length > 0) {
                        const faceIndex = intersects[0].face?.materialIndex;

                        // Map clicked face to camera views
                        switch (faceIndex) {
                            case 0: // Front
                                world.camera.controls.setLookAt(0, 0, 10, 0, 0, 0);
                                break;
                            case 1: // Back
                                world.camera.controls.setLookAt(0, 0, -10, 0, 0, 0);
                                break;
                            case 2: // Top
                                world.camera.controls.setLookAt(0, 10, 0, 0, 0, 0);
                                break;
                            case 3: // Bottom
                                world.camera.controls.setLookAt(0, -10, 0, 0, 0, 0);
                                break;
                            case 4: // Left
                                world.camera.controls.setLookAt(-10, 0, 0, 0, 0, 0);
                                break;
                            case 5: // Right
                                world.camera.controls.setLookAt(10, 0, 0, 0, 0, 0);
                                break;
                            default:
                                break;
                        }
                    }
                };

                cubeRenderer.domElement.addEventListener("click", handleCubeClick);

                // Render the cube statically without rotation
                cubeRenderer.render(cubeScene, cubeCamera);
            };

            addViewCube();
        };

        initializeViewer();

        return () => {
            // Cleanup on unmount
            containerRef.current?.replaceChildren();
            cubeRef.current?.replaceChildren();
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            {/* Main Viewer */}
            <div
                ref={containerRef}
                className="absolute inset-0"
            />
            {/* ViewCube */}
            <div
                ref={cubeRef}
                className="absolute top-2 right-2 w-[150px] h-[150px] pointer-events-auto"
            />
        </div>
    );
};

export default Viewer;