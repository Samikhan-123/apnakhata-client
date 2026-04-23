'use client';

import React, { useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { 
  Trash2, 
  ChevronRight, 
  Receipt, 
  Tag, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft,
  MoreVertical,
  Plus,
  ArrowRight,
  Sparkles,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/CurrencyContext';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { CustomModal } from '@/components/ui/CustomModal';
import { LedgerEntryForm } from './LedgerEntryForm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LedgerEntryListProps {
  ledgerEntries: any[];
  onDelete: (id: string) => Promise<void>;
  onRefresh?: () => void;
  currentPage?: number;
  limit?: number;
}

export const LedgerEntryList = React.memo(({ 
  ledgerEntries, 
  onDelete,
  onRefresh,
  currentPage = 1,
  limit = 20
}: LedgerEntryListProps) => {
  const { formatCurrency } = useCurrency();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  if (ledgerEntries.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-border/10 rounded-[3rem] bg-muted/5">
        <div className="bg-muted/10 h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-border/5">
           <Receipt className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-tight">Ledger Empty</h3>
        <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto text-sm">
          No records found in this ledger. Start by logging your first wealth movement.
        </p>
      </div>
    );
  }

  const groupedEntries = React.useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    ledgerEntries.forEach(entry => {
      const date = new Date(entry.date);
      let label = '';
      if (isToday(date)) label = 'Today';
      else if (isYesterday(date)) label = 'Yesterday';
      else label = format(date, 'MMMM d, yyyy');
      
      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    });
    return Object.entries(groups);
  }, [ledgerEntries]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await onDelete(deletingId);
      toast.success('Record purged successfully');
    } catch (error) {
      toast.error('Failed to purge record');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {groupedEntries.map(([dateLabel, entries], groupIdx) => (
        <div key={dateLabel} className="space-y-4">
          <div className="flex items-center gap-4 px-2">
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border",
              dateLabel === 'Today' ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : 
              "bg-muted/10 text-muted-foreground/60 border-border/5"
            )}>
              {dateLabel}
            </h3>
            <div className="h-px flex-1 bg-border/5" />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {entries.map((entry, idx) => (
              <SlideIn key={entry.id} delay={(idx * 0.05)} duration={0.4}>
                <div className="premium-card group hover:border-primary/20 rounded-2xl md:rounded-[2rem] p-4 md:p-6 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
                      <div className={cn(
                        "h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 duration-500",
                        entry.type === 'INCOME' ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : 
                        "bg-rose-500/5 text-rose-600 border-rose-500/10"
                      )}>
                        {entry.type === 'INCOME' ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                            entry.type === 'INCOME' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                            "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          )}>
                            {entry.type}
                          </span>
                          {dateLabel === 'Today' ? (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                               <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                               <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Live Pulse</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/40 border border-border/10 rounded-full">
                               <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Settled Record</span>
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">{entry.description}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase">
                              <Tag className="h-3 w-3" />
                              {entry.category?.name || 'Uncategorized'}
                           </div>
                           <div className="h-1 w-1 rounded-full bg-border" />
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 uppercase">
                              <LucideIcons.Clock className="h-3 w-3" />
                              {format(new Date(entry.createdAt), 'hh:mm a')}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={cn(
                        "text-lg md:text-xl font-black tracking-tighter tabular-nums",
                        entry.type === 'INCOME' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {entry.type === 'INCOME' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditingEntry(entry)}
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setDeletingId(entry.id)}
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-600 transition-all duration-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Purge Transaction?"
        description="Are you sure you want to remove this record? This action cannot be reversed."
      />

      <CustomModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title="Edit Record"
        description="Update the details of your record below."
      >
        <LedgerEntryForm
          initialData={editingEntry}
          onRefresh={() => {
            setEditingEntry(null);
            if (onRefresh) onRefresh();
          }}
        />
      </CustomModal>
    </div>
  );
});

LedgerEntryList.displayName = 'LedgerEntryList';
