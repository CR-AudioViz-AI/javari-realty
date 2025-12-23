// lib/apis/fema-flood.ts
// FEMA National Flood Hazard Layer API Integration
// Source: https://hazards.fema.gov/gis/nfhl/rest/services
// No API key required

export interface FloodRiskData {
  floodZone: string
  floodZoneDescription: string
  sfha: boolean // Special Flood Hazard Area
  baseFloodElevation?: number
  firmPanelId: string
  riskLevel: 'minimal' | 'moderate' | 'high' | 'very-high'
  insuranceRequired: boolean
  insuranceRecommended: boolean
  explanation: string
  sourceUrl: string
  queriedAt: string
}

const FLOOD_ZONE_INFO: Record<string, { description: string; risk: 'minimal' | 'moderate' | 'high' | 'very-high'; insuranceRequired: boolean }> = {
  'A': {
    description: 'High-risk flood area with 1% annual chance of flooding (100-year flood)',
    risk: 'very-high',
    insuranceRequired: true
  },
  'AE': {
    description: 'High-risk area with base flood elevations determined',
    risk: 'very-high',
    insuranceRequired: true
  },
  'AH': {
    description: 'High-risk shallow flooding area (1-3 feet depth)',
    risk: 'high',
    insuranceRequired: true
  },
  'AO': {
    description: 'High-risk sheet flow area on sloping terrain (1-3 feet)',
    risk: 'high',
    insuranceRequired: true
  },
  'AR': {
    description: 'Special flood hazard area formerly protected by levee',
    risk: 'high',
    insuranceRequired: true
  },
  'A99': {
    description: 'Area protected by federal flood control system under construction',
    risk: 'high',
    insuranceRequired: true
  },
  'V': {
    description: 'Coastal high-risk area with wave action (velocity zone)',
    risk: 'very-high',
    insuranceRequired: true
  },
  'VE': {
    description: 'Coastal high-risk area with base flood elevations and wave action',
    risk: 'very-high',
    insuranceRequired: true
  },
  'X': {
    description: 'Minimal flood risk area (outside 500-year floodplain)',
    risk: 'minimal',
    insuranceRequired: false
  },
  'X500': {
    description: 'Moderate risk area (between 100-year and 500-year floodplain)',
    risk: 'moderate',
    insuranceRequired: false
  },
  'B': {
    description: 'Moderate flood hazard area (older map designation)',
    risk: 'moderate',
    insuranceRequired: false
  },
  'C': {
    description: 'Minimal flood hazard area (older map designation)',
    risk: 'minimal',
    insuranceRequired: false
  },
  'D': {
    description: 'Undetermined risk - no flood hazard analysis performed',
    risk: 'moderate',
    insuranceRequired: false
  }
}

