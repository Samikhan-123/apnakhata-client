'use client';

import { MainLayout } from '@/components/features/MainLayout';
import { FadeIn } from '@/components/ui/FramerMotion';
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <GlobalErrorBoundary>
        <FadeIn className="p-4 md:p-8 glass-card border-none md:border md:border-border/20 rounded-none md:rounded-[2rem] min-h-[calc(100vh-8rem)] shadow-none md:shadow-2xl shadow-slate-200/5 overflow-hidden">
          {children}
        </FadeIn>
      </GlobalErrorBoundary>
    </MainLayout>
  );
}
