'use client';

import React from 'react';
import { Scale, FileText, CheckCircle2 } from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <header className="mb-20 text-center">
        <SlideIn duration={0.5}>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Agreement</p>
          <h1 className="text-6xl font-black tracking-tighter mt-4">Terms of <span className="text-primary italic">Service.</span></h1>
          <p className="text-muted-foreground font-bold mt-6 italic">Simple rules for a better relationship.</p>
        </SlideIn>
      </header>

      <div className="space-y-12 bg-card/40 backdrop-blur-sm p-12 rounded-[3.5rem] border border-border/40">
        <FadeIn delay={0.2}>
          <div className="space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-4 text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg"><Scale className="text-primary h-5 w-5"/></div>
              Acceptance of Terms
            </h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              By accessing or using Apna Khata, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our service. We aim to keep these terms as human-readable as possible.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="space-y-6 pt-6 border-t border-border/40">
            <h3 className="text-2xl font-black flex items-center gap-4 text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg"><FileText className="text-primary h-5 w-5"/></div>
              Usage & Responsibility
            </h3>
            <ul className="space-y-4">
              {[
                "You are responsible for maintaining the security of your account.",
                "You must provide accurate and complete information when registering.",
                "The service is provided 'as is' without warranties of any kind.",
                "We reserve the right to modify or terminate the service for any reason."
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground font-bold text-sm">
                  <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="space-y-6 pt-6 border-t border-border/40">
             <h3 className="text-2xl font-black flex items-center gap-4 text-foreground text-primary uppercase tracking-tighter italic">Limitations</h3>
             <p className="text-muted-foreground font-medium leading-relaxed italic">
               Apna Khata is an expense tracker, not a financial advisor. While we help you see your data, any financial decisions you make are your own responsibility. Use common sense.
             </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
