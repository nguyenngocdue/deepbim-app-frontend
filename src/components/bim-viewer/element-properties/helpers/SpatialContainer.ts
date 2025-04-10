import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";

export interface PropertyNode {
  name: string;
  value?: string;
  children?: PropertyNode[];
}

export const processSpatialContainers = async (
  components: OBC.Components,
  model: FRAGS.FragmentsGroup,
  expressID: number
): Promise<PropertyNode | null> => {
  const indexer = components.get(OBC.IfcRelationsIndexer);

  const containerRelations = indexer.getEntityRelations(
    model,
    expressID,
    "ContainedInStructure"
  );

  if (!containerRelations || !containerRelations.length) return null;

  const containerID = containerRelations[0];
  const container = await model.getProperties(containerID);
  if (!container) return null;

  const result: PropertyNode = {
    name: "SpatialContainer",
    children: [],
  };

  // Loop through all fields and extract value if exists
  for (const key in container) {
    const attr = container[key];

    if (
      typeof attr === "object" &&
      attr !== null &&
      "value" in attr &&
      attr.value !== undefined &&
      attr.value !== null
    ) {
      result.children!.push({
        name: key,
        value: String(attr.value),
      });
    }
  }

  return result.children!.length ? result : null;
};
