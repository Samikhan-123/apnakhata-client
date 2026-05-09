"use client";

import React from "react";
import { AIAdvisor } from "@/components/features/AIAdvisor";
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { Brain, Sparkles, Lightbulb, Target, TrendingUp } from "lucide-react";

export default function AIAdvisorPage() {
  return (
    <div className="space-y-10 pb-20 w-full overflow-hidden">
      {/* Header Section */}
      <SlideIn duration={0.5}>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-5xl flex items-center gap-4">
              <Brain className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              Apna Khata AI Advisor
            </h1>
            <p className="text-muted-foreground font-medium mt-2 text-base sm:text-lg">
              Personalized financial insights powered by <span className="text-primary font-bold">Google Gemini AI</span>.
            </p>
          </div>
        </header>
      </SlideIn>

      {/* Main Advisor Component */}
      <FadeIn delay={0.2} duration={0.6}>
        <AIAdvisor />
      </FadeIn>

      {/* Educational/Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Smart Analysis",
            description: "Deep dive into your monthly spending patterns and hidden trends.",
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
          },
          {
            title: "Growth Tips",
            description: "Personalized advice on how to save more and reach your goals faster.",
            icon: Lightbulb,
            color: "text-amber-500",
            bg: "bg-amber-500/5",
          },
          {
            title: "Trend Forecasting",
            description: "Predict future expenses based on your current financial pulse.",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
          },
        ].map((feature, i) => (
          <FadeIn key={i} delay={0.3 + i * 0.1}>
            <div className="premium-card p-6 rounded-2xl md:rounded-3xl h-full border border-border/40 hover:border-primary/20 transition-all group">
              <div className={`${feature.bg} ${feature.color} w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Pro Tip Banner */}
      <FadeIn delay={0.6}>
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-primary/5 border border-primary/10 p-6 md:p-10">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <Sparkles size={200} className="text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-primary text-primary-foreground rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
              <Sparkles size={28} className="md:w-8 md:h-8" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-black text-foreground mb-2 uppercase tracking-tight">Pro Tip: Keep your categories consistent</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl">
                The AI Advisor works best when you use consistent categories for your expenses. This allows Gemini to identify long-term patterns and give you more accurate savings advice.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
