import React, { useEffect, useCallback, useState } from "react";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import { modelManager } from "@/services/ModelManager";
import { useLocation } from "@tanstack/react-router";
import { fragmentManager } from "@/services/FragmentManager";
import { setupClickMarker } from "@/features/bim-viewer/SetupClickMarker";
import { updateUserSettings } from "@/features/bim-viewer/visibility-settings/ModelSetting";
import FullscreenLoader from "./common/FullscreenLoader";
import DraggableModelInformation from "@/features/bim-viewer/modals/model-information";

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
  const containerRef = React.useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false); // Quản lý trạng thái pop-up
  const [popupContent, setPopupContent] = useState<string>("");


  const handleItemSelected = (content: string) => {
    setPopupContent(content); // Cập nhật nội dung của pop-up
    setShowPopup(true); // Mở pop-up
  };

  const handleItemDeselected = () => {
    setShowPopup(false); // Đóng pop-up
  };



  useEffect(() => {
    containerRef.current = container;
  }, [container]);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 0); // Delay 5 giây trước khi ẩn
      return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
    }
  }, [progress]);

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
        // add usersettings
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
          onItemSelected: (content) => handleItemSelected(content),
          onItemDeselected:() => handleItemDeselected(),
        });

        setProgress(100); // Hoàn tất tiến trình
      } catch (error) {
        console.error("Failed to load IFC file:", error);
      }
      // Perform any necessary cleanup here if needed
      return () => {
        // Example cleanup logic (if required)
        console.log("Cleanup executed");
      };

    },
    [componentRef, container, worldRef]
  );

  const convertIFC = async (ifcPath: string, fragments: any, world: any) => {
    try {
      const ifcRes = await fetch(ifcPath);
      if (!ifcRes.body) {
        throw new Error("No response body");
      }

      const reader = ifcRes.body.getReader();
      const contentLength = Number(ifcRes.headers.get("Content-Length")) || 0;
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      // Theo dõi tiến trình tải file (0-50%)
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          if (contentLength > 0) {
            const downloadProgress = (receivedLength / contentLength) * 50; // Tải chiếm 50% tiến trình
            setProgress(downloadProgress);
          }
        }
      }

      // Gộp các chunk thành ArrayBuffer
      const ifcBytes = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        ifcBytes.set(chunk, position);
        position += chunk.length;
      }

      // Xử lý file IFC (50-75%)
      setProgress(50);
      const importer = new FRAGS.IfcImporter();
      importer.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.68/" };
      const fragmentBytes = await importer.process({ bytes: ifcBytes });
      setProgress(75); // Xử lý xong, chuẩn bị load model

      fragmentManager.setFragment(fragmentBytes);
      loadModel(fragmentBytes, fragments, world);
    } catch (error) {
      console.error("Failed to convert IFC:", error);
    }
  };

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const modelUrl = `${import.meta.env.VITE_API_BASE_URL}/view?v=${viewId}`;
        const fetchedWorker = await fetch("https://thatopen.github.io/engine_fragment/resources/worker.mjs");
        const workerText = await fetchedWorker.text();
        const workerFile = new File([new Blob([workerText])], "worker.mjs", {
          type: "text/javascript",
        });
        const url = URL.createObjectURL(workerFile);
        const fragments = new FRAGS.FragmentsModels(url);
        const world = worldRef.current;

        world.camera.controls.addEventListener("rest", () => fragments.update(true));
        world.camera.controls.addEventListener("update", () => fragments.update());

        convertIFC(modelUrl, fragments, world);
        await fragments.disposeModel("example");
      } catch (error) {
        console.error("Error fetching worker file:", error);
      }
    };

    fetchWorker();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="asolute top-0 z-50 progress-bar w-full h-full">
          <FullscreenLoader progress={progress} message="Loading 3D model..." />
        </div>
      )}

      {showPopup && (
        <DraggableModelInformation content={popupContent} onClose={handleItemDeselected}/>
      )}
    </>
  );
};

export default IfcLoaderV2;