'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/features/MainLayout';
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary';
import { FadeIn } from '@/components/ui/FramerMotion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <MainLayout isFixed={false}>
      <GlobalErrorBoundary>
        <FadeIn className="p-4 md:p-8 glass-card h-auto min-h-[500px] w-full border border-border/20 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-500">
          <div className="flex-1 min-h-0 flex flex-col">
            {children}
          </div>
        </FadeIn>
      </GlobalErrorBoundary>
    </MainLayout>
  );
}
