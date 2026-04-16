'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, ShieldX, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn, SlideIn } from '@/components/ui/FramerMotion';

interface Signal {
  type: 'TRUST' | 'RISK' | 'INFO';
  message: string;
  impact: number;
}

interface RiskProfile {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  signals: Signal[];
}

interface RiskProfileCardProps {
  riskProfile?: RiskProfile;
}

export const RiskProfileCard = ({ riskProfile }: RiskProfileCardProps) => {
  if (!riskProfile) return null;

  const { score, level, signals, recommendation = "Analyzing signals..." } = riskProfile;

  const getLevelColor = () => {
    if (level === 'LOW') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (level === 'MEDIUM') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getScoreColor = () => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getIcon = () => {
    if (level === 'LOW') return <ShieldCheck className="h-6 w-6" />;
    if (level === 'MEDIUM') return <Shield className="h-6 w-6" />;
    return <ShieldX className="h-6 w-6" />;
  };

  return (
    <FadeIn>
      <div className="premium-card p-8 rounded-[3rem] border border-border/10 h-full relative overflow-hidden group">
        {/* Background Accent */}
        <div className={cn(
          "absolute -right-20 -top-20 w-64 h-64 blur-3xl opacity-10 transition-colors duration-500 rounded-full",
          level === 'LOW' ? "bg-emerald-500" : level === 'MEDIUM' ? "bg-amber-500" : "bg-rose-500"
        )} />

        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("p-2 rounded-xl border", getLevelColor())}>
                {getIcon()}
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", getScoreColor())}>
                Risk Assessment: {level}
              </span>
            </div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Security Confidence</h2>
            <p className="text-xs font-bold text-muted-foreground mt-1">Real-time analytical trust score.</p>
          </div>

          <div className="flex flex-col items-end">
             <div className={cn("text-5xl font-black tracking-tighter tabular-nums", getScoreColor())}>
               {score}<span className="text-xl text-muted-foreground/40 font-bold">%</span>
             </div>
             <div className="w-24 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    level === 'LOW' ? "bg-emerald-500" : level === 'MEDIUM' ? "bg-amber-500" : "bg-rose-500"
                  )} 
                  style={{ width: `${score}%` }}
                />
             </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Behavioral Signals</h3>
           
           <div className="grid grid-cols-1 gap-3">
              {signals.map((signal, i) => (
                <SlideIn key={i} delay={i * 0.1}>
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                    signal.type === 'TRUST' ? "bg-emerald-500/5 border-emerald-500/10" : 
                    signal.type === 'RISK' ? "bg-rose-500/5 border-rose-500/10" : 
                    "bg-muted/10 border-border/10"
                  )}>
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      signal.type === 'TRUST' ? "text-emerald-500" : 
                      signal.type === 'RISK' ? "text-rose-500" : 
                      "text-muted-foreground"
                    )}>
                      {signal.type === 'TRUST' ? <CheckCircle2 className="h-4 w-4" /> : 
                       signal.type === 'RISK' ? <ShieldAlert className="h-4 w-4" /> : 
                       <Info className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] font-bold text-foreground leading-tight">{signal.message}</p>
                    </div>
                    {signal.impact !== 0 && (
                      <div className={cn(
                        "text-[10px] font-black tabular-nums whitespace-nowrap px-2 py-0.5 rounded-full bg-background/50",
                        signal.impact > 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {signal.impact > 0 ? '+' : ''}{signal.impact} pts
                      </div>
                    )}
                  </div>
                </SlideIn>
              ))}
           </div>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-muted/20 border border-dashed border-border/20 flex items-center gap-3 relative z-10">
           <div className={cn(
             "p-1.5 rounded-lg shrink-0",
             level === 'LOW' ? "bg-emerald-500/10 text-emerald-500" :
             level === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
             "bg-rose-500/10 text-rose-500"
           )}>
              <Info className="h-3 w-3" />
           </div>
           <p className="text-[10px] font-black leading-relaxed uppercase tracking-tighter text-foreground">
             <span className="text-muted-foreground mr-1">Staff Advisory:</span>
             {recommendation}
           </p>
        </div>
      </div>
    </FadeIn>
  );
};
