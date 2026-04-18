'use client';

import React from 'react';
import { 
  PlusCircle, BookOpen, ShieldCheck, Zap, 
  HelpCircle, ChevronRight, Layout, Wallet, 
  Clock, Lock, ArrowRight, Activity
} from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserGuidePage() {
  const sections = [
    {
      title: "Quick Start",
      icon: Zap,
      color: "blue",
      description: "Get up and running in less than 2 minutes.",
      points: [
        "Create Categories: Set up your 'Food', 'Salary', or 'Rent' spaces first.",
        "Add Your First Record: Use the '+ New Record' button to add income or expenses.",
        "Wealth-First Rule: Always add income records first to see your net balance."
      ]
    },
    {
      title: "Mastering the Ledger",
      icon: Layout,
      color: "emerald",
      description: "Learn how we protect your financial history.",
      points: [
        "Filter: Find any record by description, date, or category.",
        "Locked Months: Previous months are automatically locked for editing after 2 days of the new month.",
        "Precision Tracking: Use the date picker to log historical records specifically."
      ]
    },
    {
      title: "Smart Automation",
      icon: Clock,
      color: "purple",
      description: "Put your recurring finances on auto-pilot.",
      points: [
        "Auto Transactions: Set up monthly bills or salary logs once and forget them.",
        "Budget Mastery: Set monthly limits for categories and track status in real-time.",
        "Automatic Alerts: Visual indicators turn red when budgets are nearing exhaustion."
      ]
    },
    {
      title: "Security & Sovereignty",
      icon: Lock,
      color: "rose",
      description: "Your data is yours, always protected.",
      points: [
        "30-Day Soft-Delete: Accounts scheduled for deletion stay in a 30-day grace period.",
        "Self-Protection: Our zero-trust system prevents accidental users lockouts.",
        // "Audit Trail: Every administrative action is logged for complete transparency."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <SlideIn duration={0.8}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                 <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Mastery Manual</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
              Financial Clarity <br />
              <span className="text-muted-foreground/40">Made Simple.</span>
            </h1>
            <p className="max-w-xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed mb-10">
               Everything you need to know about mastering your personal ledger and achieving financial sovereignty with Apna Khata.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/register">
                 <Button className="h-14 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-2">
                   Get Started <ArrowRight className="h-4 w-4" />
                 </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="h-14 px-10 rounded-2xl font-bold border border-border/40 hover:bg-muted/30 transition-all">
                  Contact Support
               </Button>
              </Link>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 bg-muted/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <FadeIn key={section.title} delay={idx * 0.1}>
                <div className="premium-card p-10 rounded-[3rem] border border-border/10 h-full group hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div className={cn(
                      "w-16 h-16 rounded-3xl flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-110",
                      section.color === 'blue' ? "bg-blue-500/5 text-blue-500 border-blue-500/10" :
                      section.color === 'emerald' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" :
                      section.color === 'purple' ? "bg-purple-500/5 text-purple-500 border-purple-500/10" :
                      "bg-rose-500/5 text-rose-500 border-rose-500/10"
                    )}>
                      <section.icon size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest pt-2">Section 0{idx + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight text-foreground mb-3">{section.title}</h3>
                  <p className="text-muted-foreground font-medium mb-8 text-sm">{section.description}</p>
                  
                  <ul className="space-y-4">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 group/item">
                         <div className="mt-1 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover/item:bg-primary/20 transition-colors">
                            <ChevronRight className="h-2 w-2 text-primary" />
                         </div>
                         <span className="text-sm font-semibold text-foreground/70 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
             <FadeIn>
               <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Common Enquiries</h2>
               <p className="text-muted-foreground font-medium">Quick answers to frequently asked questions.</p>
             </FadeIn>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "How do I change my currency preference?", a: "Go to Dashboard > Settings. You can select your base currency from our global list of supported currencies." },
              { q: "Is my data private from other users?", a: "Yes. Apna Khata follows strict privacy protocols. only you can see your individual record details unless you authorize support." },
              { q: "What happens after the 30-day deletion period?", a: "After 30 days, your account and all associated records are permanently purged from our primary database and cannot be recovered." },
              { q: "How often do recurring records sync?", a: "Our maintenance engine processes recurring patterns every 24 hours at midnight UTC." }
            ].map((faq, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="p-8 rounded-3xl bg-muted/20 border border-border/10 hover:border-primary/20 transition-all group">
                   <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                     <HelpCircle className="h-5 w-5 text-primary/40 group-hover:text-primary transition-colors" />
                     {faq.q}
                   </h4>
                   <p className="text-sm text-muted-foreground font-medium ml-8 leading-relaxed">
                     {faq.a}
                   </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 container mx-auto px-6">
        <FadeIn>
          <div className="relative p-12 md:p-20 rounded-[4rem] bg-primary overflow-hidden text-center text-white shadow-2xl shadow-primary/20">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <Activity className="w-64 h-64 -rotate-12" />
             </div>
             <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10">
                Ready to take control <br /> of your future?
             </h2>
             <p className="max-w-lg mx-auto text-primary-foreground/70 font-bold mb-10 leading-relaxed text-sm md:text-base relative z-10">
                Join thousands of users who have found financial clarity through human-centric design and secure tracking.
             </p>
             <div className="flex flex-wrap justify-center gap-4 relative z-10">
               <Link href="/register">
                 <Button className="h-14 px-12 rounded-2xl font-black bg-white text-primary hover:bg-white/90 shadow-xl transition-all">
                   Join the Movement
                 </Button>
               </Link>
             </div>
          </div>
        </FadeIn>
      </section>

      {/* Minimal Footer Footer */}
      <footer className="py-20 border-t border-border/5">
         <div className="container mx-auto px-6 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 grayscale opacity-30">
               <img src="/icon1.png" alt="Logo" className="w-8 h-8" />
               <span className="text-xl font-black tracking-tighter">Apna Khata</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
               &copy; {new Date().getFullYear()} Precision Financial Ecosystem
            </p>
         </div>
      </footer>
    </div>
  );
}

// Utility for CSS class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
