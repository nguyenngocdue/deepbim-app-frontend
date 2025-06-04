import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

export function LoadingOverlay({
  open = false,
  message = "Uploading",
  progress = 0,
}: {
  open?: boolean;
  message?: string;
  progress?: number;
}) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setDotCount((c) => (c + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  const brightness = Math.min(1 + progress * 0.7, 1);
  const glowOpacity = progress < 0.8 ? 0.4 : 1;

  const overlay = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      style={{ opacity: brightness, transition: "opacity 0.5s ease-in-out" }}
    >
      <div className="relative w-[360px] px-8 py-6 rounded-2xl shadow-xl bg-[#0f0f1a] text-white border border-purple-700 ring-1 ring-blue-700/40 backdrop-blur-xl">
        <span
          className="absolute inset-0 rounded-2xl pointer-events-none glowing-border"
          style={{
            opacity: glowOpacity,
            transition: "opacity 0.6s ease-in-out",
          }}
        />

        <div className="flex flex-col items-center space-y-5 relative z-10">
          <div className="h-12 w-12 rounded-full animate-spin bg-gradient-to-tr from-purple-700 via-blue-700 to-cyan-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="bg-[#0f0f1a] rounded-full h-full w-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-blue-400" />
            </div>
          </div>

          <div className="text-lg font-semibold tracking-wide text-blue-100 text-center">
            {message}
            <span>{'.'.repeat(dotCount)}</span>
          </div>
          <p className="text-sm text-zinc-400 text-center leading-snug">
            Please wait while we process your request.
            <br />
            Do not close this tab.
          </p>
        </div>
      </div>

      <style>{`
        .glowing-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(140deg, #7c3aed, #3b82f6, #06b6d4);
          background-size: 250% 250%;
          animation: gradient-border 6s ease infinite;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: destination-out;
        }

        @keyframes gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );

  return createPortal(overlay, document.body);
}
