import { useEffect, useState } from "react";

export function useVisibilityManager(featureFlags: { isVisibleSettings: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(featureFlags.isVisibleSettings);
  }, [featureFlags.isVisibleSettings]);

  return {
    open,
    setOpen,
  };
}
