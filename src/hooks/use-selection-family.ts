import { useEffect, useState } from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components";


export const useSelectionFamily = (
    ifcWorldRef: React.RefObject<OBC.World>,
    componentsRef: React.RefObject<OBC.Components | null>
) => {
    const [selectedElements, setSelectedElements] = useState<number[]>([]);



    const onSelectElement = async (event: MouseEvent) => {
        if (!ifcWorldRef.current || !componentsRef.current) return;

        const ifcWorld = ifcWorldRef.current;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = ifcWorld.renderer?.container?.getBoundingClientRect();
        if (!rect) return;

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, ifcWorld.camera.controls.camera);
        const intersects = raycaster.intersectObjects(ifcWorld.scene.three.children, true);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            
            const selectedObject = intersection.object as THREE.Mesh;

            // console.log("selectedObject",selectedObject);
            
            const instanceId = intersection.instanceId; // If using InstancedMesh
            const faceIndex = intersection.faceIndex;

            // console.log("🟢 Selected Mesh:", selectedObject);
            // console.log("🟢 Face Index:", faceIndex);

            // 🔥 Get the ID from userData if available
            const elementId = selectedObject.userData.id || instanceId;

            if (elementId === undefined) {
                // console.log("⚠️ No element ID found.");
                return;
            }

            // console.log("✅ Selected Element ID:", elementId);

            const relatedElements = await getRelatedElements(elementId, componentsRef);
            setSelectedElements([elementId, ...relatedElements]);
        }
    };

    /** 🎯 **Retrieve all related elements based on IFC relationships** */
    const getRelatedElements = async (elementId: number, componentsRef: React.RefObject<OBC.Components | null>) => {
        if (!componentsRef.current) return [];
        const ifcLoader = componentsRef.current.get(OBC.IfcLoader);
        if (!ifcLoader || !ifcLoader.webIfc) return [];

        const webIfc = ifcLoader.webIfc;
        const modelID = 0;

        let familyIds: number[] = [];


            // 🔥 **Find Aggregation Relationships (e.g., IfcWall with multiple layers)**
        const aggregationRels = await webIfc.getAllItemsOfType(modelID, webIfc.IFCRELAGGREGATES, false);

          

        return Array.from(new Set(familyIds)); // Remove duplicates
    };

    useEffect(() => {
        window.addEventListener("click", onSelectElement);
        return () => {
            window.removeEventListener("click", onSelectElement);
        };
    }, []);

    return { selectedElements };
};
