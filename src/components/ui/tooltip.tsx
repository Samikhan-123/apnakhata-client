"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  content,
  children,
  className,
  position = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: position === "top" ? 5 : position === "bottom" ? -5 : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: position === "top" ? 5 : position === "bottom" ? -5 : 0,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl pointer-events-none",
              positions[position],
              className,
            )}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                "absolute w-2 h-2 bg-foreground rotate-45",
                position === "top"
                  ? "-bottom-1 left-1/2 -translate-x-1/2"
                  : position === "bottom"
                    ? "-top-1 left-1/2 -translate-x-1/2"
                    : position === "left"
                      ? "-right-1 top-1/2 -translate-y-1/2"
                      : "-left-1 top-1/2 -translate-y-1/2",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
