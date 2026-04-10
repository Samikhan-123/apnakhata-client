'use client';

import React, { useState } from 'react';
import { Trash2, ShoppingCart, DollarSign, Tag, Calendar as CalendarIcon, ArrowUpRight, ArrowDownLeft, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LedgerEntryForm } from './LedgerEntryForm';
import { CustomModal } from '@/components/ui/CustomModal';
import { cn, capitalize } from "@/lib/utils";
import { format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';

export const LedgerEntryList = ({ 
  ledgerEntries, 
  onDelete,
  onRefresh
}: { 
  ledgerEntries: any[], 
  onDelete: (id: string) => Promise<void>,
  onRefresh?: () => void
}) => {
  const { formatCurrency } = useCurrency();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const isCurrentMonth = (date: string) => {
    const today = new Date();
    const entryDate = new Date(date);
    return today.getMonth() === entryDate.getMonth() && today.getFullYear() === entryDate.getFullYear();
  };

  if (!ledgerEntries || ledgerEntries.length === 0) {
    return (
      <div className="premium-card rounded-3xl p-16 text-center border-dashed">
        <div className="mx-auto w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10">
          <Tag className="h-7 w-7 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-tight">No transactions found</h3>
        <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto text-sm">
          Start by adding your first income or expense to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {ledgerEntries.map((entry, index) => {
          const isIncome = entry.type === 'INCOME';
          return (
            <div
              key={entry.id}
              className="premium-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 group transition-all hover:bg-muted/5 border-border/40"
            >
              <div className="flex items-center flex-1 min-w-0">
                {/* Icons Container */}
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                  isIncome
                    ? "bg-emerald-500/5 text-emerald-600 border border-emerald-500/10"
                    : "bg-rose-500/5 text-rose-600 border border-rose-500/10"
                )}>
                  {(() => {
                    const Icon = entry.category?.icon ? (LucideIcons as any)[entry.category.icon] || LucideIcons.HelpCircle : (isIncome ? ArrowUpRight : ArrowDownLeft);
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>

                {/* Main Info */}
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5 sm:mb-1">
                    <h4 className="text-sm sm:text-base font-bold text-foreground truncate tracking-tight">{capitalize(entry.description)}</h4>
                    <Badge variant="secondary" className="text-[9px] sm:text-[10px] h-4 sm:h-5 rounded-md font-bold bg-muted/50 text-muted-foreground border-none px-1.5 sm:px-2">
                      {entry.category?.name ? capitalize(entry.category.name) : (isIncome ? 'Income' : 'General')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-medium text-muted-foreground/60">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {/* Amount (Mobile: inside first row) */}
                <div className="text-right ml-3 sm:hidden">
                  <p className={cn(
                    "text-base font-bold tabular-nums tracking-tight",
                    isIncome ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {isIncome ? '+' : '-'} {formatCurrency(Math.abs(entry.amount))}
                  </p>
                </div>
              </div>

              {/* Amount (Desktop: separate column) */}
              <div className="hidden sm:block text-right ml-4">
                <p className={cn(
                  "text-lg font-bold tabular-nums tracking-tight",
                  isIncome ? "text-emerald-600" : "text-rose-600"
                )}>
                  {isIncome ? '+' : '-'} {formatCurrency(Math.abs(entry.amount))}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">{isIncome ? 'Income' : 'Expense'}</p>
              </div>

              {/* Actions */}
              <div className={cn(
                "flex items-center justify-end gap-2 transition-all duration-500 lg:translate-x-4 lg:group-hover:translate-x-0 sm:ml-8",
                "opacity-100 lg:opacity-0 lg:group-hover:opacity-100" // Always visible on mobile, hover on desktop
              )}>
                {(() => {
                  const editable = isIncome ? isCurrentMonth(entry.date) : true;

                  if (editable) {
                    return (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingEntry(entry)}
                          className="rounded-xl sm:rounded-2xl h-9 w-9 sm:h-11 sm:w-11 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 active:scale-90"
                          title="Edit"
                        >
                          <LucideIcons.Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        {!isIncome && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(entry.id)}
                            className="rounded-xl sm:rounded-2xl h-9 w-9 sm:h-11 sm:w-11 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 active:scale-90"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        )}
                      </>
                    );
                  }

                  return (
                    <div className="h-11 w-11 flex items-center justify-center text-muted-foreground/30" title="Income entries from previous months cannot be modified.">
                      <Lock className="h-4 w-4" />
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          setIsDeleting(true);
          try {
            await onDelete(deleteId);
            toast.success('Transaction deleted');
          } catch (error: any) {
            // Handled by global interceptor
          } finally {
            setIsDeleting(false);
            setDeleteId(null);
          }
        }}
        loading={isDeleting}
        title="Confirm Delete?"
        description="Are you sure you want to remove this record? This action cannot be reversed."
      />

      <CustomModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title="Edit Transaction"
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
};
