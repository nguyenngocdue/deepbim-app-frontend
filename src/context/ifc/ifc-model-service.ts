// src/context/ifc-model-service.ts
import { useCallback } from "react";
import type { IfcAPI } from "web-ifc";
import { LoadedModelData, SpatialStructureNode } from "./types";
import { generateFileId } from "./utils";

export const useIfcModelService = (
  setLoadedModels: React.Dispatch<React.SetStateAction<LoadedModelData[]>>,
  setSelectedElement: React.Dispatch<React.SetStateAction<any | null>>,
  setElementPropertiesInternal: React.Dispatch<React.SetStateAction<any | null>>,
  setHighlightedElements: React.Dispatch<React.SetStateAction<any[]>>,
  setAvailableCategoriesInternal: React.Dispatch<
    React.SetStateAction<Record<number, string[]>>
  >,
  setBaseCoordinationMatrix: React.Dispatch<React.SetStateAction<number[] | null>>,
  ifcApiInternal: IfcAPI | null,
  loadedModels: LoadedModelData[],
  selectedElement: any | null
) => {
  const commonLoadLogic = useCallback(
    (url: string, name: string, fileIdToUse?: string): LoadedModelData => {
      const id = fileIdToUse || generateFileId();
      setSelectedElement(null);
      setElementPropertiesInternal(null);
      setHighlightedElements([]);
      return {
        id,
        name,
        url,
        modelID: null,
        spatialTree: null,
        rawBuffer: null,
      };
    },
    [
      setSelectedElement,
      setElementPropertiesInternal,
      setHighlightedElements,
      generateFileId,
    ]
  );

  const addIFCModel = useCallback(
    async (url: string, name: string, fileId?: string): Promise<number | null> => {
      setLoadedModels((prev) => [...prev, commonLoadLogic(url, name, fileId)]);
      return null;
    },
    [commonLoadLogic, setLoadedModels]
  );

  const replaceIFCModel = useCallback(
    async (url: string, name: string, fileId?: string): Promise<number | null> => {
      setLoadedModels([commonLoadLogic(url, name, fileId)]);
      return null;
    },
    [commonLoadLogic, setLoadedModels]
  );

  const removeIFCModel = useCallback(
    (id: string) => {
      setLoadedModels((prev) => {
        const filtered = prev.filter((m) => {
          if (m.id === id && m.modelID !== null && ifcApiInternal) {
            try {
              ifcApiInternal.CloseModel(m.modelID);
            } catch (e) {
              console.error("Error closing model:", e);
            }
            setAvailableCategoriesInternal((prevCats) => {
              const newCats = { ...prevCats };
              if (m.modelID) delete newCats[m.modelID];
              return newCats;
            });
          }
          return m.id !== id;
        });
        if (filtered.length === 0) {
          setBaseCoordinationMatrix(null);
        }
        return filtered;
      });
      if (
        selectedElement &&
        loadedModels.find((m) => m.id === id)?.modelID === selectedElement.modelID
      ) {
        setSelectedElement(null);
        setElementPropertiesInternal(null);
      }
    },
    [
      ifcApiInternal,
      selectedElement,
      loadedModels,
      setLoadedModels,
      setAvailableCategoriesInternal,
      setSelectedElement,
      setElementPropertiesInternal,
      setBaseCoordinationMatrix,
    ]
  );

  const setModelIDForLoadedModel = useCallback(
    (loadedModelId: string, ifcModelId: number) => {
      setLoadedModels((prev) =>
        prev.map((m) =>
          m.id === loadedModelId ? { ...m, modelID: ifcModelId } : m
        )
      );
    },
    [setLoadedModels]
  );

  const setSpatialTreeForModel = useCallback(
    (modelID: number, tree: SpatialStructureNode | null) => {
      setLoadedModels((prevModels) =>
        prevModels.map((m) =>
          m.modelID === modelID ? { ...m, spatialTree: tree } : m
        )
      );
    },
    [setLoadedModels]
  );

  const setRawBufferForModel = useCallback(
    (id: string, buffer: ArrayBuffer) => {
      setLoadedModels((prevModels) =>
        prevModels.map((m) => (m.id === id ? { ...m, rawBuffer: buffer } : m))
      );
    },
    [setLoadedModels]
  );

  return {
    addIFCModel,
    replaceIFCModel,
    removeIFCModel,
    setModelIDForLoadedModel,
    setSpatialTreeForModel,
    setRawBufferForModel,
  };
};