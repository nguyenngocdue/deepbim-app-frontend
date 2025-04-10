import * as THREE from 'three';
import * as OBC from "@thatopen/components";

/**
 * Utility function to perform raycasting and highlight a mesh face.
 * @param worldRef - React mutable reference to the current world object.
 * @param event - The mouse event triggering the raycast.
 */
export function highlightMeshOnRaycast(
    worldRef: React.RefObject<any>, // Replace with a more specific type if needed
    event: MouseEvent
): void {
    const components = new OBC.Components();
    const world = worldRef.current;

    if (!world) return;

    // Get or initialize the Raycaster
    const raycasters = components.get(OBC.Raycasters);
    let caster = raycasters.get(world);
    if (!caster) {
        raycasters.set(world);
        caster = raycasters.get(world);
    }

    // Configure the Raycaster
    caster.camera = world.camera.three;
    caster.world = world;

    // Calculate mouse position in Normalized Device Coordinates (NDC)
    const canvas = world.renderer.three.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    caster.mouse.position.set(x, y);

    // Collect all meshes in the scene
    const meshes: THREE.Mesh[] = [];
    world.scene.three.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            meshes.push(child);
        }
    });

    // Perform raycasting
    const result = caster.castRay(meshes); // Returns an object or null
    const measurements = components.get(OBC.MeasurementUtils);

    if (result && result.face && result.object) {
        const mesh = result.object as THREE.Mesh | THREE.InstancedMesh;
        const instance = result.instance;
        const faceIndex = result.faceIndex!;

        // Get face information using MeasurementUtils
        const faceData = measurements.getFace(mesh, faceIndex, instance);
        if (!faceData || !faceData.indices) {
            console.warn("❌ Unable to retrieve face data from measurements.");
            return;
        }
        const faceIndices = Array.from(faceData.indices);
        // Regenerate geometry and calculate area
        const { geometry, area } = regenerateHighlight(
            mesh,
            faceIndices,
            instance,
            (m, i, inst) => measurements.getVerticesAndNormal(m, i, inst)
        );
        console.log("📐 Selected face area:", area.toFixed(4));

        // Create a highlight material
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            opacity: 0.6,
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
        });

        const highlightMesh = new THREE.Mesh(geometry, highlightMaterial);

        // Position the highlight mesh correctly in the world
        highlightMesh.position.set(0, 0, 0);
        highlightMesh.rotation.set(0, 0, 0);
        highlightMesh.scale.set(1, 1, 1);
        highlightMesh.updateMatrix();

        if (mesh instanceof THREE.InstancedMesh && instance !== undefined) {
            const matrix = new THREE.Matrix4();
            mesh.getMatrixAt(instance, matrix);
            highlightMesh.applyMatrix4(matrix);
        } else {
            highlightMesh.applyMatrix4(mesh.matrixWorld);
        }

        // Add the highlight mesh to the scene
        world.scene.three.add(highlightMesh);
    }
}


function regenerateHighlight(
    mesh: THREE.Mesh,
    indices: Iterable<number>,
    instance: number | undefined,
    getVerts: (
        mesh: THREE.Mesh,
        faceIndex: number,
        instance?: number
    ) => {
        p1: THREE.Vector3;
        p2: THREE.Vector3;
        p3: THREE.Vector3;
    }
): { geometry: THREE.BufferGeometry; area: number } {
    const positions: number[] = [];
    const triangleIndices: number[] = [];
    let area = 0;
    let counter = 0;

    const triangle = new THREE.Triangle();

    for (const faceIndex of indices) {
        const { p1, p2, p3 } = getVerts(mesh, faceIndex, instance);

        positions.push(p1.x, p1.y, p1.z);
        positions.push(p2.x, p2.y, p2.z);
        positions.push(p3.x, p3.y, p3.z);

        triangle.set(p1, p2, p3);
        area += triangle.getArea();

        triangleIndices.push(counter, counter + 1, counter + 2);
        counter += 3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(triangleIndices);
    geometry.computeVertexNormals();

    return { geometry, area };
}
