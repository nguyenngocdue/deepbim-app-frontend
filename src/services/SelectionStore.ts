// selectionStore.ts
import * as THREE from "three";

export interface RaycastSelection {
  localId: number | null;
  object: THREE.Object3D | null;
  point: THREE.Vector3 | null;
  selectedModel: any | null;
}

const selection: RaycastSelection = {
  localId: null,
  object: null,
  point: null,
  selectedModel: null,
};

export const SelectionStore = {
  get() {
    return { ...selection };
  },

  set(localId: number, object: THREE.Object3D, point: THREE.Vector3, selectedModel: any) {
    selection.localId = localId;
    selection.object = object;
    selection.point = point.clone(); // tránh mutation
    selection.selectedModel = selectedModel;
    
  },

  reset() {
    selection.localId = null;
    selection.object = null;
    selection.point = null;
    selection.selectedModel = null;
  },

  isSelected(): boolean {
    return selection.localId !== null && selection.object !== null;
  },
};
