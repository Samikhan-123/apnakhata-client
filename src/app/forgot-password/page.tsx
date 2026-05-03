"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LifeBuoy,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Link from "next/link";
import { FadeIn, HeightChange } from "@/components/ui/FramerMotion";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await forgotPassword(email);
      setSuccess(
        "If that email is in our system, we've sent a 6-digit OTP code. Redirecting you...",
      );
      // Redirect to reset password after 2 seconds
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <PublicHeader />

      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4 md:px-6">
        <FadeIn className="w-full max-w-md flex flex-col gap-6 md:gap-10 bg-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-border/40 shadow-2xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
          
          <div className="space-y-4 text-center relative z-10">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 border border-primary/10">
              <LifeBuoy className="h-8 w-8 md:h-12 md:w-12 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              Lost your <br /> <span className="text-primary">password?</span>
            </h2>
            <p className="text-muted-foreground font-bold text-sm md:text-lg leading-relaxed max-w-[280px] md:max-w-none mx-auto">
              Enter your email and we'll send a code to help you get back in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <HeightChange isVisible={!!error}>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                {error}
              </div>
            </HeightChange>

            <HeightChange isVisible={!!success}>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            </HeightChange>

            {!success && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@email.com"
                      className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus:bg-background focus:ring-2 focus:ring-primary/10 font-bold transition-all shadow-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 group"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Send Code</span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  )}
                </Button>

                <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-xl bg-primary/5 text-primary/60 text-[10px] font-bold animate-in fade-in slide-in-from-bottom-1 duration-700">
                  <LifeBuoy className="h-3 w-3" />
                  <span>
                    Tip: If you don't receive it, check your **Spam** folder
                  </span>
                </div>
              </div>
            )}
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              &larr; Back to Login
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 opacity-30 grayscale pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Privacy Protection
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
