import { Skeleton } from "./Skeleton";

export function LedgerSkeleton() {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-5 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="premium-card rounded-2xl p-5 h-28 flex flex-col justify-between border-border/20">
            <div className="flex justify-between items-start">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 py-2">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg ml-auto" />
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-muted/20 border border-transparent flex items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                 <Skeleton className="h-12 w-12 rounded-xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-40 rounded-md" />
                   <Skeleton className="h-3 w-24 rounded-md" />
                 </div>
               </div>
               <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
