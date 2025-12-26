// app/api/property-intelligence/route.ts
// Main API endpoint for Property Intelligence Card data
// Aggregates data from FEMA, EPA, USGS, NWS, Walk Score, Google Places, Yelp APIs
// Updated: December 25, 2025 - Added Walk Score, Google Places, Yelp

import { NextRequest, NextResponse } from 'next/server'
import { getFloodRisk, FloodRiskData } from '@/lib/apis/fema-flood'
import { getDisasterHistory, DisasterHistory } from '@/lib/apis/fema-disasters'
import { getEnvironmentalData, EnvironmentalData } from '@/lib/apis/epa-environment'
import { getEarthquakeHistory, EarthquakeData } from '@/lib/apis/usgs-earthquakes'
import { getWeatherData, WeatherData } from '@/lib/apis/nws-weather'
import { getWalkScore, WalkScoreData } from '@/lib/apis/walk-score'
import { getNearbyAmenities, YelpBusiness } from '@/lib/apis/yelp-fusion'
import { getNearbyPlacesSummary, GooglePlace } from '@/lib/apis/google-places'

export interface PropertyIntelligenceRequest {
  lat: number
  lng: number
  address?: string
  toggles: string[] // Which data layers to fetch
  fipsCode?: string // For disaster history
  censusTract?: string // For demographics
  radius?: number // Radius in meters for nearby search
}

