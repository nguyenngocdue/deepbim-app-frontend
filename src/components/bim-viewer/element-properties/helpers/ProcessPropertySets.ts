import * as WEBIFC from "web-ifc";
import { getModelUnit } from "./ModelUnit";

// Reusable tree-like structure for property/quantity display
export interface TableGroupData {
    name: string;
    value?: string;
  children?: TableGroupData[];
}

/**
 * Processes PropertySets and ElementQuantities for a given list of expressIDs.
 * Returns a hierarchical TableGroupData structure suitable for UI display.
 */
export async function processPropertySets(
  model: any,
  expressIDs: number[]
): Promise<TableGroupData | null> {
  if (!expressIDs?.length) return null;

  const psets: any[] = [];
  const qsets: any[] = [];

  // Categorize definitions into PropertySets and ElementQuantities
  for (const definition of expressIDs) {
    const attrs = await model.getProperties(definition);
    if (!attrs) continue;

    if (attrs.type === WEBIFC.IFCPROPERTYSET) psets.push(attrs);
    if (attrs.type === WEBIFC.IFCELEMENTQUANTITY) qsets.push(attrs);
  }

  const row: TableGroupData = {
    name: "PropertySets" ,
    children: [],
  };

  // --------- Process PropertySets ---------
  for (const pset of psets) {
    if (pset.type !== WEBIFC.IFCPROPERTYSET) continue;

    const setRow: TableGroupData = {
      name: pset.Name?.value || "Unnamed Pset",
      children: [],
    };

    for (const propHandle of pset.HasProperties ?? []) {
      const propID = propHandle.value;
      const propAttrs = await model.getProperties(propID);
      if (!propAttrs) continue;

      // Find a key that contains the word 'Value' (e.g., NominalValue)
      const valueKey = Object.keys(propAttrs).find((attr) =>
        attr.includes("Value")
      );
      if (!(valueKey && propAttrs[valueKey])) continue;

      let value = propAttrs[valueKey].value;
      const { name } = propAttrs[valueKey];

      // Get unit and format the value
      const units = (await getModelUnit(model, name)) ?? {symbol : "", digits: 0};
      const symbol = units.symbol ?? "";
      if (typeof value === "number" && units.digits !== undefined) {
        value = value.toFixed(units.digits);
      }

      const propRow: TableGroupData = {
        
          name: propAttrs.Name?.value || "Unnamed Property",
          value: `${value} ${symbol}`,
      };

      setRow!.children!.push(propRow);
    }

    // Only add PropertySet if it has children
    if (setRow!.children!.length > 0) {
      row!.children!.push(setRow);
    }
  }

  // --------- Process Quantities ---------
  if (qsets.length > 0) {
    const quantityRoot: TableGroupData = {
      name : "Quantities" ,
      children: [],
    };

    for (const qset of qsets) {
      const qsetRow: TableGroupData = {
        name : qset.Name?.value || "Unnamed QuantitySet" ,
        children: [],
      };

      for (const quantityHandle of qset.Quantities ?? []) {
        const quantityID = quantityHandle.value;
        const quantityAttrs = await model.getProperties(quantityID);
        if (!quantityAttrs) continue;

        const valueKey = Object.keys(quantityAttrs).find((attr) =>
          attr.includes("Value")
        );
        if (!(valueKey && quantityAttrs[valueKey])) continue;

        let value = quantityAttrs[valueKey].value;
        const { name } = quantityAttrs[valueKey];

        const units = (await getModelUnit(model, name)) ?? {symbol : "", digits: 0};
        const symbol = units.symbol ?? "";
        if (typeof value === "number" && units.digits !== undefined) {
          value = value.toFixed(units.digits);
        }

        const quantityRow: TableGroupData = {
            name: quantityAttrs.Name?.value || "Unnamed Quantity",
            value: `${value} ${symbol}`,
        };

        qsetRow!.children!.push(quantityRow);
      }

      // Only add QSet if it has quantities
      if (qsetRow!.children!.length > 0) {
        quantityRoot!.children!.push(qsetRow);
      }
    }

    // Add Quantities root if any quantities exist
    if (quantityRoot!.children!.length > 0) {
      row!.children!.push(quantityRoot);
    }
  }

  // Return final result only if there are children
  return row!.children!.length > 0 ? row : null;
}
