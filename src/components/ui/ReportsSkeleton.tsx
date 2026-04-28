import { Skeleton } from "./Skeleton";

export function ReportsSkeleton() {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 md:h-14 w-48 md:w-96 rounded-2xl" />
          <Skeleton className="h-4 md:h-5 w-64 md:w-[500px] rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full md:w-48 rounded-xl shrink-0" />
      </div>

      {/* Filter Row Skeleton */}
      <div className="premium-card p-5 md:p-8 rounded-[2rem] border border-border/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <Skeleton className="h-12 w-36 rounded-2xl" /> {/* Month Picker */}
          <div className="h-12 w-48 rounded-2xl bg-primary/5 border border-primary/10 flex items-center px-6 gap-3 ml-auto">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* 4 Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="premium-card p-6 rounded-[2rem] border border-border/10 h-36 flex flex-col justify-between"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-20 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Engine Meta Row */}
      <div className="bg-primary/5 h-12 w-full lg:w-[450px] rounded-2xl border border-primary/10 flex items-center px-6 gap-3">
        <Skeleton className="h-3.5 w-3.5 rounded-full" />
        <Skeleton className="h-3 w-64 rounded-full" />
      </div>

      {/* Charts & Tips Wrapper */}
      <div className="grid grid-cols-1 gap-10">
        {/* Large Chart Placeholder */}
        <div className="premium-card h-[450px] rounded-[3rem] border border-border/10 p-8 flex flex-col gap-6">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <div className="flex-1 w-full flex items-end gap-4 px-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-lg"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
        </div>

        {/* Smart Tips Placeholder */}
        <Skeleton className="h-40 w-full rounded-[2.5rem]" />
      </div>
    </div>
  );
}
