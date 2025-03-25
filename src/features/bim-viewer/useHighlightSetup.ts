// src/features/useHighlightSetup.ts
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";

interface UseHighlightSetupProps {
  isHighlightEnabled: boolean;
  componentRef: React.RefObject<any>;
  worldRef: React.RefObject<any>;
}

export function useHighlightSetup({
  isHighlightEnabled,
  componentRef,
  worldRef,
}: UseHighlightSetupProps): void {
  if (!componentRef.current || !worldRef.current) return;

  const components = componentRef.current;
  const world = worldRef.current;

  const highlighter = components.get(OBCF.Highlighter);
  if (!highlighter) return;

  const outliner = components.get(OBCF.Outliner);
  outliner.world = world;
  outliner.enabled = true;

  if (isHighlightEnabled) {
    try {
      highlighter.setup({ world });
      highlighter.zoomToSelection = true;

      // outliner.create(
      //   "example",
      //   new THREE.MeshBasicMaterial({
      //     color: 0xbcf124,
      //     transparent: true,
      //     opacity: 0.5,
      //   })
      // );

      // highlighter.events.select.onHighlight.add((data) => {
      //   outliner.clear("example");
      //   outliner.add("example", data);
      // });

      // highlighter.events.select.onClear.add(() => {
      //   outliner.clear("example");
      // });
    } catch (error) {
      if ((error as Error).message.includes("already exists")) {
        console.warn("Highlight selection already exists. Skipping setup.");
      } else {
        console.error("Highlight setup failed:", error);
      }
    }
  } else {
    highlighter.zoomToSelection = false;
   
  }
}