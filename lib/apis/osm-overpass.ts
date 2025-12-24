/**
 * OpenStreetMap Overpass API
 * FREE - No API key required
 * 
 * Provides POIs, amenities, and location intelligence
 * Source: https://overpass-api.de/
 */

interface NearbyAmenity {
  type: string
  category: string
  name: string
  distance: number // meters
  lat: number
  lng: number
  tags?: Record<string, string>
}

interface LocationIntelligence {
  walkability: {
    score: number
    label: string
    nearbyCount: number
  }
  amenities: {
    restaurants: number
    groceryStores: number
    cafes: number
    bars: number
    parks: number
    schools: number
    hospitals: number
    pharmacies: number
    banks: number
    gasStations: number
    gyms: number
    transit: number
  }
  nearestAmenities: NearbyAmenity[]
  source: string
}

// Amenity categories for Overpass queries
const AMENITY_CATEGORIES = {
  restaurants: ['restaurant', 'fast_food'],
  groceryStores: ['supermarket', 'grocery', 'convenience'],
  cafes: ['cafe', 'coffee'],
  bars: ['bar', 'pub', 'nightclub'],
  parks: ['park', 'playground', 'recreation_ground'],
  schools: ['school', 'kindergarten', 'college', 'university'],
  hospitals: ['hospital', 'clinic', 'doctors'],
  pharmacies: ['pharmacy'],
  banks: ['bank', 'atm'],
  gasStations: ['fuel'],
  gyms: ['gym', 'fitness_centre', 'sports_centre'],
  transit: ['bus_station', 'subway_entrance', 'train_station']
}

/**
 * Get nearby amenities and calculate walkability score
 */
export async function getLocationIntelligence(
  lat: number, 
  lng: number, 
  radiusMeters: number = 1000
): Promise<LocationIntelligence> {
  try {
    // Build Overpass query for all amenity types
    const amenityTypes = Object.values(AMENITY_CATEGORIES).flat()
    const query = buildOverpassQuery(lat, lng, radiusMeters, amenityTypes)
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodeURIComponent(query)}`
    })
    
    if (!response.ok) {
      console.error('Overpass API error:', response.status)
      return getEmptyResult()
    }
    
    const data = await response.json()
    const elements = data.elements || []
    
    // Process results
    const amenities = processAmenities(elements, lat, lng)
    const counts = countByCategory(elements)
    const walkScore = calculateWalkScore(counts)
    
    return {
      walkability: {
        score: walkScore.score,
        label: walkScore.label,
        nearbyCount: elements.length
      },
      amenities: counts,
      nearestAmenities: amenities.slice(0, 20), // Top 20 nearest
      source: 'OpenStreetMap'
    }
    
  } catch (error) {
    console.error('Overpass API error:', error)
    return getEmptyResult()
  }
}

function buildOverpassQuery(lat: number, lng: number, radius: number, types: string[]): string {
  const amenityFilter = types.map(t => `node["amenity"="${t}"](around:${radius},${lat},${lng});`).join('\n')
  const leisureFilter = `node["leisure"~"park|playground|sports_centre|fitness_centre"](around:${radius},${lat},${lng});`
  const shopFilter = `node["shop"~"supermarket|grocery|convenience"](around:${radius},${lat},${lng});`
  
  return `
    [out:json][timeout:30];
    (
      ${amenityFilter}
      ${leisureFilter}
      ${shopFilter}
    );
    out body;
  `
}

function processAmenities(elements: any[], centerLat: number, centerLng: number): NearbyAmenity[] {
  return elements
    .map(el => {
      const lat = el.lat
      const lng = el.lon
      const distance = calculateDistance(centerLat, centerLng, lat, lng)
      
      return {
        type: el.tags?.amenity || el.tags?.leisure || el.tags?.shop || 'unknown',
        category: getCategoryForType(el.tags?.amenity || el.tags?.leisure || el.tags?.shop),
        name: el.tags?.name || 'Unnamed',
        distance: Math.round(distance),
        lat,
        lng,
        tags: el.tags
      }
    })
    .sort((a, b) => a.distance - b.distance)
}

function getCategoryForType(type: string): string {
  for (const [category, types] of Object.entries(AMENITY_CATEGORIES)) {
    if (types.includes(type)) return category
  }
  return 'other'
}

function countByCategory(elements: any[]): LocationIntelligence['amenities'] {
  const counts: LocationIntelligence['amenities'] = {
    restaurants: 0,
    groceryStores: 0,
    cafes: 0,
    bars: 0,
    parks: 0,
    schools: 0,
    hospitals: 0,
    pharmacies: 0,
    banks: 0,
    gasStations: 0,
    gyms: 0,
    transit: 0
  }
  
  elements.forEach(el => {
    const type = el.tags?.amenity || el.tags?.leisure || el.tags?.shop
    
    for (const [category, types] of Object.entries(AMENITY_CATEGORIES)) {
      if (types.includes(type)) {
        counts[category as keyof typeof counts]++
        break
      }
    }
  })
  
  return counts
}

function calculateWalkScore(counts: LocationIntelligence['amenities']): { score: number; label: string } {
  // Simplified walk score calculation based on nearby amenities
  // Real Walk Score uses more complex algorithm, but this gives good approximation
  
  let score = 0
  
  // Essential amenities (higher weight)
  score += Math.min(counts.groceryStores * 15, 30)
  score += Math.min(counts.restaurants * 5, 20)
  score += Math.min(counts.cafes * 3, 10)
  
  // Convenience (medium weight)
  score += Math.min(counts.pharmacies * 5, 10)
  score += Math.min(counts.banks * 3, 5)
  score += Math.min(counts.gasStations * 2, 5)
  
  // Recreation & lifestyle
  score += Math.min(counts.parks * 3, 10)
  score += Math.min(counts.gyms * 3, 5)
  score += Math.min(counts.bars * 2, 5)
  
  // Transit bonus
  score += Math.min(counts.transit * 5, 10)
  
  // Cap at 100
  score = Math.min(score, 100)
  
  // Determine label
  let label: string
  if (score >= 90) label = "Walker's Paradise"
  else if (score >= 70) label = "Very Walkable"
  else if (score >= 50) label = "Somewhat Walkable"
  else if (score >= 25) label = "Car-Dependent"
  else label = "Almost All Errands Require a Car"
  
  return { score, label }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // Haversine formula for distance in meters
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function getEmptyResult(): LocationIntelligence {
  return {
    walkability: { score: 0, label: 'Unknown', nearbyCount: 0 },
    amenities: {
      restaurants: 0, groceryStores: 0, cafes: 0, bars: 0,
      parks: 0, schools: 0, hospitals: 0, pharmacies: 0,
      banks: 0, gasStations: 0, gyms: 0, transit: 0
    },
    nearestAmenities: [],
    source: 'OpenStreetMap'
  }
}

/**
 * Get specific amenity type nearby
 */
export async function getNearbyByType(
  lat: number, 
  lng: number, 
  type: keyof typeof AMENITY_CATEGORIES,
  radiusMeters: number = 2000
): Promise<NearbyAmenity[]> {
  try {
    const types = AMENITY_CATEGORIES[type]
    const query = buildOverpassQuery(lat, lng, radiusMeters, types)
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    return processAmenities(data.elements || [], lat, lng)
    
  } catch (error) {
    console.error('Overpass query error:', error)
    return []
  }
}
