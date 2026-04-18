'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MaintenanceOverlay } from './MaintenanceOverlay';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export const MainLayout = ({ children, isFixed = false }: { children: React.ReactNode, isFixed?: boolean }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/system/status`);
        if (data.success && data.data.maintenanceMode && !isStaff) {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        // console.error('Status check failed', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000); // Poll every 15s (Ultra-fast detection, Zero DB cost)
    return () => clearInterval(interval);
  }, [isStaff]);

  if (isMaintenance) {
    return <MaintenanceOverlay />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
      {/* Sidebar - Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content Area */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-500 ease-in-out min-h-screen overflow-x-hidden",
        "lg:pl-[280px]" // Desktop Offset
      )}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 flex flex-col scroll-smooth overflow-x-hidden">
          <div className={cn(
            "flex-1 w-full max-w-[1440px] mx-auto sm:px-6 lg:px-8",
            isFixed ? "py-4 md:py-6" : "py-6 md:py-10"
          )}>
            {children}
          </div>

          <footer className="mt-auto px-8 py-10 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <p>&copy; {new Date().getFullYear()} Apna Khata • Built for human simplicity.</p>
              <div className="flex gap-6">
                <Link href="/guide" className="hover:text-primary transition-colors cursor-pointer">User Guide</Link>
                <Link href="/manifesto" className="hover:text-primary transition-colors cursor-pointer">Manifesto</Link>
                <Link href="/contact" className="hover:text-primary transition-colors cursor-pointer">Contact</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 opacity-0 animate-fade-in-up"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
