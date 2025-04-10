import * as FRAGS from "@thatopen/fragments";

type Attributes = string | ((name: string) => boolean);

export interface TableGroupData {
  name: string;
  value?: string;
children?: TableGroupData[];
}

export const defaultAttributes: Attributes[] = [
  "Name",
  "GlobalId",
  "ObjectType",
  "Tag",
  "PredefinedType",
  "LongName",
  "Description",
  (name: string) => name.includes("Value"),
  (name: string) => name.startsWith("Material"),
  (name: string) => name.startsWith("Relating"),
  (name: string) => {
    const ignore = ["IsGroupedBy", "IsDecomposedBy"];
    return name.startsWith("Is") && !ignore.includes(name);
  },
];

/**
 * Processes the basic attributes of an IFC entity and returns a TableGroupData
 * structure to be used with ThatOpen UI components.
 */
export async function processEntityAttributes(
  model: FRAGS.FragmentsGroup,
  expressID: number,
  attributesToInclude: Attributes[] = defaultAttributes
): Promise<TableGroupData> {
  
  const attributes = await model.getProperties(expressID);
  if (!attributes) {
    return {
      name: `${expressID} properties not found...` ,
    };
  }

  const entityRow: TableGroupData = {
    name : "Attributes" ,
    children: [],
  };

  for (const name in attributes) {
    // Check if attribute is included in the filter rules
    const isIncluded = attributesToInclude.some((rule) =>
      typeof rule === "string" ? rule === name : rule(name)
    );

    if (!(isIncluded || name === "type")) continue;

    const attrValue = attributes[name];
    if (!attrValue) continue;

    let value: any = attrValue;

    if (typeof value === "object" && value.value !== undefined) {
      value = value.value;
    }

    // Special handling for the IFC type/class
    if (name === "type") {
      const typeName = model.typesMap?.[value] || `IFC Type ${value}`;
      entityRow.children!.push({
          name: "Class",
          value: typeName,
      });
    } else {
      entityRow.children!.push({
          name: name,
          value: String(value),
      });
    }
  }

  return entityRow;
}
