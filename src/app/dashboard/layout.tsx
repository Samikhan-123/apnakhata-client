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
        <FadeIn className="m-4 md:m-8 p-6 md:p-10 glass-card border border-border/20 rounded-[3rem] min-h-[calc(100vh-8rem)] shadow-2xl shadow-slate-200/5 overflow-hidden">
          {children}
        </FadeIn>
      </GlobalErrorBoundary>
    </MainLayout>
  );
}
