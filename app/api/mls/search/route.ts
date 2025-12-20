import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''

// API Hosts for each service
const API_HOSTS = {
  usRealEstateListings: 'us-real-estate-listings.p.rapidapi.com',
  redUsRealEstate: 'red-us-real-estate-listings.p.rapidapi.com',
  realtyInUs: 'realty-in-us.p.rapidapi.com',
  usRealEstate: 'us-real-estate.p.rapidapi.com',
  realtor16: 'realtor16.p.rapidapi.com',
  idealSpot: 'idealspot-geodata.p.rapidapi.com',
  propertyAnalysis: 'property-analysis-api.p.rapidapi.com'
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
  garage?: number
  pool?: boolean
  waterfront?: boolean
  source: string
  listingAgent?: {
    name: string
    phone?: string
    email?: string
    brokerage?: string
  }
}

// Search US Real Estate Listings (Realtor.com + Commercial)
async function searchUSRealEstateListings(params: {
  city?: string
  state?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  limit?: number
}): Promise<PropertyListing[]> {
  try {
    const queryParams = new URLSearchParams()
    if (params.city) queryParams.append('city', params.city)
    if (params.state) queryParams.append('state_code', params.state)
    if (params.zip) queryParams.append('postal_code', params.zip)
    if (params.minPrice) queryParams.append('price_min', params.minPrice.toString())
    if (params.maxPrice) queryParams.append('price_max', params.maxPrice.toString())
    if (params.beds) queryParams.append('beds_min', params.beds.toString())
    if (params.baths) queryParams.append('baths_min', params.baths.toString())
    queryParams.append('limit', (params.limit || 20).toString())
    queryParams.append('offset', '0')
    queryParams.append('sort', 'newest')

    const response = await fetch(
      `https://${API_HOSTS.usRealEstateListings}/v2/property?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOSTS.usRealEstateListings
        }
      }
    )

    if (!response.ok) {
      console.error('US Real Estate Listings API error:', response.status)
      return []
    }

    const data = await response.json()
    const properties = data?.data?.home_search?.results || data?.results || []

    return properties.map((p: any) => ({
      id: p.property_id || p.listing_id || `usrel-${Date.now()}-${Math.random()}`,
      address: p.location?.address?.line || p.address?.line || 'Address not available',
      city: p.location?.address?.city || p.address?.city || '',
      state: p.location?.address?.state_code || p.address?.state_code || '',
      zip: p.location?.address?.postal_code || p.address?.postal_code || '',
      price: p.list_price || p.price || 0,
      beds: p.description?.beds || p.beds || 0,
      baths: p.description?.baths || p.baths || 0,
      sqft: p.description?.sqft || p.sqft || 0,
      yearBuilt: p.description?.year_built || p.year_built,
      propertyType: p.description?.type || p.property_type || 'Residential',
      status: p.status || 'for_sale',
      photos: p.photos?.map((photo: any) => photo.href || photo) || [],
      description: p.description?.text || '',
      mlsNumber: p.mls?.id || p.mls_id,
      daysOnMarket: p.list_date ? Math.floor((Date.now() - new Date(p.list_date).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
      lotSize: p.description?.lot_sqft ? `${(p.description.lot_sqft / 43560).toFixed(2)} acres` : undefined,
      garage: p.description?.garage,
      pool: p.description?.pool !== null,
      waterfront: p.tags?.includes('waterfront') || false,
      source: 'US Real Estate Listings',
      listingAgent: p.advertisers?.[0] ? {
        name: p.advertisers[0].name || 'Agent',
        phone: p.advertisers[0].phone,
        email: p.advertisers[0].email,
        brokerage: p.advertisers[0].broker?.name
      } : undefined
    }))
  } catch (error) {
    console.error('US Real Estate Listings error:', error)
    return []
  }
}

// Search Red US Real Estate (Redfin data)
async function searchRedUSRealEstate(params: {
  city?: string
  state?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  limit?: number
}): Promise<PropertyListing[]> {
  try {
    const queryParams = new URLSearchParams()
    if (params.city) queryParams.append('city', params.city)
    if (params.state) queryParams.append('state_code', params.state)
    if (params.zip) queryParams.append('postal_code', params.zip)
    if (params.minPrice) queryParams.append('price_min', params.minPrice.toString())
    if (params.maxPrice) queryParams.append('price_max', params.maxPrice.toString())
    if (params.beds) queryParams.append('beds_min', params.beds.toString())
    queryParams.append('limit', (params.limit || 20).toString())

    const response = await fetch(
      `https://${API_HOSTS.redUsRealEstate}/v2/property?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOSTS.redUsRealEstate
        }
      }
    )

    if (!response.ok) {
      console.error('Red US Real Estate API error:', response.status)
      return []
    }

    const data = await response.json()
    const properties = data?.data?.results || data?.results || []

    return properties.map((p: any) => ({
      id: p.property_id || `redfin-${Date.now()}-${Math.random()}`,
      address: p.address?.line || p.streetAddress || 'Address not available',
      city: p.address?.city || p.city || '',
      state: p.address?.state_code || p.state || '',
      zip: p.address?.postal_code || p.zip || '',
      price: p.list_price || p.price || 0,
      beds: p.beds || 0,
      baths: p.baths || 0,
      sqft: p.sqft || 0,
      yearBuilt: p.year_built,
      propertyType: p.property_type || 'Residential',
      status: p.status || 'for_sale',
      photos: p.photos || [],
      source: 'Redfin',
      listingAgent: undefined
    }))
  } catch (error) {
    console.error('Red US Real Estate error:', error)
    return []
  }
}

