// app/api/demo/generate/route.ts
// API endpoint to generate realtor demos from crawled data
// POST: Creates a new demo site from website URL or manual data

import { NextRequest, NextResponse } from 'next/server'

// Demo generation response type
interface DemoGenerationResponse {
  success: boolean
  demoId: string
  demoUrl: string
  previewUrl: string
  credentials: {
    admin: { email: string; password: string }
    agents: Array<{ name: string; email: string; password: string }>
  }
  summary: {
    brokerage: string
    agentCount: number
    propertyCount: number
    markets: string[]
    propertyTypes: string[]
  }
  createdAt: string
}

// Simulated demo data storage (would be Supabase in production)
const demoStorage = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      websiteUrl,
      brokerage,
      agents,
      properties,
      customizations
    } = body

    // Validate required fields
    if (!brokerage?.name) {
      return NextResponse.json(
        { error: 'Brokerage name is required' },
        { status: 400 }
      )
    }

    // Generate unique demo ID
    const slug = brokerage.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    const demoId = `demo-${slug}-${Date.now()}`
    const timestamp = new Date().toISOString()

    // Generate credentials
    const adminEmail = `admin@${slug}.demo.cr-realtor.com`
    const adminPassword = `Demo${new Date().getFullYear()}!Admin`
    
    const agentCredentials = (agents || []).map((agent: any) => ({
      name: agent.name,
      email: `${agent.name.toLowerCase().replace(/\s+/g, '.')}@${slug}.demo.cr-realtor.com`,
      password: `Demo${new Date().getFullYear()}!Agent`
    }))

    // Store demo configuration
    const demoConfig = {
      id: demoId,
      slug,
      brokerage: {
        ...brokerage,
        id: `brokerage-${demoId}`
      },
      agents: agents || [],
      properties: properties || [],
      theme: customizations?.theme || {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#10b981'
      },
      features: {
        javariAI: true,
        leadCapture: true,
        propertySearch: true,
        virtualTours: true,
        mortgageCalculator: true,
        marketAnalytics: true,
        ...customizations?.features
      },
      credentials: {
        admin: { email: adminEmail, password: adminPassword },
        agents: agentCredentials
      },
      sourceUrl: websiteUrl,
      createdAt: timestamp,
      status: 'active'
    }

    // Store in memory (would be Supabase in production)
    demoStorage.set(demoId, demoConfig)

    // Extract unique markets and property types
    const markets = [...new Set((properties || []).map((p: any) => p.city).filter(Boolean))]
    const propertyTypes = [...new Set((properties || []).map((p: any) => p.type).filter(Boolean))]

    const response: DemoGenerationResponse = {
      success: true,
      demoId,
      demoUrl: `/demo/${slug}`,
      previewUrl: `https://cr-realtor-platform.vercel.app/demo/${slug}`,
      credentials: {
        admin: { email: adminEmail, password: adminPassword },
        agents: agentCredentials
      },
      summary: {
        brokerage: brokerage.name,
        agentCount: (agents || []).length,
        propertyCount: (properties || []).length,
        markets,
        propertyTypes
      },
      createdAt: timestamp
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Demo generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate demo', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const demoId = searchParams.get('id')

  if (demoId) {
    const demo = demoStorage.get(demoId)
    if (demo) {
      return NextResponse.json(demo)
    }
    return NextResponse.json({ error: 'Demo not found' }, { status: 404 })
  }

  // Return list of all demos
  const demos = Array.from(demoStorage.values())
  return NextResponse.json({ demos, count: demos.length })
}
