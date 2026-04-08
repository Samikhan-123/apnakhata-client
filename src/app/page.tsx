'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, PieChart, Zap, CheckCircle2, TrendingUp, Wallet, Clock, Sparkles as SparklesIcon } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Motion Definitions (Senior Standard) ---
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

// --- Pro Components ---
function SpotlightCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-30"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// --- Magic UI Components ---
function RetroGrid() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden [perspective:200px] pointer-events-none opacity-20 dark:opacity-70 bg-blue-500/10">
      <motion.div 
        animate={{ translateY: [0, 40] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 [transform:rotateX(35deg)]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          height: '200%',
          width: '100%'
        }}
      />
    </div>
  );
}

function BackgroundBeams() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {[1, 2, 3].map((v) => (
        <motion.div
           key={v}
           initial={{ top: `${20 * v}%`, left: '-10%', opacity: 0 }}
           animate={{ left: '110%', opacity: [0, 1, 0] }}
           transition={{ duration: 10 + v * 2, repeat: Infinity, delay: v * 3, ease: "linear" }}
           className="absolute h-[1px] w-[20%] bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px]"
        />
      ))}
    </div>
  );
}

function MagicSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, (i % 2 === 0 ? 20 : -20)], y: [0, (i % 3 === 0 ? -20 : 20)] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          className="absolute w-1 h-1 bg-primary/60 rounded-full blur-[1px]"
          style={{ top: `${20 + i * 15}%`, left: `${10 + i * 15}%` }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative">
      {/* Pro Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      <PublicHeader />

      {/* Hero Section - Professional & Theme-Aware */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative bg-background overflow-hidden border-b border-border/40">
        {/* Advanced Backdrop Strategy */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* 1. Technical Grids & Beams (Magic UI Style) */}
          <RetroGrid />
          <BackgroundBeams />
          
          {/* 2. SaaS Orbs (Subtle Decorative Backgrounds) */}
          <div className="absolute top-[15%] left-[5%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] bg-sky-500/10 rounded-full blur-[120px] opacity-30" />
          
          {/* 3. Primary Spotlight Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.08)_0%,transparent_70%)]" />
          
          {/* 4. Orchid Texture */}
          {/* <div className="absolute inset-0 bg-orchid-texture bg-cover bg-center opacity-50 dark:opacity-" /> */}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/5 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
          >
            <Zap className="h-3 w-3 fill-current" />
            The Clarity Your Money Deserves
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[8.5rem] font-black tracking-tighter leading-[0.82] mb-10 relative"
          >
            <span className="relative z-10">Forget the paper. </span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-sky-500 italic relative z-10 py-2">
               Own your history.
               <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 blur-sm rounded-full" />
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl font-bold leading-relaxed mb-16 backdrop-blur-[2px] py-4"
          >
            No more messy paper lines or forgetting where your money went. Just add your monthly income, track daily expenses, and let Apna Khata handle the rest.
          </motion.p>

          <motion.div 
             variants={fadeInUp}
             initial="initial"
             whileInView="whileInView"
             viewport={{ once: true }}
             transition={{ delay: 0.4 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white text-base font-black transition-all shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)] active:scale-95 group relative overflow-hidden">
                <MagicSparkles />
                <span className="relative z-10 flex items-center">
                  Join the Premium Experience
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Button>
            </Link>
            <div className="flex flex-col items-center sm:items-start opacity-60">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trusted by developers</p>
               <p className="text-xs font-bold text-muted-foreground leading-none mt-1">Start tracking in seconds</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-slate-900/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-24 space-y-4"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
               <SparklesIcon size={12} /> Technical Excellence
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Engineered for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-500 font-black italic">Financial Clarity.</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]"
          >
            {/* Cell 1: Large */}
            <motion.div variants={fadeInUp} className="md:col-span-2 md:row-span-2 relative group">
              <SpotlightCard className="h-full rounded-[2.5rem] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.2)] transition-shadow duration-500">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/50 to-sky-500/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative h-full bg-card/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-12 flex flex-col justify-between shadow-2xl transition-all hover:translate-y-[-4px] hover:border-primary/20">
                  <div className="space-y-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
                      <Wallet size={32} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-4xl font-black tracking-tight">The Modern Standard</h3>
                      <p className="text-muted-foreground font-bold text-lg leading-relaxed max-w-sm">No more paper legacy. Just pure, multi-threaded financial tracking that syncs with your digital life.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 p-6 bg-primary/5 dark:bg-white/5 rounded-3xl border border-primary/10 transition-colors group-hover:bg-primary/20">
                    {['Auto Balance', 'Instant Entry', 'Smart Budgets', 'Reports'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-black text-muted-foreground group-hover:text-foreground transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-primary" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Cell 2: Security */}
            <motion.div variants={fadeInUp} className="md:col-span-2 relative group">
              <SpotlightCard className="h-full rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.1)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)] transition-shadow duration-500">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/30 to-transparent rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-500" />
                <div className="relative h-full bg-card/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-10 flex items-center gap-8 shadow-2xl transition-all hover:translate-y-[-4px] hover:border-emerald-500/20">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black tracking-tight">Bank-Grade Privacy</h4>
                    <p className="text-muted-foreground font-bold text-base leading-relaxed">Your wealth is your business. Every record is encrypted and localized.</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Cell 3 */}
            <motion.div variants={fadeInUp} className="relative group">
               <SpotlightCard className="h-full rounded-[2.5rem] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.05)] hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] transition-shadow duration-500">
                  <div className="relative h-full bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center space-y-4 shadow-xl transition-all hover:translate-y-[-4px] hover:border-sky-500/30">
                    <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 group-hover:rotate-12 transition-transform">
                      <Clock size={28} />
                    </div>
                    <div>
                      <h5 className="font-black tracking-tight text-xl mb-1">Deep History</h5>
                      <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em] opacity-60">Archive Sync</p>
                    </div>
                  </div>
               </SpotlightCard>
            </motion.div>

            {/* Cell 4 */}
            <motion.div variants={fadeInUp} className="relative group">
               <SpotlightCard className="h-full rounded-[2.5rem] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.05)] hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] transition-shadow duration-500">
                  <div className="relative h-full bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 dark:border-primary/10 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl transition-all hover:translate-y-[-4px] hover:bg-primary/5 group">
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(i => <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} className="h-1 w-6 bg-primary/40 rounded-full" />)}
                    </div>
                    <div>
                      <h5 className="font-black tracking-tight text-xl">Sami Khan</h5>
                      <p className="text-primary font-black text-[10px] uppercase tracking-widest">Lead Developer & Founder</p>
                    </div>
                  </div>
               </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Premium Visuals */}
      <section className="py-40 bg-background/50 relative overflow-hidden border-y border-border/40">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center"
          >
            <div className="space-y-16">
              <div className="space-y-6">
                <motion.p variants={fadeInUp} className="text-xs font-black uppercase tracking-[0.6em] text-primary">Deployment Strategy</motion.p>
                <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">
                  Control your economy, <br />
                  <span className="italic opacity-50 text-muted-foreground">one entry at a time.</span>
                </motion.h2>
              </div>
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Starting Capital', desc: 'Define your starting monthly balance. This establishes your budget ceiling.' },
                  { step: '02', title: 'Instant Logs', desc: 'Log expenses as they happen with one-click categorization.' },
                  { step: '03', title: 'Real-time Analytics', desc: 'Visualize your drawdown and remaining liquidity in real-time.' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="flex gap-8 group cursor-default">
                    <span className="text-6xl font-black text-primary/10 group-hover:text-primary transition-colors duration-500">{item.step}</span>
                    <div className="space-y-2">
                      <h4 className="font-black text-2xl tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground font-bold text-base leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div variants={fadeInUp} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-sky-500 rounded-[4rem] blur-3xl opacity-10 animate-pulse" />
              <div className="relative bg-white dark:bg-slate-900 border border-border/60 rounded-[3.5rem] p-2 shadow-[0_30px_70px_rgba(var(--primary-rgb),0.25)] rotate-3 hover:rotate-0 transition-all duration-700">
                <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-12 space-y-10 shadow-inner">
                   <div className="flex justify-between items-center border-b border-border/40 pb-8">
                     <div className="space-y-2"><div className="w-16 h-2 bg-primary/20 rounded-full" /><div className="w-24 h-4 bg-foreground rounded-full" /></div>
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"><TrendingUp className="text-primary h-8 w-8" /></div>
                   </div>
                   <div className="space-y-6">
                      <div className="h-16 bg-muted/40 rounded-2xl flex items-center px-6"><div className="w-full h-3 bg-muted/60 rounded-full" /></div>
                      <div className="grid grid-cols-2 gap-4"><div className="h-24 bg-primary/5 rounded-3xl border border-primary/10" /><div className="h-24 bg-sky-500/5 rounded-3xl border border-sky-500/10" /></div>
                      <div className="h-32 bg-foreground dark:bg-white rounded-3xl flex items-center justify-center group overflow-hidden relative cursor-pointer">
                         <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                         <p className="relative z-10 text-background dark:text-foreground font-black uppercase tracking-widest text-xs group-hover:text-white">Authorize</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Modern Architecture */}
      <section className="py-40 relative bg-card/30 border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-24"
          >
            {[
              { icon: TrendingUp, title: 'Growth Vectors', desc: 'Visualize your spending trends with automated trend detection and historical layering.', shadow: 'shadow-primary/20' },
              { icon: PieChart, title: 'Constraints', desc: 'Set monthly limits for categories. Systemic warnings prevent overdraw.', shadow: 'shadow-sky-500/20' },
              { icon: ShieldCheck, title: 'Encrypted Core', desc: 'Every ledger entry is hashed and protected using bank-grade security protocols.', shadow: 'shadow-emerald-500/20' }
            ].map((trust, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-8 group hover:translate-y-[-8px] transition-all">
                <div className={cn("w-20 h-20 bg-card border border-border rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500", trust.shadow)}>
                  <trust.icon size={36} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-black tracking-tight">{trust.title}</h4>
                  <p className="text-muted-foreground font-bold text-base leading-relaxed">{trust.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ - Sapphire Deep */}
      <section className="py-40 bg-background text-foreground relative overflow-hidden border-t border-border/40">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] opacity-50" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeInUp} className="text-5xl font-black tracking-tighter">Frequently <br /> Encountered Questions.</motion.h2>
          </motion.div>
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6">
            {[
              { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and never store your raw password.' },
              { q: 'Can I export my data?', a: 'Currently in development. Soon you will be able to export as PDF/Excel.' },
              { q: 'Is it free to use?', a: 'Apna Khata offers a robust free tier for personal use. Professional tools for all.' }
            ].map((faq, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group bg-card/50 border border-border/50 rounded-3xl p-10 hover:bg-card/80 transition-all hover:border-primary/50 cursor-pointer shadow-[0_10px_30px_rgba(var(--primary-rgb),0.05)] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)]">
                <h4 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-4"><span className="text-primary">/</span> {faq.q}</h4>
                <p className="text-muted-foreground font-bold text-sm leading-relaxed max-w-2xl">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
