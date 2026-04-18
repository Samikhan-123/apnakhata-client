'use client';

import React from 'react';
import { MonthYearPicker } from './MonthYearPicker';
import { cn, capitalize } from "@/lib/utils";
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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
  const isSyncingFromProps = React.useRef(false);

  const handleApply = React.useCallback(() => {
    const filters: any = {};
    
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
    isSyncingFromProps.current = true;
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    setCategoryId('all');
    setSearch('');
    
    setTimeout(() => {
      isSyncingFromProps.current = false;
      onFilterChange({});
    }, 50);
  };

  // Sync internal state with props
  React.useEffect(() => {
    isSyncingFromProps.current = true;
    
    const propCat = currentFilters?.categoryId || 'all';
    if (propCat !== categoryId) setCategoryId(propCat);

    const propSearch = currentFilters?.search || '';
    if (propSearch !== search) setSearch(propSearch);

    if (currentFilters?.startDate) {
      const propFrom = new Date(currentFilters.startDate);
      const pMonth = propFrom.getMonth() + 1;
      const pYear = propFrom.getFullYear();
      if (propFrom.getDate() === 1) {
        if (pMonth !== selectedMonth) setSelectedMonth(pMonth);
        if (pYear !== selectedYear) setSelectedYear(pYear);
      }
    }

    setTimeout(() => {
      isSyncingFromProps.current = false;
    }, 100);
  }, [currentFilters]);

  // Auto-apply trigger
  React.useEffect(() => {
    if (!isSyncingFromProps.current) {
      handleApply();
    }
  }, [categoryId, selectedMonth, selectedYear, search, handleApply]);

  const now = new Date();
  const isFiltered = !!(selectedMonth !== (now.getMonth() + 1) || selectedYear !== now.getFullYear() || categoryId !== 'all' || search);

  const getActiveChips = () => {
    const chips: { key: string; label: string; value: string }[] = [];
    if (categoryId !== 'all') chips.push({ key: 'categoryId', label: 'Category', value: capitalize(categoryId.split('_').join(' ')) });
    if (search) chips.push({ key: 'search', label: 'Search', value: `"${search}"` });
    
    const isDefaultDate = selectedMonth === (now.getMonth() + 1) && selectedYear === now.getFullYear();
    if (!isDefaultDate) {
      const monthLabel = selectedMonth === 0 ? 'Full Year' : format(new Date(selectedYear, selectedMonth - 1), 'MMMM');
      chips.push({ key: 'date', label: 'Period', value: `${monthLabel} ${selectedYear}` });
    }
    return chips;
  };

  const removeChip = (key: string) => {
    if (key === 'categoryId') setCategoryId('all');
    else if (key === 'search') setSearch('');
    else if (key === 'date') {
      setSelectedMonth(now.getMonth() + 1);
      setSelectedYear(now.getFullYear());
    }
  };

  return (
    <div className="flex flex-col premium-card p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-border/10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <MonthYearPicker 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            onChange={(m, y) => {
              setSelectedMonth(m);
              setSelectedYear(y);
            }}
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="bg-primary/5 px-6 h-12 rounded-2xl flex items-center gap-3 border border-primary/10">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              {isFiltered ? 'Analysis Customized' : 'Standard View'}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFiltered && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-border/10 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                <Filter size={12} className="text-primary/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Custom Analysis Overrides</span>
              </div>
              
              {getActiveChips().map((chip) => (
                <Badge 
                  key={chip.key}
                  variant="secondary" 
                  className="h-8 pl-3 pr-1 gap-2 rounded-xl bg-primary/5 border-primary/5 text-primary font-bold hover:bg-primary/10 transition-colors group"
                >
                  <span className="text-[10px] opacity-40 uppercase font-black">{chip.label}:</span>
                  <span className="text-xs">{chip.value}</span>
                  <button onClick={() => removeChip(chip.key)} className="p-1 hover:bg-primary/20 rounded-md transition-colors">
                    <X size={12} />
                  </button>
                </Badge>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/5 transition-all gap-2 ml-auto"
              >
                <RotateCcw size={12} />
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
