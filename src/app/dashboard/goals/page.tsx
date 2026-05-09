"use client";

import React, { useState, useEffect, useCallback } from "react";
import { goalService, Goal } from "@/services/goal.service";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomModal } from "@/components/ui/CustomModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SlideIn } from "@/components/ui/FramerMotion";
import { ErrorState } from "@/components/ui/ErrorState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Target,
  Plus,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Wallet,
  CalendarDays,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const GOAL_COLORS = [
  { label: "Sapphire", value: "#6366f1" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Violet", value: "#8b5cf6" },
];

const GOAL_ICONS = [
  "Target", "Home", "Car", "Plane", "Smartphone",
  "GraduationCap", "Heart", "ShoppingBag", "Umbrella", "Gift",
];

function ProgressRing({
  progress,
  color,
  size = 88,
}: {
  progress: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={6}
        fill="none"
        className="text-muted/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={6}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
    </svg>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency } = useCurrency();
  const { readOnly } = useAuth();

  // Create goal modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    color: GOAL_COLORS[0].value,
    icon: "Target",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Contribute/Withdraw modal
  const [actionModal, setActionModal] = useState<{
    type: "contribute" | "withdraw";
    goal: Goal;
  } | null>(null);
  const [actionAmount, setActionAmount] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [isActioning, setIsActioning] = useState(false);

  // Delete confirm
  const [deleteGoal, setDeleteGoal] = useState<Goal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGoals = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    if (!createForm.name || !createForm.targetAmount) {
      toast.error("Name and target amount are required.");
      return;
    }
    setIsCreating(true);
    try {
      await goalService.create({
        name: createForm.name,
        targetAmount: Number(createForm.targetAmount),
        targetDate: createForm.targetDate || undefined,
        color: createForm.color,
        icon: createForm.icon,
      });
      setIsCreateOpen(false);
      setCreateForm({ name: "", targetAmount: "", targetDate: "", color: GOAL_COLORS[0].value, icon: "Target" });
      fetchGoals(true);
      toast.success("Goal created! Start saving 🚀");
    } catch {
      // Handled by global interceptor
    } finally {
      setIsCreating(false);
    }
  };

  // ── Contribute / Withdraw ────────────────────────────────────────────────────
  const handleAction = async () => {
    if (!actionModal || !actionAmount) return;
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    setIsActioning(true);
    try {
      if (actionModal.type === "contribute") {
        await goalService.contribute(actionModal.goal.id, Number(actionAmount), actionDescription);
        toast.success("Funds added to goal 💰");
      } else {
        await goalService.withdraw(actionModal.goal.id, Number(actionAmount), actionDescription);
        toast.success("Funds returned to balance ✅");
      }
      setActionModal(null);
      setActionAmount("");
      setActionDescription("");
      fetchGoals(true);
    } catch {
      // Handled by global interceptor
    } finally {
      setIsActioning(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteGoal) return;
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    setIsDeleting(true);
    try {
      await goalService.delete(deleteGoal.id, true);
      fetchGoals(true);
      toast.success("Goal deleted. Funds returned to balance.");
    } catch {
      // Handled by global interceptor
    } finally {
      setIsDeleting(false);
      setDeleteGoal(null);
    }
  };

  const activeGoals = goals.filter((g) => g.status === "IN_PROGRESS");
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");

  return (
    <div className="space-y-12 pb-20 w-full">

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Target size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Savings Goals
              </h1>
              <p className="text-muted-foreground font-medium text-base mt-0.5">
                Set targets, track progress, and celebrate every milestone.
              </p>
            </div>
          </div>
        </SlideIn>

        <SlideIn delay={0.2} duration={0.5}>
          {/* Summary Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="premium-card px-5 py-3 rounded-2xl border-border/40 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {activeGoals.length} Active
              </span>
            </div>
            <div className="premium-card px-5 py-3 rounded-2xl border-border/40 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {completedGoals.length} Completed
              </span>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* ── Add Goal Button ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wide">
            Live Tracking
          </span>
        </div>
        <Button
          onClick={() => !readOnly && setIsCreateOpen(true)}
          disabled={readOnly}
          className={cn(
            "h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold active:scale-95 transition-all gap-2",
            readOnly && "opacity-50 grayscale cursor-not-allowed"
          )}
        >
          <Plus size={18} />
          <span>{readOnly ? "Locked" : "New Goal"}</span>
        </Button>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="premium-card rounded-2xl p-8 space-y-6 border-border/20 min-h-[280px]">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-muted/30 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-28 bg-muted/30 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-muted/20 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-2 w-full bg-muted/20 rounded-full animate-pulse" />
              <div className="flex justify-between">
                <div className="h-8 w-20 bg-muted/20 rounded animate-pulse" />
                <div className="h-8 w-20 bg-muted/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Goals Unavailable" message={error} onRetry={fetchGoals} className="py-20" />
      ) : goals.length === 0 ? (
        <div className="premium-card rounded-3xl p-16 sm:p-24 text-center border-dashed flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 border border-primary/10">
            <Target size={36} className="text-primary/30" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-3">No savings goals yet</h3>
          <p className="text-muted-foreground font-medium text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Create your first goal — whether it's a dream vacation, a new device, or an emergency fund.
          </p>
          <Button
            onClick={() => !readOnly && setIsCreateOpen(true)}
            disabled={readOnly}
            className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold gap-2"
          >
            <Sparkles size={16} />
            Create First Goal
          </Button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                In Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeGoals.map((goal, index) => {
                  const saved = Number(goal.savedAmount);
                  const target = Number(goal.targetAmount);
                  const progress = target > 0 ? (saved / target) * 100 : 0;
                  const remaining = Math.max(0, target - saved);
                  const color = goal.color || "#6366f1";

                  return (
                    <SlideIn key={goal.id} delay={0.1 * (index % 6)} duration={0.5}>
                      <div className="premium-card rounded-2xl p-6 lg:p-8 border-border/40 hover:bg-muted/5 transition-all relative group h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <ProgressRing progress={progress} color={color} size={72} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-black tabular-nums" style={{ color }}>
                                  {Math.round(progress)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground text-lg tracking-tight leading-tight">
                                {goal.name}
                              </h4>
                              {goal.targetDate && (
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider mt-1 flex items-center gap-1">
                                  <CalendarDays size={10} />
                                  {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-lg text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-all",
                              !readOnly && "hover:text-rose-500 hover:bg-rose-500/10"
                            )}
                            onClick={() => !readOnly && setDeleteGoal(goal)}
                            disabled={readOnly}
                            title={readOnly ? "Locked" : "Delete goal"}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        {/* Amount Info */}
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-0.5">Saved</p>
                            <p className="text-2xl font-black tabular-nums text-foreground">{formatCurrency(saved)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-0.5">Target</p>
                            <p className="text-xl font-bold tabular-nums text-muted-foreground/50">{formatCurrency(target)}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, progress)}%`, backgroundColor: color }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-6">
                          {formatCurrency(remaining)} left to go
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 mt-auto">
                          <Button
                            onClick={() => !readOnly && setActionModal({ type: "contribute", goal })}
                            disabled={readOnly}
                            className="flex-1 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs gap-1.5 border border-primary/10 transition-all active:scale-95"
                            variant="ghost"
                          >
                            <ArrowDownCircle size={14} />
                            Add Funds
                          </Button>
                          <Button
                            onClick={() => !readOnly && setActionModal({ type: "withdraw", goal })}
                            disabled={readOnly || saved === 0}
                            className="flex-1 h-10 rounded-xl bg-muted/40 text-muted-foreground hover:bg-muted/60 font-bold text-xs gap-1.5 transition-all active:scale-95 disabled:opacity-30"
                            variant="ghost"
                          >
                            <ArrowUpCircle size={14} />
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    </SlideIn>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                Completed 🎉
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedGoals.map((goal, index) => {
                  const saved = Number(goal.savedAmount);
                  const target = Number(goal.targetAmount);
                  const color = goal.color || "#10b981";

                  return (
                    <SlideIn key={goal.id} delay={0.1 * (index % 6)} duration={0.5}>
                      <div className="premium-card rounded-2xl p-6 lg:p-8 border-emerald-500/20 bg-emerald-500/3 relative group h-full">
                        {/* Completed badge */}
                        <div className="absolute top-0 right-8 py-1 px-4 bg-emerald-500 text-[10px] font-bold text-white uppercase tracking-wider rounded-b-xl">
                          Achieved!
                        </div>

                        <div className="flex items-center gap-4 mb-6 mt-2">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-emerald-500/30 bg-emerald-500/10">
                            <CheckCircle2 size={28} className="text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-lg tracking-tight">{goal.name}</h4>
                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-wider mt-0.5">
                              Goal Reached
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-0.5">Total Saved</p>
                            <p className="text-2xl font-black tabular-nums text-emerald-600">{formatCurrency(saved)}</p>
                          </div>
                          <Wallet size={32} className="text-emerald-500/20" />
                        </div>

                        <div className="h-2 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-emerald-500 rounded-full" />
                        </div>

                        <div className="mt-4 flex gap-3">
                          <Button
                            variant="ghost"
                            onClick={() => !readOnly && setDeleteGoal(goal)}
                            disabled={readOnly}
                            className="flex-1 h-10 rounded-xl text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 font-bold text-xs gap-1.5 transition-all"
                          >
                            <Trash2 size={14} />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </SlideIn>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tip Card ── */}
      {goals.length > 0 && (
        <div className="premium-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center border-dashed">
          <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10">
            <TrendingUp size={28} className="text-primary/40" />
          </div>
          <div>
            <h5 className="font-bold text-lg text-foreground tracking-tight mb-1">Pro Saving Tip</h5>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-2xl">
              Automate your savings! Set up a recurring monthly transfer to each goal. Small, consistent contributions beat one-time large deposits every time.
            </p>
          </div>
        </div>
      )}

      {/* ── Create Goal Modal ── */}
      <CustomModal
        isOpen={isCreateOpen}
        onClose={setIsCreateOpen}
        title="New Savings Goal"
        description="Define your goal, set a target amount, and start saving."
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              Goal Name
            </Label>
            <Input
              placeholder='e.g. "Emergency Fund", "Dubai Trip"'
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              className="h-14 rounded-2xl bg-muted/40 border-none font-bold text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              Target Amount
            </Label>
            <Input
              type="number"
              placeholder="0.00"
              value={createForm.targetAmount}
              onChange={(e) => setCreateForm((f) => ({ ...f, targetAmount: e.target.value }))}
              className="h-14 rounded-2xl bg-muted/40 border-none font-black text-xl px-6"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              Target Date (Optional)
            </Label>
            <Input
              type="date"
              value={createForm.targetDate}
              onChange={(e) => setCreateForm((f) => ({ ...f, targetDate: e.target.value }))}
              className="h-14 rounded-2xl bg-muted/40 border-none font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              Color
            </Label>
            <div className="flex flex-wrap gap-3">
              {GOAL_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCreateForm((f) => ({ ...f, color: c.value }))}
                  className={cn(
                    "w-9 h-9 rounded-xl border-2 transition-all active:scale-90",
                    createForm.color === c.value ? "border-foreground scale-110 shadow-lg" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={isCreating || readOnly}
            className="w-full h-14 bg-primary text-primary-foreground hover:scale-[1.02] rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95"
          >
            {isCreating ? "Creating..." : readOnly ? "Locked: Diagnostic Session" : "Create Goal 🎯"}
          </Button>
        </div>
      </CustomModal>

      {/* ── Contribute / Withdraw Modal ── */}
      <CustomModal
        isOpen={!!actionModal}
        onClose={(v) => { if (!v) { setActionModal(null); setActionAmount(""); setActionDescription(""); } }}
        title={actionModal?.type === "contribute" ? "Add Funds to Goal" : "Withdraw from Goal"}
        description={
          actionModal?.type === "contribute"
            ? `How much do you want to save towards "${actionModal?.goal.name}"?`
            : `Withdrawing returns funds to your available balance.`
        }
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              Amount
            </Label>
            <Input
              type="number"
              placeholder="0.00"
              value={actionAmount}
              onChange={(e) => setActionAmount(e.target.value)}
              className="h-14 rounded-2xl bg-muted/40 border-none font-black text-xl px-6"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
              Note (Optional)
            </Label>
            <Input
              placeholder="e.g. Monthly savings deposit"
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
              className="h-14 rounded-2xl bg-muted/40 border-none font-bold"
            />
          </div>

          {actionModal && (
            <div className="premium-card rounded-2xl px-5 py-4 border-border/30 flex justify-between items-center">
              <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Currently Saved</span>
              <span className="font-black text-foreground tabular-nums">
                {formatCurrency(Number(actionModal.goal.savedAmount))}
              </span>
            </div>
          )}

          <Button
            onClick={handleAction}
            disabled={isActioning || !actionAmount}
            className={cn(
              "w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95",
              actionModal?.type === "contribute"
                ? "bg-primary text-primary-foreground"
                : "bg-rose-500 text-white hover:bg-rose-600"
            )}
          >
            {isActioning
              ? "Processing..."
              : actionModal?.type === "contribute"
              ? "Save Funds 💰"
              : "Withdraw Funds"}
          </Button>
        </div>
      </CustomModal>

      {/* ── Delete Confirm Dialog ── */}
      <ConfirmDialog
        isOpen={!!deleteGoal}
        onClose={() => setDeleteGoal(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete this goal?"
        description={`"${deleteGoal?.name}" will be removed and any saved funds (${formatCurrency(Number(deleteGoal?.savedAmount ?? 0))}) will be returned to your available balance.`}
      />
    </div>
  );
}
