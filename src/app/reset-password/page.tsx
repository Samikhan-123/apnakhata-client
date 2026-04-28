"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Key,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FadeIn, HeightChange } from "@/components/ui/FramerMotion";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword, forgotPassword } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const email = watch("email");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setValue("email", emailParam);

    const otpParam = searchParams.get("otp");
    if (otpParam) setValue("otp", otpParam);
  }, [searchParams, setValue]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        password: data.password,
      });
      setSuccess(
        "Your password has been securely reset. Redirecting to login...",
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const responseData = err.response?.data;
      let message =
        responseData?.message || "The code is invalid or has expired.";

      if (
        responseData?.errors &&
        Array.isArray(responseData.errors) &&
        responseData.errors.length > 0
      ) {
        message = responseData.errors[0].message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    setLoading(true);
    setError("");
    setResendSuccess("");
    try {
      await forgotPassword(email);
      setResendSuccess("A new recovery code has been sent to your email.");
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <PublicHeader />

      <div className="flex items-center justify-center min-h-screen pt-20 px-4 md:px-6">
        <FadeIn className="w-full max-w-md flex flex-col gap-6 md:gap-10 premium-card p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 py-8 md:py-12 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-[50px]" />

          <div className="space-y-4 text-center relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-4 md:mb-8 border border-primary/10">
              <LockKeyhole className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground font-bold">
              Set new password
            </h2>
            <p className="text-muted-foreground font-bold text-sm md:text-base leading-snug max-w-[280px] mx-auto">
              Confirm your identity with the recovery code and secure your
              account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            <HeightChange isVisible={!!error || !!success || !!resendSuccess}>
              <div className="mb-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-[10px] font-black uppercase flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {success}
                  </div>
                )}
                {resendSuccess && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {resendSuccess}
                  </div>
                )}
              </div>
            </HeightChange>

            {!success && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1"
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@email.com"
                      {...register("email")}
                      className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus:bg-background focus:ring-2 focus:ring-primary/10 font-bold transition-all shadow-inner"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] font-black uppercase text-rose-500 ml-1 leading-none">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="otp"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1"
                  >
                    6-Digit recovery code
                  </Label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="otp"
                      placeholder="000000"
                      maxLength={6}
                      {...register("otp")}
                      className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus:bg-background focus:ring-2 focus:ring-primary/10 font-black tracking-[0.5em] text-center transition-all shadow-inner"
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-[10px] font-black uppercase text-rose-500 ml-1 leading-none">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-5">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="password"
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1"
                    >
                      New Password
                    </Label>
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-[9px] font-bold text-rose-500 ml-1 leading-tight">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1"
                    >
                      Confirm Identity
                    </Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-[9px] font-bold text-rose-500 ml-1 leading-tight">
                        {errors.confirmPassword.message}
                      </p>
                    )}
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
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Update Password</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </form>

          {!success && (
            <div className="text-center space-y-6 relative z-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 font-bold">
                  Didn't receive the code?
                </p>

                <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-xl bg-primary/5 text-primary/60 text-[10px] font-bold animate-in fade-in slide-in-from-bottom-1 duration-700">
                  <ShieldCheck size={12} className="opacity-50" />
                  <span>Tip: Check your **Spam** folder if not in Inbox</span>
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || loading}
                  className="font-black uppercase tracking-[0.2em] text-[10px] text-primary hover:text-primary/70 transition-all disabled:opacity-20 disabled:grayscale"
                >
                  {canResend ? "Resend New Code" : `Wait ${timer}s to Resend`}
                </button>
              </div>

              <div className="pt-4 border-t border-border/40">
                <Link
                  href="/login"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-primary transition-colors flex items-center justify-center gap-3 group font-bold"
                >
                  <ArrowRight
                    size={12}
                    className="rotate-180 group-hover:-translate-x-1 transition-transform text-muted-foreground/20"
                  />
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3 opacity-10">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground font-bold">
              End-to-End Encrypted
            </span>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
