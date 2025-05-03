import { useMeasurementFeatures } from "./groups/useMeasurementFeatures";
import { useViewerEnhancements } from "./groups/useViewerEnhancements";
import { useInteractionFeatures } from "./groups/useInteractionFeatures";
import { FeatureFlags } from "@/props/FeatureFlags";

export function useBimViewerFeatures({
  worldRef,
  componentRef,
  ifcContainerRef,
  modelRef,
  featureFlags,
}: {
  worldRef: any;
  componentRef: any;
  ifcContainerRef: any;
  modelRef: any;
  featureFlags: FeatureFlags;
}) {
  useMeasurementFeatures({ componentRef, worldRef, ifcContainerRef, modelRef, featureFlags });
  useViewerEnhancements({ componentRef, worldRef, ifcContainerRef, modelRef, featureFlags });
  useInteractionFeatures({ worldRef, componentRef, ifcContainerRef, modelRef, featureFlags });
}


