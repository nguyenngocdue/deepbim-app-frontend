// src/features/bim-viewer/useCoordinateSystem.ts

interface UseCoordinateSystemProps {
    coordinateSysActive: boolean;
    viewerRef: React.RefObject<any>;
  }
  
  export function useCoordinateSystem({
    coordinateSysActive,
    viewerRef,
  }: UseCoordinateSystemProps): void {
    if (coordinateSysActive && viewerRef.current) {
      // TODO: Setup coordinate system logic here
      console.log("Coordinate system enabled");
    }
  }
  