// Search Realty in US (Api Dojo)
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

    return properties.map((p: any) => ({
      id: p.property_id || `realty-${Date.now()}-${Math.random()}`,
      address: p.location?.address?.line || 'Address not available',
      city: p.location?.address?.city || '',
      state: p.location?.address?.state_code || '',
      zip: p.location?.address?.postal_code || '',
      price: p.list_price || 0,
      beds: p.description?.beds || 0,
      baths: p.description?.baths || 0,
      sqft: p.description?.sqft || 0,
      yearBuilt: p.description?.year_built,
      propertyType: p.description?.type || 'Residential',
      status: 'for_sale',
      photos: p.photos?.map((photo: any) => photo.href) || [],
      mlsNumber: p.mls?.id,
      source: 'Realty in US',
      listingAgent: undefined
    }))
  } catch (error) {
    console.error('Realty in US error:', error)
    return []
  }
}

// Search Realtor16 (comprehensive search with photos, estimates, history)
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
    const queryParams = new URLSearchParams()
    
    // Build location string
    let location = ''
    if (params.city && params.state) {
      location = `${params.city}, ${params.state}`
    } else if (params.zip) {
      location = params.zip
    } else if (params.state) {
      location = params.state
    }
    
    if (location) queryParams.append('location', location)
    if (params.minPrice) queryParams.append('price_min', params.minPrice.toString())
    if (params.maxPrice) queryParams.append('price_max', params.maxPrice.toString())
    if (params.beds) queryParams.append('beds_min', params.beds.toString())

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
    const properties = data?.results || data?.properties || []

    return properties.map((p: any) => ({
      id: p.property_id || p.zpid || `r16-${Date.now()}-${Math.random()}`,
      address: p.address?.streetAddress || p.address?.line || p.streetAddress || 'Address not available',
      city: p.address?.city || p.city || '',
      state: p.address?.state || p.state || '',
      zip: p.address?.zipcode || p.zip || '',
      price: p.price || p.listPrice || 0,
      beds: p.bedrooms || p.beds || 0,
      baths: p.bathrooms || p.baths || 0,
      sqft: p.livingArea || p.sqft || 0,
      yearBuilt: p.yearBuilt,
      propertyType: p.propertyType || p.homeType || 'Residential',
      status: 'for_sale',
      photos: p.photos || p.images || [],
      source: 'Realtor16',
      listingAgent: undefined
    }))
  } catch (error) {
    console.error('Realtor16 error:', error)
    return []
  }
}

