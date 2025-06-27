import {
  IFCRELAGGREGATES,
  IFCRELCONTAINEDINSPATIALSTRUCTURE,
} from "web-ifc";

interface SpatialNode {
  expressID: number;
  type: string;
  GlobalId?: { value: string };
  Name?: { value: string };
  children: SpatialNode[];
}

// Lấy toàn bộ cây không gian (project → site → building → storey)
async function getSpatialStructure(modelID: number, ifcManager: any): Promise<SpatialNode | null> {
  const relIDs = await ifcManager.getLineIDsWithType(modelID, IFCRELAGGREGATES);
  const parentToChildren: Record<number, number[]> = {};
  const allNodes: Record<number, SpatialNode> = {};

  // Đọc các quan hệ IfcRelAggregates để xây cây
  for (let i = 0; i < relIDs.size(); i++) {
    const relID = relIDs.get(i);
    const rel = await ifcManager.getItemProperties(modelID, relID);
    const parentID = rel.RelatingObject.value;
    const childrenIDs = rel.RelatedObjects.map((obj: any) => obj.value);
    if (!parentToChildren[parentID]) parentToChildren[parentID] = [];
    parentToChildren[parentID].push(...childrenIDs);
  }

  // Tạo node object
  const allExpressIDs = Object.keys(parentToChildren).map(Number).concat(...Object.values(parentToChildren));
  for (const id of new Set(allExpressIDs)) {
    const props = await ifcManager.getItemProperties(modelID, id);
    allNodes[id] = {
      expressID: id,
      type: props.type,
      GlobalId: props.GlobalId,
      Name: props.Name,
      children: [],
    };
  }

  // Gắn children
  for (const parentID in parentToChildren) {
    const childrenIDs = parentToChildren[Number(parentID)];
    for (const childID of childrenIDs) {
      allNodes[parentID].children.push(allNodes[childID]);
    }
  }

  // Trả về node gốc là IfcProject
  const projectID = Object.values(allNodes).find((node) => node.type === "IFCPROJECT")?.expressID;
  return projectID ? allNodes[projectID] : null;
}

// Gắn các IfcElement (walls, doors,...) vào storey
async function attachElementsToStoreys(modelID: number, ifcManager: any, root: SpatialNode) {
  const relIDs = await ifcManager.getLineIDsWithType(modelID, IFCRELCONTAINEDINSPATIALSTRUCTURE);

  for (let i = 0; i < relIDs.size(); i++) {
    const relID = relIDs.get(i);
    const rel = await ifcManager.getItemProperties(modelID, relID);
    const storeyID = rel.RelatingStructure?.value;
    const related = rel.RelatedElements?.map((e: any) => e.value) || [];

    const storeyNode = findNodeByID(root, storeyID);
    if (storeyNode) {
      for (const expressID of related) {
        const props = await ifcManager.getItemProperties(modelID, expressID);
        storeyNode.children.push({
          expressID,
          type: props.type,
          GlobalId: props.GlobalId,
          Name: props.Name,
          children: [],
        });
      }
    }
  }
}

// Tìm node trong cây theo expressID
function findNodeByID(root: SpatialNode, id: number): SpatialNode | null {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.expressID === id) return node;
    stack.push(...node.children);
  }
  return null;
}

// ✅ Hàm chính để dùng
export async function getFullSpatialTreeWithElements(modelID: number, ifcManager: any) {
  const root = await getSpatialStructure(modelID, ifcManager);
  if (!root) return null;

  await attachElementsToStoreys(modelID, ifcManager, root);
  return root;
}
