// AxesUtils.ts
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Creates a 3D text label for an axis.
 * @param text - The label text (e.g., "X", "Y", "Z").
 * @param position - The position of the label in 3D space.
 * @param color - The color of the label.
 * @param size - The size of the text.
 * @returns A mesh representing the label.
 */
export const createTextLabel = async (
    text: string,
    position: THREE.Vector3,
    color: number = 0xffffff,
    size: number = 0.5
): Promise<THREE.Mesh> => {
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync("/fonts/helvetiker_regular.typeface.json"); // Path to font

    // Create text geometry
    const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        height: 0.1, // Thickness of the text
        curveSegments: 12,
        bevelEnabled: false,
    });

    // Center the geometry
    textGeometry.center();

    // Create material
    const material = new THREE.MeshBasicMaterial({ color: color });

    // Create mesh
    const textMesh = new THREE.Mesh(textGeometry, material);

    // Set position
    textMesh.position.copy(position);

    return textMesh;
};

/**
 * Adds axes and text labels to the scene.
 * @param world - The world object containing the Three.js scene.
 * @param axesSize - The size of the axes helper.
 * @param textSize - The size of the text labels.
 */
export const addAxesWithTextLabelsToScene = async (
    world: { scene: { three: THREE.Scene } },
    axesSize: number = 5,
    textSize: number = 0.5
) => {
    if (!world || !world.scene || !world.scene.three) return;

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(axesSize);
    world.scene.three.add(axesHelper);

    // Define labels for the axes
    const labels = [
        { text: "X", position: new THREE.Vector3(axesSize + 0.5, 0, 0), color: 0xff0000 }, // X-axis
        { text: "Y", position: new THREE.Vector3(0, axesSize + 0.5, 0), color: 0x00ff00 }, // Y-axis
        { text: "Z", position: new THREE.Vector3(0, 0, axesSize + 0.5), color: 0x0000ff }, // Z-axis
    ];

    // Add text labels to the scene
    for (const { text, position, color } of labels) {
        const label = await createTextLabel(text, position, color, textSize);
        world.scene.three.add(label);
    }
};

export const removeAxesWithTextLabelsFromScene = (scene: THREE.Scene) => {
    const axesHelper = scene.getObjectByName("axesHelper");
    if (axesHelper) {
        scene.remove(axesHelper);
    }

    // Xóa các nhãn văn bản (text labels)
    scene.children.forEach((child) => {
        if (child.name.startsWith("axisLabel")) {
            scene.remove(child);
        }
    });
};