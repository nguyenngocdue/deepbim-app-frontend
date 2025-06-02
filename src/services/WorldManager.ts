import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import { Ref } from "react";
import * as THREE from 'three';
import { containerManager } from "./ContainerManager";
import { useHighlightSetup } from "@/features/bim-viewer/useHighlightSetup";
import { restoreWorldBackground } from "@/features/bim-viewer/useWorldSettings";

// Singleton class để quản lý world và components
class WorldManager {
  private static instance: WorldManager; // Biến static để lưu instance
  private components: OBC.Components | null = null;
  private world: any | null = null;
  private container: any | null = null;
  private highlight:any | null = null;
  private fragments: any | null = null;

  private constructor() { }

  // Phương thức để lấy instance duy nhất của WorldManager
  public static getInstance(): WorldManager {
    if (!WorldManager.instance) {
      WorldManager.instance = new WorldManager();
    }
    return WorldManager.instance;
  }

  // Phương thức để khởi tạo world và components
  public async initialize():  Promise<void> {
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
    const container = containerManager.getRefOrThrow();
    this.world.renderer = new OBCF.PostproductionRenderer(this.components, container);
    this.world.camera = new OBC.OrthoPerspectiveCamera(this.components);
    this.world.camera.controls.setLookAt(280, 11, -102, 27, -52, -11);

    // Thiết lập các cấu hình cơ bản
    this.world.scene.setup();
    this.world.renderer.postproduction.enabled = true;
    this.components.init();
    // console.log("World and components have been initialized globally.");
    this.container = container;
    
    const components = this.components;
    // const fragments = components.get(OBC.FragmentsManager);
    
    const fragments = components.get(OBC.IfcLoader);
    await fragments.setup();
    this.fragments = fragments;

  
  }

  public getHighlightSetup(){
    if (!this.highlight) {
      console.error("Highlight is not initialized. Call initialize() first.");
    }
    return this.highlight;
  }
  public changeCameraType(isOrthographic: boolean): void {
    if (!this.world || !this.world.camera) {
      console.error("World or camera is not initialized.");
      return;
    }

    const currentCamera = this.world.camera;

    // Lưu trạng thái hiện tại của camera
    const savedState = {
      position: currentCamera.threePersp.position.clone(),
      target: new THREE.Vector3(),
    };
    if (currentCamera.controls && typeof currentCamera.controls.getTarget === "function") {
      currentCamera.controls.getTarget(savedState.target);
    } else {
      console.warn("Camera controls or getTarget() is not available.");
    }

    // Thay đổi chế độ chiếu
    if (isOrthographic) {
      currentCamera.projection.set("Orthographic");
      console.log("Switched to Orthographic mode.");
    } else {
      currentCamera.projection.set("Perspective");
      // console.log("Switched to Perspective mode.");
    }

    // Khôi phục trạng thái
    if (currentCamera.threePersp && currentCamera.threePersp.position) {
      currentCamera.threePersp.position.copy(savedState.position);
    }

    if (currentCamera.controls && typeof currentCamera.controls.setLookAt === "function") {
      currentCamera.controls.setLookAt(
        savedState.position.x,
        savedState.position.y,
        savedState.position.z,
        savedState.target.x,
        savedState.target.y,
        savedState.target.z,
        true // Kích hoạt animation nếu cần
      );
    } else {
      console.warn("Camera controls or setLookAt() is not available.");
    }
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
      console.error("World are not initialized. Call initialize() first.");
    }
    return this.components;
  }

  public getContainer(): any {
    if(!this.container){
      console.error('World are not initialized. Call initialize() first.');
    }
    return this.container;
  }

  public getFragments(): any {
    if(!this.fragments){
      console.error('World is not initialized. Call initialize() first.');
    }
    return this.fragments;
  }
}

// Export instance duy nhất của WorldManager
export const  worldManager = WorldManager.getInstance();