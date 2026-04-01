'use client';

import React from 'react';
import { Mail, MessageCircle, Globe, Code } from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-20">
      <header className="text-center space-y-4">
        <SlideIn duration={0.5}>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Get In Touch</p>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter">Talk to <span className="text-primary italic">Us.</span></h1>
          <p className="text-muted-foreground font-bold text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            Have a question, feedback, or just want to say hi? We'd love to hear from you.
          </p>
        </SlideIn>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FadeIn delay={0.2}>
          <div className="premium-card p-12 rounded-[3.5rem] border-primary/10 h-full flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                <Mail size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight mb-2">Email Support</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">The fastest way to get help with account issues or technical questions.</p>
              </div>
            </div>
            <a href="mailto:support@apnakhata.com" className="block mt-8">
               <Button className="w-full h-14 rounded-2xl bg-foreground text-background font-black hover:bg-primary hover:text-white transition-all shadow-2xl">
                 support@apnakhata.com
               </Button>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="premium-card p-12 rounded-[3.5rem] border-border/40 h-full flex flex-col justify-between group bg-muted/10">
             <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center border border-border/40 text-primary shadow-sm">
                    <MessageCircle size={24} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Social Connect</h4>
               </div>
               
               <div className="space-y-2">
                 {[
                   { name: 'Twitter', icon: Globe, link: '#' },
                   { name: 'GitHub', icon: Code, link: '#' }
                 ].map((social, i) => (
                   <a key={i} href={social.link} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/10 hover:border-primary/20 transition-all group/link">
                      <div className="flex items-center gap-3">
                         <social.icon size={18} className="text-muted-foreground group-hover/link:text-primary transition-colors" />
                         <span className="font-bold text-sm">{social.name}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-widest group-hover/link:text-primary transition-colors">Follow</span>
                   </a>
                 ))}
               </div>
             </div>

             <div className="mt-12 bg-primary/5 p-6 rounded-3xl border border-primary/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Average Response Time</p>
                <p className="text-2xl font-black tracking-tighter text-foreground">Under 24h</p>
             </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
