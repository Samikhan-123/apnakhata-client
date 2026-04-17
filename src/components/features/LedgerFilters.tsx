'use client';

import { MonthYearPicker } from './MonthYearPicker';
import { Button } from '@/components/ui/button';

// import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { FileSpreadsheet, FileText, Download, X } from 'lucide-react';
import React from 'react';

interface LedgerFiltersProps {
  onFilterChange: (filters: any) => void;
  categories: any[];
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  currentFilters?: any;
}

export function LedgerFilters({ onFilterChange, categories, onExport, currentFilters }: LedgerFiltersProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentFilters?.startDate ? new Date(currentFilters.startDate).getMonth() + 1 : new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = React.useState(
    currentFilters?.startDate ? new Date(currentFilters.startDate).getFullYear() : new Date().getFullYear()
  );
  const [search, setSearch] = React.useState(currentFilters?.search || '');
  const [categoryId, setCategoryId] = React.useState<string>(currentFilters?.categoryId || 'all');
  const [type, setType] = React.useState<string>(currentFilters?.type || 'all');
  const [isMobile, setIsMobile] = React.useState(false);
  const isSyncingFromProps = React.useRef(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleApply = React.useCallback((newMonth?: number, newYear?: number, newSearch?: string, newCat?: string, newType?: string) => {
    const filters: any = {};
    const m = newMonth !== undefined ? newMonth : selectedMonth;
    const y = newYear !== undefined ? newYear : selectedYear;
    const s = newSearch !== undefined ? newSearch : search;
    const c = newCat || categoryId;
    const t = newType || type;

    // Calculate range based on month selection (0 = Whole Year)
    let startDate: Date;
    let endDate: Date;

    if (m === 0) {
      startDate = new Date(y, 0, 1);
      endDate = new Date(y, 11, 31, 23, 59, 59, 999);
    } else {
      startDate = new Date(y, m - 1, 1);
      endDate = new Date(y, m, 0, 23, 59, 59, 999);
    }

    filters.startDate = startDate.toISOString();
    filters.endDate = endDate.toISOString();

    if (s) filters.search = s;
    if (c !== 'all') filters.categoryId = c;
    if (t !== 'all') filters.type = t;
    
    onFilterChange(filters);
  }, [selectedMonth, selectedYear, search, categoryId, type, onFilterChange]);

  const handleClear = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    setSearch('');
    setCategoryId('all');
    setType('all');
    onFilterChange({});
  };

  // Sync internal state with props only when they actually change to prevent loops
  React.useEffect(() => {
    isSyncingFromProps.current = true;
    
    const propType = currentFilters?.type || 'all';
    if (propType !== type) setType(propType);

    const propCat = currentFilters?.categoryId || 'all';
    if (propCat !== categoryId) setCategoryId(propCat);

    const propSearch = currentFilters?.search || '';
    if (propSearch !== search) setSearch(propSearch);

    const propFrom = currentFilters?.startDate ? new Date(currentFilters.startDate) : undefined;
    
    if (propFrom) {
      const pMonth = propFrom.getMonth() + 1;
      const pYear = propFrom.getFullYear();
      if (pMonth !== selectedMonth) setSelectedMonth(pMonth);
      if (pYear !== selectedYear) setSelectedYear(pYear);
    }

    // Reset syncing flag after a short delay to allow effects to run
    setTimeout(() => {
      isSyncingFromProps.current = false;
    }, 50);
  }, [currentFilters]);

  const now = new Date();
  const isFiltered = !!(search || (categoryId && categoryId !== 'all') || (type && type !== 'all') || 
    selectedMonth !== (now.getMonth() + 1) || selectedYear !== now.getFullYear());

  // Auto-apply on select changes for "Sleek" feel
  React.useEffect(() => {
    if (!isSyncingFromProps.current) {
      handleApply();
    }
  }, [type, categoryId, selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4 premium-card p-5 md:p-6 rounded-3xl">

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <MonthYearPicker 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear} 
          onChange={(m, y) => {
            setSelectedMonth(m);
            setSelectedYear(y);
          }}
        />

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="h-11 rounded-xl gap-2 font-bold px-6 active:scale-95 transition-all text-xs border-primary/20 hover:border-primary/40 text-primary bg-primary/5"
            >
              <Download className="h-4 w-4" />
              Export Records
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 shadow-2xl border-border/40">
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Choose Format</DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem 
              onClick={() => onExport('excel')}
              className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer data-[highlighted]:bg-muted/50"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Excel Records (.xls)</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => onExport('pdf')}
              className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer data-[highlighted]:bg-muted/50"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Statement PDF (.pdf)</span>
                <span className="text-[9px] font-medium text-muted-foreground uppercase"></span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
