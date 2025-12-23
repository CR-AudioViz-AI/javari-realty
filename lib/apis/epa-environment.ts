// lib/apis/epa-environment.ts
// EPA Envirofacts Data Service API Integration
// Source: https://www.epa.gov/enviro/envirofacts-data-service-api
// No API key required

export interface EnvironmentalSite {
  name: string
  type: 'Superfund' | 'TRI' | 'RCRA' | 'Air' | 'Water'
  distance: number // miles
  status: string
  address?: string
  city?: string
  state?: string
  epaId?: string
  details?: string
  riskLevel: 'low' | 'moderate' | 'high'
}

export interface EnvironmentalData {
  superfundSites: EnvironmentalSite[]
  toxicReleaseFacilities: EnvironmentalSite[]
  hazardousWasteSites: EnvironmentalSite[]
  totalFacilitiesNearby: number
  closestConcern?: EnvironmentalSite
  overallRisk: 'low' | 'moderate' | 'elevated' | 'high'
  riskExplanation: string
  recommendations: string[]
  searchRadiusMiles: number
  queriedAt: string
}

export async function getEnvironmentalData(
  lat: number,
  lng: number,
  radiusMiles: number = 3
): Promise<EnvironmentalData> {
  try {
    // Convert radius to degrees (approximate: 1 degree ≈ 69 miles at equator)
    const radiusDegrees = radiusMiles / 69

    // Fetch data from multiple EPA tables in parallel
    const [superfundData, triData, rcraData] = await Promise.all([
      fetchSuperfundSites(lat, lng, radiusMiles),
      fetchTRIFacilities(lat, lng, radiusDegrees),
      fetchRCRASites(lat, lng, radiusMiles)
    ])

    // Calculate distances and filter
    const superfundSites = superfundData
      .map(site => ({
        ...site,
        distance: calculateDistance(lat, lng, site.lat, site.lng)
      }))
      .filter(site => site.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)

    const toxicReleaseFacilities = triData
      .map(site => ({
        ...site,
        distance: calculateDistance(lat, lng, site.lat, site.lng)
      }))
      .filter(site => site.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)

    const hazardousWasteSites = rcraData
      .map(site => ({
        ...site,
        distance: calculateDistance(lat, lng, site.lat, site.lng)
      }))
      .filter(site => site.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)

    // Find closest concern
    const allSites = [...superfundSites, ...toxicReleaseFacilities, ...hazardousWasteSites]
    const closestConcern = allSites.sort((a, b) => a.distance - b.distance)[0]

    // Determine overall risk
    const riskAssessment = assessEnvironmentalRisk(
      superfundSites,
      toxicReleaseFacilities,
      hazardousWasteSites
    )

    return {
      superfundSites: superfundSites.map(s => formatSite(s)),
      toxicReleaseFacilities: toxicReleaseFacilities.map(s => formatSite(s)),
      hazardousWasteSites: hazardousWasteSites.map(s => formatSite(s)),
      totalFacilitiesNearby: allSites.length,
      closestConcern: closestConcern ? formatSite(closestConcern) : undefined,
      overallRisk: riskAssessment.level,
      riskExplanation: riskAssessment.explanation,
      recommendations: riskAssessment.recommendations,
      searchRadiusMiles: radiusMiles,
      queriedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('EPA API error:', error)
    return {
      superfundSites: [],
      toxicReleaseFacilities: [],
      hazardousWasteSites: [],
      totalFacilitiesNearby: 0,
      overallRisk: 'low',
      riskExplanation: 'Unable to retrieve environmental data. We recommend checking EPA resources directly at https://www.epa.gov/enviro/',
      recommendations: ['Check EPA Envirofacts directly for environmental information'],
      searchRadiusMiles: radiusMiles,
      queriedAt: new Date().toISOString()
    }
  }
}

async function fetchSuperfundSites(lat: number, lng: number, radiusMiles: number): Promise<any[]> {
  try {
    // Query Superfund (CERCLIS) sites
    const url = `https://data.epa.gov/efservice/SEMS_ACTIVE_SITES/LATITUDE/${lat - radiusMiles/69}:${lat + radiusMiles/69}/LONGITUDE/${lng - radiusMiles/69}:${lng + radiusMiles/69}/JSON`
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 }
    })

    if (!response.ok) return []
    
    const data = await response.json()
    return Array.isArray(data) ? data.map((site: any) => ({
      name: site.SITE_NAME || 'Unknown Superfund Site',
      type: 'Superfund' as const,
      lat: parseFloat(site.LATITUDE) || 0,
      lng: parseFloat(site.LONGITUDE) || 0,
      status: site.NPL_STATUS || site.SITE_STATUS || 'Unknown',
      address: site.ADDRESS,
      city: site.CITY,
      state: site.STATE,
      epaId: site.EPA_ID,
      riskLevel: 'high' as const
    })) : []
  } catch {
    return []
  }
}

