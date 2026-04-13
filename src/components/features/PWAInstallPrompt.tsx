'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Laptop, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check for iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already in standalone mode (already installed and opened)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Update UI notify the user they can install the PWA
      // ONLY if not already dismissed
      if (!localStorage.getItem('pwa-prompt-dismissed')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger (e.g., from Sidebar)
    const handleCustomTrigger = () => {
      if (deferredPrompt) {
        setIsVisible(true);
      } else if (isIOS) {
        setIsVisible(true);
      }
    };

    window.addEventListener('trigger-pwa-install', handleCustomTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-pwa-install', handleCustomTrigger);
    };
  }, [deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      // User accepted the install prompt
    } else {
      // User dismissed the install prompt
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsVisible(false);
    // Store in localStorage to avoid nagging across sessions
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed
  useEffect(() => {
    if (localStorage.getItem('pwa-prompt-dismissed')) {
      setIsVisible(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="premium-card p-4 md:p-6 bg-background/80 backdrop-blur-2xl border-primary/20 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)] rounded-[2rem] flex items-center gap-4 border overflow-hidden relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center text-primary relative z-10 shrink-0 border border-primary/20">
              <Download size={32} className="hidden md:block" />
              <Smartphone size={24} className="md:hidden" />
            </div>

            <div className="flex-1 space-y-1 relative z-10">
              <h4 className="font-black tracking-tighter text-sm md:text-lg leading-tight">Install Apna Khata</h4>
              <p className="text-muted-foreground text-[10px] md:text-sm font-bold leading-tight line-clamp-2 md:line-clamp-none">
                {isIOS 
                  ? "Tap the share button and select 'Add to Home Screen' for the best experience."
                  : "Install the app for instant access and a smoother native experience."}
              </p>
            </div>

            <div className="flex flex-col gap-2 relative z-10 shrink-0">
               {!isIOS && (
                 <Button 
                    onClick={handleInstallClick}
                    size="sm"
                    className="h-10 px-4 rounded-xl bg-primary text-white font-black hover:scale-105 transition-all shadow-lg shadow-primary/20 text-xs"
                 >
                   Install
                 </Button>
               )}
               <Button 
                onClick={dismiss}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-white/10"
               >
                 <X size={16} />
               </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
