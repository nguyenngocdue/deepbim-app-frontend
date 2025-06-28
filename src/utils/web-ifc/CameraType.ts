import { CameraActions } from "@/components/ifc-classifier/CameraActionsController";
import { invalidate } from "@react-three/fiber";
import * as THREE from "three";

export function setCameraType(
  type: "perspective" | "orthographic",
  controller: CameraActions & {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  }
) {
  const { camera, gl, set, controls } = controller;

  // Kiểm tra các thành phần cần thiết
  if (!gl || !set || !camera) {
    console.warn("Missing camera setup");
    return;
  }

  // Kiểm tra nếu camera đã đúng loại
  if (
    (type === "perspective" && camera instanceof THREE.PerspectiveCamera) ||
    (type === "orthographic" && camera instanceof THREE.OrthographicCamera)
  ) {
    return; // Không cần thay đổi
  }

  // Lấy tỷ lệ khung hình
  const aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;

  // Lưu trạng thái hiện tại của camera
  const oldPosition = camera.position.clone();
  const oldQuaternion = camera.quaternion.clone();
  const oldTarget = controls?.target?.clone() ?? new THREE.Vector3();
  const oldDistance = oldPosition.distanceTo(oldTarget); // Lưu khoảng cách hiện tại
  const oldNear = camera.near;
  const oldFar = camera.far;
  const oldUp = camera.up.clone();
  const oldFov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 60; // Lấy fov từ perspective hoặc mặc định 60
  const oldZoom = camera instanceof THREE.OrthographicCamera ? camera.zoom : 1;

  let newCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  if (type === "orthographic") {
    // Tính frustumSize dựa trên fov và khoảng cách
    const frustumHeight = 2 * oldDistance * Math.tan(THREE.MathUtils.degToRad(oldFov / 2));
    const frustumWidth = frustumHeight * aspect;

    newCamera = new THREE.OrthographicCamera(
      -frustumWidth / 2,
      frustumWidth / 2,
      frustumHeight / 2,
      -frustumHeight / 2,
      oldNear,
      oldFar
    );
    newCamera.zoom = oldZoom; // Khôi phục zoom
    newCamera.updateProjectionMatrix();
  } else {
    newCamera = new THREE.PerspectiveCamera(oldFov, aspect, oldNear, oldFar);
  }

  // Đặt camera về giữa màn hình và lùi xa hơn
  const distanceMultiplier = 2; // Tăng khoảng cách 1.5 lần (có thể điều chỉnh)
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(oldQuaternion).normalize(); // Hướng dựa trên quaternion
  newCamera.position.copy(oldTarget).add(direction.multiplyScalar(oldDistance * distanceMultiplier)); // Lùi xa hơn
  newCamera.lookAt(oldTarget); // Hướng camera về target
//   newCamera.up.copy(oldUp); // Giữ hướng up
  newCamera.updateMatrixWorld(true);

  // Cập nhật controls
  if (controls) {
    // Khóa target và khôi phục chính xác
    controls.target.copy(oldTarget);
    if (controls.saveState) controls.saveState(); // Lưu trạng thái nếu hỗ trợ

    // Điều chỉnh vị trí camera để giữ khoảng cách mong muốn
    const currentDistance = newCamera.position.distanceTo(controls.target);
    const targetDistance = oldDistance * distanceMultiplier;
    if (Math.abs(currentDistance - targetDistance) > 0.001) {
      const direction = new THREE.Vector3()
        .subVectors(newCamera.position, controls.target)
        .normalize();
      newCamera.position.copy(controls.target).add(direction.multiplyScalar(targetDistance));
      newCamera.updateMatrixWorld(true);
    }

    // Gán camera mới vào controls
    controls.object = newCamera;

    // Cấu hình controls dựa trên loại camera
    if (newCamera instanceof THREE.OrthographicCamera) {
      controls.minDistance = 0;
      controls.maxDistance = Infinity;
      controls.minZoom = 0.1;
      controls.maxZoom = 100;
    } else {
      controls.minDistance = 0.1;
      controls.maxDistance = oldFar;
      controls.minZoom = 0;
      controls.maxZoom = 0;
    }

    // Cập nhật controls
    controls.update();
  }

  // Cập nhật camera vào react-three-fiber
  set({ camera: newCamera });
  controller.camera = newCamera;

  // Trigger re-render
  invalidate();

  // Debug log
//   console.log("Camera Type:", type);
//   console.log("Position:", newCamera.position);
//   console.log("Target:", controls?.target);
//   console.log("Distance:", newCamera.position.distanceTo(controls?.target || new THREE.Vector3()));
//   console.log("FOV/Zoom:", newCamera instanceof THREE.PerspectiveCamera ? `FOV: ${newCamera.fov}` : `Zoom: ${newCamera.zoom}`);
}