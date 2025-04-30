import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";


interface UseHighlightSetupProps {
  isHighlightEnabled: boolean;
  components: React.RefObject<OBC.Components>;
  world: React.RefObject<any>;
}



export function useHighlightSetup({
  components,
  world,
}: UseHighlightSetupProps): void {
  // if (!components || !world) return;

  const highlighter = components.get(OBCF.Highlighter);
  highlighter.zoomToSelection = false;
  highlighter.config.edgeThreshold = 0.1;
  highlighter.config.fillColor = 0xff0000;
  highlighter.config.edgeColor = 0x000000
  highlighter.setup({ world: world });
  return highlighter;
}
