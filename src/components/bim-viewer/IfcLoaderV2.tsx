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
import { LoadingOverlay } from "../common/LoadingOverlay";

interface IfcLoaderV2Props {
  source?: string | File;
  worldRef: React.RefObject<OBC.World | null>;
  componentRef: React.RefObject<OBC.Components | null>;
  container: HTMLElement | null;
  haveGrids: boolean;
}

const IfcLoaderV2: React.FC<IfcLoaderV2Props> = ({ worldRef, componentRef, container, setOnModelReady }) => {
  const location = useLocation();
  const viewId = new URLSearchParams(location.search).get("v");
  const containerRef = React.useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false); // Quản lý trạng thái pop-up
  const [popupContent, setPopupContent] = useState<string>("");


  const handleItemSelected = (content: string) => {
    modelManager.setSelectedRayCasterElement(content);
    setPopupContent(content); // Cập nhật nội dung của pop-up
    setShowPopup(true); // Mở pop-up

  };

  const handleItemDeselected = () => {
    setShowPopup(false); // Đóng pop-up
    modelManager.clearSelectedRayCasterElement();

  };



  useEffect(() => {
    containerRef.current = container;
  }, [container]);

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
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      // Theo dõi tiến trình tải file (0-50%)
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          receivedLength += value.length;
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
      const importer = new FRAGS.IfcImporter();
      importer.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.68/" };
      const fragmentBytes = await importer.process({ bytes: ifcBytes });

      fragmentManager.setFragment(fragmentBytes);
      loadModel(fragmentBytes, fragments, world);
      setOnModelReady(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to convert IFC:", error);
    }
  };

  useEffect(() => {
    const fetchWorker = async () => {
      setOnModelReady(true);
      setIsLoading(true);
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
        setOnModelReady(false);
        setIsLoading(false);
      }
    };

    fetchWorker();
  }, []);

  console.log(isLoading);

  return (
    <div>
      <LoadingOverlay open={isLoading}/>
      {showPopup && (
        <DraggableModelInformation content={popupContent} onClose={handleItemDeselected}/>
      )}
    </div>
  );
};

export default IfcLoaderV2;