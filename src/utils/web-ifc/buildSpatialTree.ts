

type SpatialNode = {
  id: number;
  type: string;
  name: string;
  level: number;
  children: SpatialNode[];
  expressID?: number;
};

/**
 * Hàm chính để lấy cây phân cấp không gian từ IFC model
 */
export async function buildSpatialTree(modelID: number, ifcApi: any): Promise<SpatialNode> {
  // Lấy dòng IFCPROJECT
  const ifcProjectType = ifcApi.GetTypeCodeFromName("IFCPROJECT");
  const projectIdsVec = ifcApi.GetLineIDsWithType(modelID, ifcProjectType, true);
  const projectLine = ifcApi.GetLine(modelID, projectIdsVec.get(0), true, true);

  const typeName = ifcApi.GetNameFromTypeCode(projectLine.type);

  const root: SpatialNode = {
    id: 1,
    type: typeName,
    name: projectLine.Name?.value || 'Unnamed Project',
    level: 0,
    children: getChildrenRecursive(modelID, ifcApi, projectLine, 1),
    expressID: modelID
  };

  return root;
}


function getChildrenRecursive(modelID: number, ifcApi: any, parentLine: any, level: number): SpatialNode[] {
  const children: SpatialNode[] = [];
  const decompositions = parentLine.IsDecomposedBy || [];

  for (const rel of decompositions) {
    if (rel.RelatedObjects) {
      for (const handle of rel.RelatedObjects) {
        const childID = handle?.value;
        if (!childID) continue;

        const childLine = ifcApi.GetLine(modelID, childID, true, true);
        if (!childLine) continue;

        const typeName = ifcApi.GetNameFromTypeCode(childLine.type) || "UNKNOWN";

        const childNode: SpatialNode = {
          id: childID,
          expressID:childID,
          type: typeName,
          name: childLine.Name?.value || `Unnamed ${typeName}`,
          level,
          children: getChildrenRecursive(modelID, ifcApi, childLine, level + 1)
        };

        children.push(childNode);
      }
    }
  }
    const containsElements = parentLine.ContainsElements || [];
    for (const rel of containsElements) {
        for (const handle of rel.RelatedElements || []) {
            const childID = handle.value;
            const childLine = ifcApi.GetLine(modelID, childID, true, true);
            if (!childLine) continue;

            const typeName = ifcApi.GetNameFromTypeCode(childLine.type) || "UNKNOWN";

            const childNode: SpatialNode = {
                id: childID,
                expressID:childID,
                type: typeName,
                name: childLine.Name?.value || `Unnamed ${typeName}`,
                level,
                children: []
            };

            children.push(childNode);
        }
    }
  return children;
}


export function gatherAllElements2(root: SpatialNode | null): SpatialNode[] {
  const allNodes: SpatialNode[] = [];

  if (!root) return allNodes;

  const stack: SpatialNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    allNodes.push(node);

    if (node.children && node.children.length > 0) {
      stack.push(...node.children);
    }
  }

  return allNodes;
}

