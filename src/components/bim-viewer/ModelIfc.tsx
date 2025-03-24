import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import * as OBCF from "@thatopen/components-front";

declare module "three" {
    interface BufferGeometry {
        computeBoundsTree?: () => void;
        disposeBoundsTree?: () => void;
    }
}

declare module "three" {
    interface Mesh {
        raycast: (raycaster: THREE.Raycaster, intersects: Array<THREE.Intersection>) => void;
    }
}
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVH } from "three-mesh-bvh";
import { useHighlightSetup } from "@/features/bim-viewer/useHighlightSetup";
import { useIfcLoader } from "@/features/bim-viewer/useIfcLoader";

// Gán các phương thức BVH vào prototype của BufferGeometry và Mesh
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

interface ModelIfcProps {
    sectionActive: boolean; // Trạng thái Section Box từ component cha
    coordinateSyssActive: boolean;
    selectedFile: Uint8Array | null; // Selected file path
    onFileSelect: (filePath: Uint8Array | null) => void; // File selection handler
    coordinateSysActive: boolean;
    isHighlightEnabled:boolean;
}


const ModelIfc: React.FC<ModelIfcProps> = (
    { 
        selectedFile, 
        isHighlightEnabled
    }) => {
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const transformControlsRef = useRef<TransformControls[]>([]);
    const boxHelperRef = useRef<THREE.BoxHelper | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const componentRef = useRef<OBC.Components | null>(null);

    const [isWorldReady, setIsWorldReady] = useState(false);

    useEffect(() => {
        if (isWorldReady && !selectedFile) {
            useIfcLoader({
                worldRef,
                componentRef,
                modelRef,
                boxHelperRef
              });
        }
    }, [isWorldReady]);
    
    //hihglight
    useEffect(() => {
        useHighlightSetup({ isHighlightEnabled, componentRef, worldRef });
    }, [isWorldReady, isHighlightEnabled]);


    
    useEffect(() => {
        if (!ifcContainerRef.current) return;
        // Initialize components
        const components = new OBC.Components();
        const world = components.get(OBC.Worlds).create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBCF.PostproductionRenderer
        >();

       
        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBCF.PostproductionRenderer(components, ifcContainerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        components.init();
        componentRef.current = components;
        world.renderer.postproduction.enabled = true;
        world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

        world.scene.three.background = new THREE.Color(0xcccccc);
        world.scene.setup();

        // Getting the highlighter
        worldRef.current = world;
        setIsWorldReady(true);
        
        const animate = () => {
            if (!worldRef.current || !worldRef.current.renderer) return;
            requestAnimationFrame(animate);
            worldRef.current.renderer.update();
        };
        animate();

        return () => {
            // controls.dispose();
            transformControlsRef.current.forEach(control => control.dispose());
            components.dispose();
            worldRef.current = null; // Reset worldRef khi unmount
        };
        
    }, []);

  
    return (
        <div className="relative w-screen h-screen">
            <div ref={ifcContainerRef} className="w-full h-full" />
        </div>
    );
};

export default ModelIfc;