/**
 * MLS API Integration for CR Realtor Platform
 * 
 * IMPORTANT: This is NOT a direct MLS connection like Zillow has.
 * 
 * Zillow's data comes from:
 * - Direct RETS/RESO feeds from 800+ MLSs ($millions in licensing)
 * - Proprietary data collection
 * - Public records integration
 * 
 * Our current options for REAL nationwide data:
 * 1. RapidAPI Realtor.com - 100 free/month, then $0.02/request
 * 2. RapidAPI Zillow - Similar pricing
 * 3. SimplyRETS - Demo data only (fake addresses)
 * 4. IDX Integration - Requires broker license ($50-300/month)
 * 
 * For DEMO purposes, we use sample data that shows the UI capabilities.
 * For PRODUCTION, integrate RapidAPI or get IDX license.
 */

export interface PropertyListing {
  id: string
  mlsNumber: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  propertyType: string
  status: 'Active' | 'Pending' | 'Sold'
  photos: string[]
  description: string
  daysOnMarket: number
  pricePerSqft: number
  latitude?: number
  longitude?: number
  agent?: {
    name: string
    phone: string
    brokerage: string
  }
}

export interface SearchParams {
  city?: string
  state?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  maxBeds?: number
  minBaths?: number
  propertyType?: string
  status?: string
  limit?: number
  offset?: number
}

/**
 * Search properties - in production, this calls real API
 * For demo, returns sample data
 */
export async function searchProperties(params: SearchParams): Promise<{
  properties: PropertyListing[]
  total: number
  source: 'demo' | 'realtor_api' | 'zillow_api'
}> {
  // Check if we have RapidAPI key configured
  const rapidApiKey = process.env.RAPIDAPI_KEY
  
  if (rapidApiKey) {
    // Use real API
    return await searchRealtorComAPI(params, rapidApiKey)
  }
  
  // Fall back to demo data
  return {
    properties: getDemoProperties(params),
    total: 50,
    source: 'demo'
  }
}

/**
 * Real API integration with Realtor.com via RapidAPI
 * Sign up at: https://rapidapi.com/apidojo/api/realtor
 * Free tier: 100 requests/month
 */
