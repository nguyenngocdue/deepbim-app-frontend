import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface SetupClickMarkerOptions {
  container: HTMLElement;
  model: FRAGS.FragmentsModel;
  world: OBC.World;
  sphereColor?: string;
  sphereRadius?: number;
  focusCamera?: boolean;
}

export function SetupClickMarker({
  container,
  model,
  world,
  sphereColor = "#F59492",
  sphereRadius = 0.4,
  focusCamera = true,
}: SetupClickMarkerOptions) {
  const mouse = new THREE.Vector2();
  let marker: THREE.Mesh | null = null;

  const fragments = (world as any).fragments as FRAGS.FragmentsModels | undefined;

  const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: sphereColor,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });

  const getOrbitControls = (): OrbitControls | null => {
    const controls = (world.camera as any).controls;
    return controls instanceof OrbitControls ? controls : null;
  };

  const moveOrbitTarget = (point: THREE.Vector3) => {
    const controls = getOrbitControls();
    if (!controls) {
      console.warn("OrbitControls không tồn tại.");
      return;
    }
  
    // Step 1: Lấy khoảng cách từ camera đến target hiện tại
    const currentTarget = controls.target.clone();
    const cam = world.camera.three;
  
    const direction = new THREE.Vector3().subVectors(cam.position, currentTarget).normalize();
    const distance = cam.position.distanceTo(currentTarget);
  
    // Step 2: Tính vị trí camera mới sao cho giữ nguyên khoảng cách
    const newCameraPosition = new THREE.Vector3().addVectors(point, direction.multiplyScalar(distance));
    cam.position.copy(newCameraPosition);
  
    // Step 3: Set lại target
    controls.target.copy(point);
    controls.update();
  
    console.log("📌 Camera moved to look at:", point);
  };
  

  const removeAllModels = () => {
    if (!fragments?.models?.list) return;

    for (const [modelId, fragModel] of fragments.models.list) {
      if (fragModel.group) world.scene.three.remove(fragModel.group);

      fragModel.meshes.forEach((mesh: THREE.Mesh) => {
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });

      fragments.models.list.delete(modelId);
    }

    world.renderer?.three.render(world.scene.three, world.camera.three);
  };

  const removeMarker = () => {
    if (!marker) return;
    world.scene.three.remove(marker);
    marker.geometry.dispose();
    (marker.material as THREE.Material).dispose();
    marker = null;
    world.renderer?.three.render(world.scene.three, world.camera.three);
  };

  const handleMouseDown = async (event: MouseEvent) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer?.three.domElement!,
    });

    if (!result) {
      console.log("❌ Không tìm thấy đối tượng raycast");
      return;
    }

    const { point } = result;

    removeAllModels();
    removeMarker();

    marker = new THREE.Mesh(sphereGeometry.clone(), sphereMaterial.clone());
    marker.position.copy(point);
    world.scene.three.add(marker);
    world.renderer?.three.render(world.scene.three, world.camera.three);

    console.log("✅ Marker mới tại:", point);

    if (focusCamera) {
      moveOrbitTarget(point);
    }
  };

  const handleMouseUp = () => {
    removeMarker();
  };

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseup", handleMouseUp);

  return () => {
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseup", handleMouseUp);
    removeMarker();
    removeAllModels();
  };
}
