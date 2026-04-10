'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import {
  Bell,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

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

        {/* Search Bar - Disabled 
        <div className="relative w-10 md:w-64 lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Quick search (entries, categories...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hidden md:block pl-11 h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-primary/20 transition-all group-hover:bg-muted/60 font-medium"
          />
          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          {search && (
            <div className="absolute top-[calc(100%+12px)] left-0 w-full glass-card rounded-2xl p-4 shadow-2xl border-primary/10 animate-in slide-in-from-top-2">
               <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 px-2">Results for "{search}"</div>
               <div className="space-y-1">
                  <div className="p-3 rounded-xl hover:bg-primary/5 cursor-pointer flex items-center justify-between group/res transition-colors">
                     <span className="text-sm font-bold truncate">Simulated database hits...</span>
                     <span className="text-[9px] font-black uppercase text-primary/40 group-hover/res:text-primary transition-colors tracking-widest">Go to Ledger</span>
                  </div>
                  <div className="p-2 text-center text-[10px] bg-muted/20 rounded-xl font-bold text-muted-foreground/40 mt-2 italic">
                    Press Enter for full terminal view
                  </div>
               </div>
            </div>
          )}
        </div>
        */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 text-muted-foreground hover:bg-muted/50 transition-all duration-500 relative"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        {/* <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-muted-foreground relative hover:bg-muted/50 transition-all active:scale-95">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse"></span>
        </Button> */}

        <div className="hidden md:block h-8 w-px bg-border/40 mx-2"></div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 h-12 rounded-2xl gap-2 hover:bg-muted/50 transition-all border border-transparent hover:border-border/40 active:scale-95">
              <Avatar className="h-9 w-9 border-2 border-primary/20 shadow-sm transition-transform duration-500 hover:rotate-12">
                <AvatarImage src={user?.image || ''} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-[11px] font-black leading-none text-foreground mb-0.5">{user?.name}</p>
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Premium Member</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-[2rem] mt-2 shadow-2xl border-border/40 bg-background/95 backdrop-blur-xl transition-all duration-300 opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100">
            <DropdownMenuLabel className="px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Signed in as</p>
              <p className="text-sm font-bold text-foreground truncate">{user?.email}</p>
            </DropdownMenuLabel>

            <DropdownMenuItem asChild className="h-10 rounded-xl gap-3 cursor-pointer px-3 font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
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
