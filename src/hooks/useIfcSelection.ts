import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components";

export const useIfcSelection = (ifcWorldRef: React.RefObject<OBC.World>) => {
    const [selectedElement, setSelectedElement] = useState<number | null>(null);

    // Function to select and highlight an IFC element
    const onSelectElement = async (event: MouseEvent) => {
        if (!ifcWorldRef.current) return;
    
        const ifcWorld = ifcWorldRef.current;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = ifcWorld.renderer.container.getBoundingClientRect();
        if (!rect) return;

        // Convert mouse click to Three.js coordinates
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
        raycaster.setFromCamera(mouse, ifcWorld.camera.controls.camera);
        const intersects = raycaster.intersectObjects(ifcWorld.scene.three.children, true);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            const selectedObject = intersection.object as THREE.Mesh;
            const instanceId = intersection.instanceId; // If using InstancedMesh
            const faceIndex = intersection.faceIndex;

            console.log("🟢 Selected Mesh:", selectedObject);
            console.log("🟢 Face Index:", faceIndex);
    
            // 🔥 Get the ID from userData if available
            const elementId = selectedObject.userData.id || instanceId;
    
            if (elementId === undefined) {
                console.log("⚠️ No element ID found.");
                return;
            }
    
            console.log("✅ Selected Element ID:", elementId);
            setSelectedElement(elementId); // Store selected element
    
            // Change the color of the selected element
            setColorForElement(selectedObject, elementId, new THREE.Color("#009ce8"));
        }
    };

    // Function to change color of an element
    const setColorForElement = (mesh: THREE.Mesh, elementId: number, color: THREE.Color) => {
        if (!mesh || !mesh.material) return;
    
        if (mesh instanceof THREE.InstancedMesh) {
            // Change color for an individual instance
            const instanceColor = mesh.instanceColor;
            if (instanceColor) {
                const colorArray = instanceColor.array as Float32Array;
                const index = elementId * 3;
                colorArray[index] = color.r;
                colorArray[index + 1] = color.g;
                colorArray[index + 2] = color.b;
    
                instanceColor.needsUpdate = true;
            }
        } else {
            // Change color for a normal Mesh
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshLambertMaterial) {
                        mat.color.set(color);
                        mat.needsUpdate = true;
                    }
                });
            } else if (mesh.material instanceof THREE.MeshStandardMaterial || mesh.material instanceof THREE.MeshLambertMaterial) {
                mesh.material.color.set(color);
                mesh.material.needsUpdate = true;
            }
        }
    
        console.log(`🎨 Changed color of element ID ${elementId} to`, color);
    };

    // Attach event listener for selection
    useEffect(() => {
        window.addEventListener("click", onSelectElement);
        return () => {
            window.removeEventListener("click", onSelectElement);
        };
    }, []);

    return { selectedElement, setSelectedElement };
};
