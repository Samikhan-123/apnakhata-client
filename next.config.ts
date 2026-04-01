import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://apnakhata-backend.vercel.app/api/:path*' // backend URL
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
