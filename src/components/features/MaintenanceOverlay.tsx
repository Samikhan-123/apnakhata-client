'use client';

import React from 'react';
import { Hammer, HardHat, RefreshCw, LogOut } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const MaintenanceOverlay = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4 md:p-6 overflow-hidden text-center md:text-left">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-30">
         <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/20 blur-[100px] md:blur-[140px] rounded-full animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-rose-500/10 blur-[100px] md:blur-[140px] rounded-full animate-pulse delay-1000" />
      </div>

      <FadeIn duration={0.8} className="relative z-10 w-full max-w-xl md:max-w-2xl px-2">
        <div className="premium-card bg-background/40 backdrop-blur-3xl border border-primary/20 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-center shadow-2xl sapphire-glow overflow-hidden relative group">
           {/* Subtle Light Beam */}
           <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rotate-45 pointer-events-none" />

          <SlideIn>
            <div className="inline-flex items-center justify-center p-5 md:p-8 bg-primary/10 rounded-[2rem] md:rounded-[3rem] mb-8 md:mb-12 shadow-xl shadow-primary/10 relative">
              <HardHat className="h-10 w-10 md:h-16 md:w-16 text-primary animate-bounce shrink-0" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-background animate-pulse" />
            </div>
            
            <div className="space-y-4 md:space-y-6 mb-10 md:mb-14 px-2">
               <h1 className="text-3xl md:text-3xl font-black tracking-tighter text-foreground leading-tight">
                System Update
              </h1>
              
              <p className="text-muted-foreground font-bold text-sm md:text-xl leading-relaxed max-w-md mx-auto">
                Apna Khata is currently being updated to work better for you. Your data is perfectly safe, and we will be back online very soon.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-center">
               <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 bg-muted/30 p-2 md:p-2 pr-4 md:pr-6 rounded-2xl md:rounded-[1.5rem] border border-border/40 w-full max-w-md">
                  <div className="bg-background/80 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm">
                    <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-primary animate-spin" />
                  </div>
                  <div className="text-left flex-1 py-1 md:py-0">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-foreground">Status: Standard Maintenance</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-500/80 uppercase tracking-tighter">Automatic re-entry upon completion</p>
                  </div>
               </div>
               
               <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => logout()}
                    className="group h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-rose-500/10 hover:text-rose-600 transition-all border border-transparent hover:border-rose-500/20 active:scale-95"
                  >
                    <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Secure Logout
                  </Button>
               </div>
            </div>
            
            <div className="mt-12 md:mt-20 flex flex-col items-center gap-3 opacity-40">
               <div className="h-px w-12 bg-border" />
               <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                Your Financial Identity is <span className="text-foreground font-black">Shielded</span>
              </p>
            </div>
          </SlideIn>
        </div>
      </FadeIn>
    </div>
  );
};
