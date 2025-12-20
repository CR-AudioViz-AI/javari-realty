import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''
const API_HOST = 'idealspot-geodata.p.rapidapi.com'

interface DemographicsData {
  location: {
    lat: number
    lng: number
    address?: string
    city?: string
    state?: string
    zip?: string
  }
  population: {
    total: number
    density: number
    growth: number
  }
  income: {
    median: number
    average: number
    perCapita: number
  }
  housing: {
    medianValue: number
    medianRent: number
    ownerOccupied: number
    renterOccupied: number
    vacancyRate: number
  }
  age: {
    median: number
    under18: number
    over65: number
    workingAge: number
  }
  education: {
    highSchool: number
    bachelors: number
    graduate: number
  }
  employment: {
    rate: number
    unemploymentRate: number
    laborForce: number
  }
  traffic: {
    dailyVolume?: number
    peakHours?: string[]
    segments?: any[]
  }
  insights: {
    marketScore: number
    growthPotential: string
    investmentRating: string
  }
}

// Get demographics by lat/lng
async function getDemographicsByCoordinates(lat: number, lng: number): Promise<DemographicsData | null> {
  try {
    const response = await fetch(
      `https://${API_HOST}/api/v1/geometries/regions/intersecting/${lat}/${lng}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      }
    )

    if (!response.ok) {
      console.error('IdealSpot API error:', response.status)
      return null
    }

    const data = await response.json()
    
    // Parse the response and extract demographics
    return {
      location: {
        lat,
        lng,
        city: data.city || data.place_name,
        state: data.state || data.region,
        zip: data.postal_code || data.zip
      },
      population: {
        total: data.population?.total || data.pop_total || 0,
        density: data.population?.density || data.pop_density || 0,
        growth: data.population?.growth || data.pop_growth || 0
      },
      income: {
        median: data.income?.median || data.median_income || 0,
        average: data.income?.average || data.avg_income || 0,
        perCapita: data.income?.perCapita || data.per_capita_income || 0
      },
      housing: {
        medianValue: data.housing?.medianValue || data.median_home_value || 0,
        medianRent: data.housing?.medianRent || data.median_rent || 0,
        ownerOccupied: data.housing?.ownerOccupied || 0,
        renterOccupied: data.housing?.renterOccupied || 0,
        vacancyRate: data.housing?.vacancyRate || 0
      },
      age: {
        median: data.age?.median || data.median_age || 0,
        under18: data.age?.under18 || 0,
        over65: data.age?.over65 || 0,
        workingAge: data.age?.workingAge || 0
      },
      education: {
        highSchool: data.education?.highSchool || 0,
        bachelors: data.education?.bachelors || 0,
        graduate: data.education?.graduate || 0
      },
      employment: {
        rate: data.employment?.rate || 0,
        unemploymentRate: data.employment?.unemploymentRate || data.unemployment_rate || 0,
        laborForce: data.employment?.laborForce || 0
      },
      traffic: {
        dailyVolume: data.traffic?.dailyVolume,
        peakHours: data.traffic?.peakHours,
        segments: data.traffic?.segments
      },
      insights: {
        marketScore: calculateMarketScore(data),
        growthPotential: determineGrowthPotential(data),
        investmentRating: determineInvestmentRating(data)
      }
    }
  } catch (error) {
    console.error('Demographics fetch error:', error)
    return null
  }
}

// Get vehicle traffic data
async function getTrafficData(lat: number, lng: number): Promise<any> {
  try {
    const response = await fetch(
      `https://${API_HOST}/api/v1/traffic/search-road-segments?lat=${lat}&lng=${lng}&radius=1000`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      }
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Traffic data error:', error)
    return null
  }
}

// Calculate market score (0-100)
function calculateMarketScore(data: any): number {
  let score = 50 // Base score

  // Income factors
  if (data.median_income > 75000) score += 15
  else if (data.median_income > 50000) score += 10
  else if (data.median_income > 35000) score += 5

  // Population growth
  if (data.pop_growth > 0.02) score += 10
  else if (data.pop_growth > 0.01) score += 5
  else if (data.pop_growth < 0) score -= 5

  // Home values
  if (data.median_home_value > 300000) score += 10
  else if (data.median_home_value > 200000) score += 5

  // Education
  if (data.bachelors_rate > 0.4) score += 5
  else if (data.bachelors_rate > 0.25) score += 3

  // Employment
  if (data.unemployment_rate < 0.04) score += 5
  else if (data.unemployment_rate > 0.08) score -= 5

  return Math.min(100, Math.max(0, score))
}

// Determine growth potential
function determineGrowthPotential(data: any): string {
  const popGrowth = data.pop_growth || 0
  const incomeGrowth = data.income_growth || 0

  if (popGrowth > 0.02 && incomeGrowth > 0.03) return 'High'
  if (popGrowth > 0.01 || incomeGrowth > 0.02) return 'Moderate'
  if (popGrowth < 0 || incomeGrowth < 0) return 'Low'
  return 'Stable'
}

// Determine investment rating
function determineInvestmentRating(data: any): string {
  const score = calculateMarketScore(data)
  
  if (score >= 80) return 'A - Excellent'
  if (score >= 70) return 'B - Good'
  if (score >= 60) return 'C - Average'
  if (score >= 50) return 'D - Below Average'
  return 'F - Poor'
}

// Geocode address to coordinates (simple fallback)
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // For now, return null - would need a geocoding API
  // The frontend should provide lat/lng when possible
  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const address = searchParams.get('address')
  const includeTraffic = searchParams.get('traffic') === 'true'

  if (!lat || !lng) {
    if (address) {
      // Try to geocode
      const coords = await geocodeAddress(address)
      if (!coords) {
        return NextResponse.json({
          error: 'Please provide lat and lng coordinates',
          tip: 'Address geocoding requires coordinates. Use lat and lng parameters.',
          demographics: null
        }, { status: 400 })
      }
    } else {
      return NextResponse.json({
        error: 'Please provide lat and lng coordinates',
        demographics: null
      }, { status: 400 })
    }
  }

  if (!RAPIDAPI_KEY) {
    return NextResponse.json({
      error: 'RapidAPI key not configured',
      demographics: null
    }, { status: 500 })
  }

  try {
    const latitude = parseFloat(lat!)
    const longitude = parseFloat(lng!)

    const [demographics, traffic] = await Promise.all([
      getDemographicsByCoordinates(latitude, longitude),
      includeTraffic ? getTrafficData(latitude, longitude) : null
    ])

    if (demographics) {
      if (traffic) {
        demographics.traffic = traffic
      }

      return NextResponse.json({
        success: true,
        demographics,
        source: 'IdealSpot Geodata'
      })
    } else {
      // Return sample data for SW Florida as fallback
      return NextResponse.json({
        success: true,
        demographics: getSampleDemographics(latitude, longitude),
        source: 'Sample Data (API unavailable)',
        note: 'Using sample data for demonstration'
      })
    }
  } catch (error) {
    console.error('Demographics error:', error)
    return NextResponse.json({
      error: 'Failed to fetch demographics',
      demographics: null
    }, { status: 500 })
  }
}

