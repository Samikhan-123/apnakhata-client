'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MonthYearPickerProps {
  selectedMonth: number; // 0 for All Year, 1-12 for specific months
  selectedYear: number;
  onChange: (month: number, year: number) => void;
  className?: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MonthYearPicker = ({ 
  selectedMonth, 
  selectedYear, 
  onChange,
  className 
}: MonthYearPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const handlePrev = () => {
    if (selectedMonth === 0 || selectedMonth === 1) {
      onChange(12, selectedYear - 1);
    } else {
      onChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNext = () => {
    // Block if current view is current month/year
    if (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth && selectedMonth !== 0)) {
        return;
    }

    if (selectedMonth === 0 || selectedMonth === 12) {
      onChange(1, selectedYear + 1);
    } else {
      onChange(selectedMonth + 1, selectedYear);
    }
  };

  const isFuture = (m: number, y: number) => {
    if (y > currentYear) return true;
    if (y === currentYear && m > currentMonth && m !== 0) return true;
    return false;
  };

  const canGoNext = !isFuture(selectedMonth === 0 ? 12 : selectedMonth + 1, selectedMonth === 12 ? selectedYear + 1 : selectedYear);

  return (
    <div className={cn("flex items-center gap-1 sm:gap-4 premium-card p-1.5 rounded-2xl border-border/40 bg-background/50 backdrop-blur-sm", className)}>
      <Button
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all active:scale-90"
        onClick={handlePrev}
      >
        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
      </Button>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div 
            className="flex flex-col items-center min-w-[120px] sm:min-w-[150px] px-2 cursor-pointer group"
          >
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1 transition-colors",
              selectedMonth === 0 ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60"
            )}>
              {selectedYear}
            </span>
            <span className="text-xs sm:text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              {selectedMonth === 0 ? 'Whole Year' : months[selectedMonth - 1]}
              <ChevronRight size={14} className="rotate-90 text-muted-foreground/30" />
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4 rounded-[2rem] border-border/40 shadow-2xl mt-4" align="center">
          <div className="space-y-6">
            {/* Year Selector in Popover */}
            <div className="flex items-center justify-between px-2">
               <Button 
                variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => onChange(selectedMonth, selectedYear - 1)}
               >
                 <ChevronLeft size={16} />
               </Button>
               <span className="text-sm font-black tracking-tighter">{selectedYear}</span>
               <Button 
                variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                disabled={selectedYear >= currentYear}
                onClick={() => onChange(selectedMonth, selectedYear + 1)}
               >
                 <ChevronRight size={16} />
               </Button>
            </div>

            {/* Month Grid (The Visual Calendar) */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, idx) => {
                const mIdx = idx + 1;
                const disabled = isFuture(mIdx, selectedYear);
                const isSelected = selectedMonth === mIdx;

                return (
                  <Button
                    key={m}
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => {
                        onChange(mIdx, selectedYear);
                        setIsOpen(false);
                    }}
                    className={cn(
                      "h-12 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                      isSelected ? "bg-primary text-primary-foreground shadow-lg scale-95" : "hover:bg-primary/5 hover:text-primary",
                      disabled && "opacity-20 grayscale cursor-not-allowed"
                    )}
                  >
                    {m.substring(0, 3)}
                  </Button>
                );
              })}
            </div>

            <div className="h-px bg-border/20 mx-2" />

            {/* Whole Year Toggle */}
            <Button
              variant="outline"
              onClick={() => {
                onChange(0, selectedYear);
                setIsOpen(false);
              }}
              className={cn(
                "w-full h-11 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest transition-all",
                selectedMonth === 0 ? "border-primary bg-primary/5 text-primary" : "border-border/40 hover:border-primary/40"
              )}
            >
              <CalendarIcon size={14} />
              Whole Year Report
              {selectedMonth === 0 && <Check size={14} className="ml-auto" />}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost" 
        size="icon" 
        className={cn(
            "h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all active:scale-90",
            canGoNext ? "hover:bg-primary/5 hover:text-primary" : "opacity-10 pointer-events-none"
        )}
        onClick={handleNext}
        disabled={!canGoNext}
      >
        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
};
