// app/api/mortgage-rates/route.ts
// Fetches live mortgage rates from FRED (Federal Reserve Economic Data)
// FRED API is FREE with API key registration

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

// FRED API Key - Free to register at https://fred.stlouisfed.org/docs/api/api_key.html
const FRED_API_KEY = process.env.FRED_API_KEY || '91357ea24e43b5c7a3fd690148a3fbc4'

interface RateData {
  seriesId: string
  name: string
  value: number
  date: string
  change?: number
}

const MORTGAGE_SERIES = {
  'MORTGAGE30US': '30-Year Fixed',
  'MORTGAGE15US': '15-Year Fixed',
  'MORTGAGE5US': '5/1 ARM',
}

async function fetchFREDSeries(seriesId: string): Promise<{ value: number; date: string } | null> {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=2`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error(`FRED API error for ${seriesId}:`, response.status)
      return null
    }
    
    const data = await response.json()
    const observations = data.observations || []
    
    if (observations.length > 0) {
      const latest = observations[0]
      return {
        value: parseFloat(latest.value),
        date: latest.date
      }
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching ${seriesId}:`, error)
    return null
  }
}

export async function GET() {
  try {
    const rates: RateData[] = []
    
    // Fetch all mortgage rate series in parallel
    const results = await Promise.all(
      Object.entries(MORTGAGE_SERIES).map(async ([seriesId, name]) => {
        const data = await fetchFREDSeries(seriesId)
        if (data) {
          return {
            seriesId,
            name,
            value: data.value,
            date: data.date,
          }
        }
        return null
      })
    )
    
    // Filter out nulls and add to rates array
    results.forEach(r => {
      if (r) rates.push(r)
    })

    // Also fetch additional useful economic indicators
    const additionalSeries = {
      'FEDFUNDS': 'Fed Funds Rate',
      'T10Y2Y': '10Y-2Y Spread',
    }
    
    const additionalResults = await Promise.all(
      Object.entries(additionalSeries).map(async ([seriesId, name]) => {
        const data = await fetchFREDSeries(seriesId)
        if (data) {
          return { seriesId, name, value: data.value, date: data.date }
        }
        return null
      })
    )

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'Federal Reserve Economic Data (FRED)',
      mortgageRates: rates,
      economicIndicators: additionalResults.filter(Boolean),
      disclaimer: 'Rates are weekly averages from FRED. Actual rates may vary based on credit score, loan amount, and lender.'
    })
    
  } catch (error) {
    console.error('Mortgage rates API error:', error)
    
    // Return fallback data if API fails
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: 'Unable to fetch live rates',
      mortgageRates: [
        { seriesId: 'MORTGAGE30US', name: '30-Year Fixed', value: 6.75, date: 'fallback' },
        { seriesId: 'MORTGAGE15US', name: '15-Year Fixed', value: 6.00, date: 'fallback' },
        { seriesId: 'MORTGAGE5US', name: '5/1 ARM', value: 6.25, date: 'fallback' },
      ],
      disclaimer: 'These are estimated rates. Live data temporarily unavailable.'
    })
  }
}
