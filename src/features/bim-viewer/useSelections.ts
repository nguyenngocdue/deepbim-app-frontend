import { worldManager } from "@/services/WorldManager";
import * as OBC from "@thatopen/components";
import { modelManager } from "@/services/ModelManager";
import { fragmentManager } from "@/services/FragmentManager";
import { MultiSelectionManager } from "@/lib/selections/MultiSelectionManager";


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
          // to hide
          const idsToReset1 = await element.getItemsByVisibility(false);
          await element.resetHighlight(idsToReset1)
          const idsToReset2 = await element.getItemsByVisibility(true);
          // to isolate
          await element.resetHighlight(idsToReset2)
          await element.resetVisible();
        }
      }
    }
    await selections.clear();
    await fragments.update();
  };

  const onHide = async () => {
    if (!firstEntry) return;
    const [model, idsToHideSet] = firstEntry;
    const idsToHide = Array.from(idsToHideSet);
    await model?.setVisible(idsToHide, false)
  }


  const onHideByIFCType = async () => {
    const selections = selectionManager.getSelections();
    for (const [model, selectedSet] of selections.entries()) {
      const cate = model.getCategories();
      console.log(cate);
    }
   
  };

  const onIsolateByIFCType = async () => {

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
