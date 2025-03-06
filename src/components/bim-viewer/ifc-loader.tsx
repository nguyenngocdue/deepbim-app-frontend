import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import LoadingSpinner from "@/components/bim-viewer/loading-spinner";

const IfcLoader: React.FC = () => {
    const gridContainerRef = useRef<HTMLDivElement | null>(null);
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const ifcWorldRef = useRef<OBC.World | null>(null);
    const componentsRef = useRef<OBC.Components | null>(null);
    const [loading, setLoading] = useState(false); // 🔴 Loading state

    /** 🏗️ Initialize Grid Scene (Always Visible) */
    useEffect(() => {

        
        if (!gridContainerRef.current) return;
        
        // If world is already initialized, do nothing
        if (worldRef.current) return;
        
        const components = new OBC.Components();
        componentsRef.current = components;

        

        const worlds = components.get(OBC.Worlds);
        const world = worlds.create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBC.SimpleRenderer
        >();
    
        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, gridContainerRef.current);
        world.camera = new OBC.SimpleCamera(components);
    
        components.init();
        world.scene.setup();
        world.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);
    
        // Add Grid to Scene
        const grids = components.get(OBC.Grids);
        grids.create(world);
    
        worldRef.current = world; // Save reference to prevent re-initialization
    }, []);

    /** 🏗️ Load IFC Model and create a new canvas */
    async function loadIfc(buffer?: Uint8Array) {

        

        if (!ifcContainerRef.current) return;
    
        setLoading(true); // 🔴 Show spinner while uploading
    
        // Remove previous IFC model before loading a new one
        if (ifcWorldRef.current) {
            ifcContainerRef.current.innerHTML = "";
            ifcWorldRef.current = null;
        }
    
        const components = new OBC.Components();
        componentsRef.current = components;
    
        const worlds = components.get(OBC.Worlds);
        const ifcWorld = worlds.create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBC.SimpleRenderer
        >();
    
        ifcWorld.scene = new OBC.SimpleScene(components);
        ifcWorld.renderer = new OBC.SimpleRenderer(components, ifcContainerRef.current);
        ifcWorld.camera = new OBC.SimpleCamera(components);
    
        components.init();
        ifcWorld.scene.setup();
    
        // Set default view to a top-down angle
        ifcWorld.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);
    
        // Add Grid to IFC Viewer Scene
        const grids = components.get(OBC.Grids);
        grids.create(ifcWorld);
    
        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        await fragmentIfcLoader.setup();
    
        const excludedCats = [
            WEBIFC.IFCTENDONANCHOR,
            WEBIFC.IFCREINFORCINGBAR,
            WEBIFC.IFCREINFORCINGELEMENT,
            WEBIFC.IFCCOLUMN
        ];
    
        for (const cat of excludedCats) {
            fragmentIfcLoader.settings.excludedCategories.add(cat);
        }
    
        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    
        // Load IFC model
        const model = await fragmentIfcLoader.load(buffer);

        console.log("Model loaded:", model);
        console.log(WEBIFC.IFCWALLSTANDARDCASE)
    
        // Position the model correctly
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.visible = true;
    
        // Add model to IFC scene
        ifcWorld.scene.three.add(model);
    
        // 🔴 **New: Automatically Adjust Camera to Fit the Model**
        const bbox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        const size = bbox.getSize(new THREE.Vector3());
    
        // Set camera distance based on model size
        const maxDimension = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDimension * 2; // Adjust multiplier for zoom level
    
        // Move camera back so the entire model is visible
        ifcWorld.camera.controls.setLookAt(
            center.x + cameraDistance,
            center.y + cameraDistance,
            center.z + cameraDistance,
            center.x,
            center.y,
            center.z
        );
    
        // Update renderer
        ifcWorld.renderer.update();
    
        // Store new IFC world reference
        ifcWorldRef.current = ifcWorld;
    
        setLoading(false); // 🔴 Hide spinner after loading is done
    }
    

    /** 🏗️ Handle IFC file upload */
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
            {/* Grid Viewer (Always Visible) */}
            <div ref={gridContainerRef} className="absolute inset-0 z-0" />

            {/* IFC Viewer (Always Visible, on top of Grid) */}
            <div ref={ifcContainerRef} className="absolute inset-0 z-10" />

            {/* 🔴 Show Loading Spinner on Top When Uploading */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <LoadingSpinner />
                </div>
            )}

            {/* IFC Upload Button */}
            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-lg z-20">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".ifc"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    className=""
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload IFC
                </button>
            </div>
        </div>
    );
};

export default IfcLoader;
