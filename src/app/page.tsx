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
            Join 10,000+ smart savers
          </div>
          
          <h1 className="text-6xl md:text-[9.5rem] font-black tracking-tighter leading-[0.85] mb-10 animate-fade-in-up [animation-delay:200ms]">
            Money tracking <br />
            <span className="text-primary italic relative">
               made personal.
               <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 blur-sm rounded-full" />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-bold leading-relaxed mb-16 animate-fade-in-up [animation-delay:500ms]">
            Stop wondering where your money went. Start planning where it goes with the simplest financial tracker for humans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:700ms]">
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white text-base font-black transition-all shadow-2xl active:scale-95 group">
                Start Saving Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex flex-col items-center sm:items-start">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Free Forever</p>
               <p className="text-xs font-bold text-muted-foreground/60 leading-none mt-1 text-center sm:text-left">Takes less than 30 seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative bg-muted/20 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Philosophy</p>
                  <h2 className="text-5xl font-black tracking-tighter leading-[0.95]">
                    Everything you need, <br />
                    <span className="text-muted-foreground/40">none of the fluff.</span>
                  </h2>
               </div>
               
               <div className="space-y-6">
                  {[
                    { title: 'Personal Insights', desc: 'Not just charts, but actual advice on how to save.', icon: Heart, color: 'text-rose-500' },
                    { title: 'Automatic Safety', desc: 'Recurring bills captured without you lifting a finger.', icon: Clock, color: 'text-sky-500' },
                    { title: 'Privacy First', desc: 'Your data is yours. Encrypted and never shared.', icon: ShieldCheck, color: 'text-emerald-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5 group items-start">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/40 bg-card shadow-sm group-hover:scale-110 transition-all", item.color)}>
                        <item.icon size={22} />
                      </div>
                      <div className="pt-1">
                        <h5 className="font-black text-lg tracking-tight mb-1">{item.title}</h5>
                        <p className="text-muted-foreground font-bold text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-7 relative">
               <div className="aspect-[16/10] bg-card rounded-[3rem] border border-border/40 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-10" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                  
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="bg-background/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20 text-center animate-fade-in-scale">
                        <TrendingUp className="text-primary h-12 w-12 mx-auto mb-4" />
                        <p className="text-5xl font-black tracking-tighter text-foreground">+45%</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">Avg. Monthly Savings</p>
                     </div>
                  </div>
               </div>
               
               {/* Floating Element */}
               <div className="absolute -bottom-10 -right-10 hidden md:block z-30">
                  <div className="bg-primary text-primary-foreground p-8 rounded-[2rem] shadow-2xl animate-bounce-slow">
                     <PieChart size={32} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-20 text-center flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Reliability</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Built for peace of mind.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card p-10 rounded-[3rem] text-left border-border/40 hover:bg-muted/50 transition-all group">
              <div className="w-14 h-14 bg-rose-500/5 text-rose-500 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-3">Military Security</h4>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed">
                Your data is protected with end-to-end encryption. Only you hold the keys to your financial life.
              </p>
            </div>

            <div className="premium-card p-10 rounded-[3rem] text-left border-border/40 hover:bg-muted/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/5 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-3">100% Transparency</h4>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed">
                No hidden fees, no data selling, no complex terms. We built this for ourselves, and for you.
              </p>
            </div>

            <div className="premium-card p-10 rounded-[3rem] text-left border-border/40 hover:bg-muted/50 transition-all group">
              <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 border border-primary/10 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-3">Ultra Fast Entry</h4>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed">
                Record a transaction in less than 3 seconds. Our interface gets out of your way so you can live.
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
