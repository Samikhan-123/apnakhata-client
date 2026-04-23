'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/features/MainLayout';
import { AdminStatusBanner } from '@/components/features/AdminStatusBanner';
import { adminService } from '@/services/admin.service';
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary';
import { FadeIn } from '@/components/ui/FramerMotion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
    if (!loading && (!user || !isStaff)) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await adminService.getSystemStatus();
        if (response.success) {
          setStatus(response.data);
        }
      } catch (error) {
        // Silently fail
      }
    };
    if (user?.role === 'ADMIN' || user?.role === 'MODERATOR') {
      fetchStatus();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Verifying Credentials</p>
        </div>
      </div>
    );
  }

  const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  if (!user || !isStaff) {
    return null;
  }

  return (
    <MainLayout isFixed={false}>
      <GlobalErrorBoundary>
        <FadeIn className="p-4 md:p-8 glass-card h-auto min-h-[500px] w-full border border-border/20 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 relative">
          <div className="flex-1 min-h-0 flex flex-col">
            {children}
          </div>
        </FadeIn>

        {/* Unified Admin Status Banner - Only rendered when status is confirmed */}
        {status && (
          <AdminStatusBanner 
            maintenanceMode={status.maintenanceMode} 
            registrationEnabled={status.registrationEnabled} 
          />
        )}
      </GlobalErrorBoundary>
    </MainLayout>
  );
}
