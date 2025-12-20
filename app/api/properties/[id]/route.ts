import { NextRequest, NextResponse } from 'next/server'

// RapidAPI US Real Estate API configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''
const RAPIDAPI_HOST = 'us-real-estate.p.rapidapi.com'

// Fallback sample data for demo purposes when API is not configured
const SAMPLE_PROPERTIES: Record<string, PropertyData> = {
  '1': {
    id: '1',
    address: '2850 Winkler Ave',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33916',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    yearBuilt: 2018,
    status: 'Active',
    mlsNumber: 'FM-2024-001',
    description: 'Beautiful 4-bedroom, 3-bathroom home in desirable Fort Myers neighborhood. This stunning property features an open floor plan, modern kitchen with granite countertops and stainless steel appliances, spacious master suite with walk-in closet, and a sparkling pool. The home has been meticulously maintained and is move-in ready. Located near top-rated schools, shopping, and beaches.',
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop',
    ],
    features: ['Pool', 'Updated Kitchen', 'Walk-in Closets', 'Granite Countertops', 'Stainless Appliances', 'Tile Floors', 'Hurricane Shutters', 'Covered Lanai'],
    schools: [
      { name: 'Sunshine Elementary', rating: 'A', type: 'Elementary' },
      { name: 'Fort Myers Middle', rating: 'B+', type: 'Middle' },
      { name: 'Fort Myers High', rating: 'A-', type: 'High' }
    ],
    daysOnMarket: 12,
    propertyType: 'Single Family',
    lotSize: '0.25 acres',
    garage: '2-car attached',
    pool: true,
    waterfront: false
  },
  '2': {
    id: '2',
    address: '1540 SW 52nd Terrace',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33914',
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 2015,
    status: 'Active',
    mlsNumber: 'CC-2024-042',
    description: 'Charming 3-bedroom home in prime Cape Coral location with Gulf access canal. Perfect for boating enthusiasts. Features modern finishes throughout, updated kitchen, and a private dock. Low HOA fees and close to shopping and dining.',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
    ],
    features: ['Gulf Access', 'Private Dock', 'Updated Kitchen', 'Tile Floors', 'Impact Windows', 'Boat Lift'],
    schools: [
      { name: 'Cape Elementary', rating: 'A', type: 'Elementary' },
      { name: 'Cape Middle', rating: 'A-', type: 'Middle' },
      { name: 'Cape Coral High', rating: 'B+', type: 'High' }
    ],
    daysOnMarket: 8,
    propertyType: 'Single Family',
    lotSize: '0.20 acres',
    garage: '2-car attached',
    pool: false,
    waterfront: true
  },
  '3': {
    id: '3',
    address: '8745 Coastline Ct Unit 201',
    city: 'Naples',
    state: 'FL',
    zip: '34108',
    price: 1250000,
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    yearBuilt: 2020,
    status: 'Active',
    mlsNumber: 'NAP-2024-157',
    description: 'Stunning luxury residence in prestigious Naples community. This exceptional home features marble floors, gourmet kitchen with Viking appliances, wine cellar, and resort-style pool with water features. Minutes to Vanderbilt Beach.',
    photos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop',
    ],
    features: ['Marble Floors', 'Viking Appliances', 'Wine Cellar', 'Pool', 'Smart Home', 'Impact Glass', 'Gated Community'],
    schools: [
      { name: 'North Naples Middle', rating: 'A+', type: 'Middle' },
      { name: 'Barron Collier High', rating: 'A', type: 'High' }
    ],
    daysOnMarket: 21,
    propertyType: 'Single Family',
    lotSize: '0.45 acres',
    garage: '3-car attached',
    pool: true,
    waterfront: false
  },
  '4': {
    id: '4',
    address: '4521 Del Prado Blvd S',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33904',
    price: 459000,
    beds: 4,
    baths: 2,
    sqft: 2100,
    yearBuilt: 2019,
    status: 'Active',
    mlsNumber: 'CC-2024-089',
    description: 'Modern 4-bedroom home with open concept living in sought-after South Cape Coral. Features include a chef\'s kitchen with quartz countertops, spacious master suite, and a screened lanai overlooking the heated pool. Close to restaurants, shopping, and the beach.',
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=1200&h=800&fit=crop',
    ],
    features: ['Heated Pool', 'Quartz Countertops', 'Open Concept', 'Screened Lanai', 'Modern Kitchen', 'Walk-in Closet'],
    schools: [
      { name: 'Oasis Elementary', rating: 'A', type: 'Elementary' },
      { name: 'Diplomat Middle', rating: 'A-', type: 'Middle' },
      { name: 'Mariner High', rating: 'B+', type: 'High' }
    ],
    daysOnMarket: 5,
    propertyType: 'Single Family',
    lotSize: '0.23 acres',
    garage: '2-car attached',
    pool: true,
    waterfront: false
  },
  '5': {
    id: '5',
    address: '1200 Gulf Shore Blvd N #502',
    city: 'Naples',
    state: 'FL',
    zip: '34102',
    price: 2150000,
    beds: 3,
    baths: 3,
    sqft: 2800,
    yearBuilt: 2022,
    status: 'Active',
    mlsNumber: 'NAP-2024-203',
    description: 'Exquisite beachfront condo with panoramic Gulf views. This luxury residence features floor-to-ceiling windows, private balcony, gourmet kitchen, and direct beach access. Building amenities include concierge, pool, fitness center, and private parking.',
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop',
    ],
    features: ['Gulf Views', 'Beach Access', 'Concierge', 'Fitness Center', 'Private Parking', 'High Ceilings'],
    schools: [
      { name: 'Lake Park Elementary', rating: 'A+', type: 'Elementary' },
      { name: 'Gulfview Middle', rating: 'A', type: 'Middle' },
      { name: 'Naples High', rating: 'A', type: 'High' }
    ],
    daysOnMarket: 14,
    propertyType: 'Condo',
    lotSize: 'N/A',
    garage: '2 assigned spaces',
    pool: true,
    waterfront: true
  },
  '6': {
    id: '6',
    address: '9876 Estero River Circle',
    city: 'Estero',
    state: 'FL',
    zip: '33928',
    price: 575000,
    beds: 3,
    baths: 2.5,
    sqft: 2200,
    yearBuilt: 2017,
    status: 'Active',
    mlsNumber: 'EST-2024-067',
    description: 'Beautiful lakefront home in gated Estero community. Features include a gourmet kitchen, great room with lake views, spacious lanai with pool, and 3-car garage. Community amenities include golf, tennis, and clubhouse.',
    photos: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
    ],
    features: ['Lake Views', 'Pool', 'Golf Community', 'Tennis', 'Gated', '3-Car Garage'],
    schools: [
      { name: 'Three Oaks Elementary', rating: 'A', type: 'Elementary' },
      { name: 'Three Oaks Middle', rating: 'A-', type: 'Middle' },
      { name: 'Estero High', rating: 'A', type: 'High' }
    ],
    daysOnMarket: 30,
    propertyType: 'Single Family',
    lotSize: '0.35 acres',
    garage: '3-car attached',
    pool: true,
    waterfront: true
  },
  '7': {
    id: '7',
    address: '3245 NE 15th Place',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33909',
    price: 329000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    yearBuilt: 2016,
    status: 'Active',
    mlsNumber: 'CC-2024-112',
    description: 'Well-maintained 3-bedroom home in NE Cape Coral. Features include an open floor plan, updated kitchen with granite counters, spacious bedrooms, and a large fenced backyard. Great location near shopping and I-75.',
    photos: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&h=800&fit=crop',
    ],
    features: ['Open Floor Plan', 'Granite Counters', 'Fenced Yard', 'Updated Kitchen', 'Near I-75'],
    schools: [
      { name: 'Trafalgar Elementary', rating: 'B+', type: 'Elementary' },
      { name: 'Trafalgar Middle', rating: 'B', type: 'Middle' },
      { name: 'North Fort Myers High', rating: 'B', type: 'High' }
    ],
    daysOnMarket: 18,
    propertyType: 'Single Family',
    lotSize: '0.22 acres',
    garage: '2-car attached',
    pool: false,
    waterfront: false
  }
}

