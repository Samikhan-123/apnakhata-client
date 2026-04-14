"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { cn } from '@/lib/utils'
import { FadeIn, HeightChange } from '@/components/ui/FramerMotion'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyEmail, resendOTP, user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendSuccess, setResendSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (authLoading) return;

    // Direct redirect if already verified
    if (user?.isVerified) {
      router.replace('/dashboard')
      return;
    }

    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else if (user?.email) {
      // Use email from AuthContext if available
      setEmail(user.email)
    } else {
      // If no email in URL AND no user in context, redirect back to login (safer than register)
      router.replace('/login')
    }
  }, [searchParams, router, user, authLoading])

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
    if (otp.length !== 6) {
      setError('Please enter the 6-digit safety code sent to your email.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await verifyEmail(email, otp)
      setSuccess('Email verified successfully! Redirecting...')
      // Navigation is handled in AuthContext after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setLoading(true)
    setError('')
    setResendSuccess('')
    try {
      await resendOTP(email)
      setResendSuccess('A new safety code has been sent to your inbox.')
      setTimer(60)
      setCanResend(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <PublicHeader />

      <div className="flex items-center justify-center min-h-screen pt-20 px-4 md:px-6">
        <FadeIn
          className="w-full max-w-xl premium-card rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-20 border-border/40 shadow-2xl shadow-primary/5 relative overflow-hidden"
        >
          {/* Background Accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />
          
          <div className="flex flex-col items-center text-center mb-8 md:mb-14 relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 mb-6 md:mb-10 animate-bounce-slow">
              <Mail className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-4">Check your mail</h1>
            <p className="text-muted-foreground font-bold text-base md:text-lg max-w-xs mx-auto leading-relaxed">
              We've sent a 6-digit security code to <span className="text-primary italic">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 relative z-10">
             <HeightChange isVisible={!!error || !!success || !!resendSuccess}>
                <div className="mb-8">
                  {error && (
                    <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-xs font-bold flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <p>{success}</p>
                    </div>
                  )}
                  {resendSuccess && (
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-xs font-bold flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 shrink-0 animate-spin-slow" />
                      <p>{resendSuccess}</p>
                    </div>
                  )}
                </div>
             </HeightChange>

            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">Safety Code</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="h-24 text-center text-4xl font-black tracking-[0.4em] rounded-[2.5rem] bg-muted/30 border-none focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all shadow-inner placeholder:text-muted-foreground/10 tabular-nums"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-20 rounded-[2rem] bg-foreground text-background hover:bg-primary hover:text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/5 hover:scale-[1.02] active:scale-95 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Verify Identity</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>

          <div className="mt-14 pt-10 border-t border-border/40 flex flex-col items-center gap-8 text-center relative z-10">
              <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                Didn't get the code?
              </p>
              
              <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-xl bg-primary/5 text-primary/60 text-[10px] font-bold animate-in fade-in slide-in-from-bottom-1 duration-700">
                <AlertCircle className="h-3 w-3" />
                <span>Tip: If you don't see it, check your **Spam** folder</span>
              </div>

              <button
                onClick={handleResend}
                disabled={!canResend || loading}
                className={cn(
                  "text-xs font-black uppercase tracking-[0.3em] transition-all",
                  canResend ? "text-primary hover:text-primary/70" : "text-muted-foreground/20 cursor-not-allowed"
                )}
              >
                {canResend ? "Resend New Code" : `Resetting in ${timer}s`}
              </button>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 hover:text-primary transition-colors flex items-center gap-3 group"
            >
              <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>

          <div className="mt-12 flex items-center justify-center gap-3 opacity-10">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Encrypted Verification</span>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
