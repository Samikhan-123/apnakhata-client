'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations';
import { cn } from '@/lib/utils';
import { FadeIn, HeightChange } from '@/components/ui/FramerMotion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Settings, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setServerError('');
    try {
      await login(data);
    } catch (err: any) {
      const responseData = err.response?.data;
      setServerError(responseData?.message || 'We couldn\'t sign you in. Please verify your email and password.');
      setValue('password', '');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
      } catch (err: any) {
        setServerError(err.response?.data?.message || 'Google account login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const [isMaintenance, setIsMaintenance] = useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/system/status`);
        if (data.success && data.data.maintenanceMode) {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        // Silently fail
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <PublicHeader />
      
      <div className="grid lg:grid-cols-2 min-h-screen pt-20">
        {/* Left Side - Hero/Showcase */}
        <div className="hidden lg:flex flex-col justify-center p-24 bg-muted/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop')] bg-cover bg-center opacity-8 group-hover:scale-105 transition-transform duration-1000" />
          
          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Secure Access</p>
              <h1 className="text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
                Master your <br />
                <span className="text-primary italic">financial</span> <br />
                journey.
              </h1>
            </div>
            <p className="text-lg text-muted-foreground font-bold max-w-sm leading-relaxed">
              Experience the simplest way to track your expenses and build your savings. No difficulty, no complexity.
            </p>

            <div className="flex items-center gap-10 pt-10">
               <div className="space-y-1">
                  <p className="text-4xl font-black text-foreground tracking-tighter">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Private & Secure</p>
               </div>
               <div className="h-10 w-px bg-border/40" />
                <div className="space-y-1">
                  <p className="text-4xl font-black text-foreground tracking-tighter italic text-primary">Precise</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">User Centric</p>
                </div>
            </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-4 md:p-8 relative overflow-y-auto">
          <FadeIn 
            className="w-full max-w-md flex flex-col gap-4 md:gap-10 premium-card p-6 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 py-8 md:py-12"
          >
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground"> Login</h2>
              <p className="text-muted-foreground font-bold text-base leading-snug">Log in to reach your savings goals and manage your wealth.</p>
            </div>

            <HeightChange isVisible={isMaintenance}>
               <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 mb-2 animate-pulse">
                  <div className="bg-amber-500/10 p-2 rounded-lg">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Platform Maintenance Active</p>
                    <p className="text-[9px] font-bold text-amber-600/60 leading-tight">Standard access restricted. System under optimization.</p>
                  </div>
               </div>
            </HeightChange>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <HeightChange isVisible={!!serverError}>
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-xs font-bold flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {serverError}
                </div>
              </HeightChange>

              <div className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Email Address</Label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                     <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@email.com" 
                      className={cn(
                        "h-14 pl-12 rounded-2xl bg-muted/30 border-none focus:bg-background focus:ring-2 focus:ring-primary/10 font-bold transition-all shadow-inner placeholder:text-muted-foreground/20",
                        errors.email && "ring-2 ring-rose-500/20"
                      )}
                      {...register('email')}
                    />
                  </div>
                  <HeightChange isVisible={!!errors.email}>
                    <p className="text-[10px] font-bold text-rose-500 ml-1">
                      {errors.email?.message}
                    </p>
                  </HeightChange>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Password</Label>
                    <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:underline transition-colors">Forgot?</Link>
                  </div>
                  <PasswordInput 
                    id="password" 
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 min-h-[4rem] rounded-[1.5rem] bg-foreground text-background hover:bg-primary hover:text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/5 transition-all group"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Login</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="space-y-8 pt-2">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
                    <span className="bg-card px-4 text-muted-foreground/30 text-center">Or continue with</span>
                  </div>
               </div>

               <Button 
                type="button"
                variant="outline" 
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="w-full h-14 rounded-2xl border-border/60 bg-transparent hover:bg-muted/50 text-foreground font-bold transition-all gap-3 active:scale-95"
               >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-xs uppercase tracking-widest font-black">Google Account</span>
               </Button>

               <p className="text-center text-muted-foreground/60 font-bold text-sm">
                 New here? <Link href="/register" title="Create Account" className="text-primary hover:underline underline-offset-4">Create an account</Link>
               </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