interface PropertyData {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  status: string
  mlsNumber: string
  description: string
  photos: string[]
  features: string[]
  schools: { name: string; rating: string; type: string }[]
  daysOnMarket: number
  propertyType: string
  lotSize: string
  garage: string
  pool: boolean
  waterfront: boolean
  listingAgent?: {
    name: string
    brokerage: string
    phone: string
    email: string
    photo: string
  }
}

// Fetch property from RapidAPI US Real Estate
async function fetchFromRapidAPI(propertyId: string): Promise<PropertyData | null> {
  if (!RAPIDAPI_KEY) {
    console.log('RapidAPI key not configured, using sample data')
    return null
  }

  try {
    // Note: This is a placeholder for the actual RapidAPI integration
    // The exact endpoint and parameters depend on the specific API being used
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/v2/property?property_id=${propertyId}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      }
    )

    if (!response.ok) {
      console.error('RapidAPI error:', response.status)
      return null
    }

    const data = await response.json()
    
    // Transform RapidAPI response to our format
    // This transformation depends on the actual API response structure
    if (data && data.data) {
      const property = data.data
      return {
        id: propertyId,
        address: property.address?.line || '',
        city: property.address?.city || '',
        state: property.address?.state_code || '',
        zip: property.address?.postal_code || '',
        price: property.list_price || 0,
        beds: property.description?.beds || 0,
        baths: property.description?.baths || 0,
        sqft: property.description?.sqft || 0,
        yearBuilt: property.description?.year_built || 0,
        status: property.status || 'Active',
        mlsNumber: property.mls?.id || propertyId,
        description: property.description?.text || '',
        photos: property.photos?.map((p: { href: string }) => p.href) || [],
        features: property.features || [],
        schools: [],
        daysOnMarket: property.days_on_market || 0,
        propertyType: property.description?.type || 'Single Family',
        lotSize: property.description?.lot_sqft ? `${(property.description.lot_sqft / 43560).toFixed(2)} acres` : '',
        garage: property.description?.garage ? `${property.description.garage}-car` : '',
        pool: property.features?.some((f: string) => f.toLowerCase().includes('pool')) || false,
        waterfront: property.features?.some((f: string) => f.toLowerCase().includes('water')) || false
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching from RapidAPI:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id

  if (!propertyId) {
    return NextResponse.json(
      { error: 'Property ID is required' },
      { status: 400 }
    )
  }

  // Try to fetch from RapidAPI first
  let property = await fetchFromRapidAPI(propertyId)

  // Fall back to sample data if API fails or is not configured
  if (!property) {
    property = SAMPLE_PROPERTIES[propertyId]
  }

  if (!property) {
    return NextResponse.json(
      { error: 'Property not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(property)
}
