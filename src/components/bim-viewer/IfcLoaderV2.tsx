import React, { useEffect, useCallback, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import { modelManager } from "@/services/ModelManager";
import { useLocation } from "@tanstack/react-router";
import { fragmentManager } from "@/services/FragmentManager";
import { setupClickMarker } from "@/features/bim-viewer/SetupClickMarker";
import { updateUserSettings } from "@/features/bim-viewer/visibility-settings/ModelSetting";
import DraggableModelInformation from "@/features/bim-viewer/modals/model-information";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { loadFragmentFromCache, saveFragmentToCache } from "@/features/bim-viewer/utils/idb-file-cache";

interface IfcLoaderV2Props {
  source?: string | File;
  worldRef: React.RefObject<OBC.World | null>;
  componentRef: React.RefObject<OBC.Components | null>;
  container: HTMLElement | null;
  haveGrids: boolean;
}

const IfcLoaderV2: React.FC<IfcLoaderV2Props> = ({ worldRef, componentRef, container }) => {
  const location = useLocation();
  const viewId = new URLSearchParams(location.search).get("v");
  const containerRef = useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<string>("");

  // Event handlers ref để giữ tham chiếu, không đổi khi re-render
  const eventRestRef = useRef<(() => void) | null>(null);
  const eventUpdateRef = useRef<(() => void) | null>(null);

  // -- Xử lý click chọn thông tin
  const handleItemSelected = useCallback((content: string) => {
    modelManager.setSelectedRayCasterElement(content);
    setPopupContent(content);
    setShowPopup(true);
  }, []);
  const handleItemDeselected = useCallback(() => {
    setShowPopup(false);
    modelManager.clearSelectedRayCasterElement();
  }, []);

  useEffect(() => {
    containerRef.current = container;
  }, [container]);

  // --- Load model từ fragments bytes ---
  const loadModel = useCallback(
    async (fragmentBytes: ArrayBuffer, fragments: FRAGS.FragmentsModels, world: OBC.World) => {
      if (!componentRef.current) {
        console.warn("Cannot load IFC: World, components, or container not ready.");
        return;
      }
      const component = componentRef.current;
      try {
        const model = await fragments.load(fragmentBytes, { modelId: "example" });
        const selectedModel = fragments.models.list.get("example");
        updateUserSettings({ selectedModel });
        model.useCamera(world.camera.three);
        world.scene.three.add(model.object);
        await modelManager.setModel(model);
        await modelManager.setSelectedElement(selectedModel);

        const classifier = component.get(OBC.Classifier);
        classifier.list.CustomSelections = {};

        await fragments.update(true);
        fragmentManager.setFragment(fragments);

        setupClickMarker({
          container: containerRef.current,
          model,
          fragments,
          world,
          onItemSelected: handleItemSelected,
          onItemDeselected: handleItemDeselected,
        });
      } catch (error) {
        setError("Failed to load IFC file");
        console.error("Failed to load IFC file:", error);
      }
    },
    [componentRef, handleItemDeselected, handleItemSelected]
  );

  // --- Convert IFC sang fragments (có cache) ---
  const convertIFC = useCallback(
    async (ifcPath: string, fragments: any, world: any) => {
      try {
        let fragmentBytes: ArrayBuffer | undefined;
        const cacheKey = viewId ? `fragment_${viewId}` : undefined;
        if (cacheKey) {
          const cacheData = await loadFragmentFromCache(cacheKey);
          if (cacheData) {
            fragmentBytes = cacheData;
            await loadModel(fragmentBytes, fragments, world);
            setIsLoading(false);
            return;
          }
        }
        // Nếu không có cache, tải file và convert
        const ifcRes = await fetch(ifcPath);
        if (!ifcRes.body) throw new Error("No response body");
        const reader = ifcRes.body.getReader();
        let receivedLength = 0;
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            receivedLength += value.length;
          }
        }
        const ifcBytes = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          ifcBytes.set(chunk, position);
          position += chunk.length;
        }
        // Convert
        const importer = new FRAGS.IfcImporter();
        importer.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.68/" };
        fragmentBytes = await importer.process({ bytes: ifcBytes });

        // Lưu cache
        if (cacheKey) {
          await saveFragmentToCache(cacheKey, fragmentBytes as ArrayBuffer);
        }
        fragmentManager.setFragment(fragmentBytes);
        await loadModel(fragmentBytes, fragments, world);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setError("Failed to convert IFC");
        console.error("Failed to convert IFC:", error);
      }
    },
    [viewId, loadModel]
  );

  useEffect(() => {
    if (!viewId || !worldRef.current) return;
    let fragments: FRAGS.FragmentsModels | null = null;
    let world: OBC.World | null = null;

    // Handler giữ reference để remove sau
    function handleRest() {
      if (fragments) fragments.update(true);
    }
    function handleUpdate() {
      if (fragments) fragments.update();
    }
    eventRestRef.current = handleRest;
    eventUpdateRef.current = handleUpdate;

    setIsLoading(true);
    setError(null);

    const fetchWorker = async () => {
      try {
        const modelUrl = `${import.meta.env.VITE_API_BASE_URL}/view?v=${viewId}`;
        const fetchedWorker = await fetch("https://thatopen.github.io/engine_fragment/resources/worker.mjs");
        const workerText = await fetchedWorker.text();
        const workerFile = new File([new Blob([workerText])], "worker.mjs", {
          type: "text/javascript",
        });
        const url = URL.createObjectURL(workerFile);
        fragments = new FRAGS.FragmentsModels(url);
        world = worldRef.current;

        // Đăng ký event đúng reference function
        world.camera.controls.addEventListener("rest", handleRest);
        world.camera.controls.addEventListener("update", handleUpdate);

        await convertIFC(modelUrl, fragments, world);
        // fragments sẽ cleanup khi unmount
      } catch (error: any) {
        setIsLoading(false);
        setError("Error fetching worker file");
        console.error("Error fetching worker file:", error);
      }
    };

    fetchWorker();

    // Cleanup: dọn fragment, remove event, dọn renderer nếu cần
    return () => {
      try {
        if (fragments?.disposeModel) fragments.disposeModel("example");
        if (world?.renderer?.dispose) world.renderer.dispose();
        if (world?.camera?.controls?.removeEventListener) {
          if (eventRestRef.current) world.camera.controls.removeEventListener("rest", eventRestRef.current);
          if (eventUpdateRef.current) world.camera.controls.removeEventListener("update", eventUpdateRef.current);
        }
        fragments = null;
        world = null;
      } catch (err) {
        console.warn("Cleanup failed", err);
      }
    };
  }, [viewId, worldRef, convertIFC]);

  return (
    <div>
      <LoadingOverlay open={isLoading} message={error ? error : "Loading..."} />
      {showPopup && (
        <DraggableModelInformation content={popupContent} onClose={handleItemDeselected} />
      )}
    </div>
  );
};

export default IfcLoaderV2;
