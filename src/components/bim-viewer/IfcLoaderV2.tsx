import React, { useEffect, useCallback, useRef } from "react";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as THREE from 'three';


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
  haveGrids,
}) => {
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


        const worldGrid = components.get(OBC.Grids).create(world);
        if(haveGrids) {
          worldGrid.material.uniforms.uColor.value = new THREE.Color(0x999999);
          worldGrid.material.uniforms.uSize1.value = 2;
          worldGrid.material.uniforms.uSize2.value = 8;
          worldGrid.visible = true;
        }else{
          worldGrid.visible = false;
        }
        

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
            for (const fragment of model.items) {
              world.meshes.add(fragment.mesh);
              culler.add(fragment.mesh);
            }
          }
        
          if (!model.isStreamed) {
            setTimeout(async () => {
              world.camera.fit(world.meshes, 0.8);
            }, 50);
          }
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
        await fragmentIfcLoader.load(buffer);

        

        // Load model
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