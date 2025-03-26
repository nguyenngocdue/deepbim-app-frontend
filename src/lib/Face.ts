import * as THREE from 'three';
import { drawTriangleWithLines } from './Drawing';

/**
 * Extracts the vertices of a face and converts them to world coordinates.
 * @param face - The THREE.Mesh object containing the geometry of the face
 * @returns An array of vertices (THREE.Vector3) converted to world space
 */
export function extractFaceVerticesToWorld(face: THREE.Mesh): THREE.Vector3[] {
  const positionAttribute = face.geometry.getAttribute('position');
  const indexAttribute = face.geometry.index;

  if (!indexAttribute) {
    throw new Error("Geometry does not have an index attribute.");
  }

  // Get the indices of the vertices in the first face
  const a = indexAttribute.getX(0); // Index of the first vertex
  const b = indexAttribute.getX(1); // Index of the second vertex
  const c = indexAttribute.getX(2); // Index of the third vertex

  // Get the coordinates of the vertices
  const vertexA = new THREE.Vector3().fromBufferAttribute(positionAttribute, a);
  const vertexB = new THREE.Vector3().fromBufferAttribute(positionAttribute, b);
  const vertexC = new THREE.Vector3().fromBufferAttribute(positionAttribute, c);

  // Convert from local space to world space
  face.localToWorld(vertexA);
  face.localToWorld(vertexB);
  face.localToWorld(vertexC);

  return [vertexA, vertexB, vertexC];
}

/**
 * Draws triangles for all faces of one or more meshes.
 * @param faces - A single THREE.Mesh or an array of THREE.Mesh objects containing face geometries
 * @param scene - The Three.js scene to add the drawn triangles to
 * @param color - The color of the triangle outlines (default is 0x00ff00 - green)
 */
export function drawTrianglesFromFaces(
    faces: THREE.Mesh | THREE.Mesh[],
    scene: THREE.Scene,
    color: number = 0x00ff00
  ): void {
    // Ensure that faces is always an array
    const faceArray = Array.isArray(faces) ? faces : [faces];
  
    // Iterate through each mesh in the array
    for (const face of faceArray) {
      const positionAttribute = face.geometry.getAttribute('position');
      const indexAttribute = face.geometry.index;
  
      if (!indexAttribute) {
        console.warn("Geometry does not have an index attribute. Skipping this mesh.");
        continue;
      }
  
      // Loop through all faces in the geometry
      for (let i = 0; i < indexAttribute.count; i += 3) {
        // Get the indices of the vertices in the current face
        const a = indexAttribute.getX(i);     // Index of the first vertex
        const b = indexAttribute.getX(i + 1); // Index of the second vertex
        const c = indexAttribute.getX(i + 2); // Index of the third vertex
  
        // Get the coordinates of the vertices
        const vertexA = new THREE.Vector3().fromBufferAttribute(positionAttribute, a);
        const vertexB = new THREE.Vector3().fromBufferAttribute(positionAttribute, b);
        const vertexC = new THREE.Vector3().fromBufferAttribute(positionAttribute, c);
  
        // Convert from local space to world space
        face.localToWorld(vertexA);
        face.localToWorld(vertexB);
        face.localToWorld(vertexC);
  
        // Draw the triangle with outlines
        const triangleLines = drawTriangleWithLines(vertexA, vertexB, vertexC, color);
        scene.add(triangleLines);
      }
    }
  }