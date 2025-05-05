import { usePlaneHover } from "../usePlaneHover";
import { useSetViewPoint } from "../useSetViewPoint";
import { useCoordinateSystem } from "../useCoordinateSystem";
// import { useFreeControlElements } from "../useFreeControlElements";
import { useSelections } from "../useSelections";

export function useInteractionFeatures({
  worldRef,
  componentRef,
  ifcContainerRef,
  modelRef,
  featureFlags,
}: any) {
  const { isFreeControlElements, isPlaneHover, isFitView, coordinateSysActive } = featureFlags;

  // useFreeControlElements({ isFreeControlElements, componentRef, worldRef, ifcContainerRef, modelRef });
  usePlaneHover({ isPlaneHover, componentRef, worldRef, ifcContainerRef, modelRef });
  useSetViewPoint({ isFitView, worldRef });
  useCoordinateSystem({ coordinateSysActive, worldRef });
  useSelections();

}
