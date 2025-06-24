"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { IfcAPI } from "web-ifc";
import {
  useIFCContext,
  LoadedModelData,
  SpatialStructureNode,
  SelectedElementInfo,
} from "@/context/ifc/ifc-context";
import { useModelLoading } from "../modelData/ModelLoading";
import { useCameraAndHighlighting } from "../modelData/CameraAndHighlighting";
import { usePropertiesAndCoordination } from "../modelData/PropertiesAndCoordination";

interface IFCModelProps {
  modelData: LoadedModelData;
  outlineLayer: number;
}

export function IFCModel({ modelData }: IFCModelProps) {
  const { scene, camera, controls } = useThree();
  const ownModelID = useRef<number | null>(null);
  const meshesRef = useRef<THREE.Group | null>(null);
  const modelTransformRef = useRef<THREE.Matrix4>(new THREE.Matrix4());
  const originalMaterials = useRef<Map<number, THREE.Material | THREE.Material[]>>(new Map());

  const {
    ifcApi,
    setSpatialTreeForModel,
    setElementProperties,
    selectedElement,
    selectedElements,
    highlightedElements,
    highlightedClassificationCode,
    setModelIDForLoadedModel,
    setAvailableCategoriesForModel,
    classifications,
    showAllClassificationColors,
    userHiddenElements,
    hiddenModelIds,
    setRawBufferForModel,
    baseCoordinationMatrix,
    setBaseCoordinationMatrix,
    getElementPropertiesCached,
    setIsLoading,
    setLoadingProgress,
    setLoadingMessage,
  } = useIFCContext();

  const highlightMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0x00bcd4,
      depthTest: false,
    });
  }, []);

  const selectionMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0x332200,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthTest: true,
    });
  }, []);

  const createThreeJSGeometry = useCallback(
    (ifcGeomData: any) => {
      if (!ifcApi || ownModelID.current === null) throw new Error("ifcApi or modelID not available");
      const verts = ifcApi.GetVertexArray(ifcGeomData.GetVertexData(), ifcGeomData.GetVertexDataSize());
      const indices = ifcApi.GetIndexArray(ifcGeomData.GetIndexData(), ifcGeomData.GetIndexDataSize());
      const bufferGeometry = new THREE.BufferGeometry();
      const numVertices = verts.length / 6;
      const positions = new Float32Array(numVertices * 3);
      const normals = new Float32Array(numVertices * 3);
      for (let i = 0; i < numVertices; i++) {
        const vertexOffset = i * 6;
        const positionOffset = i * 3;
        positions[positionOffset] = verts[vertexOffset];
        positions[positionOffset + 1] = verts[vertexOffset + 1];
        positions[positionOffset + 2] = verts[vertexOffset + 2];
        normals[positionOffset] = verts[vertexOffset + 3];
        normals[positionOffset + 1] = verts[vertexOffset + 4];
        normals[positionOffset + 2] = verts[vertexOffset + 5];
      }
      bufferGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      bufferGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      bufferGeometry.setIndex(Array.from(indices));
      return bufferGeometry;
    },
    [ifcApi]
  );

  const createMeshes = useCallback(() => {
    if (!ifcApi || ownModelID.current === null) return;

    if (meshesRef.current) {
      scene.remove(meshesRef.current);
      meshesRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      });
    }

    const group = new THREE.Group();
    group.name = `IFCModelGroup_${modelData.id}_${ownModelID.current}`;
    meshesRef.current = group;

    try {
      const flatMeshes = ifcApi.LoadAllGeometry(ownModelID.current!);
      for (let i = 0; i < flatMeshes.size(); i++) {
        const flatMesh = flatMeshes.get(i);
        const elementExpressID = flatMesh.expressID;
        const placedGeometries = flatMesh.geometries;
        for (let j = 0; j < placedGeometries.size(); j++) {
          const placedGeometry = placedGeometries.get(j);
          const ifcGeometryData = ifcApi.GetGeometry(ownModelID.current!, placedGeometry.geometryExpressID);
          const threeJsGeometry = createThreeJSGeometry(ifcGeometryData);
          const color = placedGeometry.color;
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color.x, color.y, color.z),
            side: THREE.DoubleSide,
            transparent: color.w < 1,
            opacity: color.w,
            metalness: 0.1,
            roughness: 0.1
          });
          const mesh = new THREE.Mesh(threeJsGeometry, material);
          const matrix = placedGeometry.flatTransformation;
          const mat = new THREE.Matrix4();
          mat.fromArray(matrix);
          mesh.applyMatrix4(mat);
          mesh.userData = {
            expressID: elementExpressID,
            modelID: ownModelID.current,
          };
          group.add(mesh);
        }
      }

      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      group.position.sub(center);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.far = size.length() * 10;
        camera.updateProjectionMatrix();
      }

      scene.add(group);
    } catch (error) {
      console.error(`IFCModel (${modelData.id}): Error creating meshes:`, error);
    }
  }, [ifcApi, scene, modelData.id, createThreeJSGeometry, camera]);

  const { internalApiIdForEffects, modelMeshesProcessedForInitialView, setModelMeshesProcessedForInitialView } = useModelLoading(
    modelData,
    ifcApi,
    scene,
    meshesRef,
    ownModelID,
    modelTransformRef,
    originalMaterials,
    createMeshes,
    setSpatialTreeForModel,
    setModelIDForLoadedModel,
    setAvailableCategoriesForModel,
    setRawBufferForModel,
    baseCoordinationMatrix,
    setBaseCoordinationMatrix,
    setIsLoading,
    setLoadingProgress,
    setLoadingMessage
  );

  useCameraAndHighlighting(
    meshesRef,
    internalApiIdForEffects,
    modelMeshesProcessedForInitialView,
    setModelMeshesProcessedForInitialView,
    camera,
    controls,
    modelData,
    selectedElements,
    highlightedElements,
    highlightedClassificationCode,
    classifications,
    showAllClassificationColors,
    userHiddenElements,
    hiddenModelIds,
    ifcApi,
    highlightMaterial,
    selectionMaterial,
    originalMaterials
  );

  usePropertiesAndCoordination(
    ifcApi,
    selectedElement,
    internalApiIdForEffects,
    ownModelID,
    meshesRef,
    modelTransformRef,
    baseCoordinationMatrix,
    setBaseCoordinationMatrix,
    setElementProperties,
    getElementPropertiesCached,
    modelData
  );

  useEffect(() => {
    return () => {
      if (ownModelID.current !== null && ifcApi) {
        try {
          console.log(`IFCModel (${modelData.id}): Closing model ID:`, ownModelID.current);
          ifcApi.CloseModel(ownModelID.current);
        } catch (error) {
          console.error(`IFCModel (${modelData.id}): Error closing model:`, error);
        }
      }
      if (meshesRef.current) {
        scene.remove(meshesRef.current);
        meshesRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
            else child.material.dispose();
          }
        });
        meshesRef.current = null;
      }
      highlightMaterial.dispose();
      selectionMaterial.dispose();
    };
  }, [scene, ifcApi, modelData.id, highlightMaterial, selectionMaterial]);

  return null; // IFCModel doesn't render anything directly
}