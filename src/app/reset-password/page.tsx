"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ShieldCheck, CheckCircle2, LockKeyhole, Mail, Key } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { FadeIn, HeightChange } from '@/components/ui/FramerMotion'
import Link from 'next/link'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { resetPassword, forgotPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendSuccess, setResendSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
    const otpParam = searchParams.get('otp')
    if (otpParam) {
      setOtp(otpParam)
    }
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer, canResend])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.')
      return
    }

    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await resetPassword({
        email,
        otp,
        password: newPassword
      })
      setSuccess('Your password has been securely reset. Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      const responseData = err.response?.data;
      let message = responseData?.message || 'The code is invalid or has expired. Please request a new one.';
      
      // If there are specific validation errors, show the first one
      if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        message = responseData.errors[0].message || message;
      }
      
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || !email) return
    
    setLoading(true)
    setError('')
    setResendSuccess('')
    try {
      await forgotPassword(email)
      setResendSuccess('A new recovery code has been sent to your email.')
      setTimer(60)
      setCanResend(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <PublicHeader />
      
      <div className="flex items-center justify-center min-h-screen pt-24 px-6">
        <FadeIn 
          className="w-full max-w-md flex flex-col gap-10 premium-card p-10 md:p-14 rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 py-12 relative overflow-hidden"
        >
          {/* Background Accent */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-[50px]" />
          
          <div className="space-y-4 text-center relative z-10">
            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/10 animate-pulse">
              <LockKeyhole className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground">Set new password</h2>
            <p className="text-muted-foreground font-bold text-base leading-snug max-w-[280px] mx-auto">
              Confirm your identity with the recovery code and secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
             <HeightChange isVisible={!!error || !!success || !!resendSuccess}>
                <div className="mb-6">
                  {error && (
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-xs font-bold flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {success}
                    </div>
                  )}
                  {resendSuccess && (
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-xs font-bold flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {resendSuccess}
                    </div>
                  )}
                </div>
             </HeightChange>

            {!success && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Email Address</Label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                     <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@email.com" 
                        className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus:bg-background focus:ring-2 focus:ring-primary/10 font-bold transition-all shadow-inner placeholder:text-muted-foreground/20"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">6-Digit recovery code</Label>
                  <div className="relative group">
                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                     <Input 
                        id="otp" 
                        placeholder="000000" 
                        maxLength={6}
                        className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus:bg-background focus:ring-2 focus:ring-primary/10 font-black tracking-[0.5em] text-center transition-all shadow-inner placeholder:text-muted-foreground/10 tabular-nums"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required 
                      />
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">New Password</Label>
                    <PasswordInput 
                      id="newPassword" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Confirm Identity</Label>
                    <PasswordInput 
                      id="confirmPassword" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-primary hover:text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/5 transition-all group mt-6"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                      <span>Saving password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Update Password</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </form>

          {!success && (
            <div className="text-center space-y-6 relative z-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                  Didn't receive the code?
                </p>
                <button 
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || loading}
                  className="font-black uppercase tracking-[0.2em] text-[10px] text-primary hover:text-primary/70 transition-all disabled:opacity-20 disabled:grayscale"
                >
                  {canResend ? 'Resend New Code' : `Wait ${timer}s to Resend`}
                </button>
              </div>

              <div className="pt-4 border-t border-border/40">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-primary transition-colors flex items-center justify-center gap-3 group">
                   <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform text-muted-foreground/20" />
                   Back to Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3 opacity-10">
             <ShieldCheck size={14} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">End-to-End Encrypted</span>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
