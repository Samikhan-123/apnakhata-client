'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ledgerEntryService } from '@/services/ledger-entry.service';
import { LedgerEntryList } from '@/components/features/LedgerEntryList';
import { LedgerEntryForm } from '@/components/features/LedgerEntryForm';
import { LedgerFilters } from '@/components/features/LedgerFilters';
import { categoryService } from '@/services/category.service';
import { Plus, Tag, ChevronLeft, ChevronRight, Wallet, ArrowUpCircle, ArrowDownCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { PaginationPlus } from '@/components/ui/PaginationPlus';
import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { CustomModal } from '@/components/ui/CustomModal';
import { ErrorState } from '@/components/ui/ErrorState';
import { LedgerSkeleton } from '@/components/ui/LedgerSkeleton';

export default function LedgerPage() {
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ startDate: defaultStart, endDate: defaultEnd });
  const [pagination, setPagination] = useState<any>({ page: 1, limit: 15, total: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [overview, setOverview] = useState<any>(null);
  const [allTimeOverview, setAllTimeOverview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (currentFilters: any = {}, page: number = 1, silent: boolean = false) => {
    if (!silent) setLoading(true);
    setError(null);
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
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const fetchMetadata = async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats || []);
    } catch (error) {
      // console.error('Failed to fetch metadata:', error);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchData(filters, 1);
  }, [fetchData, filters]);

  const handleExport = async (formatType: 'csv' | 'excel' | 'pdf') => {
    try {
      const { exportToCSV, exportToExcel, exportLedgerToPDF } = await import('@/lib/export-utils');

      const data = await ledgerEntryService.getExportData(filters);
      const filename = `ApnaKhata_Records_${format(new Date(), 'dd_MMM_yyyy')}`;

      if (formatType === 'pdf') {
        await exportLedgerToPDF(data, user?.name || 'User', filters);
        return;
      }

      const formattedData = data.map((item: any) => ({
        date: item.date,
        description: item.description,
        category: item.category?.name || 'Uncategorized',
        type: item.type,
        amount: Number(item.amount)
      }));

      if (formatType === 'csv') {
        exportToCSV(formattedData, filename);
      } else if (formatType === 'excel') {
        exportToExcel(formattedData, filename);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchData(filters, newPage);
  };

  const periodText = filters.startDate
    ? (filters.endDate ? `${format(new Date(filters.startDate), 'MMM dd')} - ${format(new Date(filters.endDate), 'MMM dd')}` : format(new Date(filters.startDate), 'MMMM yyyy'))
    : format(new Date(), 'MMMM yyyy');

  const isFiltered = !!(filters.startDate || filters.endDate || filters.categoryId !== 'all' || filters.type !== 'all');

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((prev: any) => {
      // Deep equal check to avoid re-render loops
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      return newFilters;
    });
  }, []);


  if (loading) {
    return <LedgerSkeleton />;
  }

  return (
    <div className=" space-y-10  pb-20">
      <SlideIn duration={0.5}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
              {isFiltered ? 'Financial Records' : 'Records'}
            </h1>
            <p className="text-muted-foreground font-medium text-base sm:text-lg">
              {isFiltered ? `Viewing records for ${periodText}` : `Your complete Records history for ${periodText}`}
            </p>
          </div>

          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-auto md:w-auto h-11 px-8 rounded-xl gap-2 font-bold shadow-sm bg-primary hover:bg-primary/90 active:scale-95 transition-all text-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Add Record</span>
          </Button>

          <CustomModal
            isOpen={isFormOpen}
            onClose={setIsFormOpen}
            title="New Record"
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

      {/* Dynamic Stats */}
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
        onFilterChange={handleFilterChange}
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
                  const newType = val === 'all' ? undefined : val;
                  if (prev.type === newType) return prev; // Avoid same-value update

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
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold text-[10px] sm:text-xs tracking-tight px-3 sm:px-6 h-8">All Activity</TabsTrigger>
                <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-[10px] sm:text-xs tracking-tight px-3 sm:px-6 h-8">Income</TabsTrigger>
                <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-[10px] sm:text-xs tracking-tight px-3 sm:px-6 h-8">Expense</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {error ? (
            <ErrorState
              title="Failed to Load Ledger"
              message={error}
              onRetry={() => fetchData(filters, pagination.page)}
              className="py-20"
            />
          ) : (
            <LedgerEntryList
              ledgerEntries={ledgerEntries}
              onDelete={async (id) => {
                await ledgerEntryService.delete(id);
                fetchData(filters, pagination.page, true);
              }}
              onRefresh={() => fetchData(filters, pagination.page, true)}
            />
          )}

          {/* Pagination for ledger entries */}
          {!error && (
            <PaginationPlus
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalResults={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </FadeIn>
    </div>
  );
}
