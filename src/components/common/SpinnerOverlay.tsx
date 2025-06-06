import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function SpinnerOverlay({
  message = "Loading",
  show = true,
}: {
  message?: string;
  show?: boolean;
}) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setDotCount((c) => (c + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 px-4 py-3 bg-[#0f0f1a] rounded-xl border border-blue-800 shadow-md text-white">
        <div className="h-10 w-10 rounded-full animate-spin bg-gradient-to-tr from-purple-700 via-blue-700 to-cyan-600 p-[2px] shadow-lg shadow-cyan-500/20">
          <div className="bg-[#0f0f1a] rounded-full h-full w-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-blue-300" />
          </div>
        </div>
        <div className="text-sm text-blue-100 font-medium">{message}
          <span>{'.'.repeat(dotCount)}</span>
        </div>
      </div>
    </div>
  );
}
