// lib/apis/census-demographics.ts
// US Census Bureau API - FREE (no key required for basic queries)
// Source: https://api.census.gov/data.html

export interface DemographicData {
  population: number
  medianAge: number
  medianHouseholdIncome: number
  medianHomeValue: number
  ownerOccupiedPercent: number
  renterOccupiedPercent: number
  vacancyRate: number
  educationBachelorPlus: number
  povertyRate: number
  unemploymentRate: number
  householdSize: number
  totalHousingUnits: number
  builtBefore1980Percent: number
  sourceUrl: string
  censusTract: string
  county: string
  state: string
}

// Florida county FIPS codes
export const FLORIDA_COUNTIES: Record<string, string> = {
  'Lee': '071', 'Collier': '021', 'Charlotte': '015', 'Hendry': '051',
  'Glades': '043', 'Sarasota': '115', 'Manatee': '081', 'Hillsborough': '057',
  'Pinellas': '103', 'Pasco': '101', 'Polk': '105', 'Orange': '095',
  'Osceola': '097', 'Seminole': '117', 'Volusia': '127', 'Brevard': '009',
  'Miami-Dade': '086', 'Broward': '011', 'Palm Beach': '099', 'Martin': '085',
  'St. Lucie': '111', 'Indian River': '061', 'Duval': '031', 'Clay': '019',
  'St. Johns': '109', 'Nassau': '089', 'Alachua': '001', 'Marion': '083',
  'Lake': '069', 'Sumter': '119', 'Citrus': '017', 'Hernando': '053'
}

export async function getDemographics(
  stateCode: string = '12', // Florida = 12
  countyCode: string,
  tractCode?: string
): Promise<DemographicData | null> {
  try {
    // ACS 5-Year Estimates - most reliable for small areas
    const variables = [
      'B01003_001E', // Total population
      'B01002_001E', // Median age
      'B19013_001E', // Median household income
      'B25077_001E', // Median home value
      'B25003_002E', // Owner occupied
      'B25003_003E', // Renter occupied
      'B25002_003E', // Vacant units
      'B25002_001E', // Total housing units
      'B15003_022E', // Bachelor's degree
      'B15003_023E', // Master's degree
      'B15003_024E', // Professional degree
      'B15003_025E', // Doctorate
      'B15003_001E', // Total education population
      'B17001_002E', // Below poverty
      'B17001_001E', // Total for poverty calc
      'B23025_005E', // Unemployed
      'B23025_002E', // Labor force
      'B25034_008E', // Built 1970-1979
      'B25034_009E', // Built 1960-1969
      'B25034_010E', // Built 1950-1959
      'B25034_011E', // Built 1940-1949
      'B11001_001E'  // Total households
    ].join(',')

    let geoQuery = `state:${stateCode}&in=county:${countyCode}`
    if (tractCode) {
      geoQuery = `tract:${tractCode}&in=state:${stateCode}&in=county:${countyCode}`
    }

    const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,${variables}&for=${tractCode ? 'tract' : 'county'}:${tractCode || countyCode}&in=state:${stateCode}`
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      console.error('Census API error:', response.status)
      return null
    }

    const data = await response.json()
    
    if (!data || data.length < 2) {
      return null
    }

    const headers = data[0]
    const values = data[1]
    
    const getValue = (varName: string): number => {
      const idx = headers.indexOf(varName)
      return idx >= 0 ? parseInt(values[idx]) || 0 : 0
    }

    const population = getValue('B01003_001E')
    const ownerOccupied = getValue('B25003_002E')
    const renterOccupied = getValue('B25003_003E')
    const totalOccupied = ownerOccupied + renterOccupied
    const totalHousingUnits = getValue('B25002_001E')
    const vacantUnits = getValue('B25002_003E')
    
    const bachelors = getValue('B15003_022E')
    const masters = getValue('B15003_023E')
    const professional = getValue('B15003_024E')
    const doctorate = getValue('B15003_025E')
    const totalEducation = getValue('B15003_001E')
    
    const belowPoverty = getValue('B17001_002E')
    const totalPoverty = getValue('B17001_001E')
    
    const unemployed = getValue('B23025_005E')
    const laborForce = getValue('B23025_002E')
    
    const built70s = getValue('B25034_008E')
    const built60s = getValue('B25034_009E')
    const built50s = getValue('B25034_010E')
    const built40s = getValue('B25034_011E')
    const builtBefore1980 = built70s + built60s + built50s + built40s

    const totalHouseholds = getValue('B11001_001E')

    return {
      population,
      medianAge: getValue('B01002_001E'),
      medianHouseholdIncome: getValue('B19013_001E'),
      medianHomeValue: getValue('B25077_001E'),
      ownerOccupiedPercent: totalOccupied > 0 ? Math.round((ownerOccupied / totalOccupied) * 100) : 0,
      renterOccupiedPercent: totalOccupied > 0 ? Math.round((renterOccupied / totalOccupied) * 100) : 0,
      vacancyRate: totalHousingUnits > 0 ? Math.round((vacantUnits / totalHousingUnits) * 100) : 0,
      educationBachelorPlus: totalEducation > 0 ? Math.round(((bachelors + masters + professional + doctorate) / totalEducation) * 100) : 0,
      povertyRate: totalPoverty > 0 ? Math.round((belowPoverty / totalPoverty) * 100) : 0,
      unemploymentRate: laborForce > 0 ? Math.round((unemployed / laborForce) * 100) : 0,
      householdSize: totalHouseholds > 0 ? Math.round((population / totalHouseholds) * 10) / 10 : 0,
      totalHousingUnits,
      builtBefore1980Percent: totalHousingUnits > 0 ? Math.round((builtBefore1980 / totalHousingUnits) * 100) : 0,
      sourceUrl: 'https://data.census.gov/',
      censusTract: tractCode || '',
      county: values[headers.indexOf('NAME')]?.split(',')[0] || '',
      state: 'Florida'
    }
  } catch (error) {
    console.error('Census demographics error:', error)
    return null
  }
}

// Get demographics by address using geocoding
export async function getDemographicsByAddress(address: string): Promise<DemographicData | null> {
  try {
    // First geocode the address to get census tract
    const geocodeUrl = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encodeURIComponent(address)}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`
    
    const geoResponse = await fetch(geocodeUrl)
    const geoData = await geoResponse.json()
    
    if (!geoData.result?.addressMatches?.[0]?.geographies?.['Census Tracts']?.[0]) {
      return null
    }

    const tract = geoData.result.addressMatches[0].geographies['Census Tracts'][0]
    const stateCode = tract.STATE
    const countyCode = tract.COUNTY
    const tractCode = tract.TRACT

    return getDemographics(stateCode, countyCode, tractCode)
  } catch (error) {
    console.error('Address demographics error:', error)
    return null
  }
}

// Helper to format currency
export function formatDemographicCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

// Helper to get demographic comparison
export function getDemographicComparison(value: number, stateAverage: number): { label: string; color: string } {
  const ratio = value / stateAverage
  if (ratio >= 1.2) return { label: 'Above Average', color: 'green' }
  if (ratio >= 0.8) return { label: 'Average', color: 'gray' }
  return { label: 'Below Average', color: 'orange' }
}

// Florida state averages for comparison
export const FLORIDA_AVERAGES = {
  medianHouseholdIncome: 63062,
  medianHomeValue: 392900,
  ownerOccupiedPercent: 67,
  educationBachelorPlus: 32,
  povertyRate: 12,
  unemploymentRate: 3,
  medianAge: 42
}
