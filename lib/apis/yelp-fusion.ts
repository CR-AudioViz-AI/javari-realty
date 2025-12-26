// Build: 20251226003648
// lib/apis/yelp-fusion.ts
// Yelp Fusion API integration for nearby businesses, restaurants, reviews
// API Docs: https://docs.developer.yelp.com/docs/fusion-intro
// Added: December 25, 2025

export interface YelpBusiness {
  id: string
  name: string
  alias: string
  imageUrl: string
  isClosed: boolean
  url: string
  reviewCount: number
  rating: number
  coordinates: {
    latitude: number
    longitude: number
  }
  price?: string // $, $$, $$$, $$$$
  phone: string
  displayPhone: string
  distance: number // meters
  categories: Array<{
    alias: string
    title: string
  }>
  location: {
    address1: string
    address2?: string
    address3?: string
    city: string
    state: string
    zipCode: string
    country: string
    displayAddress: string[]
  }
  transactions: string[] // delivery, pickup, restaurant_reservation
}

export interface YelpSearchResponse {
  success: boolean
  total: number
  businesses: YelpBusiness[]
  region?: {
    center: {
      latitude: number
      longitude: number
    }
  }
  error?: string
  queriedAt: string
}

export interface YelpSearchParams {
  latitude: number
  longitude: number
  term?: string // Search term (e.g., "restaurants", "coffee")
  categories?: string[] // Category aliases (e.g., ["restaurants", "coffee"])
  radius?: number // Search radius in meters (max 40000)
  limit?: number // Number of results (max 50)
  offset?: number // Pagination offset
  sortBy?: 'best_match' | 'rating' | 'review_count' | 'distance'
  price?: ('1' | '2' | '3' | '4')[] // Price levels to filter
  openNow?: boolean
  attributes?: string[] // hot_and_new, reservation, deals, etc.
}

// Common category groups for property search
export const PROPERTY_CATEGORIES = {
  dining: ['restaurants', 'bars', 'coffee', 'breakfast_brunch'],
  groceries: ['grocery', 'farmersmarket', 'organic_stores'],
  fitness: ['gyms', 'yoga', 'pilates', 'sports_clubs'],
  entertainment: ['movietheaters', 'museums', 'parks', 'bowling'],
  services: ['banks', 'drycleaners', 'post_offices', 'pharmacy'],
  healthcare: ['hospitals', 'physicians', 'dentists', 'urgentcare'],
  education: ['preschools', 'elementaryschools', 'highschools', 'collegeuniv'],
  shopping: ['shopping', 'malls', 'fashion'],
  pets: ['petstore', 'veterinarians', 'dog_parks'],
}

/**
 * Searches for businesses near a location using Yelp Fusion API
 */