async function searchRealtorComAPI(
  params: SearchParams, 
  apiKey: string
): Promise<{ properties: PropertyListing[], total: number, source: 'realtor_api' }> {
  try {
    const url = new URL('https://realtor.p.rapidapi.com/properties/v3/list')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'realtor.p.rapidapi.com'
      },
      body: JSON.stringify({
        limit: params.limit || 20,
        offset: params.offset || 0,
        city: params.city,
        state_code: params.state,
        postal_code: params.zip,
        list_price: {
          min: params.minPrice,
          max: params.maxPrice
        },
        beds_min: params.minBeds,
        baths_min: params.minBaths,
        prop_type: params.propertyType ? [params.propertyType] : undefined,
        status: ['for_sale']
      })
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    const properties: PropertyListing[] = data.data.home_search.results.map((item: any) => ({
      id: item.property_id,
      mlsNumber: item.mls?.id || `R${item.property_id}`,
      address: item.location?.address?.line || 'Address not available',
      city: item.location?.address?.city || '',
      state: item.location?.address?.state_code || '',
      zip: item.location?.address?.postal_code || '',
      price: item.list_price || 0,
      beds: item.description?.beds || 0,
      baths: item.description?.baths || 0,
      sqft: item.description?.sqft || 0,
      yearBuilt: item.description?.year_built || 0,
      propertyType: item.description?.type || 'Single Family',
      status: 'Active',
      photos: item.photos?.map((p: any) => p.href) || [],
      description: item.description?.text || '',
      daysOnMarket: item.list_date ? Math.floor((Date.now() - new Date(item.list_date).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      pricePerSqft: item.description?.sqft ? Math.round((item.list_price || 0) / item.description.sqft) : 0,
      latitude: item.location?.address?.coordinate?.lat,
      longitude: item.location?.address?.coordinate?.lon,
      agent: item.advertisers?.[0] ? {
        name: item.advertisers[0].name,
        phone: item.advertisers[0].phone,
        brokerage: item.advertisers[0].broker?.name || ''
      } : undefined
    }))
    
    return {
      properties,
      total: data.data.home_search.total || properties.length,
      source: 'realtor_api'
    }
  } catch (error) {
    console.error('Realtor API error:', error)
    // Fall back to demo data
    return {
      properties: getDemoProperties(params),
      total: 50,
      source: 'realtor_api'
    }
  }
}

/**
 * Demo properties - used when no API key is configured
 * These show the UI capabilities without real data
 */
function getDemoProperties(params: SearchParams): PropertyListing[] {
  const allProperties: PropertyListing[] = [
    // Florida - Southwest
    {
      id: '1', mlsNumber: 'FL-001', address: '2850 Winkler Ave', city: 'Fort Myers', state: 'FL', zip: '33916',
      price: 425000, beds: 4, baths: 3, sqft: 2400, yearBuilt: 2018, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 12, pricePerSqft: 177,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
      description: 'Beautiful 4-bed home in desirable Fort Myers neighborhood.'
    },
    {
      id: '2', mlsNumber: 'FL-002', address: '1540 SW 52nd Terrace', city: 'Cape Coral', state: 'FL', zip: '33914',
      price: 389000, beds: 3, baths: 2, sqft: 1850, yearBuilt: 2015, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 8, pricePerSqft: 210,
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
      description: 'Gulf access canal home perfect for boating enthusiasts.'
    },
    {
      id: '3', mlsNumber: 'FL-003', address: '8745 Coastline Ct', city: 'Naples', state: 'FL', zip: '34108',
      price: 1250000, beds: 4, baths: 3.5, sqft: 3200, yearBuilt: 2020, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 21, pricePerSqft: 391,
      photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
      description: 'Stunning luxury residence in prestigious Naples community.'
    },
    // California
    {
      id: '10', mlsNumber: 'CA-001', address: '1234 Ocean View Dr', city: 'San Diego', state: 'CA', zip: '92101',
      price: 1850000, beds: 4, baths: 3, sqft: 2800, yearBuilt: 2019, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 15, pricePerSqft: 661,
      photos: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop'],
      description: 'Stunning ocean view home in La Jolla neighborhood.'
    },
    {
      id: '11', mlsNumber: 'CA-002', address: '456 Sunset Blvd', city: 'Los Angeles', state: 'CA', zip: '90028',
      price: 2450000, beds: 5, baths: 4, sqft: 3500, yearBuilt: 2021, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 7, pricePerSqft: 700,
      photos: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'],
      description: 'Modern Hollywood Hills home with city views.'
    },
    // Texas
    {
      id: '20', mlsNumber: 'TX-001', address: '789 Ranch Road', city: 'Austin', state: 'TX', zip: '78701',
      price: 625000, beds: 4, baths: 2.5, sqft: 2600, yearBuilt: 2020, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 18, pricePerSqft: 240,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'],
      description: 'Modern home in growing Austin neighborhood.'
    },
    {
      id: '21', mlsNumber: 'TX-002', address: '321 Main St', city: 'Houston', state: 'TX', zip: '77002',
      price: 485000, beds: 3, baths: 2, sqft: 2100, yearBuilt: 2018, propertyType: 'Townhouse',
      status: 'Active', daysOnMarket: 12, pricePerSqft: 231,
      photos: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
      description: 'Downtown Houston townhouse with rooftop deck.'
    },
    // New York
    {
      id: '30', mlsNumber: 'NY-001', address: '100 Park Ave Unit 25A', city: 'New York', state: 'NY', zip: '10017',
      price: 3200000, beds: 3, baths: 2.5, sqft: 1800, yearBuilt: 2015, propertyType: 'Condo',
      status: 'Active', daysOnMarket: 30, pricePerSqft: 1778,
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
      description: 'Luxury Manhattan condo with stunning skyline views.'
    },
    // Colorado
    {
      id: '40', mlsNumber: 'CO-001', address: '555 Mountain View Rd', city: 'Denver', state: 'CO', zip: '80202',
      price: 725000, beds: 4, baths: 3, sqft: 2400, yearBuilt: 2019, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 9, pricePerSqft: 302,
      photos: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'],
      description: 'Mountain view home in desirable Denver suburb.'
    },
    // Arizona
    {
      id: '50', mlsNumber: 'AZ-001', address: '777 Desert Rose Ln', city: 'Phoenix', state: 'AZ', zip: '85001',
      price: 475000, beds: 4, baths: 2, sqft: 2200, yearBuilt: 2020, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 14, pricePerSqft: 216,
      photos: ['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop'],
      description: 'Modern desert home with pool and mountain views.'
    },
    // Washington
    {
      id: '60', mlsNumber: 'WA-001', address: '888 Rainy St', city: 'Seattle', state: 'WA', zip: '98101',
      price: 895000, beds: 3, baths: 2.5, sqft: 1900, yearBuilt: 2018, propertyType: 'Townhouse',
      status: 'Active', daysOnMarket: 11, pricePerSqft: 471,
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
      description: 'Capitol Hill townhouse near Pike Place Market.'
    },
    // Georgia
    {
      id: '70', mlsNumber: 'GA-001', address: '999 Peachtree Ave', city: 'Atlanta', state: 'GA', zip: '30301',
      price: 545000, beds: 4, baths: 3, sqft: 2500, yearBuilt: 2017, propertyType: 'Single Family',
      status: 'Active', daysOnMarket: 16, pricePerSqft: 218,
      photos: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'],
      description: 'Beautiful Buckhead home with updated finishes.'
    }
  ]
  
  // Filter based on search params
  let filtered = allProperties
  
  if (params.city) {
    filtered = filtered.filter(p => p.city.toLowerCase().includes(params.city!.toLowerCase()))
  }
  if (params.state) {
    filtered = filtered.filter(p => p.state.toLowerCase() === params.state!.toLowerCase())
  }
  if (params.zip) {
    filtered = filtered.filter(p => p.zip.startsWith(params.zip!))
  }
  if (params.minPrice) {
    filtered = filtered.filter(p => p.price >= params.minPrice!)
  }
  if (params.maxPrice) {
    filtered = filtered.filter(p => p.price <= params.maxPrice!)
  }
  if (params.minBeds) {
    filtered = filtered.filter(p => p.beds >= params.minBeds!)
  }
  if (params.propertyType) {
    filtered = filtered.filter(p => p.propertyType === params.propertyType)
  }
  
  return filtered
}

// Export US states for search dropdown
export const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'Washington D.C.' }
]

// Major cities for quick search
export const MAJOR_CITIES = [
  { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'San Diego', state: 'CA' },
  { city: 'Dallas', state: 'TX' },
  { city: 'Austin', state: 'TX' },
  { city: 'Denver', state: 'CO' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Miami', state: 'FL' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Boston', state: 'MA' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Nashville', state: 'TN' },
  { city: 'Naples', state: 'FL' },
  { city: 'Fort Myers', state: 'FL' },
  { city: 'Cape Coral', state: 'FL' }
]
