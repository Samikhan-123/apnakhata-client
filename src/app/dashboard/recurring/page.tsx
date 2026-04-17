'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recurringTaskSchema, RecurringTaskInput } from '@/lib/validations';
import { recurringService } from '@/services/recurring.service';
import { categoryService } from '@/services/category.service';
import { useCurrency } from '@/context/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Calendar,
  RefreshCcw,
  Timer,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { format } from 'date-fns';
import { cn, capitalize } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomModal } from '@/components/ui/CustomModal';
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/context/AuthContext';

export default function RecurringPage() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currency, formatCurrency } = useCurrency();
  const { readOnly } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<RecurringTaskInput>({
    resolver: zodResolver(recurringTaskSchema),
    defaultValues: {
      type: 'EXPENSE',
      frequency: 'MONTHLY',
      amount: 0,
      description: '',
      nextExecution: new Date().toISOString().split('T')[0]
    }
  });

  const type = watch('type');
  const amount = watch('amount');
  const description = watch('description');
  const frequency = watch('frequency');

  const handleForceSync = async () => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    toast.promise(
      (async () => {
        try {
          const response = await recurringService.processManual();
          if (response.successCount === 0 && response.count > 0 && !response.message?.includes('Successfully synced')) {
            throw new Error(response.message || 'Sync failed');
          }
          await fetchData(true);
          return response.message || `Synced ${response.successCount} tasks.`;
        } catch (err: any) { throw err; }
      })(),
      {
        loading: 'Syncing recurring tasks...',
        success: (msg: string) => msg,
        error: null,
      }
    );
  };

  const fetchData = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [patternData, catData] = await Promise.all([
        recurringService.getAll(),
        categoryService.getAll()
      ]);
      setPatterns(patternData || []);
      setCategories(catData || []);

      if (catData?.length > 0) {
        setValue('categoryId', catData[0].id);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: RecurringTaskInput) => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    setLoading(true);
    try {
      const executionDateTime = new Date(`${data.nextExecution}T12:00:00`);

      await recurringService.create({
        ...data,
        description: data.description.toLowerCase(),
        amount: Number(data.amount),
        categoryId: data.type === 'INCOME' ? undefined : (data.categoryId || undefined),
        nextExecution: executionDateTime.toISOString()
      });

      toast.success("Automated task added");
      setIsModalOpen(false);
      reset();
      fetchData(true);
    } catch (error) {
      // Handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await recurringService.delete(deleteId);
      toast.success("Task removed");
      fetchData(true);
    } catch (error) {
      // Handled by global interceptor
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getFrequencyNote = () => {
    const val = amount ? `${currency === 'PKR' ? 'Rs.' : '$'}${amount}` : 'this amount';
    const action = type === 'INCOME' ? 'added to your income' : 'counted as an expense';

    switch (frequency) {
      case 'WEEKLY': return `${val} will be ${action} every week.`;
      case 'MONTHLY': return `${val} will be ${action} on this day every month.`;
      case 'YEARLY': return `${val} will be ${action} once a year.`;
      default: return '';
    }
  };

  return (
    <div className="space-y-12 pb-20 w-full">
      {/* Header & Status Center */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <SlideIn duration={0.5}>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">Transaction Automation</h1>
          <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg">
            Manage your automated payments and regular income transactions in one place. No need to log the same transaction again and again.
          </p>
        </SlideIn>

        <SlideIn delay={0.2} duration={0.5}>
          <div className="flex items-center justify-between flex-col sm:flex-row sm:gap-8 gap-4 premium-card p-4 px-6 rounded-3xl border-border/40">
            <div className="flex items-center justify-between gap-4">
              <div className="h-12 w-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10">
                <Timer size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-0.5 leading-none">Active Tasks</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">{patterns.length}</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-border/40 hidden sm:block" />

            <Button
              onClick={() => !readOnly && setIsModalOpen(true)}
              disabled={readOnly}
              className={cn(
                "w-full md:w-auto h-11 px-8  rounded-xl bg-primary text-primary-foreground font-bold active:scale-95 transition-all gap-2",
                readOnly && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              <Plus size={18} />
              <span>{readOnly ? 'Locked' : 'Add Task'}</span>
            </Button>
          </div>
        </SlideIn>

        <CustomModal
          isOpen={isModalOpen}
          onClose={setIsModalOpen}
          title="New Automated Task"
          description="Setup a regular payment or automated income."
          maxWidth="550px"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val: any) => {
                      field.onChange(val);
                      setValue('description', '');
                    }}
                  >
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="EXPENSE" className="rounded-lg font-bold">Expense</SelectItem>
                      <SelectItem value="INCOME" className="rounded-lg font-bold">Income</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.type as any).message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Amount ({currency})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...register('amount')}
                  className={cn(
                    "h-14 rounded-2xl bg-muted/40 border-none font-black text-xl px-6",
                    errors.amount && "ring-2 ring-rose-500/20 bg-rose-500/5"
                  )}
                />
                {errors.amount && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.amount as any).message}</p>}
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Frequency</Label>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="WEEKLY" className="rounded-lg font-bold">Weekly</SelectItem>
                        <SelectItem value="MONTHLY" className="rounded-lg font-bold">Monthly</SelectItem>
                        <SelectItem value="YEARLY" className="rounded-lg font-bold">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.frequency && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.frequency as any).message}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Description</Label>
              {type === 'INCOME' ? (
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold text-foreground text-foreground">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="salary" className="rounded-lg font-bold">Salary</SelectItem>
                        <SelectItem value="business" className="rounded-lg font-bold">Business</SelectItem>
                        <SelectItem value="freelance" className="rounded-lg font-bold">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input
                  placeholder="e.g., Monthly Rent"
                  {...register('description')}
                  className={cn(
                    "h-14 rounded-2xl bg-muted/40 border-none font-bold px-6 text-foreground",
                    errors.description && "ring-2 ring-rose-500/20 bg-rose-500/5"
                  )}
                />
              )}
              {errors.description && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.description as any).message}</p>}
            </div>

            {type === 'EXPENSE' && (
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Category</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold text-foreground text-foreground">
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="rounded-lg font-bold">{capitalize(cat.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.categoryId as any).message}</p>}
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">First Payment Date</Label>
              <Input
                type="date"
                {...register('nextExecution')}
                className={cn(
                  "h-14 rounded-2xl bg-muted/40 border-none font-bold px-6 text-foreground",
                  errors.nextExecution && "ring-2 ring-rose-500/20 bg-rose-500/5"
                )}
              />
              {errors.nextExecution && <p className="text-[10px] font-black uppercase text-rose-500 px-1">{(errors.nextExecution as any).message}</p>}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-[11px] font-bold text-primary/70 italic leading-snug">
                {getFrequencyNote()}
              </p>
            </div>

            <Button
              type="submit"
              disabled={readOnly || loading}
              className={cn(
                "w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all mt-4",
                (readOnly || loading) && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              {readOnly ? 'Locked: Diagnostic Session' : (loading ? 'Processing...' : 'Start Automated Task')}
            </Button>
          </form>
        </CustomModal>
      </div>

      {/* Logic Alert Panel */}
      <SlideIn delay={0.3} duration={0.6}>
        <div className="relative overflow-hidden premium-card rounded-3xl p-6 lg:p-8 flex items-start gap-6 bg-gradient-to-br from-primary/5 to-background border-primary/10 group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <RefreshCcw size={120} />
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
            <Info size={24} />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg font-bold tracking-tight text-foreground">How Automation Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ">Balance Guard 🛡️</p>
                <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed">
                  Expenses only trigger if you have enough funds. If balance is low, the task is skipped and marked for your attention.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ">Instant Sync ⚡</p>
                <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed">
                  Tasks set for "Today" process immediately. Others will automatically sync at day time on their scheduled date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlideIn>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wide">Sync Automation Active</span>
          </div>
          <Button
            variant="ghost"
            className="h-10 px-6 rounded-xl font-bold text-muted-foreground/40 hover:text-primary transition-all text-[10px] uppercase tracking-widest"
            onClick={handleForceSync}
            disabled={readOnly}
          >
            {readOnly ? 'Sync Disabled' : 'Force Sync Tasks'}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="premium-card rounded-2xl p-6 lg:p-8 flex items-center justify-between border-border/20">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-xl bg-muted/30 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-muted/30 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to Load Tasks"
            message={error}
            onRetry={fetchData}
            className="py-20"
          />
        ) : patterns.length === 0 ? (
          <div className="premium-card rounded-3xl p-24 text-center border-dashed">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/10">
              <Plus size={32} className="text-primary/15" />
            </div>
            <h4 className="text-xl font-bold tracking-tight mb-2">No tasks found</h4>
            <p className="text-muted-foreground font-medium text-sm max-w-sm mx-auto">Add an automated payment or income to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {patterns.map((pattern, index) => {
              const Icon = pattern.category?.icon ? (LucideIcons as any)[pattern.category.icon] || Info : (pattern.type === 'INCOME' ? ArrowUpRight : ArrowDownLeft);
              const isIncome = pattern.type === 'INCOME';
              const lastSync = pattern.lastStatusDate ? format(new Date(pattern.lastStatusDate), 'MMM dd, yyyy') : 'Never';
              const nextSync = format(new Date(pattern.nextExecution), 'MMM dd, yyyy');

              return (
                <div
                  key={pattern.id}
                  className="premium-card rounded-3xl p-5 sm:p-6 lg:p-8 relative hover:bg-muted/5 transition-all border-border/40 overflow-hidden group/card"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
                    <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
                      <div className={cn(
                        "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover/card:scale-105 duration-500",
                        isIncome ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-rose-500/5 text-rose-600 border-rose-500/10"
                      )}>
                        <Icon size={isIncome ? 22 : 24} className="sm:size-26" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-1.5">
                          <h4 className="font-bold text-lg sm:text-xl tracking-tight text-foreground truncate">{capitalize(pattern.description)}</h4>
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-primary/10 text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-[0.1em] border border-primary/20">
                            {pattern.frequency}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">
                           <span className="truncate">{pattern.category?.name ? capitalize(pattern.category.name) : 'Income Source'}</span>
                           <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                           <span className="text-emerald-500/60 shrink-0">{pattern.hits || 0} Syncs</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 w-full lg:w-auto">
                      <div className="grid grid-cols-2 gap-6 sm:gap-12 flex-1 sm:flex-none w-full sm:w-auto">
                        <div className="space-y-1">
                          <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Last Sync</p>
                          <p className="text-[11px] sm:text-xs font-bold text-muted-foreground/80 flex items-center gap-2 whitespace-nowrap">
                             {pattern.lastStatus === 'SUCCESS' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
                             {lastSync}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] sm:text-[9px] font-black text-primary/40 uppercase tracking-[0.2em]">Next Sync</p>
                          <p className="text-[11px] sm:text-xs font-black text-foreground tabular-nums flex items-center gap-2 italic whitespace-nowrap">
                             <Timer size={12} className="text-primary" />
                             {nextSync}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-10 pt-4 sm:pt-0 border-t sm:border-none border-border/10">
                        <div className="sm:text-right">
                          <p className={cn("text-2xl sm:text-3xl font-black tabular-nums tracking-tighter leading-none mb-1", isIncome ? "text-emerald-600" : "text-rose-600")}>
                            {isIncome ? '+' : '−'}{formatCurrency(pattern.amount)}
                          </p>
                          {pattern.lastStatus === 'INSUFFICIENT_BALANCE' && (
                            <div className="flex items-center sm:justify-end gap-1.5 text-rose-600">
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest italic animate-pulse">Low Balance</span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-2xl transition-all h-10 w-10 sm:h-12 sm:w-12 shrink-0 active:scale-90",
                            readOnly
                              ? "opacity-10 cursor-not-allowed"
                              : "text-muted-foreground/20 hover:text-rose-600 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10"
                          )}
                          onClick={() => !readOnly && setDeleteId(pattern.id)}
                          disabled={readOnly}
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Stop this auto-transaction?"
        description="Are you sure you want to stop this automated transaction? This won't affect your past transactions, but no new ones will be added automatically."
        loading={isDeleting}
      />
    </div>
  );
}
