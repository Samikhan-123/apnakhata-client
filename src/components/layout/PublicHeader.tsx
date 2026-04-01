"use client"

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, ArrowRight, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PublicHeader() {
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 drop-shadow-xl">
            <img src="/icon1.png" alt="Apna Khata" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">
            Apna <span className="text-primary tracking-tighter">Khata</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:scale-105 font-bold transition-all shadow-lg shadow-primary/20 gap-2">
                <LayoutDashboard size={18} />
                <span>Go to Dashboard</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
               <Link href="/login">
                  <Button variant="ghost" className="h-11 px-6 rounded-xl font-bold hover:bg-primary/5 hover:text-primary transition-all">
                    Login
                  </Button>
               </Link>
               <Link href="/register">
                  <Button className="h-11 px-6 rounded-xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-bold transition-all shadow-xl shadow-foreground/5 gap-2">
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </Button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
