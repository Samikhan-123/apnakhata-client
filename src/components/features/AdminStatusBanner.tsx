"use client";

import React from "react";
import { Lock, ShieldAlert, AlertCircle } from "lucide-react";
import { SlideIn } from "@/components/ui/FramerMotion";
import { cn } from "@/lib/utils";

interface UnifiedStatusProps {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}

export const AdminStatusBanner = ({
  maintenanceMode,
  registrationEnabled,
}: UnifiedStatusProps) => {
  // Only show if system is in a restricted state
  // Only show if system is explicitly in a restricted state (guards against undefined during fetch)
  const isRestricted =
    maintenanceMode === true || registrationEnabled === false;
  if (!isRestricted) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] pointer-events-none px-6">
      <SlideIn
        direction="up"
        distance={20}
        duration={0.6}
        className="pointer-events-auto max-w-2xl mx-auto"
      >
        <div
          className={cn(
            "flex items-center justify-between gap-6 px-6 py-3 rounded-full border backdrop-blur-xl shadow-2xl transition-all duration-500 select-none bg-rose-950/90 text-white border-rose-500/20 shadow-rose-900/40",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/40">
              <ShieldAlert size={18} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-70">
                Security Protocol
              </span>
              <h4 className="text-xs font-black tracking-tight uppercase tracking-widest leading-none">
                System Restricted
              </h4>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-4 flex-1 justify-end sm:justify-center">
            {maintenanceMode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5 whitespace-nowrap">
                <Lock size={12} className="text-rose-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Maintenance Active
                </span>
              </div>
            )}
            {!registrationEnabled && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5 whitespace-nowrap">
                <AlertCircle size={12} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Signups Paused
                </span>
              </div>
            )}
          </div>

          <div className="hidden lg:flex flex-col items-end opacity-40">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] leading-none">
              Admin View
            </span>
            <span className="text-[8px] font-medium leading-none mt-1 italic">
              Moderators Enabled
            </span>
          </div>
        </div>
      </SlideIn>
    </div>
  );
};
