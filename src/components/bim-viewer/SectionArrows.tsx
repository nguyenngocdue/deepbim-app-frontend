import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

const ModelIfc: React.FC = () => {
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const transformControlsRef = useRef<TransformControls | null>(null);
    const planesRef = useRef<THREE.Plane[]>([]);
    const arrowsRef = useRef<{ arrow: THREE.ArrowHelper; index: number }[]>([]);
    const [sectionActive, setSectionActive] = useState(false);

    useEffect(() => {
        if (!ifcContainerRef.current) return;

        const components = new OBC.Components();
        components.init();

        const worlds = components.get(OBC.Worlds);
        const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();

        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, ifcContainerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        world.scene.setup();
        world.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);
        worldRef.current = world;

        const controls = new OrbitControls(world.camera.three, world.renderer.three.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableRotate = true;
        controlsRef.current = controls;

        loadIfcModel();

        return () => {
            controls.dispose();
            world.scene.dispose();
            world.renderer.dispose();
        };
    }, []);

    /** Load IFC Model */
    const loadIfcModel = async () => {
        if (!worldRef.current) return;

        try {
            const filePath = "/ifc/small.ifc";
            const response = await fetch(filePath);
            if (!response.ok) throw new Error("Không thể tải file");

            const buffer = new Uint8Array(await response.arrayBuffer());
            const components = new OBC.Components();
            components.init();

            const ifcLoader = components.get(OBC.IfcLoader);
            await ifcLoader.setup();

            const model = await ifcLoader.load(buffer);
            worldRef.current.scene.three.add(model);

            createClippingPlanes(model);
        } catch (error) {
            console.error("Lỗi khi tải file:", error);
        }
    };

    /** Tạo Clipping Planes */
    const createClippingPlanes = (model: THREE.Object3D) => {
        if (!worldRef.current) return;

        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());

        planesRef.current = [
            new THREE.Plane(new THREE.Vector3(1, 0, 0), -bbox.max.x), // X+
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), bbox.min.x), // X-
            new THREE.Plane(new THREE.Vector3(0, 1, 0), -bbox.max.y), // Y+
            new THREE.Plane(new THREE.Vector3(0, -1, 0), bbox.min.y), // Y-
            new THREE.Plane(new THREE.Vector3(0, 0, 1), -bbox.max.z), // Z+
            new THREE.Plane(new THREE.Vector3(0, 0, -1), bbox.min.z), // Z-
        ];

        worldRef.current.renderer.three.clippingPlanes = planesRef.current;
        worldRef.current.renderer.three.localClippingEnabled = true;

        createArrowHelpers(bbox, center);
    };

    /** Tạo ArrowHelper để Move Clipping Planes */
    const createArrowHelpers = (bbox: THREE.Box3, center: THREE.Vector3) => {
        if (!worldRef.current) return;

        const arrows = [
            createArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(bbox.max.x, center.y, center.z), 0),
            createArrow(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(bbox.min.x, center.y, center.z), 1),
            createArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(center.x, bbox.max.y, center.z), 2),
            createArrow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(center.x, bbox.min.y, center.z), 3),
            createArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(center.x, center.y, bbox.max.z), 4),
            createArrow(new THREE.Vector3(0, 0, -1), new THREE.Vector3(center.x, center.y, bbox.min.z), 5),
        ];

        arrowsRef.current = arrows;
    };

    /** Tạo ArrowHelper và gắn TransformControls */
    const createArrow = (dir: THREE.Vector3, pos: THREE.Vector3, index: number) => {
        if (!worldRef.current) return null;

        const arrow = new THREE.ArrowHelper(dir, pos, 2, 0xff0000);
        worldRef.current.scene.three.add(arrow);

        const arrowControl = new TransformControls(worldRef.current.camera.three, worldRef.current.renderer.three.domElement);
        arrowControl.attach(arrow);
        arrowControl.setMode("translate");

        arrowControl.addEventListener("objectChange", () => updateClippingPlane(arrow, index));
        worldRef.current.scene.three.add(arrowControl);

        return { arrow, index };
    };

    /** Cập nhật Clipping Plane Khi Move Arrow */
    const updateClippingPlane = (arrow: THREE.ArrowHelper, index: number) => {
        if (!planesRef.current[index] || !arrow.position) return;

        planesRef.current[index].constant = -arrow.position.dot(planesRef.current[index].normal);
        worldRef.current?.renderer.update();
    };

    /** Bật SectionBox */
    const enableSectionBox = () => {
        setSectionActive(true);
        arrowsRef.current.forEach(({ arrow }) => (arrow.visible = true));
    };

    /** Tắt SectionBox */
    const disableSectionBox = () => {
        if (!worldRef.current) return;

        worldRef.current.renderer.three.clippingPlanes = [];
        worldRef.current.renderer.three.localClippingEnabled = false;

        arrowsRef.current.forEach(({ arrow }) => worldRef.current?.scene.three.remove(arrow));
        setSectionActive(false);
    };

    return (
        <div className="absolute top-0 left-0 w-screen h-screen">
            <div ref={ifcContainerRef} className="w-full h-full"></div>
            {!sectionActive ? (
                <button
                    onClick={enableSectionBox}
                    className="absolute top-5 left-5 p-2 bg-blue-500 text-white rounded"
                >
                    Bật SectionBox
                </button>
            ) : (
                <button
                    onClick={disableSectionBox}
                    className="absolute top-5 left-5 p-2 bg-red-500 text-white rounded"
                >
                    Tắt SectionBox
                </button>
            )}
        </div>
    );
};

export default ModelIfc;