// Search US Real Estate (DataScraper - comprehensive)
async function searchUSRealEstateDataScraper(params: {
  city?: string
  state?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  limit?: number
}): Promise<PropertyListing[]> {
  try {
    const queryParams = new URLSearchParams()
    if (params.city) queryParams.append('city', params.city)
    if (params.state) queryParams.append('state', params.state)
    if (params.zip) queryParams.append('zipCode', params.zip)
    if (params.minPrice) queryParams.append('priceMin', params.minPrice.toString())
    if (params.maxPrice) queryParams.append('priceMax', params.maxPrice.toString())
    if (params.beds) queryParams.append('bedsMin', params.beds.toString())
    queryParams.append('limit', (params.limit || 20).toString())

    const response = await fetch(
      `https://${API_HOSTS.usRealEstate}/v3/property-detail?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOSTS.usRealEstate
        }
      }
    )

    if (!response.ok) {
      console.error('US Real Estate DataScraper API error:', response.status)
      return []
    }

    const data = await response.json()
    const properties = data?.data || data?.results || []

    return properties.map((p: any) => ({
      id: p.propertyId || `usreds-${Date.now()}-${Math.random()}`,
      address: p.address?.streetAddress || p.address || 'Address not available',
      city: p.address?.city || p.city || '',
      state: p.address?.state || p.state || '',
      zip: p.address?.zipcode || p.zipCode || '',
      price: p.price || p.listPrice || 0,
      beds: p.beds || p.bedrooms || 0,
      baths: p.baths || p.bathrooms || 0,
      sqft: p.sqft || p.livingArea || 0,
      yearBuilt: p.yearBuilt,
      propertyType: p.propertyType || 'Residential',
      status: 'for_sale',
      photos: p.photos || [],
      source: 'US Real Estate (DataScraper)',
      listingAgent: undefined
    }))
  } catch (error) {
    console.error('US Real Estate DataScraper error:', error)
    return []
  }
}

// Main search function - aggregates all sources
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
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    source: searchParams.get('source') || 'all' // 'all', 'realtor', 'redfin', 'realty', 'realtor16', 'datascraper'
  }

  // Validate we have at least one location parameter
  if (!params.city && !params.state && !params.zip) {
    return NextResponse.json({
      error: 'Please provide at least one location parameter: city, state, or zip',
      properties: [],
      total: 0
    }, { status: 400 })
  }

  // Check for API key
  if (!RAPIDAPI_KEY) {
    return NextResponse.json({
      error: 'RapidAPI key not configured',
      properties: [],
      total: 0
    }, { status: 500 })
  }

  let allProperties: PropertyListing[] = []
  const errors: string[] = []

  try {
    // Fetch from all sources in parallel based on source parameter
    const fetchPromises: Promise<PropertyListing[]>[] = []

    if (params.source === 'all' || params.source === 'realtor') {
      fetchPromises.push(searchUSRealEstateListings(params).catch(e => { errors.push('US Real Estate Listings'); return [] }))
    }
    if (params.source === 'all' || params.source === 'redfin') {
      fetchPromises.push(searchRedUSRealEstate(params).catch(e => { errors.push('Redfin'); return [] }))
    }
    if (params.source === 'all' || params.source === 'realty') {
      fetchPromises.push(searchRealtyInUS(params).catch(e => { errors.push('Realty in US'); return [] }))
    }
    if (params.source === 'all' || params.source === 'realtor16') {
      fetchPromises.push(searchRealtor16(params).catch(e => { errors.push('Realtor16'); return [] }))
    }
    if (params.source === 'all' || params.source === 'datascraper') {
      fetchPromises.push(searchUSRealEstateDataScraper(params).catch(e => { errors.push('DataScraper'); return [] }))
    }

    const results = await Promise.all(fetchPromises)
    
    // Combine all results
    results.forEach(propertyList => {
      allProperties = allProperties.concat(propertyList)
    })

    // Remove duplicates based on address
    const seen = new Set<string>()
    allProperties = allProperties.filter(property => {
      const key = `${property.address}-${property.zip}`.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Sort by price (highest first) or newest
    allProperties.sort((a, b) => b.price - a.price)

    // Apply limit
    if (params.limit) {
      allProperties = allProperties.slice(0, params.limit)
    }

    return NextResponse.json({
      success: true,
      properties: allProperties,
      total: allProperties.length,
      sources: {
        queried: params.source === 'all' ? ['US Real Estate Listings', 'Redfin', 'Realty in US', 'Realtor16', 'DataScraper'] : [params.source],
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
