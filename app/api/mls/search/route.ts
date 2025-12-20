import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''

// API Hosts
const API_HOSTS = {
  realtor16: 'realtor16.p.rapidapi.com',
  realtyInUs: 'realty-in-us.p.rapidapi.com',
}

interface PropertyListing {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt?: number
  propertyType: string
  status: string
  photos: string[]
  description?: string
  mlsNumber?: string
  daysOnMarket?: number
  lotSize?: string
  source: string
  listingAgent?: {
    name: string
    brokerage?: string
  }
}

// Search Realtor16 - PRIMARY SOURCE (has best data)
async function searchRealtor16(params: {
  city?: string
  state?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  limit?: number
}): Promise<PropertyListing[]> {
  try {
    // Build location string
    let location = ''
    if (params.city && params.state) {
      location = `${params.city}, ${params.state}`
    } else if (params.zip) {
      location = params.zip
    } else if (params.state) {
      location = params.state
    }
    
    if (!location) {
      console.error('Realtor16: No location provided')
      return []
    }

    const queryParams = new URLSearchParams()
    queryParams.append('location', location)
    if (params.minPrice) queryParams.append('price_min', params.minPrice.toString())
    if (params.maxPrice) queryParams.append('price_max', params.maxPrice.toString())
    if (params.beds) queryParams.append('beds_min', params.beds.toString())

    console.log('Realtor16 search:', `https://${API_HOSTS.realtor16}/search/forsale?${queryParams.toString()}`)

    const response = await fetch(
      `https://${API_HOSTS.realtor16}/search/forsale?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOSTS.realtor16
        }
      }
    )

    if (!response.ok) {
      console.error('Realtor16 API error:', response.status)
      return []
    }

    const data = await response.json()
    const properties = data?.properties || []

    console.log(`Realtor16 returned ${properties.length} properties`)

    return properties.map((p: any) => {
      // Extract photos - Realtor16 returns photos as array of {href: "url"}
      const photoUrls: string[] = []
      
      // Add primary photo first
      if (p.primary_photo?.href) {
        photoUrls.push(p.primary_photo.href)
      }
      
      // Add additional photos
      if (p.photos && Array.isArray(p.photos)) {
        p.photos.forEach((photo: any) => {
          if (photo.href && !photoUrls.includes(photo.href)) {
            photoUrls.push(photo.href)
          }
        })
      }

      // Parse baths from string like "2.5" or "3.5+"
      let baths = 0
      if (p.description?.baths_consolidated) {
        baths = parseFloat(p.description.baths_consolidated.replace('+', '')) || 0
      }

      return {
        id: p.property_id || `r16-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        address: p.location?.address?.line || 'Address not available',
        city: p.location?.address?.city || '',
        state: p.location?.address?.state_code || p.location?.address?.state || '',
        zip: p.location?.address?.postal_code || '',
        price: p.list_price || 0,
        beds: p.description?.beds || 0,
        baths: baths,
        sqft: p.description?.sqft || 0,
        yearBuilt: p.description?.year_built,
        propertyType: p.description?.type || 'single_family',
        status: p.status || 'for_sale',
        photos: photoUrls,
        mlsNumber: p.listing_id || p.mls_id,
        daysOnMarket: p.list_date ? Math.floor((Date.now() - new Date(p.list_date).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
        lotSize: p.description?.lot_sqft ? `${(p.description.lot_sqft / 43560).toFixed(2)} acres` : undefined,
        source: 'Realtor16',
        listingAgent: p.branding?.[0] ? {
          name: 'Listing Agent',
          brokerage: p.branding[0].name
        } : undefined
      }
    })
  } catch (error) {
    console.error('Realtor16 error:', error)
    return []
  }
}

