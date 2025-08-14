// middleware.ts
import { NextResponse, NextRequest } from "next/server";

// ---- Allowed origins (production + preview + local dev) ----
const PROD_ORIGINS = new Set([
  "https://plannosaur.com",
  "https://www.plannosaur.com",
]);

function buildAllowedOrigins() {
  const origins = new Set(PROD_ORIGINS);
  const vercelUrl = process.env.VERCEL_URL; // e.g. my-app-abc123.vercel.app
  const env = process.env.VERCEL_ENV; // "production" | "preview" | "development"

  if (env !== "production" && vercelUrl) {
    origins.add(`https://${vercelUrl}`);
  }
  // local dev
  origins.add("http://localhost:3000");
  return origins;
}

const ALLOWED_ORIGINS = buildAllowedOrigins();

// ---- Helpers ----
function corsResponse(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin); // echo back
  }
  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Turnstile-Token");
  return res;
}

// ---- Optional: Upstash rate limit (uncomment and install to enable) ----
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
// const redis = Redis.fromEnv();
// const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m") });

export const config = {
  // Apply only to the waitlist endpoint
  matcher: ["/api/waitlist"],
};

export async function middleware(req: NextRequest) {
  const { method, nextUrl } = req;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return corsResponse(req, new NextResponse(null, { status: 204 }));
  }

  // Allow only POST
  if (method !== "POST") {
    return corsResponse(
      req,
      NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
    );
  }

  // Enforce origin (defense-in-depth beyond header config)
  const origin = req.headers.get("origin") ?? "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    // Generic response (no enumeration, no hints)
    return corsResponse(req, new NextResponse(null, { status: 204 }));
  }

  // ---- Optional: enable Upstash rate limit ----
  // const ip =
  //   req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  //   req.ip ??
  //   "unknown";
  // const { success } = await limiter.limit(`waitlist:${ip}`);
  // if (!success) {
  //   return corsResponse(req, new NextResponse(null, { status: 204 }));
  // }

  // Continue to the route handler
  return corsResponse(req, NextResponse.next());
}
