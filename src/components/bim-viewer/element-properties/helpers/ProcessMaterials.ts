import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

export interface PropertyNode {
  name: string;
  value?: string; // Optional: only leaf nodes have value
  children?: PropertyNode[]; // Optional: for nested structure
}

/**
 * Builds a material tree node from resolved material elements.
 */
async function createMaterialNode(
  model: FRAGS.FragmentsGroup,
  materials: { [attribute: string]: any }[]
): Promise<PropertyNode> {
  const root: PropertyNode = { name: "Materials", children: [] };

  for (const material of materials) {
    // Case: IfcMaterialLayerSetUsage (multi-layer materials)
    if (material.type === WEBIFC.IFCMATERIALLAYERSETUSAGE) {
      const layerSetID = material.ForLayerSet?.value;
      const layerSetAttrs = await model.getProperties(layerSetID);
      if (!layerSetAttrs?.MaterialLayers) continue;

      for (const layerHandle of layerSetAttrs.MaterialLayers) {
        const layerID = layerHandle.value;
        const layerAttrs = await model.getProperties(layerID);
        if (!layerAttrs) continue;

        const matID = layerAttrs.Material?.value;
        const materialAttrs = await model.getProperties(matID);
        if (!materialAttrs) continue;

        const matName = materialAttrs.Name?.value ?? "Unknown";
        const thickness = layerAttrs.LayerThickness?.value ?? "N/A";

        root.children!.push({
          name: "Layer",
          children: [
            { name: "Material", value: matName },
            { name: "Thickness", value: `${thickness} mm` },
          ],
        });
      }
    }

    // Case: IfcMaterialList
    else if (material.type === WEBIFC.IFCMATERIALLIST) {
      for (const materialHandle of material.Materials ?? []) {
        const matID = materialHandle.value;
        const materialAttrs = await model.getProperties(matID);
        if (!materialAttrs) continue;

        root.children!.push({
          name: "Material",
          value: materialAttrs.Name?.value ?? "Unnamed",
        });
      }
    }

    // Case: Simple IfcMaterial
    else if (material.type === WEBIFC.IFCMATERIAL) {
      root.children!.push({
        name: "Material",
        value: material.Name?.value ?? "Unnamed",
      });
    }
  }

  return root;
}

/**
 * Uses the IfcRelationsIndexer to retrieve associated materials
 * and returns them as a PropertyNode tree.
 */
export async function processMaterialRelations(
  components: OBC.Components,
  model: FRAGS.FragmentsGroup,
  expressID: number
): Promise<PropertyNode | null> {
  const indexer = components.get(OBC.IfcRelationsIndexer);

  const relations = indexer.getEntityRelations(
    model,
    expressID,
    "HasAssociations"
  );

  if (!relations || relations.length === 0) return null;

  // Remove duplicates
  const associateRelations = [...new Set(relations)];

  const materials: { [attribute: string]: any }[] = [];

  for (const relationID of associateRelations) {
    const attrs = await model.getProperties(relationID);
    if (!attrs) continue;

    if (
      attrs.type === WEBIFC.IFCMATERIALLAYERSETUSAGE ||
      attrs.type === WEBIFC.IFCMATERIALLAYERSET ||
      attrs.type === WEBIFC.IFCMATERIALLAYER ||
      attrs.type === WEBIFC.IFCMATERIAL ||
      attrs.type === WEBIFC.IFCMATERIALLIST
    ) {
      materials.push(attrs);
    }
  }

  if (materials.length === 0) return null;

  return await createMaterialNode(model, materials);
}