// Sample demographics for SW Florida area
function getSampleDemographics(lat: number, lng: number): DemographicsData {
  // Determine area based on coordinates
  let city = 'Fort Myers'
  let medianIncome = 58000
  let medianHomeValue = 375000
  
  if (lat > 26.5) {
    city = 'Cape Coral'
    medianIncome = 62000
    medianHomeValue = 385000
  } else if (lat < 26.2) {
    city = 'Naples'
    medianIncome = 85000
    medianHomeValue = 625000
  }

  return {
    location: {
      lat,
      lng,
      city,
      state: 'FL',
      zip: '33901'
    },
    population: {
      total: 95000,
      density: 2150,
      growth: 0.028
    },
    income: {
      median: medianIncome,
      average: medianIncome * 1.15,
      perCapita: medianIncome * 0.45
    },
    housing: {
      medianValue: medianHomeValue,
      medianRent: Math.round(medianHomeValue * 0.005),
      ownerOccupied: 65,
      renterOccupied: 35,
      vacancyRate: 8.5
    },
    age: {
      median: 42,
      under18: 18,
      over65: 24,
      workingAge: 58
    },
    education: {
      highSchool: 89,
      bachelors: 32,
      graduate: 12
    },
    employment: {
      rate: 95.2,
      unemploymentRate: 4.8,
      laborForce: 52000
    },
    traffic: {
      dailyVolume: 15000,
      peakHours: ['7:30 AM - 9:00 AM', '4:30 PM - 6:30 PM']
    },
    insights: {
      marketScore: 72,
      growthPotential: 'High',
      investmentRating: 'B - Good'
    }
  }
}
