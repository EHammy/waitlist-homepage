// next.config.ts
import type { NextConfig } from "next";

// Domains allowed to call your API (prod) + any preview URLs in non-prod
const PROD_ORIGINS = ["https://plannosaur.com", "https://www.plannosaur.com"];

const isProd = process.env.VERCEL_ENV === "production";
const allowOrigins = isProd
  ? PROD_ORIGINS
  // In preview/dev, allow current deployment URL so forms work on previews.
  : [...PROD_ORIGINS, `https://${process.env.VERCEL_URL ?? ""}`].filter(Boolean);

const corsHeader = [
  { key: "Access-Control-Allow-Origin", value: allowOrigins.join(",") }, // multiple allowed origins
  { key: "Vary", value: "Origin" },
  { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, X-Turnstile-Token" }, // include your anti-bot header if you add it
];

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Very relaxed CSP starter (adjust as you add 3P scripts)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app *.plannosaur.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:;",
      "font-src 'self' data:",
      "connect-src 'self' https://plannosaur.com https://www.plannosaur.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "plannosaur.com" },
      { protocol: "https", hostname: "*.plannosaur.com" },
    ],
  },

  async redirects() {
    return [
      { source: "/app", destination: "/", permanent: false },
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/account", destination: "/", permanent: false },
      { source: "/login", destination: "/", permanent: false },
      { source: "/signup", destination: "/", permanent: false },
      { source: "/quiz", destination: "/", permanent: false },
      { source: "/products", destination: "/", permanent: false },
      { source: "/cart", destination: "/", permanent: false },
      { source: "/checkout", destination: "/", permanent: false },
    ];
  },

  async headers() {
    return [
      // Global security headers for all pages/assets
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Tight CORS for API routes
      {
        source: "/api/:path*",
        headers: corsHeader,
      },
    ];
  },
};

export default nextConfig;
