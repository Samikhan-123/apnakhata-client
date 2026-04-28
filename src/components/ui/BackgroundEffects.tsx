"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const RetroGrid = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 [perspective:200px] overflow-hidden pointer-events-none",
        className,
      )}
    >
      <div className="absolute inset-0 [transform:rotateX(35deg)]">
        <div className="absolute inset-0 animate-grid [background-image:linear-gradient(to_right,rgba(var(--primary-rgb),0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary-rgb),0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  );
};

export const Beam = ({
  className,
  delay = 0,
  duration = 8,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) => {
  return (
    <div
      className={cn(
        "absolute pointer-events-none overflow-hidden w-20",
        className,
      )}
    >
      {/* Primary Beam */}
      <motion.div
        initial={{ top: "-300px", opacity: 0 }}
        animate={{
          top: ["-300px", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay,
          ease: "linear",
        }}
        className="absolute left-1/2 -translate-x-1/2 h-64 w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent blur-[1px] z-20"
      />

      {/* Glow effect */}
      <motion.div
        initial={{ top: "-300px", opacity: 0 }}
        animate={{
          top: ["-300px", "100%"],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay,
          ease: "linear",
        }}
        className="absolute left-1/2 -translate-x-1/2 h-64 w-[12px] bg-primary/30 blur-xl z-10"
      />
    </div>
  );
};

export const Sparkles = ({ count = 20 }: { count?: number }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 bg-primary rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [null, "-=100"],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};
