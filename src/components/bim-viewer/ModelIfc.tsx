import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useLocation } from "@tanstack/react-router";
import IfcLoaderV2 from "./IfcLoaderV2";
import { InitializeWorld } from "./common/InitializeWorld";
import * as CUI from "@thatopen/ui-obc";

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

import { UploadState } from "@/props/UploadState";
import { ModelIfcProps } from "@/props/ModelIfcProps";
import { useBimViewerFeatures, FeatureFlags } from "@/features/bim-viewer/useBimViewerFeatures";
import { worldManager } from "@/services/WorldManager";
import { useHighlightSetup } from "@/features/bim-viewer/useHighlightSetup";
import { gridManager } from "@/services/GridManager";
import { containerManager } from "@/services/ContainerManager";

// Extend three.js geometry for BVH
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const ModelIfc: React.FC<ModelIfcProps> = ({
  coordinateSysActive,
  isClippingEdges,
  isOrthoPerspective,
  isEdgeMeasurement,
  isFaceMeasurement,
  haveGrids,
  hasVolumeMeasurement,
  havePlansViews,
  haveLengthMeasurements,
  haveAreaMeasureElements,
  haveAngleMeasurements,
  haveWorldSettings,
  sectionActive,
  isFreeControlElements,
  isPlaneHover,
  isFitView,
}) => {
  // Refs
  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  // Location & file state
  const location = useLocation();
  const state = location.state as unknown as UploadState | undefined;
  const file = state?.file;
  const statusUpload = state?.status;

  // Viewer state
  const [isWorldReady, setIsWorldReady] = useState(false);
  // Feature flags (memoized for performance)
  const featureFlags: FeatureFlags = useMemo(() => ({
    isClippingEdges,
    isEdgeMeasurement,
    isFaceMeasurement,
    isOrthoPerspective,
    haveGrids,
    hasVolumeMeasurement,
    havePlansViews,
    haveLengthMeasurements,
    haveAreaMeasureElements,
    haveAngleMeasurements,
    haveWorldSettings,
    sectionActive,
    isFreeControlElements,
    isPlaneHover,
    isFitView,
    coordinateSysActive,
  }), [
    isClippingEdges,
    isEdgeMeasurement,
    isFaceMeasurement,
    isOrthoPerspective,
    haveGrids,
    hasVolumeMeasurement,
    havePlansViews,
    haveLengthMeasurements,
    haveAreaMeasureElements,
    haveAngleMeasurements,
    haveWorldSettings,
    sectionActive,
    isFreeControlElements,
    isPlaneHover,
    isFitView,
    coordinateSysActive,
  ]);

  // Initialize viewer
  useEffect(() => {
    if (!ifcContainerRef.current) return;
    containerManager.setRef(ifcContainerRef.current);
    worldManager.initialize();
  
    const world = worldManager.getWorld();
    const components = worldManager.getComponents();

    if(!components) return;
    gridManager.createGrid(components, world);
    
    const isHighlightEnabled = true;
    useHighlightSetup({isHighlightEnabled, components, world})
    
    worldRef.current = world;
    componentRef.current = components;

    startRenderLoop();
    setIsWorldReady(true);

    return () => {
      world?.dispose();
      setIsWorldReady(false);
    };
  }, []); // Re-init when grid changes

  // Start render loop
  const startRenderLoop = () => {
    const animate = () => {
      if (!worldRef.current?.renderer) return;
      requestAnimationFrame(animate);
      worldRef.current.renderer.update();
    };
    animate();
  };
  // Hook for viewer features
  useBimViewerFeatures({
    worldRef,
    componentRef,
    ifcContainerRef,
    modelRef,
    isWorldReady,
    featureFlags,
  });

  const shouldLoadModel = isWorldReady && statusUpload === "upload_by_user";

  return (
    <div className="relative w-screen h-screen" id="deepbim-mainviewer">
      {shouldLoadModel && (
        <IfcLoaderV2
          source={file}
          worldRef={worldRef}
          componentRef={componentRef}
          container={ifcContainerRef.current}
          haveGrids={haveGrids}
        />
      )}
      <div ref={ifcContainerRef} className="w-full h-full" />
    </div>
  );
};

export default ModelIfc;
