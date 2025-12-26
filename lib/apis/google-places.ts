// lib/apis/google-places.ts
// Google Places API integration for nearby places, POIs, and place details
// API Docs: https://developers.google.com/maps/documentation/places/web-service
// Added: December 25, 2025

export interface GooglePlace {
  placeId: string
  name: string
  formattedAddress: string
  location: {
    lat: number
    lng: number
  }
  types: string[]
  rating?: number
  userRatingsTotal?: number
  priceLevel?: number // 0-4
  businessStatus?: string
  openNow?: boolean
  photos?: Array<{
    photoReference: string
    height: number
    width: number
    attributions: string[]
  }>
  icon?: string
  iconBackgroundColor?: string
  vicinity?: string
  plusCode?: {
    compoundCode: string
    globalCode: string
  }
  distanceMeters?: number
}

export interface NearbySearchResponse {
  success: boolean
  results: GooglePlace[]
  nextPageToken?: string
  error?: string
  queriedAt: string
}

export interface PlaceDetailsResponse {
  success: boolean
  place: GooglePlaceDetails | null
  error?: string
}

export interface GooglePlaceDetails extends GooglePlace {
  formattedPhoneNumber?: string
  internationalPhoneNumber?: string
  website?: string
  url?: string // Google Maps URL
  reviews?: Array<{
    authorName: string
    authorUrl?: string
    profilePhotoUrl?: string
    rating: number
    text: string
    time: number
    relativeTimeDescription: string
  }>
  openingHours?: {
    openNow: boolean
    periods: Array<{
      open: { day: number; time: string }
      close?: { day: number; time: string }
    }>
    weekdayText: string[]
  }
  utcOffset?: number
  addressComponents?: Array<{
    longName: string
    shortName: string
    types: string[]
  }>
}

// Place types useful for property search
export const PROPERTY_PLACE_TYPES = {
  food: ['restaurant', 'cafe', 'bakery', 'bar', 'meal_takeaway', 'meal_delivery'],
  shopping: ['shopping_mall', 'supermarket', 'grocery_or_supermarket', 'convenience_store'],
  health: ['hospital', 'doctor', 'dentist', 'pharmacy', 'physiotherapist'],
  education: ['school', 'primary_school', 'secondary_school', 'university'],
  recreation: ['park', 'gym', 'movie_theater', 'bowling_alley', 'spa'],
  transit: ['bus_station', 'subway_station', 'train_station', 'transit_station'],
  services: ['bank', 'atm', 'post_office', 'police', 'fire_station'],
  gas: ['gas_station', 'car_repair', 'car_wash'],
}

/**
 * Search for nearby places using Google Places API
 */
