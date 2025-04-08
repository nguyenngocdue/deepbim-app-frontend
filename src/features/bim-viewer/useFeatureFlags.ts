import { useMemo } from "react";
import { FeatureFlags } from "@/features/bim-viewer/useBimViewerFeatures";

export function useFeatureFlags(flags: FeatureFlags) {
  return useMemo(() => ({ ...flags }), [JSON.stringify(flags)]);
}
