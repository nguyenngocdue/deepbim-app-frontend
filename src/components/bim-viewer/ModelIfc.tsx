import React, { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import IfcLoaderV2 from "./IfcLoaderV2";
import { ModelIfcProps } from "@/props/ModelIfcProps";

import { useFeatureFlags } from "@/features/bim-viewer/useFeatureFlags";
import { useInitWorld } from "@/features/bim-viewer/useInitWorld";
import { useViewerLoop } from "@/features/bim-viewer/useViewerLoop";

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";
import ContextMenu from "./common/ContextMenu";
import { useSelections } from "@/features/bim-viewer/useSelections";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useBimViewerFeatures } from "@/features/bim-viewer/useBimViewerFeatures";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const ModelIfc: React.FC<ModelIfcProps> = (props) => {
  const {viewId, ...flags } = props;

  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);


  const featureFlags = useFeatureFlags(flags);

  const { world, components } = useInitWorld(ifcContainerRef);

  // Selection by a right click
  const selections = useSelections();
  const isolate = selections?.isolate || (() => { });
  const onShowAll = selections?.onShowAll || (() => { });
  const onHide = selections?.onHide || (() => { });
  const onHideByIFCType = selections?.onHideByIFCType || (() => { });
  const onFocusSelection = selections?.onFocusSelection || (() => { });
  const onIsolateByIFCType = selections?.onIsolateByIFCType || (() => { });
  const onShowProperties = selections?.onShowProperties || (() => { });
  const onToggleVisibility = selections?.onToggleVisibility || (() => { });
  const onToggleElements = selections?.onToggleElements || (() => { });
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


  return (
    <div className="bg-transparent h-screen w-full" id="deepbim-mainviewer" 
      ref={ifcContainerRef} 
      onContextMenu={(e) => openContextMenu(e, ifcContainerRef.current)}
      >
        {ifcContainerRef.current && (
          <IfcLoaderV2
            container={ifcContainerRef.current}
            worldRef={worldRef}
            componentRef={componentRef}
            haveGrids={true}
          />
        )}

      {/* context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={(action) => {
            switch (action) {
              case "showAll":
                onShowAll();
                break;
              case "onToggleVisibility":
                onToggleVisibility();
                break;
              case "onToggleElements":
                onToggleElements();
                break;
              case "isolate":
                isolate();
                break;
              case "hide":
                onHide();
                break;
              case "hideByIFCType":
                onHideByIFCType();
                break;
              case "focusSelection":
                onFocusSelection();
                break;
              case "onIsolateByIFCType":
                onIsolateByIFCType();
                break;
              case "onShowProperties":
                onShowProperties();
                break;
              default:
                break;
            }
          }}
        />
      )}
    </div>
  );
};

export default ModelIfc;
