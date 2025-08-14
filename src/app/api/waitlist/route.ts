// src/app/api/waitlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* ---------------------------- CORS / ORIGINS ---------------------------- */

const PROD_ORIGINS = new Set<string>([
  "https://plannosaur.com",
  "https://www.plannosaur.com",
]);

function buildAllowedOrigins() {
  const origins = new Set(PROD_ORIGINS);
  const vercelUrl = process.env.VERCEL_URL;
  const env = process.env.VERCEL_ENV; // "production" | "preview" | "development"
  if (env !== "production" && vercelUrl) origins.add(`https://${vercelUrl}`);
  origins.add("http://localhost:3000");
  return origins;
}

const ALLOWED_ORIGINS = buildAllowedOrigins();

function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(origin)) {
    // Echo back the single allowed origin (required by browsers)
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Turnstile-Token, x-admin-key"
  );
  return res;
}

function withSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

/* ------------------------------- Schema -------------------------------- */

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address").max(254).transform((v) => v.trim().toLowerCase()),
  source: z
    .string()
    .optional()
    .default("homepage")
    .transform((val) => val?.replace(/[<>]/g, "").slice(0, 50)),
  utmSource: z.string().optional().transform((val) => val?.slice(0, 100)),
  utmMedium: z.string().optional().transform((val) => val?.slice(0, 100)),
  utmCampaign: z.string().optional().transform((val) => val?.slice(0, 100)),
  // Honeypot: real users never fill this
  website: z.string().max(0).optional(),
});

/* --------------------------- Basic Rate Limit --------------------------- */
// NOTE: In-memory only (per-instance). For production reliability, replace with Upstash.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;

  record.count++;
  return true;
}

/* --------------------------------- OPTIONS ------------------------------ */

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return withCors(req, res);
}

/* ---------------------------------- POST -------------------------------- */

export async function POST(request: NextRequest) {
  // Enforce allowed origins (defense-in-depth beyond CORS headers)
  const origin = request.headers.get("origin") ?? "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    const res = new NextResponse(null, { status: 204 }); // generic, no hints
    return withCors(request, withSecurityHeaders(res));
  }

  // Rate limit
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ipAddress)) {
    const res = NextResponse.json(
      { message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
    return withCors(request, withSecurityHeaders(res));
  }

  // Parse & validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const res = NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    return withCors(request, withSecurityHeaders(res));
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const res = NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    return withCors(request, withSecurityHeaders(res));
  }

  // Honeypot check (bots)
  if (parsed.data.website) {
    const res = NextResponse.json({ ok: true }, { status: 204 });
    return withCors(request, withSecurityHeaders(res));
  }

  // (Optional) Turnstile token verification
  // const token = request.headers.get("x-turnstile-token") ?? "";
  // await verifyTurnstile(token);

  const { email, source, utmSource, utmMedium, utmCampaign } = parsed.data;
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;
  const referrer = request.headers.get("referer")?.slice(0, 500) || null;

  try {
    // Upsert without leaking enumeration status in response
    await prisma.waitlist_signups.upsert({
      where: { email },
      create: {
        email,
        source,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      },
      update: {
        // Optionally refresh metadata on repeat submits
        source,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      },
    });

    const res = NextResponse.json({ ok: true }, { status: 200 });
    return withCors(request, withSecurityHeaders(res));
  } catch (err) {
    console.error("Waitlist signup error:", err);
    const res = NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
    return withCors(request, withSecurityHeaders(res));
  }
}

/* ----------------------------------- GET -------------------------------- */
// Now admin-only. Requires x-admin-key to match process.env.ADMIN_API_KEY.
// Returns 405 if no/invalid key (prevents public “healthy” info leakage).

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    const res = new NextResponse(null, { status: 204 });
    return withCors(request, withSecurityHeaders(res));
  }

  const expectedAdminKey = process.env.ADMIN_API_KEY;
  const adminKey = request.headers.get("x-admin-key") ?? "";

  if (!expectedAdminKey || adminKey !== expectedAdminKey) {
    // Do not expose health/env; simply disallow
    const res = NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    return withCors(request, withSecurityHeaders(res));
  }

  // Admin listing with pagination
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    const [signups, total] = await Promise.all([
      prisma.waitlist_signups.findMany({
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          source: true,
          created_at: true,
          utm_source: true,
          utm_medium: true,
          utm_campaign: true,
        },
      }),
      prisma.waitlist_signups.count(),
    ]);

    const res = NextResponse.json({
      signups,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
    return withCors(request, withSecurityHeaders(res));
  } catch (error) {
    console.error("Error in GET /api/waitlist:", error);
    const res = NextResponse.json({ message: "Internal server error" }, { status: 500 });
    return withCors(request, withSecurityHeaders(res));
  }
}
