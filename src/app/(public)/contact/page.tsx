'use client';

import React, { useState, useEffect } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Mail, MessageSquare, Send, Globe, Share2, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { supportService, SupportContactInput } from '@/services/support.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FadeIn, HeightChange } from '@/components/ui/FramerMotion';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(['BUG', 'FEEDBACK', 'HELP', 'OTHER']),
  message: z.string().min(10, 'Please describe your request in more detail (min 10 chars)').max(2000),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { user, isImpersonating } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: 'HELP',
    }
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    if (isImpersonating) {
      toast.error('Cannot send support requests during impersonation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const clientTimestamp = new Date().toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'medium',
        hour12: true,
      });
      await supportService.sendContactMessage({ ...data, clientTimestamp } as SupportContactInput);
      setIsSuccess(true);
      toast.success('Message sent! We will get back to you soon.');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <PublicHeader />
        <FadeIn className="max-w-md space-y-8">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-10 border border-primary/20">
            <CheckCircle2 size={48} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Message <span className="text-primary italic">Received.</span></h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Your request has been dispatched to the Apna Khata team. One of our team members will review it and get back to you via email.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="h-14 px-10 rounded-2xl border-border/60 font-bold uppercase tracking-widest text-[10px]"
          >
            Send Another Message
          </Button>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Side: Info & Branding */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Support Sanctuary</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
                Reach <br />
                <span className="text-primary italic">Out.</span>
              </h1>
              <p className="text-muted-foreground text-lg font-bold max-w-sm leading-relaxed">
                Whether you've found a bug, have a feature idea, or need help with your account, our team is ready to assist.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-muted/30 border border-border/40">
                <div className="mt-1 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-50 mb-1">Direct Email</p>
                   <p className="text-sm font-bold text-foreground">isamikhan.dev@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-muted/30 border border-border/40">
                <div className="mt-1 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Share2 size={20} />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-50 mb-1">Developer</p>
                   <p className="text-sm font-bold text-foreground">@samikhan_dev</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <FadeIn className="lg:col-span-7">
            <div className="premium-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-border/40 shadow-2xl relative overflow-hidden">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Full Name</Label>
                    <Input 
                      placeholder="Your Name"
                      className="h-14 rounded-2xl bg-muted/30 border-none font-bold placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary/10"
                      {...register('name')}
                      disabled={isSubmitting || !!user}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Email Address</Label>
                    <Input 
                      placeholder="name@example.com"
                      className="h-14 rounded-2xl bg-muted/30 border-none font-bold placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary/10"
                      {...register('email')}
                      disabled={isSubmitting || !!user}
                    />
                    {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Subject</Label>
                  <select 
                    className="w-full h-14 rounded-2xl bg-muted/30 border-none px-4 font-bold text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
                    {...register('subject')}
                    disabled={isSubmitting}
                  >
                    <option value="HELP">General Help</option>
                    <option value="BUG">Bug Report</option>
                    <option value="FEEDBACK">Feature Request / Feedback</option>
                    <option value="OTHER">Other Query</option>
                  </select>
                  {errors.subject && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Message</Label>
                  <Textarea 
                    placeholder="How can we help you today?"
                    className="min-h-[160px] rounded-2xl bg-muted/30 border-none font-bold placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary/10 p-5 leading-relaxed"
                    {...register('message')}
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center gap-3 overflow-hidden group shadow-xl shadow-primary/5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                      <span>Dispatching Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                       <span>Send Support Request</span>
                       <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
