'use client';

import React from 'react';
import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 py-20 bg-muted/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 transform hover:rotate-12 transition-transform drop-shadow-xl">
              <img src="/icon1.png" alt="Apna Khata" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground">Apna <span className="text-primary">Khata</span></span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
             <Link href="/manifesto" className="hover:text-primary cursor-pointer transition-colors">Manifesto</Link>
             <Link href="/contact" className="hover:text-primary cursor-pointer transition-colors">Contact</Link>
             <Link href="/terms" className="hover:text-primary cursor-pointer transition-colors">Terms</Link>
             <Link href="/privacy" className="hover:text-primary cursor-pointer transition-colors">Privacy</Link>
          </div>
        </div>
        
        <div className="mt-16 text-center">
           <p className="text-muted-foreground/20 font-bold text-xs uppercase tracking-widest">
             &copy; {new Date().getFullYear()} Apna Khata. Built with heart for human beings.
           </p>
        </div>
      </div>
    </footer>
  );
}
