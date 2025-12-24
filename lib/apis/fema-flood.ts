/**
 * FEMA National Flood Hazard Layer API
 * FREE - No API key required
 * 
 * Provides flood zone data for any US address
 * Source: https://hazards.fema.gov/gis/nfhl/rest/services
 */

interface FloodZoneResult {
  floodZone: string
  floodZoneDescription: string
  riskLevel: 'high' | 'moderate' | 'low' | 'minimal' | 'unknown'
  specialFloodHazardArea: boolean
  panelNumber?: string
  communityName?: string
  effectiveDate?: string
  source: string
}

// Flood zone descriptions
const FLOOD_ZONE_INFO: Record<string, { description: string; risk: 'high' | 'moderate' | 'low' | 'minimal' }> = {
  'A': { description: 'High-risk flood area with 1% annual chance of flooding', risk: 'high' },
  'AE': { description: 'High-risk flood area with base flood elevations determined', risk: 'high' },
  'AH': { description: 'High-risk shallow flooding area (1-3 feet)', risk: 'high' },
  'AO': { description: 'High-risk sheet flow flooding area', risk: 'high' },
  'AR': { description: 'High-risk area temporarily protected by levee', risk: 'high' },
  'A99': { description: 'High-risk area protected by federal flood control system under construction', risk: 'high' },
  'V': { description: 'High-risk coastal flood area with wave action', risk: 'high' },
  'VE': { description: 'High-risk coastal area with base flood elevations and wave action', risk: 'high' },
  'B': { description: 'Moderate flood hazard area (0.2% annual chance)', risk: 'moderate' },
  'X500': { description: 'Moderate flood hazard area (0.2% annual chance)', risk: 'moderate' },
  'C': { description: 'Minimal flood hazard area', risk: 'minimal' },
  'X': { description: 'Minimal flood hazard area', risk: 'minimal' },
  'D': { description: 'Undetermined flood hazard - possible but not analyzed', risk: 'low' },
}

/**
 * Get flood zone data for coordinates
 */
export async function getFloodZone(lat: number, lng: number): Promise<FloodZoneResult> {
  try {
    // FEMA National Flood Hazard Layer MapServer
    const url = new URL('https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query')
    
    url.searchParams.append('geometry', `${lng},${lat}`)
    url.searchParams.append('geometryType', 'esriGeometryPoint')
    url.searchParams.append('spatialRel', 'esriSpatialRelIntersects')
    url.searchParams.append('outFields', 'FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE,PANEL_TYP,FIRM_PAN,EFF_DATE')
    url.searchParams.append('returnGeometry', 'false')
    url.searchParams.append('f', 'json')
    
    const response = await fetch(url.toString())
    
    if (!response.ok) {
      console.error('FEMA API error:', response.status)
      return getUnknownResult()
    }
    
    const data = await response.json()
    
    if (!data.features || data.features.length === 0) {
      // No flood data available for this location
      return {
        floodZone: 'X',
        floodZoneDescription: 'Area not mapped or minimal flood hazard',
        riskLevel: 'minimal',
        specialFloodHazardArea: false,
        source: 'FEMA NFHL'
      }
    }
    
    const feature = data.features[0].attributes
    const zoneCode = feature.FLD_ZONE || 'X'
    const zoneInfo = FLOOD_ZONE_INFO[zoneCode] || FLOOD_ZONE_INFO['X']
    
    // SFHA_TF = Special Flood Hazard Area True/False
    const isHighRisk = feature.SFHA_TF === 'T' || ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE'].some(z => zoneCode.startsWith(z))
    
    return {
      floodZone: zoneCode,
      floodZoneDescription: zoneInfo.description,
      riskLevel: zoneInfo.risk,
      specialFloodHazardArea: isHighRisk,
      panelNumber: feature.FIRM_PAN,
      effectiveDate: feature.EFF_DATE,
      source: 'FEMA NFHL'
    }
    
  } catch (error) {
    console.error('FEMA flood zone error:', error)
    return getUnknownResult()
  }
}

function getUnknownResult(): FloodZoneResult {
  return {
    floodZone: 'Unknown',
    floodZoneDescription: 'Flood zone data unavailable for this location',
    riskLevel: 'unknown',
    specialFloodHazardArea: false,
    source: 'FEMA NFHL'
  }
}

/**
 * Get flood insurance requirement status
 */
export function requiresFloodInsurance(result: FloodZoneResult): {
  required: boolean
  recommended: boolean
  reason: string
} {
  if (result.specialFloodHazardArea) {
    return {
      required: true,
      recommended: true,
      reason: 'Property is in a Special Flood Hazard Area (SFHA). Flood insurance is required for federally-backed mortgages.'
    }
  }
  
  if (result.riskLevel === 'moderate') {
    return {
      required: false,
      recommended: true,
      reason: 'Property is in a moderate-risk flood zone. Flood insurance is recommended but not required.'
    }
  }
  
  return {
    required: false,
    recommended: false,
    reason: 'Property is in a low-risk flood zone. Flood insurance is optional but may be available at lower rates.'
  }
}
