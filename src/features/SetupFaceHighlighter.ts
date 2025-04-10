import * as THREE from "three";
import * as OBC from "@thatopen/components";

/**
 * Sets up face highlighting and area calculation on canvas click.
 * You can call this function manually (e.g. after viewer is ready).
 *
 * @param world - The current OBC.World instance.
 * @param container - The HTML container that wraps the viewer's canvas.
 */
export function setupFaceHighlighter(
  world: OBC.World,
  container: HTMLElement
) {
  if (!world || !container) {
    console.warn("⚠️ Missing world or container");
    return;
  }

  const components = new OBC.Components();
  const measurements = components.get(OBC.MeasurementUtils);

  const raycasters = components.get(OBC.Raycasters);
  let caster = raycasters.get(world);
  if (!caster) {
    raycasters.set(world);
    caster = raycasters.get(world);
  }

  caster.camera = world.camera.three;
  caster.world = world;

  const canvas = world.renderer.three.domElement;

  const handleClick = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    caster.mouse.position.set(x, y);

    const meshes: THREE.Mesh[] = [];
    world.scene.three.traverse((child) => {
      if (child instanceof THREE.Mesh) meshes.push(child);
    });

    const result = caster.castRay(meshes);
    if (!result || !result.face || !result.object) return;

    const mesh = result.object as THREE.Mesh | THREE.InstancedMesh;
    const instance = result.instance;
    const faceIndex = result.faceIndex!;

    const faceData = measurements.getFace(mesh, faceIndex, instance);
    if (!faceData?.indices) return;

    const faceIndices = Array.from(faceData.indices);

    const { geometry, area } = regenerateHighlight(
      mesh,
      faceIndices,
      instance,
      (m, i, inst) => measurements.getVerticesAndNormal(m, i, inst)
    );

    console.log("📐 Face area:", area.toFixed(4));

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthTest: false,
    });

    const highlightMesh = new THREE.Mesh(geometry, material);

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

    world.scene.three.add(highlightMesh);
  };

  container.addEventListener("click", handleClick);

  // Return cleanup function if needed
  return () => {
    container.removeEventListener("click", handleClick);
  };
}


/**
 * Generates a BufferGeometry from a set of face indices, and calculates its area.
 *
 * @param mesh - The mesh containing the geometry.
 * @param indices - An iterable of face indices to highlight.
 * @param instance - Optional instance index if working with InstancedMesh.
 * @param getVerts - A function to retrieve the 3 vertices of a face.
 * @returns A new BufferGeometry representing the selected faces and their total area.
 */
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
  
      // Add 3 vertices to position buffer
      positions.push(p1.x, p1.y, p1.z);
      positions.push(p2.x, p2.y, p2.z);
      positions.push(p3.x, p3.y, p3.z);
  
      // Compute area of triangle
      triangle.set(p1, p2, p3);
      area += triangle.getArea();
  
      // Build index buffer (triangle connectivity)
      triangleIndices.push(counter, counter + 1, counter + 2);
      counter += 3;
    }
  
    // Construct new BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(triangleIndices);
    geometry.computeVertexNormals();
  
    return { geometry, area };
  }
  