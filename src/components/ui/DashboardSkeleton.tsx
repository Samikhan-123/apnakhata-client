import { Skeleton } from "./Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-12 pb-20 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-5 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </header>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="premium-card rounded-3xl p-7 h-40 flex flex-col justify-between border-border/20">
            <div className="flex justify-between items-start">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="premium-card rounded-[2.5rem] p-8 space-y-8 border-border/20">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
        <Skeleton className="h-[350px] w-full rounded-2xl" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-muted/20 border border-transparent flex items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                 <Skeleton className="h-12 w-12 rounded-xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-5 w-32 rounded-md" />
                   <Skeleton className="h-3.5 w-20 rounded-md" />
                 </div>
               </div>
               <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
