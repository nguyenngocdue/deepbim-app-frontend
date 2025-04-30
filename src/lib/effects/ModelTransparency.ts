import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";


export function setModelTransparency(
  model: FRAGS.FragmentsModel,
  transparent: boolean,
  opacity: number
) {
  model.object?.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material;

      const setTransparent = (mat: THREE.Material) => {
        mat.transparent = transparent;
        mat.opacity = opacity;
        mat.depthWrite = !transparent; // tránh lỗi render nếu trong suốt
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
