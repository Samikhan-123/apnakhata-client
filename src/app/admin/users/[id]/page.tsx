'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService } from '@/services/admin.service';
import { ErrorState } from '@/components/ui/ErrorState';
import { handleApiError } from '@/lib/error-handler';
import { 
  Users, Shield, ShieldCheck, UserCheck, UserX, ArrowLeft, 
  Mail, Calendar, Wallet, Tag, Activity, 
  Ban, CheckCircle2, AlertCircle, Clock, 
  ArrowUpRight, ArrowDownLeft, ReceiptText, BarChart3, 
  TrendingUp, ShieldAlert, Scale, Globe, TrendingDown, 
  DollarSign
} from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn, capitalize } from '@/lib/utils';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useAuth } from '@/context/AuthContext';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const isSelf = currentUser?.id === id;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUserDetail(id as string);
      if (response.success) {
        setUser(response.data);
      }
    } catch (err: any) {
      const { message, status } = handleApiError(err, { silent: true });
      setError({ message, status });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = (data: any) => {
    let title = "Confirm Action";
    let description = "Are you sure you want to proceed with this update?";

    if (data.isActive === false) {
      title = "Ban User?";
      description = `Are you sure you want to ban ${user.email}? They will lose platform access immediately.`;
    } else if (data.isActive === true) {
      title = "Reactivate User?";
      description = `Are you sure you want to reactivate ${user.email}?`;
    } else if (data.role === 'MODERATOR') {
      title = "Grant Moderator Privileges?";
      description = `Are you sure you want to promote ${user.email} to MODERATOR? This user will have limited system access.`;
    } else if (data.role === 'USER') {
      title = "Demote to User?";
      description = `Are you sure you want to demote ${user.email} to a standard USER?`;
    }

    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setActionLoading(true);
        try {
          const response = await adminService.updateUser(id as string, data);
          if (response.success) {
            toast.success('User updated successfully');
            fetchUserDetails();
          }
        } catch (err: any) {
          handleApiError(err);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleScheduleDeletion = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Schedule Account Deletion?",
      description: `Target: ${user.email}. The account will be deactivated immediately and PERMANENTLY ERASED in 30 days. You can cancel this at any time before the deadline.`,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setActionLoading(true);
        try {
          const response = await adminService.scheduleUserDeletion(id as string);
          if (response.success) {
            toast.success('Account scheduled for deletion');
            fetchUserDetails();
          }
        } catch (err: any) {
          handleApiError(err);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleCancelDeletion = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Cancel Scheduled Deletion?",
      description: `Restore access for ${user.email}? This will stop the countdown and reactivate the account.`,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setActionLoading(true);
        try {
          const response = await adminService.cancelUserDeletion(id as string);
          if (response.success) {
            toast.success('Deletion cancelled. Account restored.');
            fetchUserDetails();
          }
        } catch (err: any) {
          handleApiError(err);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-32 bg-muted/20 rounded-xl" />
        <div className="h-40 w-full bg-muted/20 rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/20 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center">
        <ErrorState
          title="Profile Extraction Failed"
          message={error.message || "We could not retrieve the security profile for this identity."}
          onRetry={fetchUserDetails}
          type={error.status === 0 ? 'connection' : 'server'}
        />
        <Button 
          variant="link" 
          className="mt-4 text-muted-foreground" 
          onClick={() => router.push('/admin/users')}
        >
          Return to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <SlideIn duration={0.5}>
          <Button 
            variant="ghost" 
            className="mb-4 -ml-2 gap-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => router.push('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-bold">Back to Registry</span>
          </Button>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 font-black text-2xl text-primary shadow-sm">
                {user.name ? user.name[0].toUpperCase() : 'U'}
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tight text-foreground">{user.name || 'Anonymous User'}</h1>
               <div className="flex items-center gap-3 mt-1">
                 <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 p-1 px-2.5 rounded-full bg-muted/30">
                   <Mail className="h-3.5 w-3.5" />
                   {user.email}
                 </span>
                 <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                    user.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                 )}>
                    {user.isActive ? 'Active' : 'Banned'}
                 </span>
               </div>
             </div>
          </div>
        </SlideIn>

        <SlideIn duration={0.5} delay={0.1}>
          <div className="flex items-center gap-3">
             {user.deletionScheduledAt ? (
               <Button 
                 variant="outline" 
                 className="h-12 px-6 rounded-xl font-bold gap-2 bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 transition-all shadow-sm"
                 disabled={actionLoading}
                 onClick={handleCancelDeletion}
               >
                 <UserCheck className="h-4 w-4" />
                 <span>Cancel Deletion</span>
               </Button>
             ) : (
               <Tooltip content={user.isActive ? "Ban Account" : "Restore Access"}>
                 <Button 
                  variant="outline" 
                  className={cn(
                    "h-12 px-6 rounded-xl font-bold gap-2 active:scale-95 transition-all shadow-sm",
                    user.isActive ? "hover:bg-rose-50 hover:text-rose-600 border-rose-100" : "hover:bg-emerald-50 hover:text-emerald-600 border-emerald-100",
                    isSelf && "opacity-20 grayscale cursor-not-allowed"
                  )}
                  disabled={actionLoading || isSelf}
                  onClick={() => handleUpdateUser({ isActive: !user.isActive })}
                >
                  {user.isActive ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  <span>{user.isActive ? 'Ban Account' : 'Reactivate Account'}</span>
                </Button>
               </Tooltip>
             )}
            
            {isAdmin && user.role !== 'ADMIN' && (
              <Tooltip content={user.role === 'MODERATOR' ? "Revoke Staff Privileges" : "Grant Security Clearance"}>
                <Button 
                  className={cn(
                    "h-12 px-6 rounded-xl font-bold gap-2 shadow-lg hover:shadow-primary/20 active:scale-95 transition-all",
                    isSelf && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={actionLoading || isSelf}
                  onClick={() => handleUpdateUser({ role: user.role === 'MODERATOR' ? 'USER' : 'MODERATOR' })}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{user.role === 'MODERATOR' ? 'Demote to User' : 'Grant Moderator Rights'}</span>
                </Button>
              </Tooltip>
            )}
          </div>
        </SlideIn>
      </header>

      {isSelf && (
        <FadeIn>
          <div className="p-5 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">Active Administrative Session</p>
              <p className="text-xs text-muted-foreground font-medium">You are viewing your own profile. Self-destructive administrative actions are restricted for security.</p>
            </div>
          </div>
        </FadeIn>
      )}
      
      {user.deletionScheduledAt && (
        <FadeIn>
           <div className="p-6 rounded-[2rem] bg-rose-500/10 border-2 border-rose-500/20 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-rose-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <UserX className="w-32 h-32 rotate-12" />
              </div>
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center animate-pulse">
                <Clock className="w-8 h-8 text-rose-600" />
              </div>
              <div className="flex-1 text-center md:text-left z-10">
                 <h2 className="text-xl font-black text-rose-600 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                    SCHEDULED FOR DELETION
                    <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black animate-bounce mt-1 ml-2">URGENT</span>
                 </h2>
                 <p className="text-sm text-foreground/70 font-bold mt-1 max-w-2xl leading-relaxed">
                    This account is currently in a 30-day "Soft-Delete" observation period. 
                    Unless cancelled by an Administrator, all data will be permanently erased on 
                    <span className="text-rose-600 font-black px-1.5 underline decoration-2 decoration-rose-500/30 ml-1">
                      {format(new Date(user.deletionScheduledAt), 'MMMM dd, yyyy')}
                    </span>.
                 </p>
              </div>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="h-12 px-8 rounded-xl font-black bg-white text-rose-600 border-rose-200 hover:brightness-105 transition-all shadow-sm z-10"
                  onClick={handleCancelDeletion}
                >
                  Undo Deletion Plan
                </Button>
              )}
           </div>
        </FadeIn>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Transactions', value: user._count?.ledgerEntries || 0, icon: Activity, color: 'blue' },
          { label: 'Custom Categories', value: user._count?.categories || 0, icon: Tag, color: 'emerald' },
          { label: 'Monthly Budgets', value: user._count?.budgets || 0, icon: Wallet, color: 'amber' },
          { label: 'Recurring Tasks', value: user._count?.recurringEntries || 0, icon: Clock, color: 'purple' },
        ].map((stat, i) => (
          <FadeIn key={stat.label} delay={0.2 + i * 0.1}>
            <div className="premium-card p-6 rounded-3xl flex flex-col justify-between h-32 border border-border/10 group hover:border-primary/20 transition-all">
              <div className="flex justify-between items-start">
                <div className={cn(
                  "p-2 rounded-xl",
                  stat.color === 'blue' ? "bg-blue-500/5 text-blue-600" :
                  stat.color === 'emerald' ? "bg-emerald-500/5 text-emerald-600" :
                  stat.color === 'amber' ? "bg-amber-500/5 text-amber-600" : "bg-purple-500/5 text-purple-600"
                )}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{stat.label}</span>
              </div>
              <div className="text-3xl font-black tracking-tighter text-foreground">{stat.value}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black tracking-tight text-foreground">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary gap-1">
              View All <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {user.recentActivity?.length > 0 ? (
              user.recentActivity.map((entry: any) => (
                <div key={entry.id} className="premium-card p-4 rounded-2xl flex items-center justify-between gap-4 border border-border/10">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      entry.type === 'INCOME' ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-rose-500/5 text-rose-600 border-rose-500/10"
                    )}>
                      {entry.type === 'INCOME' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{capitalize(entry.description)}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{entry.category?.name || 'General'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-black tabular-nums",
                      entry.type === 'INCOME' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {entry.type === 'INCOME' ? '+' : '-'} {formatCurrency(Math.abs(entry.amount))}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-muted/10 rounded-3xl border border-dashed border-border/20">
                <p className="text-muted-foreground font-bold">No recent transactions recorded.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black tracking-tight text-foreground px-2">Account Metadata</h2>
          <div className="premium-card p-6 rounded-3xl space-y-6 border border-border/10">
            <div className="flex items-start gap-4">
              <div className="bg-muted/30 p-2.5 rounded-xl">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Joined Platform</p>
                <p className="font-bold text-foreground">{format(new Date(user.createdAt), 'MMMM dd, yyyy')}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(user.createdAt), 'hh:mm a')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-muted/30 p-2.5 rounded-xl">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Last Synchronized</p>
                <p className="font-bold text-foreground">{format(new Date(user.updatedAt), 'MMMM dd, yyyy')}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(user.updatedAt), 'hh:mm a')}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/10 space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-muted-foreground">Internal ID</span>
                 <code className="text-[10px] bg-muted/50 px-2 py-0.5 rounded-md font-mono">{user.id}</code>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-muted-foreground">Currency Preference</span>
                 <span className="text-xs font-black text-foreground">{user.baseCurrency}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-muted-foreground">Account Status</span>
                 <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-md",
                    user.isVerified ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                 )}>{user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
               </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-4 shadow-sm group hover:border-rose-500/30 transition-all">
             <div className="flex items-center gap-2">
               <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">Platform Identity Deletion</h3>
               <AlertCircle className="h-4 w-4 text-rose-500/50" />
             </div>
             <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
               Administrative account removal follows a 30-day grace period. During this time, the user is inactive but data remains stored.
             </p>
             {isAdmin && !user.deletionScheduledAt && user.role !== 'ADMIN' ? (
               <Tooltip content="Initialize permanent erasure workflow">
                 <Button 
                    variant="destructive" 
                    className={cn(
                      "w-full h-12 rounded-xl font-black text-xs uppercase shadow-lg shadow-rose-500/20 active:scale-95 transition-all gap-2",
                      isSelf && "opacity-20 grayscale cursor-not-allowed"
                    )}
                    onClick={handleScheduleDeletion}
                    disabled={actionLoading || isSelf}
                  >
                    <UserX className="h-4 w-4" />
                    Initialize 30-Day Deletion
                 </Button>
               </Tooltip>
             ) : user.deletionScheduledAt ? (
               <Button 
                variant="outline"
                className="w-full h-12 rounded-xl font-black text-xs uppercase border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all gap-2"
                onClick={handleCancelDeletion}
                disabled={actionLoading}
              >
                <Clock className="h-4 w-4" />
                Cancel Pending Deletion
              </Button>
             ) : (
               <div className="text-[10px] text-muted-foreground italic font-medium p-3 bg-muted/30 rounded-xl text-center">
                 {user.role === 'ADMIN' ? 'Administrative identity is protected from standard erasure.' : 'Only platform Administrators can initiate account deletions.'}
               </div>
             )}
          </div>
        </div>
      </div>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        loading={actionLoading}
      />
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
