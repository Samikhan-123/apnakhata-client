import { Skeleton } from "./Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-10 w-full animate-in fade-in duration-500 max-h-screen overflow-hidden">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-5 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </header>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="premium-card rounded-3xl p-6 h-36 flex flex-col justify-between border-border/10"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-3.5 w-20 rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-32 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="premium-card rounded-[2.5rem] p-6 md:p-8 space-y-6 border-border/10">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-3.5 w-48 rounded-md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-xl" />
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-[320px] w-full rounded-2xl" />
      </div>

      {/* List Skeleton Removed because dashboard doesn't display it */}
    </div>
  );
}
