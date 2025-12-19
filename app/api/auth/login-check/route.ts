import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

/**
 * API Route pour vérifier le rate limit avant le login
 * Appelée côté client avant de soumettre le formulaire
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer l'IP du client (Vercel Edge)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded ? forwarded.split(',')[0] : (realIp || 'unknown')

    // Vérifier le rate limit: 5 tentatives max toutes les 15 minutes
    const { limited, remaining, resetTime } = checkRateLimit(
      `login:${ip}`,
      5,
      15 * 60 * 1000
    )

    if (limited) {
      const minutesLeft = Math.ceil((resetTime - Date.now()) / 60000)
      return NextResponse.json(
        {
          error: 'Trop de tentatives de connexion',
          message: `Veuillez réessayer dans ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`,
          retryAfter: resetTime,
        },
        { status: 429 }
      )
    }

    return NextResponse.json({
      allowed: true,
      remaining,
      resetTime,
    })
  } catch (error) {
    console.error('Rate limit check error:', error)
    // En cas d'erreur, autoriser la tentative (fail-open)
    return NextResponse.json({ allowed: true })
  }
}
