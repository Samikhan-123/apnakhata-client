'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
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
  variant = 'danger',
  loading = false
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] p-8 border-none bg-background/80 backdrop-blur-3xl shadow-2xl">
        <DialogHeader>
          <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-rose-500/20">
            <AlertTriangle className="h-10 w-10 text-rose-500" />
          </div>
          <DialogTitle className="text-3xl font-black text-center tracking-tighter leading-none mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground font-medium text-balance px-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] hover:bg-muted/50 border-none"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 border-none"
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
