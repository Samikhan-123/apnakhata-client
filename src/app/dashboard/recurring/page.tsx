'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { format } from 'date-fns';
import { cn, capitalize } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomModal } from '@/components/ui/CustomModal';
import { FadeIn, SlideIn } from "@/components/ui/FramerMotion";
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';

export default function RecurringPage() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currency, formatCurrency } = useCurrency();

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [frequency, setFrequency] = useState<'TEN_SECONDS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  // Combine Date & Time for ISO state
  const [nextDate, setNextDate] = useState(new Date().toISOString().split('T')[0]);

  const handleForceSync = async () => {
    console.log('[SYNC_DEBUG] Force Sync button clicked!');
    toast.promise(
      (async () => {
        try {
          // console.log('[SYNC_DEBUG] Triggering recurringService.processManual()...');
          const response = await recurringService.processManual();
          // console.log('[SYNC_DEBUG] Service Response:', response);
          
          // The server response doesn't have a 'success' boolean, it has successCount and message
          if (response.successCount === 0 && response.count > 0 && !response.message?.includes('Successfully synced')) {
            throw new Error(response.message || 'Sync failed');
          }

          await fetchData(); // Refresh patterns
          return response.message || `Successfully synced ${response.successCount} tasks.`;
        } catch (err: any) {
          // console.error('[SYNC_DEBUG] Error during sync:', err);
          throw err;
        }
      })(),
      {
        loading: 'Syncing recurring tasks...',
        success: (msg: string) => msg,
        error: null, // Handled by global interceptor
      }
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patternData, catData] = await Promise.all([
        recurringService.getAll(),
        categoryService.getAll()
      ]);
      setPatterns(patternData || []);
      setCategories(catData || []);

      if (catData?.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(catData[0].id);
      }
    } catch (error) {
      // Handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const executionDateTime = new Date(`${nextDate}T12:00:00`); // Default to 12 PM Noon
      
      await recurringService.create({
        description: description.toLowerCase(),
        amount: Number(amount),
        type,
        frequency,
        categoryId: type === 'INCOME' ? undefined : (selectedCategoryId || undefined),
        nextExecution: executionDateTime.toISOString()
      });
      
      toast.success("Automated task added successfully");
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      // Handled by global interceptor
    }
  };

  const resetForm = () => {
     setDescription('');
     setAmount('');
     setType('EXPENSE');
     setFrequency('MONTHLY');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await recurringService.delete(deleteId);
      toast.success("Task removed");
      fetchData();
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
      case 'TEN_SECONDS': return `${val} will be ${action} every 10 seconds (for testing).`;
      case 'DAILY': return `${val} will be ${action} every single day.`;
      case 'WEEKLY': return `${val} will be ${action} every week.`;
      case 'MONTHLY': return `${val} will be ${action} on this day every month.`;
      case 'YEARLY': return `${val} will be ${action} once a year.`;
      default: return '';
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Header & Status Center */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <SlideIn duration={0.5}>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Automated</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg max-w-lg">
            Manage your automated payments and regular income entries in one place.
          </p>
        </SlideIn>

        <SlideIn delay={0.2} duration={0.5}>
          <div className="flex items-center gap-8 premium-card p-4 px-6 rounded-3xl border-border/40">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10">
                <Timer size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-0.5 leading-none">Active Tasks</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">{patterns.length}</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-border/40" />
          
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold active:scale-95 transition-all gap-2"
            >
              <Plus size={18} />
              <span>Add Task</span>
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Type</Label>
                  <Select value={type} onValueChange={(val: any) => { setType(val); setDescription(''); }}>
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="EXPENSE" className="rounded-lg font-bold">Expense</SelectItem>
                      <SelectItem value="INCOME" className="rounded-lg font-bold">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Amount ({currency})</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-14 rounded-2xl bg-muted/40 border-none font-black text-xl px-6"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Frequency</Label>
                    <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="TEN_SECONDS" className="rounded-lg font-bold">Every 10 Seconds (Test)</SelectItem>
                        <SelectItem value="DAILY" className="rounded-lg font-bold">Daily</SelectItem>
                        <SelectItem value="WEEKLY" className="rounded-lg font-bold">Weekly</SelectItem>
                        <SelectItem value="MONTHLY" className="rounded-lg font-bold">Monthly</SelectItem>
                        <SelectItem value="YEARLY" className="rounded-lg font-bold">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Description</Label>
                  {type === 'INCOME' ? (
                    <Select value={description} onValueChange={setDescription}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                         <SelectItem value="salary" className="rounded-lg font-bold">Salary</SelectItem>
                         <SelectItem value="business" className="rounded-lg font-bold">Business</SelectItem>
                         <SelectItem value="freelance" className="rounded-lg font-bold">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="e.g., Monthly Rent"
                      className="h-14 rounded-2xl bg-muted/40 border-none font-bold px-6"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  )}
                </div>

                {type === 'EXPENSE' && (
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Category</Label>
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold">
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="rounded-lg font-bold">{capitalize(cat.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">First Payment Date</Label>
                    <Input
                      type="date"
                      className="h-14 rounded-2xl bg-muted/40 border-none font-bold px-6"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      required
                    />
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                   <p className="text-[11px] font-bold text-primary/70 italic leading-snug">
                      {getFrequencyNote()}
                   </p>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all mt-4">
                   Start Automated Task
                </Button>
              </form>
          </CustomModal>
        </div>

        <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wide">Sync Active</span>
          </div>
          <Button 
            variant="ghost" 
            className="h-10 px-6 rounded-xl font-bold text-muted-foreground/40 hover:text-primary transition-all text-[10px] uppercase tracking-widest" 
            onClick={handleForceSync}
          >
            Force Sync
          </Button>
        </div>

        {loading ? (
          <div className="text-center p-32 text-muted-foreground font-medium text-sm animate-pulse">Loading tasks...</div>
        ) : patterns.length === 0 ? (
          <div className="premium-card rounded-3xl p-24 text-center border-dashed">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/10">
              <Plus size={32} className="text-primary/15" />
            </div>
            <h4 className="text-xl font-bold tracking-tight mb-2">No tasks found</h4>
            <p className="text-muted-foreground font-medium text-sm max-w-sm mx-auto">Add a automated payment or income to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patterns.map((pattern, index) => {
              const Icon = pattern.category?.icon ? (LucideIcons as any)[pattern.category.icon] : (pattern.type === 'INCOME' ? ArrowUpRight : ArrowDownLeft);
              const isIncome = pattern.type === 'INCOME';

              return (
                <div
                  key={pattern.id}
                  className="premium-card rounded-2xl p-6 lg:p-8 relative hover:bg-muted/5 transition-all border-border/40"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm",
                        isIncome ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-rose-500/5 text-rose-600 border-rose-500/10"
                      )}>
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg tracking-tight truncate">{capitalize(pattern.description)}</h4>
                          <span className="px-2 py-0.5 rounded-lg bg-primary/5 text-[9px] font-bold text-primary/60 uppercase tracking-wider border border-primary/10">
                            {pattern.frequency}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-wider truncate">
                          {pattern.category?.name ? capitalize(pattern.category.name) : 'Income Source'}
                        </p>
                      </div>
                    </div>
                    
                     <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                      <div className="text-right">
                        <p className={cn("text-2xl font-bold tabular-nums tracking-tight", isIncome ? "text-emerald-600" : "text-rose-600")}>
                          {isIncome ? '+' : '−'} {formatCurrency(pattern.amount)}
                        </p>
                        {pattern.lastStatus === 'INSUFFICIENT_BALANCE' && (
                          <div className="flex items-center justify-end gap-1.5 mt-2 px-2 py-1 rounded-lg bg-rose-500/5 text-rose-600 border border-rose-500/10">
                            <LucideIcons.AlertCircle size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Low Balance</span>
                          </div>
                        )}
                        {pattern.lastStatus === 'SUCCESS' && pattern.lastStatusDate && (
                          <p className="text-[10px] font-bold text-muted-foreground/20 uppercase mt-1 text-right">
                            Synced {format(new Date(pattern.lastStatusDate), 'MMM dd')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex flex-col items-end gap-1 text-[10px] font-bold text-muted-foreground/40">
                           <div className="flex items-center gap-1.5">
                             <Calendar size={12} />
                             Next: {format(new Date(pattern.nextExecution), 'MMM dd')}
                           </div>
                         </div>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-muted-foreground/20 hover:text-rose-600 hover:bg-rose-500/10 transition-all h-8 w-8 active:scale-90"
                            onClick={() => setDeleteId(pattern.id)}
                          >
                            <Trash2 size={16} />
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
      
      {/* Footer Info Box */}
      <div className="mt-12">
        <div className="premium-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center bg-transparent border-dashed">
          <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10">
            <RefreshCcw size={28} className="text-primary/40" />
          </div>
          <div>
            <h5 className="font-bold text-lg text-foreground tracking-tight mb-1">Automated Records</h5>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-2xl">
              Apna Khata keeps your records effortless. We automatically track your regular payments and income so you can focus on your goals while we handle the data.
            </p>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Stop this task?"
        description="Are you sure you want to stop this automated entry? This won't affect your past records, but no new entries will be added automatically."
        loading={isDeleting}
      />
    </div>
  );
}
