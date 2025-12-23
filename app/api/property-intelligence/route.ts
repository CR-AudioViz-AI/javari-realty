// app/api/property-intelligence/route.ts
// Main API endpoint for Property Intelligence Card data
// Aggregates data from FEMA, EPA, USGS, NWS APIs

import { NextRequest, NextResponse } from 'next/server'
import { getFloodRisk, FloodRiskData } from '@/lib/apis/fema-flood'
import { getDisasterHistory, DisasterHistory } from '@/lib/apis/fema-disasters'
import { getEnvironmentalData, EnvironmentalData } from '@/lib/apis/epa-environment'
import { getEarthquakeHistory, EarthquakeData } from '@/lib/apis/usgs-earthquakes'
import { getWeatherData, WeatherData } from '@/lib/apis/nws-weather'

export interface PropertyIntelligenceRequest {
  lat: number
  lng: number
  address?: string
  toggles: string[] // Which data layers to fetch
  fipsCode?: string // For disaster history
  censusTract?: string // For demographics
}

export interface PropertyIntelligenceResponse {
  success: boolean
  data: {
    flood?: FloodRiskData
    disasters?: DisasterHistory
    environment?: EnvironmentalData
    earthquakes?: EarthquakeData
    weather?: WeatherData
  }
  propertyScore: {
    score: number
    grade: string
    summary: string
    factors: { name: string; impact: number; reason: string }[]
  }
  errors?: Record<string, string>
  queriedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PropertyIntelligenceRequest = await request.json()
    const { lat, lng, toggles = ['flood'], fipsCode } = body

    // Validate required fields
    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      )
    }

    const results: PropertyIntelligenceResponse['data'] = {}
    const errors: Record<string, string> = {}

    // Build array of promises based on requested toggles
    const fetchPromises: Promise<void>[] = []

    // Flood Risk (FEMA)
    if (toggles.includes('flood') || toggles.includes('risk') || toggles.includes('all')) {
      fetchPromises.push(
        getFloodRisk(lat, lng)
          .then(data => { results.flood = data })
          .catch(err => { errors.flood = err.message })
      )
    }

    // Disaster History (OpenFEMA)
    if ((toggles.includes('disasters') || toggles.includes('risk') || toggles.includes('all')) && fipsCode) {
      fetchPromises.push(
        getDisasterHistory(fipsCode)
          .then(data => { results.disasters = data })
          .catch(err => { errors.disasters = err.message })
      )
    }

    // Environmental Hazards (EPA)
    if (toggles.includes('environment') || toggles.includes('all')) {
      fetchPromises.push(
        getEnvironmentalData(lat, lng)
          .then(data => { results.environment = data })
          .catch(err => { errors.environment = err.message })
      )
    }

    // Earthquake History (USGS)
    if (toggles.includes('earthquakes') || toggles.includes('risk') || toggles.includes('all')) {
      fetchPromises.push(
        getEarthquakeHistory(lat, lng)
          .then(data => { results.earthquakes = data })
          .catch(err => { errors.earthquakes = err.message })
      )
    }

    // Weather & Alerts (NWS)
    if (toggles.includes('weather') || toggles.includes('all')) {
      fetchPromises.push(
        getWeatherData(lat, lng)
          .then(data => { results.weather = data })
          .catch(err => { errors.weather = err.message })
      )
    }

    // Execute all requests in parallel
    await Promise.all(fetchPromises)

    // Calculate property score
    const propertyScore = calculatePropertyScore(results)

    const response: PropertyIntelligenceResponse = {
      success: true,
      data: results,
      propertyScore,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      queriedAt: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Property Intelligence API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch property intelligence',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for simpler requests
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const toggles = searchParams.get('toggles')?.split(',') || ['flood']
  const fipsCode = searchParams.get('fips') || undefined

  if (!lat || !lng) {
    return NextResponse.json(
      { success: false, error: 'lat and lng query parameters required' },
      { status: 400 }
    )
  }

  // Forward to POST handler
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ lat, lng, toggles, fipsCode })
  })

  return POST(mockRequest)
}

