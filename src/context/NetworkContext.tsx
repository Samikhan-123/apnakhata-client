"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/auth.service";
import { offlineService } from "@/services/offline.service";
import { cn } from "@/lib/utils";

interface NetworkContextType {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType>({ isOnline: true });

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOnlineFeedback, setShowOnlineFeedback] = useState(false);

  useEffect(() => {
    // Initial status
    setIsOnline(window.navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      setShowOnlineFeedback(true);

      const queueSize = await offlineService.getQueueSize();
      if (queueSize === 0) {
        toast.success("Back Online", {
          description: "You are now connected to the internet.",
          icon: <Wifi className="w-4 h-4 text-emerald-500" />,
          duration: 3000,
        });
      }

      // Trigger sync
      offlineService.processQueue(api);

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setShowOnlineFeedback(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineFeedback(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const showBanner = !isOnline || showOnlineFeedback;

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9999] flex justify-center p-4 pointer-events-none"
          >
            <div
              className={cn(
                "backdrop-blur-md text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 border pointer-events-auto transition-colors duration-500",
                isOnline
                  ? "bg-emerald-500/90 border-emerald-400/50"
                  : "bg-rose-500/90 border-rose-400/50",
              )}
            >
              {isOnline ? (
                <Wifi className="w-5 h-5 animate-pulse" />
              ) : (
                <WifiOff className="w-5 h-5 animate-pulse" />
              )}
              <span className="font-medium text-sm">
                {isOnline ? "Connection Restored" : "No Internet Connection"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NetworkContext.Provider>
  );
};
