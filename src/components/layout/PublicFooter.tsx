"use client";

import React from "react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 py-16 md:py-24 bg-muted/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 transform hover:rotate-12 transition-transform drop-shadow-xl">
              <img
                src="/icon1.png"
                alt="Apna Khata"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
              APNA <span className="text-primary">KHATA</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
            <Link
              href="/guide"
              className="hover:text-primary transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/manifesto"
              className="hover:text-primary transition-colors"
            >
              Manifesto
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/5 text-center">
          <p className="text-muted-foreground/30 font-bold text-[10px] uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Apna Khata. Built with care for human simplicity.
          </p>
        </div>
      </div>
    </footer>
  );
}
