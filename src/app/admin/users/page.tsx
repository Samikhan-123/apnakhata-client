'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/admin.service';
import { 
  Users, Shield, ShieldCheck, UserCheck, UserX, 
  Search, Filter, MoreHorizontal, CheckCircle2, 
  AlertCircle, Ban, Activity, ChevronRight, HelpCircle, Eye 
} from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { handleApiError } from '@/lib/error-handler';
import { cn, capitalize } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PaginationPlus } from '@/components/ui/PaginationPlus';

export default function UserManagementPage() {
  const router = useRouter();
  const { user: currentUser, impersonate } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const isModerator = currentUser?.role === 'MODERATOR';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  
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
    setError(null);
    try {
      const response = await adminService.getUsers(page);
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
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update account status');
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
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update verification status');
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  const handleImpersonate = (user: any) => {
    setConfirmConfig({
      isOpen: true,
      title: "Start Diagnostic Session?",
      description: `You are about to enter the dashboard as ${user.name || user.email}. This session will be Read-Only and your actions will be logged for security.`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        try {
          await impersonate(user.id);
        } catch (error) {
          // Toast handled by AuthContext/Interceptor
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
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
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleBatchAction = (action: string, data: any) => {
    setConfirmConfig({
      isOpen: true,
      title: `Batch Action: ${action}`,
      description: `Are you sure you want to apply this action to ${selectedUsers.size} selected users?`,
      loading: false,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        try {
          const response = await adminService.batchUpdateUsers(Array.from(selectedUsers), data);
          if (response.success) {
            toast.success(response.message || 'Batch update successful');
            fetchUsers(currentPage);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Batch update failed');
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
    <div className="flex flex-col h-full space-y-4 md:space-y-8 relative">
      <header className="flex-none">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="bg-emerald-500/10 p-1.5 md:p-2 rounded-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-600">Command & Control</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">User Registry</h1>
              <p className="text-muted-foreground font-medium mt-1 text-xs md:text-sm">Manage platform identities and security clearances.</p>
            </div>
            {selectedUsers.size > 0 && (
              <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                 <span className="text-xs font-black text-primary uppercase tracking-widest">{selectedUsers.size} Selected</span>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-7 text-[10px] font-bold text-muted-foreground hover:text-rose-600 px-2"
                   onClick={() => setSelectedUsers(new Set())}
                 >
                   Deselect All
                 </Button>
              </div>
            )}
          </div>
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
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-muted/90 backdrop-blur-xl border-b border-border/10">
                    <th className="px-4 py-4 md:py-5 w-12 text-center">
                       <input 
                         type="checkbox" 
                         className="h-4 w-4 rounded border-border/40 focus:ring-primary accent-primary cursor-pointer"
                         checked={users.length > 0 && selectedUsers.size === users.length}
                         onChange={toggleSelectAll}
                       />
                    </th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform Member</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Auth Role</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Connectivity</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Metric Activity</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-6 md:px-8 py-5 md:py-6 h-16 md:h-20 bg-muted/5"></td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <ErrorState
                           title="Registry Unavailable"
                           message={error.message || "Failed to synchronize platform identities."}
                           onRetry={() => fetchUsers(currentPage)}
                           type={error.status === 0 ? 'connection' : 'server'}
                           className="glass-card p-12"
                        />
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className={cn(
                      "hover:bg-primary/[0.02] transition-colors group",
                      selectedUsers.has(user.id) && "bg-primary/[0.03]"
                    )}>
                      <td className="px-4 py-5 md:py-6 text-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-border/40 focus:ring-primary accent-primary cursor-pointer"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                        />
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/10 font-black text-primary sapphire-glow/20">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs md:text-sm font-bold text-foreground leading-none">{user.name ? capitalize(user.name) : 'Anonymous'}</p>
                              {user.id === currentUser?.id && (
                                <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-tighter border border-primary/20">Self</span>
                              )}
                            </div>
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
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px) font-black uppercase tracking-tighter border w-fit",
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
                          user.role === 'ADMIN' && "bg-primary/10 text-primary border-primary/20",
                          user.role === 'MODERATOR' && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                          user.role === 'USER' && "bg-muted text-muted-foreground border-border/40"
                        )}>
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] font-black text-foreground selection:bg-primary/30 uppercase tracking-tighter">{user.lastIp || 'No IP'}</p>
                          <div className="flex items-center gap-1">
                             <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">{user.lastLocation || 'Global'}</span>
                             {user.lastDevice && (
                               <Tooltip content={user.lastDevice}>
                                 <Activity className="h-2.5 w-2.5 text-primary/40 cursor-help" />
                               </Tooltip>
                             )}
                          </div>
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
                           <Tooltip content={user.isVerified ? "Revoke Verification" : "Grant Verification"}>
                             <Button
                               variant="ghost"
                               size="icon"
                               className={cn(
                                 "h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all text-muted-foreground/40",
                                 (user.googleId || user.id === currentUser?.id) && "opacity-20 grayscale cursor-not-allowed"
                               )}
                               onClick={() => !(user.googleId || user.id === currentUser?.id) && handleToggleVerification(user)}
                               disabled={!!user.googleId || user.id === currentUser?.id}
                             >
                               {user.isVerified ? <UserX className="h-4 w-4 text-amber-600" /> : <UserCheck className="h-4 w-4 text-emerald-600" />}
                             </Button>
                           </Tooltip>

                           <Tooltip content={user.isActive ? "Ban Account" : "Reactivate Account"}>
                             <Button
                               variant="ghost"
                               size="icon"
                               className={cn(
                                 "h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-muted group-hover:scale-105 transition-all text-muted-foreground/40",
                                 user.id === currentUser?.id && "opacity-20 grayscale cursor-not-allowed"
                               )}
                               disabled={user.id === currentUser?.id}
                               onClick={() => handleToggleStatus(user)}
                             >
                               {user.isActive ? <Ban className="h-4 w-4 text-rose-600" /> : <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                             </Button>
                           </Tooltip>

                          <div className="w-px h-4 bg-border/40 mx-0.5 md:mx-1" />

                          {isAdmin && user.role !== 'ADMIN' && (
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
                              onClick={() => router.push(`/admin/users/${user.id}`)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Tooltip>
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

      {/* Floating Bulk Management Banner */}
      {selectedUsers.size > 0 && (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500 w-[94%] md:w-auto">
          <div className="premium-card bg-background/80 backdrop-blur-[32px] border border-primary/30 rounded-2xl md:rounded-[3rem] px-4 md:px-10 py-4 md:py-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] sapphire-glow flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 lg:border-r border-border/40 lg:pr-8 w-full lg:w-auto justify-between lg:justify-start">
               <div className="flex items-center gap-4">
                 <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-sm md:text-lg border border-primary/20 shadow-inner">
                   {selectedUsers.size}
                 </div>
                 <div>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-foreground leading-none">Bulk Operations</p>
                    <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground mt-1.5 flex items-center gap-1.5">
                       <ShieldCheck className="h-3 w-3 text-emerald-500" />
                       Strategic hardening session active
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
               <Tooltip content="Apply platform verification status">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl hover:bg-emerald-500/10 text-emerald-600 font-black gap-2 text-[10px] md:text-xs whitespace-nowrap border border-transparent hover:border-emerald-500/20 transition-all active:scale-95"
                   onClick={() => handleBatchAction('Verify All', { isVerified: true })}
                 >
                   <CheckCircle2 className="h-4 w-4" />
                   <span>VERIFY CLEARANCE</span>
                 </Button>
               </Tooltip>

               <Tooltip content="Immediately revoke platform access">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl hover:bg-rose-500/10 text-rose-600 font-black gap-2 text-[10px] md:text-xs whitespace-nowrap border border-transparent hover:border-rose-500/20 transition-all active:scale-95"
                   onClick={() => handleBatchAction('Ban All', { isActive: false })}
                 >
                   <Ban className="h-4 w-4" />
                   <span>RESTRIC ACCESS</span>
                 </Button>
               </Tooltip>

               <div className="w-px h-6 bg-border/40 mx-1 md:mx-2 hidden lg:block" />

               <div className="flex items-center gap-2">
                 <Tooltip content="Assign Moderator responsibilities">
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl hover:bg-blue-500/10 text-blue-600 font-black gap-2 text-[10px] md:text-xs whitespace-nowrap border border-transparent hover:border-blue-500/20 transition-all active:scale-95"
                     onClick={() => handleBatchAction('Assign: MODERATOR', { role: 'MODERATOR' })}
                   >
                     <ShieldCheck className="h-4 w-4" />
                     <span>MODERATOR</span>
                   </Button>
                 </Tooltip>

                 <Tooltip content="Restore to standard User status">
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl hover:bg-muted text-muted-foreground font-black gap-2 text-[10px] md:text-xs whitespace-nowrap border border-transparent hover:border-border/40 transition-all active:scale-95"
                     onClick={() => handleBatchAction('Assign: USER', { role: 'USER' })}
                   >
                     <Activity className="h-4 w-4" />
                     <span>CITIZEN</span>
                   </Button>
                 </Tooltip>
               </div>
            </div>
            
            <div className="hidden lg:block">
               <Tooltip content="Emergency Deselect">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-12 w-12 rounded-2xl hover:bg-muted text-muted-foreground"
                   onClick={() => setSelectedUsers(new Set())}
                 >
                   <UserX className="h-5 w-5" />
                 </Button>
               </Tooltip>
            </div>
          </div>
        </div>
      )}

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
