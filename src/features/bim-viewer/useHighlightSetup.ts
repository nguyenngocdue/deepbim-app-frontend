import * as OBCF from "@thatopen/components-front";


interface UseHighlightSetupProps {
  isHighlightEnabled: boolean;
  components: React.RefObject<any>;
  world: React.RefObject<any>;
}



export function useHighlightSetup({
  isHighlightEnabled,
  components,
  world,
}: UseHighlightSetupProps): void {
  if (!components || !world) return;

  const highlighter = components.get(OBCF.Highlighter);
  highlighter.zoomToSelection = true;
  highlighter.config.edgeThreshold = 0.1;
  highlighter.config.fillColor = 0xff0000;
  highlighter.config.edgeColor = 0x000000
  highlighter.setup({ world: world });
  
}
