'use client';

import React, { useState } from 'react';
import { CategoryForm } from '@/components/features/CategoryForm';
import { CategoryList } from '@/components/features/CategoryList';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Search,
  Tags,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CustomModal } from '@/components/ui/CustomModal';
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-12 pb-20 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <SlideIn duration={0.5}>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">Categories</h1>
          <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg">
            Organize your finances by grouping transactions into meaningful collections.
          </p>
        </SlideIn>

        <div className="flex flex-col gap-4">
          <SlideIn delay={0.2} duration={0.5}>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full md:w-auto h-11 px-8 rounded-xl gap-2 font-bold shadow-sm bg-primary hover:bg-primary/90 active:scale-95 transition-all text-sm"
            >
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </Button>
          </SlideIn>

          <CustomModal
            isOpen={isDialogOpen}
            onClose={setIsDialogOpen}
            title="New Category"
            description="Pick a name and icon that makes sense for your spending habits."
          >
            <CategoryForm onSuccess={handleRefresh} />
          </CustomModal>
        </div>
      </div>

      {/* Main Content Grid */}
      <FadeIn delay={0.4} duration={0.6}>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider">Your Categories</span>
            </div>
          </div>

          <CategoryList key={refreshKey} />
        </div>
      </FadeIn>
    </div>
  );
}
