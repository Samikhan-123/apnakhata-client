'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  Tags,
  PiggyBank,
  BarChart3,
  PlusCircle,
  History,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Users,
  Activity,
  Zap,
  X,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
    ]
  },
  {
    title: 'Financials',
    items: [
      { name: 'Records', icon: ReceiptText, href: '/dashboard/ledger' },
      { name: 'Categories', icon: Tags, href: '/dashboard/categories' },
      { name: 'Budgets', icon: PiggyBank, href: '/dashboard/budgets' },
      { name: 'Auto-Pay', icon: RefreshCcw, href: '/dashboard/recurring' },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const isAdminSection = pathname.startsWith('/admin');

  let groups = [];
  
  if (isAdminSection) {
    groups = [
      {
        title: 'Administration',
        items: [
          { name: 'Admin Dashboard', icon: ShieldCheck, href: '/admin' },
          { name: 'User Management', icon: Users, href: '/admin/users' },
        ]
      },
      {
        title: 'Return',
        items: [
          { name: 'Back to App', icon: LayoutDashboard, href: '/dashboard' },
        ]
      }
    ];
  } else {
    groups = [...menuGroups];
    if (isAdmin) {
      groups.push({
        title: 'Administration',
        items: [
          { name: 'Admin Dashboard', icon: ShieldCheck, href: '/admin' },
        ]
      });
    }
  }

  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!checkStandalone);
  }, []);

  return (
    <aside className={cn(
      "fixed left-0 top-0 inset-y-0 w-[280px] bg-card border-r border-border/40 z-50 flex flex-col transition-all duration-300 ease-in-out",
      "lg:translate-x-0 h-full", // Always visible on desktop
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0" // Slide on mobile
    )}>
      {/* Brand Section */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-border/40">
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* <div className="w-10 h-10 bg-primary/5 flex items-center justify-center border border-primary/10 transition-all duration-300 "> */}
            <img src="/icon1.png" alt="Apna Khata" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform" />
          {/* </div> */}
          <span className="text-xl font-black tracking-tight text-foreground">
            Apna<span className="text-primary tracking-tighter ml-0.5">Khata</span>
          </span>
        </div>

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full hover:bg-muted/50"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 h-screen py-8 px-4 overflow-y-auto no-scrollbar">
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                      className={cn(
                        "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm relative group",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm scale-[1.02] border border-primary/10"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Install Prompt Trigger (Sidebar) */}
      {!isStandalone && (
        <div className="p-6 border-t border-border/40">
          <div 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm cursor-pointer group hover:bg-primary/10 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/10"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Download size={16} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">Install App</span>
              <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest mt-0.5">Mobile Native</span>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};
