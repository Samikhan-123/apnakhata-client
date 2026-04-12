'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, PieChart, Zap, CheckCircle2, TrendingUp, Wallet, Clock, Sparkles as SparklesIcon, Lock, Activity, Code, Banknote, BookOpen } from 'lucide-react';
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
    <div className="absolute inset-0 z-0 overflow-hidden [perspective:200px] pointer-events-none opacity-[0.05] dark:opacity-50 bg-primary/5">
      <motion.div 
        animate={{ translateY: [0, 40] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 [transform:rotateX(35deg)]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
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

import { useAuth } from '@/context/AuthContext';

// ... (in LandingPage component)
export default function LandingPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative">
      {/* Pro Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      <PublicHeader />

      {/* Hero Section - Professional & Theme-Aware */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative bg-background overflow-hidden border-b border-border/40">
        {/* ... (backdrop) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <RetroGrid />
          <BackgroundBeams />
          
          <div className="absolute top-[10%] left-[10%] w-[50rem] h-[50rem] bg-primary/5 dark:bg-primary/20 rounded-full blur-[160px] opacity-40 animate-float" />
          <div className="absolute bottom-[20%] right-[10%] w-[40rem] h-[40rem] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[140px] opacity-30" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03)_0%,transparent_70%)]" />
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
            className="text-4xl sm:text-6xl md:text-[8.5rem] font-black tracking-tighter leading-[0.9] md:leading-[0.82] mb-10 relative"
          >
            <span className="relative z-10">Don't worry about the paper. </span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-sky-500 italic relative z-10 py-2">
               Take charge of your past.
               <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 blur-sm rounded-full" />
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-muted-foreground text-base md:text-xl font-bold leading-relaxed mb-16 backdrop-blur-[2px] py-4"
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
            {user ? (
               <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-white hover:bg-primary/90 text-base font-black transition-all shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] active:scale-95 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Return to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            ) : (
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
            )}
            <div className="flex flex-col items-center sm:items-start opacity-60">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trusted by developers</p>
               <p className="text-xs font-bold text-muted-foreground leading-none mt-1">Start tracking in seconds</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section - Sapphire Banded */}
      <section className="py-40 relative overflow-hidden bg-muted/20 border-y border-border/40">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-24 space-y-4"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
               <SparklesIcon size={12} className="fill-current" /> Built for Reliability
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Accuracy you can <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-500 font-black italic">Count on.</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[340px]"
          >
            {/* Cell 1: Core Standard (Main) - Sapphire Theme */}
            <motion.div variants={fadeInUp} className="md:col-span-2 md:row-span-2 relative group">
              <SpotlightCard className="h-full rounded-[3.5rem] shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/50 to-sky-500/50 rounded-[3.5rem] blur opacity-10 group-hover:opacity-30 transition duration-500" />
                <div className="relative h-full bg-card dark:bg-slate-950 text-foreground dark:text-white p-6 md:p-12 flex flex-col justify-between overflow-hidden border border-border/50">
                  {/* Background Icon Detail */}
                  <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.03] dark:opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
                    <Banknote size={120} className="md:w-[240px] md:h-[240px]" strokeWidth={1} />
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5 hover:scale-110 transition-transform">
                      <Wallet size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">Professional <br/>Ledger Standards</h3>
                      <p className="text-muted-foreground dark:text-white/60 font-bold text-lg leading-relaxed max-w-sm">Move beyond messy paper trails. Experience a multi-threaded financial engine built for industrial-grade precision.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-8 bg-muted/20 dark:bg-white/5 rounded-[2rem] border border-border/50 dark:border-white/10 relative z-10">
                    {['Zero Drift', 'Instant Sync', 'Smart Budgets', 'Reports'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/60 dark:text-white/40 group-hover:text-foreground dark:group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Cell 2: Privacy - Emerald Theme */}
            <motion.div variants={fadeInUp} className="md:col-span-2 relative group">
              <SpotlightCard className="h-full rounded-[3.5rem] transition-all duration-500 overflow-hidden border border-border/50">
                <div className="relative h-full bg-card dark:bg-emerald-950 text-foreground dark:text-emerald-50 p-6 md:p-10 flex items-center gap-4 md:gap-8">
                  {/* Background Icon Detail */}
                  <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Lock size={120} className="md:w-[200px] md:h-[200px]" strokeWidth={1} />
                  </div>
                  
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20 group-hover:rotate-3 transition-all relative z-10">
                    <ShieldCheck size={48} />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <h4 className="text-4xl font-black tracking-tighter leading-none">Encrypted Core</h4>
                    <p className="text-muted-foreground dark:text-emerald-400/60 font-bold text-base leading-relaxed max-w-xs">Your wealth is your business. Every single record is cryptographically secured at the source.</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Cell 3: Live Analytics - Amber/Gold Theme */}
            <motion.div variants={fadeInUp} className="relative group">
               <SpotlightCard className="h-full rounded-[3.5rem] transition-all duration-500 overflow-hidden border border-border/50">
                  <div className="relative h-full bg-card dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between group">
                    {/* Background Icon Detail */}
                    <div className="absolute top-0 right-0 p-4 md:p-6 opacity-[0.03] dark:opacity-5 pointer-events-none group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700">
                      <Activity size={100} className="md:w-[140px] md:h-[140px]" strokeWidth={1} />
                    </div>

                    <div className="flex gap-2 h-20 items-end relative z-10">
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((h, i) => (
                         <motion.div 
                          key={i} 
                          animate={{ height: [`${h * 100}%`, `${(h * 0.7) * 100}%`, `${h * 100}%`] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="flex-1 bg-amber-500/20 rounded-t-xl border-t border-amber-500/40"
                         />
                       ))}
                    </div>
                    <div className="relative z-10 mt-auto">
                      <h5 className="font-black tracking-tighter text-3xl text-amber-600 dark:text-amber-500 mb-2 leading-none">Live Analytics</h5>
                      <p className="text-amber-600/40 dark:text-amber-500/40 font-black text-[10px] uppercase tracking-[0.3em]">Real-time vectors</p>
                    </div>
                  </div>
               </SpotlightCard>
            </motion.div>

            {/* Cell 4: Founder Spotlight - Amethyst/Primary Theme */}
            <motion.div variants={fadeInUp} className="relative group">
               <SpotlightCard className="h-full rounded-[3.5rem] transition-all duration-500 overflow-hidden border border-border/50">
                  <div className="relative h-full bg-card dark:bg-indigo-950 p-6 md:p-8 flex flex-col justify-between group">
                    {/* Background Icon Detail */}
                    <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] dark:opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                      <Code size={100} className="md:w-[160px] md:h-[160px]" strokeWidth={1} />
                    </div>

                    <div className="relative z-10">
                       <div className="w-32 h-32 rounded-3xl bg-indigo-500/10 border border-indigo-400/20 overflow-hidden group-hover:border-indigo-400/40 transition-colors relative mb-6 shadow-2xl">
                          <img 
                            src="/images/developer.png" 
                            alt="Sami Khan" 
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 object-top transition-all duration-700 scale-110"
                          />
                          <div className="absolute inset-0 bg-indigo-500/10 group-hover:opacity-0 transition-opacity" />
                       </div>
                    </div>
                    <div className="relative z-10">
                      <h5 className="font-black tracking-tighter text-3xl text-indigo-600 dark:text-indigo-300 leading-none">Sami Khan</h5>
                      <p className="text-indigo-600/60 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Founding Developer</p>
                    </div>
                  </div>
               </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Premium Visuals - Theme Aware */}
      <section className="py-40 bg-background text-foreground relative overflow-hidden border-y border-border/40">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--primary)/0.03),transparent_50%)]" />
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
                <motion.p variants={fadeInUp} className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Your Financial Flow</motion.p>
                <motion.h2 variants={fadeInUp} className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85]">
                  Know where your <br />
                  <span className="italic text-primary/40 dark:text-primary/40">money actually goes.</span>
                </motion.h2>
              </div>
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Starting Capital', desc: 'Define your starting monthly balance. This establishes your budget ceiling.' },
                  { step: '02', title: 'Instant Logs', desc: 'Log expenses as they happen with one-click categorization.' },
                  { step: '03', title: 'Real-time Analytics', desc: 'Visualize your drawdown and remaining liquidity in real-time.' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="flex gap-10 group cursor-default">
                    <span className="text-7xl font-black text-muted-foreground/10 group-hover:text-primary transition-colors duration-500 tabular-nums">{item.step}</span>
                    <div className="space-y-3 pt-2">
                      <h4 className="font-black text-3xl tracking-tighter group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground font-bold text-base leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div variants={fadeInUp} className="relative">
              <div className="absolute -inset-10 bg-gradient-to-r from-primary/10 to-sky-500/10 rounded-[5rem] blur-[80px] animate-pulse" />
              <div className="relative bg-card border border-border/50 rounded-[4rem] p-3 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-1000 group">
                <div className="bg-background rounded-[3.5rem] p-12 space-y-12 shadow-inner overflow-hidden relative">
                   {/* Background Decoration */}
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-700">
                     <Zap size={200} />
                   </div>

                   <div className="flex justify-between items-center border-b border-border/50 pb-10 relative z-10">
                     <div className="space-y-3">
                       <div className="w-20 h-2 bg-primary/20 rounded-full" />
                       <div className="w-32 h-6 bg-foreground rounded-full" />
                     </div>
                     <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20">
                       <TrendingUp className="text-primary h-10 w-10" />
                     </div>
                   </div>
                   
                   <div className="space-y-8 relative z-10">
                      <div className="h-20 bg-muted/20 rounded-3xl flex items-center px-8 border border-border/50 tracking-tighter font-black text-lg text-muted-foreground/40 uppercase">
                         Analytical Pulse Active
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="h-32 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col items-center justify-center gap-2">
                           <span className="text-primary font-black text-xl tabular-nums">+92%</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Accuracy</span>
                        </div>
                        <div className="h-32 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex flex-col items-center justify-center gap-2">
                            <span className="text-emerald-500 font-black text-xl tabular-nums">1.2ms</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">Latency</span>
                        </div>
                      </div>
                      <div className="h-40 bg-primary border border-primary/20 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center shadow-xl shadow-primary/20 group/sync overflow-hidden">
                         <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md"
                         >
                           <CheckCircle2 size={32} className="text-white" />
                         </motion.div>
                         <p className="text-white font-black uppercase tracking-[0.3em] text-xs">Sync Complete</p>
                         <p className="text-white/60 font-bold text-sm mt-1">Ready for review</p>

                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/sync:animate-shimmer" />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Modern Architecture */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { icon: TrendingUp, title: 'Visual Trends', desc: 'See exactly how your spending changes over time with automated trend detection.', theme: 'bg-primary/5 text-primary', bgIcon: Activity },
              { icon: PieChart, title: 'Smart Limits', desc: 'Set monthly limits for your categories. Our system sends gentle warnings if you approach them.', theme: 'bg-sky-500/5 text-sky-500', bgIcon: PieChart },
              { icon: ShieldCheck, title: 'Privacy First', desc: 'Your data belongs to you. We use modern industry standards to keep every record safe.', theme: 'bg-emerald-500/5 text-emerald-500', bgIcon: Lock }
            ].map((trust, i) => (
              <motion.div key={i} variants={fadeInUp} className="group relative">
                <div className="premium-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] h-full flex flex-col justify-between border-border/50 bg-card/40 backdrop-blur-3xl overflow-hidden hover:bg-card transition-all duration-700">
                   {/* Huge Background Icon */}
                   <div className="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 opacity-[0.02] dark:opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <trust.bgIcon size={120} className="md:w-[240px] md:h-[240px]" />
                   </div>

                   <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center border border-current/10 mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3", trust.theme)}>
                     <trust.icon size={36} />
                   </div>
                   <div className="space-y-4 relative z-10">
                     <h4 className="text-4xl font-black tracking-tighter leading-none">{trust.title}</h4>
                     <p className="text-muted-foreground font-bold text-base leading-relaxed">{trust.desc}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ - Theme Responsive */}
      <section className="py-40 relative overflow-hidden rounded-t-[5rem] border-t border-border/40">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial" 
            whileInView="whileInView" 
            viewport={{ once: true }} 
            variants={staggerContainer} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start"
          >
            <div className="space-y-10 group">
              <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
                <SparklesIcon size={12} className="fill-current" /> Assistance
              </div>
              <motion.h2 variants={fadeInUp} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                Frequently <br /> 
                <span className="italic opacity-30 group-hover:opacity-100 transition-opacity">Encountered</span> <br /> 
                Questions.
              </motion.h2>
              <p className="text-muted-foreground text-xl font-bold max-w-sm leading-relaxed">Everything you need to know about the most reliable expense tracker.</p>
            </div>

            <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer} className="grid gap-4">
              {[
                { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and never store your raw password.' },
                { q: 'Can I export my data?', a: 'Yes. You can export your data as professional-grade PDF or Excel sheets.' },
                { q: 'Is it free to use?', a: 'Apna Khata offers a robust free tier for personal use. Professional tools for all.' }
              ].map((faq, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="group bg-card border border-border/50 rounded-[2.5rem] p-10 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-xl">
                   <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
                      <SparklesIcon size={80} className="text-primary" />
                   </div>
                   <h4 className="text-3xl font-black tracking-tighter mb-4 flex items-center gap-4 group-hover:text-primary transition-colors">
                     <span className="text-primary opacity-30 group-hover:opacity-100 transition-opacity">/</span> {faq.q}
                   </h4>
                   <p className="text-muted-foreground group-hover:text-foreground font-bold text-base leading-relaxed max-w-lg transition-colors">{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
