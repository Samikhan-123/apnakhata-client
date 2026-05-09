"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
const ReportCharts = dynamic(
  () => import("@/components/features/ReportCharts"),
  { ssr: false },
);
import {
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Wallet,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ledgerEntryService } from "@/services/ledger-entry.service";
import { budgetService } from "@/services/budget.service";
import { ReportFilters } from "@/components/features/ReportFilters";
import { useCurrency } from "@/context/CurrencyContext";
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { SyncingIndicator } from "@/components/ui/SyncingIndicator";
import { ReportsSkeleton } from "@/components/ui/ReportsSkeleton";

// Fix #3: Use UTC boundaries to avoid timezone drift
const getDefaultFilters = () => {
  const now = new Date();
  return {
    startDate: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    ).toISOString(),
    endDate: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999),
    ).toISOString(),
  };
};

export default function ReportsPage() {
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [allTimeStats, setAllTimeStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();

  const [filters, setFilters] = useState<Record<string, any>>(getDefaultFilters());
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Fix #5: Wrap in useCallback to avoid stale closure / unnecessary effect re-runs
  const fetchStats = useCallback(
    async (currentFilters: any = {}, isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
          setError(null);
        } else {
          setIsRefreshing(true);
        }

        // Fix #7 (PDF): Fetch active budgets alongside stats
        const [data, allTimeData, budgetData] = await Promise.all([
          ledgerEntryService.getStats(currentFilters),
          ledgerEntryService.getOverview({}),
          budgetService.getAll(),
        ]);
        setStats({ ...data, activeBudgets: budgetData || [] });
        setAllTimeStats(allTimeData);
      } catch (err: any) {
        if (isInitial)
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Unable to connect to the server",
          );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchStats(filters, !stats);
  }, [filters, fetchStats]);

  // Fix #6: Memoize tips so carousel effect doesn't reset unnecessarily
  const tips = useMemo(() => {
    const list: any[] = [];
    if (!stats || !stats.monthlyTrends || stats.monthlyTrends.length === 0) {
      return [
        {
          title: "Ready to Start?",
          text: "Add your first income or expense to see how your money moves!",
          bgColor: "bg-slate-900",
          icon: <Sparkles size={32} />,
        },
      ];
    }

    const latest = stats.monthlyTrends[stats.monthlyTrends.length - 1] || {
      income: 0,
      expense: 0,
    };
    const income = latest.income || 0;
    const expense = latest.expense || 0;
    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    if (savingsRate > 20) {
      list.push({
        title: "Doing Great!",
        text: `You saved ${savingsRate.toFixed(0)}% of your income. A big win!`,
        bgColor: "bg-emerald-950",
        icon: <TrendingUp size={32} className="text-emerald-500" />,
      });
    } else if (savingsRate < 0) {
      list.push({
        title: "Budget Alert",
        text: "You've spent more than you earned. Let's look for savings.",
        bgColor: "bg-rose-950",
        icon: <TrendingDown size={32} className="text-rose-500" />,
      });
    }

    if (list.length === 0) {
      list.push({
        title: "Keep it Up!",
        text: "Tracking every small expense helps build a clear picture.",
        bgColor: "bg-slate-950",
        icon: <Sparkles size={32} className="text-primary" />,
      });
    }
    return list;
  }, [stats]);

  const currentTip = tips[currentTipIndex];

  useEffect(() => {
    if (tips.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  if (loading) return <ReportsSkeleton />;

  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <ErrorState
          title="Reports Unavailable"
          message={error}
          onRetry={() => fetchStats(filters, true)}
        />
      </div>
    );

  const handleExportPDF = async () => {
    if (!stats) return;
    setIsRefreshing(true);
    try {
      const { exportReportToPDF } = await import("@/lib/export-utils");
      const income = Number(stats?.overview?.totalIncome || 0);
      const expense = Number(stats?.overview?.totalExpense || 0);
      const reportData = {
        summary: {
          totalIncome: income,
          totalExpense: expense,
          netSavings: income - expense,
          savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
        },
        categoryStats: (stats?.categoryBreakdown || []).map((c: any) => ({
          name: c.name,
          total: c.value,
          count: c.count,
          percentage: expense > 0 ? (c.value / expense) * 100 : 0,
        })),
        // Fix #7: Pass real active budget data instead of hardcoded []
        activeBudgets: (stats?.activeBudgets || []).map((b: any) => ({
          category: b.category?.name || "Unknown",
          limit: Number(b.limit),
          spent: Number(b.spent),
          progress: b.progress,
        })),
        period: filters,
      };
      await exportReportToPDF(reportData, user?.name || "User");
    } catch (e) {
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fix #4: Use period-based balance (income - expense for selected range)
  const periodNetBalance =
    (stats?.overview?.totalIncome || 0) - (stats?.overview?.totalExpense || 0);

  return (
    <div className="space-y-8 pb-20 px-4 md:px-0">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <SlideIn duration={0.5}>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Financial Reports
          </h1>
          <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg mt-2">
            Professional insights into your spending patterns.
          </p>
        </SlideIn>
        <div className="no-print">
          <Button
            onClick={handleExportPDF}
            disabled={isRefreshing}
            className="rounded-xl h-12 px-8 font-bold shadow-xl gap-2 bg-primary"
          >
            <Download className="h-4 w-4" />
            <span>{isRefreshing ? "Generating..." : "Download Statement"}</span>
          </Button>
        </div>
      </div>

      <div className="relative space-y-8">
        <SyncingIndicator
          isVisible={isRefreshing}
          message="Generating Insights"
        />

        <div className="no-print">
          <ReportFilters onFilterChange={setFilters} currentFilters={filters} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
          {[
            {
              label: "Total Inflow",
              value: stats?.overview?.totalIncome || 0,
              icon: ArrowUpRight,
              color: "emerald",
            },
            {
              label: "Total Outflow",
              value: stats?.overview?.totalExpense || 0,
              icon: ArrowDownLeft,
              color: "rose",
            },
            {
              // Fix #4: Period-specific balance instead of global all-time
              label: "Period Net",
              value: periodNetBalance,
              icon: Wallet,
              color: "primary",
              description: "Selected period",
            },
            {
              label: "Savings Rate",
              value:
                stats?.overview?.totalIncome > 0
                  ? (
                      ((stats!.overview.totalIncome -
                        stats!.overview.totalExpense) /
                        stats!.overview.totalIncome) *
                      100
                    ).toFixed(1)
                  : 0,
              icon: TrendingUp,
              color: "indigo",
              isPercentage: true,
            },
          ].map((metric, i) => (
            <FadeIn key={metric.label} delay={0.1 * i}>
              <div className="premium-card p-6 rounded-[2rem] border border-border/10 h-36 relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <metric.icon size={100} />
                </div>
                <div
                  className={cn(
                    "p-2.5 rounded-xl border shadow-sm w-fit",
                    metric.color === "emerald"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : metric.color === "rose"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-primary/10 text-primary border-primary/20",
                  )}
                >
                  <metric.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {metric.label}
                    </p>
                    {"description" in metric && metric.description && (
                      <span className="text-[8px] font-black uppercase tracking-tighter text-primary/40">
                        {metric.description}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-2xl font-black tracking-tighter",
                      "isPercentage" in metric && !metric.isPercentage && periodNetBalance < 0
                        ? "text-rose-500"
                        : "text-foreground",
                    )}
                  >
                    {metric.isPercentage
                      ? `${metric.value}%`
                      : formatCurrency(metric.value)}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 w-fit no-print">
          <Activity size={14} className="text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
            Analytics Engine Active:{" "}
            <span className="text-foreground">
              {filters.startDate
                ? `${format(new Date(filters.startDate), "MMM dd")} - ${format(new Date(filters.endDate), "MMM dd, yyyy")}`
                : "Global Period"}
            </span>
          </p>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-0 transition-opacity duration-300 relative",
            isRefreshing && "pointer-events-none",
          )}
        >
          {/* Fix #9: Pass filters so chart shows correct period label */}
          <ReportCharts stats={stats} formatCurrency={formatCurrency} filters={filters} />

          {/* Smart Tips */}
          <div className="lg:col-span-12 xl:col-span-12 no-print mt-10">
            <div
              className={cn(
                "p-8 rounded-[2.5rem] text-white relative overflow-hidden flex items-center min-h-[160px]",
                currentTip?.bgColor,
              )}
            >
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 relative z-10 font-bold">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                    {currentTip?.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold tracking-tight">
                      {currentTip?.title}
                    </h4>
                    <p className="text-white/60 font-medium text-sm max-w-lg mt-1">
                      {currentTip?.text}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
                  }
                  className="h-10 px-6 rounded-xl bg-white text-slate-950 hover:bg-white/90 font-bold text-sm"
                >
                  Next Insight
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
