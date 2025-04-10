import * as OBC from "@thatopen/components";
import { FragmentsGroup } from "@thatopen/fragments";

export function GetFragmentsGroup(world: OBC.World): FragmentsGroup | null {
  const group = world.scene.three.children.find(
    (child): child is FragmentsGroup => child instanceof FragmentsGroup
  );
  if (!group) {
    console.warn("[GetFragmentsGroup] No FragmentsGroup found in scene.");
    return null;
  }
  return group;
}
