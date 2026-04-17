'use client';

import React from 'react';
import { MonthYearPicker } from './MonthYearPicker';
import { cn, capitalize } from "@/lib/utils";
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters?: any;
}

export const ReportFilters = ({ onFilterChange, currentFilters }: ReportFiltersProps) => {
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentFilters?.startDate ? new Date(currentFilters.startDate).getMonth() + 1 : new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = React.useState(
    currentFilters?.startDate ? new Date(currentFilters.startDate).getFullYear() : new Date().getFullYear()
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

    const propFrom = currentFilters?.startDate ? new Date(currentFilters.startDate) : undefined;
    
    if (propFrom) {
      const pMonth = propFrom.getMonth() + 1;
      const pYear = propFrom.getFullYear();
      if (pMonth !== selectedMonth) setSelectedMonth(pMonth);
      if (pYear !== selectedYear) setSelectedYear(pYear);
    }
  }, [currentFilters]);

  const handleApply = React.useCallback(() => {
    const filters: any = {};
    
    // Calculate range based on month selection (0 = Whole Year)
    let startDate: Date;
    let endDate: Date;

    if (selectedMonth === 0) {
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
    } else {
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
    }

    filters.startDate = startDate.toISOString();
    filters.endDate = endDate.toISOString();

    if (categoryId !== 'all') filters.categoryId = categoryId;
    if (search) filters.search = search;
    
    onFilterChange(filters);
  }, [selectedMonth, selectedYear, categoryId, search, onFilterChange]);

  const handleClear = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    setCategoryId('all');
    setSearch('');
    onFilterChange({});
  };

  React.useEffect(() => {
    handleApply();
  }, [categoryId, selectedMonth, selectedYear]);

  const now = new Date();
  const isFiltered = !!(selectedMonth !== (now.getMonth() + 1) || selectedYear !== now.getFullYear());

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center gap-4 premium-card p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <MonthYearPicker 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear} 
          onChange={(m, y) => {
            setSelectedMonth(m);
            setSelectedYear(y);
          }}
        />

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
