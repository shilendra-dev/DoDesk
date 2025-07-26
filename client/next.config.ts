import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Add environment variables validation
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};

export default nextConfig;