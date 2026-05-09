"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, BudgetInput } from "@/lib/validations";
import { budgetService } from "@/services/budget.service";
import { categoryService } from "@/services/category.service";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar as CalendarIcon,
  TrendingUp,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn, capitalize } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { CustomModal } from "@/components/ui/CustomModal";
import { SlideIn } from "@/components/ui/FramerMotion";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAuth } from "@/context/AuthContext";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);
  const { currency, formatCurrency } = useCurrency();
  const { user, readOnly } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: "",
      limit: 0,
    },
  });

  const fetchData = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [budgetData, catData] = await Promise.all([
        budgetService.getAll(selectedMonth, selectedYear),
        categoryService.getAll(),
      ]);
      setBudgets(budgetData || []);
      setCategories(catData || []);

      // Auto-select first category that doesn't have a budget yet
      if (catData && catData.length > 0) {
        const existingCatIds = new Set((budgetData || []).map((b: any) => b.categoryId));
        const availableCat = catData.find((c: any) => !existingCatIds.has(c.id));
        if (availableCat) {
          setValue("categoryId", availableCat.id);
        } else {
          setValue("categoryId", catData[0].id);
        }
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to connect to the server",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const onSubmit = async (data: BudgetInput) => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    setIsSubmitting(true);
    try {
      await budgetService.setBudget({
        ...data,
        limit: Number(data.limit),
        month: selectedMonth,
        year: selectedYear,
      });
      reset({ categoryId: data.categoryId, limit: 0 });
      setIsModalOpen(false);
      fetchData(true);
      toast.success("Budget saved");
    } catch (error) {
      // Handled by global interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    setIsDeleting(true);
    try {
      await budgetService.delete(id);
      fetchData(true);
      toast.success("Budget removed");
    } catch (error) {
      // Handled by global interceptor
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-12 pb-20 w-full">
      {/* Header & Control Center */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <SlideIn duration={0.5}>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Budgets
          </h1>
          <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg">
            Track your spending limits and stay within your financial goals.
          </p>
        </SlideIn>

        <SlideIn delay={0.2} duration={0.5}>
          <div className="flex items-center gap-4 premium-card p-2 rounded-2xl border-border/40">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all"
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear((p) => p - 1);
                } else {
                  setSelectedMonth((prev) => prev - 1);
                }
              }}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="flex flex-col items-center min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 leading-none mb-1">
                {selectedYear}
              </span>
              <span className="text-base font-bold text-foreground">
                {months[selectedMonth - 1]}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all"
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear((p) => p + 1);
                } else {
                  setSelectedMonth((prev) => prev + 1);
                }
              }}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </SlideIn>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-2 ">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wide">
            Live Tracking
          </span>
        </div>

        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none premium-card px-6 py-3 rounded-2xl border-border/40 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                Total Budgeted
              </p>
              <p className="text-lg font-black tabular-nums text-foreground">
                {formatCurrency(
                  budgets.reduce((sum, b) => sum + Number(b.limit), 0),
                )}
              </p>
            </div>
          </div>

          <Button
            onClick={() => !readOnly && setIsModalOpen(true)}
            disabled={readOnly}
            className={cn(
              "flex-1 sm:flex-none h-12 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all gap-2",
              readOnly && "opacity-50 grayscale cursor-not-allowed",
            )}
          >
            <Plus size={18} />
            <span>{readOnly ? "Locked" : "New Budget"}</span>
          </Button>
        </div>
      </div>

        <CustomModal
          isOpen={isModalOpen}
          onClose={setIsModalOpen}
          title="Plan Spending"
          description={`Choose a category and set your spending goal for ${months[selectedMonth - 1]}.`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                Category
              </Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-none font-bold">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      {categories
                        .filter((cat) => {
                          const hasBudget = budgets.some(
                            (b) => b.categoryId === cat.id,
                          );
                          return !hasBudget;
                        })
                        .map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id}
                            className="rounded-lg font-bold"
                          >
                            {capitalize(cat.name)}
                          </SelectItem>
                        ))}
                      {categories.filter((cat) =>
                        budgets.some((b) => b.categoryId === cat.id),
                      ).length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 border-t border-border/10 mt-1">
                            Already Budgeted
                          </div>
                          {categories
                            .filter((cat) =>
                              budgets.some((b) => b.categoryId === cat.id),
                            )
                            .map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id}
                                className="rounded-lg font-bold opacity-40"
                              >
                                {capitalize(cat.name)} (Overwrite)
                              </SelectItem>
                            ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-[10px] font-black uppercase text-rose-500 px-1">
                  {(errors.categoryId as any).message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                Budget Limit ({currency})
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("limit")}
                className={cn(
                  "h-14 rounded-2xl bg-muted/40 border-none font-black text-xl px-6",
                  errors.limit && "ring-2 ring-rose-500/20 bg-rose-500/5",
                )}
              />
              {errors.limit && (
                <p className="text-[10px] font-black uppercase text-rose-500 px-1">
                  {(errors.limit as any).message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={readOnly || isSubmitting}
              className={cn(
                "w-full h-18 bg-primary text-primary-foreground hover:scale-[1.02] rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95",
                (readOnly || isSubmitting) &&
                  "opacity-50 grayscale cursor-not-allowed",
              )}
            >
              {readOnly
                ? "Locked: Diagnostic Session"
                : isSubmitting
                  ? "Saving..."
                  : "Save Goal"}
            </Button>
          </form>
        </CustomModal>

      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="premium-card rounded-2xl p-8 space-y-8 border-border/20 min-h-[220px]"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/30 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-muted/30 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-6 w-20 bg-muted/30 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-muted/20 rounded animate-pulse" />
                  </div>
                  <div className="h-2 w-full bg-muted/20 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Budgets Unavailable"
            message={error}
            onRetry={fetchData}
            className="py-20"
          />
        ) : budgets.length === 0 ? (
          <div className="premium-card rounded-3xl p-10 text-center border-dashed">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/10">
              <CalendarIcon size={32} className="text-primary/20" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">
              No budgets this month
            </h3>
            <p className="text-muted-foreground font-medium text-sm max-w-sm mx-auto">
              Set your first spending goal to stay on top of your category
              limits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {budgets.map((budget, index) => {
              const Icon =
                (LucideIcons as any)[budget.category.icon] ||
                LucideIcons.HelpCircle;
              const statusColor = budget.isOverBudget
                ? "rose"
                : budget.progress > 80
                  ? "amber"
                  : "emerald";

              return (
                <SlideIn
                  key={budget.id}
                  delay={0.1 * (index % 6)}
                  duration={0.5}
                >
                  <div className="premium-card rounded-2xl p-6 lg:p-8 relative h-full transition-all hover:bg-muted/5 border-border/40">
                    {budget.isOverBudget && (
                      <div className="absolute top-0 right-8 py-1 px-4 bg-rose-500 text-[10px] font-bold text-white uppercase tracking-wider rounded-b-xl z-10">
                        Limit Reached
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center border",
                            statusColor === "rose"
                              ? "bg-rose-500/5 text-rose-600 border-rose-500/10"
                              : statusColor === "amber"
                                ? "bg-amber-500/5 text-amber-600 border-amber-500/10"
                                : "bg-emerald-500/5 text-emerald-600 border-emerald-500/10",
                          )}
                        >
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-lg tracking-tight">
                            {capitalize(budget.category.name)}
                          </h4>
                          <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mt-0.5">
                            Category Goal
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-9 w-9 text-muted-foreground/30 rounded-lg transition-all",
                          readOnly
                            ? "opacity-20 cursor-not-allowed"
                            : "hover:text-rose-600 hover:bg-rose-50",
                        )}
                        onClick={() => !readOnly && setDeleteId(budget.id)}
                        disabled={readOnly}
                        title={
                          readOnly ? "Locked: Diagnostic Session" : "Delete"
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-0.5">
                          Spent
                        </p>
                        <p className="text-xl font-bold tabular-nums text-foreground">
                          {formatCurrency(budget.spent)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-0.5">
                          Limit
                        </p>
                        <p className="text-xl font-bold tabular-nums text-muted-foreground/40">
                          {formatCurrency(budget.limit)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            budget.isOverBudget
                              ? "bg-rose-500"
                              : budget.progress > 80
                                ? "bg-amber-500"
                                : "bg-primary",
                          )}
                          style={{
                            width: `${Math.min(100, budget.progress)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span
                          className={cn(
                            budget.isOverBudget
                              ? "text-rose-600"
                              : "text-muted-foreground/60",
                          )}
                        >
                          {Math.round(budget.progress)}% Used
                        </span>
                        <span className="text-muted-foreground/40">
                          {formatCurrency(
                            Math.max(0, budget.limit - budget.spent),
                          )}{" "}
                          Left
                        </span>
                      </div>
                    </div>
                  </div>
                </SlideIn>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDeleteBudget(deleteId)}
        loading={isDeleting}
        title="Remove this goal?"
        description="Are you sure you want to stop tracking this goal? This will remove your spending limit for this category this month."
      />

      {/* Footer Info Box */}
      <div className="mt-12">
        <div className="premium-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center bg-transparent border-dashed">
          <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10">
            <TrendingUp size={28} className="text-primary/40" />
          </div>
          <div>
            <h5 className="font-bold text-lg text-foreground tracking-tight mb-1">
              Financial Planning
            </h5>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-2xl">
              Setting budgets helps you stay in control of your spending. Pro
              tip: For better stability, try keeping essential expenses below
              50% of your take-home pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
