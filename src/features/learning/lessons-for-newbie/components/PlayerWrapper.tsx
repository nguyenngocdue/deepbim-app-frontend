export function PlayerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-xl text-center p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl border border-white/10 flex flex-col items-center justify-between space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}