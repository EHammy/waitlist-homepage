/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Next.js uses the app directory inside src
  experimental: {
    appDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plannosaur.com',
      },
      {
        protocol: 'https',
        hostname: '*.plannosaur.com',
      }
    ],
  },

  async redirects() {
    return [
      // Redirect common app paths to waitlist
      { source: '/app', destination: '/', permanent: false },
      { source: '/dashboard', destination: '/', permanent: false },
      { source: '/account', destination: '/', permanent: false },
      { source: '/login', destination: '/', permanent: false },
      { source: '/signup', destination: '/', permanent: false },
      { source: '/quiz', destination: '/', permanent: false },
      { source: '/products', destination: '/', permanent: false },
      { source: '/cart', destination: '/', permanent: false },
      { source: '/checkout', destination: '/', permanent: false }
    ]
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Temporary - allows all domains
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
};

export default nextConfig;
