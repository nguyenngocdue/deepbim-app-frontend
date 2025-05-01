import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";

const highlightMaterial: FRAGS.MaterialDefinition = {
    color: new THREE.Color("#F59492"),
    renderedFaces: FRAGS.RenderedFaces.BOTH,
    opacity: 1,
    transparent: false,
    emissive: new THREE.Color("#ff99cc"),
    emissiveIntensity: 0.8,
  };

export class MultiSelectionManager {
  private static instance: MultiSelectionManager | null = null;

  private selectionMap = new Map<FRAGS.FragmentsModel, Set<number>>();

  private constructor() {}

  // ✅ Static method để lấy instance
  static getInstance(): MultiSelectionManager {
    if (!MultiSelectionManager.instance) {
      MultiSelectionManager.instance = new MultiSelectionManager();
    }
    return MultiSelectionManager.instance;
  }

  private ensureModelSet(model: FRAGS.FragmentsModel): Set<number> {
    if (!this.selectionMap.has(model)) {
      this.selectionMap.set(model, new Set());
    }
    return this.selectionMap.get(model)!;
  }

  add(model: FRAGS.FragmentsModel, localId: number) {
    this.ensureModelSet(model).add(localId);
  }

  remove(model: FRAGS.FragmentsModel, localId: number) {
    this.ensureModelSet(model).delete(localId);
  }

  async clear() {
    for (const [model, ids] of this.selectionMap.entries()) {
      await model.resetHighlight?.(Array.from(ids));
    }
    this.selectionMap.clear();
  }

  async highlightAll() {
    for (const [model, ids] of this.selectionMap.entries()) {
      await model.highlight?.(Array.from(ids), highlightMaterial);
    }
  }

  getSelections(): Map<FRAGS.FragmentsModel, Set<number>> {
    return this.selectionMap;
  }

  isEmpty(): boolean {
    for (const ids of this.selectionMap.values()) {
      if (ids.size > 0) return false;
    }
    return true;
  }

  getCountElements(): number {
    let total = 0;
    for (const ids of this.selectionMap.values()) {
      total += ids.size;
    }
    return total;
  }
}
