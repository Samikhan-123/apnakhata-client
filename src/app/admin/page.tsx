'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import { Users, ReceiptText, BarChart3, TrendingUp, ShieldAlert, ArrowUpRight, Scale, Globe, TrendingDown, DollarSign } from 'lucide-react';
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [financialStats, setFinancialStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { currency, formatCurrency } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, finRes] = await Promise.all([
          adminService.getStats(),
          adminService.getFinancialStats()
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (finRes.success) setFinancialStats(finRes.data);
      } catch (error) {
        // Handled by interceptor
      } finally {
        setLoading(false);
      }
    };
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
      subtext: `${stats?.incomeCount || 0} Transactions`
    },
    { 
      title: 'Monthly Out-flow', 
      value: formatCurrency(financialStats?.summary?.totalExpense || 0), 
      icon: TrendingDown, 
      color: 'rose', 
      suffix: 'Expenses',
      subtext: `${stats?.expenseCount || 0} Transactions`
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
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary/10 p-2 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Financial Overview</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Platform Insights</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg">Cross-platform financial snapshots and growth metrics.</p>
        </SlideIn>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <SlideIn key={stat.title} delay={i * 0.1} duration={0.5}>
            <div className="premium-card p-6 rounded-3xl group hover:border-primary/20 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-3 rounded-xl border transition-colors",
                  stat.color === 'primary' ? 'bg-primary/5 border-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground' :
                  stat.color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' :
                  stat.color === 'amber' ? 'bg-amber-500/5 border-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' :
                  'bg-rose-500/5 border-rose-500/10 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{stat.title}</span>
                   <span className="text-[10px] font-bold text-muted-foreground/30 mt-0.5">{stat.suffix}</span>
                </div>
              </div>
              <div className="text-2xl font-black tracking-tight text-foreground">{stat.value}</div>
              {stat.subtext && <p className="text-[10px] font-medium text-muted-foreground/60 mt-2">{stat.subtext}</p>}
            </div>
          </SlideIn>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Volume Trend Chart */}
        <FadeIn delay={0.4} className="lg:col-span-2">
          <div className="premium-card rounded-[2.5rem] p-8 border border-border/10 h-full">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Platform Cash Flow</h3>
                  <p className="text-sm text-muted-foreground/60">Income vs Expenses (Last 30 Days)</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">In-flow</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Out-flow</span>
                   </div>
                </div>
             </div>
  
             <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialStats?.volumeTrends || []}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }} 
                      tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(val: number) => {
                        const symbol = currency === 'PKR' ? 'Rs' : (currencies.find((c: any) => c.code === currency)?.symbol || '');
                        const formattedVal = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val;
                        return `${symbol}${formattedVal}`;
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '16px',
                        border: '1px solid hsl(var(--border)/0.5)',
                        padding: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      name="In-flow"
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      name="Out-flow"
                      stroke="#f43f5e" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorExpense)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </FadeIn>

        {/* Category Distribution Chart */}
        <FadeIn delay={0.5}>
          <div className="premium-card rounded-[2.5rem] p-8 border border-border/10 h-full">
            <h3 className="text-xl font-bold mb-2">Category Spread</h3>
            <p className="text-sm text-muted-foreground/60 mb-8">Platform-wide categorization</p>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialStats?.categoryDistribution || []}
                    cx="50%"
                    cy="50%"
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
                 <div key={`${entry.name}-${entry.type}`} className="flex items-center justify-between">
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

      {/* Tertiary Row: Currency Preferences & User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FadeIn delay={0.6}>
           <div className="premium-card rounded-[2.5rem] p-8 border border-border/10 h-full">
              <div className="flex items-center gap-3 mb-6">
                 <Globe className="h-5 w-5 text-primary" />
                 <h3 className="text-xl font-bold">Preferred Currencies</h3>
              </div>
              <div className="space-y-6">
                 {(financialStats?.currencyDistribution || []).map((curr: any, i: number) => (
                   <div key={curr.currency} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-muted-foreground uppercase">{curr.currency}</span>
                         <span className="text-foreground">{curr.userCount} Users</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary transition-all duration-1000" 
                           style={{ width: `${(curr.userCount / stats?.totalUsers) * 100}%` }}
                         />
                      </div>
                   </div>
                 ))}
                 {!financialStats?.currencyDistribution?.length && <p className="text-xs text-muted-foreground text-center py-8 italic">No currency data yet.</p>}
              </div>
           </div>
        </FadeIn>

        <FadeIn delay={0.7} className="lg:col-span-2">
           <div className="premium-card rounded-[2.5rem] p-8 border border-border/10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold">Engagement (Daily Active Users)</h3>
                 <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/5 rounded-full border border-amber-500/10">
                    <Users className="h-3 w-3 text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-700">User Activity</span>
                 </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialStats?.activityTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border)/0.5)' }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </FadeIn>
      </div>

      {/* Health Monitoring Section */}
      <FadeIn delay={0.8}>
         <div className="premium-card rounded-[2.5rem] p-8 border border-border/10">
            <h3 className="text-xl font-bold mb-8">Platform Health & Aggregates</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="p-6 bg-muted/30 rounded-3xl border border-border/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Scale</p>
                  <p className="text-xl font-black text-foreground">{formatCurrency(financialStats?.summary?.totalIncome + financialStats?.summary?.totalExpense)}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Gross Monetary Activity</p>
               </div>
               <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">In-flow Ratio</p>
                  <p className="text-xl font-black text-emerald-700">
                    {financialStats?.summary?.totalIncome > 0 
                      ? ((financialStats.summary.totalIncome / (financialStats.summary.totalIncome + financialStats.summary.totalExpense)) * 100).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-[10px] text-emerald-600/60 mt-1">Of total platform volume</p>
               </div>
               <div className="p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Out-flow Ratio</p>
                  <p className="text-xl font-black text-rose-700">
                    {financialStats?.summary?.totalExpense > 0 
                      ? ((financialStats.summary.totalExpense / (financialStats.summary.totalIncome + financialStats.summary.totalExpense)) * 100).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-[10px] text-rose-600/60 mt-1">Operational burn rate</p>
               </div>
               <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col justify-center">
                  <p className="text-xs font-bold text-primary mb-2 text-center">Export Full Financial History</p>
                  <Button variant="outline" className="h-9 rounded-xl border-primary/20 text-primary hover:bg-primary/10">Generate Report</Button>
               </div>
            </div>
         </div>
      </FadeIn>
    </div>
  );
}
