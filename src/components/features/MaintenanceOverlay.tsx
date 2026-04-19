'use client';

import React from 'react';
import { Wrench, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { cn } from '@/lib/utils';

export const MaintenanceOverlay = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <SlideIn direction="up" distance={40} duration={0.8}>
        <div className="relative max-w-lg w-full mx-4 p-8 md:p-12 rounded-[3.5rem] border border-primary/10 bg-card/40 shadow-2xl sapphire-glow/10 text-center overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />

          {/* Icon Section */}
          <div className="relative mb-10 inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 sapphire-glow/20 text-primary animate-bounce duration-[3000ms]">
              <Wrench size={40} className="animate-spin duration-[8s]" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
          </div>

          {/* Content */}
          <div className="relative space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Maintenance in Progress
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto text-sm md:text-base">
              The Apna Khata platform is currently undergoing scheduled maintenance to improve your financial experience.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="relative h-1.5 w-full bg-primary/5 rounded-full mb-12 overflow-hidden px-0.5">
             <div className="h-full bg-primary rounded-full animate-progress-indefinite shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </div>

          {/* Actions */}
          <div className="relative flex flex-col gap-4">
            <Button 
              onClick={logout}
              variant="outline"
              className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-primary/10 hover:bg-primary/5 transition-all active:scale-95 group"
            >
              <LogOut size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
              Sign Out Securely
            </Button>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
              Automaticly get access back once maintenance is done
            </p>
          </div>
        </div>
      </SlideIn>

      <style jsx global>{`
        @keyframes progress-indefinite {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(400%); width: 30%; }
        }
        .animate-progress-indefinite {
          animation: progress-indefinite 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
