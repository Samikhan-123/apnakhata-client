'use client';

import React from 'react';
import { Heart, ShieldCheck, Zap, TrendingUp, Gem } from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';

export default function ManifestoPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-24">
      <header className="text-center space-y-6">
        <SlideIn duration={0.5}>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Vision</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
            Our <br /> <span className="text-primary italic">Manifesto.</span>
          </h1>
          <p className="text-muted-foreground text-xl font-bold max-w-xl mx-auto mt-8 leading-relaxed">
            We believe that financial peace shouldn't be a luxury. It should be the default.
          </p>
        </SlideIn>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <FadeIn delay={0.2}>
          <div className="premium-card p-10 rounded-[3rem] border-border/40 h-full">
            <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">Radical Simple</h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Most apps are built to keep you scrolling. We build to get you in, recorded, and back to your life. Simple is harder than complex, but it's always better.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="premium-card p-10 rounded-[3rem] border-border/40 h-full">
            <div className="w-14 h-14 bg-rose-500/5 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">Human Centered</h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              You aren't a data point. You're a human being trying to build a better future. Every feature we build starts with how it makes you feel.
            </p>
          </div>
        </FadeIn>
      </section>

      <article className="prose prose-emerald dark:prose-invert max-w-none space-y-8">
        <FadeIn delay={0.4}>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Why we built Apna Khata?</h2>
          <p className="text-lg text-muted-foreground font-medium leading-8">
            Apna Khata was born out of frustration. Frustration with apps that felt like casinos, apps that sold your data, and apps that were so complex you needed a degree in finance to use them.
          </p>
          <p className="text-lg text-muted-foreground font-medium leading-8">
            We wanted something elegant. Something that felt like a tool, not a trap. A place where you can see your financial truth without the noise. 
          </p>
          <p className="text-lg text-muted-foreground font-medium leading-8">
            Our mission is simple: To empower every individual with the clarity they need to live a life free from financial anxiety. 
          </p>
        </FadeIn>
      </article>

      {/* Founder's Story Section */}
      <FadeIn delay={0.5}>
        <div className="premium-card p-12 md:p-16 rounded-[3.5rem] border-primary/20 bg-primary/[0.02] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-primary/30" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">A Note from the Founder</p>
            </div>
            
            <div className="max-w-3xl space-y-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">
                  "Apna Khata is my promise to <br /> 
                  <span className="text-primary italic">simplify your financial journey.</span>"
                </h2>
                
                <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                   <p>
                     I still remember watching my father sit with three different paper diaries at the end of every month. He would spend hours trying to reconcile debts, savings, and household expenses. It wasn't just math; it was a visible weight of responsibility on his shoulders.
                   </p>
                   <p>
                     When I started my own financial journey, I tried the apps. But they felt cold. They were full of ads, or so complicated that I stopped using them after a week. There was no 'soul' in the digital tools that were supposed to help us. 
                   </p>
                   <p>
                     That's why I built **Apna Khata**. I wanted to take that traditional, trustworthy 'Khata' system—the one that has lived in our shops and homes for generations—and give it a modern, elegant digital home. 
                   </p>
                   <p>
                     It's built for humans, not for accountants. No data selling, no hidden traps. Just clarity, heart, and a tool you can actually trust.
                   </p>
                </div>
            </div>

            <div className="pt-8 border-t border-border/40 flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                 SK
               </div>
               <div>
                  <h4 className="text-xl font-black text-foreground tracking-tight">Sami Khan</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">Founding Developer</p>
               </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.6}>
        <div className="bg-primary/5 rounded-[3rem] p-12 text-center border border-primary/10">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-black tracking-tight mb-4 text-foreground">Join the Movement</h3>
          <p className="text-muted-foreground font-bold mb-8">Ready to take control? It starts with one entry.</p>
          <a href="/register" className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black transition-all hover:scale-105 shadow-xl shadow-primary/20">
            Create Free Account
          </a>
        </div>
      </FadeIn>
    </div>
  );
}
