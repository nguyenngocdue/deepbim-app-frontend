import ReactPlayer from "react-player";
import { Lesson } from "./Type";
import { LoadingState } from "@/components/common/LoadingState";

interface PlayerProps {
  videoUrl: string;
  selectedLesson?: Lesson | null;
}

export default function Player({ videoUrl, selectedLesson }: PlayerProps) {
  const isValid = !!videoUrl;

  // CASE 0: still loading (selectedLesson === null)
  if (selectedLesson === null) {
    return <LoadingState />;
  }
  

  // CASE 1: no lesson selected yet (undefined)
  if (selectedLesson === undefined) {
    return (
      <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-xl text-center p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col items-center justify-between space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://minio.deepbim.net:9000/deepbim-fe/1749531131956-logo_no_bg.png"
                alt="DeepBIM Logo"
                className="w-20 sm:w-24 h-auto object-contain animate-soft-bounce"
              />
              <span className="mt-2 text-2xl sm:text-3xl font-semibold tracking-wide text-white">
                DeepBIM
              </span>
            </div>

            {/* Illustration */}
            <div className="w-full flex justify-center">
              <img
                src="https://minio.deepbim.net:9000/deepbim-fe/1749532142227-website-maintenance.png"
                alt="Maintenance Illustration"
                className="max-h-[220px] object-contain"
              />
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Please select a lesson to get started
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Choose a lesson from the sidebar to begin learning.
                <br className="hidden sm:inline" />
                We're excited to help you grow!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: lesson is locked
  if (selectedLesson.is_locked) {
    return (
      <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-xl text-center p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col items-center justify-between space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <img
                src="https://minio.deepbim.net:9000/deepbim-fe/1749531131956-logo_no_bg.png"
                alt="DeepBIM Logo"
                className="w-20 sm:w-24 h-auto object-contain animate-soft-bounce"
              />
              <span className="mt-2 text-2xl sm:text-3xl font-semibold tracking-wide text-white">
                DeepBIM
              </span>
            </div>

            {/* Illustration */}
            <div className="w-full flex justify-center">
              <img
                src="https://minio.deepbim.net:9000/deepbim-fe/1749532142227-website-maintenance.png"
                alt="Subscription Illustration"
                className="max-h-[220px] object-contain"
              />
            </div>

            {/* Subscribe Prompt */}
            <div className="space-y-2">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Subscribe to Unlock This Lesson
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                This lesson is locked. Subscribe now to access this content and continue your learning journey!
              </p>
              <a
                href="/subscribe"
                className="inline-block mt-4 px-6 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              >
                Subscribe Now
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: valid video
  if (isValid) {
    return (
      <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          playing={false}
          className="w-full h-full"
        />
      </div>
    );
  }

  // CASE 4: fallback - invalid video
  return (
    <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-xl text-center p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col items-center justify-between space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <img
              src="https://minio.deepbim.net:9000/deepbim-fe/1749531131956-logo_no_bg.png"
              alt="DeepBIM Logo"
              className="w-20 sm:w-24 h-auto object-contain animate-soft-bounce"
            />
            <span className="mt-2 text-2xl sm:text-3xl font-semibold tracking-wide text-white">
              DeepBIM
            </span>
          </div>

          {/* Illustration */}
          <div className="w-full flex justify-center">
            <img
              src="https://minio.deepbim.net:9000/deepbim-fe/1749532142227-website-maintenance.png"
              alt="Error Illustration"
              className="max-h-[220px] object-contain"
            />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              Invalid Video
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              The video for this lesson is not available or has been removed. Please try a different lesson or contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
