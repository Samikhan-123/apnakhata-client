'use client';

import React from 'react';
import {
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
  ComposedChart,
  Line
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';
import { cn, capitalize } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Rose
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

interface ReportChartsProps {
  stats: any;
  formatCurrency: (val: number) => string;
  filters?: any;
}

const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportCharts({ stats, formatCurrency, filters }: ReportChartsProps) {
  const getPeriodLabel = () => {
    if (!filters?.startDate) return 'Global Period';
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    
    // Check if it's a whole year
    if (start.getMonth() === 0 && end.getMonth() === 11 && end.getDate() >= 30) {
      return `Annual Report: ${start.getFullYear()}`;
    }
    
    return `Viewing: ${monthsList[start.getMonth()]} ${start.getFullYear()}`;
  };

  const periodLabel = getPeriodLabel();
  const totalExpense = stats?.categoryBreakdown?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
      {/* Cash Flow Timeline */}
      <Card className="lg:col-span-12 xl:col-span-12 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
        <div>
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between font-bold">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Financial Flow</CardTitle>
              <CardDescription className="text-sm font-medium text-emerald-600 uppercase tracking-widest mt-1">Recent 6-Month Trend</CardDescription>
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
          <CardContent className="p-0 overflow-hidden">
            <div className="p-4 sm:p-8 h-[320px] sm:h-[450px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                <ComposedChart data={stats?.monthlyTrends} barGap={8} margin={{ bottom: 20 }}>
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
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                    width={35}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 10 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-2xl border-white/10 backdrop-blur-xl min-w-[170px] sm:min-w-[200px]">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 sm:mb-4 font-bold">{data.month}</p>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-[10px] sm:text-xs font-bold text-foreground/80 lowercase">Income</span>
                                </div>
                                <span className="text-[10px] sm:text-xs font-black tabular-nums text-emerald-500">{formatCurrency(data.income)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                                  <span className="text-[10px] sm:text-xs font-bold text-foreground/80 lowercase">Expenses</span>
                                </div>
                                <span className="text-[10px] sm:text-xs font-black tabular-nums text-rose-500">{formatCurrency(data.expense)}</span>
                              </div>
                              <div className="pt-2 sm:pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary font-bold">Net</span>
                                <span className={cn(
                                  "text-[10px] sm:text-xs font-black tabular-nums font-bold",
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
                      <div className="flex gap-4 sm:gap-6 mb-4 sm:mb-8 justify-end">
                        {payload?.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-1.5 group cursor-pointer font-bold">
                            <div className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: entry.color }} />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <Area type="monotone" dataKey="balance" stroke="none" fill="url(#colorBalanceArea)" name="Growth" />
                  <Bar dataKey="income" fill="url(#colorIncome)" name="Income" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 640 ? 12 : 24} />
                  <Bar dataKey="expense" fill="url(#colorExpense)" name="Expense" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 640 ? 12 : 24} />
                  <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: '#fff', stroke: '#6366f1' }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: '#6366f1' }} name="Net Balance" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Category Intelligence */}
      <Card className="lg:col-span-12 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
        <div>
          <CardHeader className="p-6 sm:p-8 pb-0 border-b border-border/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-6 font-bold">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Category Breakdown</CardTitle>
                <CardDescription className="text-[10px] sm:text-sm font-medium text-primary uppercase tracking-widest mt-1">{periodLabel}</CardDescription>
              </div>
              <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-xl border border-border/10 w-fit">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Distribution Matrix</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 xl:grid-cols-12">
              <div className="xl:col-span-12 2xl:col-span-5 p-6 sm:p-10 border-b 2xl:border-b-0 2xl:border-r border-border/5 flex flex-col items-center justify-center relative min-h-[350px] sm:min-h-[450px] w-full min-w-0">
                <ResponsiveContainer width="100%" height={300} minHeight={300} minWidth={0} debounce={100}>
                  <PieChart>
                    <Pie 
                      data={stats?.categoryBreakdown} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={window.innerWidth < 640 ? 70 : 90} 
                      outerRadius={window.innerWidth < 640 ? 100 : 125} 
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
                            <div className="glass-card rounded-2xl p-4 shadow-2xl border-white/10 backdrop-blur-xl font-bold text-foreground">
                              <div className="flex items-center gap-2 mb-1 text-foreground font-bold">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill || payload[0].color }} />
                                <span className="text-xs font-bold">{capitalize(String(payload[0].name ?? ''))}</span>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1 font-bold">Global Spend</p>
                  <p className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground font-bold">{formatCurrency(totalExpense)}</p>
                </div>
              </div>

              <div className="xl:col-span-7 p-8 md:p-10 bg-muted/5">
                <div className="space-y-6">
                  {stats?.categoryBreakdown?.map((cat: any, idx: number) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                            <Activity size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground tracking-tight">{capitalize(cat.name)}</p>
                            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest font-bold">{cat.count} Entries</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-foreground tabular-nums font-bold">{formatCurrency(cat.value)}</p>
                          <p className="text-[10px] font-bold text-primary">{((cat.value / totalExpense) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(cat.value / totalExpense) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
