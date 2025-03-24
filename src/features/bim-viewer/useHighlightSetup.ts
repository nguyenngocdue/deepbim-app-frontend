// src/features/useHighlightSetup.ts
import * as OBCF from "@thatopen/components-front";

interface UseHighlightSetupProps {
    isHighlightEnabled: boolean;
    componentRef: React.RefObject<any>;
    worldRef: React.RefObject<any>;
}

export function useHighlightSetup({
    isHighlightEnabled,
    componentRef,
    worldRef
  }: UseHighlightSetupProps): void {
    if (isHighlightEnabled && componentRef.current) {
      const highlighter = componentRef.current.get(OBCF.Highlighter);
      if (highlighter) {
        highlighter.setup({ world: worldRef.current });
        highlighter.zoomToSelection = true;
      }
    }
  }
  