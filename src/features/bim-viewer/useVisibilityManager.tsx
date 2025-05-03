import { useEffect, useState } from "react";

export function useVisibilityManager( flag: boolean ) {
  const [open, setOpen] = useState(flag);
  
  useEffect(() => {
    setOpen(flag);
  }, [flag]);
  
  return {
    open,
    setOpen,
  };
}
