import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";

export function InitializeWorld(container: HTMLDivElement) {
  const components = new OBC.Components();

  // Tạo world
  const world = components
    .get(OBC.Worlds)
    .create<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBCF.PostproductionRenderer>();

  // Khởi tạo Scene
  world.scene = new OBC.SimpleScene(components);
  world.scene.three.background = new THREE.Color(0xcccccc);

  // Khởi tạo Renderer
  world.renderer = new OBCF.PostproductionRenderer(components, container);

  // Khởi tạo Camera và gán vào world.camera
  const orthoPerspectiveCamera = new OBC.OrthoPerspectiveCamera(components);
  world.camera = orthoPerspectiveCamera;

  // Cấu hình camera
  orthoPerspectiveCamera.controls.setLookAt(12, 6, 8, 0, 0, -10);
  orthoPerspectiveCamera.projection.set("Orthographic");

  // Thiết lập Scene
  world.scene.setup();

  // Bật Postproduction
  world.renderer.postproduction.enabled = true;

  // Khởi tạo Components
  components.init();

  // Thêm Grid
  const grids = components.get(OBC.Grids);
  const grid = grids.create(world);
  if (grid) {
    grid.config.primarySize = 10;
    grid.config.secondarySize = 10;
    grid.config.visible = true;

    // Điều chỉnh fade dựa trên chế độ camera
    grid.fade = world.camera.projection.current === "Perspective";
  }

  // Lắng nghe sự kiện thay đổi chế độ camera
  world.camera.projection.onChanged.add(() => {
    const projection = world.camera.projection.current;
    console.log("Current projection:", projection);

    if (grid) {
      grid.fade = projection === "Perspective";
    }
  });

  return { world, components };
}