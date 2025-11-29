import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Neighborhood data API - provides local info for properties
// In production, integrate with Walk Score, GreatSchools, FBI Crime Data APIs

interface NeighborhoodData {
  walk_score: number
  transit_score: number
  bike_score: number
  schools: School[]
  demographics: Demographics
  nearby: NearbyPlace[]
  crime_index: number
  cost_of_living: number
}

interface School {
  name: string
  type: 'elementary' | 'middle' | 'high' | 'private'
  rating: number
  distance: number
  students: number
}

interface Demographics {
  median_age: number
  median_income: number
  population: number
  households: number
  owner_occupied: number
  renter_occupied: number
}

interface NearbyPlace {
  name: string
  type: string
  distance: number
  rating?: number
}

// Sample data generator based on ZIP code
function generateNeighborhoodData(zip: string, city: string): NeighborhoodData {
  // Seed randomness based on ZIP for consistency
  const seed = parseInt(zip) || 33901
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
  }

  // Florida city data approximations
  const cityData: Record<string, Partial<NeighborhoodData>> = {
    'Naples': { walk_score: 45, transit_score: 25, bike_score: 55, crime_index: 22, cost_of_living: 115 },
    'Fort Myers': { walk_score: 35, transit_score: 20, bike_score: 45, crime_index: 35, cost_of_living: 98 },
    'Bonita Springs': { walk_score: 30, transit_score: 15, bike_score: 40, crime_index: 18, cost_of_living: 108 },
    'Cape Coral': { walk_score: 25, transit_score: 10, bike_score: 50, crime_index: 28, cost_of_living: 95 },
    'Marco Island': { walk_score: 40, transit_score: 12, bike_score: 60, crime_index: 12, cost_of_living: 125 },
    'Estero': { walk_score: 28, transit_score: 15, bike_score: 42, crime_index: 15, cost_of_living: 105 },
  }

  const base = cityData[city] || { walk_score: 35, transit_score: 18, bike_score: 45, crime_index: 25, cost_of_living: 100 }

  // Generate schools
  const schoolTypes: Array<'elementary' | 'middle' | 'high' | 'private'> = ['elementary', 'middle', 'high', 'private']
  const schools: School[] = [
    { name: `${city} Elementary School`, type: 'elementary', rating: random(6, 9), distance: random(5, 20) / 10, students: random(400, 800) },
    { name: `${city} Middle School`, type: 'middle', rating: random(5, 9), distance: random(10, 30) / 10, students: random(600, 1200) },
    { name: `${city} High School`, type: 'high', rating: random(6, 9), distance: random(15, 40) / 10, students: random(1000, 2500) },
    { name: `St. ${['Mary', 'John', 'Joseph', 'Patrick'][random(0, 3)]}'s Academy`, type: 'private', rating: random(7, 10), distance: random(20, 50) / 10, students: random(200, 500) },
  ]

  // Generate nearby places
  const nearby: NearbyPlace[] = [
    { name: 'Publix Super Market', type: 'Grocery', distance: random(3, 15) / 10, rating: 4.5 },
    { name: 'Starbucks', type: 'Coffee', distance: random(5, 20) / 10, rating: 4.3 },
    { name: `${city} Medical Center`, type: 'Hospital', distance: random(10, 40) / 10, rating: 4.2 },
    { name: `${city} Community Park`, type: 'Park', distance: random(2, 12) / 10, rating: 4.6 },
    { name: 'LA Fitness', type: 'Gym', distance: random(8, 25) / 10, rating: 4.1 },
    { name: `${city} Public Library`, type: 'Library', distance: random(10, 30) / 10, rating: 4.7 },
    { name: 'Walgreens', type: 'Pharmacy', distance: random(3, 15) / 10, rating: 4.0 },
    { name: `${city} Beach`, type: 'Beach', distance: random(5, 50) / 10, rating: 4.8 },
  ]

  // Demographics
  const demographics: Demographics = {
    median_age: random(38, 55),
    median_income: random(55000, 120000),
    population: random(15000, 85000),
    households: random(6000, 35000),
    owner_occupied: random(55, 80),
    renter_occupied: random(20, 45),
  }

  return {
    walk_score: base.walk_score || 35,
    transit_score: base.transit_score || 18,
    bike_score: base.bike_score || 45,
    schools,
    demographics,
    nearby,
    crime_index: base.crime_index || 25,
    cost_of_living: base.cost_of_living || 100,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get('zip') || '33901'
  const city = searchParams.get('city') || 'Fort Myers'

  const data = generateNeighborhoodData(zip, city)

  return NextResponse.json(data)
}
