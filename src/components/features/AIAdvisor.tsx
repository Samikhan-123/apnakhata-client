"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Brain, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  ShieldCheck,
  MessageSquare,
  Lightbulb,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import api from "@/services/auth.service";

interface AIInsights {
  insights: string[];
  summary: string;
  answer?: string | null;
}

const SUGGESTIONS = [
  "How can I save more?",
  "Analyze my top expenses",
  "Summarize last month",
  "Am I on budget?",
];

export function AIAdvisor() {
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const fetchInsights = async (customQuery?: string) => {
    setLoading(true);
    setError(null);
    if (customQuery) setLastQuery(customQuery);
    else setLastQuery(null);
    try {
      const response = await api.get("/ai-advisor/insights", {
        params: { 
          query: customQuery || undefined,
          currency: currency || "PKR"
        }
      });
      setInsights(response.data.data);
      if (customQuery) setQuery(""); 
    } catch (err: any) {
      setError(err.response?.data?.message || "AI Advisor is temporarily unavailable. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Search Bar & Actions Container */}
      <div className="premium-card p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 shadow-2xl shadow-primary/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Brain size={20} className="md:w-6 md:h-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                Financial <span className="text-primary">Assistant</span>
              </h2>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-foreground/80 max-w-md">
                Ask about your recent records, budgets, or get savings advice.
              </p>
              <p className="text-xs font-medium text-muted-foreground/80 flex items-start gap-1.5 max-w-md leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5 text-primary/70" />
                Gemini analyzes your data from the current and previous month to give you insights and advice. For older history, check the Reports page.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1 w-full lg:max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <input
                type="text"
                placeholder="Ask about your records, savings, or budgets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && query && fetchInsights(query)}
                className="relative w-full h-14 pl-5 pr-[110px] sm:pr-32 rounded-2xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-sm sm:text-base outline-none group-hover:border-primary/30 shadow-inner"
              />
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <Button 
                  onClick={() => query && fetchInsights(query)}
                  disabled={loading || !query}
                  size="sm"
                  className="h-10 px-3 sm:px-4 rounded-xl font-bold gap-2 shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  <span className="hidden sm:inline">Ask AI</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>

            {/* Suggestions Chips */}
            <div className="flex flex-wrap gap-2 mt-1">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(suggestion);
                    fetchInsights(suggestion);
                  }}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-primary/80 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-3 text-destructive"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 flex flex-col items-center justify-center space-y-4 py-12"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
                <div className="relative p-4 bg-background rounded-full border border-primary/20 shadow-xl">
                  <RefreshCw size={40} className="text-primary animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={18} className="text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">Analyzing Finances</h3>
                <p className="text-sm font-medium text-muted-foreground/80 mt-1 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  Gemini is crunching the numbers...
                </p>
              </div>
            </motion.div>
          )}

          {insights && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-6"
            >
              {/* === Q&A MODE (When User Asks a Question) === */}
              {insights.answer ? (
                <div className="space-y-6">
                  {/* User Question Bubble */}
                  {lastQuery && (
                    <div className="flex justify-end">
                      <div className="bg-foreground text-background px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] shadow-md">
                        <p className="text-sm font-medium leading-relaxed">{lastQuery}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-card border border-border/60 shadow-sm rounded-2xl md:rounded-3xl overflow-hidden">
                    <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                    
                    {/* The Answer */}
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <MessageSquare size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Expert Consultation</span>
                      </div>
                      <p className="text-foreground/90 leading-loose text-base whitespace-pre-line">
                        {insights.answer}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-border/40">
                      {/* TL;DR Summary */}
                      <div className="lg:col-span-1 bg-primary/5 rounded-2xl p-5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={14} className="text-primary" />
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Summary</h4>
                        </div>
                        <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                          {insights.summary}
                        </p>
                      </div>

                      {/* Action Items */}
                      <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Action Items</h4>
                        {insights.insights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-muted/30 p-3.5 rounded-xl border border-border/40">
                            <div className="mt-0.5 shrink-0 bg-primary/10 text-primary p-1 rounded-full">
                              <Target size={14} />
                            </div>
                            <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* === DASHBOARD MODE (General Overview) === */
                <div className="space-y-6">
                  {/* Clean Summary (No Italics) */}
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl md:rounded-3xl p-5 md:p-8 flex gap-6 items-center">
                    <div className="hidden md:flex shrink-0 h-16 w-16 bg-primary/10 text-primary rounded-2xl items-center justify-center">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary/60 mb-2">
                        Financial Overview
                      </h3>
                      <p className="text-base md:text-xl font-medium text-foreground leading-relaxed">
                        {insights.summary}
                      </p>
                    </div>
                  </div>

                  {/* Refined Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insights.insights.map((insight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card border border-border/60 hover:border-primary/30 p-5 rounded-2xl transition-colors shadow-sm"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                          {idx === 0 ? <TrendingUp size={16} /> : idx === 1 ? <Target size={16} /> : <Lightbulb size={16} />}
                        </div>
                        <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                          {insight}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

            {!insights && !loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center py-16 relative overflow-hidden rounded-3xl border border-dashed border-border/60 bg-muted/10"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_70%)]"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-background border border-primary/10 shadow-xl shadow-primary/5 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2">Ready for Insights?</h3>
                  <p className="text-muted-foreground font-medium text-sm sm:text-base max-w-sm mx-auto px-4 mb-6">
                    Ask a question above, or click below to get a general overview of your current month's activity.
                  </p>
                  <Button 
                    onClick={() => fetchInsights()} 
                    disabled={loading}
                    className="h-12 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all text-base"
                  >
                    Generate Monthly Overview
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
