"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/admin.service";
import {
  History,
  Clock,
  Info,
  CheckCircle2,
  Ban,
  Shield,
  UserMinus,
  AlertCircle,
  Search,
  UserX,
  UserCheck,
  Settings,
  ChevronRight,
} from "lucide-react";
import { SlideIn, FadeIn } from "@/components/ui/FramerMotion";
import { Button } from "@/components/ui/button";
import { PaginationPlus } from "@/components/ui/PaginationPlus";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { handleApiError } from "@/lib/error-handler";

export default function AuditLogPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Record<string, any> | null>(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!authLoading && user && user.role !== "ADMIN") {
      router.push("/admin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchLogs(currentPage, { ...filters, search });
    }
  }, [currentPage, filters, user]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) fetchLogs(1, { ...filters, search });
      else setCurrentPage(1);
    }, 1500); // 1.5 second debounce as requested
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLogs = async (page: number = 1, currentFilters: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAuditLogs(
        page,
        20,
        currentFilters,
      );
      if (response.success) {
        setLogs(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      const { message } = handleApiError(err, { silent: true });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getActionMetadata = (action: string) => {
    const defaultMeta = {
      icon: Info,
      color: "slate",
      bgColor: "bg-slate-500/5",
      textColor: "text-slate-600 dark:text-slate-400",
      borderColor: "border-slate-500/10",
    };

    switch (action) {
      case "BAN_USER":
      case "BATCH_BAN_USERS":
      case "USER_REQUESTED_DELETION":
      case "SCHEDULE_DELETION":
        return {
          icon:
            action === "SCHEDULE_DELETION"
              ? Clock
              : action === "USER_REQUESTED_DELETION"
                ? UserX
                : Ban,
          color: "rose",
          bgColor: "bg-rose-500/10",
          textColor: "text-rose-600 dark:text-rose-400",
          borderColor: "border-rose-500/20",
        };
      case "REACTIVATE_USER":
      case "BATCH_REACTIVATE_USERS":
      case "CANCEL_DELETION":
        return {
          icon: action === "CANCEL_DELETION" ? UserCheck : CheckCircle2,
          color: "emerald",
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-600 dark:text-emerald-400",
          borderColor: "border-emerald-500/20",
        };
      case "PROMOTE_ADMIN":
      case "STAFF_LOGIN":
        return {
          icon: Shield,
          color: "indigo",
          bgColor: "bg-indigo-500/10",
          textColor: "text-indigo-600 dark:text-indigo-400",
          borderColor: "border-indigo-500/20",
        };
      case "DEMOTE_USER":
      case "UNVERIFY_USER":
        return {
          icon: action === "DEMOTE_USER" ? UserMinus : AlertCircle,
          color: "amber",
          bgColor: "bg-amber-500/10",
          textColor: "text-amber-600 dark:text-amber-400",
          borderColor: "border-amber-500/20",
        };
      case "VERIFY_USER":
        return {
          icon: CheckCircle2,
          color: "blue",
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-600 dark:text-blue-400",
          borderColor: "border-blue-500/20",
        };
      case "SYSTEM_MAINTENANCE":
        return {
          icon: Settings,
          color: "purple",
          bgColor: "bg-purple-500/10",
          textColor: "text-purple-600 dark:text-purple-400",
          borderColor: "border-purple-500/20",
        };
      default:
        return defaultMeta;
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ");
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const resetFilters = () => {
    setSearch("");
    setFilters({ action: "", startDate: "", endDate: "" });
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-8">
      <header className="flex-none">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg">
              <History className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary">
              System Oversight
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">
            Audit Trail
          </h1>
          <p className="text-muted-foreground font-medium mt-1 text-xs md:text-sm">
            Administrative events across the ecosystem.
          </p>
        </SlideIn>
      </header>

      {/* Adaptive Filters Section */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-none">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search events, admin or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-11 md:h-12 pl-12 pr-4 font-medium text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30"
          />
        </div>
        <div className="flex gap-2">
          {/* Desktop Filters (Visible on md+) */}
          <div className="hidden md:flex gap-2">
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
              className="bg-muted/20 border border-border/40 rounded-xl h-11 md:h-12 px-4 font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="">All Actions</option>
              <option value="BAN_USER">Ban User</option>
              <option value="REACTIVATE_USER">Reactivate</option>
              <option value="SYSTEM_MAINTENANCE">Maintenance</option>
              <option value="STAFF_LOGIN">Staff Login</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="bg-muted/20 border border-border/40 rounded-xl h-11 md:h-12 px-4 font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            />
          </div>

          {/* Mobile Filter Trigger */}
          <Button
            variant="outline"
            className="md:hidden h-11 rounded-xl px-4 border-border/40 font-bold text-xs gap-2"
            onClick={() => resetFilters()}
          >
            Reset
          </Button>
          <Button
            className="h-11 md:h-12 px-6 md:px-8 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest sapphire-glow"
            onClick={() => fetchLogs(1, filters)}
          >
            Apply
          </Button>
        </div>
      </div>



      {/* Mobile Card View (Shown on small screens) */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="premium-card p-5 rounded-2xl animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-muted rounded-md" />
                  <div className="h-3 w-1/3 bg-muted rounded-md" />
                </div>
              </div>
              <div className="h-10 w-full bg-muted rounded-xl" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl border border-dashed border-border/20">
            <History className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold text-sm">
              No anomalies detected.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const meta = getActionMetadata(log.action);
            const Icon = meta.icon;
            return (
              <FadeIn
                key={log.id}
                className="premium-card p-5 rounded-2xl border border-border/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 font-bold text-primary text-xs">
                      {log.admin?.name?.[0].toUpperCase() || "S"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {log.admin?.name || "SYSTEM"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(log.createdAt), "MMM dd, hh:mm a")}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "p-2 rounded-lg border",
                      meta.bgColor,
                      meta.borderColor,
                      meta.textColor,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-xl border border-border/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                    Action Target
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {formatAction(log.action)} →{" "}
                    <span className="text-primary">
                      {log.target?.name || log.target?.email || "System Core"}
                    </span>
                  </p>
                </div>
              </FadeIn>
            );
          })
        )}
      </div>

      {/* Hybrid Scrolling Audit Table Container (Hidden on mobile) */}
      <div className="w-full flex-none hidden md:block">
        <FadeIn className="w-full" duration={0.7}>
          <div className="premium-card rounded-2xl md:rounded-[2rem] overflow-hidden border border-border/10">
            <div className="w-full overflow-x-auto sapphire-scrollbar pb-2">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-muted/90 backdrop-blur-xl border-b border-border/10">
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Administrator
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Action Execution
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Subject Target
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Timestamp (UTC)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td
                          colSpan={4}
                          className="px-6 md:px-8 py-5 md:py-6 h-16 md:h-20 bg-muted/5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-muted rounded-xl shrink-0" />
                            <div className="space-y-2 flex-1">
                              <div className="h-4 w-full max-w-[200px] bg-muted rounded-md" />
                              <div className="h-3 w-full max-w-[150px] bg-muted rounded-md" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <AlertCircle className="h-10 w-10 text-rose-500/30 mx-auto mb-4" />
                        <p className="text-rose-500/80 font-bold mb-4 text-xs md:text-sm">
                          {error}
                        </p>
                        <Button
                          onClick={() => fetchLogs(currentPage, filters)}
                          variant="outline"
                          className="rounded-xl font-bold h-10"
                        >
                          Retry Synchronisation
                        </Button>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <History className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-bold text-xs md:text-sm tracking-tight">
                          No administrative anomalies detected in history.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-primary/[0.02] transition-colors group"
                      >
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/10 font-bold text-primary text-xs sapphire-glow/20">
                              {log.admin ? (
                                log.admin.name ? (
                                  log.admin.name[0].toUpperCase()
                                ) : (
                                  "A"
                                )
                              ) : (
                                <Shield className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-bold text-foreground leading-none mb-1">
                                {log.admin?.name || "SYSTEM"}
                              </p>
                              <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium">
                                {log.admin?.email || "automated@system"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          {(() => {
                            const meta = getActionMetadata(log.action);
                            const Icon = meta.icon;
                            return (
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "p-2 rounded-xl border transition-all duration-300",
                                    meta.bgColor,
                                    meta.borderColor,
                                    meta.textColor,
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span
                                  className={cn(
                                    "text-[10px] md:text-xs font-black uppercase tracking-tighter text-nowrap",
                                    meta.textColor,
                                  )}
                                >
                                  {formatAction(log.action)}
                                </span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          {log.target ? (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-muted/50 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-muted-foreground/50 text-[10px] border border-border/50">
                                {log.target.name
                                  ? log.target.name[0].toUpperCase()
                                  : "U"}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground leading-none mb-1">
                                  {log.target.name || "User"}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-muted-foreground">
                                  {log.target.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="inline-flex py-1 px-3 bg-muted/30 rounded-full border border-border/20">
                              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                                - System -
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-2 text-muted-foreground/60">
                            <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            <p className="text-[10px] md:text-xs font-bold text-nowrap tracking-tight">
                              {format(
                                new Date(log.createdAt),
                                "MMM dd, yyyy • hh:mm:ss a",
                              )}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Anchored Registry Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex-none px-6 md:px-8 py-3 md:py-4 bg-background/60 backdrop-blur-2xl border-t border-border/5">
                <PaginationPlus
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalResults={pagination.total}
                  limit={pagination.limit}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
