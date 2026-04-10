'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryInput } from '@/lib/validations';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      icon: initialData?.icon || 'ShoppingBag'
    }
  });

  const selectedIcon = watch('icon');

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('icon', initialData.icon);
    }
  }, [initialData, setValue]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const cats = await categoryService.getAll();
        setCount(cats.length);
      } catch (err) {}
    };
    fetchCount();
  }, []);

  const onSubmit = async (data: CategoryInput) => {
    if (!initialData && count >= 20) {
      toast.error('Category limit reached (Max 20).');
      return;
    }
    setLoading(true);
    try {
      if (initialData?.id) {
        await categoryService.update(initialData.id, data);
        toast.success('Category updated');
      } else {
        await categoryService.create(data);
        toast.success('Category created');
      }
      if (!initialData) reset();
      onSuccess?.();
    } catch (err: any) {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
          {...register('name')}
          className={cn(
            "rounded-2xl border-none bg-muted/40 h-14 text-base font-bold focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/30",
            errors.name && "ring-2 ring-rose-500/20 bg-rose-500/5"
          )}
        />
        {errors.name && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{errors.name.message}</p>}
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
                onClick={() => setValue('icon', iconName)}
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
        {errors.icon && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{errors.icon.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 sm:h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        disabled={loading || count >= 20}
      >
        {loading ? 'Saving...' : 'Save Category'}
      </Button>
    </form>
  );
}
