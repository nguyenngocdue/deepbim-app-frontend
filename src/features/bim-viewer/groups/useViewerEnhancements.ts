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

export function useViewerEnhancements({
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
  featureFlags,
}: UseViewerEnhancementsProps) {
  useGrids({ haveGrids: featureFlags.haveGrids });

  usePlaneViews({
    havePlansViews: featureFlags.havePlansViews,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
  });

  useWorldSettings({
    haveWorldSettings: featureFlags.haveWorldSettings,
    componentRef,
    worldRef,
    
  });

  useClippingEdges({
    isClippingEdges: featureFlags.isClippingEdges,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef
  });

  useCameraType({ isOrthoPerspective: featureFlags.isOrthoPerspective });
}
