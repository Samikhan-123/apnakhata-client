import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export function LedgerSkeleton() {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 md:h-14 w-48 md:w-80 rounded-2xl" />
          <Skeleton className="h-4 md:h-5 w-64 md:w-[450px] rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full md:w-44 rounded-xl shrink-0" />
      </header>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="premium-card rounded-2xl p-5 h-28 flex flex-col justify-between border-border/10">
            <div className="flex justify-between items-start">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1 text-right">
                <Skeleton className="h-2 w-16 ml-auto rounded-full" />
                <Skeleton className="h-2 w-10 ml-auto rounded-full" />
              </div>
            </div>
            <Skeleton className="h-7 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Unified Filters Skeleton (Matched to LedgerFilters) */}
      <div className="premium-card p-5 md:p-6 rounded-3xl border border-border/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <Skeleton className="h-11 w-36 rounded-xl" /> {/* Month Picker */}
             <Skeleton className="h-11 w-32 rounded-xl" /> {/* Type Select */}
             <Skeleton className="h-11 w-40 rounded-xl" /> {/* Category Select */}
          </div>
          <Skeleton className="h-11 w-44 rounded-xl" /> {/* Export Button */}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
           <Skeleton className="h-7 w-40 rounded-lg" />
           <div className="bg-muted/10 p-1 rounded-xl border border-border/10 flex gap-2">
             <Skeleton className="h-8 w-24 rounded-lg" />
             <Skeleton className="h-8 w-24 rounded-lg" />
             <Skeleton className="h-8 w-24 rounded-lg" />
           </div>
        </div>

        {/* List Skeleton (Limited to Top 5 - Viewport Focused) */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="premium-card rounded-2xl p-2.5 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 border-border/10">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 sm:w-48 rounded-md" />
                  <Skeleton className="h-3 w-20 sm:w-32 rounded-md" />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-8 ml-auto">
                 <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                 </div>
                 <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
