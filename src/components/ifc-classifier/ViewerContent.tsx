
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Panel, PanelGroup, ImperativePanelHandle } from "react-resizable-panels";
import { useTranslation } from "react-i18next";
import { IfcAPI, Properties } from "web-ifc";
import * as THREE from "three";
import {
  useIFCContext,
  LoadedModelData,
  SelectedElementInfo,
  SpatialStructureNode,
} from "@/context/ifc-context";
import ViewToolbar from "./ViewToolbar";
import SelectionListOverlay from "./SelectionListOverlay";
import ResponsiveTabs from "./ResponsiveTabs";
import { ResizeHandleHorizontal, ResizeHandleVertical } from "./ResizeHandles";
// import { IFCModel } from "./IFCModel";
import { SpatialTreePanel } from "./spatial-tree-panel";
import { ModelInfo } from "./model-info";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useThree } from "@react-three/fiber";
import GlobalInteractionHandler from "./GlobalInteractionHandler";
import CameraActionsController, { CameraActions } from "./CameraActionsController";
import FileUpload from "./FileUpload";
import { LoadingOverlay2 } from "../common/LoadingOverlayV2";
import { IFCModel } from "@/features/bim-viewer3/ifc/components/IFCModelCore";

const SKIP_IFC_INITIALIZATION_FOR_TEST = false;

