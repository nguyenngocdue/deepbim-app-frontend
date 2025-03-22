import { RefObject } from 'react';
import * as THREE from 'three';

export const addBoundingBox = (model: THREE.Object3D) => {
    const bbox = new THREE.Box3().setFromObject(model); // Lấy kích thước model
    const bboxHelper = new THREE.Box3Helper(bbox, 0x00ff00); // Màu xanh lá
    worldRef.current!.scene.three.add(bboxHelper);
};

export const animateBoundingBox = (boxHelper: THREE.BoxHelper, model: THREE.Object3D) => {
    const updateBox = () => {
        requestAnimationFrame(updateBox);
        boxHelper.update(); // Cập nhật lại Bounding Box
    };
    updateBox();
};

export const updateBoundingBoxByArrow = (
    arrows: THREE.ArrowHelper[],  // Array of ArrowHelper objects
    planes: THREE.Plane[],        // Array of clipping planes
    boxHelperRef: RefObject<THREE.Box3Helper | null>, // Reference to Box3Helper
    scene: THREE.Scene            // Three.js scene to add the Box3Helper
) => {
    //Create a new Bounding Box
    const newBbox = new THREE.Box3();

    //Calculate the Bounding Box from the arrow positions
    arrows.forEach((arrow, index) => {
        const plane = planes[index];

        // Get the position of the arrow and update the Bounding Box
        const arrowPos = arrow.position.clone();
        if (plane.normal.x !== 0) {
            newBbox.min.x = Math.min(newBbox.min.x, arrowPos.x);
            newBbox.max.x = Math.max(newBbox.max.x, arrowPos.x);
        }
        if (plane.normal.y !== 0) {
            newBbox.min.y = Math.min(newBbox.min.y, arrowPos.y);
            newBbox.max.y = Math.max(newBbox.max.y, arrowPos.y);
        }
        if (plane.normal.z !== 0) {
            newBbox.min.z = Math.min(newBbox.min.z, arrowPos.z);
            newBbox.max.z = Math.max(newBbox.max.z, arrowPos.z);
        }
    });

    //If an old Box3Helper exists, remove it
    if (boxHelperRef.current) {
        scene.remove(boxHelperRef.current); // Remove the old Bounding Box from the scene
        // Dispose of the geometry and material resources
        boxHelperRef.current.geometry.dispose(); 
        boxHelperRef.current = null; // Ensure the object is cleared
    }

    //Create a custom material with a dashed effect
    const dashedMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,  // Blue color (blue-400)
        linewidth: 1,     // Line width (Note: not all browsers support this)
        dashed: true,     // Enable dashed lines
        dashSize: 0.1,    // Length of each dash
        gapSize: 0.1      // Gap between dashes
    });

    //Create a new Box3Helper with the default color
    boxHelperRef.current = new THREE.Box3Helper(newBbox);

    //Assign the custom material to the Box3Helper
    boxHelperRef.current.material = dashedMaterial;

    //Add the Box3Helper to the scene
    scene.add(boxHelperRef.current);
};

export const anchorVector = (
    originalVector  : THREE.Vector3,
    targetVector: THREE.Vector3
)  => {
    originalVector.set(targetVector.x, targetVector.y, targetVector.z);
    return originalVector;
}

export const removeBoxHelperFromScene = (scene: THREE.Scene) => {
    scene.traverse((child) => {
        switch (true) {
            case child instanceof THREE.BoxHelper:
                scene.remove(child); // Remove BoxHelper from the scene
                // console.log("BoxHelper removed:", child);
                break;

            case child instanceof THREE.Box3Helper:
                scene.remove(child); // Remove Box3Helper from the scene
                // console.log("Box3Helper removed:", child);
                break;
            default:
                // Do nothing for objects that are not helpers
                break;
        }
    });
};

export const createBoundingBoxMesh = (model: THREE.Object3D) => {
    const bbox = new THREE.Box3().setFromObject(model);
    const boxGeometry = new THREE.BoxGeometry(
        bbox.max.x - bbox.min.x,
        bbox.max.y - bbox.min.y,
        bbox.max.z - bbox.min.z
    );
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true, // Hiển thị dạng khung dây nếu muốn giống BoxHelper
    });
    const boundingBoxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boundingBoxMesh.position.copy(bbox.getCenter(new THREE.Vector3()));
    return boundingBoxMesh;
};

