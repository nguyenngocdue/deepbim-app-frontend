import ReactPlayer from "react-player";

interface PlayerProps {
  videoUrl: string;
}

export default function Player({ videoUrl }: PlayerProps) {
  const isValid = !!videoUrl;

  return (
    <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
      {isValid ? (
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          playing={false}
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-xl text-center p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col items-center justify-between space-y-6">
            {/* Logo + DeepBIM */}
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

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Please select a lesson to get started
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Choose a lesson from the sidebar to begin learning.<br className="hidden sm:inline" />
                We're excited to help you grow!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
