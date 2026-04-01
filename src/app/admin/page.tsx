'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { useCurrency } from '@/context/CurrencyContext';
import { Users, ReceiptText, BarChart3, TrendingUp, ShieldAlert, ArrowUpRight, Scale } from 'lucide-react';
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
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-12 w-64 bg-muted rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
      </div>
    </div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'primary', suffix: 'Accounts' },
    { title: 'System Volume', value: formatCurrency(stats?.totalVolume || 0), icon: Scale, color: 'emerald', suffix: 'Total Flow' },
    { title: 'Total Entries', value: stats?.totalEntries || 0, icon: ReceiptText, color: 'amber', suffix: 'Records' },
    { title: 'Monthly Growth', value: stats?.newUsersLast30Days || 0, icon: TrendingUp, color: 'rose', suffix: 'New Users' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary/10 p-2 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Admin Control Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">System Overview</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg">Real-time metrics and platform health diagnostics.</p>
        </SlideIn>
      </header>

      {/* Grid */}
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
            </div>
          </SlideIn>
        ))}
      </div>

      {/* Main Charts Placeholder/Future */}
      <FadeIn delay={0.4}>
        <div className="premium-card rounded-[2.5rem] p-8 border border-border/10">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">User Activity Trends</h3>
                <p className="text-sm text-muted-foreground/60">Registered users over time (Sample Data)</p>
              </div>
              <Button variant="outline" className="rounded-xl font-bold h-9">
                Export Data
              </Button>
           </div>
 
           <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.userTrends || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '16px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      border: '1px solid hsl(var(--border)/0.5)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontWeight: 'bold' }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="New Users"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </FadeIn>
    </div>
  );
}
