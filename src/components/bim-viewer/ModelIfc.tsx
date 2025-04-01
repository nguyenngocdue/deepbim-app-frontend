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

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast
} from "three-mesh-bvh";
import { InitializeWorld } from "./common/InitializeWorld";
import { useAreaMeasurements } from "@/features/bim-viewer/useAreaMeasurements";
import { useAngleMeasurements } from "@/features/bim-viewer/useAngleMeasurements";
import { useWorldSettings } from "@/features/bim-viewer/useWorldSettings";
import { useGrids } from "@/features/bim-viewer/useGrid";
import { ModelIfcProps } from "@/props/ModelIfcProps";
import { useSectionBox } from "@/features/bim-viewer/useSectionBox";
import { useFreeControlElements } from "@/features/bim-viewer/useFreeControlElements";
import { usePlaneHover } from "@/features/bim-viewer/usePlaneHover";
import { useSetViewPoint } from "@/features/bim-viewer/useSetViewPoint";
import { useCoordinateSystem } from "@/features/bim-viewer/useCoordinateSystem";
import { useLocation } from "@tanstack/react-router";
import IfcLoaderV2 from "./IfcLoaderV2";
import { UploadState } from "@/props/UploadState";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;


const ModelIfc: React.FC<ModelIfcProps> = ({
  isOrthoPerspective,
  coordinateSysActive,
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
  sectionActive,
  isFreeControlElements,
  isPlaneHover,
  isFitView,
}) => {
  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const transformControlsRef = useRef<TransformControls[]>([]);
  const gridRef= useRef<any | null>(null);

  // define state of model
  const location = useLocation();
  const state = location.state as unknown as UploadState;
  const file = state.file;
  let statusUpload = state.status;
  const [isWorldReady, setIsWorldReady] = useState(false);

  useEffect(() => {
    if (!ifcContainerRef.current) return;
    const { world, components, grid } = InitializeWorld(ifcContainerRef.current,haveGrids, isOrthoPerspective );
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
    console.log(components)
    return () => {
      transformControlsRef.current.forEach((c) => c.dispose());
      // components.dispose();
      worldRef.current = null;
      setIsWorldReady(false);
    };
  }, [isOrthoPerspective, haveGrids]);


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
    useAngleMeasurements({ haveAngleMeasurements, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, haveAngleMeasurements]);

  useEffect(() => {
    useWorldSettings({ haveWorldSettings, componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, haveWorldSettings]);


  useEffect(() => {
    useSectionBox({sectionActive , componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, sectionActive]);

  useEffect(() => {
    useFreeControlElements({isFreeControlElements , componentRef, worldRef, ifcContainerRef, modelRef });
  }, [isWorldReady, isFreeControlElements]);

  usePlaneHover({isPlaneHover , componentRef, worldRef, ifcContainerRef, modelRef });
  useSetViewPoint({isFitView,  componentRef, worldRef, ifcContainerRef, modelRef });
  useCoordinateSystem({coordinateSysActive, worldRef});
   return (
    <div className="relative w-screen h-screen">
      {
       statusUpload == 'example' && 
       <IfcLoaderV2
          source='/ifc/small.ifc'
          state={{ example: true }}
          worldRef={worldRef}
          componentRef={componentRef}
          modelRef={modelRef}
        />
      }
      {
        statusUpload == 'upload_by_user' &&
        <IfcLoaderV2
          source={file}
          state={{ example: true }}
          worldRef={worldRef}
          componentRef={componentRef}
          modelRef={modelRef}
        />
      }
      <div ref={ifcContainerRef} className="w-full h-full" />
    </div>
  );
};

export default ModelIfc;