export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  options: {
    type?: string // Single type like 'restaurant', 'school'
    keyword?: string // Search keyword
    radius?: number // Meters (max 50000)
    minPrice?: number // 0-4
    maxPrice?: number // 0-4
    openNow?: boolean
    pageToken?: string
  } = {}
): Promise<NearbySearchResponse> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return {
      success: false,
      results: [],
      error: 'Google Maps API key not configured',
      queriedAt: new Date().toISOString(),
    }
  }

  try {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: (options.radius || 1609).toString(), // Default 1 mile
      key: apiKey,
    })

    if (options.type) {
      params.append('type', options.type)
    }

    if (options.keyword) {
      params.append('keyword', options.keyword)
    }

    if (options.minPrice !== undefined) {
      params.append('minprice', options.minPrice.toString())
    }

    if (options.maxPrice !== undefined) {
      params.append('maxprice', options.maxPrice.toString())
    }

    if (options.openNow) {
      params.append('opennow', 'true')
    }

    if (options.pageToken) {
      params.append('pagetoken', options.pageToken)
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }, // Cache 1 hour
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || `API status: ${data.status}`)
    }

    // Calculate distance from search point
    const calculateDistance = (placeLat: number, placeLng: number): number => {
      const R = 6371000 // Earth's radius in meters
      const dLat = ((placeLat - lat) * Math.PI) / 180
      const dLng = ((placeLng - lng) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((placeLat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    const results: GooglePlace[] = (data.results || []).map((p: any) => ({
      placeId: p.place_id,
      name: p.name,
      formattedAddress: p.formatted_address || p.vicinity || '',
      location: {
        lat: p.geometry?.location?.lat || lat,
        lng: p.geometry?.location?.lng || lng,
      },
      types: p.types || [],
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      priceLevel: p.price_level,
      businessStatus: p.business_status,
      openNow: p.opening_hours?.open_now,
      photos: p.photos?.map((photo: any) => ({
        photoReference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
        attributions: photo.html_attributions || [],
      })),
      icon: p.icon,
      iconBackgroundColor: p.icon_background_color,
      vicinity: p.vicinity,
      plusCode: p.plus_code
        ? {
            compoundCode: p.plus_code.compound_code,
            globalCode: p.plus_code.global_code,
          }
        : undefined,
      distanceMeters: calculateDistance(
        p.geometry?.location?.lat || lat,
        p.geometry?.location?.lng || lng
      ),
    }))

    // Sort by distance
    results.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0))

    return {
      success: true,
      results,
      nextPageToken: data.next_page_token,
      queriedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Google Places API error:', error)
    return {
      success: false,
      results: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      queriedAt: new Date().toISOString(),
    }
  }
}

/**
 * Get detailed place information by Place ID
 */
export async function getPlaceDetails(
  placeId: string,
  fields?: string[]
): Promise<PlaceDetailsResponse> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return {
      success: false,
      place: null,
      error: 'Google Maps API key not configured',
    }
  }

  try {
    const defaultFields = [
      'place_id',
      'name',
      'formatted_address',
      'geometry',
      'types',
      'rating',
      'user_ratings_total',
      'price_level',
      'business_status',
      'opening_hours',
      'formatted_phone_number',
      'international_phone_number',
      'website',
      'url',
      'reviews',
      'photos',
      'address_components',
    ]

    const params = new URLSearchParams({
      place_id: placeId,
      fields: (fields || defaultFields).join(','),
      key: apiKey,
    })

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      throw new Error(data.error_message || `API status: ${data.status}`)
    }

    const p = data.result

    const place: GooglePlaceDetails = {
      placeId: p.place_id,
      name: p.name,
      formattedAddress: p.formatted_address || '',
      location: {
        lat: p.geometry?.location?.lat || 0,
        lng: p.geometry?.location?.lng || 0,
      },
      types: p.types || [],
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      priceLevel: p.price_level,
      businessStatus: p.business_status,
      openNow: p.opening_hours?.open_now,
      photos: p.photos?.map((photo: any) => ({
        photoReference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
        attributions: photo.html_attributions || [],
      })),
      formattedPhoneNumber: p.formatted_phone_number,
      internationalPhoneNumber: p.international_phone_number,
      website: p.website,
      url: p.url,
      reviews: p.reviews?.map((r: any) => ({
        authorName: r.author_name,
        authorUrl: r.author_url,
        profilePhotoUrl: r.profile_photo_url,
        rating: r.rating,
        text: r.text,
        time: r.time,
        relativeTimeDescription: r.relative_time_description,
      })),
      openingHours: p.opening_hours
        ? {
            openNow: p.opening_hours.open_now,
            periods: p.opening_hours.periods || [],
            weekdayText: p.opening_hours.weekday_text || [],
          }
        : undefined,
      utcOffset: p.utc_offset,
      addressComponents: p.address_components?.map((ac: any) => ({
        longName: ac.long_name,
        shortName: ac.short_name,
        types: ac.types,
      })),
    }

    return { success: true, place }
  } catch (error) {
    console.error('Google Places Details error:', error)
    return {
      success: false,
      place: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get a photo URL from a photo reference
 */
export function getPhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return ''
  
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`
}

/**
 * Get nearby places summary for property intelligence
 */
export async function getNearbyPlacesSummary(
  lat: number,
  lng: number,
  radiusMeters: number = 1609
): Promise<{
  success: boolean
  summary: Record<string, { count: number; nearest: GooglePlace | null }>
  error?: string
  queriedAt: string
}> {
  const types = [
    'restaurant',
    'supermarket',
    'school',
    'hospital',
    'park',
    'gym',
    'bank',
    'gas_station',
    'transit_station',
  ]

  const summary: Record<string, { count: number; nearest: GooglePlace | null }> = {}

  try {
    const promises = types.map(async (type) => {
      const response = await searchNearbyPlaces(lat, lng, {
        type,
        radius: radiusMeters,
      })
      return { type, response }
    })

    const results = await Promise.all(promises)

    for (const { type, response } of results) {
      if (response.success) {
        summary[type] = {
          count: response.results.length,
          nearest: response.results[0] || null,
        }
      } else {
        summary[type] = { count: 0, nearest: null }
      }
    }

    return {
      success: true,
      summary,
      queriedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      summary: {},
      error: error instanceof Error ? error.message : 'Unknown error',
      queriedAt: new Date().toISOString(),
    }
  }
}

/**
 * Convert price level to display string
 */
export function getPriceLevelDisplay(priceLevel?: number): string {
  if (priceLevel === undefined) return 'Price N/A'
  return '$'.repeat(priceLevel + 1)
}

/**
 * Format distance for display
 */
export function formatDistance(meters?: number): string {
  if (!meters) return 'N/A'
  if (meters < 1609) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1609.34).toFixed(1)} mi`
}
