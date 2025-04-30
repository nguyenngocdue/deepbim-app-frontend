import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

interface SetupClickMarkerOptions {
  container: HTMLElement;
  model: FRAGS.FragmentsModel;
  fragments: FRAGS.FragmentsModels;
  world: OBC.World;
  sphereColor?: string;
  sphereRadius?: number;
  focusCamera?: boolean;
  onItemSelected?: () => void;
  onItemDeselected?: () => void;
}

export function SetupClickMarker({
  container,
  model,
  fragments,
  world,
  sphereColor = "#05f7d3",
  sphereRadius = 0.4,
  focusCamera = true,
  onItemSelected = () => {},
  onItemDeselected = () => {},
}: SetupClickMarkerOptions) {
  const mouse = new THREE.Vector2();
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: sphereColor,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });

  const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#ff6699"),
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),
    emissiveIntensity: 0.8,
    depthTest: false,
  };

  let marker: THREE.Mesh | null = null;
  let highlightedMesh: THREE.Mesh | null = null;

  const currentSelection = {
    model: null as FRAGS.FragmentsModel | null,
    localId: null as number | null,
  };

  const removeMarker = () => {
    if (!marker) return;
    world.scene.three.remove(marker);
    marker.geometry.dispose();
    marker.material.dispose();
    marker = null;
    world.renderer.three.render(world.scene.three, world.camera.three);
  };

  const resetMaterialDepthTest = (material: THREE.Material | THREE.Material[] | undefined) => {
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((mat) => {
      mat.depthTest = true;
      mat.needsUpdate = true;
    });
  };

  const resetHighlight = async () => {
    const { model, localId } = currentSelection;
    if (!model || localId === null) return;
    await model.resetHighlight([localId]);
    resetMaterialDepthTest(highlightedMesh?.material);
    highlightedMesh = null;
    currentSelection.model = null;
    currentSelection.localId = null;
  };

  const highlight = async (model: FRAGS.FragmentsModel, localId: number) => {
    await model.highlight([localId], highlightMaterial);
    const mesh = model.group?.getObjectByName(localId.toString()) as THREE.Mesh | null;
    highlightedMesh = mesh;
  };

  const moveOrbitTarget = (point: THREE.Vector3) => {
    const controls = world.camera.controls;
    if (!controls) {
      console.warn("🚨 OrbitControls not found.");
      return;
    }
    controls.setOrbitPoint(point.x, point.y, point.z, true);
    controls.update();
  };

  const handleMouseDown = async (event: MouseEvent) => {
    event.stopPropagation();
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  
    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer.three.domElement,
    });
  
    // Nếu không trúng đối tượng → không reset
    if (!result) return;
  
    const { localId, object, point } = result;
    const selectedModel = fragments.models.list.get(object.name);
    if (!selectedModel) {
      console.warn("Không tìm thấy model phù hợp.");
      return;
    }
  
  
      await resetHighlight();
      currentSelection.localId = localId;
      currentSelection.model = selectedModel;
  
      // Highlight nhanh
      selectedModel.highlight([localId], highlightMaterial);
      highlightedMesh = selectedModel.group?.getObjectByName(localId.toString()) as THREE.Mesh | null;
  
      onItemSelected();
  
      // Vẽ marker
      removeMarker();
      marker = new THREE.Mesh(sphereGeometry.clone(), sphereMaterial.clone());
      marker.position.copy(point);
      world.scene.three.add(marker);
      world.renderer.three.render(world.scene.three, world.camera.three);
  
      if (focusCamera) moveOrbitTarget(point);
  };

  const handleDoubleClick = async (event: MouseEvent) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  
    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer.three.domElement,
    });
  
    if (!result) {
      await resetHighlight();
      removeMarker();
      onItemDeselected();
    }
  };

  const handleMouseUp = () => {
    removeMarker();
  };

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseup", handleMouseUp);
  container.addEventListener("dblclick", handleDoubleClick);

  return () => {
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseup", handleMouseUp);
    container.removeEventListener("dblclick", handleDoubleClick);
    removeMarker();
  };
}
