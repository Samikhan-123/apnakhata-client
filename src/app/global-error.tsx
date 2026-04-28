"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background flex items-center justify-center p-6">
        <ErrorState
          title="System Failure"
          message="A critical error occurred while loading the application shell. Please try again or contact support."
          onRetry={reset}
          className="max-w-md w-full"
        />
      </body>
    </html>
  );
}
