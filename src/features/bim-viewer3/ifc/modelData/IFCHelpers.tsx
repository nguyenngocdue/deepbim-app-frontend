import { SpatialStructureNode } from "@/components/ifc-classifier/viewer";
import {
  IfcAPI,
  IFCPROJECT,
  IFCRELAGGREGATES,
  IFCRELCONTAINEDINSPATIALSTRUCTURE,
  IFCBUILDINGSTOREY,
  IFCSPACE,
  IFCBUILDING,
  IFCSITE,
} from "web-ifc";

async function getElementData(
  ifcApi: IfcAPI,
  modelID: number,
  expressID: number
): Promise<Partial<SpatialStructureNode>> {
  try {
    const props = await ifcApi.GetLine(modelID, expressID, true);
    const nodeData: Partial<SpatialStructureNode> = {
      expressID: props.expressID,
      type: ifcApi.GetNameFromTypeCode(props.type) || `TYPE_${props.type}`,
      Name: props.Name?.value,
      GlobalId: props.GlobalId?.value,
    };
    return nodeData;
  } catch (error) {
    console.error(`Error fetching element data for expressID ${expressID}:`, error);
    return {};
  }
}

async function buildSpatialTree(
  ifcApi: IfcAPI,
  modelID: number,
  elementID: number, // Đảm bảo sử dụng elementID nhất quán
  parentType?: string
): Promise<SpatialStructureNode | null> {
  const element = await getElementData(ifcApi, modelID, elementID);
  if (!element.type) {
    console.warn(`No type found for elementID ${elementID}`);
    return null;
  }

  const node: SpatialStructureNode = {
    expressID: elementID,
    type: element.type,
    Name: element.Name,
    GlobalId: element.GlobalId,
    children: [],
    ...element,
  };

  // Decomposed elements (IfcRelAggregates)
  try {
    const relAggregatesIDs = await ifcApi.GetLineIDsWithType(modelID, IFCRELAGGREGATES);
    for (let i = 0; i < relAggregatesIDs.size(); i++) {
      const relAggID = relAggregatesIDs.get(i);
      const relAgg = await ifcApi.GetLine(modelID, relAggID, false);
      if (relAgg.RelatingObject?.value === elementID) {
        const relatedObjects = relAgg.RelatedObjects;
        if (relatedObjects && Array.isArray(relatedObjects)) {
          for (const relatedObject of relatedObjects) {
            if (relatedObject.value !== undefined) {
              const childNode = await buildSpatialTree(
                ifcApi,
                modelID,
                relatedObject.value, // Đảm bảo truyền đúng elementID
                element.type
              );
              if (childNode) node.children.push(childNode);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing IfcRelAggregates for elementID ${elementID}:`, error);
  }

  // Contained elements (IfcRelContainedInSpatialStructure)
  if (
    element.type === "IFCBUILDINGSTOREY" ||
    element.type === "IFCSPACE" ||
    element.type === "IFCBUILDING" ||
    element.type === "IFCSITE"
  ) {
    try {
      const relContainedIDs = await ifcApi.GetLineIDsWithType(
        modelID,
        IFCRELCONTAINEDINSPATIALSTRUCTURE
      );
      for (let i = 0; i < relContainedIDs.size(); i++) {
        const relContID = relContainedIDs.get(i);
        const relCont = await ifcApi.GetLine(modelID, relContID, false);
        if (relCont.RelatingStructure?.value === elementID) {
          const relatedElements = relCont.RelatedElements;
          if (relatedElements && Array.isArray(relatedElements)) {
            for (const relatedElement of relatedElements) {
              if (relatedElement.value !== undefined) {
                const childData = await getElementData(
                  ifcApi,
                  modelID,
                  relatedElement.value
                );
                if (childData.type) {
                  if (
                    childData.type === "IFCSPACE" ||
                    childData.type.includes("SPATIAL")
                  ) {
                    const childNode = await buildSpatialTree(
                      ifcApi,
                      modelID,
                      relatedElement.value, // Đảm bảo truyền đúng elementID
                      element.type
                    );
                    if (childNode) node.children.push(childNode);
                  } else {
                    node.children.push({
                      expressID: relatedElement.value,
                      type: childData.type,
                      Name: childData.Name,
                      GlobalId: childData.GlobalId,
                      children: [],
                      ...childData,
                    });
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing IfcRelContainedInSpatialStructure for elementID ${elementID}:`, error);
    }
  }

  return node;
}

async function fetchFullSpatialStructure(
  ifcApi: IfcAPI,
  modelID: number
): Promise<SpatialStructureNode | null> {
  try {
    const projectIDs = await ifcApi.GetLineIDsWithType(modelID, IFCPROJECT);
    if (projectIDs.size() === 0) {
      console.error("IFCModel: No IFCPROJECT found in the model.");
      return null;
    }
    const projectID = projectIDs.get(0);
    return await buildSpatialTree(ifcApi, modelID, projectID);
  } catch (error) {
    console.error(`Error fetching spatial structure for modelID ${modelID}:`, error);
    return null;
  }
}

export { getElementData, buildSpatialTree, fetchFullSpatialStructure };