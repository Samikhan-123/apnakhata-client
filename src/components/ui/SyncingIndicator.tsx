"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SyncingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

export const SyncingIndicator: React.FC<SyncingIndicatorProps> = ({
  isVisible,
  message = "Syncing",
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-background/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-primary/20 shadow-2xl shadow-primary/5"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
            <Loader2 className="h-4 w-4 text-primary animate-spin relative z-10" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80 leading-none">
            {message}
          </span>
          <div className="flex gap-1">
             <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
             <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
             <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
