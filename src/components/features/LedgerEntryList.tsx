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
import { useAuth } from '@/context/AuthContext';

export const LedgerEntryList = ({ 
  ledgerEntries, 
  onDelete,
  onRefresh,
  currentPage = 1,
  limit = 20
}: { 
  ledgerEntries: any[], 
  onDelete: (id: string) => Promise<void>,
  onRefresh?: () => void,
  currentPage?: number,
  limit?: number
}) => {
  const { formatCurrency } = useCurrency();
  const { readOnly } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const isWithinAuditingWindow = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const targetMonth = date.getMonth();
    const targetYear = date.getFullYear();

    const nowIdx = (currentYear * 12) + currentMonth;
    const targetIdx = (targetYear * 12) + targetMonth;
    const diff = targetIdx - nowIdx;

    return diff >= -1 && diff <= 1;
  };

  if (!ledgerEntries || ledgerEntries.length === 0) {
    return (
      <div className="premium-card rounded-3xl p-16 text-center border-dashed">
        <div className="mx-auto w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10">
          <Tag className="h-7 w-7 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-tight">No Records found</h3>
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
          const displayIndex = ((currentPage - 1) * limit) + index + 1;
          
          return (
            <div
              key={entry.id}
              className="premium-card rounded-2xl p-2.5 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 group transition-all hover:bg-muted/5 border-border/40"
            >
              <div className="flex items-center flex-1 min-w-0">
                {/* Index & Icons Container */}
                <div className="relative group/idx">
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
                  <span className="absolute -top-1.5 -left-1.5 bg-background border border-border/60 text-[8px] font-black tabular-nums py-0.5 px-1.5 rounded-lg shadow-sm text-muted-foreground/40 group-hover/idx:text-primary group-hover/idx:border-primary/30 transition-colors">
                    #{displayIndex}
                  </span>
                </div>

                {/* Main Info */}
                <div className="ml-3 sm:ml-5 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 sm:mb-1">
                    <h4 className="text-xs sm:text-base font-bold text-foreground whitespace-normal break-words tracking-tight">{capitalize(entry.description)}</h4>
                    <span className="hidden sm:inline text-muted-foreground/20">•</span>
                    <Badge variant="secondary" className="w-fit text-[8px] sm:text-[10px] h-3.5 sm:h-5 rounded-md font-bold bg-muted/50 text-muted-foreground border-none px-1.5 sm:px-2">
                      {entry.category?.name ? capitalize(entry.category.name) : (isIncome ? 'Income' : 'General')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] sm:text-[11px] font-medium text-muted-foreground/60 mt-1">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5" />
                      {format(new Date(entry.date), 'MMM dd')}
                    </span>
                  </div>
                </div>
                
                {/* Amount (Mobile: inside first row) */}
                <div className="text-right ml-2 sm:hidden shrink-0">
                  <p className={cn(
                    "text-sm font-black tabular-nums tracking-tight",
                    isIncome ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {isIncome ? '+' : '−'}{formatCurrency(Math.abs(entry.amount))}
                  </p>
                </div>
              </div>

              {/* Amount (Desktop: separate column) */}
              <div className="hidden sm:block text-right ml-auto min-w-[100px]">
                <p className={cn(
                  "text-lg font-black tabular-nums tracking-tight",
                  isIncome ? "text-emerald-600" : "text-rose-600"
                )}>
                  {isIncome ? '+' : '−'}{formatCurrency(Math.abs(entry.amount))}
                </p>
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{isIncome ? 'Income' : 'Expense'}</p>
              </div>

              {/* Actions */}
              <div className={cn(
                "flex items-center justify-end gap-2 transition-all duration-500 lg:translate-x-4 lg:group-hover:translate-x-0 sm:ml-8",
                "opacity-100 lg:opacity-0 lg:group-hover:opacity-100" // Always visible on mobile, hover on desktop
              )}>
                {(() => {
                  const editable = isWithinAuditingWindow(entry.date);

                  if (editable) {
                    return (
                      <>
                        {/* Edit Button Commented Out for Future Use */}
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => !readOnly && setEditingEntry(entry)}
                          className={cn(
                            "rounded-lg sm:rounded-2xl h-8 w-8 sm:h-11 sm:w-11 text-muted-foreground transition-all active:scale-90",
                            readOnly 
                              ? "opacity-20 cursor-not-allowed" 
                              : "hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
                          )}
                          title={readOnly ? "Locked: Diagnostic Session" : "Edit"}
                          disabled={readOnly}
                        >
                          <LucideIcons.Edit3 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                        </Button> */}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => !readOnly && setDeleteId(entry.id)}
                          className={cn(
                            "rounded-lg sm:rounded-2xl h-8 w-8 sm:h-11 sm:w-11 text-muted-foreground transition-all active:scale-90",
                            readOnly 
                              ? "opacity-20 cursor-not-allowed" 
                              : "hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
                          )}
                          title={readOnly ? "Locked: Diagnostic Session" : "Delete"}
                          disabled={readOnly}
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </>
                    );
                  }

                  return (
                    <div className="p-3 opacity-20 cursor-help" title="Historical Record: Locked for Auditing">
                      <Lock className="h-4 w-4 text-muted-foreground" />
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
            toast.success('Record deleted');
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
};
