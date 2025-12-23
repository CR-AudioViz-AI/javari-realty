// lib/apis/fema-disasters.ts
// OpenFEMA Disaster Declarations API Integration
// Source: https://www.fema.gov/about/openfema/api
// No API key required

export interface DisasterEvent {
  id: string
  disasterNumber: number
  type: string
  title: string
  state: string
  declarationDate: string
  incidentBeginDate: string
  incidentEndDate?: string
  designatedArea: string
  assistancePrograms: string[]
  fipsCode: string
}

export interface DisasterHistory {
  county: string
  state: string
  fipsCode: string
  disasters: DisasterEvent[]
  totalDisasters: number
  disastersByType: Record<string, number>
  lastDisaster?: DisasterEvent
  mostCommonType: string
  averageDisastersPerYear: number
  riskAssessment: string
  floridaSpecificContext?: string
  queriedAt: string
  yearsAnalyzed: number
}

// Florida-specific disaster context
const FLORIDA_DISASTER_CONTEXT: Record<string, string> = {
  'Hurricane': 'Florida is one of the most hurricane-prone states. Hurricane season runs June 1 - November 30. Consider hurricane shutters, impact windows, and wind mitigation features.',
  'Flood': 'Florida experiences frequent flooding due to its low elevation, high water table, and tropical climate. Check flood zone status and consider flood insurance even outside SFHA zones.',
  'Severe Storm': 'Severe thunderstorms are common in Florida, particularly during summer months. Lightning strikes are a significant hazard.',
  'Tornado': 'Florida ranks among the top states for tornadoes. Most occur during summer thunderstorms and tropical systems.',
  'Fire': 'Wildfires can occur in Florida, particularly during dry seasons. Check if property is in a wildfire-urban interface zone.'
}

export async function getDisasterHistory(
  fipsCode: string,
  years: number = 25
): Promise<DisasterHistory> {
  try {
    // Validate FIPS code format
    if (!fipsCode || fipsCode.length < 5) {
      throw new Error('Invalid FIPS code format')
    }

    const stateCode = fipsCode.slice(0, 2)
    const countyCode = fipsCode.slice(2, 5)
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - years)

    // Build OpenFEMA query
    const url = new URL('https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries')
    url.searchParams.set('$filter', `fipsStateCode eq '${stateCode}' and fipsCountyCode eq '${countyCode}' and declarationDate ge '${startDate.toISOString().split('T')[0]}'`)
    url.searchParams.set('$orderby', 'declarationDate desc')
    url.searchParams.set('$top', '1000')
    url.searchParams.set('$select', 'id,disasterNumber,incidentType,declarationTitle,state,declarationDate,incidentBeginDate,incidentEndDate,designatedArea,ihProgramDeclared,iaProgramDeclared,paProgramDeclared,hmProgramDeclared,fipsStateCode,fipsCountyCode')

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CRRealtorPlatform/1.0'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`OpenFEMA API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const rawDisasters = data.DisasterDeclarationsSummaries || []

    // Process and deduplicate disasters (same disaster number = same event)
    const uniqueDisasters = new Map<number, DisasterEvent>()
    
    rawDisasters.forEach((d: any) => {
      if (!uniqueDisasters.has(d.disasterNumber)) {
        const programs: string[] = []
        if (d.ihProgramDeclared) programs.push('Individual & Households')
        if (d.iaProgramDeclared) programs.push('Individual Assistance')
        if (d.paProgramDeclared) programs.push('Public Assistance')
        if (d.hmProgramDeclared) programs.push('Hazard Mitigation')

        uniqueDisasters.set(d.disasterNumber, {
          id: d.id,
          disasterNumber: d.disasterNumber,
          type: d.incidentType,
          title: d.declarationTitle,
          state: d.state,
          declarationDate: d.declarationDate,
          incidentBeginDate: d.incidentBeginDate,
          incidentEndDate: d.incidentEndDate,
          designatedArea: d.designatedArea,
          assistancePrograms: programs,
          fipsCode: `${d.fipsStateCode}${d.fipsCountyCode}`
        })
      }
    })

    const disasters = Array.from(uniqueDisasters.values())

    // Count by type
    const disastersByType: Record<string, number> = {}
    disasters.forEach(d => {
      disastersByType[d.type] = (disastersByType[d.type] || 0) + 1
    })

    // Find most common type
    const sortedTypes = Object.entries(disastersByType).sort((a, b) => b[1] - a[1])
    const mostCommonType = sortedTypes[0]?.[0] || 'None'

    // Calculate average per year
    const avgPerYear = disasters.length / years

    // Get Florida-specific context if applicable
    let floridaContext: string | undefined
    if (stateCode === '12') { // Florida FIPS code
      floridaContext = FLORIDA_DISASTER_CONTEXT[mostCommonType]
    }

    // Determine county name from first disaster or use FIPS
    const countyName = disasters[0]?.designatedArea || `County ${countyCode}`
    const stateName = disasters[0]?.state || getStateFromFips(stateCode)

    return {
      county: countyName,
      state: stateName,
      fipsCode,
      disasters,
      totalDisasters: disasters.length,
      disastersByType,
      lastDisaster: disasters[0],
      mostCommonType,
      averageDisastersPerYear: Math.round(avgPerYear * 100) / 100,
      riskAssessment: generateRiskAssessment(disasters.length, avgPerYear, mostCommonType, years),
      floridaSpecificContext: floridaContext,
      queriedAt: new Date().toISOString(),
      yearsAnalyzed: years
    }
  } catch (error) {
    console.error('OpenFEMA API error:', error)
    return {
      county: 'Unknown',
      state: 'Unknown',
      fipsCode,
      disasters: [],
      totalDisasters: 0,
      disastersByType: {},
      mostCommonType: 'Unknown',
      averageDisastersPerYear: 0,
      riskAssessment: 'Unable to retrieve disaster history. Please check FEMA resources directly at https://www.fema.gov/disaster/declarations',
      queriedAt: new Date().toISOString(),
      yearsAnalyzed: years
    }
  }
}

