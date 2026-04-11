'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService } from '@/services/admin.service';
import { 
  Users, Shield, UserCheck, UserX, ArrowLeft, 
  Mail, Calendar, Wallet, Tag, Activity, 
  Ban, CheckCircle2, AlertCircle, Clock, 
  ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { cn, capitalize } from '@/lib/utils';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    try {
      const response = await adminService.getUserDetail(id as string);
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch user details');
      router.push('/admin/users');
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
    } else if (data.role === 'ADMIN') {
      title = "Grant Admin Privileges?";
      description = `Are you sure you want to promote ${user.email} to ADMIN? This user will have full system access.`;
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
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Action failed');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleDeleteUser = () => {
    setConfirmConfig({
      isOpen: true,
      title: "EXTREME: Permanent Deletion?",
      description: `WARNING: You are about to PERMANENTLY DELETE ${user.email}. This will erase all their ledger entries, categories, and budgets from the absolute database. THIS CANNOT BE UNDONE. Proceed with extreme caution.`,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setActionLoading(true);
        // Assuming there's a delete method or we use update to ban then delete
        toast.info('Administrative deletion protocol initialized... (Simulated)');
        setTimeout(() => setActionLoading(false), 1000);
      }
    });
  }

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
            <Button 
              variant="outline" 
              className={cn(
                "h-12 px-6 rounded-xl font-bold gap-2 active:scale-95 transition-all shadow-sm",
                user.isActive ? "hover:bg-rose-50 hover:text-rose-600 border-rose-100" : "hover:bg-emerald-50 hover:text-emerald-600 border-emerald-100"
              )}
              disabled={actionLoading}
              onClick={() => handleUpdateUser({ isActive: !user.isActive })}
            >
              {user.isActive ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              <span>{user.isActive ? 'Ban Account' : 'Reactivate Account'}</span>
            </Button>
            
            <Button 
              className="h-12 px-6 rounded-xl font-bold gap-2 shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
              disabled={actionLoading}
              onClick={() => handleUpdateUser({ role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
            >
              <Shield className="h-4 w-4" />
              <span>{user.role === 'ADMIN' ? 'Demote to User' : 'Grant Admin Privileges'}</span>
            </Button>
          </div>
        </SlideIn>
      </header>

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

          <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-4">
             <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">Danger Zone</h3>
             <p className="text-xs text-muted-foreground font-medium leading-relaxed">
               Deleting this account will permanently remove all transaction history, categories, and budgets. This action cannot be undone.
             </p>
             <Button 
                variant="destructive" 
                className="w-full h-11 rounded-xl font-bold text-xs uppercase shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                onClick={handleDeleteUser}
                disabled={actionLoading}
              >
                Delete Platform Identity
             </Button>
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
