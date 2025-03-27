import { createBoundingBoxMesh } from "@/lib/BoudingBox";
import { selectWithBVH } from "@/lib/SelectWithBVH";
import * as OBC from "@thatopen/components";
import { useEffect } from "react";
import * as THREE from 'three';
import { SelectionBox } from 'three/addons/interactive/SelectionBox.js';
import { SelectionHelper } from 'three/addons/interactive/SelectionHelper.js';

interface FreeControlElements2Props {
  isFreeControlElements2: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}


export function useFreeControlElements2({
  isFreeControlElements2,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: FreeControlElements2Props) {
  useEffect(() => {
    if (!isFreeControlElements2) return;

    // Kiểm tra các tham chiếu đầu vào
    const components = componentRef.current;
    const world = worldRef.current;
    const container = ifcContainerRef.current;
    const model = modelRef.current;

    if (!components || !world || !container || !model) {
      console.error("Invalid references");
      return;
    }

    const camera = world.camera.three;
    const scene = world.scene.three;

    world.camera.enabled = false;

    // Thêm mesh vào world
    const addMeshToWorld = (child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.geometry && child.material) {
        world.meshes.add(child);
      } else {
        console.warn("Invalid child skipped:", child);
      }
    };

    for (const child of model.children) {
      addMeshToWorld(child);
    }

    // Tạo các mesh demo
    const createDemoMesh = (geometry: THREE.BufferGeometry, color: string) => {
      const material = new THREE.MeshPhongMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    };

    const boxMesh = createDemoMesh(new THREE.BoxGeometry(2, 2, 3), '6fa8dc');
    const boxMesh2 = createDemoMesh(new THREE.BoxGeometry(20, 2, 3), '6fa8dc');

    scene.add(boxMesh);
    scene.add(boxMesh2);

    // Khởi tạo SelectionBox
    const selectionBox = new SelectionBox(camera, scene);
    selectionBox.collection = [];

    // Thêm mesh vào collection của SelectionBox
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry && child.material) {
        selectionBox.collection.push(child);
      }
    });

    // console.log("SelectionBox collection:", selectionBox.collection);

    // Khởi tạo SelectionHelper
    const rendererDom = worldRef.current?.renderer?.three;
    if (!rendererDom) {
      console.error("Renderer DOM not found");
      return;
    }
    const helper = new SelectionHelper(rendererDom, "selectBox");

    // Xử lý sự kiện pointerdown
    const onPointerDown = (event: PointerEvent) => {
      selectionBox.startPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
    };

    // Xử lý sự kiện pointermove
    const onPointerMove = (event: PointerEvent) => {
      if (!helper.isDown) return;

      // const cameraHelper = new THREE.CameraHelper(camera);
      // worldRef.current.scene.three.add(cameraHelper);
      // Chọn đối tượng bằng BVH
      const selected = selectWithBVH(
        camera,
        selectionBox.startPoint,
        selectionBox.endPoint,
        selectionBox.collection,
        worldRef
      );

      // Reset màu sắc của tất cả mesh trong collection
      for (const mesh of selectionBox.collection) {
        if (mesh.material instanceof THREE.Material) {
          mesh.material.color.set(0x9FC5E8); // Màu xanh nhạt
        }
      }

      // Cập nhật endPoint
      selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      
    };

    // Xử lý sự kiện pointerup
    const onPointerUp = (event: PointerEvent) => {
      selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      console.log("selectionBox.collection:", selectionBox.collection);

      // const allSelected = selectionBox.select();

      const selected = selectWithBVH(
        camera,
        selectionBox.startPoint,
        selectionBox.endPoint,
        selectionBox.collection,
        worldRef
      );

      console.log("All selecte d meshes:", selected);
      
      // Thay đổi màu sắc của các mesh được chọn
      for (const mesh of selected) {
          mesh.material[0].color.set(0xFF00FF); // Màu xanh lá cây
      }
      world.camera.enabled = true;

      
    };

    // Gắn event listener
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Cleanup
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      // Xóa các mesh demo khỏi scene
      scene.remove(boxMesh);
      scene.remove(boxMesh2);
    };
  }, [
    isFreeControlElements2,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
  ]);
}