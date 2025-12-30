import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * Keep-alive endpoint pour Neon DB
 * Empêche la base de se mettre en sleep (auto-suspend après 5min sur Free Plan)
 */
export async function GET() {
  try {
    // Simple ping DB pour la garder active
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Database is alive'
    })
  } catch (error) {
    console.error('Keep-alive ping failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database ping failed'
      },
      { status: 500 }
    )
  }
}
