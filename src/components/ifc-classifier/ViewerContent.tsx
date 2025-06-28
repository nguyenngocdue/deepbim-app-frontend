
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, GizmoHelper, GizmoViewport, Html, OrbitControls } from "@react-three/drei";
import { Panel, PanelGroup, ImperativePanelHandle } from "react-resizable-panels";
import { useTranslation } from "react-i18next";
import { IfcAPI, IFCWALL, Properties } from "web-ifc";
import * as THREE from "three";
import {
  useIFCContext,
  LoadedModelData,
  SelectedElementInfo,
  SpatialStructureNode,
} from "@/context/ifc/ifc-context";
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
import { buildSpatialTree, gatherAllElements2 } from "@/utils/web-ifc/BuildSpatialTree";
import { getLineProperties } from "@/utils/web-ifc/ParsingDataIfc";
import ElementInfoPopup from "./ElementInfoPopup";
import { addGrid, setOtherLighting } from "./FitCameraToObject";
import { setCameraType } from "@/utils/web-ifc/CameraType";
import { LoadingOverlay } from "../common/LoadingOverlay";

const SKIP_IFC_INITIALIZATION_FOR_TEST = false;

export default function ViewerContent() {
  // Lấy các giá trị và hàm từ IFC context
  const {
    isLoading, // Trạng thái đang tải
    loadingProgress, // Tiến trình tải
    loadingMessage, // Thông báo khi tải
    loadedModels, // Danh sách các mô hình đã tải
    setIfcApi, // Hàm để thiết lập IFC API
    ifcApi, // Instance của IFC API
    selectedElement, // Phần tử đang được chọn
    selectedElements, // Danh sách các phần tử được chọn
    selectElement, // Hàm để chọn một phần tử
    selectElements, // Hàm để chọn nhiều phần tử
    toggleUserHideElement, // Hàm để ẩn/hiện phần tử
    unhideLastElement, // Hàm để hiện lại phần tử ẩn cuối cùng
    unhideAllElements, // Hàm để hiện tất cả phần tử ẩn
    hideElements, // Hàm để ẩn các phần tử
    showElements, // Hàm để hiện các phần tử
    userHiddenElements, // Danh sách các phần tử bị người dùng ẩn
    getElementPropertiesCached, // Hàm để lấy thuộc tính của phần tử từ bộ nhớ cache
    addIFCModel, // Hàm để thêm mô hình IFC
    clearSelection, // Hàm để xóa lựa chọn
  } = useIFCContext();


    const { t } = useTranslation(); // Hook để dịch ngôn ngữ
    const [ifcEngineReady, setIfcEngineReady] = useState(false); // Trạng thái sẵn sàng của IFC engine
    const [webGLContextLost, setWebGLContextLost] = useState(false); // Trạng thái mất context WebGL
    const [canvasSearch, setCanvasSearch] = useState(""); // Giá trị tìm kiếm trên canvas
    const [confirmedSearch, setConfirmedSearch] = useState(""); // Giá trị tìm kiếm đã xác nhận
    const [isSearchFocused, setIsSearchFocused] = useState(false); // Trạng thái focus của ô tìm kiếm
    const [searchProgress, setSearchProgress] = useState({ active: false, percent: 0, status: '' }); // Tiến trình tìm kiếm
    const [isSearchRunning, setIsSearchRunning] = useState(false); // Trạng thái đang chạy tìm kiếm
    const searchHiddenRef = useRef<SelectedElementInfo[]>([]); // Ref để lưu các phần tử bị ẩn do tìm kiếm
    const scene = useRef<THREE.Scene | null>(null); // Ref để lưu scene Three.js
  
    const leftPanelRef = useRef<ImperativePanelHandle>(null); // Ref cho panel bên trái
    const rightPanelRef = useRef<ImperativePanelHandle>(null); // Ref cho panel bên phải
    const cameraActionsRef = useRef<CameraActions>(null); // Ref cho camera actions
    const [settingsVersion, setSettingsVersion] = useState(0); // Phiên bản cài đặt để forced re-render
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false); // Trạng thái thu gọn của panel trái
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false); // Trạng thái thu gọn của panel phải
    const [hasAutoLoadedModels, setHasAutoLoadedModels] = useState(false); // Trạng thái đã tự động tải mô hình
  
    const OUTLINE_SELECTION_LAYER = 10; // Layer để hiển thị outline của phần tử được chọn

    const [positionCube, setPositionCube] = useState({x : 500, y : 80})


  // Hàm thu thập tất cả các node từ cây không gian
  const gatherAllElements = useCallback((root: SpatialStructureNode | null) => {
    const items: SpatialStructureNode[] = [];
    if (!root) return items;
    const stack = [root];
    while (stack.length) {
      const node = stack.pop()!;
      items.push(node);
      if (node.children) stack.push(...node.children);
    }
    //items are ifcBuildingStorey
    return items;
  }, []);

  
   // Hàm lưu scene vào ref
  const captureScene = useCallback((threeScene: THREE.Scene) => {
    scene.current = threeScene;
  }, []);

  // Hàm tăng phiên bản cài đặt để trigger re-render
  const handleSettingsChanged = useCallback(() => {
    setSettingsVersion(v => v + 1);
  }, []);

   // Hàm zoom đến toàn bộ mô hình
  const handleZoomExtents = useCallback(() => {
    cameraActionsRef.current?.zoomToExtents();
  }, []);

  // add grid to viewer
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const handleToggleGrid = useCallback(() => {
    if (!scene) return;
    if (gridRef.current) {
      if (scene.current) {
        scene.current.remove(gridRef.current);
      }
      gridRef.current = null;
    } else {
      if (scene.current) {
        const grid = addGrid(scene.current);
        gridRef.current = grid;
      }
    }
  }, [scene]);

  //handle camera type
  const [cameraType, setCameraTypeState] = useState<"perspective" | "orthographic">("perspective");
  const handleSelectedCamera = useCallback(() => {
    if (!cameraActionsRef.current) return;
    const next = cameraType === "perspective" ? "orthographic" : "perspective";
    setCameraType(next, cameraActionsRef.current);
    setCameraTypeState(next);
  }, [cameraType]);


  // Hàm zoom đến phần tử được chọn
  const handleZoomSelected = useCallback(() => {
    cameraActionsRef.current?.zoomToSelected(selectedElement);
  }, [selectedElement]);

  // Hàm chọn tất cả các phần tử đang hiển thị
  const handleSelectAllVisible = useCallback(() => {
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

  // Hàm toggle panel trái
  const toggleLeftPanel = () => {
    if (leftPanelRef.current) {
      if (leftPanelRef.current.getSize() > 0) {
        leftPanelRef.current.collapse();
      } else {
        leftPanelRef.current.expand();
      }
    }
  };
 // Hàm toggle panel phải
  const toggleRightPanel = () => {
    if (rightPanelRef.current) {
      if (rightPanelRef.current.getSize() > 0) {
        rightPanelRef.current.collapse();
      } else {
        rightPanelRef.current.expand();
      }
    }
  };

  // Hàm xử lý toggle panel trái
  const handleToggleLeftPanel = () => {
    toggleLeftPanel();
    setLeftPanelCollapsed(!leftPanelCollapsed);
  };

 // Hàm xử lý toggle panel phải
  const handleToggleRightPanel = () => {
    toggleRightPanel();
    setRightPanelCollapsed(!rightPanelCollapsed);
  };

  // Hàm xử lý tìm kiếm khi submit
  const handleSearchSubmit = useCallback((searchTerm: string) => {
    setConfirmedSearch(searchTerm);
    if (searchTerm.trim()) {
      setIsSearchRunning(true);
    }
  }, []);

  // Cancel search
  const handleCancelSearch = useCallback(() => {
    setIsSearchRunning(false);
    setSearchProgress({ active: false, percent: 0, status: 'Search cancelled' });
    // Clear the progress indicator after a short delay
    setTimeout(() => {
      setSearchProgress({ active: false, percent: 0, status: '' });
    }, 1500);
  }, []);

  // DEBUG: Log userHiddenElements when it changes
  useEffect(() => {
    // console.log("userHiddenElements changed:", userHiddenElements.length, userHiddenElements.slice(0, 5));
  }, [userHiddenElements]);

  // Apply search filtering on 3D elements - now depends on isSearchRunning instead of confirmedSearch
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

    // Helper function to recursively search for regex matches in an object/array
    const recursiveSearch = (data: any, regexInstance: RegExp, searchKeys: boolean = false): boolean => {
      if (data === null || data === undefined) return false;

      // Test stringified value for primitive types
      if (typeof data === 'string') return regexInstance.test(data.toLowerCase());
      if (typeof data === 'number' || typeof data === 'boolean') return regexInstance.test(String(data).toLowerCase());

      if (Array.isArray(data)) {
        for (const item of data) {
          if (recursiveSearch(item, regexInstance, searchKeys)) return true;
        }
        return false;
      }

      if (typeof data === 'object') {
        // Handle IFC.js specific structures like { value: X } or { NominalValue: { value: Y } } etc.
        // ✅ Check if the object has a 'value' property
          // Common in IFC structure for fields like: { value: "Wall" }
          if (data.hasOwnProperty('value')) {
            // Recursively search inside the 'value'
            if (recursiveSearch(data.value, regexInstance, false)) return true;
          }

          // ✅ Check for 'NominalValue'
          // Typically used for quantitative properties in IFC like Height, Width, Area, etc.
          // Example: { NominalValue: { value: 3000 } }
          if (data.hasOwnProperty('NominalValue')) {
            // Recursively search inside 'NominalValue'
            if (recursiveSearch(data.NominalValue, regexInstance, false)) return true;
          }

          // ✅ Check for 'wrappedValue'
          // Some IFC libraries (or custom wrappers) use 'wrappedValue' to wrap raw data
          // Example: { wrappedValue: "IfcWall" }
          if (data.hasOwnProperty('wrappedValue')) {
            // Recursively search inside 'wrappedValue'
            if (recursiveSearch(data.wrappedValue, regexInstance, false)) return true;
          }

          
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              // kiểm tra xem tên của một thuộc tính (key) có khớp với biểu thức chính quy (regex) hay không.
              if (searchKeys && regexInstance.test(key.toLowerCase())) {
                return true
              };
              if (recursiveSearch(data[key], regexInstance, searchKeys)) {
              return true
            };
          }
        }
        return false;
      }
      return false;
    };

    const applyFilter = async () => {
      // unhide previous search-hidden elements

      if (searchHiddenRef.current.length > 0) {
        console.log("Showing previously hidden elements:", searchHiddenRef.current.length);
        showElements(searchHiddenRef.current);
        searchHiddenRef.current = [];
      }

      const query = confirmedSearch.trim();
      console.log("Applying filter with query:", query); // Log query
      if (!query) {
        // If query is cleared, ensure all meshes that might have been directly hidden by previous search iteration are visible
        // (unless they are in userHiddenElements for other reasons)
        // The showElements(searchHiddenRef.current) above handles elements previously hidden *by search*.
        // No further action needed here if query is empty, as userHiddenElements is the source of truth.
        setSearchProgress({ active: false, percent: 0, status: '' });
        setIsSearchRunning(false);
        return;
      }

      // Set search in progress
      setSearchProgress({ active: true, percent: 0, status: 'Preparing search...' });

      const regex = toRegex(query);
      console.log("Search regex:", regex.source);
      const toHide: SelectedElementInfo[] = [];

      // Log loaded models info
      console.log("Loaded models:", loadedModels.length, loadedModels.map(m => ({
        id: m.id,
        name: m.name,
        modelID: m.modelID,
        hasSpatialTree: !!m.spatialTree
      })));

      // Collect all meshes to check if spatial tree nodes have corresponding meshes
      const availableMeshIds: Record<number, Set<number>> = {};
      const allMeshes: Record<number, Record<number, THREE.Mesh>> = {};

      // Scan scene for meshes
      scene.current?.traverse((object) => {
        if (object instanceof THREE.Mesh &&
          object.userData &&
          object.userData.expressID !== undefined &&
          object.userData.modelID !== undefined) {
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


      // console.log(allMeshes);

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

        // Log spatial tree root information
        console.log(`Spatial tree root for model ${model.id}:`, {
          rootExpressID: model.spatialTree.expressID,
          rootType: model.spatialTree.type,
          rootName: model.spatialTree.Name,
          childrenCount: model.spatialTree.children?.length || 0
        });

        // const nodes = gatherAllElements(model.spatialTree);
        const tree = await buildSpatialTree(model.modelID, ifcApi);
        const nodes = gatherAllElements2(tree);
        // console.log("allNodes", allNodes);
        console.log(`Model ${model.id} (${model.name}): Processing ${nodes.length} nodes for filtering.`);

        // Check how many nodes in spatial tree have actual meshes
        const modelMeshes = availableMeshIds[model.modelID] || new Set();
        const nodesWithMeshes = nodes.filter(node =>
          node.expressID !== undefined && modelMeshes.has(node.expressID)
        );

        console.log(`Model ${model.id}: ${nodes.length} tree nodes, ${nodesWithMeshes.length} have corresponding meshes`);

        // Sample logging some actual node data
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

        // Helper function to process a node with property fetching
        const processNode = async (node: any): Promise<{ match: boolean; expressID: number }> => {
          // Skip nodes without a valid expressID or if the model is invalid
          if (typeof node.expressID !== 'number' || isNaN(node.expressID) || model.modelID === null || model.modelID === undefined) {
            return { match: false, expressID: -1 };
          }

          const expressID = node.expressID;
          processedExpressIDsFromSpatialTree.add(expressID);

          let match = false;
          // 1. Quick check on node's direct, readily available properties
          if (node.Name && node.Name.value && typeof node.Name.value === 'string' && regex.test(node.Name.value.toLowerCase())) {
            match = true;
          } else if (node.type && regex.test(node.type.toLowerCase())) { // node.type is string
            match = true;
          } else if (node.GlobalId && node.GlobalId.value && typeof node.GlobalId.value === 'string' && regex.test(node.GlobalId.value.toLowerCase())) {
            match = true;
          }

          // 2. If no quick match, fetch all properties and do a recursive search
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


        // Split nodes into batches for concurrent processing
        const batchSize = 20; // Number of concurrent operations
        const nodesToProcess = nodes.filter(node => node.expressID !== undefined);
        const results: { match: boolean; expressID: number }[] = [];

        // Maximum number of matches to find before stopping search
        const MAX_MATCHES = 1000;
        let hasReachedMaxMatches = false;

        // Process nodes in batches
        for (let i = 0; i < nodesToProcess.length; i += batchSize) {
          if (cancelled || hasReachedMaxMatches) break;

          const currentBatch = nodesToProcess.slice(i, i + batchSize);
          const batchPromises = currentBatch.map(node => processNode(node));
          
          // Wait for the current batch to complete
          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);

          // Check if we've found enough matches
          const matchCount = results.filter(r => r.match).length;
          if (matchCount >= MAX_MATCHES) {
            console.log(`Found ${matchCount} matches, stopping search early`);
            setSearchProgress({ active: true, percent: 100, status: `Found ${matchCount} matches (stopped early)` });
            hasReachedMaxMatches = true;
          }

          // Provide visual feedback during processing for large models
          // Update progress more frequently
          if (i % 20 === 0 || i + batchSize >= nodesToProcess.length) {
            const percentComplete = Math.round((i / nodesToProcess.length) * 100);
            console.log(`Processed ${i}/${nodesToProcess.length} nodes (${percentComplete}%)...`);

            // Update progress state for UI
            setSearchProgress({
              active: true,
              percent: percentComplete,
              status: `Searching... ${i}/${nodesToProcess.length} elements (${matchCount} matches found)`
            });

            // Update UI to show progress (non-blocking)
            if (i % 100 === 0) {
              // Process partial results to show immediate visual feedback
              const partialResults = results.filter(r => !r.match && r.expressID !== -1)
                .map(r => ({ modelID: model.modelID as number, expressID: r.expressID }));

                // partialResults are hiddened in model
                if (partialResults.length > 0) {
                  // Apply visibility changes for partial results
                  for (const result of partialResults) {
                    if (allMeshes[result.modelID]?.[result.expressID]) {
                    const meshToHide = allMeshes[result.modelID][result.expressID];
                    meshToHide.visible = false;
                  }
                }
              }

              // Use setTimeout to avoid blocking UI
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
        }

        // Process the results
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

        // Handle meshes that are in the scene but not found in the spatial tree
        const modelMeshesMap = allMeshes[model.modelID];
        if (query && modelMeshesMap) { // query is confirmedSearch.trim()
          for (const expressIDStr in modelMeshesMap) {
            const expressID = parseInt(expressIDStr, 10);
            if (!processedExpressIDsFromSpatialTree.has(expressID)) {
              // This mesh element was not found in the spatial tree.
              // If a search is active, it should be hidden because it can't be "matched" via properties.
              toHide.push({ modelID: model.modelID, expressID: expressID });
              const meshToHide = modelMeshesMap[expressID];
              if (meshToHide) {
                meshToHide.visible = false; // Direct hide for immediate feedback
              }
              noMatchCount++; // Consider it a non-match for accounting
            }
          }
        }
        console.log("meshToHide", toHide)
        console.log(`Filter results for model ${model.id}: ${matchCount} matches, ${noMatchCount} non-matches (to hide, incl. non-spatial), ${errorCount} errors`);
      }

      console.log(`Filter identified ${toHide.length} elements to hide overall.`);

      if (!cancelled && toHide.length > 0) {
        console.log("Calling hideElements with", toHide.length, "elements");
        hideElements(toHide);
        searchHiddenRef.current = toHide;

        // Force render update of THREE scene
        scene.current?.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.matrixWorldNeedsUpdate = true;
          }
        });
      }

      // Set search completed
      setSearchProgress({
        active: false,
        percent: 100,
        status: `Search complete: ${toHide.length} elements hidden`
      });
      setIsSearchRunning(false);

      // Clear status after a delay
      setTimeout(() => {
        setSearchProgress(prev => {
          if (prev.percent === 100) { // Only clear if it's still showing the completed state
            return { active: false, percent: 0, status: '' };
          }
          return prev;
        });
      }, 5000); // Longer delay to ensure user sees result
    };

    applyFilter();

    return () => {
      cancelled = true;
    };
  }, [confirmedSearch, loadedModels, ifcApi, hideElements, showElements, gatherAllElements, scene, isSearchRunning, getElementPropertiesCached]);
  // Effect để kiểm tra trạng thái thu gọn của các panel
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

  // Effect để khởi tạo IFC engine
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


  // Effect để tự động tải các mô hình từ localStorage
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

  // show selected item when click on elements 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (hasFired) return;

      setHasFired(true);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [hasFired]);

  const [elementInfo, setElementInfo] = useState<any | null>(null);
    // Effect để log khi phần tử được chọn thay đổi
  useEffect(() => {
    if (selectedElement && ifcApi) {
      const line = getLineProperties(selectedElement,ifcApi);
      const objectTypeValue = line.ObjectType?.value;
      const objectTypeName = line.ObjectType?.name; 
      const info =  {
        globalId: line.GlobalId?.value,
        name: line.Name?.value,
        type_name: objectTypeName,
        type_value: objectTypeValue,
      }
      setElementInfo(info);
    } else {
      setElementInfo(null); 
    }
  }, [selectedElement, ifcApi]);


    // Hàm hiện lại tất cả phần tử ẩn và reset tìm kiếm
  const customUnhideAllElements = useCallback(() => {
    unhideAllElements();
    setCanvasSearch("");
    setConfirmedSearch("");
  }, [unhideAllElements]);

    // Hàm hiện lại phần tử ẩn cuối cùng và reset tìm kiếm
  const customUnhideLastElement = useCallback(() => {
    unhideLastElement();
    setCanvasSearch("");
    setConfirmedSearch("");
  }, [unhideLastElement]);

    // Effect xử lý các phím tắt
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
        case "KeyG":
          event.preventDefault();
          handleToggleGrid();
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
  // Effect để áp dụng trạng thái ẩn cho các phần tử
   // Add a direct effect to apply userHiddenElements visibility
  useEffect(() => {
    if (!scene.current) return;

    console.log("Direct visibility effect: Processing userHiddenElements", userHiddenElements.length);

    // Track which elements should be hidden
    const hiddenElements = new Map<number, Set<number>>();

    // Build lookup map of elements to hide
    userHiddenElements.forEach(element => {
      if (!hiddenElements.has(element.modelID)) {
        hiddenElements.set(element.modelID, new Set());
      }
      hiddenElements.get(element.modelID)?.add(element.expressID);
    });

    // Traverse the scene and update visibility
    let appliedHideCount = 0;
    scene.current.traverse(object => {
      if (object instanceof THREE.Mesh &&
        object.userData &&
        object.userData.expressID !== undefined &&
        object.userData.modelID !== undefined) {

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
  // Hiển thị màn hình chờ khi IFC engine chưa sẵn sàng
  
  if (!ifcEngineReady) {
    return (
      <LoadingOverlay open={!ifcEngineReady} message={`${t('loadingWebIFCEngine')} \n ${t('pleaseWaitMoment')}`}/>
    );
  }



  // Hiển thị thông báo lỗi khi mất context WebGL
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


  // Giao diện chính của Viewer
  return (

    <>
      {/* <ElementInfoPopup elementInfo={elementInfo} position={mousePosition} /> */}
      <div className="flex h-full w-full relative overflow-hidden" style={{ isolation: 'isolate' }}>
        {/* Container cho canvas 3D */}
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
          {loadedModels.length  && ifcEngineReady && !webGLContextLost && (
            <Canvas
              onCreated={({ gl }) => {
                // console.log("R3F Canvas with IFCModel: onCreated called.");
                const context = gl.getContext();
                if (!context) {
                  console.error("R3F Canvas with IFCModel: Failed to get WebGL context.");
                  setWebGLContextLost(true);
                  return;
                }
                // console.log("R3F Canvas with IFCModel: Context attributes:", context.getContextAttributes());
                // console.log("R3F Canvas with IFCModel: Is context lost initially?", context.isContextLost());
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
              <ambientLight intensity={0.5} /> {/* Ánh sáng môi trường */}
              <directionalLight position={[10, 10, 5]} intensity={1} /> {/* Ánh sáng định hướng */}
              <Environment preset="city" /> {/* Môi trường ánh sáng preset */}
              <OrbitControls makeDefault enableDamping={false} /> {/* Điều khiển quay camera */}
              <GlobalInteractionHandler /> {/* Xử lý tương tác toàn cục */}
              <SceneCapture onSceneCapture={captureScene} /> {/* Component lưu scene */}
              {loadedModels.map((modelEntry) => (
                <IFCModel
                  key={modelEntry.id}
                  modelData={modelEntry}
                  outlineLayer={OUTLINE_SELECTION_LAYER}
                /> /* Hiển thị các mô hình IFC */
              ))}
             <CameraActionsController ref={cameraActionsRef} />  {/* Điều khiển camera */}
              <GizmoHelper
                alignment="bottom-right" 
                margin={[positionCube.x, positionCube.y]} 
              >
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
              </GizmoHelper>
            </Canvas>
          )}
        </div>
        {/* PanelGroup để quản lý layout */}
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
          {/* Panel trái */}
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
                    <SpatialTreePanel /> {/* Hiển thị cây không gian */}
                  </div>
                </Panel>
                <ResizeHandleVertical /> {/* Thanh kéo dọc */}
                <Panel id="properties-panel" defaultSize={30} minSize={20}>
                  <div className="h-full flex flex-col">
                    <div className="p-1 border-b border-color-standard">
                      <h3 className="text-sm font-semibold px-2">{t('properties')}</h3>
                    </div>
                    <div className="p-2 overflow-y-auto flex-grow">
                      <ModelInfo /> {/* Hiển thị thông tin mô hình */}
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
          /> {/* Thanh kéo ngang cho panel trái */}
        {/* Panel chính */}
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
                                  showElements(searchHiddenRef.current); // 👈 hiện lại các phần tử đã ẩn khi xoá search
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
                  {/* Hiển thị tiến trình tìm kiếm */}
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
                  {/* Hiển thị trạng thái tìm kiếm hoàn tất */}
                  {!searchProgress.active && searchProgress.status && (
                    <div className="mt-2 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg text-xs w-full">
                      <div className="text-center font-medium">{searchProgress.status}</div>
                    </div>
                  )}
                </div>
              )}
              {/* Hiển thị giao diện upload nếu chưa có mô hình */}
              {loadedModels.length === 0 && ifcEngineReady && !SKIP_IFC_INITIALIZATION_FOR_TEST && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 pointer-events-auto">
                  <FileUpload key={`file-upload-main-${settingsVersion}`} isAdding={false} />
                </div>
              )}
              {ifcEngineReady && !webGLContextLost && (
                <ViewToolbar
                  onSelectedCamera={handleSelectedCamera}
                  cameraType={cameraType} 
                  onShowGrids={handleToggleGrid }
                  onZoomExtents={handleZoomExtents}
                  onZoomSelected={handleZoomSelected}
                  isElementSelected={selectedElements.length > 0}
                  onUnhideAll={customUnhideAllElements}
                  onUnhideLast={customUnhideLastElement}
                  onSelectAllVisible={handleSelectAllVisible}
                /> /* Thanh công cụ điều khiển */
              )}
              <SelectionListOverlay /> {/* Overlay hiển thị danh sách lựa chọn */}
            </div>
          </Panel>
          <ResizeHandleHorizontal
            onToggle={handleToggleRightPanel}
            collapsed={rightPanelCollapsed}
            isLeftSide={false}
            className="pointer-events-auto"
          /> {/* Thanh kéo ngang cho panel phải */}
          {/* Panel phải */}
          <Panel
            id="right-sidebar"
            ref={rightPanelRef}
            defaultSize={25}
            minSize={15}
            maxSize={40}
            collapsible
            className="bg-transparent pointer-events-auto"
          >
            <ResponsiveTabs onSettingsChanged={handleSettingsChanged} /> {/* Tab responsive */}
          </Panel>
        </PanelGroup>
      </div>
    </>

  );
  // Component để lưu scene vào ref
  function SceneCapture({ onSceneCapture }: { onSceneCapture: (scene: THREE.Scene) => void }) {
    const { scene } = useThree();
    useEffect(() => {
      // console.log("SceneCapture: Capturing scene");
      onSceneCapture(scene);
    }, [scene, onSceneCapture]);
    return null;
  }
}