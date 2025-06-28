import { CameraActions } from "@/components/ifc-classifier/CameraActionsController";
import { invalidate } from "@react-three/fiber";
import * as THREE from "three";

export function setCameraType(
  type: "perspective" | "orthographic",
  controller: CameraActions & {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    scene: THREE.Scene;
  }
) {
  const { camera, gl, set, controls, scene } = controller;
  
  // Kiểm tra các thành phần cần thiết
  if (!gl || !set || !camera || !scene) {
    console.warn("Missing camera or scene setup");
    return;
  }

  // Kiểm tra nếu camera đã đúng loại
  if (
    (type === "perspective" && camera instanceof THREE.PerspectiveCamera) ||
    (type === "orthographic" && camera instanceof THREE.OrthographicCamera)
  ) {
    return;
  }

  // Lấy tỷ lệ khung hình
  const aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;

  // Lưu trạng thái hiện tại của camera
  const oldPosition = camera.position.clone();
  const oldQuaternion = camera.quaternion.clone();
  const oldTarget = controls?.target?.clone() ?? new THREE.Vector3();
  const oldDistance = oldPosition.distanceTo(oldTarget);
  const oldUp = camera.up.clone();
  const oldFov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 60;
  const oldZoom = camera instanceof THREE.OrthographicCamera ? camera.zoom : 1;

  // Tính bounding box của scene
  const box = new THREE.Box3().setFromObject(scene);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // Tính near và far động với giới hạn an toàn
  const minNear = 0.01;
  let newNear = Math.max(minNear, oldDistance * 0.05); // Giảm tỷ lệ để near không quá nhỏ
  let newFar = Math.max(maxDim * 50, oldDistance * 5 + maxDim * 5); // Giảm tỷ lệ far để tránh quá lớn

  // Đảm bảo near < far và không vượt quá giới hạn thực tế
  if (newNear >= newFar) {
    newNear = minNear;
    newFar = Math.max(newFar, minNear * 2);
  }

  let newCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  if (type === "orthographic") {
    const frustumHeight = 2 * oldDistance * Math.tan(THREE.MathUtils.degToRad(oldFov / 2));
    const frustumWidth = frustumHeight * aspect;

    newCamera = new THREE.OrthographicCamera(
      -frustumWidth / 2,
      frustumWidth / 2,
      frustumHeight / 2,
      -frustumHeight / 2,
      newNear,
      newFar
    );
    newCamera.zoom = oldZoom;
    newCamera.updateProjectionMatrix();
  } else {
    newCamera = new THREE.PerspectiveCamera(oldFov, aspect, newNear, newFar);
  }

  // Đặt camera về giữa màn hình và lùi xa hơn
  const distanceMultiplier = 5;
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(oldQuaternion).normalize();
  newCamera.position.copy(oldTarget).add(direction.multiplyScalar(oldDistance * distanceMultiplier));
  newCamera.lookAt(oldTarget);
  newCamera.up.copy(oldUp);
  newCamera.updateMatrixWorld(true);

  // Cập nhật controls
  if (controls) {
    controls.target.copy(oldTarget);
    if (controls.saveState) controls.saveState();

    const currentDistance = newCamera.position.distanceTo(controls.target);
    const targetDistance = oldDistance * distanceMultiplier;
    if (Math.abs(currentDistance - targetDistance) > 0.001) {
      const direction = new THREE.Vector3()
        .subVectors(newCamera.position, controls.target)
        .normalize();
      newCamera.position.copy(controls.target).add(direction.multiplyScalar(targetDistance));
      newCamera.updateMatrixWorld(true);
    }

    controls.object = newCamera;

    if (newCamera instanceof THREE.OrthographicCamera) {
      controls.minDistance = newNear;
      controls.maxDistance = Infinity;
      controls.minZoom = 0.001;
      controls.maxZoom = 10000;
    } else {
      controls.minDistance = newNear;
      controls.maxDistance = newFar;
      controls.minZoom = 0;
      controls.maxZoom = 0;
    }

    controls.update();
  }

  // Cập nhật camera vào react-three-fiber
  set({ camera: newCamera });
  controller.camera = newCamera;

  // Trigger re-render
  // invalidate();
}