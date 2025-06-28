// src/context/rule-service.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { Properties, type IfcAPI } from "web-ifc";
import { LoadedModelData, Rule, RuleCondition, SelectedElementInfo } from "./types";
import { getAllElementsFromSpatialTreeNodesRecursive } from "./utils";

export const useRuleService = (
  ifcApiInternal: IfcAPI | null,
  loadedModels: LoadedModelData[],
  rules: Rule[],
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>,
  classifications: Record<string, any>,
  setClassifications: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setHighlightedClassificationCode: React.Dispatch<React.SetStateAction<string | null>>,
  setHighlightedElements: React.Dispatch<React.SetStateAction<SelectedElementInfo[]>>,
  setShowAllClassificationColors: React.Dispatch<React.SetStateAction<boolean>>,
  setPreviewingRuleId: React.Dispatch<React.SetStateAction<string | null>>,
  previewingRuleId: string | null
) => {
  const matchesAllConditionsCallback = useCallback(
    async (
      elementNode: any,
      conditions: RuleCondition[],
      matchType: "all" | "any",
      modelID: number,
      api: IfcAPI
    ): Promise<boolean> => {
      if (!api.properties) {
        console.warn("API properties not initialized in matchesAllConditionsCallback");
        return false;
      }

      let itemProps: any = null;

      for (const condition of conditions) {
        let elementValue: any;
        const ruleValue = condition.value;

        if (condition.property === "Ifc Class") {
          elementValue = elementNode.type;
        } else {
          if (itemProps === null && elementNode.expressID) {
            try {
              itemProps = await api.properties.getItemProperties(
                modelID,
                elementNode.expressID,
                true
              );
            } catch (e) {
              console.warn(`Error fetching item properties for ${elementNode.expressID}:`, e);
              return false;
            }
          }

          if (!itemProps) {
            console.warn(`No itemProps available for ${elementNode.expressID}`);
            return false;
          }

          if (condition.property.includes(".")) {
            const [psetName, propName] = condition.property.split(".");
            if (!psetName || !propName) {
              console.warn("Invalid Pset property format:", condition.property);
              return false;
            }

            let psetObject: any = undefined;
            if (itemProps && itemProps[psetName]) {
              psetObject = itemProps[psetName];
            } else if (itemProps && Array.isArray(itemProps.PropertySets)) {
              psetObject = itemProps.PropertySets.find(
                (ps: any) => ps.Name?.value === psetName
              );
            } else if (itemProps) {
              for (const key in itemProps) {
                if (
                  Object.prototype.hasOwnProperty.call(itemProps, key) &&
                  typeof itemProps[key] === "object" &&
                  itemProps[key] !== null &&
                  itemProps[key].Name?.value === psetName &&
                  itemProps[key].HasProperties
                ) {
                  psetObject = itemProps[key];
                  break;
                }
              }
            }

            if (!psetObject && elementNode.expressID) {
              try {
                const elementPsets = await api.properties.getPropertySets(
                  modelID,
                  elementNode.expressID,
                  true,
                  true
                );
                for (const ps of elementPsets) {
                  if (ps.Name?.value === psetName) {
                    psetObject = ps;
                    break;
                  }
                }

                if (!psetObject) {
                  const typeObjects = await api.properties.getTypeProperties(
                    modelID,
                    elementNode.expressID,
                    true
                  );
                  for (const typeObj of typeObjects) {
                    if (
                      typeObj.HasPropertySets &&
                      Array.isArray(typeObj.HasPropertySets)
                    ) {
                      const foundPsetInType = typeObj.HasPropertySets.find(
                        (ps: any) => ps.Name?.value === psetName
                      );
                      if (foundPsetInType) {
                        psetObject = foundPsetInType;
                        break;
                      }
                    }
                  }
                }

                if (!psetObject) {
                  const relDefinesByPropsTypeCode = api.GetTypeCodeFromName("IFCRELDEFINESBYPROPERTIES");
                  const relIds = await api.GetLineIDsWithType(modelID, relDefinesByPropsTypeCode);
                  for (let i = 0; i < relIds.size(); i++) {
                    const relId = relIds.get(i);
                    try {
                      const rel = await api.GetLine(modelID, relId, false);
                      if (rel.RelatedObjects && Array.isArray(rel.RelatedObjects)) {
                        const isRelatedToElement = rel.RelatedObjects.some(
                          (obj: any) => obj.value === elementNode.expressID
                        );
                        if (isRelatedToElement && rel.RelatingPropertyDefinition?.value) {
                          const propDef = await api.GetLine(
                            modelID,
                            rel.RelatingPropertyDefinition.value,
                            true
                          );
                          if (propDef && propDef.Name?.value === psetName) {
                            psetObject = propDef;
                            break;
                          }
                        }
                      }
                    } catch (e) {
                      continue;
                    }
                  }
                }
              } catch (e) {
                console.warn(`Error fetching type properties for ${elementNode.expressID}:`, e);
              }
            }

            if (psetObject && psetObject.HasProperties) {
              const targetProp = psetObject.HasProperties.find(
                (p: any) => p.Name?.value === propName
              );
              if (targetProp) {
                elementValue =
                  targetProp.NominalValue?.value !== undefined
                    ? targetProp.NominalValue.value
                    : targetProp.NominalValue;
              }
            }
          } else {
            const directPropValue = itemProps[condition.property];
            if (directPropValue !== undefined) {
              if (directPropValue?.hasOwnProperty("value")) {
                elementValue = directPropValue.value;
              } else {
                elementValue = directPropValue;
              }
            } else if (elementNode[condition.property]) {
              const nodeProp = elementNode[condition.property];
              if (nodeProp?.hasOwnProperty("value")) {
                elementValue = nodeProp.value;
              } else {
                elementValue = nodeProp;
              }
            }
          }
        }

        const normElementValue =
          typeof elementValue === "string" ? elementValue.toLowerCase() : elementValue;
        const normRuleValue =
          typeof ruleValue === "string" ? ruleValue.toLowerCase() : ruleValue;
        let conditionMet = false;

        const convertToBoolean = (val: any): boolean | undefined => {
          if (typeof val === "boolean") return val;
          if (typeof val === "number") {
            if (val === 1) return true;
            if (val === 0) return false;
          }
          if (typeof val === "string") {
            if (["true", "yes", "1"].includes(val)) return true;
            if (["false", "no", "0"].includes(val)) return false;
          }
          return undefined;
        };

        const valFromElement = convertToBoolean(normElementValue);
        const valFromRule = convertToBoolean(normRuleValue);

        switch (condition.operator) {
          case "equals":
            if (valFromElement !== undefined && valFromRule !== undefined) {
              conditionMet = valFromElement === valFromRule;
            } else if (valFromElement !== undefined && valFromRule === undefined) {
              conditionMet = false;
            } else if (valFromElement === undefined && valFromRule !== undefined) {
              conditionMet = false;
            } else {
              conditionMet = normElementValue === normRuleValue;
            }
            break;
          case "notEquals":
            if (valFromElement !== undefined && valFromRule !== undefined) {
              conditionMet = valFromElement !== valFromRule;
            } else if (valFromElement !== undefined && valFromRule === undefined) {
              conditionMet = true;
            } else if (valFromElement === undefined && valFromRule !== undefined) {
              conditionMet = true;
            } else {
              conditionMet = normElementValue !== normRuleValue;
            }
            break;
          case "contains":
            conditionMet =
              typeof normElementValue === "string" &&
              typeof normRuleValue === "string" &&
              normElementValue.includes(normRuleValue);
            break;
          case "greaterThan":
            {
              const numElementValue = parseFloat(String(normElementValue));
              const numRuleValue = parseFloat(String(normRuleValue));
              if (!isNaN(numElementValue) && !isNaN(numRuleValue)) {
                conditionMet = numElementValue > numRuleValue;
              } else {
                conditionMet = false;
              }
            }
            break;
          case "lessThan":
            {
              const numElementValue = parseFloat(String(normElementValue));
              const numRuleValue = parseFloat(String(normRuleValue));
              if (!isNaN(numElementValue) && !isNaN(numRuleValue)) {
                conditionMet = numElementValue < numRuleValue;
              } else {
                conditionMet = false;
              }
            }
            break;
          default:
            console.warn("Unsupported operator:", condition.operator);
            return false;
        }
        if (matchType === "all") {
          if (!conditionMet) return false;
        } else {
          if (conditionMet) return true;
        }
      }
      return matchType === "all" ? true : false;
    },
    []
  );
  
  const applyAllActiveRules = useCallback(async () => {
    const allModelsReady = loadedModels.length > 0 && loadedModels.every(m => m.modelID != null && m.spatialTree != null);
    if (!allModelsReady) {
      return;
    }
    if (!ifcApiInternal) {
      if (loadedModels.length === 0) {
        setClassifications((prevClassifications) => {
          const newCleared = { ...prevClassifications };
          let actuallyClearedSomething = false;
          for (const code in newCleared) {
            if (
              newCleared[code] &&
              newCleared[code].elements &&
              newCleared[code].elements.length > 0
            ) {
              newCleared[code] = { ...newCleared[code], elements: [] };
              actuallyClearedSomething = true;
            }
          }
          if (actuallyClearedSomething) {
            console.log(
              "IFCContext: IFC API not available & no models: Ensured all classification elements are empty."
            );
          }
          return newCleared;
        });
      }
      return;
    }

    if (ifcApiInternal && !ifcApiInternal.properties) {
      try {
        ifcApiInternal.properties = new Properties(ifcApiInternal);
      } catch (e) {
        console.error(
          "IFCContext: Failed to initialize ifcApi.properties in applyAllActiveRules",
          e
        );
        return;
      }
    }

    console.log("IFCContext: Applying all active rules...");

    if (
      loadedModels.filter((m) => m.modelID != null && m.spatialTree != null)
        .length === 0
    ) {
      setClassifications((prevClassifications) => {
        const newCleared = { ...prevClassifications };
        let actuallyClearedSomething = false;
        for (const code in newCleared) {
          if (
            newCleared[code] &&
            newCleared[code].elements &&
            newCleared[code].elements.length > 0
          ) {
            newCleared[code] = { ...newCleared[code], elements: [] };
            actuallyClearedSomething = true;
          }
        }
        if (actuallyClearedSomething) {
          console.log(
            "IFCContext: No models ready, ensured rule-based elements from classifications are empty."
          );
        }
        return newCleared;
      });
      return;
    }

    const currentClassificationsForProcessing = classifications;
    const currentClassificationCodes = Object.keys(
      currentClassificationsForProcessing
    );
    const newElementsPerClassification: Record<string, SelectedElementInfo[]> = {};

    for (const classCode of currentClassificationCodes) {
      newElementsPerClassification[classCode] = [];
    }

    const activeRules = rules.filter(
      (rule) =>
        rule.active && currentClassificationsForProcessing[rule.classificationCode]
    );

    for (const model of loadedModels) {
      if (model.modelID == null || !model.spatialTree) continue;
      const allModelElements = getAllElementsFromSpatialTreeNodesRecursive(
        model.spatialTree ? [model.spatialTree] : []
      );
      for (const rule of activeRules) {
        if (!newElementsPerClassification[rule.classificationCode]) {
          newElementsPerClassification[rule.classificationCode] = [];
        }
        for (const elementNode of allModelElements) {
          if (elementNode.expressID === undefined) continue;
          try {
            const matches = await matchesAllConditionsCallback(
              elementNode,
              rule.conditions,
              rule.matchType ?? "all",
              model.modelID,
              ifcApiInternal
            );
            if (matches) {
              const elementInfo: SelectedElementInfo = {
                modelID: model.modelID,
                expressID: elementNode.expressID,
              };
              if (
                !newElementsPerClassification[rule.classificationCode].some(
                  (el) =>
                    el.modelID === elementInfo.modelID &&
                    el.expressID === elementInfo.expressID
                )
              ) {
                newElementsPerClassification[rule.classificationCode].push(
                  elementInfo
                );
              }
            }
          } catch (error) {
            console.error(
              "IFCContext: Error processing element " +
                elementNode.expressID +
                " for rule " +
                rule.name +
                ":",
              error
            );
          }
        }
      }
    }

    setClassifications((prevClassifications) => {
      const updatedClassifications = { ...prevClassifications };
      let changed = false;
      for (const code of Object.keys(updatedClassifications)) {
        const newElements = newElementsPerClassification[code] || [];
        if (
          JSON.stringify(updatedClassifications[code].elements || []) !==
          JSON.stringify(newElements)
        ) {
          updatedClassifications[code] = {
            ...updatedClassifications[code],
            elements: newElements,
          };
          changed = true;
        }
      }
      if (changed) {
        console.log(
          "IFCContext: Finished applying all active rules. Classifications updated."
        );
      } else {
        console.log(
          "IFCContext: Finished applying all active rules. No changes to classifications elements."
        );
      }
      return updatedClassifications;
    });
  }, [
    ifcApiInternal,
    loadedModels,
    rules,
    getAllElementsFromSpatialTreeNodesRecursive,
    matchesAllConditionsCallback,
    setClassifications,
  ]);

  const previewRuleHighlight = useCallback(
    async (ruleId: string) => {
      if (!ifcApiInternal) return;

      if (previewingRuleId === ruleId) {
        setPreviewingRuleId(null);
        setHighlightedClassificationCode(null);
        setHighlightedElements([]);
        console.log("Cleared preview for rule: " + ruleId);
        return;
      }

      if (ifcApiInternal && !ifcApiInternal.properties) {
        try {
          ifcApiInternal.properties = new Properties(ifcApiInternal);
        } catch (e) {
          console.error("Failed to init properties in preview", e);
          return;
        }
      }
      const rule = rules.find((r) => r.id === ruleId);
      if (!rule) {
        console.warn("Rule not found for preview:", ruleId);
        setPreviewingRuleId(null);
        setHighlightedClassificationCode(null);
        setHighlightedElements([]);
        return;
      }
      const matchingElements: SelectedElementInfo[] = [];
      for (const model of loadedModels) {
        if (model.modelID == null || !model.spatialTree) continue;
        const allModelElements = getAllElementsFromSpatialTreeNodesRecursive(
          model.spatialTree ? [model.spatialTree] : []
        );
        for (const elementNode of allModelElements) {
          if (elementNode.expressID === undefined) continue;
          try {
            const matches = await matchesAllConditionsCallback(
              elementNode,
              rule.conditions,
              rule.matchType ?? "all",
              model.modelID,
              ifcApiInternal
            );
            if (matches) {
              matchingElements.push({
                modelID: model.modelID,
                expressID: elementNode.expressID,
              });
            }
          } catch (error) {
            console.error(
              "Error previewing element " +
                elementNode.expressID +
                " for rule " +
                rule.name +
                ":",
              error
            );
          }
        }
      }
      setPreviewingRuleId(ruleId);
      setHighlightedClassificationCode(rule.classificationCode);
      setHighlightedElements(matchingElements);
      setShowAllClassificationColors(false);
      console.log(
        'Previewing rule "' +
          rule.name +
          '". Found ' +
          matchingElements.length +
          " elements."
      );
    },
    [
      ifcApiInternal,
      loadedModels,
      rules,
      getAllElementsFromSpatialTreeNodesRecursive,
      matchesAllConditionsCallback,
      previewingRuleId,
      setHighlightedClassificationCode,
      setHighlightedElements,
      setShowAllClassificationColors,
      setPreviewingRuleId,
    ]
  );

  const addRule = useCallback(
    (ruleItem: Rule) => {
      setRules((prev) => [...prev, ruleItem]);
    },
    [setRules]
  );

  const removeRule = useCallback(
    (id: string) => {
      setRules((prev) => prev.filter((r) => r.id !== id));
    },
    [setRules]
  );

  const updateRule = useCallback(
    (updatedRuleItem: Rule) => {
      setRules((prev) =>
        prev.map((r) => (r.id === updatedRuleItem.id ? updatedRuleItem : r))
      );
    },
    [setRules]
  );

  const removeAllRules = useCallback(() => {
    setRules([]);
  }, [setRules]);

  const classificationCodesKey = useMemo(
    () => Object.keys(classifications).sort().join(","),
    [classifications]
  );
  const rulesKey = useMemo(
    () =>
      JSON.stringify(
        rules.map((r) => ({
          id: r.id,
          active: r.active,
          conditions: r.conditions,
          classificationCode: r.classificationCode,
        }))
      ),
    [rules]
  );
  const modelsReadyKey = useMemo(
    () =>
      loadedModels.filter((m) => m.modelID !== null && m.spatialTree !== null)
        .length,
    [loadedModels]
  );

  useEffect(() => {
    applyAllActiveRules();
  }, [modelsReadyKey, rulesKey, classificationCodesKey, applyAllActiveRules]);

  return {
    matchesAllConditionsCallback,
    applyAllActiveRules,
    previewRuleHighlight,
    addRule,
    removeRule,
    updateRule,
    removeAllRules,
  };
};