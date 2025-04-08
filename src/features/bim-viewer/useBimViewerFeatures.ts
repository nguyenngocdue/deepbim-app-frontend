import { useMeasurementFeatures } from "./groups/useMeasurementFeatures";
import { useViewerEnhancements } from "./groups/useViewerEnhancements";
import { useInteractionFeatures } from "./groups/useInteractionFeatures";

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

export type FeatureFlags = {
  isClippingEdges: boolean;
  isEdgeMeasurement: boolean;
  isFaceMeasurement: boolean;
  haveGrids: boolean;
  hasVolumeMeasurement: boolean;
  havePlansViews: boolean;
  haveLengthMeasurements: boolean;
  haveAreaMeasureElements: boolean;
  haveAngleMeasurements: boolean;
  haveWorldSettings: boolean;
  sectionActive: boolean;
  isFreeControlElements: boolean;
  isPlaneHover: boolean;
  isFitView: boolean;
  coordinateSysActive: boolean;
  isIsolation: boolean;
};
