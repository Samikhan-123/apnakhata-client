"use client";

import { MonthYearPicker } from "./MonthYearPicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  FileSpreadsheet,
  FileText,
  Download,
  X,
  Filter,
  RotateCcw,
} from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { capitalize } from "@/lib/utils";

interface LedgerFiltersProps {
  onFilterChange: (filters: any) => void;
  categories: any[];
  onExport: (format: "csv" | "excel" | "pdf") => void;
  currentFilters?: any;
}

export function LedgerFilters({
  onFilterChange,
  categories,
  onExport,
  currentFilters,
}: LedgerFiltersProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentFilters?.startDate
      ? new Date(currentFilters.startDate).getMonth() + 1
      : new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = React.useState(
    currentFilters?.startDate
      ? new Date(currentFilters.startDate).getFullYear()
      : new Date().getFullYear(),
  );
  const [search, setSearch] = React.useState(currentFilters?.search || "");
  const [categoryId, setCategoryId] = React.useState<string>(
    currentFilters?.categoryId || "all",
  );
  const [type, setType] = React.useState<string>(currentFilters?.type || "all");
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

    if (search) filters.search = search;
    if (categoryId !== "all") filters.categoryId = categoryId;
    if (type !== "all") filters.type = type;

    // Only call onFilterChange if filters actually changed to avoid double data
    onFilterChange(filters);
  }, [selectedMonth, selectedYear, search, categoryId, type, onFilterChange]);

  const handleClear = () => {
    const now = new Date();
    isSyncingFromProps.current = true;
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
    setSearch("");
    setCategoryId("all");
    setType("all");

    setTimeout(() => {
      isSyncingFromProps.current = false;
      onFilterChange({});
    }, 50);
  };

  // Sync internal state with props
  React.useEffect(() => {
    isSyncingFromProps.current = true;

    const propType = currentFilters?.type || "all";
    if (propType !== type) setType(propType);

    const propCat = currentFilters?.categoryId || "all";
    if (propCat !== categoryId) setCategoryId(propCat);

    const propSearch = currentFilters?.search || "";
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
  }, [type, categoryId, selectedMonth, selectedYear, search, handleApply]);

  const now = new Date();
  const isFiltered = !!(
    search ||
    (categoryId && categoryId !== "all") ||
    (type && type !== "all") ||
    selectedMonth !== now.getMonth() + 1 ||
    selectedYear !== now.getFullYear()
  );

  const getActiveChips = () => {
    const chips: { key: string; label: string; value: string }[] = [];
    if (type !== "all")
      chips.push({ key: "type", label: "Type", value: capitalize(type) });
    if (categoryId !== "all") {
      const cat = categories.find((c) => c.id === categoryId);
      chips.push({
        key: "categoryId",
        label: "Category",
        value: cat?.name || "Unknown",
      });
    }
    if (search)
      chips.push({ key: "search", label: "Search", value: `"${search}"` });

    const isDefaultDate =
      selectedMonth === now.getMonth() + 1 &&
      selectedYear === now.getFullYear();
    if (!isDefaultDate) {
      const monthLabel =
        selectedMonth === 0
          ? "Full Year"
          : format(new Date(selectedYear, selectedMonth - 1), "MMMM");
      chips.push({
        key: "date",
        label: "Period",
        value: `${monthLabel} ${selectedYear}`,
      });
    }
    return chips;
  };

  const removeChip = (key: string) => {
    if (key === "type") setType("all");
    else if (key === "categoryId") setCategoryId("all");
    else if (key === "search") setSearch("");
    else if (key === "date") {
      setSelectedMonth(now.getMonth() + 1);
      setSelectedYear(now.getFullYear());
    }
  };

  return (
    <div className="flex flex-col space-y-4 premium-card p-5 md:p-6 rounded-3xl border border-border/10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
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
              <SelectItem value="all" className="rounded-xl font-medium">
                All Types
              </SelectItem>
              <SelectItem
                value="INCOME"
                className="rounded-xl font-medium text-emerald-600"
              >
                Income
              </SelectItem>
              <SelectItem
                value="EXPENSE"
                className="rounded-xl font-medium text-rose-600"
              >
                Expense
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-11 w-[160px] rounded-xl border-border/60 font-semibold bg-background hover:bg-muted/30 transition-all text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border shadow-2xl p-1">
              <SelectItem value="all" className="rounded-xl font-medium">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="rounded-xl font-medium"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 rounded-xl gap-2 font-bold px-6 active:scale-95 transition-all text-sm border-primary/20 hover:border-primary/40 text-primary bg-primary/5"
              >
                <Download className="h-4 w-4" />
                Export Records
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px] rounded-2xl p-2 shadow-2xl border-border/40"
            >
              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                Choose Format
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem
                onClick={() => onExport("excel")}
                className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold">Excel Records</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport("pdf")}
                className="rounded-xl flex items-center gap-3 px-3 py-2.5 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold">Statement PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AnimatePresence>
        {isFiltered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-border/10 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-2">
                <Filter size={10} className="text-primary/60" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                  Active Filters
                </span>
              </div>

              {getActiveChips().map((chip) => (
                <Badge
                  key={chip.key}
                  variant="secondary"
                  className="h-7 pl-2.5 pr-1 gap-1.5 rounded-lg bg-primary/5 border-primary/5 text-primary font-bold hover:bg-primary/10 transition-colors group"
                >
                  <span className="text-[9px] opacity-40 uppercase font-black">
                    {chip.label}:
                  </span>
                  <span className="text-[11px]">{chip.value}</span>
                  <button
                    onClick={() => removeChip(chip.key)}
                    className="p-1 hover:bg-primary/20 rounded-md transition-colors"
                  >
                    <X size={10} />
                  </button>
                </Badge>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/5 transition-all gap-1.5 ml-auto"
              >
                <RotateCcw size={10} />
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
