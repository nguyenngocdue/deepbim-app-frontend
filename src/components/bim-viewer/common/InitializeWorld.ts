import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from 'three';
import * as OBF from "@thatopen/components-front";
import { useHighlightSetup } from "@/features/bim-viewer/useHighlightSetup";
import { gridManager } from "@/services/GridManager";

export function InitializeWorld(
  container: HTMLDivElement,
) {
  const components = new OBC.Components();
  const worlds = components.get(OBC.Worlds);
  console.log("components");

  // Tạo world
  const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBF.PostproductionRenderer
  >();

  world.scene = new OBC.SimpleScene(components);
  world.renderer = new OBCF.PostproductionRenderer(components, container);
  world.camera = new OBC.OrthoPerspectiveCamera(components);
  
  // const projection = world.camera.projection; 
  // projection.set("Perspective")

  gridManager.createGrid(components, world);

  // Thiết lập Scene
  world.scene.setup();
  // world.scene.three.background = new THREE.Color(0x020817);
  world.renderer.postproduction.enabled = true;
  components.init();




  const { postproduction } = world.renderer;
  postproduction.enabled = true;
  postproduction.setPasses({ custom: true, ao: true, gamma: true });

  // useHighlightSetup({components, world})
  return { world, components };
}