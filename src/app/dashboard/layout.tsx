"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/features/MainLayout";
import { FadeIn } from "@/components/ui/FramerMotion";
import { GlobalErrorBoundary } from "@/components/ui/GlobalErrorBoundary";
import { MaintenanceOverlay } from "@/components/features/MaintenanceOverlay";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/admin.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await adminService.getSystemStatus();
        if (response.success && response.data.maintenanceMode) {
          // Bypass for staff
          const isStaff = user?.role === "ADMIN" || user?.role === "MODERATOR";
          if (!isStaff) {
            setIsMaintenance(true);
          }
        }
      } catch (error) {
        // Fail silent, assume operational
      } finally {
        setCheckingStatus(false);
      }
    };

    checkMaintenance();
  }, [user]);

  return (
    <MainLayout>
      <GlobalErrorBoundary>
        {isMaintenance && <MaintenanceOverlay />}
        <FadeIn className="p-5 md:p-8 glass-card border md:border md:border-border/20 rounded-[2rem] md:rounded-[2rem] min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)] shadow-none md:shadow-2xl shadow-slate-200/5">
          {children}
        </FadeIn>
      </GlobalErrorBoundary>
    </MainLayout>
  );
}
