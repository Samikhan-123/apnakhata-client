"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ledgerEntryService } from "@/services/ledger-entry.service";
import { DashboardCharts } from "@/components/features/DashboardCharts";
import { useCurrency } from "@/context/CurrencyContext";
import { recurringService } from "@/services/recurring.service";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";

import { ErrorState } from "@/components/ui/ErrorState";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const statsData = await ledgerEntryService.getStats();
      if (statsData) {
        setStats(statsData);
        setLedgerEntries(statsData.recentEntries || []);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to connect to the server",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Background Auto-Sync for Recurring Tasks
  useEffect(() => {
    const triggerSync = async () => {
      try {
        const result = await recurringService.processManual();
        // If system actually updated data, refresh the dashboard stats silently
        if (result.count > 0 && result.successCount > 0) {
          fetchData(true);
        }
      } catch (err) {
        // Silently fail, don't disturb user experience
        // console.error("Auto-sync failed:", err);
      }
    };

    triggerSync();
  }, []); // Only once per dashboard visit

  // Logical Separation: Balance is Global, Flow is Monthly
  const allTimeBalance = stats?.overview?.balance || 0;
  const monthlyIncome = stats?.overview?.totalIncome || 0;
  const monthlyExpense = stats?.overview?.totalExpense || 0;

  if (loading) return <DashboardSkeleton />;

  return (
    // main container
    <div className="space-y-12 pb-20 w-full overflow-hidden ">
      <SlideIn duration={0.5}>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
              Dashboard
            </h1>
            <p className="text-muted-foreground font-medium mt-2 text-lg">
              Hello,{" "}
              <span className="text-foreground font-bold">
                {user?.name?.split(" ")[0]}
              </span>
              . Here is your financial summary.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/ledger">
              <Button className="rounded-xl h-11 px-6 font-bold shadow-sm gap-2 hover:bg-primary/90 active:scale-95 transition-all">
                <PlusCircle className="h-4 w-4" />
                <span>Go to Ledger</span>
              </Button>
            </Link>
          </div>
        </header>
      </SlideIn>

      {error ? (
        <ErrorState
          title="Overview Unavailable"
          message={error}
          onRetry={fetchData}
          className="py-24"
        />
      ) : (
        <>
          {/* Stats Grid -  Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                label: "Total Balance",
                value: allTimeBalance,
                icon: Wallet,
                color: "primary",
                description: "Available funds",
              },
              {
                label: "Monthly Inflow",
                value: monthlyIncome,
                icon: ArrowUpRight,
                color: "emerald",
                description: "Total received",
              },
              {
                label: "Monthly Outflow",
                value: monthlyExpense,
                icon: ArrowDownLeft,
                color: "rose",
                description: "Total spent",
              },
            ].map((stat, i) => (
              <SlideIn key={stat.label} delay={0.1 + i * 0.1} duration={0.5}>
                <div className="premium-card rounded-3xl p-7 group relative overflow-hidden h-full">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={cn(
                          "p-3 rounded-xl shadow-sm border",
                          stat.color === "primary"
                            ? "bg-primary/5 text-primary border-primary/10"
                            : stat.color === "emerald"
                              ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                              : "bg-rose-500/5 text-rose-600 border-rose-500/10",
                        )}
                      >
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight tabular-nums text-foreground mb-1">
                        {formatCurrency(stat.value)}
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground/60">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>

          {/* Analytics Section - Massive Panel */}
          <FadeIn delay={0.4} duration={0.6}>
            <div className="premium-card rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    Finance Flow
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground/60 mt-1">
                    Rolling 6-month pulse of your wealth movement
                  </p>
                </div>
                <div className="flex flex-wrap gap-6 bg-muted/20 p-3.5 rounded-xl border border-border/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Balance
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Inflow
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Outflow
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[450px]">
                <DashboardCharts stats={stats} />
              </div>
            </div>
          </FadeIn>
        </>
      )}
    </div>
  );
}