function generateRiskAssessment(
  total: number,
  avgPerYear: number,
  mostCommonType: string,
  years: number
): string {
  if (total === 0) {
    return `No federally-declared disasters have been recorded for this county in the past ${years} years. This indicates relatively low disaster risk, though local incidents may occur that don't reach federal declaration thresholds.`
  }

  if (avgPerYear < 0.5) {
    return `This county has experienced ${total} federally-declared disaster${total > 1 ? 's' : ''} over the past ${years} years (averaging less than one every two years). The most common type is ${mostCommonType.toLowerCase()}. This represents relatively low historical disaster frequency, though preparedness is always recommended.`
  }

  if (avgPerYear < 1) {
    return `This county averages about ${avgPerYear.toFixed(1)} federally-declared disasters per year over the past ${years} years. ${mostCommonType} events are most common (${total} total events). This represents moderate disaster risk. Review insurance coverage and emergency preparedness plans.`
  }

  if (avgPerYear < 2) {
    return `This county has significant disaster history with approximately ${avgPerYear.toFixed(1)} federally-declared events per year. ${mostCommonType} is the primary hazard. Consider this in your insurance decisions and budget for potential disaster-related expenses. Verify the property has appropriate mitigation features.`
  }

  return `This county has a high frequency of federally-declared disasters, averaging ${avgPerYear.toFixed(1)} events per year over ${years} years. ${mostCommonType} events are most prevalent. This level of exposure warrants careful consideration of insurance coverage, property resilience features, and emergency preparedness. Consider requesting documentation of any property improvements that provide disaster protection.`
}

function getStateFromFips(fipsCode: string): string {
  const states: Record<string, string> = {
    '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas',
    '06': 'California', '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware',
    '11': 'DC', '12': 'Florida', '13': 'Georgia', '15': 'Hawaii',
    '16': 'Idaho', '17': 'Illinois', '18': 'Indiana', '19': 'Iowa',
    '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana', '23': 'Maine',
    '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota',
    '28': 'Mississippi', '29': 'Missouri', '30': 'Montana', '31': 'Nebraska',
    '32': 'Nevada', '33': 'New Hampshire', '34': 'New Jersey', '35': 'New Mexico',
    '36': 'New York', '37': 'North Carolina', '38': 'North Dakota', '39': 'Ohio',
    '40': 'Oklahoma', '41': 'Oregon', '42': 'Pennsylvania', '44': 'Rhode Island',
    '45': 'South Carolina', '46': 'South Dakota', '47': 'Tennessee', '48': 'Texas',
    '49': 'Utah', '50': 'Vermont', '51': 'Virginia', '53': 'Washington',
    '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming'
  }
  return states[fipsCode] || 'Unknown'
}

// Get disaster type icon for UI
export function getDisasterTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    'Hurricane': '🌀',
    'Flood': '🌊',
    'Severe Storm': '⛈️',
    'Tornado': '🌪️',
    'Fire': '🔥',
    'Earthquake': '🌍',
    'Snow': '❄️',
    'Drought': '☀️',
    'Coastal Storm': '🌊',
    'Severe Ice Storm': '🧊'
  }
  return icons[type] || '⚠️'
}

// Get disaster severity color
export function getDisasterSeverityColor(avgPerYear: number): string {
  if (avgPerYear < 0.5) return 'green'
  if (avgPerYear < 1) return 'yellow'
  if (avgPerYear < 2) return 'orange'
  return 'red'
}
