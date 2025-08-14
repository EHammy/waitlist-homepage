// src/app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Add OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
    },
  })
}

const waitlistSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .max(254),
  source: z.string()
    .optional()
    .default('homepage')
    .transform(val => val?.replace(/[<>]/g, '').slice(0, 50)),
  utmSource: z.string().optional().transform(val => val?.slice(0, 100)),
  utmMedium: z.string().optional().transform(val => val?.slice(0, 100)),
  utmCampaign: z.string().optional().transform(val => val?.slice(0, 100))
})

// Simple in-memory rate limiting (for basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 5

  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    if (!checkRateLimit(ipAddress)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)

    // Get request metadata
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || null
    const referrer = request.headers.get('referer')?.slice(0, 500) || null

    // Check if email already exists
    const existing = await prisma.waitlist_signups.findUnique({
      where: { email: validatedData.email }
    })

    if (existing) {
      return NextResponse.json(
        { 
          message: 'You\'re already on the waitlist! We\'ll notify you when we launch.',
          alreadyExists: true 
        },
        { status: 200 }
      )
    }

    // Add to waitlist
    const signup = await prisma.waitlist_signups.create({
      data: {
        email: validatedData.email,
        source: validatedData.source,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer,
        utm_source: validatedData.utmSource,
        utm_medium: validatedData.utmMedium,
        utm_campaign: validatedData.utmCampaign,
      }
    })

    const response = NextResponse.json(
      { 
        message: 'Successfully joined the waitlist! We\'ll notify you when Plannosaur launches.',
        id: signup.id
      },
      { status: 201 }
    )

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    return response

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fix the admin key check - make it optional for now
    const adminKey = request.headers.get('x-admin-key')
    const expectedAdminKey = process.env.ADMIN_API_KEY
    
    // Only check admin key if it exists in environment
    if (expectedAdminKey && adminKey !== expectedAdminKey) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    
    // If no admin key is set, return a simple status message
    if (!expectedAdminKey) {
      return NextResponse.json({ 
        message: 'Waitlist API is running',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))

    const [signups, total] = await Promise.all([
      prisma.waitlist_signups.findMany({
        orderBy: { created_at: 'desc' },
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
        }
      }),
      prisma.waitlist_signups.count()
    ])

    return NextResponse.json({
      signups,
      total,
      page,
      pages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Error in GET /api/waitlist:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
