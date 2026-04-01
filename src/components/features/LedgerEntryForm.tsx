'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ledgerEntryService } from '../../services/ledger-entry.service';
import { categoryService } from '../../services/category.service';
import { useCurrency } from '@/context/CurrencyContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, PlusCircle, ArrowUpRight, ArrowDownLeft, Banknote, Tags, Workflow, AlignLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn, capitalize } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  amount: z.string().min(1, 'Value required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be positive'),
  description: z.string().min(1, 'Required'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.type === 'EXPENSE' && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Required",
      path: ['categoryId']
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface LedgerEntryFormProps {
  onRefresh: () => void;
  totalIncome?: number;
  remainingBalance?: number;
  initialData?: any;
}

export const LedgerEntryForm = ({ 
  onRefresh, 
  totalIncome = 0,
  remainingBalance = 0,
  initialData
}: LedgerEntryFormProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();

  const isIncomeRequired = totalIncome <= 0;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || (isIncomeRequired ? 'INCOME' : 'EXPENSE'),
      amount: initialData?.amount ? String(initialData.amount) : '',
      description: initialData?.description || (isIncomeRequired ? 'salary' : ''),
      categoryId: initialData?.categoryId || null
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('type', initialData.type);
      setValue('amount', String(initialData.amount));
      setValue('description', initialData.description);
      setValue('categoryId', initialData.categoryId);
    }
  }, [initialData, setValue]);

  const type = watch('type');
  const selectedCategoryId = watch('categoryId');
  const amountValue = watch('amount');
  const descriptionValue = watch('description');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await categoryService.getAll();
        setCategories(catData || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Sync types and descriptions
  useEffect(() => {
    if (type === 'INCOME') {
      setValue('categoryId', null);
      // Auto-set first option if empty or invalid
      if (!descriptionValue || !['salary', 'business', 'freelance'].includes(descriptionValue)) {
        setValue('description', 'salary');
      }
    }
  }, [type, setValue, descriptionValue]);

  const onSubmit = async (values: FormValues) => {
    // Frontend Balance Validations
    if (values.type === 'EXPENSE') {
      if (totalIncome <= 0) {
        toast.error("Process Income First! You need funds before adding an expense.");
        return;
      }
      if (Number(values.amount) > (remainingBalance || 0)) {
        toast.error(`Insufficient Balance! Your current balance is ${currency === 'PKR' ? 'Rs.' : '$'}${(remainingBalance || 0).toLocaleString()}.`);
        return;
      }
    }

    setLoading(true);
    try {
      if (initialData?.id) {
        await ledgerEntryService.update(initialData.id, {
          ...values,
          amount: Number(values.amount),
          categoryId: values.type === 'INCOME' ? null : values.categoryId
        });
        toast.success('Transaction updated');
      } else {
        await ledgerEntryService.create({
          ...values,
          amount: Number(values.amount),
          categoryId: values.type === 'INCOME' ? null : values.categoryId
        });
        toast.success('Transaction saved');
      }
      onRefresh();
      if (!initialData) {
        reset({
          type: isIncomeRequired ? 'INCOME' : 'EXPENSE',
          amount: '',
          description: isIncomeRequired ? 'salary' : '',
          categoryId: null
        });
      }
    } catch (error: any) {
      // Handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {isIncomeRequired && !initialData && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="p-2 h-fit rounded-lg bg-emerald-500/20 text-emerald-600">
              <AlertCircle className="h-4 w-4" />
           </div>
           <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Add Income First</h4>
              <p className="text-[11px] font-bold text-emerald-600/70 leading-relaxed italic">
                Your current balance is zero. Please record an income (salary, business, etc.) to start tracking your expenses!
              </p>
           </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Type Selection */}
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-1">Choose Entry Type</Label>
          <RadioGroup 
            value={type} 
            onValueChange={(val: any) => setValue('type', val)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="INCOME" id="income" className="peer sr-only" />
              <Label
                htmlFor="income"
                className="flex items-center justify-center gap-3 rounded-[1.25rem] border-2 border-muted bg-muted/20 p-4 hover:bg-muted/40 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/5 transition-all cursor-pointer group shadow-sm"
              >
                <ArrowUpRight className={cn("h-5 w-5 transition-all", type === 'INCOME' ? "text-emerald-500 shrink-0" : "text-muted-foreground/40")} />
                <span className={cn("text-[10px] font-black uppercase tracking-widest", type === 'INCOME' ? "text-emerald-500" : "text-muted-foreground/40")}>Income</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="EXPENSE" id="expense" disabled={isIncomeRequired && !initialData} className="peer sr-only" />
              <Label
                htmlFor="expense"
                className={cn(
                  "flex items-center justify-center gap-3 rounded-[1.25rem] border-2 border-muted bg-muted/20 p-4 transition-all cursor-pointer group shadow-sm",
                  isIncomeRequired && !initialData
                    ? "opacity-40 cursor-not-allowed bg-muted/5 border-dashed" 
                    : "hover:bg-muted/40 peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-500/5"
                )}
              >
                <ArrowDownLeft className={cn("h-5 w-5 transition-all", type === 'EXPENSE' ? "text-rose-500" : "text-muted-foreground/40")} />
                <span className={cn("text-[10px] font-black uppercase tracking-widest", type === 'EXPENSE' ? "text-rose-500" : "text-muted-foreground/40")}>Expense</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-10">
          {/* Amount */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-1 flex items-center gap-2">
              <Banknote className="h-3.5 w-3.5 text-primary" /> Amount ({currency})
            </Label>
            <div className="relative group/val">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground/20 group-focus-within/val:text-primary transition-all">
                {currency === 'PKR' ? 'Rs' : '$'}
              </span>
              <Input 
                type="number" 
                {...register('amount')}
                className={cn(
                  "h-20 pl-16 pr-8 rounded-[2rem] border-none bg-muted/30 focus:bg-background focus:ring-primary/10 text-3xl font-black tabular-nums transition-all placeholder:text-muted-foreground/10",
                  errors.amount && "ring-2 ring-rose-500/20 bg-rose-500/5"
                )}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{errors.amount.message}</p>}
          </div>

          {/* Description / Income Source */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-1 flex items-center gap-2">
              {type === 'INCOME' ? <Workflow className="h-3.5 w-3.5 text-primary" /> : <AlignLeft className="h-3.5 w-3.5 text-primary" />} 
              {type === 'INCOME' ? 'Where from?' : 'What for?'}
            </Label>
            {type === 'INCOME' ? (
              <Select 
                value={descriptionValue} 
                onValueChange={(val) => setValue('description', val)}
              >
                <SelectTrigger className={cn(
                  "h-16 px-6 rounded-[1.25rem] border-none bg-muted/30 focus:bg-background font-bold text-base transition-all",
                  errors.description && "ring-2 ring-rose-500/20 bg-rose-500/5"
                )}>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/40 bg-background/80 backdrop-blur-xl">
                  <SelectItem value="salary" className="rounded-xl font-bold py-3 uppercase tracking-tighter text-[11px]">Salary</SelectItem>
                  <SelectItem value="business" className="rounded-xl font-bold py-3 uppercase tracking-tighter text-[11px]">Business</SelectItem>
                  <SelectItem value="freelance" className="rounded-xl font-bold py-3 uppercase tracking-tighter text-[11px]">Freelance</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input 
                {...register('description')}
                className={cn(
                  "h-16 px-6 rounded-[1.25rem] border-none bg-muted/30 focus:bg-background font-bold text-base transition-all placeholder:text-muted-foreground/20",
                  errors.description && "ring-2 ring-rose-500/20 bg-rose-500/5"
                )}
                placeholder="What was this for?"
              />
            )}
            {errors.description && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{errors.description.message}</p>}
          </div>

          {/* Category Selector (Expense Only) */}
          {type === 'EXPENSE' && (
            <div className="space-y-4 animate-fade-in-scale">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 flex items-center gap-2">
                  <Tags className="h-3.5 w-3.5 text-primary" /> Category
                </Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat, idx) => {
                  const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.HelpCircle;
                  const isSelected = selectedCategoryId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue('categoryId', cat.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 active:scale-95 group",
                        isSelected 
                         ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5" 
                         : "border-transparent bg-muted/20 text-muted-foreground/50 hover:bg-muted/40"
                      )}
                    >
                      <Icon size={20} strokeWidth={isSelected ? 3 : 2} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest truncate w-full px-1">{capitalize(cat.name)}</span>
                    </button>
                  );
                })}
              </div>
              {errors.categoryId && <p className="text-[10px] font-black uppercase text-rose-500 px-1">Please select a category</p>}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-primary/20 hover:bg-primary transition-all active:scale-95 border-none"
        >
          {loading ? 'Saving...' : (initialData ? 'Update Record' : 'Add to Ledger')}
        </Button>
      </form>
    </div>
  );
};