function calculatePropertyScore(data: PropertyIntelligenceResponse['data']): PropertyIntelligenceResponse['propertyScore'] {
  let score = 100
  const factors: { name: string; impact: number; reason: string }[] = []

  // === FLOOD RISK ===
  if (data.flood) {
    if (data.flood.sfha) {
      // Special Flood Hazard Area - significant deduction
      score -= 20
      factors.push({
        name: 'Flood Zone',
        impact: -20,
        reason: `Property in ${data.flood.floodZone} - Special Flood Hazard Area (flood insurance required)`
      })
    } else if (data.flood.riskLevel === 'moderate') {
      score -= 5
      factors.push({
        name: 'Flood Zone',
        impact: -5,
        reason: 'Moderate flood risk zone (500-year floodplain)'
      })
    } else if (data.flood.riskLevel === 'minimal') {
      // Positive factor for minimal flood risk
      factors.push({
        name: 'Flood Zone',
        impact: 0,
        reason: `Zone ${data.flood.floodZone} - Minimal flood risk`
      })
    }
  }

  // === DISASTER HISTORY ===
  if (data.disasters) {
    const avg = data.disasters.averageDisastersPerYear
    if (avg >= 2) {
      score -= 15
      factors.push({
        name: 'Disaster History',
        impact: -15,
        reason: `High disaster frequency (${avg.toFixed(1)} events/year avg)`
      })
    } else if (avg >= 1) {
      score -= 10
      factors.push({
        name: 'Disaster History',
        impact: -10,
        reason: `Moderate disaster history (${avg.toFixed(1)} events/year)`
      })
    } else if (avg >= 0.5) {
      score -= 5
      factors.push({
        name: 'Disaster History',
        impact: -5,
        reason: `Some disaster history (${data.disasters.totalDisasters} events in ${data.disasters.yearsAnalyzed} years)`
      })
    }
  }

  // === ENVIRONMENTAL ===
  if (data.environment) {
    switch (data.environment.overallRisk) {
      case 'high':
        score -= 20
        factors.push({
          name: 'Environmental',
          impact: -20,
          reason: 'Superfund site within 0.5 miles - significant environmental concern'
        })
        break
      case 'elevated':
        score -= 10
        factors.push({
          name: 'Environmental',
          impact: -10,
          reason: 'Environmental facilities nearby warrant review'
        })
        break
      case 'moderate':
        score -= 3
        factors.push({
          name: 'Environmental',
          impact: -3,
          reason: 'Some environmental facilities in area (at safe distances)'
        })
        break
    }
  }

  // === EARTHQUAKES ===
  if (data.earthquakes) {
    switch (data.earthquakes.riskLevel) {
      case 'high':
        score -= 15
        factors.push({
          name: 'Seismic Activity',
          impact: -15,
          reason: `History of M5.0+ earthquakes - ${data.earthquakes.majorEvents} major events recorded`
        })
        break
      case 'moderate':
        score -= 8
        factors.push({
          name: 'Seismic Activity',
          impact: -8,
          reason: 'Moderate seismic activity history'
        })
        break
      case 'low':
        score -= 2
        factors.push({
          name: 'Seismic Activity',
          impact: -2,
          reason: 'Low seismic activity - minor risk'
        })
        break
      case 'minimal':
        // Florida typically falls here - no deduction
        break
    }
  }

  // === WEATHER ALERTS ===
  if (data.weather?.hasSevereAlerts) {
    // Don't affect score permanently, but note active alerts
    factors.push({
      name: 'Active Alerts',
      impact: 0,
      reason: `${data.weather.alerts.length} active weather alert(s) - review before visiting`
    })
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score))

  // Determine grade
  let grade: string
  if (score >= 90) grade = 'A'
  else if (score >= 80) grade = 'B'
  else if (score >= 70) grade = 'C'
  else if (score >= 60) grade = 'D'
  else grade = 'F'

  // Generate summary
  let summary: string
  if (score >= 90) {
    summary = 'Excellent location profile with minimal identified risks. Standard due diligence recommended.'
  } else if (score >= 80) {
    summary = 'Good location with minor considerations. Review the identified factors before proceeding.'
  } else if (score >= 70) {
    summary = 'Acceptable location with notable factors requiring attention. Careful evaluation recommended.'
  } else if (score >= 60) {
    summary = 'Location has significant risk factors. Thorough investigation and professional consultation advised.'
  } else {
    summary = 'Multiple serious risk factors identified. Proceed with extreme caution and professional guidance.'
  }

  return { score, grade, summary, factors }
}
