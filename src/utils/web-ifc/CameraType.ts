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

  if (!gl || !set || !camera) {
    console.warn("Missing camera setup");
    return;
  }

  const aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;

  // ✅ Lưu lại trạng thái cũ
  const oldPosition = camera.position.clone();
  const oldQuaternion = camera.quaternion.clone();
  const oldTarget = controls?.target?.clone() ?? new THREE.Vector3();
  const oldNear = camera.near;
  const oldFar = camera.far;

  let newCamera: THREE.Camera;

  if (type === "orthographic") {
    const distance = oldPosition.distanceTo(oldTarget);
    const frustumSize = distance;
    const halfW = (frustumSize * aspect) / 2;
    const halfH = frustumSize / 2;

    const orthoCam = new THREE.OrthographicCamera(
      -halfW,
      halfW,
      halfH,
      -halfH,
      oldNear,
      oldFar
    );
    orthoCam.zoom = 1;
    orthoCam.updateProjectionMatrix();
    newCamera = orthoCam;
  } else {
    newCamera = new THREE.PerspectiveCamera(60, aspect, oldNear, oldFar);
  }

  // ✅ Set lại vị trí và góc nhìn
  newCamera.position.copy(oldPosition);
  newCamera.quaternion.copy(oldQuaternion);
  newCamera.updateMatrixWorld(true);

  // ✅ Gắn vào controls
  if (controls) {
    controls.object = newCamera;
    controls.target.copy(oldTarget);
    controls.update();
  }

  // ✅ Cập nhật vào react-three-fiber
  set({ camera: newCamera });
  controller.camera = newCamera;
}