export default function ViewerContent() {
  const {
    isLoading,
    loadingProgress,
    loadingMessage,

    loadedModels,
    setIfcApi,
    ifcApi,
    selectedElement,
    selectedElements,
    selectElement,
    selectElements,
    toggleUserHideElement,
    unhideLastElement,
    unhideAllElements,
    hideElements,
    showElements,
    userHiddenElements,
    getElementPropertiesCached,
    addIFCModel,
    clearSelection,
  } = useIFCContext();
  const { t } = useTranslation();
  const [ifcEngineReady, setIfcEngineReady] = useState(false);
  const [webGLContextLost, setWebGLContextLost] = useState(false);
  const [canvasSearch, setCanvasSearch] = useState("");
  const [confirmedSearch, setConfirmedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ active: false, percent: 0, status: '' });
  const [isSearchRunning, setIsSearchRunning] = useState(false);
  const searchHiddenRef = useRef<SelectedElementInfo[]>([]);
  const scene = useRef<THREE.Scene | null>(null);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const cameraActionsRef = useRef<CameraActions>(null);
  const [settingsVersion, setSettingsVersion] = useState(0);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [hasAutoLoadedModels, setHasAutoLoadedModels] = useState(false);


  const OUTLINE_SELECTION_LAYER = 10;

  const gatherAllElements = useCallback((root: SpatialStructureNode | null) => {
    const items: SpatialStructureNode[] = [];
    if (!root) return items;
    const stack = [root];
    while (stack.length) {
      const node = stack.pop()!;
      items.push(node);
      if (node.children) stack.push(...node.children);
    }
    return items;
  }, []);

  const captureScene = useCallback((threeScene: THREE.Scene) => {
    scene.current = threeScene;
  }, []);

  const handleSettingsChanged = useCallback(() => {
    setSettingsVersion(v => v + 1);
  }, []);

  const handleZoomExtents = useCallback(() => {
    console.log("ViewerContent: handleZoomExtents called");
    cameraActionsRef.current?.zoomToExtents();
  }, []);

  const handleZoomSelected = useCallback(() => {
    console.log("ViewerContent: handleZoomSelected called");
    cameraActionsRef.current?.zoomToSelected(selectedElement);
  }, [selectedElement]);

  const handleSelectAllVisible = useCallback(() => {
    console.log("ViewerContent: handleSelectAllVisible called");
    if (!scene.current) return;
    const visibleElements: SelectedElementInfo[] = [];
    scene.current.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.userData &&
        object.userData.expressID !== undefined &&
        object.userData.modelID !== undefined &&
        object.visible
      ) {
        const elementInfo: SelectedElementInfo = {
          modelID: object.userData.modelID,
          expressID: object.userData.expressID,
        };
        const isUserHidden = userHiddenElements.some(
          (hidden) =>
            hidden.modelID === elementInfo.modelID &&
            hidden.expressID === elementInfo.expressID
        );
        if (!isUserHidden) {
          const alreadyAdded = visibleElements.some(
            (el) =>
              el.modelID === elementInfo.modelID &&
              el.expressID === elementInfo.expressID
          );
          if (!alreadyAdded) {
            visibleElements.push(elementInfo);
          }
        }
      }
    });
    console.log(`Selecting ${visibleElements.length} visible elements`);
    selectElements(visibleElements);
  }, [scene, userHiddenElements, selectElements]);

  const toggleLeftPanel = () => {
    if (leftPanelRef.current) {
      if (leftPanelRef.current.getSize() > 0) {
        leftPanelRef.current.collapse();
      } else {
        leftPanelRef.current.expand();
      }
    }
  };

  const toggleRightPanel = () => {
    if (rightPanelRef.current) {
      if (rightPanelRef.current.getSize() > 0) {
        rightPanelRef.current.collapse();
      } else {
        rightPanelRef.current.expand();
      }
    }
  };

  const handleToggleLeftPanel = () => {
    toggleLeftPanel();
    setLeftPanelCollapsed(!leftPanelCollapsed);
  };

  const handleToggleRightPanel = () => {
    toggleRightPanel();
    setRightPanelCollapsed(!rightPanelCollapsed);
  };

  const handleSearchSubmit = useCallback((searchTerm: string) => {
    console.log("Search submitted:", searchTerm);
    setConfirmedSearch(searchTerm);
    if (searchTerm.trim()) {
      setIsSearchRunning(true);
    }
  }, []);

  const handleCancelSearch = useCallback(() => {
    setIsSearchRunning(false);
    setSearchProgress({ active: false, percent: 0, status: 'Search cancelled' });
    setTimeout(() => {
      setSearchProgress({ active: false, percent: 0, status: '' });
    }, 1500);
  }, []);

  useEffect(() => {
    if (!confirmedSearch) {
      setSearchProgress({ active: false, percent: 0, status: '' });
      setIsSearchRunning(false);
    }
  }, [confirmedSearch]);

  useEffect(() => {
    console.log("userHiddenElements changed:", userHiddenElements.length, userHiddenElements.slice(0, 5));
  }, [userHiddenElements]);

  useEffect(() => {
    if (!ifcApi || !isSearchRunning) return;
    let cancelled = false;

    const toRegex = (q: string) => {
      const pattern = q.replace(/\*/g, ".*");
      try {
        return new RegExp(pattern, "i");
      } catch {
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(escaped, "i");
      }
    };

    const recursiveSearch = (data: any, regexInstance: RegExp, searchKeys: boolean = false): boolean => {
      if (data === null || data === undefined) return false;
      if (typeof data === 'string') return regexInstance.test(data.toLowerCase());
      if (typeof data === 'number' || typeof data === 'boolean') return regexInstance.test(String(data).toLowerCase());
      if (Array.isArray(data)) {
        for (const item of data) {
          if (recursiveSearch(item, regexInstance, searchKeys)) return true;
        }
        return false;
      }
      if (typeof data === 'object') {
        if (data.hasOwnProperty('value')) {
          if (recursiveSearch(data.value, regexInstance, false)) return true;
        }
        if (data.hasOwnProperty('NominalValue')) {
          if (recursiveSearch(data.NominalValue, regexInstance, false)) return true;
        }
        if (data.hasOwnProperty('wrappedValue')) {
          if (recursiveSearch(data.wrappedValue, regexInstance, false)) return true;
        }
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (searchKeys && regexInstance.test(key.toLowerCase())) return true;
            if (recursiveSearch(data[key], regexInstance, searchKeys)) return true;
          }
        }
        return false;
      }
      return false;
    };

    const applyFilter = async () => {
      if (searchHiddenRef.current.length > 0) {
        console.log("Showing previously hidden elements:", searchHiddenRef.current.length);
        showElements(searchHiddenRef.current);
        searchHiddenRef.current = [];
      }
      const query = confirmedSearch.trim();
      console.log("Applying filter with query:", query);
      if (!query) {
        setSearchProgress({ active: false, percent: 0, status: '' });
        setIsSearchRunning(false);
        return;
      }
      setSearchProgress({ active: true, percent: 0, status: 'Preparing search...' });
      const regex = toRegex(query);
      console.log("Search regex:", regex.source);
      const toHide: SelectedElementInfo[] = [];
      console.log("Loaded models:", loadedModels.length, loadedModels.map(m => ({
        id: m.id,
        name: m.name,
        modelID: m.modelID,
        hasSpatialTree: !!m.spatialTree
      })));
      const availableMeshIds: Record<number, Set<number>> = {};
      const allMeshes: Record<number, Record<number, THREE.Mesh>> = {};
      scene.current?.traverse((object) => {
        if (
          object instanceof THREE.Mesh &&
          object.userData &&
          object.userData.expressID !== undefined &&
          object.userData.modelID !== undefined
        ) {
          const modelID = object.userData.modelID;
          const expressID = object.userData.expressID;
          if (!availableMeshIds[modelID]) {
            availableMeshIds[modelID] = new Set();
            allMeshes[modelID] = {};
          }
          availableMeshIds[modelID].add(expressID);
          allMeshes[modelID][expressID] = object;
        }
      });
      if (Object.keys(availableMeshIds).length === 0) {
        console.log("WARNING: No meshes found in the scene with IFC data!");
      } else {
        console.log("Available mesh expressIDs by model:", Object.entries(availableMeshIds).map(
          ([modelID, ids]) => `Model ${modelID}: ${ids.size} meshes`
        ));
      }
      for (const model of loadedModels) {
        if (model.modelID === null || model.modelID === undefined || !model.spatialTree) {
          console.log(`Model ${model.id} (${model.name}) skipped - modelID: ${model.modelID}, hasSpatialTree: ${!!model.spatialTree}`);
          continue;
        }
        console.log(`Spatial tree root for model ${model.id}:`, {
          rootExpressID: model.spatialTree.expressID,
          rootType: model.spatialTree.type,
          rootName: model.spatialTree.Name,
          childrenCount: model.spatialTree.children?.length || 0
        });
        const nodes = gatherAllElements(model.spatialTree);
        console.log(`Model ${model.id} (${model.name}): Processing ${nodes.length} nodes for filtering.`);
        const modelMeshes = availableMeshIds[model.modelID] || new Set();
        const nodesWithMeshes = nodes.filter(node =>
          node.expressID !== undefined && modelMeshes.has(node.expressID)
        );
        console.log(`Model ${model.id}: ${nodes.length} tree nodes, ${nodesWithMeshes.length} have corresponding meshes`);
        if (nodes.length > 0) {
          console.log(`Sample node data (first node):`, {
            expressID: nodes[0].expressID,
            type: nodes[0].type,
            name: nodes[0].Name,
            hasMesh: nodes[0].expressID !== undefined && modelMeshes.has(nodes[0].expressID)
          });
        }
        let matchCount = 0;
        let noMatchCount = 0;
        const processedExpressIDsFromSpatialTree = new Set<number>();
        let errorCount = 0;
        const processNode = async (node: any): Promise<{ match: boolean; expressID: number }> => {
          if (typeof node.expressID !== 'number' || isNaN(node.expressID) || model.modelID === null || model.modelID === undefined) {
            return { match: false, expressID: -1 };
          }
          const expressID = node.expressID;
          processedExpressIDsFromSpatialTree.add(expressID);
          let match = false;
          if (node.Name && node.Name.value && typeof node.Name.value === 'string' && regex.test(node.Name.value.toLowerCase())) {
            match = true;
          } else if (node.type && regex.test(node.type.toLowerCase())) {
            match = true;
          } else if (node.GlobalId && node.GlobalId.value && typeof node.GlobalId.value === 'string' && regex.test(node.GlobalId.value.toLowerCase())) {
            match = true;
          }
          if (!match) {
            try {
              const props = await getElementPropertiesCached(model.modelID as number, expressID);
              if (props && recursiveSearch(props, regex, true)) {
                match = true;
              }
            } catch (err) {
              errorCount++;
              if (errorCount <= 3) {
                console.warn(`Error fetching props for ${model.modelID}-${expressID}:`, err);
              }
            }
          }
          return { match, expressID };
        };
        const batchSize = 20;
        const nodesToProcess = nodes.filter(node => node.expressID !== undefined);
        const results: { match: boolean; expressID: number }[] = [];
        const MAX_MATCHES = 1000;
        let hasReachedMaxMatches = false;
        for (let i = 0; i < nodesToProcess.length; i += batchSize) {
          if (cancelled || hasReachedMaxMatches) break;
          const currentBatch = nodesToProcess.slice(i, i + batchSize);
          const batchPromises = currentBatch.map(node => processNode(node));
          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
          const matchCount = results.filter(r => r.match).length;
          if (matchCount >= MAX_MATCHES) {
            console.log(`Found ${matchCount} matches, stopping search early`);
            setSearchProgress({ active: true, percent: 100, status: `Found ${matchCount} matches (stopped early)` });
            hasReachedMaxMatches = true;
          }
          if (i % 20 === 0 || i + batchSize >= nodesToProcess.length) {
            const percentComplete = Math.round((i / nodesToProcess.length) * 100);
            console.log(`Processed ${i}/${nodesToProcess.length} nodes (${percentComplete}%)...`);
            setSearchProgress({
              active: true,
              percent: percentComplete,
              status: `Searching... ${i}/${nodesToProcess.length} elements (${matchCount} matches found)`
            });
            if (i % 100 === 0) {
              const partialResults = results.filter(r => !r.match && r.expressID !== -1)
                .map(r => ({ modelID: model.modelID as number, expressID: r.expressID }));
              if (partialResults.length > 0) {
                for (const result of partialResults) {
                  if (allMeshes[result.modelID]?.[result.expressID]) {
                    const meshToHide = allMeshes[result.modelID][result.expressID];
                    meshToHide.visible = false;
                  }
                }
              }
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
        }
        for (const result of results) {
          if (result.expressID === -1) continue;
          if (result.match) {
            matchCount++;
          } else {
            noMatchCount++;
            toHide.push({ modelID: model.modelID, expressID: result.expressID });
            if (allMeshes[model.modelID]?.[result.expressID]) {
              const meshToHide = allMeshes[model.modelID][result.expressID];
              meshToHide.visible = false;
            }
          }
        }
        const modelMeshesMap = allMeshes[model.modelID];
        if (query && modelMeshesMap) {
          for (const expressIDStr in modelMeshesMap) {
            const expressID = parseInt(expressIDStr, 10);
            if (!processedExpressIDsFromSpatialTree.has(expressID)) {
              toHide.push({ modelID: model.modelID, expressID: expressID });
              const meshToHide = modelMeshesMap[expressID];
              if (meshToHide) {
                meshToHide.visible = false;
              }
              noMatchCount++;
            }
          }
        }
        console.log(`Filter results for model ${model.id}: ${matchCount} matches, ${noMatchCount} non-matches (to hide, incl. non-spatial), ${errorCount} errors`);
      }
      console.log(`Filter identified ${toHide.length} elements to hide overall.`);
      if (!cancelled && toHide.length > 0) {
        console.log("Calling hideElements with", toHide.length, "elements");
        hideElements(toHide);
        searchHiddenRef.current = toHide;
        scene.current?.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.matrixWorldNeedsUpdate = true;
          }
        });
      }
      setSearchProgress({
        active: false,
        percent: 100,
        status: `Search complete: ${toHide.length} elements hidden`
      });
      setIsSearchRunning(false);
      setTimeout(() => {
        setSearchProgress(prev => {
          if (prev.percent === 100) {
            return { active: false, percent: 0, status: '' };
          }
          return prev;
        });
      }, 5000);
    };

    applyFilter();
    return () => {
      cancelled = true;
    };
  }, [confirmedSearch, loadedModels, ifcApi, hideElements, showElements, gatherAllElements, scene, isSearchRunning, getElementPropertiesCached]);

  useEffect(() => {
    const checkPanelState = () => {
      if (leftPanelRef.current) {
        setLeftPanelCollapsed(leftPanelRef.current.getSize() === 0);
      }
      if (rightPanelRef.current) {
        setRightPanelCollapsed(rightPanelRef.current.getSize() === 0);
      }
    };
    checkPanelState();
    const observer = new MutationObserver(checkPanelState);
    const leftPanelElement = leftPanelRef.current
      ? document.getElementById(leftPanelRef.current.getId())
      : null;
    const rightPanelElement = rightPanelRef.current
      ? document.getElementById(rightPanelRef.current.getId())
      : null;
    if (leftPanelElement) {
      observer.observe(leftPanelElement, { attributes: true });
    }
    if (rightPanelElement) {
      observer.observe(rightPanelElement, { attributes: true });
    }
    return () => {
      observer.disconnect();
    };
  }, [ifcEngineReady]);

  useEffect(() => {
    if (SKIP_IFC_INITIALIZATION_FOR_TEST) {
      return;
    }
    if (ifcApi) {
      setIfcEngineReady(true);
      return;
    }
    let didCancel = false;
    const initializeWebIFC = async () => {
      try {
        const ifcAPIInstance = new IfcAPI();
        ifcAPIInstance.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.68/", true);
        await ifcAPIInstance.Init();
        if (!didCancel) {
          if (!ifcAPIInstance.properties) {
            ifcAPIInstance.properties = new Properties(ifcAPIInstance);
          }
          if (setIfcApi) setIfcApi(ifcAPIInstance);
          setIfcEngineReady(true);
        }
      } catch (error) {
        if (!didCancel) {
          console.error("ViewerContent: Error initializing WebIFC:", error);
          setIfcEngineReady(false);
        }
      }
    };
    initializeWebIFC();
    return () => {
      didCancel = true;
    };
  }, [ifcApi, setIfcApi]);

  useEffect(() => {
    if (!ifcEngineReady || hasAutoLoadedModels || loadedModels.length > 0)
      return;
    try {
      const stored = localStorage.getItem("appSettings");
      if (!stored) return;
      const { modelUrls, alwaysLoad } = JSON.parse(stored);
      if (!alwaysLoad || !Array.isArray(modelUrls)) return;
      modelUrls.forEach((m: any) => addIFCModel(m.url, m.name));
      setHasAutoLoadedModels(true);
    } catch (err) {
      console.error("Failed to autoload models", err);
    }
  }, [ifcEngineReady, hasAutoLoadedModels, loadedModels, addIFCModel]);

  useEffect(() => {
    if (selectedElement) {
      console.log("ViewerContent: Selected element changed: ", selectedElement);
    } else {
      console.log("ViewerContent: No element selected / selection cleared.");
    }
  }, [selectedElement]);

  const customUnhideAllElements = useCallback(() => {
    unhideAllElements();
    setCanvasSearch("");
    setConfirmedSearch("");
  }, [unhideAllElements]);

  const customUnhideLastElement = useCallback(() => {
    unhideLastElement();
    setCanvasSearch("");
    setConfirmedSearch("");
  }, [unhideLastElement]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isTyping) return;
      switch (event.code) {
        case "Space":
          if (selectedElements.length) {
            event.preventDefault();
            const elementsToHide = [...selectedElements];
            clearSelection();
            elementsToHide.forEach((el) => toggleUserHideElement(el));
          }
          break;
        case "KeyZ":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (userHiddenElements.length > 0) {
              customUnhideLastElement();
            }
          }
          break;
        case "KeyE":
          event.preventDefault();
          handleZoomExtents();
          break;
        case "KeyF":
          if (selectedElements.length) {
            event.preventDefault();
            handleZoomSelected();
          }
          break;
        case "KeyA":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleSelectAllVisible();
          } else if (event.shiftKey) {
            event.preventDefault();
            if (userHiddenElements.length > 0) {
              customUnhideAllElements();
            }
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedElements,
    toggleUserHideElement,
    unhideLastElement,
    unhideAllElements,
    userHiddenElements,
    handleZoomExtents,
    handleZoomSelected,
    handleSelectAllVisible,
    customUnhideAllElements,
    customUnhideLastElement,
    clearSelection,
  ]);

  useEffect(() => {
    if (!scene.current) return;
    console.log("Direct visibility effect: Processing userHiddenElements", userHiddenElements.length);
    const hiddenElements = new Map<number, Set<number>>();
    userHiddenElements.forEach(element => {
      if (!hiddenElements.has(element.modelID)) {
        hiddenElements.set(element.modelID, new Set());
      }
      hiddenElements.get(element.modelID)?.add(element.expressID);
    });
    let appliedHideCount = 0;
    scene.current.traverse(object => {
      if (
        object instanceof THREE.Mesh &&
        object.userData &&
        object.userData.expressID !== undefined &&
        object.userData.modelID !== undefined
      ) {
        const modelID = object.userData.modelID;
        const expressID = object.userData.expressID;
        if (hiddenElements.has(modelID) && hiddenElements.get(modelID)?.has(expressID)) {
          if (object.visible) {
            object.visible = false;
            appliedHideCount++;
          }
        }
      }
    });
    console.log(`Direct visibility effect: Applied visibility=false to ${appliedHideCount} meshes`);
  }, [userHiddenElements, scene]);

  if (!ifcEngineReady && !SKIP_IFC_INITIALIZATION_FOR_TEST) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('loadingWebIFCEngine')}</h2>
          <p className="text-muted-foreground">{t('pleaseWaitMoment')}</p>
        </div>
      </div>
    );
  }

  if (webGLContextLost) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center p-8 bg-destructive/20 border border-destructive rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-destructive-foreground">
            {t('webglContextLost')}
          </h2>
          <p className="text-destructive-foreground/80 mb-4">
            {t('webglContextLostMessage')}
          </p>
          <p className="text-destructive-foreground/80">
            {t('refreshPage')}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-full w-full relative overflow-hidden" style={{ isolation: 'isolate' }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {ifcEngineReady && !webGLContextLost && (
          <Canvas
            onCreated={({ gl }) => {
              console.log("R3F Canvas with IFCModel: onCreated called.");
              const context = gl.getContext();
              if (!context) {
                console.error("R3F Canvas with IFCModel: Failed to get WebGL context.");
                setWebGLContextLost(true);
                return;
              }
              console.log("R3F Canvas with IFCModel: Context attributes:", context.getContextAttributes());
              console.log("R3F Canvas with IFCModel: Is context lost initially?", context.isContextLost());
              if (context.isContextLost()) {
                console.error("R3F Canvas with IFCModel: Context is lost immediately in onCreated.");
                setWebGLContextLost(true);
              }
              if (gl.domElement) {
                gl.domElement.addEventListener(
                  "webglcontextlost",
                  (event) => {
                    event.preventDefault();
                    console.error("R3F Canvas with IFCModel: WebGL context lost! (event listener)");
                    setWebGLContextLost(true);
                  },
                  false
                );
                gl.domElement.addEventListener(
                  "webglcontextcreationerror",
                  (event) => {
                    const webglEvent = event as WebGLContextEvent;
                    console.error(
                      "R3F Canvas with IFCModel: WebGL context CREATION ERROR!",
                      "Status:",
                      webglEvent.statusMessage || "No status message."
                    );
                    setWebGLContextLost(true);
                  },
                  false
                );
              } else {
                console.error("R3F Canvas with IFCModel: gl.domElement not available.");
                setWebGLContextLost(true);
              }
            }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            <OrbitControls makeDefault enableDamping={false} />
            <GlobalInteractionHandler />
            <SceneCapture onSceneCapture={captureScene} />
            {loadedModels.map((modelEntry) => (
              <IFCModel
                key={modelEntry.id}
                modelData={modelEntry}
                outlineLayer={OUTLINE_SELECTION_LAYER}
              />
            ))}
            <CameraActionsController ref={cameraActionsRef} />
          </Canvas>
        )}
      </div>
      <PanelGroup
        direction="horizontal"
        autoSaveId="ifc-viewer-layout"
        style={{
          zIndex: 1,
          position: "relative",
          pointerEvents: "none",
          height: "calc(100% - 4rem)",
          marginTop: "4rem",
        }}
      >
        <Panel
          id="left-sidebar"
          ref={leftPanelRef}
          defaultSize={25}
          minSize={15}
          maxSize={40}
          collapsible
          className="bg-transparent pointer-events-auto"
        >
          <div className="h-full flex flex-col shadow-lg bg-gradient-to-r from-[hsl(var(--card))]">
            <div className="p-2 border-b border-color-standard flex justify-between items-center shrink-0">
              <h3 className="text-sm font-semibold px-2">{t('modelExplorer')}</h3>
              <FileUpload key={`file-upload-sidebar-${settingsVersion}`} isAdding={true} />
            </div>
            <PanelGroup direction="vertical" className="flex-grow">
              <Panel id="spatial-tree" defaultSize={70} minSize={30}>
                <div className="h-full overflow-y-auto">
                  <SpatialTreePanel />
                </div>
              </Panel>
              <ResizeHandleVertical />
              <Panel id="properties-panel" defaultSize={30} minSize={20}>
                <div className="h-full flex flex-col">
                  <div className="p-1 border-b border-color-standard">
                    <h3 className="text-sm font-semibold px-2">{t('properties')}</h3>
                  </div>
                  <div className="p-2 overflow-y-auto flex-grow">
                    <ModelInfo />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        <ResizeHandleHorizontal
          onToggle={handleToggleLeftPanel}
          collapsed={leftPanelCollapsed}
          isLeftSide={true}
          className="pointer-events-auto"
        />
        <Panel
          id="main-content"
          defaultSize={50}
          className="bg-transparent pointer-events-none relative"
        >
          <LoadingOverlay2 open={isLoading}  message={loadingMessage} progress={loadingProgress} />
          <div className="relative h-full bg-transparent pointer-events-none">
            {ifcEngineReady && !webGLContextLost && (
              <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                <div className="flex items-center gap-2 p-1 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg border-color-standard">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          value={canvasSearch}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          onChange={(e) => {
                            const newSearch = e.target.value;
                            setCanvasSearch(newSearch);
                            if (newSearch.trim() === "") {
                              setConfirmedSearch("");
                              if (searchHiddenRef.current.length > 0) {
                                showElements(searchHiddenRef.current);
                                searchHiddenRef.current = [];
                              }
                              setSearchProgress({ active: false, percent: 0, status: '' });
                              setIsSearchRunning(false);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSearchSubmit(canvasSearch);
                            }
                          }}
                          placeholder={isSearchFocused ? t('modelViewer.searchCanvasPlaceholder') : "Search..."}
                          className={`h-8 text-xs transition-all duration-300 ease-in-out rounded-md ${
                            isSearchFocused ? 'w-48 px-3' : 'w-24 px-2 text-[11px]'
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="end"
                        className="max-w-xs p-3 bg-popover text-popover-foreground shadow-md rounded-md z-50 flex flex-col gap-1"
                      >
                        <p className="font-medium">Filter elements by properties</p>
                        <p className="text-xs text-muted-foreground">
                          Supports wildcard <code className="p-0.5 bg-muted rounded-sm">*</code> and regular expressions (regex).
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Learn more about <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">regex</a> or test on <a href="https://regex101.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">regex101.com</a>.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isSearchRunning ? (
                    <Button
                      variant="ghost"
                      onClick={handleCancelSearch}
                      title="Cancel search"
                      className="transition-all duration-300 ease-in-out flex items-center justify-center rounded-md h-8 w-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => handleSearchSubmit(canvasSearch)}
                      title={t('modelViewer.search')}
                      className={`transition-all duration-300 ease-in-out flex items-center justify-center rounded-md ${
                        isSearchFocused ? 'h-8 w-8' : 'h-7 w-7 p-0.5'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-all duration-300 ease-in-out ${
                          isSearchFocused ? 'scale-100' : 'scale-[0.80]'
                        }`}
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </Button>
                  )}
                </div>
                {searchProgress.active && (
                  <div className="mt-2 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg text-xs w-full">
                    <div className="mb-1 flex justify-between font-medium">
                      <span>{searchProgress.status}</span>
                      <span>{searchProgress.percent}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300 ease-in-out"
                        style={{ width: `${searchProgress.percent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {!searchProgress.active && searchProgress.status && (
                  <div className="mt-2 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg text-xs w-full">
                    <div className="text-center font-medium">{searchProgress.status}</div>
                  </div>
                )}
              </div>
            )}
            {loadedModels.length === 0 && ifcEngineReady && !SKIP_IFC_INITIALIZATION_FOR_TEST && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 pointer-events-auto">
                <FileUpload key={`file-upload-main-${settingsVersion}`} isAdding={false} />
              </div>
            )}
            {ifcEngineReady && !webGLContextLost && (
              <ViewToolbar
                onZoomExtents={handleZoomExtents}
                onZoomSelected={handleZoomSelected}
                isElementSelected={selectedElements.length > 0}
                onUnhideAll={customUnhideAllElements}
                onUnhideLast={customUnhideLastElement}
                onSelectAllVisible={handleSelectAllVisible}
              />
            )}
            <SelectionListOverlay />
          </div>
        </Panel>
        <ResizeHandleHorizontal
          onToggle={handleToggleRightPanel}
          collapsed={rightPanelCollapsed}
          isLeftSide={false}
          className="pointer-events-auto"
        />
        <Panel
          id="right-sidebar"
          ref={rightPanelRef}
          defaultSize={25}
          minSize={15}
          maxSize={40}
          collapsible
          className="bg-transparent pointer-events-auto"
        >
          <ResponsiveTabs onSettingsChanged={handleSettingsChanged} />
        </Panel>
      </PanelGroup>
    </div>
  );

  function SceneCapture({ onSceneCapture }: { onSceneCapture: (scene: THREE.Scene) => void }) {
    const { scene } = useThree();
    useEffect(() => {
      console.log("SceneCapture: Capturing scene");
      onSceneCapture(scene);
    }, [scene, onSceneCapture]);
    return null;
  }
}