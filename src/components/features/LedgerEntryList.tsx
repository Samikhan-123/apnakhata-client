"use client";

import React, { useState } from "react";
import {
  Trash2,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  MoreVertical,
  Edit3,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LedgerEntryForm } from "./LedgerEntryForm";
import { CustomModal } from "@/components/ui/CustomModal";
import { cn, capitalize } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useCurrency } from "@/context/CurrencyContext";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LedgerEntry } from "@/types";

export const LedgerEntryList = ({
  ledgerEntries,
  onDelete,
  onRefresh,
  currentPage = 1,
  limit = 20,
}: {
  ledgerEntries: LedgerEntry[];
  onDelete: (id: string) => Promise<void>;
  onRefresh?: () => void;
  currentPage?: number;
  limit?: number;
}) => {
  const { formatCurrency } = useCurrency();
  const { readOnly } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);

  const isWithinAuditingWindow = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const targetMonth = date.getMonth();
    const targetYear = date.getFullYear();

    const nowIdx = currentYear * 12 + currentMonth;
    const targetIdx = targetYear * 12 + targetMonth;
    const diff = targetIdx - nowIdx;

    return diff >= -1 && diff <= 1;
  };

  if (!ledgerEntries || ledgerEntries.length === 0) {
    return (
      <div className="premium-card rounded-3xl p-16 text-center border-dashed">
        <div className="mx-auto w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10">
          <CalendarIcon className="h-7 w-7 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-tight">
          Ledger Empty
        </h3>
        <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto text-sm">
          No records found in this sanctuary. Start by logging your first wealth
          movement.
        </p>
      </div>
    );
  }

  const groupEntries = () => {
    const groups: Record<string, LedgerEntry[]> = {};
    ledgerEntries.forEach((entry) => {
      const date = new Date(entry.date);
      let label = "";
      if (isToday(date)) label = "Today";
      else if (isYesterday(date)) label = "Yesterday";
      else label = format(date, "MMMM d, yyyy");

      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    });
    return Object.entries(groups);
  };

  const groupedEntries = groupEntries();

  return (
    <div className="space-y-10">
      {groupedEntries.map(([dateLabel, entries]) => (
        <div key={dateLabel} className="space-y-4">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              {dateLabel}
            </h3>
            <div className="h-[1px] flex-1 bg-border/40" />
          </div>

          <div className="grid gap-4">
            {entries.map((entry) => {
              const isIncome = entry.type === "INCOME";
              const editable = isWithinAuditingWindow(entry.date);

              return (
                <div
                  key={entry.id}
                  className="premium-card rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-6 group transition-all hover:bg-muted/5 border-border/40 relative overflow-hidden"
                >
                  {/* Category Icon - Scales for Mobile */}
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-90",
                      isIncome
                        ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10 shadow-[0_0_15px_-5px_#10b98122]"
                        : "bg-rose-500/5 text-rose-600 border-rose-500/10 shadow-[0_0_15px_-5px_#f43f5e22]",
                    )}
                  >
                    {(() => {
                      const Icon = entry.category?.icon
                        ? (LucideIcons as any)[entry.category.icon] ||
                          LucideIcons.HelpCircle
                        : isIncome
                          ? ArrowUpRight
                          : ArrowDownLeft;
                      return <Icon className="h-4 w-4 sm:h-6 sm:w-6" />;
                    })()}
                  </div>

                  {/* Main Info - Flexible Layout */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0 pr-2">
                      <h4 className="text-sm sm:text-lg font-bold text-foreground tracking-tight break-words line-clamp-3 md:line-clamp-2">
                        {capitalize(entry.description)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-bold text-muted-foreground/50">
                          <Clock className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5" />
                          {isToday(new Date(entry.date))
                            ? format(new Date(entry.date), "hh:mm a")
                            : "Settled"}
                        </div>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-border/60" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary/50 truncate max-w-20 sm:max-w-none">
                          {entry.category?.name ||
                            (isIncome ? "Income" : "General")}
                        </span>
                      </div>
                    </div>

                    {/* Amount - Aligns right on desktop, stays with text on mobile if needed */}
                    <div className="text-left sm:text-right shrink-0">
                      <p
                        className={cn(
                          "text-base sm:text-2xl font-black tabular-nums tracking-tighter leading-none",
                          isIncome ? "text-emerald-600" : "text-rose-600",
                        )}
                      >
                        {isIncome ? "+" : "−"}
                        {formatCurrency(Math.abs(Number(entry.amount)))}
                      </p>
                    </div>
                  </div>

                  {/* Actions Dropdown - Fixed width to prevent jumping */}
                  <div className="shrink-0">
                    {editable ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${entry.description}`}
                            className="h-8 w-8 sm:h-11 sm:w-11 rounded-xl hover:bg-muted transition-all active:scale-95 group/btn border border-transparent hover:border-border/10"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground/40 group-hover/btn:text-foreground transition-colors" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-36 rounded-2xl border-border/20 shadow-2xl bg-card/95 backdrop-blur-xl divide-y divide-border/50"
                        >
                          <DropdownMenuItem
                            className="flex items-center gap-3 p-3 cursor-pointer font-bold text-xs rounded-xl focus:bg-primary/5 focus:text-primary transition-colors"
                            onClick={() => !readOnly && setEditingEntry(entry)}
                            disabled={readOnly}
                          >
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Edit3 className="h-4 w-4" />
                            </div>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-3 p-3 text-rose-600 cursor-pointer font-bold text-xs rounded-xl focus:bg-rose-500/5 focus:text-rose-600 transition-colors"
                            onClick={() => !readOnly && setDeleteId(entry.id)}
                            disabled={readOnly}
                          >
                            <div className="p-2 bg-rose-500/10 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </div>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div
                        className="h-8 w-8 sm:h-11 sm:w-11 flex items-center justify-center opacity-[0.15] cursor-help"
                        title="Secured in sanctuary"
                      >
                        <Lock className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          setIsDeleting(true);
          try {
            await onDelete(deleteId);
            toast.success("Record deleted");
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
