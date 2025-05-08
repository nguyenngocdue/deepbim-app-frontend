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


  const onHideByIFCCate = async () => {
    const selections = selectionManager.getSelections();
    for (const [model, selectedSet] of selections.entries()) {
      const data = await model.getItemsData(Array.from(selectedSet), {
        attributes: ["Category", "Type", "Name"],
        attributesDefault: false,
      });
      const category  = data[0]._category.value;
      const itemsOfCate = await model.getItemsOfCategory(category);
      const localIds = (
        await Promise.all(itemsOfCate.map((item) => item.getLocalId()))
      ).filter((localId) => localId !== null) as number[];
      if (typeof model.getItemsByVisibility === "function") {
        const visibleIds = await model.getItemsByVisibility(true);
        // Lọc ra những ID đang hiển thị mà không nằm trong selectedSet
        const idsToHide = visibleIds.filter(id => localIds.includes(id));
        await model.setVisible(idsToHide, false);
      }
      

    }
   
  };

  const onIsolateByIFCCate = async () => {
    const selections = selectionManager.getSelections();
    for (const [model, selectedSet] of selections.entries()) {
      const data = await model.getItemsData(Array.from(selectedSet), {
        attributes: ["Category", "Type", "Name"],
        attributesDefault: false,
      });
      const category  = data[0]._category.value;
      const itemsOfCate = await model.getItemsOfCategory(category);
      const localIds = (
        await Promise.all(itemsOfCate.map((item) => item.getLocalId()))
      ).filter((localId) => localId !== null) as number[];
      if (typeof model.getItemsByVisibility === "function") {
        const visibleIds = await model.getItemsByVisibility(true);
        // Lọc ra những ID đang hiển thị mà không nằm trong selectedSet
        const idsToHide = visibleIds.filter(id => !localIds.includes(id));
        await model.setVisible(idsToHide, false);
      }
      

    }
    

  }

  const onFocusSelection = async () => {

  };

  const onShowProperties = async () => {
   
    console.log("properties");

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
    onHideByIFCCate,
    onFocusSelection,
    onIsolateByIFCCate,
    onShowProperties,
    onToggleElements,
  };
}
