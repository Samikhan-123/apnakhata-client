"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  LogOut,
  Settings,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-background/60 backdrop-blur-xl px-4 md:px-8 border-b border-border/40 transition-all">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full hover:bg-muted/50 transition-all active:scale-95"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 text-muted-foreground hover:bg-muted/50 transition-all duration-300 relative"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 transition-all text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 transition-all text-blue-600" />
            )
          ) : (
            <Sun className="h-5 w-5 opacity-0" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="hidden md:block h-8 w-px bg-border/40 mx-2"></div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-1 h-12 rounded-2xl gap-2 hover:bg-muted/50 transition-all border border-transparent hover:border-border/40 active:scale-95"
            >
              <Avatar className="h-9 w-9 border-2 border-primary/20 shadow-sm transition-transform duration-500 hover:rotate-12">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-[11px] font-black leading-none text-foreground mb-0.5">
                  {user?.name}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 p-2 rounded-[2rem] mt-2 shadow-2xl border-border/40 bg-background/95 backdrop-blur-xl transition-all duration-300 opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100"
          >
            <DropdownMenuLabel className="px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                Signed in as
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {user?.email}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuItem
              asChild
              className="h-10 rounded-xl gap-3 cursor-pointer px-3 font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-border/40" />
            <DropdownMenuItem
              onClick={logout}
              className="h-10 rounded-xl gap-3 cursor-pointer px-3 text-destructive font-semibold text-sm focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
