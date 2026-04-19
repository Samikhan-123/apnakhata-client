'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, PieChart, Zap, CheckCircle2,
  TrendingUp, Wallet, Activity, Sparkles as SparklesIcon,
  ChevronDown, Globe, Lock
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { RetroGrid, Beam, Sparkles } from '@/components/ui/BackgroundEffects';

// --- Motion Definitions ---
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
            <p className="text-muted-foreground font-bold text-sm md:text-base leading-relaxed max-w-lg mt-4 pt-4 border-t border-border/40">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPageClient() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

      <PublicHeader />

      {/* --- Hero --- */}
      <section className="relative pt-24 pb-16 md:pt-48 md:pb-48 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.08)_0%,transparent_70%)]" />
          <RetroGrid className="opacity-80" />
          <Beam className="left-[15%] h-screen top-0 opacity-40" duration={10} delay={0} />
          <Beam className="left-[45%] h-screen top-0 opacity-20" duration={12} delay={2} />
          <Beam className="left-[85%] h-screen top-0 opacity-30" duration={8} delay={5} />
          <Beam className="left-[45%] h-screen top-0 opacity-20" duration={12} delay={2} />
          <Beam className="left-[85%] h-screen top-0 opacity-30" duration={8} delay={5} />
          <Sparkles count={24} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/20 backdrop-blur-sm"
            >
              <Zap className="h-3 w-3 fill-current" />
              Revolutionizing Personal Finance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8 max-w-5xl text-balance mx-auto"
            >
              Master your money <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500 animate-gradient-x">
                without the mess.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto text-muted-foreground/80 text-base md:text-xl font-medium leading-relaxed mb-12 px-4"
            >
              Ditch the Notebooks. Apna Khata gives you the clarity to manage your daily ledger, track expenses, and reach your goals with a premium experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href={user ? "/dashboard" : "/register"}>
                <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-2xl bg-primary text-white hover:bg-primary/90 text-base md:text-lg font-black transition-all shadow-2xl shadow-primary/30 active:scale-95 group w-full sm:w-auto">
                  <span>{user ? "View My Ledger" : "Get Started Now"}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-foreground/80 leading-none">Trusted by 1k+</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Smart savers worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Core Features: Responsive --- */}
      <section id="features" className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="p-6 md:p-0">
              <div className="mb-6 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto md:mx-0">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Secure & Private</h3>
              <p className="text-muted-foreground text-sm md:text-base">Your financial data is encrypted and secure. We never share your personal information.</p>
            </motion.div>
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 md:p-0">
              <div className="mb-6 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto md:mx-0">
                <PieChart size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Detailed Insights</h3>
              <p className="text-muted-foreground text-sm md:text-base">Get clear reports on your income and expenses to understand your spending habits.</p>
            </motion.div>
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6 md:p-0">
              <div className="mb-6 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto md:mx-0">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Easy Tracking</h3>
              <p className="text-muted-foreground text-sm md:text-base">Log your daily transactions in seconds with our simple and intuitive interface.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-20 md:py-32 bg-background text-foreground relative overflow-hidden border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10 md:space-y-12 text-center lg:text-left">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Simple Steps</p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
                  Get started in <br className="hidden md:block" />
                  <span className="text-primary/40">three minutes.</span>
                </h2>
              </div>
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Add Your Income', desc: 'Tell us your starting balance or monthly salary to set your budget.' },
                  { step: '02', title: 'Add Records', desc: 'Quickly log expenses as you spend them. Use categories to stay organized.' },
                  { step: '03', title: 'Relax & Review', desc: 'Check your dashboard weekly to see trends and stay on track.' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center lg:items-start">
                    <span className="text-4xl md:text-5xl font-black text-primary/10 tabular-nums">{item.step}</span>
                    <div className="space-y-2">
                      <h4 className="font-black text-xl md:text-2xl tracking-tighter">{item.title}</h4>
                      <p className="text-muted-foreground font-bold text-sm md:text-base leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="relative bg-card border border-border/40 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden group max-w-lg mx-auto lg:max-w-full"
            >
              <div className="space-y-8 h-full relative z-10">
                <div className="flex justify-between items-center">
                  <img src="/Dashboard-photo.png" alt="ApnaKhata" width={1000} height={1000} />
                </div>
                <div className="flex flex-col justify-between items-center">
                  <p className="text-2xl font-bold">Dashboard view</p>
                  <p className="text-muted-foreground">See your income and expenses in one place</p>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Simple and Powerful Grid --- */}
      <section className="py-20 md:py-32 bg-background overflow-hidden border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="mb-12 md:16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 underline decoration-primary/10 underline-offset-8">Simple and Powerful</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">Everything you need to manage your personal finances effectively without the complexity.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <CheckCircle2 className="text-primary" />, title: 'Real-time Sync', desc: 'Sync across all devices' },
              { icon: <CheckCircle2 className="text-primary" />, title: 'Custom Categories', desc: 'Organize your own way' },
              { icon: <CheckCircle2 className="text-primary" />, title: 'Export Reports', desc: 'PDF & Excel exports' },
              { icon: <CheckCircle2 className="text-primary" />, title: 'Fast Actions', desc: 'Log entries in seconds' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-colors text-left"
              >
                <div className="mb-4">{item.icon}</div>
                <h4 className="font-black text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="py-20 md:py-32 relative bg-background border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12 md:16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
              <SparklesIcon size={12} className="fill-current" /> Common Questions
            </div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-6xl font-black tracking-tighter">
              Got Questions?
            </motion.h2>
          </motion.div>

          <div className="grid gap-4">
            {[
              { q: 'Is my data secure?', a: 'Completely. We use industry-standard encryption to ensure only you can access your financial records.' },
              { q: 'Can I export my data?', a: 'Yes! You can download your reports in Excel or PDF formats at any time from your dashboard.' },
              { q: 'Is it free to use?', a: 'The core features of Apna Khata are free for now. We believe everyone deserves financial clarity.' },
              { q: 'How do I get started?', a: 'Just create an account, set your starting balance, and start logging. It takes less than 5 minutes.' }
            ].map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Ready for control?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg md:text-xl font-medium">Join Apna Khata today and start your journey towards financial freedom.</p>
            <div className="pt-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-14 md:h-16 px-10 rounded-2xl text-base md:text-lg font-black hover:scale-105 transition-all shadow-2xl active:scale-95 w-full sm:w-auto">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Decorative BG element */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none -rotate-12 translate-x-20">
          <Wallet size={300} />
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
