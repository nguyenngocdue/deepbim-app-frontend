// PointUtils.ts
import * as THREE from "three";

/**
 * Creates a key point represented by a small sphere.
 * @param position - The position of the point in 3D space.
 * @param color - The color of the sphere.
 * @param size - The radius of the sphere.
 * @returns A mesh representing the key point.
 */
export const createKeyPoint = (
    position: THREE.Vector3,
    color: number = 0xff0000,
    size: number = 0.1
): THREE.Mesh => {
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(size, 8, 8); // Low-resolution sphere

    // Create material with the specified color
    const material = new THREE.MeshBasicMaterial({ color: color });

    // Create a mesh from the geometry and material
    const sphere = new THREE.Mesh(geometry, material);

    // Set the position of the sphere
    sphere.position.copy(position);

    return sphere;
};

/**
 * Adds key points to the scene based on predefined positions.
 * @param world - The world object containing the Three.js scene.
 * @param positions - An array of positions (THREE.Vector3[]) where key points should be added.
 * @param colors - An optional array of colors for each point. If not provided, default colors will be used.
 */
export const addKeyPointsToScene = (
    world: { scene: { three: THREE.Scene } },
    positions: THREE.Vector3[],
    colors: number[] = [
        0xff0000, // Red
        0x00ff00, // Green
        0x0000ff, // Blue
        0xffff00, // Yellow
        0xff00ff, // Magenta
        0x00ffff, // Cyan
    ]
) => {
    if (!world || !world.scene || !world.scene.three) return;

    // Add key points to the scene
    positions.forEach((position, index) => {
        const color = colors[index % colors.length]; // Cycle through colors if there are more points than colors
        const sphere = createKeyPoint(position, color, 0.1);
        world.scene.three.add(sphere);
    });
    return positions
};


/**
 * Adds a point cloud to the given scene.
 * @param {THREE.Vector3[]} points - An array of points (THREE.Vector3) representing the vertices to be displayed in the point cloud.
 * @param {THREE.Scene} scene - The Three.js scene where the point cloud will be added.
 */
export function addPointsToScene(
    points: THREE.Vector3[], 
    scene: THREE.Scene
): void {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
}
