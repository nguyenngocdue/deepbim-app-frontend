import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function LoadingOverlay({ open = false, message = "Loading" }) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setDotCount((c) => (c + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2.5px] transition-all animate-fadein">
      <div className="flex flex-col items-center gap-4 px-10 py-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white/95 via-zinc-100/95 to-zinc-200/90 dark:from-zinc-900/90 dark:to-zinc-800/90 border border-gray-200 dark:border-zinc-700 relative">
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-blue-200/50 via-violet-200/40 to-fuchsia-200/30 dark:from-blue-900/20 dark:via-violet-900/20 dark:to-fuchsia-900/20 blur-xl opacity-60 pointer-events-none"></div>
        <Loader2 className="h-12 w-12 animate-spin text-primary drop-shadow-md" />
        <span className="text-lg font-semibold tracking-wide text-zinc-700 dark:text-zinc-100 drop-shadow-sm">
          {message}
          <span>
            {'.'.repeat(dotCount)}
            <span style={{ opacity: 0 }}>{'.'.repeat(3 - dotCount)}</span>
          </span>
        </span>
      </div>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadein {
          animation: fadein 0.22s cubic-bezier(.38,1.15,.74,1.02);
        }
      `}</style>
    </div>
  );
}