export interface PropertyIntelligenceResponse {
  success: boolean
  data: {
    flood?: FloodRiskData
    disasters?: DisasterHistory
    environment?: EnvironmentalData
    earthquakes?: EarthquakeData
    weather?: WeatherData
    walkScore?: WalkScoreData
    nearbyAmenities?: Record<string, { count: number; topPicks: YelpBusiness[] }>
    nearbyPlaces?: Record<string, { count: number; nearest: GooglePlace | null }>
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

// Calculate overall property score based on all data
function calculatePropertyScore(data: PropertyIntelligenceResponse['data']): PropertyIntelligenceResponse['propertyScore'] {
  const factors: { name: string; impact: number; reason: string }[] = []
  let totalScore = 70 // Base score

  // Walk Score impact (0-30 points)
  if (data.walkScore) {
    const walkImpact = Math.round((data.walkScore.walkscore || 0) * 0.3)
    totalScore += walkImpact - 15 // Normalize around 0
    factors.push({
      name: 'Walkability',
      impact: walkImpact - 15,
      reason: `Walk Score: ${data.walkScore.walkscore || 'N/A'} - ${data.walkScore.walkDescription}`,
    })

    if (data.walkScore.transitScore) {
      const transitImpact = Math.round(data.walkScore.transitScore * 0.1)
      totalScore += transitImpact - 5
      factors.push({
        name: 'Transit Access',
        impact: transitImpact - 5,
        reason: `Transit Score: ${data.walkScore.transitScore} - ${data.walkScore.transitDescription}`,
      })
    }
  }

  // Flood risk impact (-20 to +10 points)
  if (data.flood) {
    let floodImpact = 0
    if (data.flood.floodZone?.startsWith('A') || data.flood.floodZone?.startsWith('V')) {
      floodImpact = -20
    } else if (data.flood.floodZone?.startsWith('B') || data.flood.floodZone?.startsWith('X500')) {
      floodImpact = -5
    } else if (data.flood.floodZone === 'X' || data.flood.floodZone === 'C') {
      floodImpact = 10
    }
    totalScore += floodImpact
    factors.push({
      name: 'Flood Risk',
      impact: floodImpact,
      reason: `Zone ${data.flood.floodZone || 'Unknown'} - ${data.flood.riskLevel || 'Unknown risk'}`,
    })
  }

  // Environmental impact (-15 to +5 points)
  if (data.environment) {
    let envImpact = 5 // Default positive
    if (data.environment.airQuality) {
      const aqi = data.environment.airQuality.aqi || 50
      if (aqi > 150) envImpact = -15
      else if (aqi > 100) envImpact = -10
      else if (aqi > 50) envImpact = 0
    }
    totalScore += envImpact
    factors.push({
      name: 'Air Quality',
      impact: envImpact,
      reason: `AQI: ${data.environment.airQuality?.aqi || 'N/A'} - ${data.environment.airQuality?.category || 'Unknown'}`,
    })
  }

  // Nearby amenities impact (0-15 points)
  if (data.nearbyAmenities) {
    let amenityScore = 0
    const categories = Object.keys(data.nearbyAmenities)
    for (const cat of categories) {
      const count = data.nearbyAmenities[cat].count
      if (count > 10) amenityScore += 2
      else if (count > 5) amenityScore += 1.5
      else if (count > 0) amenityScore += 1
    }
    amenityScore = Math.min(amenityScore, 15)
    totalScore += amenityScore
    factors.push({
      name: 'Nearby Amenities',
      impact: amenityScore,
      reason: `${categories.length} categories of amenities nearby`,
    })
  }

  // Earthquake risk impact (-10 to 0 points)
  if (data.earthquakes && data.earthquakes.recentEvents && data.earthquakes.recentEvents.length > 0) {
    const significantQuakes = data.earthquakes.recentEvents.filter(
      (e: any) => e.magnitude >= 4.0
    ).length
    const quakeImpact = significantQuakes > 5 ? -10 : significantQuakes > 2 ? -5 : 0
    totalScore += quakeImpact
    if (quakeImpact !== 0) {
      factors.push({
        name: 'Seismic Activity',
        impact: quakeImpact,
        reason: `${significantQuakes} significant earthquakes (4.0+) in area`,
      })
    }
  }

  // Normalize score to 0-100
  totalScore = Math.max(0, Math.min(100, totalScore))

  // Determine grade
  let grade = 'C'
  if (totalScore >= 90) grade = 'A+'
  else if (totalScore >= 85) grade = 'A'
  else if (totalScore >= 80) grade = 'A-'
  else if (totalScore >= 75) grade = 'B+'
  else if (totalScore >= 70) grade = 'B'
  else if (totalScore >= 65) grade = 'B-'
  else if (totalScore >= 60) grade = 'C+'
  else if (totalScore >= 55) grade = 'C'
  else if (totalScore >= 50) grade = 'C-'
  else if (totalScore >= 45) grade = 'D+'
  else if (totalScore >= 40) grade = 'D'
  else grade = 'F'

  // Generate summary
  const positiveFactors = factors.filter((f) => f.impact > 0)
  const negativeFactors = factors.filter((f) => f.impact < 0)

  let summary = `This property scores ${totalScore}/100 (${grade}). `
  if (positiveFactors.length > 0) {
    summary += `Strengths: ${positiveFactors.map((f) => f.name.toLowerCase()).join(', ')}. `
  }
  if (negativeFactors.length > 0) {
    summary += `Concerns: ${negativeFactors.map((f) => f.name.toLowerCase()).join(', ')}.`
  }

  return {
    score: Math.round(totalScore),
    grade,
    summary,
    factors,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PropertyIntelligenceRequest = await request.json()
    const { lat, lng, address, toggles = ['flood'], fipsCode, radius = 1609 } = body

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

    // Walk Score (always fetch if walkability toggle is on)
    if (toggles.includes('walkability') || toggles.includes('walkscore') || toggles.includes('all')) {
      fetchPromises.push(
        getWalkScore(lat, lng, address)
          .then((response) => {
            if (response.success && response.data) {
              results.walkScore = response.data
            } else {
              errors.walkScore = response.error || 'Failed to fetch Walk Score'
            }
          })
          .catch((err) => {
            errors.walkScore = err.message
          })
      )
    }

    // Nearby Amenities (Yelp)
    if (toggles.includes('amenities') || toggles.includes('yelp') || toggles.includes('all')) {
      fetchPromises.push(
        getNearbyAmenities(lat, lng, radius)
          .then((response) => {
            if (response.success) {
              results.nearbyAmenities = response.amenities
            } else {
              errors.nearbyAmenities = response.error || 'Failed to fetch amenities'
            }
          })
          .catch((err) => {
            errors.nearbyAmenities = err.message
          })
      )
    }

    // Nearby Places (Google)
    if (toggles.includes('places') || toggles.includes('google') || toggles.includes('all')) {
      fetchPromises.push(
        getNearbyPlacesSummary(lat, lng, radius)
          .then((response) => {
            if (response.success) {
              results.nearbyPlaces = response.summary
            } else {
              errors.nearbyPlaces = response.error || 'Failed to fetch places'
            }
          })
          .catch((err) => {
            errors.nearbyPlaces = err.message
          })
      )
    }

    // Flood Risk (FEMA)
    if (toggles.includes('flood') || toggles.includes('risk') || toggles.includes('all')) {
      fetchPromises.push(
        getFloodRisk(lat, lng)
          .then((data) => {
            results.flood = data
          })
          .catch((err) => {
            errors.flood = err.message
          })
      )
    }

    // Disaster History (OpenFEMA)
    if ((toggles.includes('disasters') || toggles.includes('risk') || toggles.includes('all')) && fipsCode) {
      fetchPromises.push(
        getDisasterHistory(fipsCode)
          .then((data) => {
            results.disasters = data
          })
          .catch((err) => {
            errors.disasters = err.message
          })
      )
    }

    // Environmental Hazards (EPA)
    if (toggles.includes('environment') || toggles.includes('all')) {
      fetchPromises.push(
        getEnvironmentalData(lat, lng)
          .then((data) => {
            results.environment = data
          })
          .catch((err) => {
            errors.environment = err.message
          })
      )
    }

    // Earthquake Risk (USGS)
    if (toggles.includes('earthquakes') || toggles.includes('risk') || toggles.includes('all')) {
      fetchPromises.push(
        getEarthquakeHistory(lat, lng)
          .then((data) => {
            results.earthquakes = data
          })
          .catch((err) => {
            errors.earthquakes = err.message
          })
      )
    }

    // Weather (NWS)
    if (toggles.includes('weather') || toggles.includes('all')) {
      fetchPromises.push(
        getWeatherData(lat, lng)
          .then((data) => {
            results.weather = data
          })
          .catch((err) => {
            errors.weather = err.message
          })
      )
    }

    // Execute all fetches in parallel
    await Promise.allSettled(fetchPromises)

    // Calculate property score
    const propertyScore = calculatePropertyScore(results)

    const response: PropertyIntelligenceResponse = {
      success: true,
      data: results,
      propertyScore,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      queriedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Property Intelligence API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        queriedAt: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const address = searchParams.get('address') || undefined
  const toggles = searchParams.get('toggles')?.split(',') || ['all']
  const fipsCode = searchParams.get('fips') || undefined

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { success: false, error: 'Valid lat and lng query params required' },
      { status: 400 }
    )
  }

  // Convert to POST request format
  const fakeRequest = {
    json: async () => ({ lat, lng, address, toggles, fipsCode }),
  } as NextRequest

  return POST(fakeRequest)
}
