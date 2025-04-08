import { useEffect, useRef } from "react";

export function useViewerLoop(rendererRef: React.MutableRefObject<any>) {
  const needsUpdateRef = useRef(true);
  const isLoopRunningRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);

  const animate = () => {
    if (!needsUpdateRef.current || !rendererRef.current?.renderer) {
      isLoopRunningRef.current = false;
      return;
    }
    const t0 = performance.now();
    rendererRef.current.renderer.update();
    const t1 = performance.now();
    if (t1 - t0 > 16) console.warn(`[Perf] Frame took ${Math.round(t1 - t0)}ms`);

    needsUpdateRef.current = false;
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const markDirty = () => {
    needsUpdateRef.current = true;
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      animationIdRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const handleInteraction = () => markDirty();
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("wheel", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  return { markDirty };
}
