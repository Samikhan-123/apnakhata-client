'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationPlusProps {
  currentPage: number;
  totalPages: number;
  totalResults?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
}
// pagination component custom feature
export function PaginationPlus({
  currentPage,
  totalPages,
  totalResults,
  limit = 15,
  onPageChange,
  className
}: PaginationPlusProps) {
  const [jumpValue, setJumpValue] = useState('');

  if (totalPages <= 1) return null;

  const handleJump = () => {
    const page = parseInt(jumpValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpValue('');
    }
  };

  const renderPageButtons = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Show 1, 2, 3, ..., totalPages
      pages.push(1, 2, 3, '...', totalPages);
    }
    
    return pages.map((p, idx) => (
      typeof p === 'number' ? (
        <Button
          key={`${p}-${idx}`}
          variant={currentPage === p ? "default" : "ghost"}
          onClick={() => onPageChange(p)}
          className={cn(
            "h-10 w-10 rounded-xl font-black text-[11px] transition-all",
            currentPage === p ? "shadow-lg shadow-primary/20 bg-primary" : "hover:bg-primary/10 hover:text-primary"
          )}
        >
          {p}
        </Button>
      ) : (
        <span key={`dots-${idx}`} className="px-2 text-muted-foreground/30 font-black pt-1">...</span>
      )
    ));
  };

  const startResult = (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalResults || 0);

  return (
    <div className={cn("flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-border/20 px-2", className)}>
      <div className="flex flex-col items-center md:items-start gap-1 group">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Data Navigation</p>
         <p className="text-xs font-bold text-muted-foreground/60 transition-colors group-hover:text-primary/60">
            {totalResults ? (
               <>Showing <span className="text-foreground font-black tabular-nums">{startResult}</span> to <span className="text-foreground font-black tabular-nums">{endResult}</span> of <span className="text-primary font-black tabular-nums">{totalResults}</span> records</>
            ) : (
               <>Page <span className="text-foreground font-black">{currentPage}</span> of <span className="text-foreground font-black">{totalPages}</span></>
            )}
         </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-12 px-5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-20 flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <div className="flex items-center gap-1 bg-muted/20 p-1.5 rounded-[1.5rem] border border-border/40">
          {renderPageButtons()}
        </div>

        <Button
          variant="ghost"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-12 px-5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-20 flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Go to Page Input */}
      <div className="flex items-center gap-4 bg-muted/20 pl-6 pr-2 py-2 rounded-[1.8rem] border border-border/40 group focus-within:border-primary/50 transition-all">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Go to Page</span>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            min={1} 
            max={totalPages}
            className="h-10 w-16 bg-background rounded-xl border-none text-center font-black text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJump();
            }}
            placeholder={String(currentPage)}
          />
          <Button 
            onClick={handleJump}
            className="h-10 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-black uppercase tracking-widest text-[9px] transition-all"
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
