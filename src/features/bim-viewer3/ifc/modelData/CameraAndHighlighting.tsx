import { useEffect } from "react";
import * as THREE from "three";
import { SelectedElementInfo } from "@/context/ifc-context"; // Adjust path
import { IfcAPI } from "web-ifc";
import { fitCameraToObject } from "@/components/ifc-classifier/FitCameraToObject";

export function useCameraAndHighlighting(
  meshesRef: React.MutableRefObject<THREE.Group | null>,
  internalApiIdForEffects: number | null,
  modelMeshesProcessedForInitialView: boolean,
  setModelMeshesProcessedForInitialView: (value: boolean) => void,
  camera: THREE.Camera,
  controls: any,
  modelData: { id: string },
  selectedElements: SelectedElementInfo[],
  highlightedElements: SelectedElementInfo[],
  highlightedClassificationCode: string | null,
  classifications: Record<string, any>,
  showAllClassificationColors: boolean,
  userHiddenElements: SelectedElementInfo[],
  hiddenModelIds: string[],
  ifcApi: IfcAPI | null,
  highlightMaterial: THREE.MeshBasicMaterial,
  selectionMaterial: THREE.MeshStandardMaterial,
  originalMaterials: React.MutableRefObject<Map<number, THREE.Material | THREE.Material[]>>
) {
  useEffect(() => {
    if (
      meshesRef.current &&
      meshesRef.current.children.length > 0 &&
      internalApiIdForEffects !== null &&
      !modelMeshesProcessedForInitialView &&
      camera instanceof THREE.PerspectiveCamera &&
      controls
    ) {
      console.log(`IFCModel (${modelData.id}): Setting initial camera view for model ID ${internalApiIdForEffects}`);
      try {
        fitCameraToObject(camera, meshesRef.current, controls);
        setModelMeshesProcessedForInitialView(true);
      } catch (error) {
        console.error(`IFCModel (${modelData.id}): Error setting camera view:`, error);
      }
    }
  }, [internalApiIdForEffects, modelMeshesProcessedForInitialView, camera, controls, modelData.id, setModelMeshesProcessedForInitialView]);

  useEffect(() => {
    if (!meshesRef.current || internalApiIdForEffects === null || !ifcApi) return;
    const modelHidden = hiddenModelIds.includes(modelData.id);
    meshesRef.current.visible = !modelHidden;
    if (modelHidden) return;

    const currentModelID = internalApiIdForEffects;
    const selectedExpressIDsInThisModel = selectedElements
      .filter((el) => el.modelID === currentModelID)
      .map((el) => el.expressID);
    const highlightedExpressIDsInThisModel = highlightedElements
      .filter((h) => h.modelID === currentModelID)
      .map((h) => h.expressID);

    meshesRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.userData.expressID !== undefined &&
        child.userData.modelID === currentModelID
      ) {
        const mesh = child as THREE.Mesh;
        const expressID = mesh.userData.expressID;
        if (!originalMaterials.current.has(expressID)) {
          originalMaterials.current.set(expressID, mesh.material);
        }
        const trueOriginalMaterial = originalMaterials.current.get(expressID)!;
        let targetMaterial: THREE.Material | THREE.Material[] = trueOriginalMaterial;
        let isCurrentlyVisible = true;

        if (showAllClassificationColors) {
          let elementClassificationColor: string | null = null;
          for (const classification of Object.values(classifications)) {
            const isInClassification = classification.elements?.some(
              (el: SelectedElementInfo) => el && el.modelID === currentModelID && el.expressID === expressID
            );
            if (isInClassification) {
              elementClassificationColor = classification.color || "#808080";
              break;
            }
          }
          if (elementClassificationColor) {
            let isCorrectMaterial = false;
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              if (
                mesh.material.color.getHexString().toLowerCase() === elementClassificationColor.substring(1).toLowerCase() &&
                mesh.material.opacity === 0.9 &&
                mesh.material.transparent
              ) {
                isCorrectMaterial = true;
                targetMaterial = mesh.material;
              }
            }
            if (!isCorrectMaterial) {
              targetMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(elementClassificationColor),
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
              });
            }
          }
        }

        if (highlightedClassificationCode) {
          const activeClassification = classifications[highlightedClassificationCode];
          const isElementInActiveClassification = activeClassification?.elements?.some(
            (el: SelectedElementInfo) => el && el.modelID === currentModelID && el.expressID === expressID
          );
          if (isElementInActiveClassification) {
            isCurrentlyVisible = true;
            if (activeClassification && activeClassification.color) {
              let isCorrectMaterial = false;
              if (mesh.material instanceof THREE.MeshStandardMaterial) {
                if (
                  mesh.material.color.getHexString().toLowerCase() === activeClassification.color.substring(1).toLowerCase() &&
                  mesh.material.opacity === 0.7 &&
                  mesh.material.transparent
                ) {
                  isCorrectMaterial = true;
                  targetMaterial = mesh.material;
                }
              }
              if (!isCorrectMaterial) {
                targetMaterial = new THREE.MeshStandardMaterial({
                  color: new THREE.Color(activeClassification.color),
                  transparent: true,
                  opacity: 0.7,
                  side: THREE.DoubleSide,
                });
              }
            }
          } else {
            if (activeClassification && activeClassification.elements && activeClassification.elements.length > 0) {
              isCurrentlyVisible = false;
              targetMaterial = trueOriginalMaterial;
            }
          }
        }

        const isUserExplicitlyHidden = userHiddenElements.some(
          (hiddenEl) => hiddenEl.modelID === currentModelID && hiddenEl.expressID === expressID
        );
        if (isUserExplicitlyHidden) {
          isCurrentlyVisible = false;
        }

        if (selectedExpressIDsInThisModel.includes(expressID)) {
          targetMaterial = selectionMaterial;
          isCurrentlyVisible = true;
        }

        mesh.visible = isCurrentlyVisible;
        if (mesh.material !== targetMaterial && isCurrentlyVisible) {
          const oldMaterial = mesh.material as THREE.Material;
          if (
            oldMaterial !== trueOriginalMaterial &&
            !(Array.isArray(trueOriginalMaterial) && trueOriginalMaterial.includes(oldMaterial)) &&
            !Array.isArray(oldMaterial)
          ) {
            if (typeof oldMaterial.dispose === "function") oldMaterial.dispose();
          }
          mesh.material = targetMaterial;
        } else if (!isCurrentlyVisible && mesh.material !== trueOriginalMaterial) {
          if (mesh.material !== trueOriginalMaterial) {
            const oldMaterial = mesh.material as THREE.Material;
            if (
              oldMaterial !== trueOriginalMaterial &&
              !(Array.isArray(trueOriginalMaterial) && trueOriginalMaterial.includes(oldMaterial)) &&
              !Array.isArray(oldMaterial)
            ) {
              if (typeof oldMaterial.dispose === "function") oldMaterial.dispose();
            }
            mesh.material = trueOriginalMaterial;
          }
        }
      }
    });
  }, [
    selectedElements,
    highlightedElements,
    highlightedClassificationCode,
    classifications,
    showAllClassificationColors,
    internalApiIdForEffects,
    ifcApi,
    highlightMaterial,
    selectionMaterial,
    userHiddenElements,
    hiddenModelIds,
  ]);
}