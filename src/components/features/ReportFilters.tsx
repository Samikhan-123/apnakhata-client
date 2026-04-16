'use client';

import React from 'react';
import { Calendar as CalendarIcon, Filter, X, Search, ChevronDown, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from 'react-day-picker';
import { cn, capitalize } from "@/lib/utils";

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters?: any;
}

export const ReportFilters = ({ onFilterChange, currentFilters }: ReportFiltersProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>(
    currentFilters?.startDate 
      ? { from: new Date(currentFilters.startDate), to: currentFilters.endDate ? new Date(currentFilters.endDate) : undefined } 
      : undefined
  );
  const [categoryId, setCategoryId] = React.useState<string>(currentFilters?.categoryId || 'all');
  const [search, setSearch] = React.useState<string>(currentFilters?.search || '');

  // Sync internal state with props only when they actually change to prevent loops
  React.useEffect(() => {
    const propCat = currentFilters?.categoryId || 'all';
    if (propCat !== categoryId) {
      setCategoryId(propCat);
    }
    
    const propSearch = currentFilters?.search || '';
    if (propSearch !== search) {
      setSearch(propSearch);
    }

    const propFrom = currentFilters?.startDate ? new Date(currentFilters.startDate).getTime() : undefined;
    const propTo = currentFilters?.endDate ? new Date(currentFilters.endDate).getTime() : undefined;
    const stateFrom = date?.from?.getTime();
    const stateTo = date?.to?.getTime();

    if (propFrom !== stateFrom || propTo !== stateTo) {
      setDate(currentFilters?.startDate ? { 
        from: new Date(currentFilters.startDate), 
        to: currentFilters.endDate ? new Date(currentFilters.endDate) : undefined 
      } : undefined);
    }
  }, [currentFilters]);

  const handleApply = React.useCallback(() => {
    const filters: any = {};
    if (date?.from) filters.startDate = date.from.toISOString();
    if (date?.to) filters.endDate = date.to.toISOString();
    if (categoryId !== 'all') filters.categoryId = categoryId;
    if (search) filters.search = search;
    
    onFilterChange(filters);
  }, [date, categoryId, search, onFilterChange]);

  const handleClear = () => {
    setDate(undefined);
    setCategoryId('all');
    setSearch('');
    onFilterChange({});
  };

  // Auto-apply on select changes for "Sleek" feel
  // We use stringified versions to prevent object reference loops
  const dateKey = `${date?.from?.getTime()}-${date?.to?.getTime()}`;
  React.useEffect(() => {
    handleApply();
  }, [categoryId, dateKey]);

  const isFiltered = !!(date?.from);

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4 premium-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
      <div className="flex flex-wrap items-center gap-4 w-full">
        {/* Quick Presets - High Interaction */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/20 rounded-2xl border border-border/10 shrink-0 overflow-x-auto no-scrollbar">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const now = new Date();
              setDate({ from: now, to: now });
            }}
            className="px-3 sm:px-4 h-8 sm:h-9 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-tighter hover:bg-background transition-all"
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const now = new Date();
              setDate({ from: new Date(now.getFullYear(), now.getMonth(), 1), to: now });
            }}
            className="px-3 sm:px-4 h-8 sm:h-9 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-tighter hover:bg-background transition-all"
          >
            Month
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const now = new Date();
              setDate({ from: new Date(now.getFullYear(), 0, 1), to: now });
            }}
            className="px-3 sm:px-4 h-8 sm:h-9 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-tighter hover:bg-background transition-all"
          >
            Year
          </Button>
        </div>

        <div className="h-6 w-px bg-border/40 hidden md:block" />

        {/* Temporal Window */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-12 justify-start text-left font-bold rounded-2xl border-none bg-muted/20 hover:bg-muted/40 transition-all px-6 min-w-[220px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
              <span className="truncate text-[11px] uppercase tracking-widest font-black">
                {date?.from ? (
                  date.to ? (
                    <>{format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}</>
                  ) : (
                    format(date.from, "LLL dd, yyyy")
                  )
                ) : (
                  "Select Period"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-3xl border border-border shadow-2xl overflow-hidden mt-4" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="p-4"
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-3 ml-auto">
          {isFiltered && (
            <Button 
              variant="ghost" 
              onClick={handleClear}
              className="h-12 w-12 rounded-2xl hover:bg-rose-500/10 hover:text-rose-600 transition-all border border-transparent hover:border-rose-500/20"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <div className="bg-primary/5 px-6 h-12 rounded-2xl flex items-center gap-3 border border-primary/10">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Filters Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
