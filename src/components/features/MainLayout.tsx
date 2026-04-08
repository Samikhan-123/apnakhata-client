'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar - Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content Area */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-500 ease-in-out min-h-screen",
        "lg:pl-[280px]" // Desktop Offset
      )}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 flex flex-col scroll-smooth">
          <div className="dashboard-container flex-1">
            {children}
          </div>

          <footer className="mt-auto px-8 py-10 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <p>&copy; {new Date().getFullYear()} Apna Khata • Crafted with Logic & Care</p>
              <div className="flex gap-6">
                <Link href="/premium-experience" className="hover:text-primary transition-colors cursor-pointer">Premium Experience</Link>
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
