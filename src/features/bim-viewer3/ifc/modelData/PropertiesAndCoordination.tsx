import { SelectedElementInfo } from "@/context/ifc-context";
import { useEffect, useCallback } from "react";
import * as THREE from "three";
import { IfcAPI } from "web-ifc";

export function usePropertiesAndCoordination(
  ifcApi: IfcAPI | null,
  selectedElement: SelectedElementInfo | null,
  internalApiIdForEffects: number | null,
  ownModelID: React.MutableRefObject<number | null>,
  meshesRef: React.MutableRefObject<THREE.Group | null>,
  modelTransformRef: React.MutableRefObject<THREE.Matrix4>,
  baseCoordinationMatrix: number[] | null,
  setBaseCoordinationMatrix: (matrix: number[]) => void,
  setElementProperties: (props: any) => void,
  getElementPropertiesCached: (modelID: number, expressID: number) => Promise<any>,
  modelData: { id: string }
) {
  const findMeshByExpressIDLocal = (expressID: number): THREE.Mesh | null => {
    if (!meshesRef.current || ownModelID.current === null) return null;
    let foundMesh = null;
    meshesRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.userData.expressID === expressID &&
        child.userData.modelID === ownModelID.current
      ) {
        foundMesh = child;
      }
    });
    return foundMesh;
  };

  const fetchPropertiesForSelectedElement = useCallback(async () => {
    if (!ifcApi || !selectedElement || internalApiIdForEffects === null || selectedElement.modelID !== internalApiIdForEffects) {
      if (!selectedElement) setElementProperties(null);
      return;
    }
    const props = await getElementPropertiesCached(internalApiIdForEffects, selectedElement.expressID);
    if (props) {
      setElementProperties(props);
    } else {
      setElementProperties({ error: "Failed to fetch properties" });
    }
  }, [ifcApi, selectedElement, internalApiIdForEffects, setElementProperties, getElementPropertiesCached]);

  useEffect(() => {
    if (
      selectedElement &&
      internalApiIdForEffects !== null &&
      selectedElement.modelID === internalApiIdForEffects
    ) {
      fetchPropertiesForSelectedElement();
    } else {
      setElementProperties(null);
    }
  }, [selectedElement, internalApiIdForEffects, fetchPropertiesForSelectedElement, modelData.id, setElementProperties]);

  useEffect(() => {
    if (!ifcApi || internalApiIdForEffects === null) return;
    try {
      const modelCoordMatrix = ifcApi.GetCoordinationMatrix(internalApiIdForEffects);
      const relativeMatrix = new THREE.Matrix4();
      if (!baseCoordinationMatrix) {
        setBaseCoordinationMatrix(modelCoordMatrix);
        relativeMatrix.identity();
      } else {
        const baseMat = new THREE.Matrix4().fromArray(baseCoordinationMatrix);
        const currentMat = new THREE.Matrix4().fromArray(modelCoordMatrix);
        const baseInv = baseMat.clone().invert();
        relativeMatrix.multiplyMatrices(baseInv, currentMat);
      }
      modelTransformRef.current.copy(relativeMatrix);
      ifcApi.SetGeometryTransformation(internalApiIdForEffects, Array.from(relativeMatrix.elements));
    } catch (error) {
      console.error('Error setting geometry transformation:', error);
    }
  }, [baseCoordinationMatrix, setBaseCoordinationMatrix, ifcApi, internalApiIdForEffects]);
}