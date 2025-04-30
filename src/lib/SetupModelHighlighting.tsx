import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

interface SetupHighlightOptions {
  container: HTMLElement;
  model?: FRAGS.FragmentsModel;
  fragments: FRAGS.FragmentsModels;
  world: OBC.World;
  sphereColor?: string;
  sphereRadius?: number;
  onItemSelected?: () => void;
  onItemDeselected?: () => void;
}

export function SetupModelHighlighting({
  container,
  model,
  fragments,
  world,
  sphereColor = "#05f7d3",
  sphereRadius = 0.4,
  onItemSelected = () => {},
  onItemDeselected = () => {},
}: SetupHighlightOptions) {
  const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#ff6699"),
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),
    emissiveIntensity: 0.8,
    depthTest: false,
  };

  let currentLocalId: number | null = null;
  let currentModel: FRAGS.FragmentsModel | null = null;
  let highlightedMesh: THREE.Mesh | null = null;
  const mouse = new THREE.Vector2();

  let marker: THREE.Mesh | null = null;
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: sphereColor,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });

  // Track mouse down/up to distinguish click vs drag
  let isMouseDown = false;
  const mouseDownPos = new THREE.Vector2();
  const dragThreshold = 2; // px

  const resetMaterialDepthTest = (material: THREE.Material | THREE.Material[] | undefined) => {
    if (!material) return;

    if (Array.isArray(material)) {
      material.forEach((mat) => {
        mat.depthTest = true;
        mat.needsUpdate = true;
      });
    } else {
      material.depthTest = true;
      material.needsUpdate = true;
    }
  };

  const resetHighlight = async () => {
    if (!currentModel || currentLocalId === null) return;
    await currentModel.resetHighlight([currentLocalId]);
    resetMaterialDepthTest(highlightedMesh?.material);
    highlightedMesh = null;
    currentLocalId = null;
    currentModel = null;
  };

  const highlightObject = async (model: FRAGS.FragmentsModel, localId: number) => {
    await model.highlight([localId], highlightMaterial);
    const group = model.group;
    if (!group) {
      console.warn("Không tìm thấy group trong model!");
      return;
    }

    highlightedMesh = group.getObjectByName(localId.toString()) as THREE.Mesh | null;
  };

  const raycastAllModels = async ({
    camera,
    mouse,
    dom,
  }: {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    mouse: THREE.Vector2;
    dom: HTMLCanvasElement;
  }): Promise<FRAGS.RaycastResult | null> => {
    const results: FRAGS.RaycastResult[] = [];

    for (const [, model] of fragments.models.list) {
      const result = await model.raycast({ camera, mouse, dom });
      if (result) results.push(result);
    }

    return results.length
      ? results.reduce((closest, current) =>
          current.distance < closest.distance ? current : closest
        )
      : null;
  };

  const handleMouseDown = (event: MouseEvent) => {
    isMouseDown = true;
    mouseDownPos.set(event.clientX, event.clientY);
  };

  const removeMarker = () => {
    if (!marker) return;
    world.scene.three.remove(marker);
    marker.geometry.dispose();
    marker.material.dispose();
    marker = null;
    world.renderer.three.render(world.scene.three, world.camera.three);
  };

  const moveOrbitTarget = (point : THREE.Vector3) => {
      const controls = world.camera.controls;
      if (!controls) {
        console.warn("🚨 OrbitControls not found.");
        return;
      }
      controls.setOrbitPoint(point.x, point.y, point.z, true);
      controls.update();
    };

  const handleMouseUp = async (event: MouseEvent) => {
    removeMarker();
    if (!isMouseDown) return;
    isMouseDown = false;

    const deltaX = Math.abs(event.clientX - mouseDownPos.x);
    const deltaY = Math.abs(event.clientY - mouseDownPos.y);
    const isClick = deltaX < dragThreshold && deltaY < dragThreshold;

    if (!isClick) return;

    mouse.set(event.clientX, event.clientY);

    const result = await raycastAllModels({
      camera: world.camera.three,
      mouse,
      dom: world.renderer!.three.domElement!,
    });
    


    if (result) {
      await resetHighlight();
      removeMarker();
      
      const model = fragments.models.list.get(result.object.name);
      if (model) {
        currentLocalId = result.localId;
        currentModel = model;
        await highlightObject(model, result.localId);
        onItemSelected();
      }


          // create marker
    const { point } = result;
    marker = new THREE.Mesh(sphereGeometry.clone(), sphereMaterial.clone());
    marker.position.copy(point);
    world.scene.three.add(marker);
    world.renderer.three.render(world.scene.three, world.camera.three);
    moveOrbitTarget(point);


    } else {
      await resetHighlight();
      onItemDeselected();
    }

    fragments.update(true);
  };

  if (!container) {
    console.warn("Không tìm thấy container để gắn sự kiện click!");
    return () => {};
  }

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseup", handleMouseUp);

  return () => {
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseup", handleMouseUp);
    removeMarker();
  };
}