// Search Realty in US (Api Dojo) - BACKUP SOURCE
async function searchRealtyInUS(params: {
  city?: string
  state?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  limit?: number
}): Promise<PropertyListing[]> {
  try {
    const body: any = {
      limit: params.limit || 20,
      offset: 0,
      status: ['for_sale'],
      sort: { direction: 'desc', field: 'list_date' }
    }

    if (params.zip) body.postal_code = params.zip
    if (params.city) body.city = params.city
    if (params.state) body.state_code = params.state
    if (params.minPrice) body.list_price = { ...body.list_price, min: params.minPrice }
    if (params.maxPrice) body.list_price = { ...body.list_price, max: params.maxPrice }
    if (params.beds) body.beds_min = params.beds

    const response = await fetch(
      `https://${API_HOSTS.realtyInUs}/properties/v3/list`,
      {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOSTS.realtyInUs,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    if (!response.ok) {
      console.error('Realty in US API error:', response.status)
      return []
    }

    const data = await response.json()
    const properties = data?.data?.home_search?.results || []

    return properties.map((p: any) => {
      // Extract photos
      const photoUrls: string[] = []
      if (p.primary_photo?.href) {
        photoUrls.push(p.primary_photo.href)
      }
      if (p.photos && Array.isArray(p.photos)) {
        p.photos.forEach((photo: any) => {
          if (photo.href && !photoUrls.includes(photo.href)) {
            photoUrls.push(photo.href)
          }
        })
      }

      return {
        id: p.property_id || `realty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        address: p.location?.address?.line || 'Address not available',
        city: p.location?.address?.city || '',
        state: p.location?.address?.state_code || '',
        zip: p.location?.address?.postal_code || '',
        price: p.list_price || 0,
        beds: p.description?.beds || 0,
        baths: p.description?.baths || 0,
        sqft: p.description?.sqft || 0,
        yearBuilt: p.description?.year_built,
        propertyType: p.description?.type || 'single_family',
        status: 'for_sale',
        photos: photoUrls,
        mlsNumber: p.mls?.id,
        source: 'Realty in US',
        listingAgent: undefined
      }
    })
  } catch (error) {
    console.error('Realty in US error:', error)
    return []
  }
}

// Format property type for display
function formatPropertyType(type: string): string {
  const typeMap: Record<string, string> = {
    'single_family': 'Single Family',
    'condos': 'Condo',
    'condo': 'Condo',
    'townhomes': 'Townhouse',
    'townhouse': 'Townhouse',
    'multi_family': 'Multi-Family',
    'land': 'Land',
    'apartment': 'Apartment'
  }
  return typeMap[type?.toLowerCase()] || type || 'Single Family'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const params = {
    city: searchParams.get('city') || undefined,
    state: searchParams.get('state') || undefined,
    zip: searchParams.get('zip') || searchParams.get('postal_code') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    beds: searchParams.get('beds') ? parseInt(searchParams.get('beds')!) : undefined,
    baths: searchParams.get('baths') ? parseInt(searchParams.get('baths')!) : undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    source: searchParams.get('source') || 'all'
  }

  // Validate location
  if (!params.city && !params.state && !params.zip) {
    return NextResponse.json({
      error: 'Please provide at least one location parameter: city, state, or zip',
      properties: [],
      total: 0
    }, { status: 400 })
  }

  // Check API key
  if (!RAPIDAPI_KEY) {
    return NextResponse.json({
      error: 'RapidAPI key not configured. Please add RAPIDAPI_KEY to environment variables.',
      properties: [],
      total: 0
    }, { status: 500 })
  }

  let allProperties: PropertyListing[] = []
  const sources: string[] = []
  const errors: string[] = []

  try {
    // Primary: Use Realtor16 (best data, includes photos)
    if (params.source === 'all' || params.source === 'realtor16') {
      try {
        const results = await searchRealtor16(params)
        if (results.length > 0) {
          allProperties = allProperties.concat(results)
          sources.push('Realtor16')
        }
      } catch (e) {
        errors.push('Realtor16')
      }
    }

    // Backup: Realty in US if Realtor16 returns nothing
    if (allProperties.length === 0 && (params.source === 'all' || params.source === 'realty')) {
      try {
        const results = await searchRealtyInUS(params)
        if (results.length > 0) {
          allProperties = allProperties.concat(results)
          sources.push('Realty in US')
        }
      } catch (e) {
        errors.push('Realty in US')
      }
    }

    // Format property types
    allProperties = allProperties.map(p => ({
      ...p,
      propertyType: formatPropertyType(p.propertyType)
    }))

    // Remove duplicates by address
    const seen = new Set<string>()
    allProperties = allProperties.filter(property => {
      const key = `${property.address}-${property.zip}`.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Sort by price (highest first)
    allProperties.sort((a, b) => b.price - a.price)

    // Apply limit
    if (params.limit && params.limit > 0) {
      allProperties = allProperties.slice(0, params.limit)
    }

    return NextResponse.json({
      success: true,
      properties: allProperties,
      total: allProperties.length,
      sources: {
        queried: sources,
        errors: errors.length > 0 ? errors : undefined
      },
      params: {
        city: params.city,
        state: params.state,
        zip: params.zip,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        beds: params.beds,
        baths: params.baths
      }
    })

  } catch (error) {
    console.error('MLS Search error:', error)
    return NextResponse.json({
      error: 'Failed to search properties',
      properties: [],
      total: 0
    }, { status: 500 })
  }
}
