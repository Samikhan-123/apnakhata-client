"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MaintenanceOverlay } from "./MaintenanceOverlay";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/admin.service";

export const MainLayout = ({
  children,
  isFixed = false,
}: {
  children: React.ReactNode;
  isFixed?: boolean;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === "ADMIN" || user?.role === "MODERATOR";

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await adminService.getSystemStatus();
        if (response.success && response.data.maintenanceMode && !isStaff) {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        // Fail silent
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // 1-minute heartbeat (Infrastructure optimized)
    return () => clearInterval(interval);
  }, [isStaff]);

  if (isMaintenance) {
    return <MaintenanceOverlay />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar - Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content Area */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-500 ease-in-out min-h-screen",
          "lg:pl-[280px]", // Desktop Offset
        )}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 flex flex-col scroll-smooth">
          <div
            className={cn(
              "flex-1 w-full max-w-[1440px] mx-auto sm:px-6 lg:px-8",
              isFixed ? "py-4 md:py-6" : "py-6 md:py-10",
            )}
          >
            {children}
          </div>

          <footer className="mt-auto px-4 md:px-8 py-8 md:py-12 border-t border-border/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div className="space-y-2">
                <p className="text-[10px] md:text-xs font-black tracking-[0.1em] text-foreground/60">
                  &copy; {new Date().getFullYear()} Apna Khata
                </p>
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                  Built for human simplicity • All Rights Reserved.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-widest">
                <Link
                  href="/guide"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  User Guide
                </Link>
                <Link
                  href="/manifesto"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Manifesto
                </Link>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
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
