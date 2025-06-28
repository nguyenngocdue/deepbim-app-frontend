// src/context/ifc-context.ts
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from 'three';
import type { IfcAPI } from "web-ifc";
import { Properties } from "web-ifc";
import { IFCContextType, LoadedModelData, SelectedElementInfo, Rule, ClassificationItem } from "./types";
import { useIfcModelService } from "./ifc-model-service";
import { useElementService } from "./element-service";
import { useVisibilityService } from "../visibility-service";
import { getAllElementsFromSpatialTreeNodesRecursive } from "./utils";
import { useRuleService } from "./rule-service";
import { useClassificationService } from "./classification-service";

export const IFCContext = createContext<IFCContextType | undefined>(undefined);

export function IFCContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadedModels, setLoadedModels] = useState<LoadedModelData[]>([]);
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(null);
  const [selectedElements, setSelectedElements] = useState<SelectedElementInfo[]>([]);
  const [highlightedElements, setHighlightedElements] = useState<SelectedElementInfo[]>([]);
  const [elementProperties, setElementPropertiesInternal] = useState<any | null>(null);
  const [availableCategories, setAvailableCategoriesInternal] = useState<Record<number, string[]>>({});
  const [highlightedClassificationCode, setHighlightedClassificationCode] = useState<string | null>(null);
  const [showAllClassificationColors, setShowAllClassificationColors] = useState<boolean>(false);
  const [previewingRuleId, setPreviewingRuleId] = useState<string | null>(null);
  const [userHiddenElements, setUserHiddenElements] = useState<SelectedElementInfo[]>([]);
  const [hiddenModelIds, setHiddenModelIds] = useState<string[]>([]);
  const [availableProperties, setAvailablePropertiesInternal] = useState<string[]>([]);
  const [naturalIfcClassNames, setNaturalIfcClassNames] = useState<
    Record<string, { en: string; de: string; schema?: string }> | null
  >(null);
  const [baseCoordinationMatrix, setBaseCoordinationMatrix] = useState<number[] | null>(null);
  const [classifications, setClassifications] = useState<Record<string, ClassificationItem>>({});
  const [rules, setRules] = useState<Rule[]>([]);
  const [ifcApiInternal, setIfcApiInternal] = useState<IfcAPI | null>(null);
  const elementPropsCache = useRef<Map<number, Map<number, any>>>(new Map());

  // Fetch natural IFC class names
  useEffect(() => {
    const fetchNaturalNames = async () => {
      try {
        const response = await fetch("/data/natural_ifcclass.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch natural_ifcclass.json: ${response.statusText}`);
        }
        const data = await response.json();
        setNaturalIfcClassNames(data);
      } catch (error) {
        console.error("IFCContext: Error loading natural IFC class names:", error);
        setNaturalIfcClassNames({});
      }
    };
    fetchNaturalNames();
  }, []);

  // Get natural IFC class name
  const getNaturalIfcClassName = useCallback(
    (ifcClass: string, lang: "en" | "de" = "en"): { name: string; schemaUrl?: string } => {
      if (!ifcClass) return { name: "Unknown Type", schemaUrl: undefined };
      if (naturalIfcClassNames) {
        if (naturalIfcClassNames[ifcClass]) {
          return {
            name: naturalIfcClassNames[ifcClass][lang] || ifcClass,
            schemaUrl: naturalIfcClassNames[ifcClass].schema,
          };
        }
        const lowerIfcClass = ifcClass.toLowerCase();
        for (const key in naturalIfcClassNames) {
          if (Object.prototype.hasOwnProperty.call(naturalIfcClassNames, key)) {
            if (key.toLowerCase() === lowerIfcClass) {
              return {
                name: naturalIfcClassNames[key][lang] || ifcClass,
                schemaUrl: naturalIfcClassNames[key].schema,
              };
            }
          }
        }
      }
      if (ifcClass.toLowerCase().startsWith("ifc")) {
        return { name: ifcClass.substring(3), schemaUrl: undefined };
      }
      return { name: ifcClass, schemaUrl: undefined };
    },
    [naturalIfcClassNames]
  );

  // Collect available properties
  useEffect(() => {
    const fetchAllProperties = async () => {
      if (!ifcApiInternal) return;
      if (!ifcApiInternal.properties) {
        try {
          ifcApiInternal.properties = new Properties(ifcApiInternal);
        } catch (e) {
          console.error("IFCContext: Failed to initialize ifcApi.properties", e);
          return;
        }
      }

      const allProps = new Set<string>();
      allProps.add("Ifc Class");
      allProps.add("Name");
      allProps.add("GlobalId");
      allProps.add("Description");
      allProps.add("ObjectType");
      allProps.add("Tag");
      allProps.add("PredefinedType");

      for (const model of loadedModels) {
        if (
          model.modelID === null ||
          !ifcApiInternal ||
          !ifcApiInternal.IsModelOpen(model.modelID)
        ) {
          continue;
        }

        if (ifcApiInternal.properties) {
          try {
            const psetTypeCode = ifcApiInternal.GetTypeCodeFromName("IFCPROPERTYSET");
            const psetIds = await ifcApiInternal.GetLineIDsWithType(model.modelID, psetTypeCode);
            for (let i = 0; i < psetIds.size(); i++) {
              const psetId = psetIds.get(i);
              try {
                const pset = await ifcApiInternal.GetLine(model.modelID, psetId, true);
                if (pset && pset.Name?.value && pset.HasProperties) {
                  const psetName = pset.Name.value;
                  if (Array.isArray(pset.HasProperties)) {
                    for (const prop of pset.HasProperties) {
                      if (prop.Name?.value) {
                        allProps.add(`${psetName}.${prop.Name.value}`);
                      }
                    }
                  }
                }
              } catch (e) {
                console.debug(`Skipping property set ${psetId}:`, e);
              }
            }

            try {
              const relDefinesByPropsTypeCode = ifcApiInternal.GetTypeCodeFromName("IFCRELDEFINESBYPROPERTIES");
              const relIds = await ifcApiInternal.GetLineIDsWithType(model.modelID, relDefinesByPropsTypeCode);
              const processedPsets = new Set<number>();
              for (let i = 0; i < relIds.size(); i++) {
                const relId = relIds.get(i);
                try {
                  const rel = await ifcApiInternal.GetLine(model.modelID, relId, false);
                  if (rel.RelatingPropertyDefinition?.value && !processedPsets.has(rel.RelatingPropertyDefinition.value)) {
                    processedPsets.add(rel.RelatingPropertyDefinition.value);
                    try {
                      const pset = await ifcApiInternal.GetLine(model.modelID, rel.RelatingPropertyDefinition.value, true);
                      if (pset && pset.Name?.value && pset.HasProperties) {
                        const psetName = pset.Name.value;
                        if (Array.isArray(pset.HasProperties)) {
                          for (const prop of pset.HasProperties) {
                            if (prop.Name?.value) {
                              allProps.add(`${psetName}.${prop.Name.value}`);
                            }
                          }
                        }
                      }
                    } catch (e) {
                      console.debug(`Skipping related property set:`, e);
                    }
                  }
                } catch (e) {
                  console.debug(`Skipping relationship ${relId}:`, e);
                }
              }
            } catch (e) {
              console.debug(`Error processing property relationships:`, e);
            }

            const elementTypes = [
              "IFCWALLTYPE", "IFCSLABTYPE", "IFCDOORTYPE", "IFCWINDOWTYPE",
              "IFCCOLUMNTYPE", "IFCBEAMTYPE", "IFCPLATETYPE", "IFCMEMBERTYPE",
              "IFCRAILINGTYPE", "IFCSTAIRTYPE", "IFCRAMPTYPE", "IFCROOFTYPE",
              "IFCCURTAINWALLTYPE", "IFCBUILDINGTYPE", "IFCSPACETYPE"
            ];

            for (const typeName of elementTypes) {
              try {
                const typeCode = ifcApiInternal.GetTypeCodeFromName(typeName);
                const typeIds = await ifcApiInternal.GetLineIDsWithType(model.modelID, typeCode);
                for (let i = 0; i < typeIds.size(); i++) {
                  const typeId = typeIds.get(i);
                  try {
                    const typeObj = await ifcApiInternal.GetLine(model.modelID, typeId, true);
                    if (typeObj.Name?.value) allProps.add("Name");
                    if (typeObj.GlobalId?.value) allProps.add("GlobalId");
                    if (typeObj.Description?.value) allProps.add("Description");
                    if (typeObj.ObjectType?.value) allProps.add("ObjectType");
                    if (typeObj.Tag?.value) allProps.add("Tag");
                    if (typeObj.PredefinedType?.value) allProps.add("PredefinedType");
                    if (typeObj.HasPropertySets && Array.isArray(typeObj.HasPropertySets)) {
                      for (const psetRef of typeObj.HasPropertySets) {
                        if (psetRef?.value) {
                          try {
                            const pset = await ifcApiInternal.GetLine(model.modelID, psetRef.value, true);
                            if (pset && pset.Name?.value && pset.HasProperties) {
                              const psetName = pset.Name.value;
                              if (Array.isArray(pset.HasProperties)) {
                                for (const prop of pset.HasProperties) {
                                  if (prop.Name?.value) {
                                    allProps.add(`${psetName}.${prop.Name.value}`);
                                  }
                                }
                              }
                            }
                          } catch (e) {
                            console.debug(`Skipping type property set:`, e);
                          }
                        }
                      }
                    }
                  } catch (e) {
                    console.debug(`Skipping type ${typeId}:`, e);
                  }
                }
              } catch (e) {
                console.debug(`Skipping type ${typeName}:`, e);
              }
            }
          } catch (error) {
            console.error(`Error fetching properties for model ${model.modelID}:`, error);
          }
        }
      }
      const sortedProps = Array.from(allProps).sort();
      setAvailablePropertiesInternal(sortedProps);
    };

    fetchAllProperties();
  }, [ifcApiInternal, loadedModels]);

  // Services
  const {
    addIFCModel,
    replaceIFCModel,
    removeIFCModel,
    setModelIDForLoadedModel,
    setSpatialTreeForModel,
    setRawBufferForModel,
  } = useIfcModelService(
    setLoadedModels,
    setSelectedElement,
    setElementPropertiesInternal,
    setHighlightedElements,
    setAvailableCategoriesInternal,
    setBaseCoordinationMatrix,
    ifcApiInternal,
    loadedModels,
    selectedElement
  );

  const {
    matchesAllConditionsCallback,
    applyAllActiveRules,
    previewRuleHighlight,
    addRule,
    removeRule,
    updateRule,
    removeAllRules,
  } = useRuleService(
    ifcApiInternal,
    loadedModels,
    rules,
    setRules,
    classifications,
    setClassifications,
    setHighlightedClassificationCode,
    setHighlightedElements,
    setShowAllClassificationColors,
    setPreviewingRuleId,
    previewingRuleId
  );

  const {
    addClassification,
    removeClassification,
    removeAllClassifications,
    updateClassification,
    assignClassificationToElement,
    unassignClassificationFromElement,
    unassignElementFromAllClassifications,
    getClassificationsForElement,
    exportClassificationsAsJson,
    importClassificationsFromJson,
    exportClassificationsAsExcel,
    importClassificationsFromExcel,
    exportRulesAsJson,
    exportRulesAsExcel,
    importRulesFromJson,
    importRulesFromExcel,
  } = useClassificationService(setClassifications, classifications, setRules, rules);

  const {
    selectElement,
    selectElements,
    clearSelection,
    toggleElementSelection,
    setElementProperties,
    getElementPropertiesCached,
  } = useElementService(
    setSelectedElement,
    setSelectedElements,
    setHighlightedElements,
    setHighlightedClassificationCode,
    setShowAllClassificationColors,
    setPreviewingRuleId,
    setElementPropertiesInternal,
    ifcApiInternal,
    elementPropsCache
  );

  const {
    toggleUserHideElement,
    unhideLastElement,
    unhideAllElements,
    toggleModelVisibility,
    hideElements,
    showElements,
  } = useVisibilityService(
    setUserHiddenElements,
    setHiddenModelIds,
    selectedElement,
    setSelectedElement,
    setElementPropertiesInternal
  );

  const toggleClassificationHighlight = useCallback(
    (classificationCode: string) => {
      if (highlightedClassificationCode === classificationCode && !previewingRuleId) {
        setHighlightedClassificationCode(null);
        setHighlightedElements([]);
      } else {
        const classification = classifications[classificationCode];
        if (classification && classification.elements) {
          setHighlightedClassificationCode(classificationCode);
          setHighlightedElements(classification.elements);
          setShowAllClassificationColors(false);
          setPreviewingRuleId(null);
        } else {
          setHighlightedClassificationCode(null);
          setHighlightedElements([]);
          console.warn(
            "Classification " + classificationCode + " or its elements not found for highlight."
          );
        }
      }
    },
    [
      classifications,
      highlightedClassificationCode,
      previewingRuleId,
      setHighlightedClassificationCode,
      setHighlightedElements,
      setShowAllClassificationColors,
      setPreviewingRuleId,
    ]
  );

  const setAvailableProperties = useCallback(
    (props: string[]) => {
      setAvailablePropertiesInternal(props);
    },
    [setAvailablePropertiesInternal]
  );

  const setBaseCoordinationMatrixFn = useCallback(
    (matrix: number[] | null) => {
      setBaseCoordinationMatrix(matrix);
    },
    [setBaseCoordinationMatrix]
  );

  const setAvailableCategoriesForModel = useCallback(
    (modelID: number, cats: string[]) => {
      setAvailableCategoriesInternal((prev) => ({ ...prev, [modelID]: cats }));
    },
    [setAvailableCategoriesInternal]
  );

  const setIfcApi = useCallback(
    (api: IfcAPI | null) => {
      setIfcApiInternal(api);
    },
    [setIfcApiInternal]
  );

  const toggleShowAllClassificationColors = useCallback(() => {
    setShowAllClassificationColors((prev) => {
      const newShowAllState = !prev;
      if (newShowAllState) {
        setHighlightedClassificationCode(null);
        setHighlightedElements([]);
        setPreviewingRuleId(null);
      }
      return newShowAllState;
    });
  }, [
    setShowAllClassificationColors,
    setHighlightedClassificationCode,
    setHighlightedElements,
    setPreviewingRuleId,
  ]);

  const mapClassificationsFromModel = useCallback(
    async (psetName: string, propertyName: string) => {
      if (!ifcApiInternal) return;
      if (!ifcApiInternal.properties) {
        try {
          ifcApiInternal.properties = new Properties(ifcApiInternal);
        } catch (e) {
          console.error("Failed to init properties", e);
          return;
        }
      }

      const classCodes = Object.keys(classifications);
      const newElements: Record<string, SelectedElementInfo[]> = {};
      classCodes.forEach((c) => (newElements[c] = []));

      for (const model of loadedModels) {
        if (model.modelID == null || !model.spatialTree) continue;
        const elements = getAllElementsFromSpatialTreeNodesRecursive(
          model.spatialTree ? [model.spatialTree] : []
        );
        for (const el of elements) {
          if (el.expressID === undefined) continue;
          const props = await getElementPropertiesCached(
            model.modelID,
            el.expressID
          );
          if (!props) continue;
          let val: any = undefined;
          if (psetName) {
            if (psetName.includes("*")) {
              const regex = new RegExp(
                "^" +
                  psetName
                    .split("*")
                    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                    .join(".*") +
                  "$",
                "i"
              );
              for (const key of Object.keys(props.propertySets || {})) {
                if (regex.test(key)) {
                  const v = props.propertySets?.[key]?.[propertyName];
                  if (v !== undefined && v !== null) {
                    val = v;
                    break;
                  }
                }
              }
            } else {
              val = props.propertySets?.[psetName]?.[propertyName];
            }
          } else {
            val = props.propertySets?.["Element Attributes"]?.[propertyName];
            if (val === undefined) val = props.attributes?.[propertyName];
          }
          if (val && typeof val === "object" && "value" in val) val = val.value;
          if (val === undefined && (el as any)[propertyName] !== undefined) {
            const direct = (el as any)[propertyName];
            val = direct?.value !== undefined ? direct.value : direct;
          }
          if (val === undefined || val === null) continue;
          const code = String(val).trim();
          if (classifications[code]) {
            const info = { modelID: model.modelID, expressID: el.expressID };
            if (
              !newElements[code].some(
                (e) => e.modelID === info.modelID && e.expressID === info.expressID
              )
            ) {
              newElements[code].push(info);
            }
          }
        }
      }

      setClassifications((prev) => {
        const updated = { ...prev };
        let changed = false;
        for (const c of classCodes) {
          const elems = newElements[c] || [];
          if (JSON.stringify(prev[c].elements || []) !== JSON.stringify(elems)) {
            updated[c] = { ...prev[c], elements: elems };
            changed = true;
          }
        }
        if (changed) {
          console.log("IFCContext: classifications mapped from model");
        }
        return updated;
      });
    },
    [
      ifcApiInternal,
      classifications,
      loadedModels,
      getElementPropertiesCached,
      getAllElementsFromSpatialTreeNodesRecursive,
    ]
  );
  const meshesRef = useRef<Record<number, THREE.Group>>({});
  return (
    <IFCContext.Provider
      value={{
        loadedModels,
        selectedElement,
        selectedElements,
        highlightedElements,
        elementProperties,
        availableCategories,
        classifications,
        rules,
        ifcApi: ifcApiInternal,
        highlightedClassificationCode,
        showAllClassificationColors,
        previewingRuleId,
        userHiddenElements,
        hiddenModelIds,
        availableProperties,
        replaceIFCModel,
        addIFCModel,
        removeIFCModel,
        setModelIDForLoadedModel,
        setSpatialTreeForModel,
        setRawBufferForModel,
        selectElement,
        selectElements,
        toggleElementSelection,
        clearSelection,
        toggleClassificationHighlight,
        setElementProperties,
        setAvailableCategoriesForModel,
        setAvailableProperties,
        setIfcApi,
        getElementPropertiesCached,
        toggleShowAllClassificationColors,
        baseCoordinationMatrix,
        setBaseCoordinationMatrix: setBaseCoordinationMatrixFn,
        addClassification,
        removeClassification,
        removeAllClassifications,
        updateClassification,
        assignClassificationToElement,
        unassignClassificationFromElement,
        unassignElementFromAllClassifications,
        getClassificationsForElement,
        addRule,
        removeRule,
        updateRule,
        previewRuleHighlight,
        exportClassificationsAsJson,
        importClassificationsFromJson,
        exportClassificationsAsExcel,
        importClassificationsFromExcel,
        exportRulesAsJson,
        exportRulesAsExcel,
        importRulesFromJson,
        importRulesFromExcel,
        removeAllRules,
        toggleUserHideElement,
        hideElements,
        showElements,
        unhideLastElement,
        unhideAllElements,
        toggleModelVisibility,
        mapClassificationsFromModel,
        naturalIfcClassNames,
        getNaturalIfcClassName,
        isLoading,
        setIsLoading,
        loadingProgress,
        setLoadingProgress,
        loadingMessage,
        setLoadingMessage,
        meshesRef,
      }}
    >
      {children}
    </IFCContext.Provider>
  );
}

export function useIFCContext() {
  const context = useContext(IFCContext);
  if (context === undefined) {
    throw new Error("useIFCContext must be used within an IFCContextProvider");
  }
  return context;
}