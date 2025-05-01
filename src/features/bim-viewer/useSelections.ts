import { worldManager } from "@/services/WorldManager";
import * as OBC from "@thatopen/components";
import { modelManager } from "@/services/ModelManager";
import { fragmentManager } from "@/services/FragmentManager";
import { SelectionStore } from "@/services/SelectionStore";
import { MultiSelectionManager } from "@/lib/MultiSelectionManager";


export function useSelections() {
  const fragments = fragmentManager.getFragment();
  const selectionManager = MultiSelectionManager.getInstance();
  const selections = selectionManager.getSelections();
  const firstEntry = selections.entries().next().value;

  const isolate = async () => {
    const selections = selectionManager.getSelections();
    for (const [model, selectedSet] of selections.entries()) {
      if (typeof model.getItemsByVisibility === "function") {
        const visibleIds = await model.getItemsByVisibility(true);
        // Lọc ra những ID đang hiển thị mà không nằm trong selectedSet
        const idsToHide = visibleIds.filter(id => !selectedSet.has(id));
        await model.setVisible(idsToHide, false);
      }
    }
  };
  

  const onToggleVisibility = async () => {
    if (!firstEntry) return;
    const [model, idsToHideSet] = firstEntry;
    const idsToHide = Array.from(idsToHideSet);
    await model.toggleVisible([idsToHide[idsToHide.length - 1]]);
  };

  const onShowAll = async () => {
    const modelList = fragments.models.list;
    for (const elements of modelList) {
      for (const element of elements) {
        if (typeof element.resetVisible === "function") {
          await element.resetVisible();
        }
      }
    }
    SelectionStore.reset();
    await fragments.update();
  };

  const onHide = async ()  => {
    if (!firstEntry) return;
    const [model, idsToHideSet] = firstEntry;
    const idsToHide = Array.from(idsToHideSet);
    await model?.setVisible(idsToHide, false)
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

  const onToggleElements = async () => {
    const modelList = fragments.models.list;
    for (const model of modelList) {
      for (const element of model) {
        if (typeof element.getItemsByVisibility === "function") {
          const unVisibleElementIds = await element.getItemsByVisibility(false);
          const visibleElementIds = await element.getItemsByVisibility(true);
          
          await element?.setVisible(unVisibleElementIds, true);
          await element?.setVisible(visibleElementIds, false);
        }
      }
    }
  }





  return { 
    isolate,
    onToggleVisibility,
    onShowAll,
    onHide,
    onHideByIFCType,
    onFocusSelection,
    onIsolateByIFCType,
    onShowProperties,
    onToggleElements,
   };
}
