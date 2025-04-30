import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { resetModelTransparency } from "../effects/ModelTransparency";

export async function resetHighlight(
  currentSelection: { model: FRAGS.FragmentsModel | null; localId: number | null },
  highlightedMesh: THREE.Mesh | null
) {
  const { model, localId } = currentSelection;
  if (!model || localId === null) return;

  await model.resetHighlight([localId]);
  resetModelTransparency(model);

  if (highlightedMesh) {
    const materials = Array.isArray(highlightedMesh.material)
      ? highlightedMesh.material
      : [highlightedMesh.material];

    materials.forEach((mat) => {
      mat.depthTest = true;
      mat.needsUpdate = true;
    });
  }

  currentSelection.model = null;
  currentSelection.localId = null;
}
