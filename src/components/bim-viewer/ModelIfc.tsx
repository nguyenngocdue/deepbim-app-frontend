import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useLocation } from "@tanstack/react-router";
import IfcLoaderV2 from "./IfcLoaderV2";

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

import { UploadState } from "@/props/UploadState";
import { ModelIfcProps } from "@/props/ModelIfcProps";
import { useBimViewerFeatures, FeatureFlags } from "@/features/bim-viewer/useBimViewerFeatures";
import { worldManager } from "@/services/WorldManager";
import { gridManager } from "@/services/GridManager";
import { containerManager } from "@/services/ContainerManager";

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
  onModelReady,
}) => {
  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const needsUpdateRef = useRef(true);
  const isLoopRunningRef = useRef(false);

  const location = useLocation();
  const state = location.state as unknown as UploadState | undefined;
  const file = state?.file;
  const statusUpload = state?.status;
  const [isWorldReady, setIsWorldReady] = useState(false);

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

  const animate = () => {
    if (!needsUpdateRef.current || !worldRef.current?.renderer) {
      isLoopRunningRef.current = false;
      return;
    }

    const t0 = performance.now();
    worldRef.current.renderer.update();
    const t1 = performance.now();

    if (t1 - t0 > 16) {
      console.warn(`[Perf] Frame took ${Math.round(t1 - t0)}ms`);
    }

    needsUpdateRef.current = false;
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const markDirty = () => {
    needsUpdateRef.current = true;
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      animationIdRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const handleInteraction = () => markDirty();
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("wheel", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!ifcContainerRef.current) return;
      containerManager.setRef(ifcContainerRef.current);
      await worldManager.initialize();
      if (cancelled) return;

      onModelReady?.();
      const world = worldManager.getWorld();
      const components = worldManager.getComponents();
      if (!components) return;

      gridManager.createGrid(components, world);
      worldRef.current = world;
      componentRef.current = components;

      markDirty();
      setIsWorldReady(true);
    };

    init();

    return () => {
      cancelled = true;
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      worldRef.current?.dispose();
      setIsWorldReady(false);
    };
  }, []);

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
    <div className="relative w-full h-full" id="deepbim-mainviewer">
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
