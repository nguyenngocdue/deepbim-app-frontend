import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { IfcAPI } from "web-ifc";
import { fetchFullSpatialStructure } from "./IFCHelpers";
import { LoadedModelData, SpatialStructureNode } from "@/context/ifc/ifc-context"; // Adjust path
import { addGrid, setOtherLighting } from "@/components/ifc-classifier/FitCameraToObject";
import { buildSpatialTree } from "@/utils/web-ifc/BuildSpatialTree";

export function useModelLoading(
  modelData: LoadedModelData,
  ifcApi: IfcAPI | null,
  scene: THREE.Scene,
  meshesRef: React.MutableRefObject<THREE.Group | null>,
  ownModelID: React.MutableRefObject<number | null>,
  modelTransformRef: React.MutableRefObject<THREE.Matrix4>,
  originalMaterials: React.MutableRefObject<Map<number, THREE.Material | THREE.Material[]>>,
  createMeshes: () => void,
  setSpatialTreeForModel: (modelID: number, tree: SpatialStructureNode | null) => void,
  setModelIDForLoadedModel: (modelID: string, ifcModelID: number) => void,
  setAvailableCategoriesForModel: (modelID: number, categories: string[]) => void,
  setRawBufferForModel: (modelID: string, buffer: ArrayBuffer) => void,
  baseCoordinationMatrix: number[] | null,
  setBaseCoordinationMatrix: (matrix: number[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  setLoadingProgress: (progress: number) => void,
  setLoadingMessage: (message: string) => void
) {
  const [internalApiIdForEffects, setInternalApiIdForEffects] = useState<number | null>(null);
  const [modelMeshesProcessedForInitialView, setModelMeshesProcessedForInitialView] = useState(false);
  const loadedModelIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!modelData.url || !ifcApi) {
      if (!ifcApi) console.log(`IFCModel (${modelData.id}): Waiting for ifcApi...`);
      return;
    }

  if (loadedModelIds.current.has(modelData.id)) {
    // console.log(`⛔ IFCModel (${modelData.id}) already loaded. Skipping re-load.`);
    return;
  }
  loadedModelIds.current.add(modelData.id);

    setIsLoading(true);
    setLoadingMessage(`Loading ${modelData.name}...`);
    setLoadingProgress(0);

    setModelMeshesProcessedForInitialView(false);

    const loadThisModel = async () => {
      try {
        console.log(`IFCModel (${modelData.id}): Loading from URL:`, modelData.url);
        const response = await fetch(modelData.url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.arrayBuffer();
        if (modelData.id && data) {
          setRawBufferForModel(modelData.id, data.slice(0));
        }

        if (meshesRef.current) {
          console.log(`IFCModel (${modelData.id}): Disposing old Three.js meshes.`);
          scene.remove(meshesRef.current);
          meshesRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
          meshesRef.current = null;
        }
        originalMaterials.current.clear();

        if (ownModelID.current !== null && ifcApi) {
          console.log(`IFCModel (${modelData.id}): Closing previous internal model ID in IfcAPI: ${ownModelID.current}`);
          ifcApi.CloseModel(ownModelID.current);
          ownModelID.current = null;
        }

        const uint8Array = new Uint8Array(data);
        const settings = { COORDINATE_TO_ORIGIN: false, USE_FAST_BOOLS: true };
        const newIfcModelID = ifcApi.OpenModel(uint8Array, settings);
        console.log(`IFCModel (${modelData.id}): Opened. Internal IFC Model ID:`, newIfcModelID);
        ownModelID.current = newIfcModelID;
        setModelIDForLoadedModel(modelData.id, newIfcModelID);
        setInternalApiIdForEffects(newIfcModelID);


        // Lấy ma trận phối hợp (coordination matrix) của mô hình vừa mở
        const modelCoordMatrix = ifcApi.GetCoordinationMatrix(newIfcModelID);

        let relativeMatrix = new THREE.Matrix4();

        if (!baseCoordinationMatrix) {
          // Đây là mô hình đầu tiên: dùng làm gốc tọa độ chung cho các mô hình khác
          setBaseCoordinationMatrix(modelCoordMatrix);
          relativeMatrix.identity(); // Không cần chuyển đổi
        } else {
          // Mô hình khác: tính chuyển đổi tương đối về hệ gốc của mô hình đầu
          const baseMat = new THREE.Matrix4().fromArray(baseCoordinationMatrix);
          const currentMat = new THREE.Matrix4().fromArray(modelCoordMatrix);
          const baseInv = baseMat.clone().invert(); // Lấy nghịch đảo để đưa về gốc
          relativeMatrix.multiplyMatrices(baseInv, currentMat); // Áp chuyển đổi tương đối
        }

        // Lưu lại để nếu cần transform group/matrix thủ công sau này
        modelTransformRef.current.copy(relativeMatrix);

        // Thiết lập ma trận transform toàn cục cho model trước khi sinh geometry
        ifcApi.SetGeometryTransformation(newIfcModelID, Array.from(relativeMatrix.elements));


        createMeshes();
        console.log(`IFCModel (${modelData.id}): Extracting data for modelID ${newIfcModelID}...`);
        // const _tree = await fetchFullSpatialStructure(ifcApi, newIfcModelID);
        const tree = await buildSpatialTree(newIfcModelID, ifcApi);
        if (tree) {
          console.log(`IFCModel (${modelData.id}): Spatial structure extracted.`);
          setSpatialTreeForModel(newIfcModelID, tree);
        } else {
          console.warn(`IFCModel (${modelData.id}): Spatial structure extraction failed or empty.`);
          setSpatialTreeForModel(newIfcModelID, null);
        }

        const allTypesResult = ifcApi.GetIfcEntityList(newIfcModelID);
        const allTypesArray: number[] = Array.isArray(allTypesResult) ? allTypesResult : [];
        setAvailableCategoriesForModel(newIfcModelID, allTypesArray.map(String));
        console.log(`IFCModel (${modelData.id}): Available categories set.`);

        setLoadingProgress(100);
        setIsLoading(false);
        setLoadingMessage("");
      } catch (error) {
        console.error(`IFCModel (${modelData.id}): Error loading:`, error);
        setIsLoading(false);
        setLoadingMessage("Error loading model");
        setLoadingProgress(0);
      }
    };
    loadThisModel();
  }, [
    modelData.url,
    ifcApi,
    scene,
    modelData.id,
    setModelIDForLoadedModel,
    setSpatialTreeForModel,
    setAvailableCategoriesForModel,
    setInternalApiIdForEffects,
    setRawBufferForModel,
    createMeshes,
    setIsLoading,
    setLoadingProgress,
    setLoadingMessage,
    baseCoordinationMatrix,
    setBaseCoordinationMatrix,
  ]);

  return { internalApiIdForEffects, modelMeshesProcessedForInitialView, setModelMeshesProcessedForInitialView };
}