import * as THREE from 'three';

/**
 * Draws wireframe edges for each triangle in a given mesh.
 * @param mesh The mesh from which to extract triangles.
 * @returns A THREE.LineSegments object representing the edges.
 */
export const drawTrianglesFromMesh = (mesh: THREE.Mesh): THREE.LineSegments => {
    // Ensure the mesh's world transformation matrix is updated
    mesh.updateMatrixWorld(true);

    // Get the geometry from the mesh
    const geometry = mesh.geometry;
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
    const lineGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const vertices = geometry.attributes.position.array;

    if (geometry.index) {
        const indices = geometry.index.array;
        for (let i = 0; i < indices.length; i += 3) {
            const v1 = indices[i] * 3;
            const v2 = indices[i + 1] * 3;
            const v3 = indices[i + 2] * 3;

            const vertex1 = new THREE.Vector3(vertices[v1], vertices[v1 + 1], vertices[v1 + 2]);
            const vertex2 = new THREE.Vector3(vertices[v2], vertices[v2 + 1], vertices[v2 + 2]);
            const vertex3 = new THREE.Vector3(vertices[v3], vertices[v3 + 1], vertices[v3 + 2]);

            vertex1.applyMatrix4(mesh.matrixWorld);
            vertex2.applyMatrix4(mesh.matrixWorld);
            vertex3.applyMatrix4(mesh.matrixWorld);

            positions.push(vertex1.x, vertex1.y, vertex1.z, vertex2.x, vertex2.y, vertex2.z);
            positions.push(vertex2.x, vertex2.y, vertex2.z, vertex3.x, vertex3.y, vertex3.z);
            positions.push(vertex3.x, vertex3.y, vertex3.z, vertex1.x, vertex1.y, vertex1.z);
        }
    } else {
        for (let i = 0; i < vertices.length; i += 9) {
            const vertex1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            const vertex2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            const vertex3 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

            vertex1.applyMatrix4(mesh.matrixWorld);
            vertex2.applyMatrix4(mesh.matrixWorld);
            vertex3.applyMatrix4(mesh.matrixWorld);

            positions.push(vertex1.x, vertex1.y, vertex1.z, vertex2.x, vertex2.y, vertex2.z);
            positions.push(vertex2.x, vertex2.y, vertex2.z, vertex3.x, vertex3.y, vertex3.z);
            positions.push(vertex3.x, vertex3.y, vertex3.z, vertex1.x, vertex1.y, vertex1.z);
        }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return new THREE.LineSegments(lineGeometry, material);
};
