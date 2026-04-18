'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({ isVisible, message = 'Getting latest data...', className }: LoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[40] flex items-top justify-center bg-background/40 backdrop-blur-[2px] rounded-3xl transition-all"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
              <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
            </div>
            {message && (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">
                {message}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
