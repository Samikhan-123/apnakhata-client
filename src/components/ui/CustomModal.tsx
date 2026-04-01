"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface CustomModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: string // e.g., "500px" or "lg"
  className?: string
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "500px",
  className,
}: CustomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "p-0 border-none shadow-2xl rounded-[3rem] bg-background",
          className
        )}
        style={{ maxWidth }}
      >
        {/* Elegant Primary Header */}
        <div className="bg-primary p-8 text-primary-foreground">
          <DialogTitle className="text-4xl font-black tracking-tighter mb-2">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-primary-foreground/70 font-bold text-sm">
              {description}
            </DialogDescription>
          )}
        </div>

        {/* Scrollable Form/Content Area */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
          <div className="p-8">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
