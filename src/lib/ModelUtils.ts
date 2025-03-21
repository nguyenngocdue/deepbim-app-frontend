import * as THREE from "three";
/**
 * Resets the model to its original state by restoring the original materials.
 * @param model - The 3D model to reset (THREE.Object3D).
 * @param materialsRef - A reference to the array of original and clipping materials.
 */
export const resetModelToOriginalState = (
    model: THREE.Object3D | null,
    materialsRef: React.RefObject<{ original: THREE.Material | THREE.Material[], clipping: THREE.Material }[]>,
    planesRef: React.RefObject<THREE.Plane[]>,
    initialPlaneRef: React.RefObject<THREE.Plane[]>, 
    arrowsRef: React.RefObject<THREE.ArrowHelper[]>,
    initialPositionsRef: React.RefObject<THREE.Vector3[]>
   
) => {
    if (!model) return;

    model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        // Find the original material entry for the current mesh
        const materialEntry = materialsRef.current.find(
            (entry) => entry.clipping === child.material
        );

        if (materialEntry) {
            // Restore the original material
            child.material = Array.isArray(materialEntry.original)
                ? [...materialEntry.original]
                : materialEntry.original;
        }
    });
    // Reset planesRef
    planesRef.current.forEach((plane, index) => {
        if (plane && initialPlaneRef.current[index]) {
            plane.copy(initialPlaneRef.current[index]);
        }
    });

    // Reset arrow positions to their initial positions
    arrowsRef.current.forEach((arrow, index) => {
        if (arrow && initialPositionsRef.current[index]) {
            arrow.position.copy(initialPositionsRef.current[index]);
        }
    });
};
