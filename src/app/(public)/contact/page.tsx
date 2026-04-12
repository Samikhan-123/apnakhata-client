'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Mail, MessageSquare, Send, Globe, Share2, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-8 mb-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Reach <span className="text-primary italic">Out.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-bold max-w-2xl mx-auto leading-relaxed">
              Apna Khata is built on user feedback. Whether you have a question, a feature request, or just want to discuss your financial journey, we are all ears.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-muted/30 p-12 rounded-[2.5rem] border border-border/40 hover:bg-muted/40 transition-colors group">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                <Mail size={28} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4">Direct Support</h3>
              <p className="text-muted-foreground font-bold text-sm mb-8 leading-relaxed">
                Reach out to me directly for support, feedback, or any technical queries.
              </p>
              <a href="mailto:samikhan7816@gmail.com" >
                samikhan7816@gmail.com
              </a>
            </div>

            <div className="bg-primary p-12 rounded-[2.5rem] border border-primary text-primary-foreground hover:scale-[1.02] transition-all group">
              <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center mb-10 shadow-lg transition-transform group-hover:-rotate-12">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4">Community</h3>
              <p className="text-white/60 font-bold text-sm mb-8 leading-relaxed">
                Join our Discord community. Network with other financial masters and share feedback.
              </p>
              <div className="text-xl font-black opacity-50 cursor-not-allowed">
                Discord (Coming Soon)
              </div>
            </div>

            <div className="bg-card p-12 rounded-[2.5rem] border border-border/40 hover:bg-muted/10 transition-colors col-span-1 md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div>
                <h4 className="text-xl font-black tracking-tight mb-2">Technical Headquarters</h4>
                <p className="text-muted-foreground font-bold text-sm">Design & Engineering by Sami Khan.</p>
              </div>
              <div className="flex gap-10">
                <div className="flex items-center gap-3">
                  <Share2 size={20} className="text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest opacity-40">@samikhan_dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest opacity-40">Identity Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
