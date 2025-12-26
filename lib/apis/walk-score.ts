// lib/apis/walk-score.ts
// Walk Score API integration for walkability, transit, and bike scores
// API Docs: https://www.walkscore.com/professional/api.php
// Added: December 25, 2025

export interface WalkScoreData {
  walkscore: number | null
  walkDescription: string
  transitScore: number | null
  transitDescription: string
  bikeScore: number | null
  bikeDescription: string
  logoUrl: string
  moreInfoUrl: string
  helpUrl: string
  wsLink: string
  snappedLat: number
  snappedLng: number
  status: number
  statusMessage: string
}

export interface WalkScoreResponse {
  success: boolean
  data: WalkScoreData | null
  error?: string
  queriedAt: string
}

// Score descriptions based on Walk Score ranges
function getWalkDescription(score: number | null): string {
  if (score === null) return 'Score unavailable'
  if (score >= 90) return "Walker's Paradise - Daily errands do not require a car"
  if (score >= 70) return 'Very Walkable - Most errands can be accomplished on foot'
  if (score >= 50) return 'Somewhat Walkable - Some errands can be accomplished on foot'
  if (score >= 25) return 'Car-Dependent - Most errands require a car'
  return 'Almost All Errands Require a Car'
}

function getTransitDescription(score: number | null): string {
  if (score === null) return 'Transit data unavailable'
  if (score >= 90) return "Rider's Paradise - World-class public transportation"
  if (score >= 70) return 'Excellent Transit - Many nearby public transportation options'
  if (score >= 50) return 'Good Transit - Many nearby public transportation options'
  if (score >= 25) return 'Some Transit - A few public transportation options'
  return 'Minimal Transit - Few public transportation options'
}

function getBikeDescription(score: number | null): string {
  if (score === null) return 'Bike data unavailable'
  if (score >= 90) return "Biker's Paradise - Daily errands can be accomplished on a bike"
  if (score >= 70) return 'Very Bikeable - Biking is convenient for most trips'
  if (score >= 50) return 'Bikeable - Some bike infrastructure'
  return 'Somewhat Bikeable - Minimal bike infrastructure'
}

/**
 * Fetches Walk Score, Transit Score, and Bike Score for a location
 * @param lat Latitude
 * @param lng Longitude  
 * @param address Full address string (recommended for accuracy)
 * @returns WalkScoreResponse with all scores and descriptions
 */
export async function getWalkScore(
  lat: number,
  lng: number,
  address?: string
): Promise<WalkScoreResponse> {
  const apiKey = process.env.WALKSCORE_API_KEY

  if (!apiKey) {
    return {
      success: false,
      data: null,
      error: 'Walk Score API key not configured',
      queriedAt: new Date().toISOString(),
    }
  }

  try {
    // Build the API URL
    const params = new URLSearchParams({
      format: 'json',
      lat: lat.toString(),
      lon: lng.toString(),
      transit: '1', // Include transit score
      bike: '1', // Include bike score
      wsapikey: apiKey,
    })

    // Add address if provided (improves accuracy)
    if (address) {
      params.append('address', address)
    }

    const url = `https://api.walkscore.com/score?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Cache for 24 hours - scores don't change frequently
      next: { revalidate: 86400 },
    })

    if (!response.ok) {
      throw new Error(`Walk Score API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Check for API-level errors
    if (data.status !== 1) {
      const statusMessages: Record<number, string> = {
        2: 'Score is being calculated, try again later',
        30: 'Invalid latitude/longitude',
        31: 'Walk Score API internal error',
        40: 'Your IP address has been blocked',
        41: 'Your API key is invalid',
        42: 'API quota exceeded',
      }
      
      return {
        success: false,
        data: null,
        error: statusMessages[data.status] || `Unknown status: ${data.status}`,
        queriedAt: new Date().toISOString(),
      }
    }

    const walkScoreData: WalkScoreData = {
      walkscore: data.walkscore ?? null,
      walkDescription: data.description || getWalkDescription(data.walkscore),
      transitScore: data.transit?.score ?? null,
      transitDescription: data.transit?.description || getTransitDescription(data.transit?.score),
      bikeScore: data.bike?.score ?? null,
      bikeDescription: data.bike?.description || getBikeDescription(data.bike?.score),
      logoUrl: data.logo_url || 'https://cdn.walk.sc/images/api-logo.png',
      moreInfoUrl: data.more_info_link || `https://www.walkscore.com/score/${encodeURIComponent(address || `${lat},${lng}`)}`,
      helpUrl: data.help_link || 'https://www.walkscore.com/how-it-works/',
      wsLink: data.ws_link || '',
      snappedLat: data.snapped_lat || lat,
      snappedLng: data.snapped_lon || lng,
      status: data.status,
      statusMessage: 'Success',
    }

    return {
      success: true,
      data: walkScoreData,
      queriedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Walk Score API error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error fetching Walk Score',
      queriedAt: new Date().toISOString(),
    }
  }
}

/**
 * Gets a color for the score badge
 */
export function getScoreColor(score: number | null): string {
  if (score === null) return '#9CA3AF' // gray
  if (score >= 90) return '#10B981' // green
  if (score >= 70) return '#34D399' // light green
  if (score >= 50) return '#FBBF24' // yellow
  if (score >= 25) return '#F97316' // orange
  return '#EF4444' // red
}

/**
 * Gets grade letter for score
 */
export function getScoreGrade(score: number | null): string {
  if (score === null) return 'N/A'
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}
