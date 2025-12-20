import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''

interface PropertyDetail {
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
  features?: string[]
  listingAgent?: {
    name: string
    phone?: string
    email?: string
    brokerage?: string
    photo?: string
  }
  priceHistory?: Array<{
    date: string
    price: number
    event: string
  }>
  taxHistory?: Array<{
    year: number
    amount: number
  }>
  schools?: Array<{
    name: string
    type: string
    rating: number
    distance: string
  }>
  coordinates?: {
    lat: number
    lng: number
  }
}

// Fetch property details from Realtor16 API
async function fetchFromRealtor16(propertyId: string): Promise<PropertyDetail | null> {
  try {
    const response = await fetch(
      `https://realtor16.p.rapidapi.com/property?property_id=${propertyId}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      console.error('Realtor16 property fetch error:', response.status)
      return null
    }

    const data = await response.json()
    
    if (!data || data.error) {
      return null
    }

    const p = data.home || data.property || data
    
    return {
      id: propertyId,
      address: p.location?.address?.line || p.address?.streetAddress || p.streetAddress || 'Address not available',
      city: p.location?.address?.city || p.address?.city || p.city || '',
      state: p.location?.address?.state_code || p.address?.state || p.state || '',
      zip: p.location?.address?.postal_code || p.address?.zipcode || p.zip || '',
      price: p.list_price || p.price || p.listPrice || 0,
      beds: p.description?.beds || p.bedrooms || p.beds || 0,
      baths: p.description?.baths || p.bathrooms || p.baths || 0,
      sqft: p.description?.sqft || p.livingArea || p.sqft || 0,
      yearBuilt: p.description?.year_built || p.yearBuilt,
      propertyType: p.description?.type || p.propertyType || p.homeType || 'Single Family',
      status: p.status || 'for_sale',
      photos: p.photos?.map((photo: any) => photo.href || photo.url || photo) || 
              p.images || 
              p.media?.photos?.map((photo: any) => photo.href || photo) || 
              [],
      description: p.description?.text || p.description || '',
      mlsNumber: p.mls?.id || p.mlsId || p.mls_id,
      daysOnMarket: p.list_date ? Math.floor((Date.now() - new Date(p.list_date).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
      lotSize: p.description?.lot_sqft ? `${(p.description.lot_sqft / 43560).toFixed(2)} acres` : p.lotSize,
      garage: p.description?.garage || p.garage,
      pool: p.description?.pool !== undefined ? p.description.pool : p.pool,
      waterfront: p.tags?.includes('waterfront') || p.waterfront || false,
      source: 'Realtor16',
      features: p.details?.map((d: any) => d.text) || p.features || [],
      listingAgent: p.advertisers?.[0] ? {
        name: p.advertisers[0].name || 'Listing Agent',
        phone: p.advertisers[0].phones?.[0]?.number || p.advertisers[0].phone,
        email: p.advertisers[0].email,
        brokerage: p.advertisers[0].broker?.name || p.advertisers[0].office?.name,
        photo: p.advertisers[0].photo?.href
      } : undefined,
      priceHistory: p.property_history?.map((h: any) => ({
        date: h.date,
        price: h.price,
        event: h.event_name || h.event
      })) || [],
      taxHistory: p.tax_history?.map((t: any) => ({
        year: t.year,
        amount: t.tax
      })) || [],
      schools: p.schools?.schools?.map((s: any) => ({
        name: s.name,
        type: s.education_levels?.join(', ') || s.type,
        rating: s.rating,
        distance: s.distance_in_miles ? `${s.distance_in_miles} mi` : ''
      })) || [],
      coordinates: p.location?.address?.coordinate ? {
        lat: p.location.address.coordinate.lat,
        lng: p.location.address.coordinate.lon
      } : undefined
    }
  } catch (error) {
    console.error('Realtor16 property error:', error)
    return null
  }
}

// Fetch from Realty in US API
async function fetchFromRealtyInUS(propertyId: string): Promise<PropertyDetail | null> {
  try {
    const response = await fetch(
      `https://realty-in-us.p.rapidapi.com/properties/v3/detail?property_id=${propertyId}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      console.error('Realty in US property fetch error:', response.status)
      return null
    }

    const data = await response.json()
    const p = data.data?.home || data.home || data
    
    if (!p) return null

    return {
      id: propertyId,
      address: p.location?.address?.line || 'Address not available',
      city: p.location?.address?.city || '',
      state: p.location?.address?.state_code || '',
      zip: p.location?.address?.postal_code || '',
      price: p.list_price || 0,
      beds: p.description?.beds || 0,
      baths: p.description?.baths || 0,
      sqft: p.description?.sqft || 0,
      yearBuilt: p.description?.year_built,
      propertyType: p.description?.type || 'Single Family',
      status: p.status || 'for_sale',
      photos: p.photos?.map((photo: any) => photo.href) || [],
      description: p.description?.text || '',
      mlsNumber: p.mls?.id,
      source: 'Realty in US',
      features: [],
      listingAgent: p.advertisers?.[0] ? {
        name: p.advertisers[0].name || 'Listing Agent',
        phone: p.advertisers[0].phones?.[0]?.number,
        brokerage: p.advertisers[0].broker?.name,
        photo: p.advertisers[0].photo?.href
      } : undefined,
      coordinates: p.location?.address?.coordinate ? {
        lat: p.location.address.coordinate.lat,
        lng: p.location.address.coordinate.lon
      } : undefined
    }
  } catch (error) {
    console.error('Realty in US property error:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id

  if (!propertyId) {
    return NextResponse.json({
      error: 'Property ID is required',
      property: null
    }, { status: 400 })
  }

  if (!RAPIDAPI_KEY) {
    return NextResponse.json({
      error: 'RapidAPI key not configured',
      property: null
    }, { status: 500 })
  }

  try {
    // Try Realtor16 first (usually faster)
    let property = await fetchFromRealtor16(propertyId)
    
    // If not found, try Realty in US
    if (!property) {
      property = await fetchFromRealtyInUS(propertyId)
    }

    if (property) {
      return NextResponse.json({
        success: true,
        property
      })
    } else {
      return NextResponse.json({
        error: 'Property not found',
        property: null
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Property fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch property details',
      property: null
    }, { status: 500 })
  }
}
