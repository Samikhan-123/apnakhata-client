'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings, 
  Globe, 
  Database, 
  Shield, 
  Download, 
  Trash2, 
  Save,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { SlideIn } from "@/components/ui/FramerMotion";
import { authService } from '@/services/auth.service';

export default function SettingsPage() {
  const { user, logout, readOnly } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isPurgeOpen, setIsPurgeOpen] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [isDeletionOpen, setIsDeletionOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState('');
  const [isChangingCurrency, setIsChangingCurrency] = useState(false);


  // Form states (stubbed for now as we focus on UI)
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handlePurgeData = async () => {
    setIsPurging(true);
    // Simulate API call for data purge
    setTimeout(() => {
      setIsPurging(false);
      setIsPurgeOpen(false);
      toast.success("All data has been cleared");
    }, 2000);
  };

  const handleRequestDeletion = async () => {
    if (readOnly) {
      toast.error("Diagnostic Session: Mutation actions are disabled.");
      return;
    }
    setIsDeleting(true);
    try {
      const response = await authService.requestDeletion();
      if (response.success) {
        toast.success("Account removal initialized", {
          description: "Your account is now scheduled for deletion in 30 days. You have been logged out."
        });
        // logout() is called inside authService.requestDeletion internally by clearing cookies 
        // but let's force redirect if needed, though interceptor should handle 401/redirect
        window.location.href = '/login';
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initialize deletion");
    } finally {
      setIsDeleting(false);
      setIsDeletionOpen(false);
    }
  };

  const handleCurrencySelect = (code: string) => {
    if (code === currency) return;
    setPendingCurrency(code);
    setIsCurrencyOpen(true);
  };

  const onConfirmCurrencyChange = async () => {
    setIsChangingCurrency(true);
    try {
      await setCurrency(pendingCurrency);
      setIsCurrencyOpen(false);
    } catch (error) {
      // Error handled by CurrencyContext/toast
    } finally {
      setIsChangingCurrency(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 w-full">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <SlideIn duration={0.5}>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Settings</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg max-w-lg">
            Manage your account preferences, appearance, and data security.
          </p>
        </SlideIn>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex xl:flex-row flex-col gap-12">
          {/* Sidebar Tabs */}
           <div className="xl:w-[280px] shrink-0">
             <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-2 items-stretch">
                <TabsTrigger 
                  value="profile" 
                  className="h-12 rounded-xl justify-start px-4 gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-bold group"
                >
                  <User size={18} />
                  <span>Profile</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                </TabsTrigger>
                
                <TabsTrigger 
                  value="experience" 
                  className="h-12 rounded-xl justify-start px-4 gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-bold group"
                >
                  <Palette size={18} />
                  <span>Preferences</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                </TabsTrigger>
             </TabsList>

             <div className="mt-12 p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 group">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/50 mb-6">Account Actions</p>
                <Button 
                  onClick={logout}
                  variant="ghost" 
                  disabled={readOnly}
                  className={cn(
                    "w-full h-11 rounded-xl justify-start gap-3 px-4 text-rose-600 font-bold border border-rose-500/10 active:scale-95 transition-all",
                    readOnly 
                      ? "opacity-20 cursor-not-allowed" 
                      : "hover:bg-rose-600 hover:text-white"
                  )}
                >
                  <LogOut size={18} />
                  <span>{readOnly ? 'Locked Session' : 'Sign Out'}</span>
                </Button>
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <TabsContent value="profile" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-10 duration-500">
               <Card className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden bg-card">
                  <CardHeader className="p-8 pb-0">
                     <CardTitle className="text-2xl font-bold tracking-tight">Profile Information</CardTitle>
                     <CardDescription className="text-sm font-medium text-muted-foreground/60">Your personal identity</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                     <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group cursor-pointer">
                           <User size={32} className="group-hover:scale-110 transition-transform duration-500" />
                        </div>
                         <div>
                            <h4 className="text-lg font-bold tracking-tight">{user?.name || 'User'}</h4>
                            <p className="text-[13px] font-medium text-muted-foreground/60">
                               Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}
                            </p>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 px-1">Full Name</Label>
                           <Input 
                             value={user?.name || ''} 
                             readOnly
                             className="h-11 rounded-xl bg-muted/40 border-none px-4 font-bold opacity-60 cursor-not-allowed"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 px-1">Email Address</Label>
                           <Input 
                             value={user?.email || ''} 
                             readOnly
                             className="h-11 rounded-xl bg-muted/40 border-none px-4 font-bold opacity-60 cursor-not-allowed"
                           />
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                     <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                        <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-muted-foreground/70 leading-relaxed">
                          Profile details are managed by your account provider and cannot be changed here for security.
                        </p>
                     </div>
                  </CardFooter>
               </Card>
            </TabsContent>

            <TabsContent value="experience" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-10 duration-500">
               <div className="grid gap-8">
                  <Card className="rounded-[2rem] border-border/40 shadow-sm p-8 bg-card">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 text-primary">
                           <Globe size={20} />
                        </div>
                        <div>
                           <CardTitle className="text-xl font-bold tracking-tight">Preferred Currency</CardTitle>
                           <CardDescription className="text-xs font-medium text-muted-foreground/60">Choose how you want to see your money</CardDescription>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                           {currencies.map((cur) => (
                              <div 
                                key={cur.code}
                               onClick={() => handleCurrencySelect(cur.code)}
                                className={cn(
                                  "p-5 rounded-2xl border-2 transition-all cursor-pointer active:scale-95",
                                  currency === cur.code 
                                    ? "bg-primary border-primary/20 text-primary-foreground shadow-md" 
                                    : "bg-muted/40 border-transparent hover:border-primary/20"
                                )}
                              >
                                 <div className="flex items-center justify-between mb-3">
                                    <span className={cn(
                                       "h-9 w-9 rounded-lg flex items-center justify-center font-bold text-base",
                                       currency === cur.code ? "bg-white/20" : "bg-primary/5 text-primary"
                                    )}>
                                       {cur.symbol}
                                    </span>
                                    {currency === cur.code && <CheckCircle2 size={18} className="text-primary-foreground" />}
                                 </div>
                                 <p className="font-bold text-base tracking-tight">{cur.name}</p>
                                 <p className={cn(
                                   "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                                   currency === cur.code ? "text-primary-foreground/60" : "text-muted-foreground/40"
                                 )}>{cur.code}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </Card>

                   <Card className="rounded-[2rem] border-border/40 shadow-sm p-8 bg-card">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 text-primary">
                           <Sun size={20} />
                        </div>
                        <div>
                           <CardTitle className="text-xl font-bold tracking-tight">Appearance</CardTitle>
                           <CardDescription className="text-xs font-medium text-muted-foreground/60">Switch between light and dark modes</CardDescription>
                        </div>
                     </div>
 
                     <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="ghost" 
                          onClick={() => !readOnly && setTheme('light')}
                          disabled={readOnly}
                          className={cn(
                            "h-20 rounded-xl border flex items-center gap-3 transition-all",
                            theme === 'light' ? "bg-primary text-primary-foreground border-primary/20 shadow-md" : "bg-muted/40 border-transparent",
                            !readOnly && theme !== 'light' && "hover:border-primary/10",
                            readOnly && "opacity-50 cursor-not-allowed"
                          )}
                        >
                           <Sun size={20} />
                           <span className="font-bold text-sm">Light Mode</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => !readOnly && setTheme('dark')}
                          disabled={readOnly}
                          className={cn(
                            "h-20 rounded-xl border flex items-center gap-3 transition-all",
                            theme === 'dark' ? "bg-primary text-primary-foreground border-primary/20 shadow-md" : "bg-muted/40 border-transparent",
                            !readOnly && theme !== 'dark' && "hover:border-primary/10",
                            readOnly && "opacity-50 cursor-not-allowed"
                          )}
                        >
                           <Moon size={20} />
                           <span className="font-bold text-sm">Dark Mode</span>
                        </Button>
                     </div>
                  </Card>

                    <Card className="rounded-[2rem] border-border/40 shadow-sm p-8 bg-card">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 text-primary">
                           <Database size={20} />
                        </div>
                        <div>
                           <CardTitle className="text-xl font-bold tracking-tight">Data & Privacy</CardTitle>
                           <CardDescription className="text-xs font-medium text-muted-foreground/60">Manage your financial wealth records</CardDescription>
                        </div>
                     </div>
  
                     <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-muted/20 border border-muted-foreground/10 flex items-center justify-between gap-6 opacity-40 cursor-not-allowed group">
                           <div>
                              <h5 className="font-bold text-base tracking-tight">Export Platform History</h5>
                              <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider italic">Coming Soon...</p>
                           </div>
                           <Button disabled={true} variant="ghost" className="h-10 w-10 rounded-lg p-0 hover:bg-primary/10 hover:text-primary transition-all">
                              <Download size={18} />
                           </Button>
                        </div>
  
                        <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between gap-6 group hover:bg-rose-500/[0.08] transition-all">
                           <div>
                              <h5 className="font-bold text-base tracking-tight text-rose-600">Delete My Account</h5>
                              <p className="text-[11px] font-black text-rose-500/40 uppercase tracking-widest">30-Day Grace Period</p>
                           </div>
                           <Button 
                             variant="ghost" 
                             disabled={readOnly}
                             className={cn(
                               "h-10 px-4 rounded-xl text-rose-600 font-bold gap-2 text-xs transition-all",
                               readOnly 
                                 ? "opacity-20 cursor-not-allowed" 
                                 : "hover:bg-rose-500 hover:text-white"
                             )}
                             onClick={() => !readOnly && setIsDeletionOpen(true)}
                           >
                              <Trash2 size={16} />
                              {readOnly ? 'LOCKED' : 'REQUEST REMOVAL'}
                           </Button>
                        </div>
                     </div>
                  </Card>
               </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      <ConfirmDialog
        isOpen={isPurgeOpen}
        onClose={() => setIsPurgeOpen(false)}
        onConfirm={handlePurgeData}
        loading={isPurging}
        title="Delete all data?"
        description="This is a permanent action. All your ledger records, goals, and recurring patterns will be deleted forever. This cannot be undone."
      />

      <ConfirmDialog 
        isOpen={isDeletionOpen}
        onClose={() => setIsDeletionOpen(false)}
        onConfirm={handleRequestDeletion}
        loading={isDeleting}
        title="Delete your account?"
        description="WARNING: Your account will be DEACTIVATED immediately and PERMANENTLY ERASED in 30 days. You can contact support within this period to cancel the request. All your data will be gone forever after the deadline."
      />

      <ConfirmDialog 
        isOpen={isCurrencyOpen}
        onClose={() => !isChangingCurrency && setIsCurrencyOpen(false)}
        onConfirm={onConfirmCurrencyChange}
        loading={isChangingCurrency}
        title="Change Preferred Currency?"
        description={`Are you sure you want to change your currency to ${pendingCurrency}? This change is for display purposes only; your existing ledger amounts will NOT be converted at the current exchange rate.`}
      />
    </div>
  );
}
