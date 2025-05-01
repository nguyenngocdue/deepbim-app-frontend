import { useEffect, useState } from "react";
import { worldManager } from "@/services/WorldManager";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as OBF from "@thatopen/components-front";
import { modelManager } from "@/services/ModelManager";
import { fragmentManager } from "@/services/FragmentManager";
import { SelectionStore } from "@/services/SelectionStore";
import { any } from "three/src/nodes/TSL.js";


export function useSelections() {
  const [highlighter, setHighlighter] = useState<any>(null);
  const {localId, object, point, selectedModel } = SelectionStore.get();
  const fragments = fragmentManager.getFragment();

  const isolate = async () => {
    const modelList = fragments.models.list;
    for (const elements of modelList) {
      for (const element of elements) {
        if (typeof element.getItemsByVisibility === "function") {
          const localIds = await element.getItemsByVisibility(true);
          const index = localIds.indexOf(localId);
          if (index !== -1) localIds.splice(index, 1);
          await element?.setVisible(localIds, false)
        }
      }
    }
   
  };

  const onToggleVisibility = async () => {
    await selectedModel.toggleVisible([localId]);
    await fragments.update();
  };

  const onShowAll = async () => {
    const modelList = fragments.models.list;
    for (const elements of modelList) {
      for (const element of elements) {
        if (typeof element.resetVisible === "function") {
          await element.resetVisible();
          await element.resetHighlight([localId]);
        }
      }
    }
    SelectionStore.reset();
    await fragments.update();
  };

  const onHide = async ()  => {
    await selectedModel?.setVisible([localId], false)
    await fragments.update();

  }


  const onHideByIFCType = async () => {
    const components = worldManager.getComponents();
    if (!components) return;
  
    const fragments = components.get(OBC.FragmentsManager);
    const selection = highlighter.selection.select;
  
    // Exit if there's no selected element
    if (Object.keys(selection).length === 0) return;
  
    // Get fragment ID and express ID of the selected element
    const [fragmentID, expressIDs] = Object.entries(selection)[0];
    const selectedExpressID = Array.from(expressIDs as Set<number>)[0];
  
    // Get the model and properties of the selected element
    const model = await modelManager.waitForModel();
    const selectedProps = await model.getProperties(selectedExpressID);
    const selectedType = selectedProps.type; // e.g. "IfcWall", "IfcDoor", etc.
    if (!selectedType) return;
  
    // Loop through all fragments in the scene
    for (const [, fragment] of fragments.list) {
      for (const expressID of fragment.ids) {
        const props = await model.getProperties(expressID);
        console.log(props, selectedType);
  
        // Hide the fragment if it belongs to the same IFC type
        if (props.type === selectedType) {
          fragment.setVisibility(false);
        }
      }
    }
  };
  
  const onIsolateByIFCType = async ()  => {
    const components = worldManager.getComponents();
    if (!components) return;
  
    const fragments = components.get(OBC.FragmentsManager);
    const selection = highlighter.selection.select;
  
    // Exit if there's no selected element
    if (Object.keys(selection).length === 0) return;
  
    // Get fragment ID and express ID of the selected element
    const [fragmentID, expressIDs] = Object.entries(selection)[0];
    const selectedExpressID = Array.from(expressIDs as Set<number>)[0];
  
    // Get the model and properties of the selected element
    const model = await modelManager.waitForModel();
    const selectedProps = await model.getProperties(selectedExpressID);
    const selectedType = selectedProps.type; // e.g. "IfcWall", "IfcDoor", etc.
    if (!selectedType) return;
  
    // Loop through all fragments in the scene
    for (const [, fragment] of fragments.list) {
      for (const expressID of fragment.ids) {
        const props = await model.getProperties(expressID);
        console.log(props, selectedType);
        // Hide the fragment if it belongs to the same IFC type
        if (props.type !== selectedType) {
          fragment.setVisibility(false);
        }
      }

      }
    }
  
  const onFocusSelection = async () => {
    const world = worldManager.getWorld();

    console.log(await selectedModel.getVisibility())
    


    // const fragment = fragments.list.get(localId);
    // console.log(fragment);


    // const sphere = bbox.getSphere();
    // const i = Infinity;
    // const mi = -Infinity;
    // const { x, y, z } = sphere.center;
    // const isInf = sphere.radius === i || x === i || y === i || z === i;
    // const isMInf = sphere.radius === mi || x === mi || y === mi || z === mi;
    // const isZero = sphere.radius === 0;
    // if (isInf || isMInf || isZero) {
    //   return;
    // }

    // sphere.radius *= 1.2;
    // const camera = world.camera;
    // await camera.controls.fitToSphere(sphere, true);
  };

  const onShowProperties = async () => {
    const components = worldManager.getComponents();
    if (!components) return;
  
    const fragments = components.get(OBC.FragmentsManager);
    const selection = highlighter.selection.select;
    const [uuid, expressIDs] = Object.entries(selection)[0];
    const fragment = fragments.list.get(uuid);
    if (!fragment) return;
    const props = await modelManager.waitForModel();
    const properties = await props.getProperties(Array.from(expressIDs as Set<number>));

    console.log(properties);

  }





  return { 
    isolate,
    onToggleVisibility,
    onShowAll,
    onHide,
    onHideByIFCType,
    onFocusSelection,
    onIsolateByIFCType,
    onShowProperties
   };
}
