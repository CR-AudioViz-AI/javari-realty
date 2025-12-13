import { NextResponse } from 'next/server'

// FRED API series IDs for mortgage rates
const FRED_30_YEAR = 'MORTGAGE30US'
const FRED_15_YEAR = 'MORTGAGE15US'
const FRED_API_KEY = process.env.FRED_API_KEY || 'demo' // Free API key available at fred.stlouisfed.org

interface FREDObservation {
  date: string
  value: string
}

interface FREDResponse {
  observations: FREDObservation[]
}

async function fetchFREDRate(series: string): Promise<number | null> {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error(`FRED API error for ${series}:`, response.status)
      return null
    }
    
    const data: FREDResponse = await response.json()
    
    if (data.observations && data.observations.length > 0) {
      const value = parseFloat(data.observations[0].value)
      return isNaN(value) ? null : value
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching ${series}:`, error)
    return null
  }
}

export async function GET() {
  try {
    // Fetch both rates in parallel
    const [rate30, rate15] = await Promise.all([
      fetchFREDRate(FRED_30_YEAR),
      fetchFREDRate(FRED_15_YEAR),
    ])

    // If FRED fails, use reasonable defaults based on current market
    const response = {
      rate30: rate30 ?? 6.75,
      rate15: rate15 ?? 6.0,
      source: rate30 ? 'FRED' : 'default',
      lastUpdated: new Date().toISOString(),
      disclaimer: 'Rates are national averages and may vary. Contact a lender for exact rates.',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Mortgage rates API error:', error)
    
    // Return defaults on error
    return NextResponse.json({
      rate30: 6.75,
      rate15: 6.0,
      source: 'default',
      lastUpdated: new Date().toISOString(),
      error: 'Unable to fetch live rates',
    })
  }
}
