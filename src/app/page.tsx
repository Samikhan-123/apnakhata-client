'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, PieChart, Zap, CheckCircle2, TrendingUp, Wallet, Clock, Sparkles as SparklesIcon, Lock, Activity, Code, Banknote, BookOpen, ChevronDown } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// --- Motion Definitions (Light & Fast) ---
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 10 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.05 } }
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
      className={cn("relative overflow-hidden group/card", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), 0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={cn(
        "group bg-card border border-border/50 rounded-3xl p-6 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md",
        isOpen && "border-primary/30 bg-primary/5"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3">
          <span className={cn("text-primary opacity-30 transition-opacity", isOpen && "opacity-100")}>/</span> 
          {question}
        </h4>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.3 }}
           className="text-muted-foreground"
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="text-muted-foreground font-bold text-base leading-relaxed max-w-lg mt-4 pt-4 border-t border-border/40">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative">
      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

      <PublicHeader />

      {/* Hero Section - Clean & Focused */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative bg-background overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] opacity-30" />
          <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-sky-500/5 rounded-full blur-[100px] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/10"
          >
            <Zap className="h-3 w-3 fill-current" />
            Simple. Clear. Personal.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8"
          >
            Apna Khata: See where your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
              money really goes.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-bold leading-relaxed mb-12"
          >
            Forget messy notebooks and confusing apps. Apna Khata helps you track every rupee with ease, so you can spend less time worrying and more time living.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-white hover:bg-primary/90 text-base font-black transition-all shadow-xl shadow-primary/20 active:scale-95 group">
                  Return to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white text-base font-black transition-all shadow-xl active:scale-95 group">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            <div className="flex flex-col items-center sm:items-start text-muted-foreground/60">
              <p className="text-[10px] font-black uppercase tracking-widest">No credit card needed</p>
              <p className="text-xs font-bold leading-none mt-1">Join 1,000+ users today</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features - Simplified Bento */}
      <section id="features" className="py-24 md:py-40 relative bg-muted/10 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20 space-y-4"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10">
              <SparklesIcon size={12} className="fill-current" /> Everything you need
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Built for your <br />
              <span className="text-primary italic">Daily Life.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1: Ledger */}
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <SpotlightCard className="h-full rounded-[3rem] bg-card border border-border/50 p-8 md:p-12 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <Wallet size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tighter">Your Daily Ledger</h3>
                    <p className="text-muted-foreground font-bold text-lg leading-relaxed max-w-md">
                      Say goodbye to paper diaries. Log your income and daily spending in seconds. It's clean, fast, and always with you.
                    </p>
                  </div>
                </div>
                <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-border/40">
                  {['One-click add', 'Smart Categories', 'Instant Search'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                      <CheckCircle2 size={12} className="text-primary" /> {f}
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Feature 2: Reports */}
            <motion.div variants={fadeInUp}>
              <SpotlightCard className="h-full rounded-[3rem] bg-card border border-border/50 p-8 flex flex-col gap-6">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-500/20">
                  <PieChart size={32} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl font-black tracking-tighter">Smart Reports</h4>
                  <p className="text-muted-foreground font-bold text-base leading-relaxed">
                    Visual charts that actually make sense. See exactly where you can save more.
                  </p>
                </div>
                <div className="mt-auto h-24 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center justify-center p-4">
                  <div className="flex gap-2 h-full items-end w-full">
                    {[0.6, 0.4, 0.9, 0.5, 0.7, 0.3].map((h, i) => (
                      <div key={i} className="flex-1 bg-amber-500/20 rounded-t-lg" style={{ height: `${h * 100}%` }} />
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Feature 3: Security */}
            <motion.div variants={fadeInUp}>
              <SpotlightCard className="h-full rounded-[3rem] bg-emerald-950/5 border border-emerald-500/10 p-8 flex flex-col gap-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl font-black tracking-tighter">Safe & Private</h4>
                  <p className="text-muted-foreground font-bold text-base leading-relaxed">
                    Your data is yours. We use high-end encryption to keep your transactions private and secure.
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Feature 4: Future Proof */}
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <SpotlightCard className="h-full rounded-[3rem] bg-indigo-950/5 border border-indigo-500/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-500/20 shrink-0">
                  <TrendingUp size={48} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-4xl font-black tracking-tighter">Build Your Future</h4>
                  <p className="text-muted-foreground font-bold text-lg leading-relaxed">
                    Start tracking today to see the big picture tomorrow. Apna Khata is built to grow with your financial journey.
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Humanized Steps */}
      <section id="how-it-works" className="py-24 md:py-40 bg-background text-foreground relative overflow-hidden border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-12">
              <div className="space-y-4">
                <motion.p variants={fadeInUp} className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Simple Steps</motion.p>
                <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                  Get started in <br />
                  <span className="text-primary/40">three minutes.</span>
                </motion.h2>
              </div>
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Add Your Income', desc: 'Tell us your starting balance or monthly salary to set your budget.' },
                  { step: '02', title: 'Add Transactions', desc: 'Quickly log expenses as you spend them. Use categories to stay organized.' },
                  { step: '03', title: 'Relax & Review', desc: 'Check your dashboard weekly to see trends and stay on track.' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="flex gap-8 items-start">
                    <span className="text-5xl font-black text-primary/10 tabular-nums">{item.step}</span>
                    <div className="space-y-2">
                      <h4 className="font-black text-2xl tracking-tighter">{item.title}</h4>
                      <p className="text-muted-foreground font-bold text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
               variants={fadeInUp}
               className="relative bg-card border border-border/40 rounded-[3rem] p-10 shadow-2xl overflow-hidden group"
            >
               <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                       <div className="w-16 h-2 bg-primary/20 rounded-full" />
                       <p className="text-2xl font-black tracking-tighter">Your Dashboard</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                      <Activity className="text-primary size={24}" />
                    </div>
                  </div>
                  
                  <div className="bg-muted/10 rounded-2xl p-6 border border-border/40 space-y-4 font-bold text-muted-foreground/60 text-sm">
                    <p>Sample View</p>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted/20 w-3/4 rounded-full" />
                      <div className="h-4 bg-muted/20 w-1/2 rounded-full" />
                      <div className="h-12 bg-primary w-full rounded-2xl mt-8 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">
                        Data Synchronized
                      </div>
                    </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                  <Zap size={200} />
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ - Accordion Styled */}
      <section id="faq" className="py-24 md:py-40 relative bg-background border-t border-border/40">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
              <SparklesIcon size={12} className="fill-current" /> Common Questions
            </div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black tracking-tighter">
              Got Questions? <br />
              <span className="opacity-30 italic">We've got answers.</span>
            </motion.h2>
          </motion.div>

          <div className="grid gap-4">
            {[
              { q: 'Is my data secure?', a: 'Completely. We use industry-standard encryption to ensure only you can access your financial transactions.' },
              { q: 'Can I export my data?', a: 'Yes! You can download your reports in Excel or PDF formats at any time from your dashboard.' },
              { q: 'Is it free to use?', a: 'The core features of Apna Khata are free for now but will be subscription based in the future. We believe everyone deserves financial clarity.' },
              { q: 'How do I get started?', a: 'Just create an account, set your starting balance, and start logging. It takes less than 5 minutes.' }
            ].map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
