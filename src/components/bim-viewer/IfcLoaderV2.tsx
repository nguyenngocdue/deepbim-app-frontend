import React, { useEffect, useCallback } from "react";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import { modelManager } from "@/services/ModelManager";
import * as THREE from "three";
import { useLocation } from "@tanstack/react-router";
import { fragmentManager } from "@/services/FragmentManager";


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

  const loadModel = useCallback(
    async (fragmentBytes: ArrayBuffer, fragments: FRAGS.FragmentsModels, world: OBC.World) => {
      if (  !componentRef.current) {
        console.warn("Cannot load IFC: World, components, or container not ready.");
        return;
      }

      try {
        const model = await fragments.load(fragmentBytes, { modelId: "example" });
        model.useCamera(world.camera.three);
        world.scene.three.add(model.object);

        const classifier = componentRef.current.get(OBC.Classifier);
        classifier.list.CustomSelections = {};

        await modelManager.setModel(model);
        await fragments.update(true);

      } catch (error) {
        console.error("Failed to load IFC file:", error);
      }
    },
    [componentRef]
  );


  const convertIFC = async (ifcPath: string, fragments:any, world:any) => {
    const ifcRes = await fetch(ifcPath);
    const ifcBytes = new Uint8Array(await ifcRes.arrayBuffer());
    const importer = new FRAGS.IfcImporter();
    importer.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.68/" };
    const fragmentBytes = await importer.process({ bytes: ifcBytes });
    fragmentManager.setFragment(fragmentBytes);
    loadModel(fragmentBytes, fragments, world); 
      
  };


  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const modelUrl = `${import.meta.env.VITE_API_BASE_URL}/view?v=${viewId}`;
        const fetchedWorker = await fetch( "https://thatopen.github.io/engine_fragment/resources/worker.mjs");
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


  return null;
};

export default IfcLoaderV2;