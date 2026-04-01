'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, Search, X, Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
// import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LedgerFiltersProps {
  onFilterChange: (filters: any) => void;
  categories: any[];
  onExport: () => void;
  currentFilters?: any;
}

export function LedgerFilters({ onFilterChange, categories, onExport, currentFilters }: LedgerFiltersProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(currentFilters?.startDate ? { from: new Date(currentFilters.startDate), to: currentFilters.endDate ? new Date(currentFilters.endDate) : undefined } : undefined);
  const [search, setSearch] = React.useState(currentFilters?.search || '');
  const [categoryId, setCategoryId] = React.useState<string>(currentFilters?.categoryId || 'all');
  const [type, setType] = React.useState<string>(currentFilters?.type || 'all');

  const handleApply = React.useCallback((newDate?: DateRange, newSearch?: string, newCat?: string, newType?: string) => {
    const filters: any = {};
    const d = newDate || date;
    const s = newSearch !== undefined ? newSearch : search;
    const c = newCat || categoryId;
    const t = newType || type;

    if (d?.from) filters.startDate = d.from.toISOString();
    if (d?.to) filters.endDate = d.to.toISOString();
    if (s) filters.search = s;
    if (c !== 'all') filters.categoryId = c;
    if (t !== 'all') filters.type = t;
    
    onFilterChange(filters);
  }, [date, search, categoryId, type, onFilterChange]);

  const handleClear = () => {
    setDate(undefined);
    setSearch('');
    setCategoryId('all');
    setType('all');
    onFilterChange({});
  };

  // Sync internal state with props only when they actually change to prevent loops
  React.useEffect(() => {
    const propType = currentFilters?.type || 'all';
    if (propType !== type) setType(propType);

    const propCat = currentFilters?.categoryId || 'all';
    if (propCat !== categoryId) setCategoryId(propCat);

    const propSearch = currentFilters?.search || '';
    if (propSearch !== search) setSearch(propSearch);

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

  // Sync internal state with props
  const isFiltered = !!(date?.from || date?.to || search || (categoryId && categoryId !== 'all') || (type && type !== 'all'));

  // Auto-apply on select changes for "Sleek" feel
  // We use stringified versions to prevent object reference loops
  const dateKey = `${date?.from?.getTime()}-${date?.to?.getTime()}`;
  React.useEffect(() => {
    handleApply();
  }, [type, categoryId, dateKey]);

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4 premium-card p-5 md:p-6 rounded-3xl">

      <div className="flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 justify-start text-left font-semibold rounded-xl border-border/60 hover:bg-muted/50 transition-all px-4 min-w-[180px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              <span className="truncate text-xs">
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from as Date, "MMM dd")} - {format(date.to as Date, "MMM dd")}
                    </>
                  ) : (
                    format(date.from as Date, "MMM dd, yyyy")
                  )
                ) : (
                  "Select Period"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-3xl border border-border shadow-2xl overflow-hidden mt-2" align="start">
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

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-11 w-[130px] rounded-xl border-border/60 font-semibold bg-background hover:bg-muted/30 transition-all text-xs">
            <SelectValue placeholder="All Activity" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-2xl p-1">
            <SelectItem value="all" className="rounded-xl font-medium">All Types</SelectItem>
            <SelectItem value="INCOME" className="rounded-xl font-medium text-emerald-600">Income</SelectItem>
            <SelectItem value="EXPENSE" className="rounded-xl font-medium text-rose-600">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="h-11 w-[160px] rounded-xl border-border/60 font-semibold bg-background hover:bg-muted/30 transition-all text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-2xl p-1">
            <SelectItem value="all" className="rounded-xl font-medium">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-medium">{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="h-11 px-4 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-muted-foreground transition-all active:scale-95 text-xs font-semibold gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}

        <div className="hidden lg:block h-6 w-px bg-border/60 mx-2" />

        <Button 
          onClick={onExport}
          variant="outline"
          className="h-11 rounded-xl gap-2 font-bold px-6 active:scale-95 transition-all text-xs"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
