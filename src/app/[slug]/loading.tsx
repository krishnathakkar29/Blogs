
export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <div className="h-10 w-3/4 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
      </div>
      <hr className="border-zinc-800" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
      </div>
    </div>
  );
}