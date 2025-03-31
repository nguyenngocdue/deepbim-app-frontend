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
  console.log(face)
  // Convert from local space to world space
  face.localToWorld(vertexA);
  face.localToWorld(vertexB);
  face.localToWorld(vertexC);
  console.log('face1',vertexA, vertexB, vertexC)

  return [vertexA, vertexB, vertexC];
}

/**
 * Draws triangles for all faces of one or more meshes.
 * @param faces - A single THREE.Mesh or an array of THREE.Mesh objects containing face geometries
 * @param scene - The Three.js scene to add the drawn triangles to
 * @param color - The color of the triangle outlines (default is 0x00ff00 - green)
 */
export function drawTrianglesFromFaces(
    mesh: THREE.Mesh | THREE.Mesh[],
    scene: THREE.Scene,
    color: number = 0x00ff00
  ): void {
    // Ensure that mesh is always an array
    const faceArray = Array.isArray(mesh) ? mesh : [mesh];
  
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



// util.ts

export function highlightTriangleFace(intersect: THREE.Intersection, scene: THREE.Scene, color = 0x00FF00) {
  if (!intersect.face || !intersect.object) return;

  const highlightMaterial = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
    depthTest: false,
  });

  const geometry = intersect.object.geometry as THREE.BufferGeometry;
  const positionAttribute = geometry.attributes.position;

  const vertexA = new THREE.Vector3().fromBufferAttribute(positionAttribute, intersect.face.a);
  const vertexB = new THREE.Vector3().fromBufferAttribute(positionAttribute, intersect.face.b);
  const vertexC = new THREE.Vector3().fromBufferAttribute(positionAttribute, intersect.face.c);

  const faceGeometry = new THREE.BufferGeometry().setFromPoints([
    vertexA, vertexB, vertexC,
  ]);

  faceGeometry.setIndex([0, 1, 2]);
  faceGeometry.computeVertexNormals();

  const highlightMesh = new THREE.Mesh(faceGeometry, highlightMaterial);

  if (intersect.instanceId !== undefined && intersect.object instanceof THREE.InstancedMesh) {
    const instanceMatrix = new THREE.Matrix4();
    intersect.object.getMatrixAt(intersect.instanceId, instanceMatrix);
    highlightMesh.applyMatrix4(instanceMatrix);
  } else {
    highlightMesh.applyMatrix4(intersect.object.matrixWorld);
  }

  scene.add(highlightMesh);

  return highlightMesh;
}



export function highlightRectangleOnSurface(
  intersect: THREE.Intersection, 
  scene: THREE.Scene, 
  previousHighlight: THREE.Mesh | null, 
  color = 0xff0000, 
  size = 0.2
) {
  if (!intersect.face || !intersect.object) return previousHighlight;

  if (previousHighlight) {
    scene.remove(previousHighlight);
    previousHighlight.geometry.dispose();
    (previousHighlight.material as THREE.Material).dispose();
  }

  const highlightMaterial = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
    depthTest: false,
  });

  const geometry = intersect.object.geometry as THREE.BufferGeometry;
  const positionAttribute = geometry.attributes.position;

  const vertexA = new THREE.Vector3().fromBufferAttribute(positionAttribute, intersect.face.a);
  const vertexB = new THREE.Vector3().fromBufferAttribute(positionAttribute, intersect.face.b);
  const vertexC = new THREE.Vector3().fromBufferAttribute(positionAttribute, intersect.face.c);

  // Chuyển sang world space trước khi tính toán
  const matrixWorld = intersect.object instanceof THREE.InstancedMesh && intersect.instanceId !== undefined
    ? intersect.object.getMatrixAt(intersect.instanceId, new THREE.Matrix4()).multiply(intersect.object.matrixWorld)
    : intersect.object.matrixWorld;

  vertexA.applyMatrix4(matrixWorld);
  vertexB.applyMatrix4(matrixWorld);
  vertexC.applyMatrix4(matrixWorld);

  const edge1 = new THREE.Vector3().subVectors(vertexB, vertexA).normalize();
  const normal = new THREE.Vector3().crossVectors(
    edge1,
    new THREE.Vector3().subVectors(vertexC, vertexA)
  ).normalize();
  const edge2 = new THREE.Vector3().crossVectors(normal, edge1).normalize();

  const halfSize = size / 2;

  const rectVertexA = intersect.point.clone().add(edge1.clone().multiplyScalar(halfSize)).add(edge2.clone().multiplyScalar(halfSize));
  const rectVertexB = intersect.point.clone().sub(edge1.clone().multiplyScalar(halfSize)).add(edge2.clone().multiplyScalar(halfSize));
  const rectVertexC = intersect.point.clone().sub(edge1.clone().multiplyScalar(halfSize)).sub(edge2.clone().multiplyScalar(halfSize));
  const rectVertexD = intersect.point.clone().add(edge1.clone().multiplyScalar(halfSize)).sub(edge2.clone().multiplyScalar(halfSize));

  const faceGeometry = new THREE.BufferGeometry().setFromPoints([
    rectVertexA, rectVertexB, rectVertexC, rectVertexD,
  ]);

  faceGeometry.setIndex([0, 1, 2, 0, 2, 3]);
  faceGeometry.computeVertexNormals();

  const highlightMesh = new THREE.Mesh(faceGeometry, highlightMaterial);

  scene.add(highlightMesh);

  return highlightMesh;
}

