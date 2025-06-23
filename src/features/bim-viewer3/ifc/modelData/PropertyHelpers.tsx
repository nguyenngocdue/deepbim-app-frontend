import { IfcAPI } from "web-ifc";

// Helper function to recursively extract property values
async function extractPropertyValueRecursive(
  ifcApi: IfcAPI,
  modelID: number,
  propertyEntity: any,
  targetObject: Record<string, any>,
  namePrefix: string = "",
  logContext: string,
  processedCache: Map<number, any>,
  recursionPath: Set<number>
) {
  if (!propertyEntity || !propertyEntity.Name?.value) {
    return;
  }

  const propExpressID = propertyEntity.expressID;

  if (propExpressID !== undefined) {
    if (recursionPath.has(propExpressID)) {
      console.warn(`[${logContext}] Cycle detected for property expressID: ${propExpressID}.`);
      targetObject[namePrefix ? `${namePrefix}.${propertyEntity.Name.value}` : propertyEntity.Name.value] = "[Cycle Detected]";
      return;
    }
    if (processedCache.has(propExpressID)) {
      console.log(`[${logContext}] Cache hit for property expressID: ${propExpressID}.`);
      return;
    }
    recursionPath.add(propExpressID);
  }

  const propName = propertyEntity.Name.value;
  const fullPropName = namePrefix ? `${namePrefix}.${propName}` : propName;
  const propIfcType = typeof propertyEntity.type === "number" ? ifcApi.GetNameFromTypeCode(propertyEntity.type) : String(propertyEntity.type);

  if (propIfcType === "IFCCOMPLEXPROPERTY") {
    if (propertyEntity.HasProperties && Array.isArray(propertyEntity.HasProperties)) {
      for (const subPropRefOrObject of propertyEntity.HasProperties) {
        let subPropertyEntity = null;
        let subPropIdForLog = "N/A (embedded)";
        if (subPropRefOrObject?.value !== undefined && typeof subPropRefOrObject.value === "number") {
          subPropIdForLog = String(subPropRefOrObject.value);
          try {
            subPropertyEntity = await ifcApi.GetLine(modelID, subPropRefOrObject.value, true);
          } catch (e) {
            console.warn(`[${logContext}] Error fetching sub-property (ID: ${subPropIdForLog}):`, e);
            continue;
          }
        } else if (subPropRefOrObject?.expressID !== undefined && subPropRefOrObject.Name?.value) {
          subPropertyEntity = subPropRefOrObject;
          subPropIdForLog = subPropRefOrObject.expressID !== undefined ? String(subPropRefOrObject.expressID) : "N/A (embedded no expressID)";
        } else {
          console.warn(`[${logContext}] Skipping item in HasProperties of '${fullPropName}':`, subPropRefOrObject);
          continue;
        }
        if (subPropertyEntity) {
          await extractPropertyValueRecursive(
            ifcApi,
            modelID,
            subPropertyEntity,
            targetObject,
            fullPropName,
            logContext,
            processedCache,
            recursionPath
          );
        }
      }
    }
  } else {
    let extractedValue: any = `(Unhandled ${propIfcType})`;
    const unit = propertyEntity.Unit?.value;

    if (propertyEntity.NominalValue?.value !== undefined) {
      extractedValue = propertyEntity.NominalValue.value;
      if (unit) extractedValue = { value: extractedValue, unit: unit };
    } else if (propertyEntity.Value?.value !== undefined) {
      extractedValue = propertyEntity.Value.value;
      if (unit) extractedValue = { value: extractedValue, unit: unit };
    } else if (propertyEntity.ListValues?.value !== undefined && Array.isArray(propertyEntity.ListValues.value)) {
      const listVals = propertyEntity.ListValues.value.map((item: any) => item.value !== undefined ? item.value : item);
      extractedValue = unit ? { values: listVals, unit: unit } : listVals;
    } else if (propertyEntity.EnumerationValues?.value !== undefined && Array.isArray(propertyEntity.EnumerationValues.value)) {
      const enumVals = propertyEntity.EnumerationValues.value.map((item: any) => item.value !== undefined ? item.value : item);
      extractedValue = unit ? { values: enumVals, unit: unit } : enumVals;
    } else if (propertyEntity.LowerBoundValue?.value !== undefined || propertyEntity.UpperBoundValue?.value !== undefined) {
      extractedValue = {};
      if (propertyEntity.LowerBoundValue?.value !== undefined) extractedValue.LowerBound = propertyEntity.LowerBoundValue.value;
      if (propertyEntity.UpperBoundValue?.value !== undefined) extractedValue.UpperBound = propertyEntity.UpperBoundValue.value;
      if (unit) extractedValue.Unit = unit;
    } else if (propertyEntity.NominalValue === null) {
      extractedValue = `(${ifcApi.GetNameFromTypeCode(propertyEntity.type as number)})`;
    }
    targetObject[fullPropName] = extractedValue;
  }

  if (propExpressID !== undefined) {
    processedCache.set(propExpressID, true);
    recursionPath.delete(propExpressID);
  }
}

// Helper function to extract direct attributes
function extractDirectAttributes(
  entity: any,
  targetObject: Record<string, any>,
  excludedKeys: string[] = [
    "expressID",
    "type",
    "GlobalId",
    "OwnerHistory",
    "HasPropertySets",
    "HasProperties",
    "HasAssociations",
    "DefiningValues",
    "RepresentationMaps",
    "IsRelatedWith",
    "RelatesProperties",
    "MaterialLayers",
    "Materials",
    "ApplicableOccurrence",
    "ObjectPlacement",
    "Representation",
  ]
) {
  for (const key in entity) {
    if (Object.prototype.hasOwnProperty.call(entity, key)) {
      if (key.startsWith("_") || excludedKeys.includes(key)) continue;
      const attributeValue = entity[key];
      if (attributeValue === null) {
        targetObject[key] = null;
      } else if (attributeValue?.value !== undefined && typeof attributeValue.type === "number") {
        targetObject[key] = attributeValue.value;
      } else if (typeof attributeValue !== "object") {
        targetObject[key] = attributeValue;
      } else if (attributeValue?.value !== undefined && attributeValue.type === undefined) {
        targetObject[key] = attributeValue.value;
      }
    }
  }
}

export { extractPropertyValueRecursive, extractDirectAttributes };