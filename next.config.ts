import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://apnakhata-backend.vercel.app/api/:path*' 
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "apna-khata",
  project: "apnakhata-frontend",
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
