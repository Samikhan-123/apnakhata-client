import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.02, // Lowered to 2% to save quota
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false, // Don't mask images/videos
    }),
  ],
});
