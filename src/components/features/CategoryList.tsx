'use client';

import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { categoryService } from '@/services/category.service';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Trash2, Lock } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { capitalize } from '@/lib/utils';
import { CategoryForm } from './CategoryForm';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

export function CategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAll();
      setCategories(response || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(deleteId);
      toast.success('Category removed');
      fetchCategories();
    } catch (error: any) {
      // Handled by global interceptor
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glass-card rounded-[2rem] p-5 flex items-center gap-5 border-border/20">
            {/* Using a pulsing div since we already have animate-pulse on the container if we wanted, but let's use the Skeleton component */}
            <div className="h-14 w-14 rounded-2xl bg-muted/30 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Unable to Load Categories"
        message={error}
        onRetry={fetchCategories}
        className="py-20"
      />
    );
  }

  if (categories.length === 0) {
    return (
      <div className="glass-card rounded-[2.5rem] p-24 text-center border-dashed border-2 border-primary/10">
        <LucideIcons.Tags className="h-12 w-12 text-primary/30 mx-auto mb-6" />
        <h3 className="text-xl font-black tracking-tighter">No Categories Yet</h3>
        <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto text-sm">Create categories to start organizing your ledger entries professionally.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category: any, index) => {
          const Icon = (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;
          
          return (
            <div 
              key={category.id} 
              className="glass-card rounded-[2rem] p-5 flex items-center gap-5 group transition-all hover:translate-y-[-4px] animate-fade-in-scale opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500 border border-primary/10">
                <Icon size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-foreground truncate tracking-tight">{capitalize(category.name)}</h3>
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mt-1">
                  {category.isSystem ? 'Standard' : 'Personal'}
                </p>
              </div>
              
              {!category.isSystem ? (
                <Button 
                  variant="ghost" 
                   size="icon"
                   className={cn(
                    "rounded-2xl h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all active:scale-90",
                    "opacity-100 lg:opacity-0 lg:group-hover:opacity-100" // Visible on mobile, hover on desktop
                  )}
                  onClick={() => setEditingCategory(category)}
                  title="Edit Category"
                >
                  <LucideIcons.Edit3 className="h-4 w-4" />
                </Button>
              ) : (
                <div 
                  className="h-10 w-10 flex items-center justify-center text-primary/40 bg-primary/5 rounded-xl border border-primary/10 shrink-0" 
                  title="System categories are locked"
                >
                  <Lock className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog 
        open={!!editingCategory} 
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
          <div className="glass-card rounded-[2.5rem] p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-black tracking-tighter">Edit Category</DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold">
                Change the name or icon to better fit your records.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm 
              initialData={editingCategory} 
              onSuccess={() => {
                setEditingCategory(null);
                fetchCategories();
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
