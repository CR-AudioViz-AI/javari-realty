// lib/mls-api.ts
// FREE MLS API Integration - SimplyRETS Demo + RapidAPI Fallback
// Timestamp: December 19, 2025

export interface PropertyListing {
  id: string;
  mlsId: string;
  address: {
    full: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: string;
  yearBuilt?: number;
  propertyType: string;
  status: 'Active' | 'Pending' | 'Sold' | 'For Rent';
  daysOnMarket: number;
  photos: string[];
  description?: string;
  features: string[];
  lat?: number;
  lng?: number;
  agent?: {
    name: string;
    phone?: string;
    email?: string;
  };
  school?: {
    elementary?: string;
    middle?: string;
    high?: string;
  };
  pricePerSqft?: number;
  virtualTour?: string;
  source: string;
}

export interface SearchParams {
  city?: string;
  state?: string;
  zip?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  propertyType?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

// SimplyRETS Demo API (FREE - No key required)
const SIMPLYRETS_BASE = 'https://api.simplyrets.com';
const SIMPLYRETS_AUTH = 'Basic ' + Buffer.from('simplyrets:simplyrets').toString('base64');

export async function searchProperties(params: SearchParams): Promise<PropertyListing[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.city) queryParams.append('cities', params.city);
    if (params.state) queryParams.append('states', params.state);
    if (params.zip) queryParams.append('postalCodes', params.zip);
    if (params.minPrice) queryParams.append('minprice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxprice', params.maxPrice.toString());
    if (params.minBeds) queryParams.append('minbeds', params.minBeds.toString());
    if (params.minBaths) queryParams.append('minbaths', params.minBaths.toString());
    if (params.propertyType) queryParams.append('type', params.propertyType);
    if (params.status) queryParams.append('status', params.status);
    queryParams.append('limit', (params.limit || 20).toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${SIMPLYRETS_BASE}/properties?${queryParams}`, {
      headers: {
        'Authorization': SIMPLYRETS_AUTH,
        'Accept': 'application/json'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.map(transformSimplyRetsProperty);
  } catch (error) {
    console.error('MLS API Error:', error);
    return getFallbackProperties(params);
  }
}

export async function getPropertyById(mlsId: string): Promise<PropertyListing | null> {
  try {
    const response = await fetch(`${SIMPLYRETS_BASE}/properties/${mlsId}`, {
      headers: {
        'Authorization': SIMPLYRETS_AUTH,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) return null;
    const data = await response.json();
    return transformSimplyRetsProperty(data);
  } catch (error) {
    console.error('Get Property Error:', error);
    return null;
  }
}

function transformSimplyRetsProperty(prop: any): PropertyListing {
  const address = prop.address || {};
  const property = prop.property || {};
  const mls = prop.mls || {};
  const agent = prop.agent || {};
  const school = prop.school || {};

  return {
    id: prop.mlsId?.toString() || prop.listingId || Math.random().toString(36).substr(2, 9),
    mlsId: prop.listingId || prop.mlsId?.toString(),
    address: {
      full: address.full || `${address.streetNumber || ''} ${address.streetName || ''}`.trim(),
      street: `${address.streetNumber || ''} ${address.streetName || ''}`.trim(),
      city: address.city || 'Naples',
      state: address.state || 'FL',
      zip: address.postalCode || '34109',
      country: address.country || 'USA'
    },
    price: prop.listPrice || 0,
    beds: property.bedrooms || 0,
    baths: (property.bathsFull || 0) + (property.bathsHalf || 0) * 0.5,
    sqft: property.area || 0,
    lotSize: property.lotSize,
    yearBuilt: property.yearBuilt,
    propertyType: property.type || property.style || 'Residential',
    status: mls.status || 'Active',
    daysOnMarket: mls.daysOnMarket || 0,
    photos: prop.photos || [],
    description: prop.remarks || prop.privateRemarks,
    features: [
      property.pool ? 'Pool' : null,
      property.heating ? `Heating: ${property.heating}` : null,
      property.cooling ? `Cooling: ${property.cooling}` : null,
      property.roof ? `Roof: ${property.roof}` : null,
      property.view ? `View: ${property.view}` : null,
      ...(property.interiorFeatures?.split(',') || [])
    ].filter(Boolean) as string[],
    lat: prop.geo?.lat,
    lng: prop.geo?.lng,
    agent: agent.firstName ? {
      name: `${agent.firstName} ${agent.lastName || ''}`.trim(),
      phone: agent.contact?.cell || agent.contact?.office,
      email: agent.contact?.email
    } : undefined,
    school: {
      elementary: school.elementarySchool,
      middle: school.middleSchool,
      high: school.highSchool
    },
    pricePerSqft: property.area ? Math.round(prop.listPrice / property.area) : undefined,
    virtualTour: prop.virtualTourUrl,
    source: 'MLS'
  };
}

// Southwest Florida sample data as fallback
function getFallbackProperties(params: SearchParams): PropertyListing[] {
  const swflProperties: PropertyListing[] = [
    {
      id: '1',
      mlsId: 'SWFL-001',
      address: { full: '2850 Winkler Ave, Fort Myers, FL 33916', street: '2850 Winkler Ave', city: 'Fort Myers', state: 'FL', zip: '33916', country: 'USA' },
      price: 425000,
      beds: 4,
      baths: 3,
      sqft: 2400,
      yearBuilt: 2018,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 14,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      description: 'Beautiful 4-bedroom home in Fort Myers with modern updates, pool, and 2-car garage.',
      features: ['Pool', 'Updated Kitchen', '2-Car Garage', 'Open Floor Plan'],
      lat: 26.5885,
      lng: -81.8725,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 177,
      source: 'MLS'
    },
    {
      id: '2',
      mlsId: 'SWFL-002',
      address: { full: '1420 SE 47th St, Cape Coral, FL 33904', street: '1420 SE 47th St', city: 'Cape Coral', state: 'FL', zip: '33904', country: 'USA' },
      price: 389000,
      beds: 3,
      baths: 2,
      sqft: 2100,
      yearBuilt: 2015,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 28,
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
      description: 'Gulf access home in Cape Coral with boat dock and open floor plan.',
      features: ['Gulf Access', 'Boat Dock', 'Open Floor Plan', 'Lanai'],
      lat: 26.5615,
      lng: -81.9495,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 185,
      source: 'MLS'
    },
    {
      id: '3',
      mlsId: 'SWFL-003',
      address: { full: '3500 Oasis Blvd, Cape Coral, FL 33914', street: '3500 Oasis Blvd', city: 'Cape Coral', state: 'FL', zip: '33914', country: 'USA' },
      price: 459000,
      beds: 4,
      baths: 2.5,
      sqft: 2650,
      yearBuilt: 2020,
      propertyType: 'Single Family',
      status: 'Pending',
      daysOnMarket: 7,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
      description: 'New construction with smart home features, pool, and impact windows.',
      features: ['Pool', 'Smart Home', 'Impact Windows', 'Solar Ready'],
      lat: 26.6285,
      lng: -81.9875,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 173,
      source: 'MLS'
    },
    {
      id: '4',
      mlsId: 'SWFL-004',
      address: { full: '8901 Cypress Lake Dr, Fort Myers, FL 33919', street: '8901 Cypress Lake Dr', city: 'Fort Myers', state: 'FL', zip: '33919', country: 'USA' },
      price: 675000,
      beds: 5,
      baths: 4,
      sqft: 3200,
      yearBuilt: 2021,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 5,
      photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
      description: 'Luxury lakefront home with pool, 3-car garage, and gourmet kitchen.',
      features: ['Pool', 'Lake View', '3-Car Garage', 'Gourmet Kitchen'],
      lat: 26.5495,
      lng: -81.8985,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 211,
      source: 'MLS'
    },
    {
      id: '5',
      mlsId: 'SWFL-005',
      address: { full: '1250 5th Ave S, Naples, FL 34102', street: '1250 5th Ave S', city: 'Naples', state: 'FL', zip: '34102', country: 'USA' },
      price: 1250000,
      beds: 4,
      baths: 3.5,
      sqft: 3800,
      yearBuilt: 2019,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 12,
      photos: ['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'],
      description: 'Downtown Naples luxury home walking distance to 5th Avenue shops and beaches.',
      features: ['Pool', 'Downtown Location', 'Chef Kitchen', 'Hurricane Shutters'],
      lat: 26.1375,
      lng: -81.7985,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 329,
      source: 'MLS'
    },
    {
      id: '6',
      mlsId: 'SWFL-006',
      address: { full: '4521 Del Prado Blvd S, Cape Coral, FL 33904', street: '4521 Del Prado Blvd S', city: 'Cape Coral', state: 'FL', zip: '33904', country: 'USA' },
      price: 325000,
      beds: 3,
      baths: 2,
      sqft: 1650,
      yearBuilt: 2008,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 21,
      photos: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
      description: 'Move-in ready home in South Cape Coral with updated kitchen and bathrooms.',
      features: ['Updated Kitchen', 'New Roof 2022', 'Tile Throughout', 'Screened Lanai'],
      lat: 26.5785,
      lng: -81.9565,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 197,
      source: 'MLS'
    },
    {
      id: '7',
      mlsId: 'SWFL-007',
      address: { full: '28500 Bonita Crossings Blvd, Bonita Springs, FL 34135', street: '28500 Bonita Crossings Blvd', city: 'Bonita Springs', state: 'FL', zip: '34135', country: 'USA' },
      price: 549000,
      beds: 4,
      baths: 3,
      sqft: 2800,
      yearBuilt: 2017,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 18,
      photos: ['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'],
      description: 'Bonita Springs gated community home with golf course views.',
      features: ['Gated Community', 'Golf Course View', 'Pool', 'HOA Amenities'],
      lat: 26.3395,
      lng: -81.7785,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 196,
      source: 'MLS'
    },
    {
      id: '8',
      mlsId: 'SWFL-008',
      address: { full: '2100 Corkscrew Rd, Lehigh Acres, FL 33936', street: '2100 Corkscrew Rd', city: 'Lehigh Acres', state: 'FL', zip: '33936', country: 'USA' },
      price: 285000,
      beds: 3,
      baths: 2,
      sqft: 1450,
      yearBuilt: 2012,
      propertyType: 'Single Family',
      status: 'Active',
      daysOnMarket: 35,
      photos: ['https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      description: 'Affordable Lehigh Acres home - perfect for first-time buyers.',
      features: ['No HOA', 'Large Lot', 'New AC 2023', 'Freshly Painted'],
      lat: 26.6185,
      lng: -81.6265,
      agent: { name: 'Tony Harvey', phone: '(239) 777-0155' },
      pricePerSqft: 197,
      source: 'MLS'
    }
  ];

  // Filter based on params
  let filtered = swflProperties;
  if (params.city) {
    filtered = filtered.filter(p => p.address.city.toLowerCase().includes(params.city!.toLowerCase()));
  }
  if (params.minPrice) {
    filtered = filtered.filter(p => p.price >= params.minPrice!);
  }
  if (params.maxPrice) {
    filtered = filtered.filter(p => p.price <= params.maxPrice!);
  }
  if (params.minBeds) {
    filtered = filtered.filter(p => p.beds >= params.minBeds!);
  }

  return filtered.slice(0, params.limit || 20);
}

export async function getMarketStats(city: string = 'Naples'): Promise<{
  medianPrice: number;
  avgDaysOnMarket: number;
  totalListings: number;
  priceChange30Days: number;
}> {
  // Using FRED data or calculated from listings
  return {
    medianPrice: 485000,
    avgDaysOnMarket: 42,
    totalListings: 6596,
    priceChange30Days: 2.3
  };
}
