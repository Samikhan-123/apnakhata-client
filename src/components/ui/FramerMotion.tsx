"use client";

import React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

/**
 * Standard Fade In animation
 */
export const FadeIn = ({
  children,
  className,
  delay = 0,
  duration = 0.3,
  ...props
}: MotionProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Subtle Slide + Fade animation
 */
export const SlideIn = ({
  children,
  className,
  delay = 0,
  duration = 0.3,
  direction = "up",
  distance = 20,
  ...props
}: MotionProps) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Smooth height transition for dynamic content like errors
 */
export const HeightChange = ({
  children,
  isVisible,
  className,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}) => (
  <AnimatePresence mode="wait">
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn("overflow-hidden", className)}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
