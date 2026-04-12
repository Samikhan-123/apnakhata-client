'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import { 
  Users, ReceiptText, BarChart3, TrendingUp, ShieldAlert, 
  ArrowUpRight, Scale, Globe, TrendingDown, DollarSign,
  Activity as LucideActivity, History as LucideHistory
} from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/error-handler';
import { ErrorState } from '@/components/ui/ErrorState';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [financialStats, setFinancialStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { currency, formatCurrency } = useCurrency();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, finRes] = await Promise.all([
        adminService.getStats(),
        adminService.getFinancialStats()
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (finRes.success) setFinancialStats(finRes.data);
    } catch (err: any) {
      const { message, status } = handleApiError(err, { silent: true });
      setError({ message, status });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8 p-8">
      <div className="h-12 w-64 bg-muted rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
      </div>
    </div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-20">
        <ErrorState
          title="Overview Unreachable"
          message={error.message || "We encountered an anomaly while synchronizing platform metrics."}
          onRetry={fetchData}
          type={error.status === 0 ? 'connection' : 'server'}
        />
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'primary', 
      suffix: 'Accounts',
      subtext: `${stats?.newUsersLast30Days || 0} New this month`
    },
    { 
      title: 'Monthly In-flow', 
      value: formatCurrency(financialStats?.summary?.totalIncome || 0), 
      icon: TrendingUp, 
      color: 'emerald', 
      suffix: 'Income',
      subtext: `${stats?.incomeCount || 0} Records`
    },
    { 
      title: 'Monthly Out-flow', 
      value: formatCurrency(financialStats?.summary?.totalExpense || 0), 
      icon: TrendingDown, 
      color: 'rose', 
      suffix: 'Expenses',
      subtext: `${stats?.expenseCount || 0} Records`
    },
    { 
      title: 'Active Engagement', 
      value: financialStats?.activityTrends?.[financialStats?.activityTrends?.length - 1]?.count || 0, 
      icon: BarChart3, 
      color: 'amber', 
      suffix: 'DAU Today',
      subtext: 'Daily Active Users'
    },
  ];

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-12">
      <header>
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
               <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Command Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Global Overview</h1>
          <p className="text-muted-foreground font-medium mt-1">Real-time platform metrics and financial health monitoring.</p>
        </SlideIn>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <FadeIn key={stat.title} delay={i * 0.1}>
            <div className="premium-card p-6 rounded-[2.5rem] border border-border/10 overflow-hidden group hover:border-primary/30 transition-all relative">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={cn(
                  "p-2.5 rounded-xl border opacity-80",
                  stat.color === 'primary' ? "bg-primary/5 text-primary border-primary/20" :
                  stat.color === 'emerald' ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                  stat.color === 'rose' ? "bg-rose-500/5 text-rose-600 border-rose-500/20" : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                )}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 rounded-full">
                  <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{stat.suffix}</span>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-xs font-bold text-muted-foreground">{stat.title}</p>
                <div className="text-3xl font-black tracking-tighter text-foreground tabular-nums">
                  {stat.value}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1">
                   <Activity className="h-3 w-3" />
                   {stat.subtext}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Trend Chart */}
        <FadeIn className="lg:col-span-2" delay={0.4}>
          <div className="premium-card p-8 rounded-[3rem] border border-border/10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight">Platform Activity</h2>
                <p className="text-xs font-bold text-muted-foreground mt-1">Daily interaction measures and Records added.</p>
              </div>
              <div className="flex h-10 items-center gap-1 bg-muted/30 p-1 rounded-xl">
                 <Button variant="ghost" size="sm" className="bg-background text-primary shadow-sm h-8 font-black text-[10px] px-4 rounded-lg">LIVE</Button>
                 <Button variant="ghost" size="sm" className="h-8 font-bold text-muted-foreground/60 text-[10px] px-4 rounded-lg">LAST 7D</Button>
              </div>
            </div>
            <div className="h-72 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialStats?.activityTrends || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.2)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderRadius: '16px',
                      border: '1px solid hsl(var(--border)/0.5)',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        {/* Financial Distribution */}
        <FadeIn delay={0.5}>
          <div className="premium-card p-8 rounded-[3rem] border border-border/10 h-full">
            <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Asset Liquidity</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialStats?.categoryDistribution || []}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(financialStats?.categoryDistribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderRadius: '16px',
                      border: '1px solid hsl(var(--border)/0.5)'
                    }}
                    formatter={(val: any) => [formatCurrency(val), 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 mt-6">
                {(financialStats?.categoryDistribution || []).slice(0, 5).map((entry: any, index: number) => (
                  <div key={`${entry.name}-${entry.type}-${index}`} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                        <span className="text-xs font-bold text-muted-foreground">{entry.name}</span>
                        <span className={cn(
                          "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                          entry.type === 'INCOME' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        )}>
                          {entry.type}
                        </span>
                     </div>
                     <span className="text-xs font-black text-foreground">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
         {/* Global Ledger Pulse */}
         <FadeIn delay={0.6}>
           <div className="premium-card p-8 rounded-[3rem] border border-border/10">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Global Ledger Pulse
                 </h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-3 py-1 bg-muted/30 rounded-full">30-Day Analysis</span>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600">
                          <TrendingUp className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Inflow</p>
                          <p className="text-lg font-black text-emerald-600 leading-tight">{statCards[1].value}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground">{stats?.incomeCount || 0} Entries</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-600">
                          <TrendingDown className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Outflow</p>
                          <p className="text-lg font-black text-rose-600 leading-tight">{statCards[2].value}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground">{stats?.expenseCount || 0} Entries</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                          <DollarSign className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Net Platform Volume</p>
                          <p className="text-lg font-black text-primary leading-tight">{formatCurrency((financialStats?.summary?.totalIncome || 0) - (financialStats?.summary?.totalExpense || 0))}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         </FadeIn>

         {/* System Infrastructure */}
         <FadeIn delay={0.7}>
           <div className="premium-card p-8 rounded-[3rem] border border-border/10">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Globe className="h-5 w-5 text-amber-500" />
                    Infrastructure Core
                 </h3>
                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Admin Logs', value: stats?.totalLogs || 0, icon: History },
                   { label: 'Active Budget Limiters', value: stats?.activeBudgets || 0, icon: Scale },
                   { label: 'Recurring Automations', value: stats?.activeRecurring || 0, icon: BarChart3 },
                   { label: 'System Categories', value: stats?.systemCategories || 0, icon: Globe },
                 ].map((item) => (
                   <div key={item.label} className="p-4 rounded-2xl bg-muted/10 border border-border/5 hover:border-border/20 transition-all">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">{item.label}</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-xl font-black text-foreground">{item.value}</span>
                         <span className="text-muted-foreground/40"><item.icon className="h-3 w-3" /></span>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-muted/20 border border-dashed border-border/20 flex items-center justify-center gap-3">
                 <p className="text-[10px] font-bold text-muted-foreground/60">Operational status optimized for serverless architecture.</p>
              </div>
           </div>
         </FadeIn>
      </div>
    </div>
  );
}

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

const History = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);
