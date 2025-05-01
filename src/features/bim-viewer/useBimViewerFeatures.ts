import { useMeasurementFeatures } from "./groups/useMeasurementFeatures";
import { useViewerEnhancements } from "./groups/useViewerEnhancements";
import { useInteractionFeatures } from "./groups/useInteractionFeatures";
import { FeatureFlags } from "@/props/FeatureFlags";

export function useBimViewerFeatures({
  worldRef,
  componentRef,
  ifcContainerRef,
  modelRef,
  isWorldReady,
  featureFlags,
}: {
  worldRef: any;
  componentRef: any;
  ifcContainerRef: any;
  modelRef: any;
  isWorldReady: boolean;
  featureFlags: FeatureFlags;
}) {
  useMeasurementFeatures({ isWorldReady, componentRef, worldRef, ifcContainerRef, modelRef, featureFlags });
  useViewerEnhancements({ isWorldReady, componentRef, worldRef, ifcContainerRef, modelRef, featureFlags });
  useInteractionFeatures({ worldRef, componentRef, ifcContainerRef, modelRef, featureFlags });
}


