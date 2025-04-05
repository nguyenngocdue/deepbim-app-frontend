import React, { useEffect, useCallback, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import LoadingSpinner from "./LoadingSpinner"; // Import LoadingSpinner
import { modelManager } from "@/services/ModelManager";
import { worldManager } from "@/services/WorldManager";

interface IfcLoaderV2Props {
  source?: string | File; // URL (string) hoặc File
  worldRef: React.RefObject<OBC.World | null>;
  componentRef: React.RefObject<OBC.Components | null>;
  container: HTMLElement | null;
  haveGrids: boolean;
}

const IfcLoaderV2: React.FC<IfcLoaderV2Props> = ({
  source,
  worldRef,
  componentRef,
  container,
}) => {
  // const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading

  // Tải và xử lý IFC Model
  const loadIfc = useCallback(
    async (buffer: Uint8Array, parsedData?: any) => {
      if (!worldRef.current || !componentRef.current || !container) {
        console.warn("Cannot load IFC: World, components, or container not ready.");
        return;
      }

      try {
        const components = componentRef.current;
        const world = worldRef.current;

        // const ifcLoader = components.get(OBC.IfcLoader);
        // await ifcLoader.setup();
      
        // Thiết lập FragmentsManager và các thành phần liên quan
        const fragments = components.get(OBC.FragmentsManager);
        
        const classifier = components.get(OBC.Classifier);
        classifier.list.CustomSelections = {};

        // Cấu hình IfcStreamer
        const tilesLoader = components.get(OBF.IfcStreamer);
        tilesLoader.world = world;
        tilesLoader.culler.threshold = 50;
        tilesLoader.culler.maxHiddenTime = 5000;
        tilesLoader.culler.maxLostTime = 20000;

        // Tạo culler
        const culler = components.get(OBC.Cullers).create(world);
        world.camera.controls.restThreshold = 0.1;
        world.camera.controls.addEventListener("rest", () => {
          culler.needsUpdate = true;
          tilesLoader.cancel = true;
          tilesLoader.culler.needsUpdate = true;
        });

        // Xử lý khi fragments được load
        fragments.onFragmentsLoaded.add(async (model) => {
          // const indexer = components.get(OBC.IfcRelationsIndexer);
          // // await indexer.process(model);
          
          // if (model.hasProperties) {
          //   await indexer.process(model);
          //   classifier.byEntity(model);
          // }

          // if (!model.isStreamed) {
          //   for (const fragment of model.items) {
          //     world.meshes.add(fragment.mesh);
          //     culler.add(fragment.mesh);
          //   }
          // }

          // if (!model.isStreamed) {
          //   setTimeout(async () => {
          //     world.camera.fit(world.meshes, 18);
          //   }, 50);
          // }
          world.scene.three.add(model);
        });

        fragments.onFragmentsDisposed.add(({ fragmentIDs }) => {
          for (const fragmentID of fragmentIDs) {
            const mesh = [...world.meshes].find((mesh) => mesh.uuid === fragmentID);
            if (mesh) {
              world.meshes.delete(mesh);
            }
          }
        });
        modelManager.setModel(buffer, components);
        // const model = await  fragmentIfcLoader.load(buffer);
        // const indexer = components.get(OBC.IfcRelationsIndexer);
        // await indexer.process(model);





      } catch (error) {
        console.error("Failed to load IFC file:", error);
      } finally {
        // setIsLoading(false); // Kết thúc loading
      }
    },
    [worldRef, componentRef, container]
  );

  // Tải file IFC từ source
  useEffect(() => {
    if (!source || !container || !worldRef.current || !componentRef.current) {
      console.log("Skipping IFC load: Missing source, container, world, or components.");
      return;
    }

    const loadFile = async () => {
      // setIsLoading(true); // Bắt đầu loading
      try {
        const buffer = await (source instanceof File
          ? source.arrayBuffer()
          : fetch(source).then((res) => res.arrayBuffer())
        ).then((arrayBuffer) => new Uint8Array(arrayBuffer));
        await loadIfc(buffer);
      } catch (error) {
        console.error("Error loading IFC file:", error);
      } 
    };

    loadFile();
  }, [source, container, worldRef, componentRef, loadIfc]);

  // return isLoading ? <LoadingSpinner /> : null; // Hiển thị LoadingSpinner khi đang tải
};

export default IfcLoaderV2;