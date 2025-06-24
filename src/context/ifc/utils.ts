// src/context/utils.ts
import { SpatialStructureNode } from "./types";

// Helper to get all elements from a spatial tree structure
export const getAllElementsFromSpatialTreeNodesRecursive = (
  nodes: SpatialStructureNode[]
): SpatialStructureNode[] => {
  let elements: SpatialStructureNode[] = [];
  for (const node of nodes) {
    elements.push(node);
    if (node.children && node.children.length > 0) {
      elements = elements.concat(
        getAllElementsFromSpatialTreeNodesRecursive(node.children)
      );
    }
  }
  return elements;
};

// Generate unique file ID
export const generateFileId = () =>
  `model-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;