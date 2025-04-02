import { useEffect } from "react";
import { usePlaneViews } from "../usePlaneViews";
import { useWorldSettings } from "../useWorldSettings";
import { useClippingEdges } from "../useClippingEdges";
import { useGrids } from "../useGrid";
import { useCameraType } from "../useCameraType";

export function useViewerEnhancements({
  isWorldReady,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
  featureFlags,
}: any) {
  const { haveGrids, havePlansViews, haveWorldSettings, isClippingEdges, isOrthoPerspective} = featureFlags;

  useEffect(() => {
    if (!isWorldReady) return;
    useGrids({ haveGrids });
    usePlaneViews({ havePlansViews, componentRef, worldRef, ifcContainerRef, modelRef });
    useWorldSettings({ haveWorldSettings, componentRef, worldRef });
    useClippingEdges({isClippingEdges , componentRef, worldRef, ifcContainerRef });
    useCameraType({isOrthoPerspective});
  }, [isWorldReady, haveGrids, havePlansViews, haveWorldSettings, isClippingEdges, isOrthoPerspective]);
}
