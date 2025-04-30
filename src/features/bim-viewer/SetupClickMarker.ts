import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { resetHighlight } from "@/lib/effects/Highlight";
import { setModelTransparency } from "@/lib/effects/ModelTransparency";
import { createMarker, removeMarker } from "@/utils/markerUtils";
import { moveOrbitTarget } from "@/lib/effects/OrbitTarget";

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

export function setupClickMarker({
  container,
  model,
  fragments,
  world,
  sphereColor = "#05faf2",
  sphereRadius = 1,
  focusCamera = true,
  onItemSelected = () => {},
  onItemDeselected = () => {},
}: SetupClickMarkerOptions) {
  const mouse = new THREE.Vector2();
  let marker: THREE.Mesh | null = null;
  let highlightedMesh: THREE.Mesh | null = null;

  const currentSelection = {
    model: null as FRAGS.FragmentsModel | null,
    localId: null as number | null,
  };

  const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#ff6699"),
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),
    emissiveIntensity: 0.8,
    depthTest: false,
  };

  const handleMouseDown = async (event: MouseEvent) => {
    event.stopPropagation();
    mouse.set(event.clientX, event.clientY);

    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer.three.domElement,
    });

    if (!result) return;

    const { localId, object, point } = result;
    const selectedModel = fragments.models.list.get(object.name);
    if (!selectedModel) return;

    await resetHighlight(currentSelection, highlightedMesh);
    currentSelection.localId = localId;
    currentSelection.model = selectedModel;

    selectedModel.highlight([localId], highlightMaterial);
    setModelTransparency(model, true, 0.3);

    highlightedMesh = selectedModel.group?.getObjectByName(localId.toString()) as THREE.Mesh | null;

    onItemSelected();
    removeMarker(marker, world);
    marker = createMarker(sphereRadius, sphereColor, point);
    world.scene.three.add(marker);
    world.renderer.three.render(world.scene.three, world.camera.three);

    if (focusCamera) moveOrbitTarget(point, world);
  };

  const handleDoubleClick = async (event: MouseEvent) => {
    mouse.set(event.clientX, event.clientY);

    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer.three.domElement,
    });

    if (!result) {
      await resetHighlight(currentSelection, highlightedMesh);
      removeMarker(marker, world);
      onItemDeselected();
    }
  };

  const handleMouseUp = () => {
    removeMarker(marker, world);
  };

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseup", handleMouseUp);
  container.addEventListener("dblclick", handleDoubleClick);

  return () => {
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseup", handleMouseUp);
    container.removeEventListener("dblclick", handleDoubleClick);
    removeMarker(marker, world);
  };
}
