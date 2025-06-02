import { useEffect, useState } from "react";
import { containerManager } from "@/services/ContainerManager";
import { worldManager } from "@/services/WorldManager";
import { gridManager } from "@/services/GridManager";
import { useHighlightSetup } from "./useHighlightSetup";

export function useInitWorld(containerRef: React.RefObject<HTMLDivElement>) {
  const [world, setWorld] = useState<any>(null);
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!containerRef.current) return;

      containerManager.setRef(containerRef.current);
      await worldManager.initialize();
      if (cancelled) return;


      const worldInstance = worldManager.getWorld();
      const componentInstance = worldManager.getComponents();
      if (!componentInstance) return;

      // gridManager.createGrid(componentInstance, worldInstance);
      
      setWorld(worldInstance);
      setComponents(componentInstance);
      // useHighlightSetup({ isHighlightEnabled: true, components, world });
    };

    init();

    return () => {
      cancelled = true;
      world?.dispose();
    };
  }, []);

  return { world, components };
}
