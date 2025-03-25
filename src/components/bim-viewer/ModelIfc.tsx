import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";


import { useHighlightSetup } from "@/features/bim-viewer/useHighlightSetup";
import { useIfcLoader } from "@/features/bim-viewer/useIfcLoader";
import { useClippingEdges } from "@/features/bim-viewer/useClippingEdges";
import { useEdgeMeasurement } from "@/features/bim-viewer/useEdgeMeasurement";
import { useFaceMeasurement } from "@/features/bim-viewer/useFaceMeasurement";
import { useVolumeMeasurement } from "@/features/bim-viewer/useVolumeMeasurement";
import { usePlaneViews } from "@/features/bim-viewer/usePlaneViews";
import { useLengthMeasurements } from "@/features/bim-viewer/useLengthMeasurements";
import * as OBC from "@thatopen/components";

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast
} from "three-mesh-bvh";
import { UpdateCameraType } from "./common/UpdateCameraType";
import { InitializeWorld } from "./common/InitializeWorld";
import { useAreaMeasurements } from "@/features/bim-viewer/useAreaMeasurements";
import { useAngleMeasurements } from "@/features/bim-viewer/useAngleMeasurements";
import { useWorldSettings } from "@/features/bim-viewer/useWorldSettings";
import { useGrids } from "@/features/bim-viewer/useGrid";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

interface ModelIfcProps {
  sectionActive: boolean;
  isOrthoPerspective: boolean;
  navigationMode: "Orbit" | "FirstPerson" | "Plan";
  coordinateSyssActive: boolean;
  selectedFile: Uint8Array | null;
  onFileSelect: (filePath: Uint8Array | null) => void;
  coordinateSysActive: boolean;
  isHighlightEnabled: boolean;
  isClippingEdges: boolean;
  isEdgeMeasurement: boolean;
  isFaceMeasurement: boolean;
  haveGrids: boolean;
  hasVolumeMeasurement: boolean;
  havePlansViews: boolean;
  haveLengthMeasurements: boolean;
  haveAreaMeasureElements:boolean;
  haveAngleMeasurements:boolean;
  haveWorldSettings:boolean;
}

const ModelIfc: React.FC<ModelIfcProps> = ({
  isOrthoPerspective,
  navigationMode,
  selectedFile,
  isHighlightEnabled,
  isClippingEdges,
  isEdgeMeasurement,
  isFaceMeasurement,
  haveGrids,
  hasVolumeMeasurement,
  havePlansViews,
  haveLengthMeasurements,
  haveAreaMeasureElements,
  haveAngleMeasurements,
  haveWorldSettings,
}) => {
  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const boxHelperRef = useRef<THREE.BoxHelper | null>(null);
  const transformControlsRef = useRef<TransformControls[]>([]);
  const gridRef= useRef<any | null>(null);

  const [isWorldReady, setIsWorldReady] = useState(false);

  useEffect(() => {
    if (!ifcContainerRef.current) return;
    const { world, components, grid } = InitializeWorld(ifcContainerRef.current,haveGrids );
    componentRef.current = components;
    worldRef.current = world;
    gridRef.current = grid;
    setIsWorldReady(true);

    const animate = () => {
      if (!worldRef.current || !worldRef.current.renderer) return;
      requestAnimationFrame(animate);
      worldRef.current.renderer.update();
    };
    animate();

    // Cleanup
    return () => {
      transformControlsRef.current.forEach((c) => c.dispose());
      components.dispose();
      worldRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isWorldReady && !selectedFile) {
      useIfcLoader({ worldRef, componentRef, modelRef, boxHelperRef });
    }
  }, [isWorldReady]);

  useEffect(() => {
    useHighlightSetup({ isHighlightEnabled, componentRef, worldRef });
  }, [isWorldReady, isHighlightEnabled]);

  useEffect(() => {
    useEdgeMeasurement({ isEdgeMeasurement, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, isEdgeMeasurement]);

  useEffect(() => {
    useClippingEdges({ isClippingEdges, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, isClippingEdges]);

  useEffect(() => {
    useFaceMeasurement({ isFaceMeasurement, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, isFaceMeasurement]);

  useEffect(() => {
    useGrids({ haveGrids, worldRef, gridRef});
  }, [isWorldReady, haveGrids]);

  useEffect(() => {
    useVolumeMeasurement({ hasVolumeMeasurement, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, hasVolumeMeasurement]);

  useEffect(() => {
    usePlaneViews({ havePlansViews, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, havePlansViews]);

  useEffect(() => {
    useLengthMeasurements({ haveLengthMeasurements, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, haveLengthMeasurements]);

  useEffect(() => {
    useAreaMeasurements({ haveAreaMeasureElements, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, haveAreaMeasureElements]);

  useEffect(() => {
    if (!isWorldReady || !worldRef.current) return;
    UpdateCameraType(isOrthoPerspective, worldRef, navigationMode, componentRef);
  }, [isOrthoPerspective, navigationMode, isWorldReady]);

  useEffect(() => {
    useAngleMeasurements({ haveAngleMeasurements, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, haveAngleMeasurements]);

  useEffect(() => {
    useWorldSettings({ haveWorldSettings, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, haveWorldSettings]);

  return (
    <div className="relative w-screen h-screen">
      <div ref={ifcContainerRef} className="w-full h-full" />
    </div>
  );
};

export default ModelIfc;