export async function searchYelpBusinesses(
  params: YelpSearchParams
): Promise<YelpSearchResponse> {
  const apiKey = process.env.YELP_API_KEY

  if (!apiKey) {
    return {
      success: false,
      total: 0,
      businesses: [],
      error: 'Yelp API key not configured',
      queriedAt: new Date().toISOString(),
    }
  }

  try {
    const searchParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      limit: (params.limit || 20).toString(),
      sort_by: params.sortBy || 'distance',
    })

    if (params.term) {
      searchParams.append('term', params.term)
    }

    if (params.categories?.length) {
      searchParams.append('categories', params.categories.join(','))
    }

    if (params.radius) {
      // Yelp uses meters, max 40000
      searchParams.append('radius', Math.min(params.radius, 40000).toString())
    }

    if (params.offset) {
      searchParams.append('offset', params.offset.toString())
    }

    if (params.price?.length) {
      searchParams.append('price', params.price.join(','))
    }

    if (params.openNow) {
      searchParams.append('open_now', 'true')
    }

    if (params.attributes?.length) {
      searchParams.append('attributes', params.attributes.join(','))
    }

    const url = `https://api.yelp.com/v3/businesses/search?${searchParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      // Cache for 1 hour - business data updates moderately
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.description || `Yelp API error: ${response.status}`
      )
    }

    const data = await response.json()

    // Transform Yelp response to our format
    const businesses: YelpBusiness[] = (data.businesses || []).map((b: any) => ({
      id: b.id,
      name: b.name,
      alias: b.alias,
      imageUrl: b.image_url || '',
      isClosed: b.is_closed || false,
      url: b.url,
      reviewCount: b.review_count || 0,
      rating: b.rating || 0,
      coordinates: {
        latitude: b.coordinates?.latitude || params.latitude,
        longitude: b.coordinates?.longitude || params.longitude,
      },
      price: b.price,
      phone: b.phone || '',
      displayPhone: b.display_phone || '',
      distance: b.distance || 0,
      categories: (b.categories || []).map((c: any) => ({
        alias: c.alias,
        title: c.title,
      })),
      location: {
        address1: b.location?.address1 || '',
        address2: b.location?.address2,
        address3: b.location?.address3,
        city: b.location?.city || '',
        state: b.location?.state || '',
        zipCode: b.location?.zip_code || '',
        country: b.location?.country || 'US',
        displayAddress: b.location?.display_address || [],
      },
      transactions: b.transactions || [],
    }))

    return {
      success: true,
      total: data.total || businesses.length,
      businesses,
      region: data.region,
      queriedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Yelp API error:', error)
    return {
      success: false,
      total: 0,
      businesses: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      queriedAt: new Date().toISOString(),
    }
  }
}

/**
 * Gets business details by Yelp ID
 */
export async function getYelpBusinessDetails(
  businessId: string
): Promise<{ success: boolean; business: YelpBusiness | null; error?: string }> {
  const apiKey = process.env.YELP_API_KEY

  if (!apiKey) {
    return {
      success: false,
      business: null,
      error: 'Yelp API key not configured',
    }
  }

  try {
    const url = `https://api.yelp.com/v3/businesses/${businessId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.status}`)
    }

    const b = await response.json()

    const business: YelpBusiness = {
      id: b.id,
      name: b.name,
      alias: b.alias,
      imageUrl: b.image_url || '',
      isClosed: b.is_closed || false,
      url: b.url,
      reviewCount: b.review_count || 0,
      rating: b.rating || 0,
      coordinates: {
        latitude: b.coordinates?.latitude || 0,
        longitude: b.coordinates?.longitude || 0,
      },
      price: b.price,
      phone: b.phone || '',
      displayPhone: b.display_phone || '',
      distance: 0,
      categories: (b.categories || []).map((c: any) => ({
        alias: c.alias,
        title: c.title,
      })),
      location: {
        address1: b.location?.address1 || '',
        address2: b.location?.address2,
        address3: b.location?.address3,
        city: b.location?.city || '',
        state: b.location?.state || '',
        zipCode: b.location?.zip_code || '',
        country: b.location?.country || 'US',
        displayAddress: b.location?.display_address || [],
      },
      transactions: b.transactions || [],
    }

    return { success: true, business }
  } catch (error) {
    return {
      success: false,
      business: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Gets nearby amenities summary for a property
 * Returns counts and top picks for each category
 */
export async function getNearbyAmenities(
  lat: number,
  lng: number,
  radiusMeters: number = 1609 // 1 mile default
): Promise<{
  success: boolean
  amenities: Record<string, { count: number; topPicks: YelpBusiness[] }>
  error?: string
  queriedAt: string
}> {
  const categories = ['restaurants', 'grocery', 'gyms', 'coffee', 'banks', 'pharmacy']
  const results: Record<string, { count: number; topPicks: YelpBusiness[] }> = {}

  try {
    // Fetch each category in parallel
    const promises = categories.map(async (category) => {
      const response = await searchYelpBusinesses({
        latitude: lat,
        longitude: lng,
        categories: [category],
        radius: radiusMeters,
        limit: 5,
        sortBy: 'rating',
      })

      return { category, response }
    })

    const responses = await Promise.all(promises)

    for (const { category, response } of responses) {
      if (response.success) {
        results[category] = {
          count: response.total,
          topPicks: response.businesses.slice(0, 3),
        }
      } else {
        results[category] = { count: 0, topPicks: [] }
      }
    }

    return {
      success: true,
      amenities: results,
      queriedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      amenities: {},
      error: error instanceof Error ? error.message : 'Unknown error',
      queriedAt: new Date().toISOString(),
    }
  }
}

/**
 * Convert meters to miles for display
 */
export function metersToMiles(meters: number): string {
  return (meters / 1609.34).toFixed(1)
}

/**
 * Get rating display (stars)
 */
export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
  
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
}