export async function getFloodRisk(lat: number, lng: number): Promise<FloodRiskData> {
  try {
    // Query FEMA NFHL ArcGIS REST service - Flood Hazard Zones layer
    const url = new URL('https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query')
    url.searchParams.set('geometry', `${lng},${lat}`)
    url.searchParams.set('geometryType', 'esriGeometryPoint')
    url.searchParams.set('spatialRel', 'esriSpatialRelIntersects')
    url.searchParams.set('outFields', 'FLD_ZONE,ZONE_SUBTY,STATIC_BFE,DFIRM_ID,SOURCE_CIT')
    url.searchParams.set('returnGeometry', 'false')
    url.searchParams.set('f', 'json')

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CRRealtorPlatform/1.0'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`FEMA API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle no data found
    if (!data.features || data.features.length === 0) {
      return {
        floodZone: 'X',
        floodZoneDescription: 'No flood hazard data mapped for this location. This may indicate minimal risk or that the area has not been studied.',
        sfha: false,
        firmPanelId: 'Not mapped',
        riskLevel: 'minimal',
        insuranceRequired: false,
        insuranceRecommended: true,
        explanation: generateFloodExplanation('X', false, null),
        sourceUrl: 'https://msc.fema.gov/portal/home',
        queriedAt: new Date().toISOString()
      }
    }

    // Parse the response
    const feature = data.features[0].attributes
    let zone = feature.FLD_ZONE || 'X'
    
    // Handle zone subtypes
    if (feature.ZONE_SUBTY && feature.ZONE_SUBTY !== ' ') {
      if (feature.ZONE_SUBTY.includes('500')) {
        zone = 'X500'
      }
    }

    const zoneInfo = FLOOD_ZONE_INFO[zone] || FLOOD_ZONE_INFO['X']
    const isHighRisk = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE'].some(z => zone.startsWith(z))

    return {
      floodZone: zone,
      floodZoneDescription: zoneInfo.description,
      sfha: isHighRisk,
      baseFloodElevation: feature.STATIC_BFE && feature.STATIC_BFE > 0 ? feature.STATIC_BFE : undefined,
      firmPanelId: feature.DFIRM_ID || 'Unknown',
      riskLevel: zoneInfo.risk,
      insuranceRequired: zoneInfo.insuranceRequired,
      insuranceRecommended: true, // Always recommend
      explanation: generateFloodExplanation(zone, isHighRisk, feature.STATIC_BFE),
      sourceUrl: 'https://msc.fema.gov/portal/home',
      queriedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('FEMA Flood API error:', error)
    // Return safe default on error
    return {
      floodZone: 'Unknown',
      floodZoneDescription: 'Unable to retrieve flood data. Please check FEMA resources directly.',
      sfha: false,
      firmPanelId: 'Error',
      riskLevel: 'moderate',
      insuranceRequired: false,
      insuranceRecommended: true,
      explanation: 'We were unable to retrieve flood zone data for this location. We recommend checking the FEMA Flood Map Service Center directly for accurate information.',
      sourceUrl: 'https://msc.fema.gov/portal/home',
      queriedAt: new Date().toISOString()
    }
  }
}

function generateFloodExplanation(zone: string, isHighRisk: boolean, bfe: number | null): string {
  if (isHighRisk) {
    let explanation = `This property is located in Flood Zone ${zone}, designated as a Special Flood Hazard Area (SFHA). Properties in this zone have at least a 1% annual chance of flooding, commonly referred to as the "100-year flood" zone.\n\n`
    
    explanation += `**Key Implications:**\n`
    explanation += `• Flood insurance is REQUIRED if you have a federally-backed mortgage\n`
    explanation += `• Lenders will require proof of flood insurance before closing\n`
    explanation += `• Building restrictions may apply for new construction or substantial improvements\n`
    
    if (bfe && bfe > 0) {
      explanation += `• Base Flood Elevation (BFE) is ${bfe} feet - the lowest floor should be at or above this level\n`
    }
    
    explanation += `\n**Recommended Actions:**\n`
    explanation += `• Request a flood elevation certificate from the seller\n`
    explanation += `• Get flood insurance quotes before making an offer\n`
    explanation += `• Consider flood mitigation costs in your budget\n`
    explanation += `• Ask about historical flooding at this specific property`
    
    return explanation
  }
  
  if (zone === 'X500' || zone === 'B') {
    return `This property is in Flood Zone ${zone}, which indicates moderate flood risk. While flood insurance is not federally required, this area has between a 0.2% and 1% annual chance of flooding (the "500-year flood" zone).\n\n**Recommendation:** Flood insurance is strongly encouraged. Premiums for moderate-risk zones are typically much lower than high-risk zones. About 20% of flood claims come from outside high-risk areas.`
  }
  
  return `This property is in Flood Zone ${zone}, which indicates minimal flood risk. The area is outside the 500-year floodplain.\n\n**Note:** While flood insurance is not required, it is still recommended. Floods can occur anywhere, and about 25% of flood insurance claims come from low-to-moderate risk areas. Flood insurance for Zone X properties is typically very affordable through the NFIP Preferred Risk Policy.`
}

// Utility function to check if a zone requires insurance
export function requiresFloodInsurance(zone: string): boolean {
  const highRiskZones = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']
  return highRiskZones.some(z => zone.startsWith(z))
}

// Get flood zone color for UI
export function getFloodZoneColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'minimal': return 'green'
    case 'moderate': return 'yellow'
    case 'high': return 'orange'
    case 'very-high': return 'red'
    default: return 'gray'
  }
}
