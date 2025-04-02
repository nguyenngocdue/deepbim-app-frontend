import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from 'three';
import * as OBF from "@thatopen/components-front";

export function InitializeWorld(
  container: HTMLDivElement,
  haveGrids: true,
  isOrthoPerspective: boolean = false
) {
  const components = new OBC.Components();
  const worlds = components.get(OBC.Worlds);

  // Tạo world
  const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBF.PostproductionRenderer
  >();

  world.scene = new OBC.SimpleScene(components);
  world.renderer = new OBCF.PostproductionRenderer(components, container);
  world.camera = new OBC.OrthoPerspectiveCamera(components);

  // if (isOrthoPerspective) {
  //   const orthoPerspectiveCamera = new OBC.OrthoPerspectiveCamera(components);
  //   world.camera = orthoPerspectiveCamera;
  //   orthoPerspectiveCamera.controls.setLookAt(30, 20, 30, 0, 0, 0);
  // }

  const worldGrid = components.get(OBC.Grids).create(world);
  worldGrid.material.uniforms.uColor.value = new THREE.Color(0x999999);
  worldGrid.material.uniforms.uSize1.value = 2;
  worldGrid.material.uniforms.uSize2.value = 8;
  // Thiết lập Scene
  world.scene.setup();
  world.renderer.postproduction.enabled = true;
  components.init();


  return { world, components };
}