import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { resetHighlight } from "@/lib/effects/Highlight";
import { createMarker, removeMarker } from "@/utils/markerUtils";
import { moveOrbitTarget } from "@/lib/effects/OrbitTarget";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { MultiSelectionManager } from "@/lib/selections/MultiSelectionManager";


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
  sphereColor = "#00ff00",
  sphereRadius = 0.5,
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
  outlinePass.visibleEdgeColor.set("#93fde7");
  outlinePass.hiddenEdgeColor.set("#93fde7");



  const currentSelection = {
    model: null as FRAGS.FragmentsModel | null,
    localId: null as number | null,
  };

  const selectionManager = MultiSelectionManager.getInstance();

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


    // console.log(selectedModel);

    // const highlightMaterial: FRAGS.MaterialDefinition = {
    //     color: new THREE.Color("#ff00ff"),
    //     renderedFaces: FRAGS.RenderedFaces.BOTH,
    //     opacity: 1,
    //     transparent: false,
    //     emissive: new THREE.Color("#ff99cc"),
    //     emissiveIntensity: 0.8,
    //   };
    
    // const eles = await selectedModel.getItemsOfCategory("IFCSLAB");

    // const ids = eles.map((item) => item._localId  );
    // if(ids){
    //   await selectedModel.highlight(ids, highlightMaterial)
    // }
  
 

  
    // Nếu không giữ Ctrl thì clear toàn bộ và chọn mới
    if (!event.ctrlKey) {
      await selectionManager.clear();
    }
    selectionManager.add(selectedModel, localId);

    // Highlight lại toàn bộ
    await selectionManager.highlightAll();
  
    onItemSelected();
    marker = createMarker(sphereRadius, sphereColor, point);
    world.scene.three.add(marker);
    world.renderer.three.render(world.scene.three, world.camera.three);
    
    if (focusCamera) moveOrbitTarget(point, world);
    animate();
  };
  
  function animate() {
    fragments.update();
    // composer.render(); 
    requestAnimationFrame(animate);
  }

  const handleDoubleClick = async (event: MouseEvent) => {
    mouse.set(event.clientX, event.clientY);

    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer.three.domElement,
    });

    if (!result) {
      await selectionManager.clear();
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
