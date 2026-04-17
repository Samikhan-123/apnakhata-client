'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
  Wallet,
  Download
} from 'lucide-react';
import { ledgerEntryService } from '@/services/ledger-entry.service';
import { categoryService } from '@/services/category.service';
import { ReportFilters } from '@/components/features/ReportFilters';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useCurrency } from '@/context/CurrencyContext';
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ComposedChart,
  Line
} from 'recharts';
import { cn, capitalize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Rose
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();

  // Default to current month for a professional, focused initial experience
  const getDefaultFilters = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  };

  const [filters, setFilters] = useState<any>(getDefaultFilters());
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const fetchStats = async (currentFilters: any = {}, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setIsRefreshing(true);
      }

      const data = await ledgerEntryService.getStats(currentFilters);
      setStats(data);
    } catch (err: any) {
      if (isInitial) setError(err?.response?.data?.message || err.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(filters, !stats);
  }, [filters]);

  useEffect(() => {
    // A small delay ensures the browser has finished the first layout pass
    // and Framer Motion animations have initialized their dimensions.
    const timer = setTimeout(() => setHasMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);


  const getSmartTips = () => {
    const tips: any[] = [];

    if (!stats || !stats.monthlyTrends || stats.monthlyTrends.length === 0) {
      return [{
        title: "Ready to Start?",
        text: "Add your first income or expense to see how your money moves!",
        bgColor: "bg-slate-900",
        icon: <Sparkles size={32} />
      }];
    }

    const latest = stats.monthlyTrends[stats.monthlyTrends.length - 1] || { income: 0, expense: 0 };
    const income = latest.income || 0;
    const expense = latest.expense || 0;
    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // 1. Savings Rate Tip
    if (savingsRate > 20) {
      tips.push({
        title: "Doing Great!",
        text: `You saved ${savingsRate.toFixed(0)}% of your income so far. That's a big win for your future!`,
        bgColor: "bg-emerald-950",
        icon: <TrendingUp size={32} className="text-emerald-500" />
      });
    } else if (savingsRate < 0) {
      tips.push({
        title: "Budget Alert",
        text: "You've spent a bit more than you earned this month. Let's see where we can trim some costs together.",
        bgColor: "bg-rose-950",
        icon: <TrendingDown size={32} className="text-rose-500" />
      });
    }

    // 2. Spending Insight
    if (stats.categoryBreakdown && stats.categoryBreakdown.length > 0) {
      const sortedCats = [...stats.categoryBreakdown].sort((a, b) => b.value - a.value);
      const topCat = sortedCats[0];
      if (topCat.value > (expense * 0.4)) {
        tips.push({
          title: "Spending Insight",
          text: `You're spending quite a bit on ${capitalize(topCat.name)}. Maybe check if you can dial it back a little?`,
          bgColor: "bg-amber-950",
          icon: <Activity size={32} className="text-amber-500" />
        });
      }
    }

    // 3. Simple Budgeting Tip
    if (expense > 0) {
      tips.push({
        title: "Quick Tip",
        text: "Setting a small budget for your frequent categories can help you save more without even trying.",
        bgColor: "bg-indigo-950",
        icon: <Wallet size={32} className="text-indigo-500" />
      });
    }

    // 4. Progress Tip
    if (stats.monthlyTrends.length >= 2) {
      const prev = stats.monthlyTrends[stats.monthlyTrends.length - 2];
      if (expense < prev.expense) {
        tips.push({
          title: "Awesome Progress!",
          text: `You're spending less than last month. Your wallet is definitely going to thank you!`,
          bgColor: "bg-cyan-950",
          icon: <TrendingDown size={32} className="text-cyan-500" />
        });
      }
    }

    // Fallback
    if (tips.length === 0) {
      tips.push({
        title: "Keep it Up!",
        text: "Tracking every small expense is the best way to get a clear picture of your money.",
        bgColor: "bg-slate-950",
        icon: <Sparkles size={32} className="text-primary" />
      });
    }

    return tips;
  };

  const tips = getSmartTips();
  const currentTip = tips[currentTipIndex];

  // Auto-cycle tips
  useEffect(() => {
    if (tips.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000); // 8 seconds of each tip 
    return () => clearInterval(interval);
  }, [tips.length]);

  if (loading) return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-muted/30 rounded-xl animate-pulse" />
          <div className="h-5 w-96 bg-muted/20 rounded-lg animate-pulse" />
        </div>
        <div className="h-20 w-48 bg-muted/30 rounded-3xl animate-pulse" />
      </div>
      <div className="h-24 w-full bg-muted/20 rounded-3xl animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 h-[480px] bg-muted/20 rounded-[2.5rem] animate-pulse" />
        <div className="lg:col-span-4 h-[480px] bg-muted/20 rounded-[2.5rem] animate-pulse" />
      </div>
      <div className="h-[400px] w-full bg-muted/20 rounded-[2.5rem] animate-pulse" />
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <ErrorState
        title="Reports Unavailable"
        message={error}
        onRetry={() => fetchStats(filters, true)}
        className="max-w-xl w-full"
      />
    </div>
  );

  const totalExpense = stats?.categoryBreakdown?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0;
  const lastMonthTrend = stats?.monthlyTrends?.[stats.monthlyTrends.length - 1] || { income: 0, expense: 0 };
  const prevMonthTrend = stats?.monthlyTrends?.[stats.monthlyTrends.length - 2] || { income: 0, expense: 0 };

  const expenseGrowth = prevMonthTrend.expense > 0
    ? ((lastMonthTrend.expense - prevMonthTrend.expense) / prevMonthTrend.expense) * 100
    : 0;

  const handleExportPDF = async () => {
    if (!stats) return;

    setIsRefreshing(true);
    try {
      const { exportReportToPDF } = await import('@/lib/export-utils');

      const income = Number(stats?.overview?.totalIncome || 0);
      const expense = Number(stats?.overview?.totalExpense || 0);
      const savings = income - expense;
      const rate = income > 0 ? (savings / income) * 100 : 0;

      const reportData = {
        summary: {
          totalIncome: income,
          totalExpense: expense,
          netSavings: savings,
          savingsRate: rate
        },
        categoryStats: (stats?.categoryBreakdown || []).map((c: any) => ({
          name: c.name,
          total: c.value,
          percentage: expense > 0 ? (c.value / expense) * 100 : 0
        })),
        activeBudgets: [],
        period: filters
      };

      await exportReportToPDF(reportData, user?.name || 'User');
    } catch (error) {
      // Silent error handling as per rules
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Impact Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <SlideIn duration={0.5}>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">Financial Reports</h1>
          <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg">
            Understand your spending patterns and financial health with clear, visual reports.
          </p>
        </SlideIn>

        <div className="flex gap-3 no-print">
          <Button
            onClick={handleExportPDF}
            disabled={isRefreshing || loading}
            className="rounded-xl h-12 px-8 font-bold shadow-xl gap-2 bg-primary hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>{isRefreshing ? 'Generating...' : 'Download Statement'}</span>
          </Button>
        </div>
      </div>

      <div className="no-print">
        <ReportFilters
          onFilterChange={setFilters}
          currentFilters={filters}
        />
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
        {[
          { 
            label: 'Total Income', 
            value: stats?.overview?.totalIncome || 0, 
            icon: ArrowUpRight, 
            color: 'emerald', 
            trend: stats?.monthlyTrends?.length > 1 ? ((stats.monthlyTrends[stats.monthlyTrends.length - 1].income - stats.monthlyTrends[stats.monthlyTrends.length - 2].income) / stats.monthlyTrends[stats.monthlyTrends.length - 2].income * 100) : 0
          },
          { 
            label: 'Total Expenses', 
            value: stats?.overview?.totalExpense || 0, 
            icon: ArrowDownLeft, 
            color: 'rose',
            trend: stats?.monthlyTrends?.length > 1 ? ((stats.monthlyTrends[stats.monthlyTrends.length - 1].expense - stats.monthlyTrends[stats.monthlyTrends.length - 2].expense) / stats.monthlyTrends[stats.monthlyTrends.length - 2].expense * 100) : 0
          },
          { 
            label: 'Net Savings', 
            value: (stats?.overview?.totalIncome || 0) - (stats?.overview?.totalExpense || 0), 
            icon: Wallet, 
            color: 'primary',
            isCurrency: true
          },
          { 
            label: 'Savings Rate', 
            value: stats?.overview?.totalIncome > 0 ? (((stats.overview.totalIncome - stats.overview.totalExpense) / stats.overview.totalIncome) * 100).toFixed(1) : 0, 
            icon: TrendingUp, 
            color: 'indigo',
            isPercentage: true
          },
        ].map((metric, i) => (
          <FadeIn key={metric.label} delay={0.1 * i}>
            <div className="premium-card p-6 rounded-[2rem] border border-border/10 flex flex-col justify-between h-36 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <metric.icon size={100} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className={cn(
                  "p-2.5 rounded-xl border shadow-sm",
                  metric.color === 'emerald' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                  metric.color === 'rose' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                  metric.color === 'indigo' ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" :
                  "bg-primary/10 text-primary border-primary/20"
                )}>
                  <metric.icon className="h-4 w-4" />
                </div>
                {metric.trend !== undefined && metric.trend !== 0 && (
                  <div className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1",
                    metric.trend > 0 ? "bg-emerald-500/5 text-emerald-600" : "bg-rose-500/5 text-rose-600"
                  )}>
                    {metric.trend > 0 ? '↑' : '↓'} {Math.abs(metric.trend).toFixed(0)}%
                  </div>
                )}
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{metric.label}</p>
                <div className="text-2xl font-black tracking-tighter text-foreground tabular-nums">
                  {metric.isPercentage ? `${metric.value}%` : formatCurrency(metric.value)}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2x border border-primary/10 w-fit animate-fade-in no-print">
        <Activity size={14} className="text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
          Analytics Engine Active: <span className="text-foreground">{filters.startDate ? `${format(new Date(filters.startDate), 'MMM dd, yyyy')} - ${filters.endDate ? format(new Date(filters.endDate), 'MMM dd, yyyy') : 'Now'}` : 'Global Period'}</span>
        </p>
      </div>

      <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-10 transition-opacity duration-300", isRefreshing && "opacity-50 pointer-events-none")}>
        {/* Cash Flow Timeline */}
        <Card className="lg:col-span-12 xl:col-span-8 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
          <FadeIn duration={0.6}>
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Financial Flow</CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground/60">Income and expenses over time</CardDescription>
              </div>
              <div className="hidden sm:flex gap-3">
                <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-lg text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Income
                </div>
                <div className="flex items-center gap-2 bg-rose-500/5 px-3 py-1.5 rounded-lg text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-500/10">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Expenses
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-[400px] min-h-[400px] w-full min-w-0">
              {hasMounted && (
                <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stats?.monthlyTrends?.map((m: any) => ({ ...m, balance: m.income - m.expense }))} barGap={8}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="colorBalanceArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary) / 0.05)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 900 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 900 }}
                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 10 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="glass-card rounded-[2rem] p-6 shadow-2xl border-white/10 backdrop-blur-xl min-w-[200px]">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">{data.month}</p>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                  <span className="text-xs font-bold text-foreground/80">Income</span>
                                </div>
                                <span className="text-xs font-black tabular-nums text-emerald-500">{formatCurrency(data.income)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                  <span className="text-xs font-bold text-foreground/80">Expenses</span>
                                </div>
                                <span className="text-xs font-black tabular-nums text-rose-500">{formatCurrency(data.expense)}</span>
                              </div>
                              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Net Balance</span>
                                <span className={cn(
                                  "text-xs font-black tabular-nums",
                                  data.balance >= 0 ? "text-primary" : "text-rose-500"
                                )}>
                                  {data.balance >= 0 ? '+' : ''}{formatCurrency(data.balance)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    content={({ payload }) => (
                      <div className="flex gap-6 mb-8">
                        {payload?.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-2 h-2 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: entry.color }} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="none"
                    fill="url(#colorBalanceArea)"
                    name="Growth Area"
                  />
                  <Bar
                    dataKey="income"
                    fill="url(#colorIncome)"
                    name="Income"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="expense"
                    fill="url(#colorExpense)"
                    name="Expense"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                    name="Net Balance"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </FadeIn>
        </Card>

        {/* Category Intelligence - Consolidated Module */}
        <Card className="lg:col-span-12 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
          <FadeIn delay={0.2} duration={0.6}>
            <CardHeader className="p-8 pb-0 border-b border-border/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Category Intelligence</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground/60">Comprehensive breakdown of your spending structure</CardDescription>
                </div>
                <div className="flex items-center gap-4 bg-muted/20 px-4 py-2 rounded-xl border border-border/10">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Allocation Distribution</span>
                   </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-1 xl:grid-cols-12">
                  {/* Left: Visualization */}
                  <div className="xl:col-span-5 p-10 border-r border-border/5 flex flex-col items-center justify-center relative min-h-[450px] w-full min-w-0">
                    {hasMounted && (
                      <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={stats?.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={125}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {stats?.categoryBreakdown?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="glass-card rounded-2xl p-4 shadow-2xl border-white/10 backdrop-blur-xl">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill || payload[0].color }} />
                                    <span className="text-xs font-bold text-foreground">{capitalize(String(payload[0].name ?? ''))}</span>
                                  </div>
                                  <p className="text-xs font-black text-primary">{formatCurrency(Number(payload[0].value ?? 0))}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">Global Spend</p>
                      <p className="text-3xl font-black tracking-tighter text-foreground">{formatCurrency(totalExpense)}</p>
                    </div>
                  </div>

                  {/* Right: Detailed Breakdown List */}
                  <div className="xl:col-span-7 p-8 md:p-10 bg-muted/5">
                     <div className="space-y-6">
                        {stats?.categoryBreakdown?.map((cat: any, idx: number) => (
                          <div key={idx} className="group cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-4">
                                <div 
                                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                >
                                  <Activity size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground tracking-tight">{capitalize(cat.name)}</p>
                                  <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{cat.count} Entries</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-foreground tabular-nums">{formatCurrency(cat.value)}</p>
                                <p className="text-[10px] font-bold text-primary">{((cat.value / totalExpense) * 100).toFixed(1)}%</p>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <FadeIn delay={0.2 + (idx * 0.05)}>
                                <div 
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${(cat.value / totalExpense) * 100}%`,
                                    backgroundColor: COLORS[idx % COLORS.length]
                                  }}
                                />
                              </FadeIn>
                            </div>
                          </div>
                        ))}
                     </div>

                     {/* Summary Footer */}
                     <div className="mt-12 p-6 rounded-3xl premium-card border-border/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/40">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                              <TrendingUp size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Efficiency Rating</p>
                              <p className="text-xl font-black text-foreground">High Optimization</p>
                           </div>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold gap-2 text-[10px] uppercase tracking-widest h-10 px-6">
                           View Matrix details
                        </Button>
                     </div>
                  </div>
               </div>
            </CardContent>
          </FadeIn>
        </Card>

        {/* Smart Tips - Insights Bar */}
        <div className="lg:col-span-12 xl:col-span-12 no-print">
          <div className={cn("p-8 rounded-[2.5rem] text-white relative overflow-hidden flex items-center min-h-[160px]", currentTip?.bgColor)}>
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 relative z-10">
              <AnimatePresence mode="wait">
                <SlideIn
                  key={currentTipIndex}
                  duration={0.4}
                  className="flex items-center gap-6"
                >
                  <div className="h-14 w-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                    {currentTip?.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold tracking-tight">{currentTip?.title}</h4>
                    <p className="text-white/60 font-medium text-sm max-w-lg mt-1">
                      {currentTip?.text}
                    </p>
                  </div>
                </SlideIn>
              </AnimatePresence>

              <div className="flex items-center gap-6">
                <div className="flex gap-1.5">
                  {tips.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        i === currentTipIndex ? "w-6 bg-white" : "w-1 bg-white/20"
                      )}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
                  className="h-10 px-6 rounded-xl bg-white text-slate-950 hover:bg-white/90 font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
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
