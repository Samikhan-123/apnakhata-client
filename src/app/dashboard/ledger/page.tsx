'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ledgerEntryService } from '@/services/ledger-entry.service';
import { LedgerEntryList } from '@/components/features/LedgerEntryList';
import { LedgerEntryForm } from '@/components/features/LedgerEntryForm';
import { LedgerFilters } from '@/components/features/LedgerFilters';
import { categoryService } from '@/services/category.service';
import { Plus, Tag, ChevronLeft, ChevronRight, Wallet, ArrowUpCircle, ArrowDownCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginationPlus } from '@/components/ui/PaginationPlus';
import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomModal } from '@/components/ui/CustomModal';

export default function LedgerPage() {
  const { formatCurrency } = useCurrency();
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState<any>({ page: 1, limit: 15, total: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [overview, setOverview] = useState<any>(null);
  const [allTimeOverview, setAllTimeOverview] = useState<any>(null);

  const fetchData = useCallback(async (currentFilters: any = {}, page: number = 1) => {
    setLoading(true);
    try {
      const [{ data, pagination: pag }, overviewData, allTimeOverview] = await Promise.all([
        ledgerEntryService.getAll({ ...currentFilters, page, limit: pagination.limit }),
        ledgerEntryService.getOverview(currentFilters),
        ledgerEntryService.getOverview({}) // All-time summary for validation
      ]);

      setLedgerEntries(data || []);
      setOverview(overviewData);
      setAllTimeOverview(allTimeOverview);

      const total = pag?.total || 0;
      const totalPages = Math.ceil(total / pagination.limit);
      setPagination({ ...pag, total, totalPages });
    } catch (error) {
      console.error('Failed to fetch ledger entries:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const fetchMetadata = async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats || []);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchData(filters, 1);
  }, [fetchData, filters]);

  const handleExport = async () => {
    try {
      await ledgerEntryService.downloadCSV(filters);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchData(filters, newPage);
  };

  const periodText = filters.startDate
    ? (filters.endDate ? `${format(new Date(filters.startDate), 'MMM dd')} - ${format(new Date(filters.endDate), 'MMM dd')}` : format(new Date(filters.startDate), 'MMMM yyyy'))
    : format(new Date(), 'MMMM yyyy');

  const isFiltered = !!(filters.startDate || filters.endDate || filters.categoryId !== 'all' || filters.type !== 'all');

  return (
    <div className="space-y-10 pb-20">
      <SlideIn duration={0.5}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {isFiltered ? 'Filtered Results' : 'Ledger'}
            </h1>
            <p className="text-muted-foreground font-medium mt-2 text-lg">
              {isFiltered ? `Viewing records for ${periodText}` : `Your complete transaction history for ${periodText}`}
            </p>
          </div>

          <Button
            onClick={() => setIsFormOpen(true)}
            className="h-11 px-8 rounded-xl gap-2 font-bold shadow-sm bg-primary hover:bg-primary/90 active:scale-95 transition-all text-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Add Transaction</span>
          </Button>
          <CustomModal
            isOpen={isFormOpen}
            onClose={setIsFormOpen}
            title="New Transaction"
            description="Add a new income or expense to your history."
            maxWidth="500px"
          >
            <LedgerEntryForm
              totalIncome={allTimeOverview?.totalIncome || 0}
              remainingBalance={allTimeOverview?.remainingBalance || 0}
              onRefresh={() => {
                fetchData(filters);
                setIsFormOpen(false);
              }}
            />
          </CustomModal>
        </header>
      </SlideIn>

      {/* Dynamic Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Available Balance', value: overview?.remainingBalance || 0, icon: Wallet, color: 'primary' },
          { label: 'Income Received', value: overview?.totalIncome || 0, icon: ArrowUpCircle, color: 'emerald' },
          { label: 'Total Spent', value: overview?.totalExpense || 0, icon: ArrowDownCircle, color: 'rose' },
        ].map((stat, i) => (
          <SlideIn key={stat.label} delay={0.1 + i * 0.1} duration={0.5}>
            <div className="premium-card rounded-2xl p-5 flex flex-col justify-between group h-full">
              <div className="flex justify-between items-start mb-3">
                <div className={cn(
                  "p-2.5 rounded-lg border",
                  stat.color === 'primary' ? 'bg-primary/5 text-primary border-primary/10' :
                    stat.color === 'emerald' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' :
                      'bg-rose-500/5 text-rose-600 border-rose-500/10'
                )}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wide">{stat.label}</span>
              </div>
              <div className="text-xl font-bold tracking-tight tabular-nums text-foreground">{formatCurrency(stat.value)}</div>
            </div>
          </SlideIn>
        ))}
      </div>

      <LedgerFilters
        onFilterChange={setFilters}
        categories={categories}
        onExport={handleExport}
        currentFilters={filters}
      />

      <FadeIn delay={0.4} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <Tabs
              value={filters.type || 'all'}
              onValueChange={(val) => {
                setFilters((prev: any) => {
                  const newFilters = { ...prev };
                  if (val === 'all') {
                    delete newFilters.type;
                  } else {
                    newFilters.type = val;
                  }
                  return newFilters;
                });
              }}
              className="bg-muted/20 p-1 rounded-xl border border-border/20"
            >
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold text-xs tracking-tight px-6 h-8">All Activity</TabsTrigger>
                <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs tracking-tight px-6 h-8">Income</TabsTrigger>
                <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs tracking-tight px-6 h-8">Expense</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <LedgerEntryList
            ledgerEntries={ledgerEntries}
            onDelete={async (id) => {
              await ledgerEntryService.delete(id);
              fetchData(filters, pagination.page);
            }}
          />

          <PaginationPlus
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalResults={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </div>
      </FadeIn>
    </div>
  );
}
