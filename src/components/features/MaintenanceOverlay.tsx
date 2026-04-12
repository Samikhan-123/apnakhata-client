'use client';

import React from 'react';
import { Hammer, HardHat, RefreshCw, LogOut } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const MaintenanceOverlay = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <FadeIn duration={0.8} className="relative z-10 w-full max-w-2xl">
        <div className="premium-card bg-background/40 backdrop-blur-3xl border border-primary/20 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl sapphire-glow">
          <SlideIn>
            <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-[2rem] mb-10 sapphire-glow/20">
              <HardHat className="h-12 w-12 text-primary animate-bounce shrink-0" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">
              Platform <span className="text-primary italic">Updating</span>
            </h1>
            
            <p className="text-muted-foreground font-medium text-lg md:text-xl mb-12 leading-relaxed max-w-md mx-auto">
              Apna Khata is currently under scheduled maintenance to bring you helpful new features.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <div className="flex items-center gap-3 bg-muted/30 px-6 py-3 rounded-2xl border border-border/40">
                  <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest text-foreground">Retrying Connection</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Auto-Reconnect when system is available </span>
               </div>
               
               <Button 
                variant="ghost" 
                onClick={() => logout()}
                className="group h-12 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-600 transition-all"
               >
                 <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                 Logout Session
               </Button>
            </div>
            
            <p className="mt-16 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              Apna Khata Operational Status: <span className="text-rose-500">Locked</span>
            </p>
          </SlideIn>
        </div>
      </FadeIn>
    </div>
  );
};
