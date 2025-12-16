import { NextRequest, NextResponse } from 'next/server'

// SimplyRETS Demo Credentials (free tier)
const SIMPLYRETS_USER = 'simplyrets'
const SIMPLYRETS_PASS = 'simplyrets'
const SIMPLYRETS_BASE = 'https://api.simplyrets.com'

interface SimplyRETSParams {
  limit?: number
  offset?: number
  minprice?: number
  maxprice?: number
  minbeds?: number
  minbaths?: number
  type?: string
  status?: string
  q?: string
  cities?: string
  postalCodes?: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Build query parameters
  const params: SimplyRETSParams = {
    limit: parseInt(searchParams.get('limit') || '20'),
    offset: parseInt(searchParams.get('offset') || '0'),
  }
  
  // Price filters
  if (searchParams.get('minprice')) {
    params.minprice = parseInt(searchParams.get('minprice')!)
  }
  if (searchParams.get('maxprice')) {
    params.maxprice = parseInt(searchParams.get('maxprice')!)
  }
  
  // Bedroom/bathroom filters
  if (searchParams.get('minbeds')) {
    params.minbeds = parseInt(searchParams.get('minbeds')!)
  }
  if (searchParams.get('minbaths')) {
    params.minbaths = parseInt(searchParams.get('minbaths')!)
  }
  
  // Property type
  if (searchParams.get('type')) {
    params.type = searchParams.get('type')!
  }
  
  // Status filter
  if (searchParams.get('status')) {
    params.status = searchParams.get('status')!
  }
  
  // Search query
  if (searchParams.get('q')) {
    params.q = searchParams.get('q')!
  }
  
  // City filter
  if (searchParams.get('cities')) {
    params.cities = searchParams.get('cities')!
  }
  
  // Build URL
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString()
  
  const url = `${SIMPLYRETS_BASE}/properties?${queryString}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${SIMPLYRETS_USER}:${SIMPLYRETS_PASS}`).toString('base64'),
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!response.ok) {
      throw new Error(`SimplyRETS API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform data to our format
    const listings = data.map((listing: any) => ({
      id: String(listing.mlsId),
      mlsId: listing.listingId || String(listing.mlsId),
      address: listing.address?.full || 'Address Not Available',
      streetNumber: listing.address?.streetNumber,
      streetName: listing.address?.streetName,
      city: listing.address?.city || 'Unknown',
      state: listing.address?.state || 'TX',
      zip: listing.address?.postalCode || '',
      county: listing.address?.country,
      price: listing.listPrice || 0,
      beds: listing.property?.bedrooms || 0,
      baths: (listing.property?.bathsFull || 0) + ((listing.property?.bathsHalf || 0) * 0.5),
      bathsFull: listing.property?.bathsFull || 0,
      bathsHalf: listing.property?.bathsHalf || 0,
      sqft: listing.property?.area || 0,
      lotSize: listing.property?.lotSize,
      yearBuilt: listing.property?.yearBuilt,
      propertyType: listing.property?.type || listing.property?.subType || 'Residential',
      style: listing.property?.style,
      status: listing.mls?.status?.toLowerCase() || 'active',
      daysOnMarket: listing.mls?.daysOnMarket || 0,
      photos: listing.photos || [],
      description: listing.remarks || '',
      features: [
        listing.property?.pool && 'Pool',
        listing.property?.heating && `Heating: ${listing.property.heating}`,
        listing.property?.cooling && `Cooling: ${listing.property.cooling}`,
        listing.property?.roof && `Roof: ${listing.property.roof}`,
        listing.property?.fireplaces && `${listing.property.fireplaces} Fireplace(s)`,
      ].filter(Boolean),
      interiorFeatures: listing.property?.interiorFeatures,
      exteriorFeatures: listing.property?.exteriorFeatures,
      lat: listing.geo?.lat,
      lng: listing.geo?.lng,
      agent: listing.agent ? {
        name: `${listing.agent.firstName || ''} ${listing.agent.lastName || ''}`.trim(),
        id: listing.agent.id,
      } : null,
      office: listing.office?.name,
      school: listing.school,
      listDate: listing.listDate,
      modified: listing.modified,
      pricePerSqft: listing.property?.area ? Math.round(listing.listPrice / listing.property.area) : null,
      source: 'SimplyRETS',
    }))
    
    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
      source: 'SimplyRETS Demo API',
      note: 'This is demo/sample data from SimplyRETS free tier'
    })
    
  } catch (error) {
    console.error('SimplyRETS API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
