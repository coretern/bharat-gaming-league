export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-neon-purple border-b-transparent rounded-full animate-spin-slow"></div>
      </div>
      <h2 className="mt-8 text-xl font-black italic uppercase tracking-[0.3em] text-white animate-pulse">
        Entering <span className="text-neon-cyan">Arena</span>
      </h2>
    </div>
  );
}
