'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full glass-panel rounded-[3rem] p-12 text-center border-primary/10 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
              <AlertCircle size={40} className="text-rose-500" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tighter mb-4 text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground font-bold mb-10 opacity-70">
              An unexpected error occurred. Don't worry, your data is safe.
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => window.location.reload()}
                className="h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
              >
                <RefreshCcw size={14} />
                Reload Application
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'}
                className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 hover:text-primary transition-all gap-2"
              >
                <Home size={14} />
                Back to Dashboard
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50 text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-rose-500 font-bold break-all">
                  {this.state.error?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
