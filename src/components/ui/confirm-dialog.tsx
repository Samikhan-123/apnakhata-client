"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] p-8 md:p-12 border border-primary/20 bg-background/40 backdrop-blur-3xl shadow-2xl sapphire-glow overflow-hidden">
        {/* Decorative background beam */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

        <DialogHeader className="relative z-10">
          <div
            className={cn(
              "mx-auto w-24 h-24 rounded-[2.2rem] flex items-center justify-center mb-8 border transition-all duration-500",
              variant === "danger"
                ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                : "bg-primary/10 border-primary/20 text-primary",
            )}
          >
            <AlertTriangle
              className={cn(
                "h-12 w-12",
                variant === "danger" && "animate-pulse",
              )}
            />
          </div>
          <DialogTitle className="text-3xl md:text-4xl font-black text-center tracking-tight leading-none mb-4 text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground font-medium text-base md:text-lg leading-relaxed px-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-12 relative z-10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl h-16 font-black uppercase tracking-widest text-[11px] hover:bg-muted/40 transition-all"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="flex-1 p-4 rounded-2xl h-14 font-bold text-white uppercase tracking-widest text-[10px] bg-rose-900 hover:bg-rose-800 shadow-lg shadow-rose-500/20 border-none"
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
