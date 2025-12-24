/**
 * HUD Fair Market Rents API
 * FREE - No API key required
 * 
 * Provides official fair market rent data by ZIP code
 * Source: https://www.huduser.gov/portal/dataset/fmr-api.html
 */

interface FairMarketRent {
  year: number
  areaName: string
  countyName: string
  stateName: string
  stateCode: string
  metroName?: string
  efficiency: number  // Studio
  oneBedroom: number
  twoBedroom: number
  threeBedroom: number
  fourBedroom: number
  smallAreaFMR: boolean
  source: string
}

interface RentAffordability {
  bedroomType: string
  fmr: number
  requiredIncome: number  // Annual income needed (30% rule)
  hourlyWage: number      // Hourly wage needed (40 hrs/week)
  percentOfMedian: number // Compared to area median
}

/**
 * Get Fair Market Rents by ZIP code
 */
export async function getFairMarketRents(zipCode: string): Promise<FairMarketRent | null> {
  try {
    // HUD FMR API endpoint - no key required
    const currentYear = new Date().getFullYear()
    const url = `https://www.huduser.gov/hudapi/public/fmr/data/${zipCode}?year=${currentYear}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      // Try previous year if current year not available
      const prevUrl = `https://www.huduser.gov/hudapi/public/fmr/data/${zipCode}?year=${currentYear - 1}`
      const prevResponse = await fetch(prevUrl)
      
      if (!prevResponse.ok) {
        console.error('HUD FMR API error:', response.status)
        return null
      }
      
      return parseHUDResponse(await prevResponse.json(), currentYear - 1)
    }
    
    return parseHUDResponse(await response.json(), currentYear)
    
  } catch (error) {
    console.error('HUD FMR error:', error)
    return null
  }
}

function parseHUDResponse(data: any, year: number): FairMarketRent | null {
  if (!data || !data.data) return null
  
  const fmrData = data.data
  const basicData = fmrData.basicdata || fmrData
  
  return {
    year,
    areaName: basicData.area_name || 'Unknown Area',
    countyName: basicData.county_name || '',
    stateName: basicData.state_name || '',
    stateCode: basicData.state_code || '',
    metroName: basicData.metro_name,
    efficiency: basicData.Efficiency || basicData.fmr_0 || 0,
    oneBedroom: basicData['One-Bedroom'] || basicData.fmr_1 || 0,
    twoBedroom: basicData['Two-Bedroom'] || basicData.fmr_2 || 0,
    threeBedroom: basicData['Three-Bedroom'] || basicData.fmr_3 || 0,
    fourBedroom: basicData['Four-Bedroom'] || basicData.fmr_4 || 0,
    smallAreaFMR: basicData.smallarea_status === '1',
    source: 'HUD Fair Market Rents'
  }
}

/**
 * Calculate rent affordability based on FMR
 */
export function calculateRentAffordability(fmr: FairMarketRent, areaMedianIncome?: number): RentAffordability[] {
  const bedroomTypes = [
    { name: 'Studio', rent: fmr.efficiency },
    { name: '1 Bedroom', rent: fmr.oneBedroom },
    { name: '2 Bedroom', rent: fmr.twoBedroom },
    { name: '3 Bedroom', rent: fmr.threeBedroom },
    { name: '4 Bedroom', rent: fmr.fourBedroom },
  ]
  
  return bedroomTypes.map(type => {
    // 30% of gross income rule
    const annualRent = type.rent * 12
    const requiredIncome = Math.round(annualRent / 0.30)
    const hourlyWage = Math.round((requiredIncome / 52 / 40) * 100) / 100
    
    // Calculate as percent of area median income if provided
    const percentOfMedian = areaMedianIncome 
      ? Math.round((requiredIncome / areaMedianIncome) * 100)
      : 0
    
    return {
      bedroomType: type.name,
      fmr: type.rent,
      requiredIncome,
      hourlyWage,
      percentOfMedian
    }
  })
}

/**
 * Get rent comparison message
 */
export function getRentComparisonMessage(actualRent: number, fmr: number): {
  status: 'below' | 'at' | 'above'
  percentDiff: number
  message: string
} {
  const diff = actualRent - fmr
  const percentDiff = Math.round((diff / fmr) * 100)
  
  if (percentDiff < -10) {
    return {
      status: 'below',
      percentDiff,
      message: `This rent is ${Math.abs(percentDiff)}% below the Fair Market Rent. Great value!`
    }
  } else if (percentDiff > 10) {
    return {
      status: 'above',
      percentDiff,
      message: `This rent is ${percentDiff}% above the Fair Market Rent for this area.`
    }
  } else {
    return {
      status: 'at',
      percentDiff,
      message: `This rent is within 10% of the Fair Market Rent for this area.`
    }
  }
}
