'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { categoryService } from '@/services/category.service';
import { toast } from 'sonner';

const POPULAR_ICONS = [
  'ShoppingBag', 'Home', 'Car', 'Utensils', 'Coffee', 
  'Zap', 'Shield', 'Gift', 'Heart', 'Briefcase',
  'Plane', 'Smartphone', 'Gamepad', 'Music', 'Book',
  'CreditCard', 'DollarSign', 'PieChart', 'TrendingUp', 'Wallet',
  'Activity', 'Apple', 'Bicycle', 'Camera', 'Dumbbell'
];

interface CategoryFormProps {
  onSuccess?: () => void;
  initialData?: { id: string; name: string; icon: string };
}

export function CategoryForm({ onSuccess, initialData }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || 'ShoppingBag');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedIcon(initialData.icon);
    }
  }, [initialData]);

  React.useEffect(() => {
    const fetchCount = async () => {
      try {
        const cats = await categoryService.getAll();
        setCount(cats.length);
      } catch (err) {
        console.error('Failed to fetch count:', err);
      }
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && count >= 20) {
      setError('Category limit reached (Max 20). Please delete an existing category first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (initialData?.id) {
        await categoryService.update(initialData.id, { name, icon: selectedIcon });
        toast.success('Category updated successfully');
      } else {
        await categoryService.create({ name, icon: selectedIcon });
        toast.success('Category created successfully');
      }
      if (!initialData) setName('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <Label htmlFor="category-name" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            Category Name
          </Label>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            count >= 20 ? "text-rose-500" : "text-primary/40"
          )}>
            {count} / 20 Slots
          </span>
        </div>
        <Input 
          id="category-name"
          placeholder="e.g., Luxury Dining"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-2xl border-none bg-muted/40 h-14 text-base font-bold focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
          required
        />
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
          Icon
        </Label>
        <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto p-1 scrollbar-none">
          {POPULAR_ICONS.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
            const isSelected = selectedIcon === iconName;
            
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setSelectedIcon(iconName)}
                className={cn(
                  "flex items-center justify-center h-14 w-full rounded-2xl transition-all duration-300",
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105" 
                    : "bg-muted/30 text-muted-foreground/40 hover:bg-muted/50 hover:text-muted-foreground"
                )}
              >
                <Icon size={24} strokeWidth={isSelected ? 3 : 2} />
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        disabled={loading || count >= 20}
      >
        {loading ? 'Saving...' : 'Save Category'}
      </Button>
    </form>
  );
}
