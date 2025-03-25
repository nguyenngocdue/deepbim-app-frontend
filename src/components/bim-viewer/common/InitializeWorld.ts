import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from 'three';

export function InitializeWorld(container: HTMLDivElement, haveGrids: boolean = false) {
  const components = new OBC.Components();
  const worlds = components.get(OBC.Worlds);
  // Tạo world
  const world = worlds.create<
    OBC.SimpleScene,
    OBC.SimpleCamera,
    OBCF.PostproductionRenderer
  >();

  world.scene = new OBC.SimpleScene(components);
  world.renderer = new OBCF.PostproductionRenderer(components, container);
  world.camera = new OBC.SimpleCamera(components);

  // Khởi tạo Camera và gán vào world.camera
  const orthoPerspectiveCamera = new OBC.OrthoPerspectiveCamera(components);
  world.camera = orthoPerspectiveCamera;

  // Cấu hình camera
  orthoPerspectiveCamera.controls.setLookAt(24, 12, 16, 0, 0, -10);

  // Thiết lập Scene
  world.scene.setup();

  world.renderer.postproduction.enabled = true;
  components.init();

  // Thêm Grid
  const grids = components.get(OBC.Grids);
  const grid = grids.create(world);
  
  // // Lắng nghe sự kiện thay đổi chế độ camera
  // world.camera.projection.onChanged.add(() => {
  //   console.log("object")
  //   const projection = world.camera.projection.current;
  //   console.log("Current projection:", projection);

  //   if (grid) {
  //     grid.fade = projection === "Perspective";
  //   }
  // });


    // configuration
    // world.scene.config.backgroundColor="#28d765"
    // world.scene.config.directionalLight.intensity=1
    // world.scene.config.ambientLight.intensity = 10
  return { world, components, grid };
}