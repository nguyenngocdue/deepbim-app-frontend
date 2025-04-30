import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";


export function setModelTransparency(
  model: FRAGS.FragmentsModel,
  transparent: boolean,
  opacity: number,
  excludeModelId?: string // ✅ thêm đối số tùy chọn
) {
  model.object?.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      // console.log(mesh);

      // ✅ Bỏ qua nếu userData.modelID trùng với excludeModelId
      const childModelId = mesh.userData.modelID;
      if (excludeModelId && childModelId === excludeModelId) return;

      const material = mesh.material;
      const setTransparent = (mat: THREE.Material) => {
        mat.transparent = transparent;
        mat.opacity = opacity;
        mat.depthWrite = !transparent;
        mat.needsUpdate = true;
      };

      if (Array.isArray(material)) {
        material.forEach(setTransparent);
      } else {
        setTransparent(material);
      }
    }
  });
}


export function resetModelTransparency(model: FRAGS.FragmentsModel) {
  model.object?.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material;

      const reset = (mat: THREE.Material) => {
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
        mat.needsUpdate = true;
      };

      if (Array.isArray(material)) {
        material.forEach(reset);
      } else {
        reset(material);
      }
    }
  });
}
