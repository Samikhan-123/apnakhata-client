'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, LogOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FramerMotion';

export const ImpersonationBanner = () => {
  const { isImpersonating, stopImpersonating, user } = useAuth();

  if (!isImpersonating) return null;

  return (
    <FadeIn className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="container mx-auto max-w-5xl pointer-events-auto">
        <div className="bg-primary/90 backdrop-blur-xl border border-white/10 text-white px-4 sm:px-6 py-3 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-white/10 rounded-xl shrink-0">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 leading-none">
                  Diagnostic
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[8px] font-black uppercase tracking-tighter border border-white/5 leading-none">
                  Read Only
                </span>
              </div>
              <span className="text-sm font-bold truncate mt-1">
                Viewing as {user?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 opacity-40">
              <Info className="h-3 w-3" />
              <span className="text-[10px] font-bold">Safe Mode</span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={stopImpersonating}
              className="h-9 px-4 sm:px-6 rounded-xl font-black bg-white text-primary hover:bg-white/90 shadow-xl transition-all gap-2 text-xs sm:text-sm active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};
