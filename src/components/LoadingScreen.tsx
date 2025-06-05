import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  logoSrc?: string;
  message?: string;
  progress?: number;
}

export function LoadingScreen({
  logoSrc = "/logo.png",
  message = "Welcome to DeepBIM",
  progress = 0,
}: LoadingScreenProps) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const overlay = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="relative w-[380px] px-8 py-6 rounded-3xl shadow-2xl border border-blue-500/30 bg-white/5 backdrop-blur-md">
        {/* Animated border glow */}
        <span className="absolute inset-0 rounded-3xl pointer-events-none border-glow" />

        <div className="flex flex-col items-center space-y-5 relative z-10">
          {/* Logo */}
          {logoSrc && (
            <img
              src={logoSrc}
              alt="Logo"
              className="w-20 h-20 object-contain animate-soft-bounce drop-shadow-lg"
            />
          )}

          {/* Spinner */}
          <div className="h-14 w-14 rounded-full animate-spin bg-gradient-to-tr from-purple-700 via-blue-700 to-cyan-500 p-[2px] shadow-xl">
            <div className="bg-[#0f172a] rounded-full h-full w-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-cyan-300" />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-xl font-semibold tracking-wide text-blue-100 text-center">
            {message}
            <span>{'.'.repeat(dotCount)}</span>
          </h2>

          {/* Sub text */}
          <p className="text-sm text-zinc-400 text-center leading-snug max-w-[300px]">
            We're preparing your experience. Please wait a moment and do not close the window.
          </p>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(120deg, #7c3aed, #3b82f6, #06b6d4);
          background-size: 400% 400%;
          animation: borderGradient 6s ease infinite;
          mask: 
            linear-gradient(#000 0 0) content-box, 
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: destination-out;
        }

        @keyframes borderGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes softBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-soft-bounce {
          animation: softBounce 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

  return createPortal(overlay, document.body);
}
