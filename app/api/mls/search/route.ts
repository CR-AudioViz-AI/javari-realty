import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''

// API Hosts
const API_HOSTS = {
  realtor16: 'realtor16.p.rapidapi.com',
  realtyInUs: 'realty-in-us.p.rapidapi.com',
}

// State code to full name mapping for proper API queries
const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'Washington DC'
}

// Major cities for state-only searches (fallback when no city provided)
const STATE_MAJOR_CITIES: Record<string, string> = {
  'AL': 'Birmingham', 'AK': 'Anchorage', 'AZ': 'Phoenix', 'AR': 'Little Rock',
  'CA': 'Los Angeles', 'CO': 'Denver', 'CT': 'Hartford', 'DE': 'Wilmington',
  'FL': 'Miami', 'GA': 'Atlanta', 'HI': 'Honolulu', 'ID': 'Boise',
  'IL': 'Chicago', 'IN': 'Indianapolis', 'IA': 'Des Moines', 'KS': 'Wichita',
  'KY': 'Louisville', 'LA': 'New Orleans', 'ME': 'Portland', 'MD': 'Baltimore',
  'MA': 'Boston', 'MI': 'Detroit', 'MN': 'Minneapolis', 'MS': 'Jackson',
  'MO': 'Kansas City', 'MT': 'Billings', 'NE': 'Omaha', 'NV': 'Las Vegas',
  'NH': 'Manchester', 'NJ': 'Newark', 'NM': 'Albuquerque', 'NY': 'New York',
  'NC': 'Charlotte', 'ND': 'Fargo', 'OH': 'Columbus', 'OK': 'Oklahoma City',
  'OR': 'Portland', 'PA': 'Philadelphia', 'RI': 'Providence', 'SC': 'Charleston',
  'SD': 'Sioux Falls', 'TN': 'Nashville', 'TX': 'Houston', 'UT': 'Salt Lake City',
  'VT': 'Burlington', 'VA': 'Virginia Beach', 'WA': 'Seattle', 'WV': 'Charleston',
  'WI': 'Milwaukee', 'WY': 'Cheyenne', 'DC': 'Washington'
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
    // Build location string - FIXED: Use full state name or City, State format
    let location = ''
    
    if (params.city && params.state) {
      // City and state provided - use "City, State" format
      location = `${params.city}, ${STATE_NAMES[params.state] || params.state}`
    } else if (params.zip) {
      // ZIP code provided - use as-is
      location = params.zip
    } else if (params.state) {
      // FIXED: State only - use major city in that state for better results
      const majorCity = STATE_MAJOR_CITIES[params.state]
      const stateName = STATE_NAMES[params.state]
      if (majorCity && stateName) {
        location = `${majorCity}, ${stateName}`
        console.log(`State-only search: Using major city "${location}" for state ${params.state}`)
      } else {
        // Fallback to full state name
        location = stateName || params.state
      }
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

    // FIXED: Filter results to match requested state
    const requestedStateCode = params.state?.toUpperCase()
    
    return properties
      .filter((p: any) => {
        // If state was specified, filter to only that state
        if (requestedStateCode) {
          const propertyState = p.location?.address?.state_code?.toUpperCase() || 
                               p.location?.address?.state?.toUpperCase()
          return propertyState === requestedStateCode || 
                 propertyState === STATE_NAMES[requestedStateCode]?.toUpperCase()
        }
        return true
      })
      .map((p: any) => {
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
        id: p.property_id || `rius-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        status: p.status || 'for_sale',
        photos: photoUrls,
        mlsNumber: p.mls?.id,
        daysOnMarket: p.list_date ? Math.floor((Date.now() - new Date(p.list_date).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
        lotSize: p.description?.lot_sqft ? `${(p.description.lot_sqft / 43560).toFixed(2)} acres` : undefined,
        source: 'RealtyInUS',
        listingAgent: p.advertisers?.[0] ? {
          name: p.advertisers[0].name || 'Listing Agent',
          brokerage: p.advertisers[0].broker?.name
        } : undefined
      }
    })
  } catch (error) {
    console.error('Realty in US error:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const city = searchParams.get('city') || undefined
    const state = searchParams.get('state') || undefined
    const zip = searchParams.get('zip') || undefined
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
    const beds = searchParams.get('beds') ? parseInt(searchParams.get('beds')!) : undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    const params = { city, state, zip, minPrice, maxPrice, beds, limit }

    console.log('MLS Search params:', params)

    // Check if RapidAPI key exists
    if (!RAPIDAPI_KEY) {
      console.warn('No RAPIDAPI_KEY - returning demo data')
      return NextResponse.json({
        success: true,
        properties: getDemoProperties(state || 'FL'),
        total: 5,
        sources: ['Demo'],
        params,
        notice: 'Demo mode - Connect RapidAPI for live MLS data'
      })
    }

    // Try primary source first
    let properties = await searchRealtor16(params)
    let sources = properties.length > 0 ? ['Realtor16'] : []

    // If no results, try backup source
    if (properties.length === 0) {
      console.log('Realtor16 returned no results, trying Realty in US...')
      properties = await searchRealtyInUS(params)
      sources = properties.length > 0 ? ['RealtyInUS'] : []
    }

    // If still no results, return demo data for the requested state
    if (properties.length === 0) {
      console.log('No live results, returning demo data for state:', state)
      properties = getDemoProperties(state || 'FL')
      sources = ['Demo']
    }

    return NextResponse.json({
      success: true,
      properties,
      total: properties.length,
      sources,
      params
    })

  } catch (error) {
    console.error('MLS Search Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search properties', properties: [] },
      { status: 500 }
    )
  }
}

// Demo properties that match the requested state
function getDemoProperties(stateCode: string): PropertyListing[] {
  const stateName = STATE_NAMES[stateCode] || stateCode
  const majorCity = STATE_MAJOR_CITIES[stateCode] || 'Unknown City'
  
  const demoData: PropertyListing[] = [
    {
      id: `demo-${stateCode}-1`,
      address: `123 Main Street`,
      city: majorCity,
      state: stateCode,
      zip: getZipForState(stateCode),
      price: 450000,
      beds: 3,
      baths: 2,
      sqft: 1850,
      yearBuilt: 2018,
      propertyType: 'single_family',
      status: 'for_sale',
      photos: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      mlsNumber: `DEMO-${stateCode}-001`,
      daysOnMarket: 12,
      source: 'Demo',
      listingAgent: { name: 'Demo Agent', brokerage: `${stateName} Realty` }
    },
    {
      id: `demo-${stateCode}-2`,
      address: `456 Oak Avenue`,
      city: majorCity,
      state: stateCode,
      zip: getZipForState(stateCode),
      price: 675000,
      beds: 4,
      baths: 3,
      sqft: 2400,
      yearBuilt: 2021,
      propertyType: 'single_family',
      status: 'for_sale',
      photos: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
      ],
      mlsNumber: `DEMO-${stateCode}-002`,
      daysOnMarket: 5,
      source: 'Demo',
      listingAgent: { name: 'Demo Agent', brokerage: `${stateName} Realty` }
    },
    {
      id: `demo-${stateCode}-3`,
      address: `789 Maple Drive`,
      city: majorCity,
      state: stateCode,
      zip: getZipForState(stateCode),
      price: 325000,
      beds: 2,
      baths: 2,
      sqft: 1200,
      yearBuilt: 2015,
      propertyType: 'condo',
      status: 'for_sale',
      photos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800'
      ],
      mlsNumber: `DEMO-${stateCode}-003`,
      daysOnMarket: 21,
      source: 'Demo',
      listingAgent: { name: 'Demo Agent', brokerage: `${stateName} Realty` }
    },
    {
      id: `demo-${stateCode}-4`,
      address: `321 Pine Lane`,
      city: majorCity,
      state: stateCode,
      zip: getZipForState(stateCode),
      price: 890000,
      beds: 5,
      baths: 4,
      sqft: 3500,
      yearBuilt: 2022,
      propertyType: 'single_family',
      status: 'for_sale',
      photos: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'
      ],
      mlsNumber: `DEMO-${stateCode}-004`,
      daysOnMarket: 3,
      source: 'Demo',
      listingAgent: { name: 'Demo Agent', brokerage: `${stateName} Realty` }
    },
    {
      id: `demo-${stateCode}-5`,
      address: `555 Cedar Court`,
      city: majorCity,
      state: stateCode,
      zip: getZipForState(stateCode),
      price: 550000,
      beds: 3,
      baths: 2.5,
      sqft: 2100,
      yearBuilt: 2019,
      propertyType: 'townhouse',
      status: 'for_sale',
      photos: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
      ],
      mlsNumber: `DEMO-${stateCode}-005`,
      daysOnMarket: 8,
      source: 'Demo',
      listingAgent: { name: 'Demo Agent', brokerage: `${stateName} Realty` }
    }
  ]
  
  return demoData
}

// Get a representative ZIP code for demo data
function getZipForState(stateCode: string): string {
  const stateZips: Record<string, string> = {
    'AL': '35203', 'AK': '99501', 'AZ': '85001', 'AR': '72201',
    'CA': '90001', 'CO': '80201', 'CT': '06101', 'DE': '19801',
    'FL': '33101', 'GA': '30301', 'HI': '96801', 'ID': '83701',
    'IL': '60601', 'IN': '46201', 'IA': '50301', 'KS': '67201',
    'KY': '40201', 'LA': '70112', 'ME': '04101', 'MD': '21201',
    'MA': '02101', 'MI': '48201', 'MN': '55401', 'MS': '39201',
    'MO': '64101', 'MT': '59101', 'NE': '68101', 'NV': '89101',
    'NH': '03101', 'NJ': '07101', 'NM': '87101', 'NY': '10001',
    'NC': '28201', 'ND': '58102', 'OH': '43201', 'OK': '73101',
    'OR': '97201', 'PA': '19101', 'RI': '02901', 'SC': '29401',
    'SD': '57101', 'TN': '37201', 'TX': '77001', 'UT': '84101',
    'VT': '05401', 'VA': '23451', 'WA': '98101', 'WV': '25301',
    'WI': '53201', 'WY': '82001', 'DC': '20001'
  }
  return stateZips[stateCode] || '00000'
}
