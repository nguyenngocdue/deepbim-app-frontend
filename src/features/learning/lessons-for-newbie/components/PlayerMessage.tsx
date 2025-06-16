export function PlayerMessage({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { text: string; href: string };
}) {
  return (
    <>
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
          alt="Illustration"
          className="max-h-[220px] object-contain"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h1 className="text-lg sm:text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">{description}</p>
        {action && (
          <a
            href={action.href}
            className="inline-block mt-4 px-6 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            {action.text}
          </a>
        )}
      </div>
    </>
  );
}