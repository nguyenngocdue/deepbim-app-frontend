import { FragmentsManager } from "@thatopen/components";

interface GroupItem {
  map: { [uuid: string]: Set<number> | number[] | number };
}

/**
 * Toggle visibility of a group item in fragments.
 * 
 * @param groupItem - Object that contains the `map` of fragmentUUID → expressID(s)
 * @param visible - Whether to show or hide
 * @param fragmentsManager - The FragmentsManager instance
 */
export function toggleGroupItemVisibility(
  groupItem: GroupItem,
  visible: boolean,
  fragmentsManager: FragmentsManager
) {
  const uuids = groupItem.map;

  for (const [uuid, elementIds] of Object.entries(uuids)) {
    const [groupEntry] = fragmentsManager.groups.entries();
    const [, fragmentsGroup2] = groupEntry;
    const { keyFragments, items } = fragmentsGroup2;

    keyFragments.forEach((keyFragment: string, index: number) => {
      if (keyFragment === uuid) {
        const fragment = items[index];

        // Normalize elementIds to an array of numbers
        const ids = Array.isArray(elementIds) || elementIds instanceof Set
          ? Array.from(elementIds)
          : [elementIds];

        // Check if any of the IDs are hidden
        const isHidden = ids.some(id => fragment.hiddenItems.has(id));

        if (visible) {
          fragment.setVisibility(true);
        } else {
          // Use the normalized ids (which is a number[]) instead of elementIds
          fragment.setVisibility(isHidden, ids);
        }
      }
    });
  }
}