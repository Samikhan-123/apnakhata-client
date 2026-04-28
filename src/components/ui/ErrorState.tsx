"use client";

import React from "react";
import { AlertCircle, RefreshCcw, WifiOff } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  type?: "connection" | "server" | "initial";
  children?: React.ReactNode;
}

export function ErrorState({
  title = "Connection Error",
  message = "Something went wrong on our end. Please check your internet or try again later.",
  onRetry,
  className,
  type = "server",
  children,
}: ErrorStateProps) {
  const Icon = type === "connection" ? WifiOff : AlertCircle;

  return (
    <div
      className={cn(
        "glass-card rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500",
        className,
      )}
    >
      <div
        className={cn(
          "h-20 w-20 rounded-3xl flex items-center justify-center border-2 shadow-2xl animate-pulse",
          type === "connection"
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-rose-500/10 text-rose-500 border-rose-500/20",
        )}
      >
        <Icon size={40} strokeWidth={1.5} />
      </div>

      <div className="space-y-3 max-w-sm">
        <h3 className="text-2xl font-black tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="h-12 px-10 rounded-2xl gap-3 font-bold border-muted-foreground/10 hover:bg-muted-foreground/5 hover:border-muted-foreground/20 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCcw
            size={18}
            className="text-muted-foreground/50 group-hover:rotate-180 transition-transform duration-500"
          />
          <span>Try Again</span>
        </Button>
      )}

      {children}
    </div>
  );
}
