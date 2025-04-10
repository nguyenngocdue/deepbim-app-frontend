import * as THREE from 'three';

export class ThreeHighlighter {
  private scene: THREE.Scene;
  private hoveredMeshRef: THREE.Mesh | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Highlights the selected face of an intersected object.
   * @param intersection The intersection data from a raycaster.
   */
  highlightSelectedFace(intersection: THREE.Intersection) {
    if (!intersection.face || !(intersection.object as THREE.Mesh).geometry) return;

    // Remove existing highlight mesh if any
    this.scene.traverse((child) => {
      if (child.name === "highlightMesh") {
        this.scene.remove(child);
      }
    });

    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    const geometry = (intersection.object as THREE.Mesh).geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.attributes.position;
    const face = intersection.face;

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();

    vA.fromBufferAttribute(positionAttribute, face.a);
    vB.fromBufferAttribute(positionAttribute, face.b);
    vC.fromBufferAttribute(positionAttribute, face.c);

    const width = vA.distanceTo(vB);
    const height = vB.distanceTo(vC);

    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const highlightMesh = new THREE.Mesh(planeGeometry, highlightMaterial);
    highlightMesh.name = "highlightMesh";

    highlightMesh.position.copy(intersection.point);
    highlightMesh.lookAt(intersection.face.normal.clone().add(intersection.point));

    this.scene.add(highlightMesh);
  }

  /**
   * Highlights a hovered mesh by changing its material.
   * @param mesh The hovered mesh.
   */
  public highlightHoveredElement(mesh: THREE.Mesh) {
    if (!mesh) return;

    this.removeHoverHighlight();

    const originalMaterial = mesh.material;
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xf44336,
      side: THREE.DoubleSide,
    });

    mesh.userData.originalMaterial = originalMaterial;
    mesh.material = highlightMaterial;
    this.hoveredMeshRef = mesh;
  }

  /**
   * Removes the hover highlight effect from the previously hovered mesh.
   */
  removeHoverHighlight() {
    if (!this.hoveredMeshRef) return;

    const originalMaterial = this.hoveredMeshRef.userData.originalMaterial;
    if (originalMaterial) {
      this.hoveredMeshRef.material = originalMaterial;
    }

    this.hoveredMeshRef = null;
  }

  /**
   * Displays unique vertex points from a face (from measurements.getFace)
   * by rendering small red spheres at each point location.
   *
   * @param faces - The face object returned from measurements.getFace(...)
   * @param scene - The THREE.Scene to add the point markers to
   */
  showFacePoints(faces: any, scene: THREE.Scene) {
    if (!faces || !faces.edges || !scene) {
      console.warn("Invalid input to showFacePoints");
      return;
    }

    const sphereGeometry = new THREE.SphereGeometry(0.1); // Adjust size as needed
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const uniquePoints = new Map<string, THREE.Vector3>();

    for (const edge of faces.edges) {
      for (const point of edge.points) {
        const key = `${point.x.toFixed(5)},${point.y.toFixed(5)},${point.z.toFixed(5)}`;
        if (!uniquePoints.has(key)) {
          uniquePoints.set(key, point.clone());

          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.copy(point);
          scene.add(sphere);
        }
      }
    }

    console.log(`✅ Displayed ${uniquePoints.size} unique points on the face.`);
  }

  /**
 * Displays a list of 3D points as small red spheres in the given scene.
 *
 * @param points - Array of THREE.Vector3 positions
 * @param scene - The THREE.Scene to render the points in
 */
  showPoints(points: THREE.Vector3[]) {
    if (!points || !this.scene) {
      console.warn("Invalid input to showPoints");
      return;
    }

    const sphereGeometry = new THREE.SphereGeometry(0.1); // Change size if needed
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    for (const point of points) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(point);
      this.scene.add(sphere);
    }

    console.log(`✅ Displayed ${points.length} points.`);
  }
}
