// src/features/bim-viewer/useSectionBox.ts

interface UseSectionBoxProps {
    sectionActive: boolean;
    viewerRef: React.RefObject<any>;
    sceneRef: React.RefObject<any>;
  }
  
  export function useSectionBox({
    sectionActive,
    viewerRef,
    sceneRef,
  }: UseSectionBoxProps): void {
    if (sectionActive && viewerRef.current && sceneRef.current) {
      // TODO: Setup section box logic here
      console.log("Section box enabled");
    }
  }
  