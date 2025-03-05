import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import LoadingSpinner from "@/components/bim-viewer/loading-spinner";
import { useSelectionFamily } from "@/hooks/use-selection-family";
import * as OBF from "@thatopen/components-front";

const IfcViewerSelectionFamily: React.FC = () => {
    const gridContainerRef = useRef<HTMLDivElement | null>(null);
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const ifcWorldRef = useRef<OBC.World | null>(null);
    const componentsRef = useRef<OBC.Components | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Use the custom hook for IFC selection
    const { selectedElements } = useSelectionFamily(ifcWorldRef, componentsRef);

    /** 🏗️ Initialize Grid Scene (Always Visible) */
    useEffect(() => {
        if (!gridContainerRef.current || worldRef.current) return;

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

        const grids = components.get(OBC.Grids);
        grids.create(world);

        worldRef.current = world;

        const highlighter = components.get(OBF.Highlighter);
        highlighter.setup({ world });
        highlighter.zoomToSelection = true;
        console.log(highlighter)


    }, []);

    /** 🏗️ Load IFC Model and create a new canvas */
    async function loadIfc(buffer?: Uint8Array) {
        if (!ifcContainerRef.current) return;

        setLoading(true);

        if (ifcWorldRef.current) {
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

        const grids = components.get(OBC.Grids);
        grids.create(ifcWorld);

        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        await fragmentIfcLoader.setup();

        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

      
        const model = await fragmentIfcLoader.load(buffer);
        console.log("Model loaded:", model);
        model.items.map((item) => {
            const parent = item.mesh.uuid;
            // console.log(parent);
           
        })

        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.visible = true;

        ifcWorld.scene.three.add(model);

        ifcWorld.renderer.update();

        ifcWorldRef.current = ifcWorld;

        setLoading(false);
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
            <div ref={gridContainerRef} className="absolute inset-0 z-0" />
            <div ref={ifcContainerRef} className="absolute inset-0 z-10" />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <LoadingSpinner />
                </div>
            )}

            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-lg z-20">
                <input type="file" ref={fileInputRef} accept=".ifc" onChange={handleFileChange} className="hidden" />
                <button className="bim-button" onClick={() => fileInputRef.current?.click()}>Upload IFC</button>
            </div>

            {selectedElements.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg z-20">
                    <p>Selected IFC Elements:</p>
                    <ul>
                        {selectedElements.map((id) => (
                            <li key={id}>ID: {id}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default IfcViewerSelectionFamily;