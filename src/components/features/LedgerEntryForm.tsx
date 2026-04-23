'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ledgerEntrySchema, LedgerEntryInput } from '@/lib/validations';
import { ledgerEntryService } from '../../services/ledger-entry.service';
import { categoryService } from '../../services/category.service';
import { budgetService } from '../../services/budget.service';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, PlusCircle, ArrowUpRight, ArrowDownLeft, Banknote, Tags, Workflow, AlignLeft, Calendar as CalendarIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn, capitalize } from "@/lib/utils";
import { toast } from "sonner";
import { format, isToday, isYesterday } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


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
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currency, formatCurrency } = useCurrency();
  const { readOnly } = useAuth();

  const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isIncomeRequired = totalIncome <= 0;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<LedgerEntryInput>({
    resolver: zodResolver(ledgerEntrySchema),
    defaultValues: {
      type: initialData?.type || (isIncomeRequired ? 'INCOME' : 'EXPENSE'),
      amount: initialData?.amount ? Number(initialData.amount) : 0,
      description: initialData?.description || (isIncomeRequired ? 'Salary' : ' '),
      categoryId: initialData?.categoryId || null,
      date: initialData?.date || new Date().toISOString()
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('type', initialData.type);
      setValue('amount', String(initialData.amount));
      setValue('description', initialData.description);
      setValue('categoryId', initialData.categoryId);
      setValue('date', initialData.date);
    }
  }, [initialData, setValue]);

  const type = watch('type');
  const selectedCategoryId = watch('categoryId');
  const amountValue = watch('amount');
  const descriptionValue = watch('description');

  // Budget Awareness Logic
  const activeBudget = type === 'EXPENSE' && selectedCategoryId 
    ? budgets.find(b => b.categoryId === selectedCategoryId)
    : null;

  const remainingBudget = activeBudget 
    ? Number(activeBudget.limit) - Number(activeBudget.spent)
    : null;

  const isExceedingBudget = remainingBudget !== null && Number(amountValue) > remainingBudget;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, budgetData] = await Promise.all([
          categoryService.getAll(),
          budgetService.getAll() // Fetches current month budgets
        ]);
        setCategories(catData || []);
        setBudgets(budgetData || []);
      } catch (error) {
        // console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Sync types and descriptions
  useEffect(() => {
    if (type === 'INCOME') {
      setValue('categoryId', null);
      // Auto-set TO salary if empty or invalid
      // if (!descriptionValue) {
      //   setValue('description', 'Salary');
      // }
    }
  }, [type, setValue, descriptionValue]);

  const onSubmit = async (values: LedgerEntryInput) => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }

    // Frontend Balance Validations
    if (values.type === 'EXPENSE' && !initialData) {
      if (totalIncome <= 0) {
        toast.error("Process Income First! You need funds before adding an expense.");
        return;
      }
      if (Number(values.amount) > (remainingBalance || 0)) {
        toast.error(`Insufficient Balance! Your current balance is ${formatCurrency(remainingBalance || 0)}.`);
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
        toast.success('Record updated');
      } else {
        await ledgerEntryService.create({
          ...values,
          amount: Number(values.amount),
          categoryId: values.type === 'INCOME' ? null : values.categoryId
        });
        toast.success('Record saved');
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
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div>
              <RadioGroupItem value="INCOME" id="income" className="peer sr-only" />
              <Label
                htmlFor="income"
                className="flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-[1.25rem] border-2 border-muted bg-muted/20 p-3 sm:p-4 hover:bg-muted/40 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/5 transition-all cursor-pointer group shadow-sm"
              >
                <ArrowUpRight className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-all", type === 'INCOME' ? "text-emerald-500 shrink-0" : "text-muted-foreground/40")} />
                <span className={cn("text-[9px] sm:text-[10px] font-black uppercase tracking-widest", type === 'INCOME' ? "text-emerald-500" : "text-muted-foreground/40")}>Income</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="EXPENSE" id="expense" disabled={isIncomeRequired && !initialData} className="peer sr-only" />
              <Label
                htmlFor="expense"
                className={cn(
                  "flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-[1.25rem] border-2 border-muted bg-muted/20 p-3 sm:p-4 transition-all cursor-pointer group shadow-sm",
                  isIncomeRequired && !initialData
                    ? "opacity-40 cursor-not-allowed bg-muted/5 border-dashed" 
                    : "hover:bg-muted/40 peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-500/5"
                )}
              >
                <ArrowDownLeft className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-all", type === 'EXPENSE' ? "text-rose-500" : "text-muted-foreground/40")} />
                <span className={cn("text-[9px] sm:text-[10px] font-black uppercase tracking-widest", type === 'EXPENSE' ? "text-rose-500" : "text-muted-foreground/40")}>Expense</span>
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
                {selectedCurrency.symbol}
              </span>
              <Input 
                type="number" 
                {...register('amount')}
                className={cn(
                  "h-16 sm:h-20 pl-16 pr-8 rounded-2xl sm:rounded-[2rem] border-none bg-muted/30 focus:bg-background focus:ring-primary/10 text-2xl sm:text-3xl font-black tabular-nums transition-all placeholder:text-muted-foreground/10",
                  errors.amount && "ring-2 ring-rose-500/20 bg-rose-500/5"
                )}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.amount as any).message}</p>}
          </div>

          {/* Date Selector */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-1 flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5 text-primary" /> Record Date
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setValue('date', new Date().toISOString())}
                className={cn(
                  "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  isToday(new Date(watch('date') || '')) 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-muted/30 text-muted-foreground/40 hover:bg-muted/50"
                )}
              >
                Today
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setValue('date', yesterday.toISOString());
                }}
                className={cn(
                  "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  isYesterday(new Date(watch('date') || '')) 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-muted/30 text-muted-foreground/40 hover:bg-muted/50"
                )}
              >
                Yesterday
              </Button>
            </div>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-14 sm:h-16 w-full px-6 rounded-xl sm:rounded-[1.25rem] border-none bg-muted/30 hover:bg-muted/40 font-bold text-base transition-all justify-start",
                    !watch('date') && "text-muted-foreground/40"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary/40" />
                  {watch('date') ? format(new Date(watch('date')!), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl border border-border mt-2 shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={watch('date') ? new Date(watch('date')!) : undefined}
                  onSelect={(date) => {
                    setValue('date', date?.toISOString());
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => {
                    const now = new Date();
                    
                    // 1. Current Month Boundary
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();

                    // 2. Target Month
                    const targetMonth = date.getMonth();
                    const targetYear = date.getFullYear();

                    // Calculate indices for 3-month window comparison
                    const nowIdx = (currentYear * 12) + currentMonth;
                    const targetIdx = (targetYear * 12) + targetMonth;

                    const diff = targetIdx - nowIdx;

                    // Allow only [Previous Month, Current Month, Next Month]
                    return diff < -1 || diff > 1;
                  }}
                  initialFocus
                  className="p-4"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description / Income Source */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-1 flex items-center gap-2">
              {type === 'INCOME' ? <Workflow className="h-3.5 w-3.5 text-primary" /> : <AlignLeft className="h-3.5 w-3.5 text-primary" />} 
              {type === 'INCOME' ? 'Where from?' : 'What for?'}
            </Label>
            <Input 
              {...register('description')}
              className={cn(
                "h-14 sm:h-16 px-6 rounded-xl sm:rounded-[1.25rem] border-none bg-muted/30 focus:bg-background font-bold text-base transition-all placeholder:text-muted-foreground/20",
                errors.description && "ring-2 ring-rose-500/20 bg-rose-500/5"
              )}
              placeholder={type === 'INCOME' ? "e.g., Salary" : "What was this for?"}
            />
            {errors.description && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.description as any).message}</p>}
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

              {/* Smart Budget Awareness Indicator */}
              {activeBudget && (
                <div className={cn(
                  "p-4 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isExceedingBudget 
                    ? "bg-rose-500/5 border-rose-500/20 text-rose-600" 
                    : "bg-primary/5 border-primary/20 text-primary"
                )}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isExceedingBudget ? "bg-rose-500" : "bg-primary")} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {capitalize(categories.find(c => c.id === selectedCategoryId)?.name || '')} Budget
                      </span>
                    </div>
                    <span className="text-[10px] font-black tabular-nums">
                      {remainingBudget?.toLocaleString()} {selectedCurrency.symbol} Left
                    </span>
                  </div>
                  
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", isExceedingBudget ? "bg-rose-500" : "bg-primary")}
                      style={{ width: `${Math.min((Number(activeBudget.spent) / Number(activeBudget.limit)) * 100, 100)}%` }}
                    />
                  </div>

                  {isExceedingBudget && (
                    <p className="mt-2 text-[9px] font-bold italic flex items-center gap-1">
                      <AlertCircle size={10} /> 
                      Warning: This entry will exceed your {capitalize(categories.find(c => c.id === selectedCategoryId)?.name || '')} budget.
                    </p>
                  )}
                </div>
              )}

              {errors.categoryId && <p className="text-[10px] font-black uppercase text-rose-500 px-1">Please select a category</p>}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={loading || readOnly}
          className={cn(
            "w-full h-16 sm:h-20 rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-primary/20 hover:bg-primary transition-all active:scale-95 border-none",
            readOnly && "opacity-50 grayscale cursor-not-allowed hover:bg-muted"
          )}
        >
          {readOnly ? 'Locked: Diagnostic Session' : (loading ? 'Saving...' : (initialData ? 'Update Record' : 'Add to Records'))}
        </Button>
      </form>
    </div>
  );
};
