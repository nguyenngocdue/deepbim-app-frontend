import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import LoadingSpinner from "@/components/bim-viewer/LoadingSpinner";
import { OrbitControls } from "three/examples/jsm/Addons.js";
// import ViewCube from "./common/ViewCube";

const IfcLoader: React.FC = () => {
    const gridContainerRef = useRef<HTMLDivElement | null>(null);
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const worldRef = useRef<OBC.World | null>(null);
    const ifcWorldRef = useRef<OBC.World | null>(null);
    const componentsRef = useRef<OBC.Components | null>(null);

    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isDefaultView, setIsDefaultView] = useState(true);

    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);

    /** Initializes the default scene */
    useEffect(() => {
        if (!gridContainerRef.current || worldRef.current) return;

        setIsReady(true);
        const components = new OBC.Components();
        componentsRef.current = components;

        const worlds = components.get(OBC.Worlds);
        const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();

        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, gridContainerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        components.init();
        world.scene.setup();
        world.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);

        // Add grid
        const grids = components.get(OBC.Grids);
        grids.create(world);

        worldRef.current = world;

        // Setup Orbit Controls
        const controls = new OrbitControls(world.camera.three, world.renderer.three.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableRotate = true;
        controlsRef.current = controls;

        cameraRef.current = world.camera.three;
        rendererRef.current = world.renderer.three;

        const animate = () => {
            if (!world.renderer) return;
            world.renderer.update();
            controls.update();
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            controls.dispose();
            world.scene.dispose();
            world.renderer.dispose();
        };
    }, []);

    /** Loads an IFC Model */
    async function loadIfc(buffer?: Uint8Array) {
        if (!ifcContainerRef.current) return;

        setLoading(true);
        setIsDefaultView(false);

        if (ifcWorldRef.current) {
            ifcWorldRef.current.scene.three.clear();
            ifcContainerRef.current.innerHTML = "";
            ifcWorldRef.current = null;
        }

        const components = new OBC.Components();
        componentsRef.current = components;

        const worlds = components.get(OBC.Worlds);
        const ifcWorld = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();

        ifcWorld.scene = new OBC.SimpleScene(components);
        ifcWorld.renderer = new OBC.SimpleRenderer(components, ifcContainerRef.current);
        ifcWorld.camera = new OBC.SimpleCamera(components);

        components.init();
        ifcWorld.scene.setup();
        ifcWorld.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);

        setIsReady(true);
        cameraRef.current = ifcWorld.camera.three;
        rendererRef.current = ifcWorld.renderer.three;

        // Setup Orbit Controls
        const controls = new OrbitControls(ifcWorld.camera.three, ifcWorld.renderer.three.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableRotate = true;
        controlsRef.current = controls;

        // Create grid
        const grids = components.get(OBC.Grids);
        grids.create(ifcWorld);

        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        await fragmentIfcLoader.setup();

        const model = await fragmentIfcLoader.load(buffer);
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.visible = true;
        modelRef.current = model; // 🔥 Store model reference

        ifcWorld.scene.three.add(model);

        // Auto-center model in view
        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDimension * 2;

        ifcWorld.camera.controls.setLookAt(
            center.x + cameraDistance,
            center.y + cameraDistance,
            center.z + cameraDistance,
            center.x,
            center.y,
            center.z
        );

        ifcWorld.renderer.update();
        ifcWorldRef.current = ifcWorld;

        setLoading(false);
    }

    /** Handles file selection */
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                if (reader.result) {
                    const buffer = new Uint8Array(reader.result as ArrayBuffer);
                    loadIfc(buffer);
                }
            };
        }
    };

    return (
        <div className="w-full h-full relative">
            {/* {isReady && cameraRef.current && rendererRef.current && controlsRef.current && modelRef.current && (
                <ViewCube
                    camera={cameraRef.current}
                    renderer={rendererRef.current}
                    controls={controlsRef.current}
                    model={modelRef.current} // Pass the model reference
                />
            )} */}
            <div ref={ifcContainerRef} className="absolute inset-0" />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <LoadingSpinner />
                </div>
            )}
            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-lg z-20">
                <input type="file" ref={fileInputRef} accept=".ifc" onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()}>Upload IFC</button>
            </div>
        </div>
    );
};

export default IfcLoader;
