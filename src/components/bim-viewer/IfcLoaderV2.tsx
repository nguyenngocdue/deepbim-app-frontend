import React, { useEffect, useCallback } from "react";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";

interface IfcLoaderV2Props {
  source?: string | File; // URL (string) hoặc File
  worldRef: React.RefObject<OBC.World | null>;
  componentRef: React.RefObject<OBC.Components | null>;
  container: HTMLElement | null;
}

const IfcLoaderV2: React.FC<IfcLoaderV2Props> = ({
  source,
  worldRef,
  componentRef,
  container,
}) => {
  // Tải và xử lý IFC Model
  const loadIfc = useCallback(
    async (buffer: Uint8Array) => {
      if (!worldRef.current || !componentRef.current || !container) {
        console.warn("Cannot load IFC: World, components, or container not ready.");
        return;
      }

      try {
        const components = componentRef.current;
        const world = worldRef.current;

        // Khởi tạo Fragment Loader
        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        await fragmentIfcLoader.setup();

        // Thiết lập FragmentsManager và các thành phần liên quan
        const fragments = components.get(OBC.FragmentsManager);
        const indexer = components.get(OBC.IfcRelationsIndexer);
        const classifier = components.get(OBC.Classifier);
        classifier.list.CustomSelections = {};

        // Cấu hình IfcStreamer
        const tilesLoader = components.get(OBF.IfcStreamer);
        tilesLoader.world = world;
        tilesLoader.culler.threshold = 50; // Tăng ngưỡng để giảm số lượng fragment render cùng lúc
        tilesLoader.culler.maxHiddenTime = 5000; // Tăng thời gian giữ fragment trong bộ nhớ (5 giây)
        tilesLoader.culler.maxLostTime = 20000; // Giảm thời gian giữ dữ liệu không dùng (20 giây)

        // Tạo culler
        const culler = components.get(OBC.Cullers).create(world);
        world.camera.controls.restThreshold = 0.25;
        world.camera.controls.addEventListener("rest", () => {
          culler.needsUpdate = true;
          tilesLoader.cancel = true;
          tilesLoader.culler.needsUpdate = true;
        });

        // Xử lý khi fragments được load
        fragments.onFragmentsLoaded.add(async (model) => {
          if (model.hasProperties) {
            await indexer.process(model);
            classifier.byEntity(model);
          }
        
          if (!model.isStreamed) {
            const visibleFragments = model.items.filter((fragment) => fragment.mesh.visible); // Chỉ thêm fragment hiển thị
            for (const fragment of visibleFragments) {
              world.meshes.add(fragment.mesh);
              culler.add(fragment.mesh);
            }
          }
        
          world.scene.three.add(model);
          world.renderer.update();
        });

        // Load model
        await fragmentIfcLoader.load(buffer);
      } catch (error) {
        console.error("Failed to load IFC file:", error);
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

  return null; // Không cần render gì cả
};

export default IfcLoaderV2;