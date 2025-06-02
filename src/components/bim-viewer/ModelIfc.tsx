import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

import IfcLoaderV2 from "./IfcLoaderV2";
import ContextMenu from "./common/ContextMenu";
import { ModelIfcProps } from "@/props/ModelIfcProps";
import { useFeatureFlags } from "@/features/bim-viewer/useFeatureFlags";
import { useInitWorld } from "@/features/bim-viewer/useInitWorld";
import { useViewerLoop } from "@/features/bim-viewer/useViewerLoop";
import { useSelections } from "@/features/bim-viewer/useSelections";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useBimViewerFeatures } from "@/features/bim-viewer/useBimViewerFeatures";

// Extend THREE for better raycasting
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const ModelIfc: React.FC<ModelIfcProps> = ({ viewId, ...flags }) => {
  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  const [showAttributes, setShowAttributes] = useState(false); // for property viewer

  const featureFlags = useFeatureFlags(flags);
  const { world, components } = useInitWorld(ifcContainerRef);

  const selections = useSelections();
  const {
    isolate = () => {},
    onShowAll = () => {},
    onHide = () => {},
    onHideByIFCCate = () => {},
    onFocusSelection = () => {},
    onIsolateByIFCCate = () => {},
    onToggleVisibility = () => {},
    onToggleElements = () => {},
  } = selections || {};

  const { contextMenu, setContextMenu, openContextMenu } = useContextMenu();

  worldRef.current = world;
  componentRef.current = components;

  useViewerLoop(worldRef);
  useBimViewerFeatures({
    worldRef,
    componentRef,
    ifcContainerRef,
    modelRef,
    featureFlags,
  });

  const handleContextAction = (action: string) => {
    switch (action) {
      case "showAll":
        return onShowAll();
      case "onToggleVisibility":
        return onToggleVisibility();
      case "onToggleElements":
        return onToggleElements();
      case "isolate":
        return isolate();
      case "hide":
        return onHide();
      case "hideByIFCType":
        return onHideByIFCCate();
      case "focusSelection":
        return onFocusSelection();
      case "onIsolateByIFCCate":
        return onIsolateByIFCCate();
      case "onShowProperties":
        return setShowAttributes(true);
      default:
        return;
    }
  };

  return (
    <>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      <div
        ref={ifcContainerRef}
        id="deepbim-mainviewer"
        className="bg-transparent h-screen w-full"
        onContextMenu={(e) =>
          openContextMenu(e, ifcContainerRef.current)
        }
      >
        {ifcContainerRef.current && (
          <IfcLoaderV2
            container={ifcContainerRef.current}
            worldRef={worldRef}
            componentRef={componentRef}
            haveGrids={true}
          />
        )}
      </div>
    </>
  );
};

export default ModelIfc;
