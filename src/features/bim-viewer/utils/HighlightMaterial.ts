import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";

export const createHighlightMaterial = (
  colorCode?: string,
  transparency?: number // 0 (trong suốt) đến 100 (đậm đặc)
): FRAGS.MaterialDefinition => {
  const material: Partial<FRAGS.MaterialDefinition> = {
    renderedFaces: FRAGS.RenderedFaces.BOTH,
  };

  if (colorCode) {
    material.color = new THREE.Color(colorCode);
  }

  if (typeof transparency === "number") {
    const opacity = Math.max(0, Math.min(1, transparency / 100)); // clamp từ 0 đến 1
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }

  return material as FRAGS.MaterialDefinition;
};
