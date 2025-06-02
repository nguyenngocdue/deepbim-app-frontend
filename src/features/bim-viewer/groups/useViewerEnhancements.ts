import { useEffect } from "react";
import { usePlaneViews } from "../usePlaneViews";
import { useWorldSettings } from "../useWorldSettings";
import { useClippingEdges } from "../useClippingEdges";
import { useGrids } from "../useGrid";
import { useCameraType } from "../useCameraType";

interface FeatureFlags {
  haveGrids: boolean;
  havePlansViews: boolean;
  haveWorldSettings: boolean;
  isClippingEdges: boolean;
  isOrthoPerspective: boolean;
}

interface UseViewerEnhancementsProps {
  componentRef: React.RefObject<any>;
  worldRef: React.RefObject<any>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<any>;
  featureFlags: FeatureFlags;
}

/**
 * Hook bật các tính năng viewer: grid, camera, clipping, v.v.
 */
export function useViewerEnhancements({
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
  featureFlags,
}: UseViewerEnhancementsProps) {
  const {
    haveGrids,
    havePlansViews,
    haveWorldSettings,
    isClippingEdges,
    isOrthoPerspective,
  } = featureFlags;

  useEffect(() => {
    useGrids({ haveGrids });

    usePlaneViews({
      havePlansViews,
      componentRef,
      worldRef,
      ifcContainerRef,
      modelRef,
    });

    useWorldSettings({
      haveWorldSettings,
      componentRef,
      worldRef,
    });

    useClippingEdges({
      isClippingEdges,
      componentRef,
      worldRef,
      ifcContainerRef,
    });

    useCameraType({ isOrthoPerspective });
  }, [
    haveGrids,
    havePlansViews,
    haveWorldSettings,
    isClippingEdges,
    isOrthoPerspective,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
  ]);
}
