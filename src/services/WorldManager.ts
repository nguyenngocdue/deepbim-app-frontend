import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";

// Singleton class để quản lý world và components
class WorldManager {
  private static instance: WorldManager; // Biến static để lưu instance
  public components: OBC.Components | null = null;
  public world: any | null = null;

  private constructor() {}

  // Phương thức để lấy instance duy nhất của WorldManager
  public static getInstance(): WorldManager {
    if (!WorldManager.instance) {
      WorldManager.instance = new WorldManager();
    }
    return WorldManager.instance;
  }

  // Phương thức để khởi tạo world và components
  public initialize(container: HTMLDivElement): void {
    // Khởi tạo components
    this.components = new OBC.Components();

    // Lấy worlds từ components
    const worlds = this.components.get(OBC.Worlds);

    // Tạo world
    this.world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >();

    // Thiết lập scene, camera, và renderer
    this.world.scene = new OBC.SimpleScene(this.components);
    this.world.renderer = new OBCF.PostproductionRenderer(this.components, container);
    this.world.camera = new OBC.OrthoPerspectiveCamera(this.components);

    // Thiết lập các cấu hình cơ bản
    this.world.scene.setup();
    this.world.renderer.postproduction.enabled = true;
    this.components.init();

    console.log("World and components have been initialized globally.");
  }

  // Phương thức để lấy world
  public getWorld(): any {
    if (!this.world) {
      console.error("World is not initialized. Call initialize() first.");
    }
    return this.world;
  }

  // Phương thức để lấy components
  public getComponents(): OBC.Components | null {
    if (!this.components) {
      console.error("Components are not initialized. Call initialize() first.");
    }
    return this.components;
  }
}

// Export instance duy nhất của WorldManager
export const worldManager = WorldManager.getInstance();