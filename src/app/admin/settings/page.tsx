'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/admin.service';
import { 
  Settings, 
  ShieldAlert, 
  UserPlus, 
  Database, 
  Globe, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SystemSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; description: string; data: any } | null>(null);

  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      router.push('/admin');
      toast.error('Access Denied: Full Administrator privileges required.');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminService.getSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const executeUpdate = async (updateData: any) => {
    setConfirmState(null);
    setSaving(true);
    try {
      const response = await adminService.updateSettings(updateData);
      if (response.success) {
        setSettings(response.data);
        toast.success('System configuration updated');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = (updateData: any, isCritical: boolean = false, title: string = '', desc: string = '') => {
    if (isCritical) {
      setConfirmState({ isOpen: true, title, description: desc, data: updateData });
    } else {
      executeUpdate(updateData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Global Settings</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">Platform Management</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage global platform settings and system limits.</p>
        </SlideIn>
        
        <FadeIn delay={0.2} className="hidden md:block">
           <div className="bg-muted/30 px-6 py-3 rounded-2xl border border-border/40 backdrop-blur-sm animate-pulse">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mr-3">Status</span>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Active & Monitored</span>
           </div>
        </FadeIn>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Maintenance Mode Card */}
        <FadeIn delay={0.1}>
          <div className={cn(
            "premium-card p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 h-full flex flex-col justify-between",
            settings?.maintenanceMode 
              ? "border-rose-500/30 bg-rose-500/[0.03] shadow-rose-900/10" 
              : "border-emerald-500/10 bg-emerald-500/[0.01] hover:border-emerald-500/20 shadow-emerald-900/5"
          )}>
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className={cn(
                  "p-5 rounded-3xl sapphire-glow/20 transition-colors duration-500",
                  settings?.maintenanceMode ? "bg-rose-500/20 text-rose-600 shadow-rose-500/10" : "bg-emerald-500/20 text-emerald-600 shadow-emerald-500/10"
                )}>
                  {settings?.maintenanceMode ? <Lock className="h-7 w-7" /> : <Unlock className="h-7 w-7" />}
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-2",
                    settings?.maintenanceMode ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  )}>
                    {settings?.maintenanceMode ? 'Locked' : 'Operational'}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-3 text-foreground">Maintenance Mode</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium mb-10 leading-relaxed opacity-80">
                When enabled, all non-admin access is blocked. Users will be presented with a professional maintenance overlay globally.
              </p>
            </div>

            <Button 
               onClick={() => handleUpdate({ maintenanceMode: !settings.maintenanceMode }, true, settings.maintenanceMode ? 'Deactivate Maintenance' : 'Activate Maintenance', 'This will affect all users immediately.')}
               disabled={saving}
               className={cn(
                 "w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 sapphire-glow",
                 settings?.maintenanceMode 
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/40 text-white" 
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40 text-white"
               )}
            >
              {saving ? <RefreshCw className="h-5 w-5 animate-spin mr-3" /> : <ShieldAlert className="h-5 w-5 mr-3" />}
              {settings?.maintenanceMode ? 'Disable Lockout' : 'Enable Maintenance'}
            </Button>
          </div>
        </FadeIn>

        {/* User Registration Card */}
        <FadeIn delay={0.2}>
          <div className="premium-card p-6 md:p-10 rounded-[2.5rem] border border-border/10 h-full flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="p-5 bg-primary/10 rounded-3xl text-primary sapphire-glow/20">
                  <UserPlus className="h-7 w-7" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border",
                  settings?.registrationEnabled ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border/40"
                )}>
                  {settings?.registrationEnabled ? 'Registrations Open' : 'System Closed'}
                </span>
              </div>
              
              <h3 className="text-2xl font-black mb-3 text-foreground">User Onboarding</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium mb-10 leading-relaxed opacity-80">
                Control public signups. This switch enforces platform access at both standard and Google OAuth registration layers.
              </p>
            </div>

            <Button 
               variant="outline"
               onClick={() => handleUpdate({ registrationEnabled: !settings.registrationEnabled }, !settings.registrationEnabled, 'Enable Registration')}
               disabled={saving}
               className={cn(
                 "w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all duration-300",
                 settings?.registrationEnabled 
                  ? "border-primary/20 hover:bg-primary/5 text-primary" 
                  : "border-rose-500/20 hover:bg-rose-500/5 text-rose-600"
               )}
            >
              {settings?.registrationEnabled ? 'Deactivate Signups' : 'Re-open Enrolment'}
            </Button>
          </div>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Max Entries Limit */}
        <FadeIn delay={0.3} className="md:col-span-2">
          <div className="premium-card p-6 md:p-10 rounded-[2.5rem] border border-border/10 flex flex-col justify-between hover:border-blue-500/20 transition-all duration-300 group">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-black text-foreground">Data Retention</h4>
                <p className="text-xs md:text-sm text-muted-foreground font-medium opacity-60">Global limit for ledger entries per user.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="number"
                value={settings?.maxEntriesLimit || 5000}
                onChange={(e) => setSettings({ ...settings, maxEntriesLimit: parseInt(e.target.value) })}
                className="flex-1 bg-muted/20 border border-border/40 h-16 rounded-2xl px-8 font-black text-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="Limit"
              />
              <Button 
                onClick={() => handleUpdate(
                  { maxEntriesLimit: settings.maxEntriesLimit }, 
                  true, 
                  'Update System Limits', 
                  `This will set the global record limit to ${settings.maxEntriesLimit} for all users. Users exceeding this limit will be blocked from creating new entries.`
                )}
                disabled={saving}
                className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              >
                Sync Limit
              </Button>
            </div>
          </div>
        </FadeIn>

      </div>

      <FadeIn delay={0.5}>
        <div className="p-8 md:p-10 bg-primary/[0.03] border border-primary/10 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-xl sapphire-glow/5">
          <div className="p-4 bg-primary/10 rounded-2xl animate-pulse">
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h5 className="font-black text-primary text-xs uppercase tracking-widest mb-1">Administrative Advisory</h5>
            <p className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
               Modifying system-level settings triggers an immediate environment re-synchronization. Please ensure all changes are approved before switching global rules.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Confirmation Modal */}
      {confirmState && (
        <ConfirmDialog 
          isOpen={confirmState.isOpen}
          onClose={() => setConfirmState(null)}
          onConfirm={() => executeUpdate(confirmState.data)}
          title={confirmState.title}
          description={confirmState.description}
          loading={saving}
          confirmText="Yes, Proceed"
          cancelText="Go Back"
        />
      )}
    </div>
  );
}
