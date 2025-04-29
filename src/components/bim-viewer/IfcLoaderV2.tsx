import React, { useEffect, useCallback } from "react";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import { modelManager } from "@/services/ModelManager";
import * as THREE from "three";
import { useLocation } from "@tanstack/react-router";


interface IfcLoaderV2Props {
  source?: string | File;
  worldRef: React.RefObject<OBC.World | null>;
  componentRef: React.RefObject<OBC.Components | null>;
  container: HTMLElement | null;
  haveGrids: boolean;
}

const IfcLoaderV2: React.FC<IfcLoaderV2Props> = ({ worldRef, componentRef, container }) => {

  const loadIfc = useCallback(
    async (buffer: Uint8Array) => {
      if (!worldRef.current || !componentRef.current || !container) {
        console.warn("Cannot load IFC: World, components, or container not ready.");
        return;
      }

      try {
        const components = componentRef.current;
        const world = worldRef.current;

        const fragments = components.get(OBC.FragmentsManager);
        const classifier = components.get(OBC.Classifier);
        classifier.list.CustomSelections = {};

        const loader = components.get(OBCF.IfcStreamer);
        loader.world = world;
        loader.useCache = true;
        loader.culler.threshold = 10;
        loader.culler.maxHiddenTime = 1000;
        loader.culler.maxLostTime = 3000;

        const culler = components.get(OBC.Cullers).create(world);
        // @ts-ignore
        world.camera.controls.restThreshold = 0.1;
        // @ts-ignore
        world.camera.controls.addEventListener("rest", () => {
          culler.needsUpdate = true;
          loader.cancel = true;
          loader.culler.needsUpdate = true;
          loader.culler.onViewUpdated.reset();

          loader.culler.onViewUpdated.add(async ({ toLoad, toShow }) => {
            // @ts-ignore
            await loader.loadFoundGeometries(toLoad);
            // @ts-ignore
            loader.setMeshVisibility(toShow, true);
          });
        });
        // @ts-ignore
        world.camera.controls.addEventListener("sleep", () => {
          loader.culler.needsUpdate = true;
        });

        // Khi fragment được stream và gắn vào scene
        fragments.onFragmentsLoaded.add(async (model) => {
          const indexer = components.get(OBC.IfcRelationsIndexer);
          await indexer.process(model);

          if (model.hasProperties) {
            await indexer.process(model);
            classifier.byEntity(model);
          }

          world.scene.three.add(model);

          setTimeout(() => {
            if (world.camera.controls && world.meshes.size > 0) {
              const boundingBox = new THREE.Box3().setFromObject(
                new THREE.Group().add(...world.meshes)
              );
              world.camera.controls.fitToBox(boundingBox, true);
            }
          }, 50);
        });
        await modelManager.setModel(buffer, components);

        fragments.onFragmentsDisposed.add(({ fragmentIDs }) => {
          for (const fragmentID of fragmentIDs) {
            const mesh = [...world.meshes].find((mesh) => mesh.uuid === fragmentID);
            if (mesh) {
              world.meshes.delete(mesh);
            }
          }
        });

      } catch (error) {
        console.error("Failed to load IFC file:", error);
      }
    },
    [worldRef, componentRef, container]
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewId = searchParams.get('v');

  useEffect(() => {
    // if (!viewId || !container || !worldRef.current || !componentRef.current) {
    //   console.log("Skipping IFC load: Missing source, container, world, or components.");
    //   return;
    // }
    const modelUrl = `${import.meta.env.VITE_API_BASE_URL}/view?v=${viewId}`;
    const loadFile = async () => {
      try {
        const buffer = await (fetch(modelUrl).then((res) => res.arrayBuffer())
        ).then((arrayBuffer) => new Uint8Array(arrayBuffer));
        await loadIfc(buffer);
      } catch (error) {
        console.error("Error loading IFC file:", error);
      }
    };

    loadFile();
  }, [viewId, container, worldRef, componentRef, loadIfc]);

  return null;
};

export default IfcLoaderV2;