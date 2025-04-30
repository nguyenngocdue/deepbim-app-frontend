import React, { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import IfcLoaderV2 from "./IfcLoaderV2";
import { ModelIfcProps } from "@/props/ModelIfcProps";

import { useBimViewerFeatures } from "@/features/bim-viewer/useBimViewerFeatures";
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

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const ModelIfc: React.FC<ModelIfcProps> = (props) => {
  const { onModelReady, viewId, ...flags } = props;

  const ifcContainerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const componentRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);


  const featureFlags = useFeatureFlags(flags);

  const { isWorldReady, world, components } = useInitWorld(ifcContainerRef, onModelReady);

  // Selection by a right click
  const selections = useSelections();
  const isolate = selections?.isolate || (() => { });
  const onShowAll = selections?.onShowAll || (() => { });
  const onHide = selections?.onHide || (() => { });
  const onHideByIFCType = selections?.onHideByIFCType || (() => { });
  const onFocusSelection = selections?.onFocusSelection || (() => { });
  const onIsolateByIFCType = selections?.onIsolateByIFCType || (() => { });
  const onShowProperties = selections?.onShowProperties || (() => { });
  const { contextMenu, setContextMenu, openContextMenu } = useContextMenu();

  worldRef.current = world;
  componentRef.current = components;


  useViewerLoop(worldRef);
  useBimViewerFeatures({
    worldRef,
    componentRef,
    ifcContainerRef,
    modelRef,
    isWorldReady,
    featureFlags,
  });


  // const shouldLoadModel = isWorldReady && statusUpload === "upload_by_user";
  return (
    <div className="relative w-full h-full " id="deepbim-mainviewer">
        <IfcLoaderV2
          worldRef={worldRef}
          componentRef={componentRef}
          container={ifcContainerRef.current}
          haveGrids={flags.haveGrids}
        />

      {/* vùng 3D viewer */}
      <div
        ref={ifcContainerRef}
        className="w-full h-full "
        onContextMenu={(e) => openContextMenu(e, ifcContainerRef.current)}
      />

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
