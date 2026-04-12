'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Users, Shield, UserCheck, UserX, Search, Filter, MoreHorizontal, CheckCircle2, AlertCircle, Ban, Activity, ChevronRight, HelpCircle } from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PaginationPlus } from '@/components/ui/PaginationPlus';

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<any>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    loading: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    loading: false
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(page);
      if (response.success) {
        setUsers(response.data);
        setPaginationData(response.pagination);
      }
    } catch (error) {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (user: any) => {
    setConfirmConfig({
      isOpen: true,
      title: user.isActive ? "Deactivate Account?" : "Activate Account?",
      description: `Are you sure you want to ${user.isActive ? 'ban' : 'activate'} ${user.email}? ${user.isActive ? 'This user will lose access to the platform immediately.' : 'Access will be restored.'}`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        try {
          const response = await adminService.updateUser(user.id, { isActive: !user.isActive });
          if (response.success) {
            toast.success(`User account ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
            fetchUsers(currentPage);
          }
        } catch (error) {
          toast.error('Failed to update account status');
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  const handleToggleVerification = (user: any) => {
    if (user.googleId) {
      toast.error("Google-authenticated users are managed by Google and cannot be unverified manually.");
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: user.isVerified ? "Remove Verification?" : "Verify User?",
      description: `Are you sure you want to ${user.isVerified ? 'unverify' : 'verify'} ${user.email}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        try {
          const response = await adminService.updateUser(user.id, { isVerified: !user.isVerified });
          if (response.success) {
            toast.success(`User ${!user.isVerified ? 'verified' : 'unverified'} successfully`);
            fetchUsers(currentPage);
          }
        } catch (error) {
          toast.error('Failed to update verification status');
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-8">
      <header className="flex-none">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="bg-emerald-500/10 p-1.5 md:p-2 rounded-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-600">Command & Control</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">User Registry</h1>
          <p className="text-muted-foreground font-medium mt-1 text-xs md:text-sm">Manage platform identities and security clearances.</p>
        </SlideIn>
      </header>

      {/* Responsive Filter & Search Section */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-none">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-11 md:h-12 pl-12 pr-6 font-medium text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <Button className="h-11 md:h-12 px-6 md:px-8 rounded-xl md:rounded-2xl font-bold gap-2 text-xs md:text-sm sapphire-glow">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Hybrid Scrolling User Table Card Container */}
      <div className="w-full flex-none">
        <FadeIn className="w-full" duration={0.7}>
          <div className="premium-card rounded-2xl md:rounded-[2rem] overflow-hidden border border-border/10">
            <div className="w-full overflow-x-auto sapphire-scrollbar pb-2">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-muted/90 backdrop-blur-xl border-b border-border/10">
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform Member</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Auth Role</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Metric Activity</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 md:px-8 py-5 md:py-6 h-16 md:h-20 bg-muted/5"></td>
                      </tr>
                    ))
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group">
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/10 font-black text-primary sapphire-glow/20">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-bold text-foreground leading-none mb-1">{user.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter border w-fit",
                            user.isVerified
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          )}>
                            {user.isVerified ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </div>
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter border w-fit",
                            user.isActive
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          )}>
                            {user.isActive ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                            {user.isActive ? 'Active' : 'Banned'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter border",
                          user.role === 'ADMIN'
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-border/40"
                        )}>
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs md:text-sm font-black text-foreground">{user._count?.ledgerEntries || 0} <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Entries</span></p>
                          <p className="text-[10px] text-muted-foreground font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all",
                              user.googleId && "opacity-20 grayscale cursor-not-allowed"
                            )}
                            onClick={() => !user.googleId && handleToggleVerification(user)}
                            disabled={!!user.googleId}
                          >
                            {user.isVerified ? <UserX className="h-4 w-4 text-amber-600" /> : <UserCheck className="h-4 w-4 text-emerald-600" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all"
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.isActive ? <Ban className="h-4 w-4 text-rose-600" /> : <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                          </Button>

                          <div className="w-px h-4 bg-border/40 mx-0.5 md:mx-1" />

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all text-muted-foreground hover:text-primary"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Anchored Pagination */}
            {paginationData && paginationData.totalPages > 1 && (
              <div className="flex-none px-6 md:px-8 py-3 md:py-4 bg-background/60 backdrop-blur-2xl border-t border-border/5">
                <PaginationPlus
                  currentPage={currentPage}
                  totalPages={paginationData.totalPages}
                  totalResults={paginationData.totalCount}
                  limit={paginationData.limit}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        loading={confirmConfig.loading}
      />
    </div>
  );
}
