"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/admin.service";
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Ban,
  Activity,
  ChevronRight,
  Eye,
  X,
  Check,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SlideIn, FadeIn } from "@/components/ui/FramerMotion";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { handleApiError } from "@/lib/error-handler";
import { cn, capitalize } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PaginationPlus } from "@/components/ui/PaginationPlus";

export default function UserManagementPage() {
  const router = useRouter();
  const { user: currentUser, impersonate } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const isModerator = currentUser?.role === "MODERATOR";

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, any> | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<Record<string, any> | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    isVerified: "",
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    loading: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    loading: false,
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, filters]); // Re-fetch on page or filter change

  const fetchUsers = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUsers(page, 20, {
        ...filters,
        search,
      });
      if (response.success) {
        setUsers(response.data);
        setPaginationData(response.pagination);
        setSelectedUsers(new Set()); // Reset on page change
      }
    } catch (err: any) {
      const { message, status } = handleApiError(err, { silent: true });
      setError({ message, status });
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) fetchUsers(1);
      else setCurrentPage(1);
    }, 1000); // 1-second debounce (Server efficiency)
    return () => clearTimeout(timer);
  }, [search]);

  // Reset all active search and filter parameters
  const resetFilters = () => {
    setSearch("");
    setFilters({
      role: "",
      isActive: "",
      isVerified: "",
    });
    setCurrentPage(1);
  };

  const isOnline = (dateStr: string) => {
    if (!dateStr) return false;
    const lastActive = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return now - lastActive < 20 * 60 * 1000; // 20 minutes (Matches 15-min backend throttle + buffer)
  };

  const handleToggleStatus = (user: any) => {
    setConfirmConfig({
      isOpen: true,
      title: user.isActive ? "Deactivate Account?" : "Activate Account?",
      description: `Are you sure you want to ${user.isActive ? "ban" : "activate"} ${user.email}? ${user.isActive ? "This user will lose access to the platform immediately." : "Access will be restored."}`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          const response = await adminService.updateUser(user.id, {
            isActive: !user.isActive,
          });
          if (response.success) {
            toast.success(
              `User account ${!user.isActive ? "activated" : "deactivated"} successfully`,
            );
            fetchUsers(currentPage);
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to update account status",
          );
        } finally {
          setConfirmConfig((prev) => ({
            ...prev,
            isOpen: false,
            loading: false,
          }));
        }
      },
    });
  };

  const handleToggleVerification = (user: any) => {
    if (user.googleId) {
      toast.error(
        "Google-authenticated users are managed by Google and cannot be unverified manually.",
      );
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: user.isVerified ? "Remove Verification?" : "Verify User?",
      description: `Are you sure you want to ${user.isVerified ? "unverify" : "verify"} ${user.email}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          const response = await adminService.updateUser(user.id, {
            isVerified: !user.isVerified,
          });
          if (response.success) {
            toast.success(
              `User ${!user.isVerified ? "verified" : "unverified"} successfully`,
            );
            fetchUsers(currentPage);
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message ||
              "Failed to update verification status",
          );
        } finally {
          setConfirmConfig((prev) => ({
            ...prev,
            isOpen: false,
            loading: false,
          }));
        }
      },
    });
  };

  const handleImpersonate = (user: any) => {
    setConfirmConfig({
      isOpen: true,
      title: "Start Diagnostic Session?",
      description: `You are about to enter the dashboard as ${user.name || user.email}. This session will be Read-Only and your actions will be logged for security.`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          await impersonate(user.id);
        } catch (error) {
          // Toast handled by AuthContext/Interceptor
        } finally {
          setConfirmConfig((prev) => ({
            ...prev,
            isOpen: false,
            loading: false,
          }));
        }
      },
    });
  };

  // Multiple Selection Logic
  const toggleSelectUser = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    }
  };

  const handleBatchAction = (action: string, data: any) => {
    setConfirmConfig({
      isOpen: true,
      title: `Batch Action: ${action}`,
      description: `Are you sure you want to apply this action to ${selectedUsers.size} selected users?`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          const response = await adminService.batchUpdateUsers(
            Array.from(selectedUsers),
            data,
          );
          if (response.success) {
            toast.success(response.message || "Batch update successful");
            fetchUsers(currentPage);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Batch update failed");
        } finally {
          setConfirmConfig((prev) => ({
            ...prev,
            isOpen: false,
            loading: false,
          }));
        }
      },
    });
  };

  // Filtering is now handled on the backend
  const filteredUsers = users;

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-8 relative">
      <header className="flex-none">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="bg-emerald-500/10 p-1.5 md:p-2 rounded-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-600">
              Command & Control
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">
                User Registry
              </h1>
              <p className="text-muted-foreground font-medium mt-1 text-xs md:text-sm">
                Manage platform identities and security clearances.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(currentPage)}
                disabled={loading}
                className="rounded-xl h-10 px-4 border-border/40 hover:bg-muted font-bold text-[10px] uppercase tracking-widest gap-2 transition-all active:scale-95"
              >
                <div className={cn("h-3.5 w-3.5", loading && "animate-spin")}>
                  <Activity className="h-full w-full" />
                </div>
                <span>Sync Registry</span>
              </Button>
            </div>
          </div>
        </SlideIn>
      </header>

      {/* Responsive Filter & Search Section */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-none">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-11 md:h-12 pl-12 pr-12 font-medium text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/5 h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground/60 transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant={
                  Object.values(filters).some((v) => v !== "")
                    ? "default"
                    : "outline"
                }
                className={cn(
                  "h-11 md:h-12 px-6 md:px-8 rounded-xl md:rounded-2xl font-bold gap-2 text-xs md:text-sm transition-all",
                  Object.values(filters).some((v) => v !== "")
                    ? "sapphire-glow"
                    : "border-border/40 hover:bg-muted",
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).some((v) => v !== "") && (
                  <Badge className="ml-2 bg-primary-foreground text-primary h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {Object.values(filters).filter((v) => v !== "").length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6 rounded-[2rem] premium-card border-border/20 shadow-2xl sapphire-glow">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-foreground">
                    Advanced Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      setFilters({ role: "", isActive: "", isVerified: "" });
                      setShowFilters(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/70 ml-1">
                      Account Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["ADMIN", "MODERATOR", "USER"].map((r) => (
                        <Button
                          key={r}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-9 rounded-xl text-[10px] font-bold border border-transparent",
                            filters.role === r
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                          )}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              role: filters.role === r ? "" : r,
                            }))
                          }
                        >
                          {r}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/70 ml-1">
                      Member Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-9 rounded-xl text-[10px] font-bold border border-transparent",
                          filters.isActive === "true"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                        )}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            isActive: filters.isActive === "true" ? "" : "true",
                          }))
                        }
                      >
                        ACTIVE ONLY
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-9 rounded-xl text-[10px] font-bold border border-transparent",
                          filters.isActive === "false"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                        )}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            isActive:
                              filters.isActive === "false" ? "" : "false",
                          }))
                        }
                      >
                        BANNED ONLY
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/70 ml-1">
                      Identity Clearance
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-9 rounded-xl text-[10px] font-bold border border-transparent",
                          filters.isVerified === "true"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                        )}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            isVerified:
                              filters.isVerified === "true" ? "" : "true",
                          }))
                        }
                      >
                        VERIFIED
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-9 rounded-xl text-[10px] font-bold border border-transparent",
                          filters.isVerified === "false"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                        )}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            isVerified:
                              filters.isVerified === "false" ? "" : "false",
                          }))
                        }
                      >
                        PENDING
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/10">
                  <Button
                    variant="ghost"
                    className="w-full h-10 rounded-xl text-[10px] font-black text-muted-foreground hover:text-rose-500"
                    onClick={() => {
                      setFilters({ role: "", isActive: "", isVerified: "" });
                      setShowFilters(false);
                    }}
                  >
                    RESET ALL CLEARANCES
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {Object.values(filters).some((v) => v !== "") && (
            <Button
              variant="outline"
              size="icon"
              className="h-11 md:h-12 w-11 md:w-12 rounded-xl md:rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/5 transition-all"
              onClick={() =>
                setFilters({ role: "", isActive: "", isVerified: "" })
              }
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Card View (shown only on small screens) */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="premium-card p-6 rounded-3xl animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded-md" />
                  <div className="h-3 w-48 bg-muted rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/5">
                <div className="h-8 bg-muted rounded-xl" />
                <div className="h-8 bg-muted rounded-xl" />
              </div>
            </div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-3xl border border-dashed border-border/20">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold">
              No strategic identities found.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <FadeIn
              key={user.id}
              className="premium-card p-6 rounded-3xl border border-border/10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 font-black text-primary text-lg">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    {isOnline(user.lastActive) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground leading-none">
                        {user.name ? capitalize(user.name) : "Anonymous"}
                      </p>
                      {isOnline(user.lastActive) && (
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-1 rounded-sm">
                          LIVE
                        </span>
                      )}
                      {!isOnline(user.lastActive) && (
                        <span className="text-[8px] font-black text-red-600 uppercase tracking-widest bg-red-500/10 px-1 rounded-sm">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1.5">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center",
                    selectedUsers.has(user.id)
                      ? "bg-primary border-primary sapphire-glow"
                      : "bg-muted/50 border-border/40",
                  )}
                  onClick={() => toggleSelectUser(user.id)}
                >
                  {selectedUsers.has(user.id) && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "flex flex-col gap-1 p-3 rounded-2xl border",
                    user.role === "ADMIN"
                      ? "bg-primary/5 border-primary/10"
                      : "bg-muted/30 border-transparent",
                  )}
                >
                  <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/60">
                    Access Clearanc
                  </span>
                  <div className="flex items-center gap-2">
                    <Shield
                      className={cn(
                        "h-3 w-3",
                        user.role === "ADMIN"
                          ? "text-primary"
                          : "text-muted-foreground/60",
                      )}
                    />
                    <span className="text-[10px] font-black text-foreground">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex flex-col gap-1 p-3 rounded-2xl border",
                    user.isActive
                      ? "bg-emerald-500/5 border-emerald-500/10"
                      : "bg-rose-500/5 border-rose-500/10",
                  )}
                >
                  <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/60">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Ban className="h-3 w-3 text-rose-600" />
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-black",
                        user.isActive ? "text-emerald-700" : "text-rose-700",
                      )}
                    >
                      {user.isActive ? "ACTIVE" : "BANNED"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/5">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-black text-foreground selection:bg-primary/30 uppercase tracking-tighter">
                    {user.lastIp || "No IP"}
                  </p>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                    {user.lastLocation || "Global Deployment"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-muted/30 hover:bg-primary/10 text-primary"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))
        )}
        {paginationData && paginationData.totalPages > 1 && (
          <div className="pt-4">
            <PaginationPlus
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              totalResults={paginationData.total}
              limit={paginationData.limit}
              onPageChange={setCurrentPage}
              compact
            />
          </div>
        )}
      </div>

      {/* Hybrid Table (Hidden on mobile) */}
      <div className="w-full flex-none hidden md:block">
        <FadeIn className="w-full" duration={0.7}>
          <div className="premium-card rounded-2xl md:rounded-[2rem] overflow-hidden border border-border/10">
            <div className="w-full overflow-x-auto sapphire-scrollbar pb-2">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-muted/90 backdrop-blur-xl border-b border-border/10">
                    <th className="px-4 py-4 md:py-5 w-12 text-center">
                      <div
                        className={cn(
                          "w-5 h-5 mx-auto rounded-md border-2 transition-all cursor-pointer flex items-center justify-center",
                          users.length > 0 &&
                            selectedUsers.size === users.length
                            ? "bg-primary border-primary sapphire-glow"
                            : "bg-transparent border-border/40 hover:border-primary/40",
                        )}
                        onClick={toggleSelectAll}
                      >
                        {users.length > 0 &&
                          selectedUsers.size === users.length && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                      </div>
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Platform Member
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Status
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Auth Role
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Connectivity
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Metric Activity
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td
                          colSpan={6}
                          className="px-6 md:px-8 py-5 md:py-6 h-16 md:h-20 bg-muted/5"
                        ></td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center">
                        <ErrorState
                          title="Registry Unavailable"
                          message={
                            error.message ||
                            "Failed to synchronize platform identities."
                          }
                          onRetry={() => fetchUsers(currentPage)}
                          type={error.status === 0 ? "connection" : "server"}
                          className="glass-card p-12"
                        />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-24 text-center">
                        <FadeIn>
                          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                            <div className="relative mb-6">
                              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 sapphire-glow/20">
                                {search ||
                                filters.role ||
                                filters.isActive ||
                                filters.isVerified ? (
                                  <Search className="h-10 w-10 text-primary animate-pulse" />
                                ) : (
                                  <Users className="h-10 w-10 text-primary opacity-40" />
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-background p-1.5 rounded-full border border-border">
                                <X className="h-3 w-3 text-rose-500" />
                              </div>
                            </div>

                            <h3 className="text-xl font-black text-foreground tracking-tight mb-2">
                              {search ||
                              filters.role ||
                              filters.isActive ||
                              filters.isVerified
                                ? "No Identities Found"
                                : "Platform is Silent"}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium mb-8">
                              {search ||
                              filters.role ||
                              filters.isActive ||
                              filters.isVerified
                                ? "We couldn't find any users matching your current criteria. Try adjusting your search or filters."
                                : "No users have registered on the platform yet. New arrivals will appear here."}
                            </p>

                            {(search ||
                              filters.role ||
                              filters.isActive ||
                              filters.isVerified) && (
                              <Button
                                onClick={resetFilters}
                                variant="outline"
                                className="rounded-2xl px-8 font-black text-xs h-12 hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 border-primary/20"
                              >
                                CLEAR ALL FILTERS
                              </Button>
                            )}
                          </div>
                        </FadeIn>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={cn(
                          "hover:bg-primary/[0.02] transition-all group border-l-2",
                          selectedUsers.has(user.id)
                            ? "bg-primary/[0.04] border-primary sapphire-glow/10"
                            : "border-transparent",
                        )}
                      >
                        <td className="px-4 py-5 md:py-6 text-center">
                          <div
                            className={cn(
                              "w-5 h-5 mx-auto rounded-md border-2 transition-all cursor-pointer flex items-center justify-center",
                              selectedUsers.has(user.id)
                                ? "bg-primary border-primary sapphire-glow"
                                : "bg-transparent border-border/40 group-hover:border-primary/40",
                            )}
                            onClick={() => toggleSelectUser(user.id)}
                          >
                            {selectedUsers.has(user.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/10 font-black text-primary sapphire-glow/20 overflow-hidden">
                                {user.name ? user.name[0].toUpperCase() : "U"}
                              </div>
                              {isOnline(user.lastActive) && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs md:text-sm font-bold text-foreground leading-none">
                                  {user.name
                                    ? capitalize(user.name)
                                    : "Anonymous"}
                                </p>
                                {user.id === currentUser?.id && (
                                  <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-tighter border border-primary/20">
                                    Self
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-[10px] text-muted-foreground font-medium">
                                  {user.email}
                                </p>
                                {isOnline(user.lastActive) && (
                                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-1 rounded-sm">
                                    LIVE
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex flex-col gap-1.5">
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter border w-fit",
                                user.isVerified
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20",
                              )}
                            >
                              {user.isVerified ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {user.isVerified ? "Verified" : "Pending"}
                            </div>
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px) font-black uppercase tracking-tighter border w-fit",
                                user.isActive
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : "bg-rose-500/10 text-rose-600 border-rose-500/20",
                              )}
                            >
                              {user.isActive ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <Ban className="h-3 w-3" />
                              )}
                              {user.isActive ? "Active" : "Banned"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter border",
                              user.role === "ADMIN" &&
                                "bg-primary/10 text-primary border-primary/20",
                              user.role === "MODERATOR" &&
                                "bg-blue-500/10 text-blue-600 border-blue-500/20",
                              user.role === "USER" &&
                                "bg-muted text-muted-foreground border-border/40",
                            )}
                          >
                            <Shield className="h-3 w-3" />
                            {user.role}
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[11px] font-black text-foreground selection:bg-primary/30 uppercase tracking-tighter">
                              {user.lastIp || "No IP"}
                            </p>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                                {user.lastLocation || "Global"}
                              </span>
                              {user.lastDevice && (
                                <Tooltip content={user.lastDevice}>
                                  <Activity className="h-2.5 w-2.5 text-primary/40 cursor-help" />
                                </Tooltip>
                              )}
                            </div>
                            {user.lastLogin && (
                              <p className="text-[8px] text-primary/60 font-black uppercase tracking-tighter mt-1 flex items-center gap-1">
                                <Clock className="h-2 w-2" />
                                Session:{" "}
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-xs md:text-sm font-black text-foreground">
                              {user._count?.ledgerEntries || 0}{" "}
                              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                Entries
                              </span>
                            </p>
                            <p className="text-[9px] text-muted-foreground/60 font-black uppercase tracking-tighter">
                              Joined{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center justify-end gap-1 md:gap-2">
                            <Tooltip
                              content={
                                user.isVerified
                                  ? "Revoke Verification"
                                  : "Grant Verification"
                              }
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all text-muted-foreground/40",
                                  (user.googleId ||
                                    user.id === currentUser?.id ||
                                    user.role === "ADMIN") &&
                                    "opacity-20 grayscale cursor-not-allowed",
                                )}
                                onClick={() =>
                                  !(
                                    user.googleId ||
                                    user.id === currentUser?.id ||
                                    user.role === "ADMIN"
                                  ) && handleToggleVerification(user)
                                }
                                disabled={
                                  !!user.googleId ||
                                  user.id === currentUser?.id ||
                                  user.role === "ADMIN"
                                }
                              >
                                {user.isVerified ? (
                                  <UserX className="h-4 w-4 text-amber-600" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-emerald-600" />
                                )}
                              </Button>
                            </Tooltip>

                            <Tooltip
                              content={
                                user.isActive
                                  ? "Ban Account"
                                  : "Reactivate Account"
                              }
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all text-muted-foreground/40",
                                  (user.id === currentUser?.id ||
                                    user.role === "ADMIN" ||
                                    (isModerator &&
                                      user.role === "MODERATOR")) &&
                                    "opacity-20 grayscale cursor-not-allowed",
                                )}
                                disabled={
                                  user.id === currentUser?.id ||
                                  user.role === "ADMIN" ||
                                  (isModerator && user.role === "MODERATOR")
                                }
                                onClick={() => handleToggleStatus(user)}
                              >
                                {user.isActive ? (
                                  <Ban className="h-4 w-4 text-rose-600" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                )}
                              </Button>
                            </Tooltip>

                            <div className="w-px h-4 bg-border/40 mx-0.5 md:mx-1" />

                            {isAdmin && user.role !== "ADMIN" && (
                              <Tooltip content="Enter Diagnostic Session">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-primary/10 group-hover:scale-105 transition-all text-primary"
                                  onClick={() => handleImpersonate(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            )}

                            <Tooltip content="View Strategic Insights">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all text-muted-foreground hover:text-primary"
                                onClick={() =>
                                  router.push(`/admin/users/${user.id}`)
                                }
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Anchored Pagination */}
            {paginationData && paginationData.totalPages > 1 && (
              <div className="flex-none px-6 md:px-8 py-3 md:py-4 bg-background/60 backdrop-blur-2xl border-t border-border/5">
                <PaginationPlus
                  currentPage={currentPage}
                  totalPages={paginationData.totalPages}
                  totalResults={paginationData.total}
                  limit={paginationData.limit}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Floating Bulk Management Banner */}
      {selectedUsers.size > 0 && (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500 w-[94%] md:w-auto">
          <div className="premium-card bg-background/80 backdrop-blur-[32px] border border-primary/30 rounded-2xl md:rounded-[3rem] px-4 md:px-10 py-4 md:py-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] sapphire-glow flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 lg:border-r border-border/40 lg:pr-8 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 overflow-hidden p-1">
                  {users
                    .filter((u) => selectedUsers.has(u.id))
                    .slice(0, 3)
                    .map((u) => (
                      <div
                        key={u.id}
                        className="w-10 h-10 rounded-xl border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary shadow-sm overflow-hidden"
                      >
                        {u.name?.[0].toUpperCase()}
                      </div>
                    ))}
                  {selectedUsers.size > 3 && (
                    <div className="w-10 h-10 rounded-xl border-2 border-background bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground shadow-sm">
                      +{selectedUsers.size - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-foreground leading-none">
                    {selectedUsers.size} Selected
                  </p>
                  <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground mt-1.5 flex items-center gap-1.5 opacity-60 uppercase tracking-tighter">
                    Hardening active
                  </p>
                </div>
              </div>

              <Tooltip content="Dismiss Selection">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-rose-500/10 hover:text-rose-600 transition-all shadow-sm"
                  onClick={() => setSelectedUsers(new Set())}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto w-full lg:w-auto no-scrollbar pb-1 lg:pb-0 justify-center">
              <Tooltip content="Verify Selected Clearance">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-emerald-500/10 text-emerald-600 border border-transparent hover:border-emerald-500/20 transition-all active:scale-95 shadow-sm"
                  onClick={() =>
                    handleBatchAction("Verify All", { isVerified: true })
                  }
                >
                  <CheckCircle2 className="h-5 w-5" />
                </Button>
              </Tooltip>

              <Tooltip content="Revoke Access (Ban All)">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-rose-500/10 text-rose-600 border border-transparent hover:border-rose-500/20 transition-all active:scale-95 shadow-sm"
                  onClick={() =>
                    handleBatchAction("Ban All", { isActive: false })
                  }
                >
                  <Ban className="h-5 w-5" />
                </Button>
              </Tooltip>

              <div className="w-px h-6 bg-border/40 mx-1 md:mx-2" />

              <div className="flex items-center gap-2">
                <Tooltip content="Assign Moderator Role">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-blue-500/10 text-blue-600 border border-transparent hover:border-blue-500/20 transition-all active:scale-95 shadow-sm"
                    onClick={() =>
                      handleBatchAction("Assign: MODERATOR", {
                        role: "MODERATOR",
                      })
                    }
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </Button>
                </Tooltip>

                <Tooltip content="Restore Selected to Citizen Status">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-muted text-muted-foreground border border-transparent hover:border-border/40 transition-all active:scale-95 shadow-sm"
                    onClick={() =>
                      handleBatchAction("Assign: USER", { role: "USER" })
                    }
                  >
                    <Activity className="h-5 w-5" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        loading={confirmConfig.loading}
      />
    </div>
  );
}
