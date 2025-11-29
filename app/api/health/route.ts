import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.1.0'
  })
}
