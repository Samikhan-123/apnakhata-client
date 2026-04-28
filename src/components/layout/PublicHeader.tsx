"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function PublicHeader() {
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 drop-shadow-xl">
            <img
              src="/icon1.png"
              alt="Apna Khata"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground hidden sm:block">
            Apna <span className="text-primary tracking-tighter">Khata</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl w-11 h-11 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all duration-300 relative"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            title="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 transition-all text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 transition-all text-blue-600" />
              )
            ) : (
              <Sun className="h-5 w-5 opacity-0" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <Link href="/dashboard">
              <Button className="h-11 px-4 md:px-6 rounded-xl bg-primary text-primary-foreground hover:scale-105 font-bold transition-all shadow-lg shadow-primary/20 gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="h-11 px-6 rounded-xl font-bold hover:bg-primary/5 hover:text-primary transition-all"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="hidden md:flex h-11 px-6 rounded-xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-bold transition-all shadow-xl shadow-foreground/5 gap-2">
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
