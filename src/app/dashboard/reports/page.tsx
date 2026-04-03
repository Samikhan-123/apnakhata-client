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
  Wallet
} from 'lucide-react';
import { ledgerEntryService } from '@/services/ledger-entry.service';
import { categoryService } from '@/services/category.service';
import { ReportFilters } from '@/components/features/ReportFilters';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useCurrency } from '@/context/CurrencyContext';
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
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
  AreaChart
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
  const { formatCurrency } = useCurrency();
  
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
      if (isInitial) setLoading(true);
      else setIsRefreshing(true);

      const data = await ledgerEntryService.getStats(currentFilters);
      setStats(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(filters, !stats);
  }, [filters]);


  const getSmartTips = () => {
    const tips: any[] = [];

    if (!stats || !stats.monthlyTrends || stats.monthlyTrends.length === 0) {
      return [{
        title: "Start Your Journey",
        text: "Add your first income and expense entries to get personalized financial insights!",
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
        title: "Excellent Savings!",
        text: `You've saved ${savingsRate.toFixed(0)}% of your income this month. You're on the fast track to your financial goals!`,
        bgColor: "bg-emerald-950",
        icon: <TrendingUp size={32} className="text-emerald-500" />
      });
    } else if (savingsRate < 0) {
      tips.push({
        title: "Deficit Alert",
        text: "Your spending has exceeded your income this month. Review your categories to find potential savings.",
        bgColor: "bg-rose-950",
        icon: <TrendingDown size={32} className="text-rose-500" />
      });
    }

    // 2. Category Concentration Tip
    if (stats.categoryBreakdown && stats.categoryBreakdown.length > 0) {
      const sortedCats = [...stats.categoryBreakdown].sort((a, b) => b.value - a.value);
      const topCat = sortedCats[0];
      if (topCat.value > (expense * 0.4)) {
        tips.push({
          title: "Spending Concentration",
          text: `${capitalize(topCat.name)} accounts for over 40% of your current spending. Is there room to optimize?`,
          bgColor: "bg-amber-950",
          icon: <Activity size={32} className="text-amber-500" />
        });
      }
    }

    // 3. Potential Savings Tip
    if (expense > 0) {
      tips.push({
        title: "Pro Tip: Budgeting",
        text: "Setting monthly limits for frequent categories can reduce impulsive spending by up to 30%.",
        bgColor: "bg-indigo-950",
        icon: <Wallet size={32} className="text-indigo-500" />
      });
    }

    // 4. Comparison Tip (if enough data)
    if (stats.monthlyTrends.length >= 2) {
      const prev = stats.monthlyTrends[stats.monthlyTrends.length - 2];
      if (expense < prev.expense) {
        tips.push({
          title: "Good Progress!",
          text: `You've spent less than last month so far. Keep up this disciplined momentum!`,
          bgColor: "bg-cyan-950",
          icon: <TrendingDown size={32} className="text-cyan-500" />
        });
      }
    }

    // Fallback
    if (tips.length === 0) {
      tips.push({
        title: "Smart Money Tip",
        text: "The best way to save is to track every small expense. Consistency leads to clarity.",
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
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-[2rem] animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Loading Reports...</p>
    </div>
  );

  const totalExpense = stats?.categoryBreakdown?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0;
  const lastMonthTrend = stats?.monthlyTrends?.[stats.monthlyTrends.length - 1] || { income: 0, expense: 0 };
  const prevMonthTrend = stats?.monthlyTrends?.[stats.monthlyTrends.length - 2] || { income: 0, expense: 0 };

  const expenseGrowth = prevMonthTrend.expense > 0
    ? ((lastMonthTrend.expense - prevMonthTrend.expense) / prevMonthTrend.expense) * 100
    : 0;

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Impact Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <SlideIn duration={0.5}>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Financial Reports</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg max-w-lg">
            Understand your spending patterns and financial health with clear, visual reports.
          </p>
        </SlideIn>

        <SlideIn delay={0.2} duration={0.5}>
          <div className="flex items-center gap-6 premium-card p-4 px-6 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center border",
                expenseGrowth <= 0 ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-rose-500/5 text-rose-600 border-rose-500/10"
              )}>
                {expenseGrowth <= 0 ? <TrendingDown size={22} /> : <TrendingUp size={22} />}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-0.5">Month over Month</p>
                <p className={cn("text-2xl font-bold tracking-tight", expenseGrowth <= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {expenseGrowth > 0 ? '+' : ''}{expenseGrowth.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </SlideIn>
      </div>

      <ReportFilters
        onFilterChange={setFilters}
        currentFilters={filters}
      />

      <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 w-fit animate-fade-in">
        <Activity size={14} className="text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
          Showing results for: <span className="text-foreground">{filters.startDate ? `${format(new Date(filters.startDate), 'MMM dd, yyyy')} - ${filters.endDate ? format(new Date(filters.endDate), 'MMM dd, yyyy') : 'Now'}` : 'Global Analytics'}</span>
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
            <CardContent className="p-8 h-[400px] min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyTrends}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      padding: '12px',
                    }}
                    itemStyle={{ fontSize: '11px', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Total Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#f43f5e"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    name="Total Expenses"
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                    name="Net Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </FadeIn>
        </Card>

        {/* Global Distribution */}
        <Card className="lg:col-span-12 xl:col-span-4 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
          <FadeIn delay={0.2} duration={0.6}>
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-bold tracking-tight">Spending</CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground/60">Breakdown by Category</CardDescription>
            </CardHeader>
            <CardContent className="p-6 h-[400px] min-h-[400px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats?.categoryBreakdown?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      backgroundColor: 'hsl(var(--background))',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Content for Donut */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-1">Total Spent</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(totalExpense)}</p>
              </div>
            </CardContent>
          </FadeIn>
        </Card>

        {/* Detailed Allocation Matrix */}
        <Card className="lg:col-span-12 rounded-[2.5rem] border-border/40 shadow-sm p-8 lg:p-10 bg-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Category Summary</h3>
              <p className="text-muted-foreground font-medium text-sm mt-1">Breakdown of where your money went this month.</p>
            </div>
            <div className="flex gap-4">
              <div className="p-5 premium-card rounded-2xl min-w-[170px] bg-emerald-500/5 border-emerald-500/10">
                <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">Monthly Income</p>
                <p className="text-2xl font-bold text-emerald-600 tabular-nums">{formatCurrency(lastMonthTrend.income)}</p>
              </div>
              <div className="p-5 premium-card rounded-2xl min-w-[170px] bg-rose-500/5 border-rose-500/10">
                <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">Monthly Expenses</p>
                <p className="text-2xl font-bold text-rose-600 tabular-nums">{formatCurrency(lastMonthTrend.expense)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats?.categoryBreakdown?.slice(0, 8).map((cat: any, idx: number) => (
              <div key={idx} className="premium-card p-5 rounded-2xl border-border/40 hover:bg-muted/5 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  >
                    <Activity size={16} />
                  </div>
                </div>
                <h5 className="font-bold text-base tracking-tight mb-1">{capitalize(cat.name)}</h5>
                <p className="font-bold text-foreground text-lg tabular-nums mb-3">{formatCurrency(cat.value)}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(cat.value / totalExpense) * 100}%`,
                      backgroundColor: COLORS[idx % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={cn("mt-10 p-8 rounded-3xl text-white relative overflow-hidden flex items-center min-h-[160px]", currentTip?.bgColor)}>
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
        </Card>
      </div>
    </div>
  );
}
