'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useCurrency } from '@/context/CurrencyContext';
import { capitalize } from '@/lib/utils';

interface DashboardChartsProps {
  stats: any;
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const { formatCurrency } = useCurrency();

  //  pre-computed monthly trends from service
  const data = stats?.monthlyTrends || [];

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Data Available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative group min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, opacity: 0.3 }}
            dy={15}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card rounded-2xl p-4 shadow-2xl border-primary/20 transition-all duration-300 opacity-100 scale-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{payload[0].payload.month}</p>
                    <div className="space-y-2">
                      {payload.map((item: any) => (
                        <div key={item.name} className="flex items-center justify-between gap-8">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[11px] font-bold text-foreground capitalize">{item.name}</span>
                          </div>
                          <span className="text-[11px] font-black tabular-nums">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            name="Income"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorIncome)"
            animationDuration={2000}
          />
          <Area
            type="monotone"
            name="Expense"
            dataKey="expense"
            stroke="#f43f5e"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorExpense)"
            animationDuration={2000}
          />
          <Area
            type="monotone"
            name="Remaining Balance"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorBalance)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
