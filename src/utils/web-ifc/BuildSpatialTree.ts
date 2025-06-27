// =========================
// 📦 Type Definitions
// =========================
export type SpatialNode = {
  id: number;
  type: string;
  name: string;
  level: number;
  children: SpatialNode[];
  expressID?: number;
};

// =========================
// 🚀 GetLine Cache Wrapper
// =========================
const lineCache = new Map<number, any>();

function getLineCached(modelID: number, ifcApi: any, id: number): any {
  if (lineCache.has(id)) {
    // console.log(`[CACHE HIT] ID: ${id}`);
    return lineCache.get(id);
  }

  const line = ifcApi.GetLine(modelID, id, true, true);
  lineCache.set(id, line);
  // console.log(`[CACHE MISS] ID: ${id} → fetched from ifcApi`);
  return line;
}


// =========================
// 🌳 Build Spatial Tree (Project → Building → Storey → Space)
// =========================
export async function buildSpatialTree(modelID: number, ifcApi: any): Promise<SpatialNode> {
  const ifcProjectType = ifcApi.GetTypeCodeFromName("IFCPROJECT");
  const projectIdsVec = ifcApi.GetLineIDsWithType(modelID, ifcProjectType, true);
  const projectLine = getLineCached(modelID, ifcApi, projectIdsVec.get(0));
  const typeName = ifcApi.GetNameFromTypeCode(projectLine.type);

  const root: SpatialNode = {
    id: projectLine.expressID,
    expressID: projectLine.expressID,
    type: typeName,
    name: projectLine.Name?.value || 'Unnamed Project',
    level: 0,
    children: getSpatialChildren(modelID, ifcApi, projectLine, 1)
  };

  return root;
}

function getSpatialChildren(modelID: number, ifcApi: any, parentLine: any, level: number): SpatialNode[] {
  const children: SpatialNode[] = [];
  const decompositions = parentLine.IsDecomposedBy || []; // → IfcRelAggregates

  for (const rel of decompositions) {
    for (const handle of rel.RelatedObjects || []) {
      const childID = handle?.value;
      if (!childID) continue;

      const childLine = getLineCached(modelID, ifcApi, childID);
      if (!childLine) continue;

      const typeName = ifcApi.GetNameFromTypeCode(childLine.type) || "UNKNOWN";

      const childNode: SpatialNode = {
        id: childID,
        expressID: childID,
        type: typeName,
        name: childLine.Name?.value || `Unnamed ${typeName}`,
        level,
        children: getSpatialChildren(modelID, ifcApi, childLine, level + 1)
      };
      children.push(childNode);
    }
  }

   // ✅ ⬇️ Add this block here: only load elements if this is a spatial node
    const parentType = ifcApi.GetNameFromTypeCode(parentLine.type)?.toUpperCase(); // đề phòng
    const spatialTypes = new Set(["IFCSITE", "IFCBUILDING", "IFCBUILDINGSTOREY", "IFCSPACE"]);

    if (parentType && spatialTypes.has(parentType)) {
      const containedElements = loadContainedElements(modelID, ifcApi, parentLine.expressID, level);
      children.push(...containedElements);
    }
  return children;
}

// =========================
// 🧱 Load Physical Elements (e.g. Walls, Doors)
// =========================
export function loadContainedElements(modelID: number, ifcApi: any, spatialNodeId: number, parentLevel: number): SpatialNode[] {
  const nodeLine = getLineCached(modelID, ifcApi, spatialNodeId);
  const elements: SpatialNode[] = [];

  const containsElements = nodeLine.ContainsElements || []; // → IfcRelContainedInSpatialStructure

  for (const rel of containsElements) {
    for (const handle of rel.RelatedElements || []) {
      const childID = handle.value;
      const childLine = getLineCached(modelID, ifcApi, childID);
      if (!childLine) continue;

      const typeName = ifcApi.GetNameFromTypeCode(childLine.type) || "UNKNOWN";

      const childNode: SpatialNode = {
        id: childID,
        expressID: childID,
        type: typeName,
        name: childLine.Name?.value || `Unnamed ${typeName}`,
        level: parentLevel,
        // children: loadContainedElements(modelID, ifcApi, childID, parentLevel+1)
        children: []
      };

      elements.push(childNode);
    }
  }

  return elements;
}

// =========================
// 📋 Flatten Tree (DFS)
// =========================
export function gatherAllElements2(root: SpatialNode | null): SpatialNode[] {
  const allNodes: SpatialNode[] = [];
  if (!root) return allNodes;

  const stack: SpatialNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    allNodes.push(node);

    if (node.children?.length) {
      stack.push(...node.children);
    }
  }

  return allNodes;
}
