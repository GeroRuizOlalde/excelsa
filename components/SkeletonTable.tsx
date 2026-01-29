export function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded flex-1"></div>
          <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded w-24"></div>
          <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}