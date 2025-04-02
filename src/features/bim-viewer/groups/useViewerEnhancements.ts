import { useEffect } from "react";
import { usePlaneViews } from "../usePlaneViews";
import { useWorldSettings } from "../useWorldSettings";
import { useClippingEdges } from "../useClippingEdges";

export function useViewerEnhancements({
  isWorldReady,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
  featureFlags,
}: any) {
  const { haveGrids, havePlansViews, haveWorldSettings, isClippingEdges} = featureFlags;

  useEffect(() => {
    if (!isWorldReady) return;
    // useGrids({ haveGrids, worldGridRef });
    usePlaneViews({ havePlansViews, componentRef, worldRef, ifcContainerRef, modelRef });
    useWorldSettings({ haveWorldSettings, componentRef, worldRef, ifcContainerRef, modelRef });
    useClippingEdges({isClippingEdges , componentRef, worldRef, ifcContainerRef });
  }, [isWorldReady, haveGrids, havePlansViews, haveWorldSettings, isClippingEdges]);
}
