'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Legend
} from 'recharts';
import { useCurrency } from '@/context/CurrencyContext';
import { capitalize, cn } from '@/lib/utils';

interface DashboardChartsProps {
  stats: any;
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const { formatCurrency } = useCurrency();

  // pre-computed monthly trends from service (now includes year context from backend)
  const data = stats?.monthlyTrends?.map((m: any) => ({ ...m, netBalance: m.income - m.expense })) || [];

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Data Available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative group min-h-[320px] sm:min-h-[400px] overflow-hidden p-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }} barGap={8}>
          <defs>
            <linearGradient id="colorIncomeDash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="colorExpenseDash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="colorBalanceTrendDash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary))" opacity={0.05} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, opacity: 0.3 }}
            dy={15}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--primary) / 0.03)', radius: 10 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-2xl border-white/10 backdrop-blur-xl transition-all duration-300 min-w-[180px] sm:min-w-[220px]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 sm:mb-5 font-bold italic">{item.month}</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                          <span className="text-xs font-bold text-foreground/80 lowercase">Income &nbsp;</span>
                        </div>
                        <span className="text-xs font-black tabular-nums text-emerald-500">{formatCurrency(item.income)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                          <span className="text-xs font-bold text-foreground/80 lowercase">Expense &nbsp;</span>
                        </div>
                        <span className="text-xs font-black tabular-nums text-rose-500">{formatCurrency(item.expense)}</span>
                      </div>
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 font-bold">Net</span>
                         <span className={cn(
                           "text-xs font-black tabular-nums font-bold",
                           item.netBalance >= 0 ? "text-primary" : "text-rose-500"
                         )}>
                           {item.netBalance >= 0 ? '+' : ''}{formatCurrency(item.netBalance)}
                         </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="income"
            fill="url(#colorIncomeDash)"
            name="Income"
            radius={[4, 4, 0, 0]}
            barSize={typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24}
            animationDuration={1500}
          />
          <Bar
            dataKey="expense"
            fill="url(#colorExpenseDash)"
            name="Expense"
            radius={[4, 4, 0, 0]}
            barSize={typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 4}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
            name="Cumulative Trend"
            animationDuration={2000}
          />
          <Area
            type="monotone"
            dataKey="balance"
            fill="url(#colorBalanceTrendDash)"
            stroke="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
