'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Zap, Crown, ShieldCheck, Sparkles, Star, ArrowRight, BarChart3, Cloud, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PremiumExperience() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/20">
              <Crown className="w-3 h-3 fill-current" />
              The Best Experience
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Apna Khata <br />
              <span className="text-primary italic">Unlimited.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-bold max-w-2xl mx-auto">
              Unlock the full potential of your financial data with exclusive features designed for precision and professional management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: 'Full History',
                desc: 'Access every record without time limits. Your entire financial legacy at your fingertips.',
                icon: Layers,
                color: 'text-amber-500',
                bg: 'bg-amber-500/5'
              },
              {
                title: 'Smart Export',
                desc: 'Generate professional PDF and Excel reports with a single click for tax accounting.',
                icon: BarChart3,
                color: 'text-primary',
                bg: 'bg-primary/5'
              },
              {
                title: 'Multi-Device Sync',
                desc: 'Seamless, instant synchronization across all your platforms with priority backend queues.',
                icon: Cloud,
                color: 'text-sky-500',
                bg: 'bg-sky-500/5'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] border border-border/40 bg-card/50 hover:bg-card transition-all group">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-6 border border-current/10 transition-transform group-hover:scale-110`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-bold text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* <div className="bg-foreground text-background p-12 md:p-20 rounded-[3rem] text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <Zap size={120} className="rotate-12" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter relative z-10">Elevate your finances.</h2>
            <p className="text-background/60 text-lg font-bold max-w-xl mx-auto relative z-10">
              Join the premium circle of users who demand the best from their personal financial tools.
            </p>
            <div className="flex justify-center relative z-10">
              <Link href="/register">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-all text-lg font-black group">
                  Become a Pro Member
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-background/30 relative z-10">
               No credit card required for initial setup. Professional grade.
            </p>
          </div> */}
        </div>
      </main>

    </div>
  );
}
