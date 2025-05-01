import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { resetHighlight } from "@/lib/effects/Highlight";
import { setModelTransparency } from "@/lib/effects/ModelTransparency";
import { createMarker, removeMarker } from "@/utils/markerUtils";
import { moveOrbitTarget } from "@/lib/effects/OrbitTarget";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { SelectionStore } from "@/services/SelectionStore";


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
  sphereColor = "#fa05ac",
  sphereRadius = 1,
  focusCamera = true,
  onItemSelected = () => {},
  onItemDeselected = () => {},
}: SetupClickMarkerOptions) {
  const mouse = new THREE.Vector2();
  let marker: THREE.Mesh | null = null;
  let highlightedMesh: THREE.Mesh | null = null;



  const composer = new EffectComposer(world.renderer.three);
  composer.addPass(new RenderPass(world.scene.three, world.camera.three));

  const outlinePass = new OutlinePass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    world.scene.three,
    world.camera.three
  );
  composer.addPass(outlinePass);

  // Optional: viền màu hồng sáng
  outlinePass.edgeStrength = 3.0;
  outlinePass.edgeGlow = 0.5;
  outlinePass.edgeThickness = 1.0;
  outlinePass.visibleEdgeColor.set("#ff99cc");
  outlinePass.hiddenEdgeColor.set("#000000");



  const currentSelection = {
    model: null as FRAGS.FragmentsModel | null,
    localId: null as number | null,
  };

  const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#F59492"),
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),
    emissiveIntensity: 0.8,
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

    // outlinePass.selectedObjects = [object];
    // animate()
    
    const selectedModel = fragments.models.list.get(object.name);
    // query and store object from raycaster 
    SelectionStore.set(localId, object, point, selectedModel);
    

    if (!selectedModel) return;

    await resetHighlight(currentSelection, highlightedMesh);
    currentSelection.localId = localId;
    currentSelection.model = selectedModel;
    selectedModel.highlight([localId], highlightMaterial);

    // const i = await selectedModel.getItem(String(localId));

    highlightedMesh = selectedModel.object?.getObjectByName(localId.toString()) as THREE.Mesh | null;

    onItemSelected();
    marker = createMarker(sphereRadius, sphereColor, point);
    world.scene.three.add(marker);
    world.renderer.three.render(world.scene.three, world.camera.three);

    if (focusCamera) moveOrbitTarget(point, world);
    animate();
  };

  function animate() {
    fragments.update();
    requestAnimationFrame(animate);
    // composer.render(); 
  }

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
