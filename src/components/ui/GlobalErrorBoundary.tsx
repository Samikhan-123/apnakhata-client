'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home, Send } from 'lucide-react';
import * as Sentry from "@sentry/nextjs";
import { ErrorState } from './ErrorState';

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
    Sentry.captureException(error, { extra: { errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
          <ErrorState 
            title="Unexpected Error"
            message="An unexpected code error occurred. Don't worry, your data is safe. We've been notified and are looking into it."
            onRetry={() => window.location.reload()}
            className="max-w-md w-full"
          >
            {/* Additional Actions for Error Boundary */}
            <div className="flex flex-col gap-3 w-full mt-4">
              <Button 
                variant="outline"
                onClick={() => Sentry.showReportDialog()}
                className="h-12 rounded-2xl border-primary/10 font-bold text-xs text-primary hover:bg-primary/5 transition-all gap-2"
              >
                <Send size={14} />
                Report Issue
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'}
                className="h-12 rounded-2xl font-bold text-xs text-muted-foreground/50 hover:text-primary transition-all gap-2"
              >
                <Home size={14} />
                Back to Dashboard
              </Button>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-left overflow-auto max-h-40">
                  <p className="text-[10px] font-mono text-rose-500 font-bold break-all">
                    {this.state.error?.message}
                  </p>
                </div>
              )}
            </div>
          </ErrorState>
        </div>
      );
    }

    return this.props.children;
  }
}
