import { useEffect, useRef, useState, useCallback } from "react";
import * as FRAGS from "@thatopen/fragments";
import { loadFragmentFromCache, saveFragmentToCache } from "@/features/bim-viewer/utils/idb-file-cache";

export function useFragmentsLoader({
  viewId,
  worldRef,
  onModelLoaded,
}: {
  viewId: string | null;
  worldRef: React.RefObject<any>;
  onModelLoaded: (fragmentBytes: ArrayBuffer, fragments: any, world: any) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs để cleanup event listener
  const fragmentsRef = useRef<any>(null);
  const eventRest = useRef<Function>();
  const eventUpdate = useRef<Function>();

  useEffect(() => {
    if (!viewId) return;
    let world: any;
    let fragments: any;
    let disposed = false;

    async function fetchWorker() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Load worker file
        const workerUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
        const fetchedWorker = await fetch(workerUrl);
        const workerText = await fetchedWorker.text();
        const workerFile = new File([new Blob([workerText])], "worker.mjs", { type: "text/javascript" });
        const url = URL.createObjectURL(workerFile);

        // 2. FragmentsModels
        fragments = new FRAGS.FragmentsModels(url);
        fragmentsRef.current = fragments;

        // 3. Event listeners cho camera controls
        world = worldRef.current;
        if (!world) throw new Error("World is not ready!");

        eventRest.current = () => fragments.update(true);
        eventUpdate.current = () => fragments.update();

        world.camera.controls.addEventListener("rest", eventRest.current);
        world.camera.controls.addEventListener("update", eventUpdate.current);

        // 4. convert IFC + load model
        const modelUrl = `${import.meta.env.VITE_API_BASE_URL}/view?v=${viewId}`;
        let fragmentBytes: ArrayBuffer | undefined;
        const cacheKey = `fragment_${viewId}`;

        // 4.1 Try cache
        const cacheData = await loadFragmentFromCache(cacheKey);
        if (cacheData) {
          fragmentBytes = cacheData;
        } else {
          // Download IFC, convert fragment
          const ifcRes = await fetch(modelUrl);
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
          // Convert IFC
          const importer = new FRAGS.IfcImporter();
          importer.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.68/" };
          fragmentBytes = await importer.process({ bytes: ifcBytes });
          await saveFragmentToCache(cacheKey, fragmentBytes);
        }

        // Gọi callback cho bên ngoài handle loading
        if (!disposed && fragmentBytes && fragments && world)
          await onModelLoaded(fragmentBytes, fragments, world);

        setIsLoading(false);
      } catch (e: any) {
        setError(e.message || "Failed to load fragments");
        setIsLoading(false);
      }
    }
    fetchWorker();

    // Cleanup: dispose model, remove listeners, cleanup renderer...
    return () => {
      disposed = true;
      try {
        if (fragmentsRef.current?.disposeModel) {
          fragmentsRef.current.disposeModel("example");
        }
        if (world?.renderer?.dispose) world.renderer.dispose();
        if (world?.camera?.controls?.removeEventListener) {
          if (eventRest.current) world.camera.controls.removeEventListener("rest", eventRest.current);
          if (eventUpdate.current) world.camera.controls.removeEventListener("update", eventUpdate.current);
        }
        fragmentsRef.current = null;
      } catch (err) {
        console.warn("Cleanup failed", err);
      }
    };
  }, [viewId, worldRef, onModelLoaded]);

  return { isLoading, error };
}