async function fetchTRIFacilities(lat: number, lng: number, radiusDegrees: number): Promise<any[]> {
  try {
    // Query Toxic Release Inventory facilities
    const url = `https://data.epa.gov/efservice/TRI_FACILITY/LATITUDE/${lat - radiusDegrees}:${lat + radiusDegrees}/LONGITUDE/${lng - radiusDegrees}:${lng + radiusDegrees}/ROWS/0:50/JSON`
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 }
    })

    if (!response.ok) return []
    
    const data = await response.json()
    return Array.isArray(data) ? data.map((site: any) => ({
      name: site.FACILITY_NAME || 'Unknown TRI Facility',
      type: 'TRI' as const,
      lat: parseFloat(site.LATITUDE) || 0,
      lng: parseFloat(site.LONGITUDE) || 0,
      status: 'Active TRI Reporter',
      address: site.STREET_ADDRESS,
      city: site.CITY_NAME,
      state: site.STATE_ABBR,
      epaId: site.TRI_FACILITY_ID,
      riskLevel: 'moderate' as const
    })) : []
  } catch {
    return []
  }
}

async function fetchRCRASites(lat: number, lng: number, radiusMiles: number): Promise<any[]> {
  try {
    // Query RCRA (hazardous waste) handlers
    const radiusDegrees = radiusMiles / 69
    const url = `https://data.epa.gov/efservice/RCRAInfo/LATITUDE/${lat - radiusDegrees}:${lat + radiusDegrees}/LONGITUDE/${lng - radiusDegrees}:${lng + radiusDegrees}/ROWS/0:50/JSON`
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 }
    })

    if (!response.ok) return []
    
    const data = await response.json()
    return Array.isArray(data) ? data.map((site: any) => ({
      name: site.HANDLER_NAME || 'Unknown RCRA Handler',
      type: 'RCRA' as const,
      lat: parseFloat(site.LATITUDE) || 0,
      lng: parseFloat(site.LONGITUDE) || 0,
      status: site.ACTIVITY_DESC || 'Hazardous Waste Handler',
      address: site.LOCATION_STREET,
      city: site.LOCATION_CITY,
      state: site.LOCATION_STATE,
      epaId: site.HANDLER_ID,
      riskLevel: 'moderate' as const
    })) : []
  } catch {
    return []
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  if (!lat2 || !lng2) return Infinity
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

function formatSite(site: any): EnvironmentalSite {
  return {
    name: site.name,
    type: site.type,
    distance: site.distance,
    status: site.status,
    address: site.address,
    city: site.city,
    state: site.state,
    epaId: site.epaId,
    riskLevel: site.riskLevel
  }
}

function assessEnvironmentalRisk(
  superfund: any[],
  tri: any[],
  rcra: any[]
): { level: 'low' | 'moderate' | 'elevated' | 'high'; explanation: string; recommendations: string[] } {
  const nearbySuperfund = superfund.filter(s => s.distance < 1)
  const veryNearbySuperfund = superfund.filter(s => s.distance < 0.5)
  const nearbyTri = tri.filter(s => s.distance < 1)

  // High risk: Superfund site within 0.5 miles
  if (veryNearbySuperfund.length > 0) {
    return {
      level: 'high',
      explanation: `A Superfund site (${veryNearbySuperfund[0].name}) is located within 0.5 miles of this property. Superfund sites are areas where hazardous waste contamination requires long-term cleanup. This proximity may affect property values, require environmental disclosure, and could pose health considerations.`,
      recommendations: [
        'Request a Phase I Environmental Site Assessment before purchase',
        'Review the EPA Superfund site profile for contamination details',
        'Consult with an environmental attorney',
        'Verify the property itself is not part of the contamination zone',
        'Check if the property relies on well water'
      ]
    }
  }

  // Elevated risk: Superfund within 1 mile or many TRI facilities nearby
  if (nearbySuperfund.length > 0 || nearbyTri.length >= 3) {
    return {
      level: 'elevated',
      explanation: `This area has notable environmental considerations: ${nearbySuperfund.length > 0 ? `${nearbySuperfund.length} Superfund site(s) within 1 mile` : ''}${nearbySuperfund.length > 0 && nearbyTri.length > 0 ? ' and ' : ''}${nearbyTri.length > 0 ? `${nearbyTri.length} Toxic Release Inventory facilities nearby` : ''}. While not necessarily affecting the property directly, these warrant review.`,
      recommendations: [
        'Review EPA detailed reports for each identified facility',
        'Consider a Phase I Environmental Assessment if concerned',
        'Check local water quality reports',
        'Inquire about any environmental issues disclosed for the property'
      ]
    }
  }

  // Moderate risk: Some facilities within radius
  if (superfund.length > 0 || tri.length > 5 || rcra.length > 10) {
    return {
      level: 'moderate',
      explanation: `There are some environmental facilities within the search area, but none in immediate proximity to the property. ${superfund.length} Superfund site(s), ${tri.length} TRI facilities, and ${rcra.length} hazardous waste handlers were identified within the search radius.`,
      recommendations: [
        'Review EPA facility details for any of concern',
        'Standard due diligence should be sufficient for most transactions',
        'Ask the seller about any known environmental issues'
      ]
    }
  }

  // Low risk: Few or no facilities
  return {
    level: 'low',
    explanation: `No significant environmental concerns were identified within the search area. ${superfund.length + tri.length + rcra.length === 0 ? 'No EPA-tracked facilities found nearby.' : 'Only minor facilities identified at safe distances.'}`,
    recommendations: [
      'Standard property due diligence recommended',
      'No specific environmental concerns identified'
    ]
  }
}

// Get environmental risk color for UI
export function getEnvironmentalRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'green'
    case 'moderate': return 'yellow'
    case 'elevated': return 'orange'
    case 'high': return 'red'
    default: return 'gray'
  }
}
