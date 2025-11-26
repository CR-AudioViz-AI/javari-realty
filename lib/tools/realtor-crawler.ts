// lib/tools/realtor-crawler.ts
// Automated Realtor Website Crawler & Demo Generator
// Crawls any realtor website and extracts data to generate instant demos

import { createClient } from '@supabase/supabase-js'

export interface RealtorProfile {
  name: string
  title: string
  phone: string
  email: string
  photo?: string
  bio: string
  specialties: string[]
  markets: string[]
  education?: string
  experience?: string
  licenseNumber?: string
}

export interface BrokerageInfo {
  name: string
  logo?: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  state: string
  zip: string
  tagline?: string
  mlsLicense?: string
}

export interface PropertyListing {
  mls?: string
  title: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  type: 'residential_sale' | 'residential_rent' | 'commercial_sale' | 'commercial_rent' | 'industrial_sale' | 'industrial_rent'
  category: string
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  lotSize?: number
  yearBuilt?: number
  description: string
  features: string[]
  images: string[]
  status: 'active' | 'pending' | 'sold'
  daysOnMarket?: number
}

export interface CrawlResult {
  brokerage: BrokerageInfo
  agents: RealtorProfile[]
  properties: PropertyListing[]
  story?: string
  markets: string[]
  propertyTypes: string[]
  crawledAt: string
  sourceUrl: string
}

export interface DemoConfig {
  slug: string
  brokerageId: string
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
  features: {
    javariAI: boolean
    leadCapture: boolean
    propertySearch: boolean
    virtualTours: boolean
    mortgageCalculator: boolean
    marketAnalytics: boolean
  }
  credentials: {
    adminEmail: string
    adminPassword: string
    agentEmails: string[]
  }
}

// Color extraction from brand
export function extractBrandColors(logoUrl?: string): { primary: string; secondary: string; accent: string } {
  // Default professional colors if no logo
  return {
    primary: '#1e40af',    // Blue
    secondary: '#3b82f6',  // Light blue
    accent: '#10b981'      // Emerald
  }
}

// Generate slug from brokerage name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}

// Generate demo credentials
export function generateDemoCredentials(brokerage: BrokerageInfo, agents: RealtorProfile[]): DemoConfig['credentials'] {
  const slug = generateSlug(brokerage.name)
  
  return {
    adminEmail: `demo-admin@${slug}.cr-realtor.com`,
    adminPassword: `Demo${new Date().getFullYear()}!`,
    agentEmails: agents.map(agent => 
      `demo-${agent.name.toLowerCase().replace(/\s+/g, '-')}@${slug}.cr-realtor.com`
    )
  }
}

// Generate complete demo configuration
export function generateDemoConfig(crawlResult: CrawlResult): DemoConfig {
  const slug = generateSlug(crawlResult.brokerage.name)
  const colors = extractBrandColors(crawlResult.brokerage.logo)
  const credentials = generateDemoCredentials(crawlResult.brokerage, crawlResult.agents)
  
  return {
    slug,
    brokerageId: `demo-${slug}-${Date.now()}`,
    theme: {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent
    },
    features: {
      javariAI: true,
      leadCapture: true,
      propertySearch: true,
      virtualTours: true,
      mortgageCalculator: true,
      marketAnalytics: true
    },
    credentials
  }
}

// Parse price from string
export function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^0-9.]/g, '')
  return parseFloat(cleaned) || 0
}

// Detect property type from text
export function detectPropertyType(text: string): PropertyListing['type'] {
  const lower = text.toLowerCase()
  
  if (lower.includes('industrial') || lower.includes('warehouse') || lower.includes('manufacturing')) {
    return lower.includes('lease') || lower.includes('rent') ? 'industrial_rent' : 'industrial_sale'
  }
  
  if (lower.includes('commercial') || lower.includes('retail') || lower.includes('office')) {
    return lower.includes('lease') || lower.includes('rent') ? 'commercial_rent' : 'commercial_sale'
  }
  
  if (lower.includes('rent') || lower.includes('lease') || lower.includes('/mo')) {
    return 'residential_rent'
  }
  
  return 'residential_sale'
}

// Extract markets from text
export function extractMarkets(text: string): string[] {
  const floridaCities = [
    'Naples', 'Fort Myers', 'Bonita Springs', 'Cape Coral', 'Lehigh Acres',
    'Marco Island', 'Estero', 'Sanibel', 'Fort Myers Beach', 'Golden Gate',
    'Ave Maria', 'Immokalee', 'Everglades City', 'Chokoloskee'
  ]
  
  const found: string[] = []
  const lower = text.toLowerCase()
  
  for (const city of floridaCities) {
    if (lower.includes(city.toLowerCase())) {
      found.push(city)
    }
  }
  
  return [...new Set(found)]
}

// Main export for demo generation
export async function createDemoFromCrawl(crawlResult: CrawlResult): Promise<{
  config: DemoConfig
  demoUrl: string
  credentials: DemoConfig['credentials']
}> {
  const config = generateDemoConfig(crawlResult)
  
  return {
    config,
    demoUrl: `/demo/${config.slug}`,
    credentials: config.credentials
  }
}
