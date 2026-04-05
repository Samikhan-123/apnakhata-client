import Link from 'next/link';
import { ArrowRight, ShieldCheck, PieChart, Zap, CheckCircle2, XCircle, TrendingUp, Wallet, Clock, Heart } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <PublicHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-primary/10 shadow-sm animate-fade-in-up">
            <Zap className="h-3 w-3 fill-current" />
            The Digital Diary Your Money Deserves
          </div>
          
          <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] mb-10 animate-fade-in-up [animation-delay:200ms]">
            Forget the paper. <br />
            <span className="text-primary italic relative">
               Own your history.
               <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 blur-sm rounded-full" />
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl font-bold leading-relaxed mb-16 animate-fade-in-up [animation-delay:500ms]">
            No more messy paper lines or forgetting where your money went. Just add your monthly income, track daily expenses, and let Apna Khata handle the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:700ms]">
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white text-base font-black transition-all shadow-2xl active:scale-95 group">
                Join the Premium Experience
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex flex-col items-center sm:items-start">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Trusted by thousands</p>
               <p className="text-xs font-bold text-muted-foreground/60 leading-none mt-1 text-center sm:text-left">Start tracking in 30 seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-32 relative bg-muted/20 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">The Struggle is Real</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">
            Why struggle with <br />
            <span className="text-muted-foreground/40 text-4xl md:text-5xl">the old ways?</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-12">
               {[
                 { 
                   title: 'The Paper Mess', 
                   desc: 'Line lagana, pages palatna, aur calculations karna... paper records are slow and easy to lose.', 
                   icon: XCircle, 
                   color: 'text-rose-500' 
                 },
                 { 
                   title: 'The Memory Trap', 
                   desc: 'Did I pay the milkman? How much did I spend on groceries? Stop taxing your brain.', 
                   icon: Clock, 
                   color: 'text-sky-500' 
                 },
                 { 
                   title: 'Complex Apps', 
                   desc: 'Most apps require an accounting degree. We built Apna Khata for real humans.', 
                   icon: Zap, 
                   color: 'text-amber-500' 
                 }
               ].map((item, idx) => (
                 <div key={idx} className="flex gap-6 group">
                   <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border border-border/40 bg-card shadow-sm group-hover:scale-110 transition-all", item.color)}>
                     <item.icon size={24} />
                   </div>
                   <div>
                     <h5 className="font-black text-xl tracking-tight mb-2">{item.title}</h5>
                     <p className="text-muted-foreground font-bold text-sm leading-relaxed max-w-sm">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="bg-card rounded-[3rem] border border-border/40 shadow-2xl p-10 md:p-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                     <Wallet className="text-primary h-8 w-8" />
                  </div>
               </div>
               
               <div className="space-y-8 relative z-10">
                  <h3 className="text-3xl font-black tracking-tight">The Modern Solution</h3>
                  <div className="space-y-4">
                     {[
                       'Automated Balance Tracking',
                       'Monthly Income vs Daily Expenses',
                       'Smart Category Limits (Budgets)',
                       'Cloud Sync & Offline Mode',
                       'One-Tap Record Entry'
                     ].map((feat, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                          <span className="font-bold text-sm">{feat}</span>
                       </div>
                     ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border/40">
                     <p className="text-sm font-bold text-muted-foreground italic leading-relaxed">
                       "It's like having a personal accountant in your pocket, but simpler and much faster."
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-32 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-2xl font-black tracking-tight">Financial Clarity</h4>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed">
                Know exactly where your money goes. Categorize your spending and see real-time balance updates.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-sky-500/5 rounded-2xl flex items-center justify-center text-sky-500 border border-sky-500/10">
                <PieChart size={24} />
              </div>
              <h4 className="text-2xl font-black tracking-tight">Limit Your Spending</h4>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed">
                Set monthly limits for categories like Food or Transit. We will warn you before you overspend.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-2xl font-black tracking-tight">Data Sovereignty</h4>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed">
                Your data is encrypted and private. We don't sell your info. We just help you manage your wealth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <PublicFooter />
    </div>
  );
}
