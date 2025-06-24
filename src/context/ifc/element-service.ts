// src/context/element-service.ts
import { useCallback } from "react";
import type { IfcAPI } from "web-ifc";
import { SelectedElementInfo } from "./types";
import { getAllElementProperties } from "@/services/ifc-properties";

export const useElementService = (
  setSelectedElement: React.Dispatch<React.SetStateAction<SelectedElementInfo | null>>,
  setSelectedElements: React.Dispatch<React.SetStateAction<SelectedElementInfo[]>>,
  setHighlightedElements: React.Dispatch<React.SetStateAction<SelectedElementInfo[]>>,
  setHighlightedClassificationCode: React.Dispatch<React.SetStateAction<string | null>>,
  setShowAllClassificationColors: React.Dispatch<React.SetStateAction<boolean>>,
  setPreviewingRuleId: React.Dispatch<React.SetStateAction<string | null>>,
  setElementPropertiesInternal: React.Dispatch<React.SetStateAction<any | null>>,
  ifcApiInternal: IfcAPI | null,
  elementPropsCache: React.MutableRefObject<Map<number, Map<number, any>>>
) => {
  const selectElement = useCallback(
    (selection: SelectedElementInfo | null) => {
      if (selection) {
        setSelectedElements([selection]);
      } else {
        setSelectedElements([]);
      }
      setSelectedElement(selection);
      setHighlightedElements([]);
      setHighlightedClassificationCode(null);
      setShowAllClassificationColors(false);
      setPreviewingRuleId(null);
      if (!selection) {
        setElementPropertiesInternal(null);
      } else {
        setElementPropertiesInternal(null);
      }
    },
    [
      setSelectedElement,
      setSelectedElements,
      setHighlightedElements,
      setHighlightedClassificationCode,
      setShowAllClassificationColors,
      setPreviewingRuleId,
      setElementPropertiesInternal,
    ]
  );

  const selectElements = useCallback(
    (selection: SelectedElementInfo[]) => {
      setSelectedElements(selection);
      setSelectedElement(selection.length ? selection[selection.length - 1] : null);
      setHighlightedElements([]);
      setHighlightedClassificationCode(null);
      setShowAllClassificationColors(false);
      setPreviewingRuleId(null);
      setElementPropertiesInternal(null);
    },
    [
      setSelectedElements,
      setSelectedElement,
      setHighlightedElements,
      setHighlightedClassificationCode,
      setShowAllClassificationColors,
      setPreviewingRuleId,
      setElementPropertiesInternal,
    ]
  );

  const clearSelection = useCallback(() => {
    setSelectedElements([]);
    setSelectedElement(null);
    setHighlightedElements([]);
    setHighlightedClassificationCode(null);
    setShowAllClassificationColors(false);
    setPreviewingRuleId(null);
    setElementPropertiesInternal(null);
  }, [
    setSelectedElements,
    setSelectedElement,
    setHighlightedElements,
    setHighlightedClassificationCode,
    setShowAllClassificationColors,
    setPreviewingRuleId,
    setElementPropertiesInternal,
  ]);

  const toggleElementSelection = useCallback(
    (element: SelectedElementInfo, additive: boolean) => {
      setSelectedElements((prev) => {
        let newSelection = prev;
        const exists = prev.some(
          (el) => el.modelID === element.modelID && el.expressID === element.expressID
        );
        if (additive) {
          if (exists) {
            newSelection = prev.filter(
              (el) => !(el.modelID === element.modelID && el.expressID === element.expressID)
            );
          } else {
            newSelection = [...prev, element];
          }
        } else {
          if (exists && prev.length === 1) {
            newSelection = [];
          } else {
            newSelection = [element];
          }
        }
        setSelectedElement(newSelection.length ? newSelection[newSelection.length - 1] : null);
        setHighlightedElements([]);
        setHighlightedClassificationCode(null);
        setShowAllClassificationColors(false);
        setPreviewingRuleId(null);
        setElementPropertiesInternal(null);
        return newSelection;
      });
    },
    [
      setSelectedElements,
      setSelectedElement,
      setHighlightedElements,
      setHighlightedClassificationCode,
      setShowAllClassificationColors,
      setPreviewingRuleId,
      setElementPropertiesInternal,
    ]
  );

  const setElementProperties = useCallback(
    (properties: any | null) => {
      setElementPropertiesInternal(properties);
    },
    [setElementPropertiesInternal]
  );

  const getElementPropertiesCached = useCallback(
    async (modelID: number, expressID: number) => {
      if (!ifcApiInternal) return null;
      let modelMap = elementPropsCache.current.get(modelID);
      if (modelMap && modelMap.has(expressID)) {
        return modelMap.get(expressID)!;
      }
      try {
        const props = await getAllElementProperties(ifcApiInternal, modelID, expressID);
        if (!modelMap) {
          modelMap = new Map();
          elementPropsCache.current.set(modelID, modelMap);
        }
        modelMap.set(expressID, props);
        return props;
      } catch (e) {
        console.warn("Failed to fetch element properties", e);
        return null;
      }
    },
    [ifcApiInternal, elementPropsCache]
  );

  return {
    selectElement,
    selectElements,
    clearSelection,
    toggleElementSelection,
    setElementProperties,
    getElementPropertiesCached,
  };
};