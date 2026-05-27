export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-[100]">
      <div className="text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest text-xs animate-pulse">
        Loading...
      </div>
    </div>
  );
}
