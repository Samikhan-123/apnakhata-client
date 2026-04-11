import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export function LedgerSkeleton() {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 md:h-14 w-40 md:w-64 rounded-2xl" />
          <Skeleton className="h-4 md:h-5 w-60 md:w-96 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full md:w-44 rounded-xl shrink-0" />
      </header>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="premium-card rounded-2xl p-5 h-28 flex flex-col justify-between border-border/20">
            <div className="flex justify-between items-start">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
            <Skeleton className="h-7 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Filters Skeleton (Mirroring LedgerFilters) */}
      <div className="premium-card p-5 md:p-6 rounded-3xl flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          <Skeleton className="h-11 w-full md:w-[200px] rounded-xl" />
          <Skeleton className="h-11 w-24 md:w-32 rounded-xl" />
          <Skeleton className="h-11 w-32 md:w-40 rounded-xl" />
          <div className="hidden lg:block h-6 w-px bg-border/40 mx-2" />
          <Skeleton className="h-11 w-32 rounded-xl ml-auto md:ml-0" />
        </div>
      </div>

      {/* Recent Activity Header & Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
           <Skeleton className="h-7 w-40 rounded-lg" />
           <div className="bg-muted/10 p-1 rounded-xl border border-border/10 flex gap-2">
             <Skeleton className="h-8 w-24 rounded-lg" />
             <Skeleton className="h-8 w-24 rounded-lg" />
             <Skeleton className="h-8 w-24 rounded-lg" />
           </div>
        </div>

        {/* List Skeleton (Mirroring LedgerEntryList items) */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="premium-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border-border/40">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32 sm:w-48 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md hidden sm:block" />
                  </div>
                  <Skeleton className="h-3 w-24 sm:w-32 rounded-md" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-6 w-20 sm:w-28 rounded-lg" />
                <Skeleton className="h-3 w-12 rounded-md hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
