import { useRef, useState, useCallback } from "react";
import * as OBC from "@thatopen/components";

export function useIfcLoader() {
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const ifcWorldRef = useRef<OBC.World | null>(null);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState<OBC.FragmentsGroup | null>(null);

    const loadIfc = useCallback(async (buffer?: Uint8Array) => {
        if (!ifcContainerRef.current) return;

        setLoading(true);

        if (ifcWorldRef.current) {
            ifcContainerRef.current.innerHTML = "";
            ifcWorldRef.current = null;
        }

        const components = new OBC.Components();

        const worlds = components.get(OBC.Worlds);
        const ifcWorld = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();

        ifcWorld.scene = new OBC.SimpleScene(components);
        ifcWorld.renderer = new OBC.SimpleRenderer(components, ifcContainerRef.current);
        ifcWorld.camera = new OBC.SimpleCamera(components);

        components.init();
        ifcWorld.scene.setup();
        ifcWorld.camera.controls.setLookAt(12, 6, 8, 0, 0, 0);


        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        await fragmentIfcLoader.setup();
        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        if (!buffer) return ;
        const model = await fragmentIfcLoader.load(buffer);
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.visible = true;

        
        setModel(model);

        ifcWorld.scene.three.add(model);
        ifcWorld.renderer.update();
        ifcWorldRef.current = ifcWorld;

        setLoading(false);
    }, []);
    return { ifcContainerRef, loadIfc, loading, ifcWorldRef, model  };
}
