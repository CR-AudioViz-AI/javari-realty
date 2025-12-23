// lib/apis/usgs-earthquakes.ts
// USGS Earthquake Catalog API Integration
// Source: https://earthquake.usgs.gov/fdsnws/event/1/
// No API key required

export interface EarthquakeEvent {
  id: string
  magnitude: number
  place: string
  time: string
  depth: number // km
  distance: number // miles from query point
  felt?: number // number of felt reports
  tsunami: boolean
  significance: number
  url: string
}

export interface EarthquakeData {
  events: EarthquakeEvent[]
  totalEvents: number
  significantEvents: number // M4.0+
  majorEvents: number // M5.0+
  largestEvent?: EarthquakeEvent
  recentEvent?: EarthquakeEvent
  averageAnnualEvents: number
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high'
  riskExplanation: string
  recommendations: string[]
  searchRadiusKm: number
  searchYears: number
  queriedAt: string
}

export async function getEarthquakeHistory(
  lat: number,
  lng: number,
  radiusKm: number = 100,
  years: number = 25
): Promise<EarthquakeData> {
  try {
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - years)

    // Build USGS query
    const url = new URL('https://earthquake.usgs.gov/fdsnws/event/1/query')
    url.searchParams.set('format', 'geojson')
    url.searchParams.set('latitude', lat.toFixed(4))
    url.searchParams.set('longitude', lng.toFixed(4))
    url.searchParams.set('maxradiuskm', radiusKm.toString())
    url.searchParams.set('starttime', startDate.toISOString().split('T')[0])
    url.searchParams.set('endtime', endDate.toISOString().split('T')[0])
    url.searchParams.set('minmagnitude', '2.5') // Only earthquakes M2.5+
    url.searchParams.set('orderby', 'time')
    url.searchParams.set('limit', '1000')

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CRRealtorPlatform/1.0'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const features = data.features || []

    // Process events
    const events: EarthquakeEvent[] = features.map((f: any) => {
      const coords = f.geometry.coordinates
      const props = f.properties

      return {
        id: f.id,
        magnitude: props.mag,
        place: props.place || 'Unknown location',
        time: new Date(props.time).toISOString(),
        depth: coords[2], // depth in km
        distance: calculateDistanceMiles(lat, lng, coords[1], coords[0]),
        felt: props.felt,
        tsunami: props.tsunami === 1,
        significance: props.sig,
        url: props.url
      }
    })

    // Calculate statistics
    const significantEvents = events.filter(e => e.magnitude >= 4.0)
    const majorEvents = events.filter(e => e.magnitude >= 5.0)
    
    // Sort by magnitude to find largest
    const sortedByMag = [...events].sort((a, b) => b.magnitude - a.magnitude)
    const largestEvent = sortedByMag[0]

    // Most recent event
    const recentEvent = events[0]

    const avgPerYear = events.length / years

    // Assess risk
    const riskAssessment = assessSeismicRisk(events, significantEvents, majorEvents, avgPerYear, years)

    return {
      events: events.slice(0, 25), // Return top 25
      totalEvents: events.length,
      significantEvents: significantEvents.length,
      majorEvents: majorEvents.length,
      largestEvent,
      recentEvent,
      averageAnnualEvents: Math.round(avgPerYear * 10) / 10,
      riskLevel: riskAssessment.level,
      riskExplanation: riskAssessment.explanation,
      recommendations: riskAssessment.recommendations,
      searchRadiusKm: radiusKm,
      searchYears: years,
      queriedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('USGS Earthquake API error:', error)
    return {
      events: [],
      totalEvents: 0,
      significantEvents: 0,
      majorEvents: 0,
      averageAnnualEvents: 0,
      riskLevel: 'minimal',
      riskExplanation: 'Unable to retrieve earthquake data. This area (Florida) historically has minimal seismic activity.',
      recommendations: ['Florida experiences very few earthquakes - this is generally not a concern'],
      searchRadiusKm: radiusKm,
      searchYears: years,
      queriedAt: new Date().toISOString()
    }
  }
}

function calculateDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

function assessSeismicRisk(
  events: EarthquakeEvent[],
  significant: EarthquakeEvent[],
  major: EarthquakeEvent[],
  avgPerYear: number,
  years: number
): { level: 'minimal' | 'low' | 'moderate' | 'high'; explanation: string; recommendations: string[] } {
  
  // High risk: Major earthquakes (M5.0+) in history
  if (major.length > 0) {
    const largest = major.sort((a, b) => b.magnitude - a.magnitude)[0]
    return {
      level: 'high',
      explanation: `This area has experienced ${major.length} significant earthquake${major.length > 1 ? 's' : ''} of magnitude 5.0 or greater within ${Math.round(100 * 0.621)} miles over the past ${years} years. The largest was M${largest.magnitude.toFixed(1)} at ${largest.place}. Earthquakes of this magnitude can cause structural damage.`,
      recommendations: [
        'Consider earthquake insurance (typically a separate policy)',
        'Have the property inspected for earthquake-resistant features',
        'Check for foundation cracks or previous earthquake damage',
        'Ensure water heater is strapped and bookcases are secured',
        'Review the structural design if the home was built before modern seismic codes'
      ]
    }
  }

  // Moderate risk: Significant earthquakes (M4.0+)
  if (significant.length > 3) {
    return {
      level: 'moderate',
      explanation: `This area has experienced ${significant.length} earthquakes of magnitude 4.0 or greater in the past ${years} years. While earthquakes of this magnitude are felt, they rarely cause significant damage. However, the frequency indicates an active seismic zone.`,
      recommendations: [
        'Consider earthquake insurance for valuable properties',
        'Standard earthquake preparedness measures recommended',
        'Ensure heavy items are secured in the home',
        'Have an emergency kit prepared'
      ]
    }
  }

  // Low risk: Some activity but minimal significant events
  if (events.length > 10 || significant.length > 0) {
    return {
      level: 'low',
      explanation: `There has been some seismic activity in this region (${events.length} recorded events M2.5+), but significant earthquakes are rare. ${significant.length > 0 ? `Only ${significant.length} event(s) reached M4.0+.` : 'No earthquakes reached M4.0.'} This represents low earthquake risk.`,
      recommendations: [
        'Basic earthquake preparedness is advisable',
        'Earthquake insurance is generally optional but worth considering',
        'Standard home safety measures are sufficient'
      ]
    }
  }

  // Minimal risk: Very little to no activity
  return {
    level: 'minimal',
    explanation: `This area has minimal recorded seismic activity. Only ${events.length} earthquake${events.length !== 1 ? 's' : ''} of M2.5+ ${events.length === 1 ? 'has' : 'have'} been recorded within ${Math.round(100 * 0.621)} miles over the past ${years} years. Earthquake risk is not a significant concern for this location.`,
    recommendations: [
      'Earthquake risk is minimal for this area',
      'No specific earthquake precautions necessary',
      'Standard home safety practices are sufficient'
    ]
  }
}

// Get magnitude color for UI
export function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 6.0) return 'red'
  if (magnitude >= 5.0) return 'orange'
  if (magnitude >= 4.0) return 'yellow'
  if (magnitude >= 3.0) return 'blue'
  return 'green'
}

// Get risk level color for UI
export function getSeismicRiskColor(level: string): string {
  switch (level) {
    case 'minimal': return 'green'
    case 'low': return 'blue'
    case 'moderate': return 'yellow'
    case 'high': return 'red'
    default: return 'gray'
  }
}

// Format magnitude for display
export function formatMagnitude(magnitude: number): string {
  return `M${magnitude.toFixed(1)}`
}
