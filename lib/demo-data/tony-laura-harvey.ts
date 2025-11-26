// lib/demo-data/tony-laura-harvey.ts
// Demo Data for Tony & Laura Harvey - Premiere Plus Realty
// This data is isolated to their demo account only

export const DEMO_BROKER = {
  id: 'demo-premiere-plus-001',
  name: 'Premiere Plus Realty',
  logo: '/demo/premiere-plus-logo.png',
  phone: '239-777-0155',
  email: 'info@listorbuyrealestate.com',
  website: 'https://listorbuyrealestate.com',
  address: '9015 Strada Stell Ct, Ste. 104',
  city: 'Naples',
  state: 'FL',
  zip: '34109',
  tagline: 'Your Dream Home Awaits',
  markets: ['Naples', 'Fort Myers', 'Bonita Springs', 'Lehigh Acres', 'Cape Coral'],
  license: 'NPLSMLS-100139'
}

export const DEMO_AGENTS = [
  {
    id: 'demo-agent-tony-001',
    name: 'Tony Harvey',
    email: 'tony@listorbuyrealestate.com',
    phone: '(239) 777-0155',
    photo: '/demo/tony-harvey.jpg',
    title: 'Real Estate Professional',
    license: 'FL-BK-123456',
    bio: `Tony grew up in Cincinnati, Ohio (Westside) and graduated from Heidelberg University in Tiffin, Ohio. He quickly decided he wanted to move near the beach, so off he went to Fort Myers (2005) where his grandparents resided. He has lived in Lehigh, Fort Myers, Bonita Springs, and now Naples.

After working in the Mortgage industry for several years he decided Real Estate was a passion. With Tony's background in the mortgage industry and strong negotiation skills, he brings analytical precision and market insight to every transaction.`,
    specialties: ['Residential Sales', 'First-Time Buyers', 'Investment Properties', 'Mortgage Expertise'],
    markets: ['Naples', 'Fort Myers', 'Bonita Springs', 'Lehigh Acres', 'Cape Coral'],
    education: 'Heidelberg University, Tiffin, Ohio',
    experience: '10+ years in Real Estate & Mortgage Industry',
    stats: {
      propertiesSold: 87,
      totalVolume: 42500000,
      avgDaysOnMarket: 28,
      listToSaleRatio: 98.2,
      clientSatisfaction: 4.9
    }
  },
  {
    id: 'demo-agent-laura-001',
    name: 'Laura Harvey',
    email: 'laura@listorbuyrealestate.com',
    phone: '(239) 777-0156',
    photo: '/demo/laura-harvey.jpg',
    title: 'Real Estate Professional',
    license: 'FL-SL-789012',
    bio: `Laura was fortunate enough to be born in the quaint little town of Naples. She attended Lake Park Elementary (K-5), Gulfview Middle (6th-8th), and graduated from Naples High School in 2001. She has tended bar and served tables throughout Collier County, building deep connections in the community over 9+ years in downtown Naples.

Laura offers unparalleled local knowledge of Collier County and surrounding areas. Her deep roots in the community mean she knows every neighborhood, every school, and every hidden gem that makes Southwest Florida special.`,
    specialties: ['Local Expert', 'Luxury Homes', 'Waterfront Properties', 'Relocation Services'],
    markets: ['Naples', 'Fort Myers', 'Bonita Springs', 'Marco Island'],
    education: 'Naples High School, Class of 2001',
    experience: '8+ years in Real Estate',
    localKnowledge: true,
    stats: {
      propertiesSold: 72,
      totalVolume: 38200000,
      avgDaysOnMarket: 31,
      listToSaleRatio: 97.8,
      clientSatisfaction: 4.95
    }
  }
]

export const DEMO_STORY = {
  title: 'Our Story',
  subtitle: 'A Husband & Wife Team Dedicated to Your Dream Home',
  content: `We are Tony & Laura Harvey! Why are we here? One reason… We are a husband and wife team that both became realtors to help people like you find your dream home.

We met in April of 2007 in Key West, got engaged in Key West in 2012, and Married here in beautiful Naples a year later (2013).

Together, we bring a unique combination of expertise to the Southwest Florida real estate market. Tony's background in the mortgage industry and strong negotiation skills combined with Laura's deep local knowledge of Collier County makes us the perfect team to meet and exceed your real estate needs.

Whether you're buying your first home, investing in commercial property, or leasing industrial space, Tony and Laura are committed to making your real estate journey smooth and successful.`,
  timeline: [
    { year: 2007, event: 'Met in Key West' },
    { year: 2012, event: 'Engaged in Key West' },
    { year: 2013, event: 'Married in Naples' },
    { year: 2015, event: 'Started Real Estate Journey Together' },
    { year: 2024, event: 'Joined CR Realtor Platform' }
  ]
}

// Sample Naples Properties for Demo
export const DEMO_PROPERTIES = [
  {
    id: 'demo-prop-001',
    mls: 'NAPLES-2024-001',
    title: 'Stunning Waterfront Estate in Port Royal',
    address: '4100 Gordon Drive',
    city: 'Naples',
    state: 'FL',
    zip: '34102',
    price: 12500000,
    type: 'residential_sale',
    category: 'Single Family Home',
    bedrooms: 6,
    bathrooms: 7,
    sqft: 8500,
    lotSize: 0.85,
    yearBuilt: 2019,
    description: 'Magnificent waterfront estate in prestigious Port Royal with direct Gulf access. Features include a private dock, infinity pool, chef\'s kitchen, home theater, and breathtaking sunset views.',
    features: ['Waterfront', 'Private Dock', 'Pool', 'Smart Home', 'Wine Cellar', 'Home Theater', 'Gulf Access'],
    images: ['/demo/properties/port-royal-1.jpg', '/demo/properties/port-royal-2.jpg'],
    agent: 'demo-agent-tony-001',
    status: 'active',
    neighborhood: 'Port Royal',
    virtualTour: true,
    daysOnMarket: 14
  },
  {
    id: 'demo-prop-002',
    mls: 'NAPLES-2024-002',
    title: 'Luxury Golf Course Home in Pelican Bay',
    address: '6955 Verde Way',
    city: 'Naples',
    state: 'FL',
    zip: '34108',
    price: 3250000,
    type: 'residential_sale',
    category: 'Single Family Home',
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 4200,
    lotSize: 0.45,
    yearBuilt: 2017,
    description: 'Elegant golf course home in sought-after Pelican Bay. Open floor plan, gourmet kitchen, resort-style pool, and membership to private beach club included.',
    features: ['Golf Course View', 'Pool', 'Beach Club Access', 'Gated Community', 'Impact Windows'],
    images: ['/demo/properties/pelican-bay-1.jpg'],
    agent: 'demo-agent-laura-001',
    status: 'active',
    neighborhood: 'Pelican Bay',
    virtualTour: true,
    daysOnMarket: 7
  },
  {
    id: 'demo-prop-003',
    mls: 'NAPLES-2024-003',
    title: 'Downtown Naples Condo with Gulf Views',
    address: '4051 Gulf Shore Blvd N #1201',
    city: 'Naples',
    state: 'FL',
    zip: '34103',
    price: 1875000,
    type: 'residential_sale',
    category: 'Condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2100,
    yearBuilt: 2008,
    description: 'Penthouse-level condo with panoramic Gulf of Mexico views. Updated throughout with marble floors, designer kitchen, and expansive balcony for enjoying spectacular sunsets.',
    features: ['Gulf Views', 'Penthouse Level', 'Concierge', 'Fitness Center', 'Beach Access'],
    images: ['/demo/properties/gulf-shore-1.jpg'],
    agent: 'demo-agent-tony-001',
    status: 'active',
    neighborhood: 'Park Shore',
    virtualTour: true,
    daysOnMarket: 21
  },
  {
    id: 'demo-prop-004',
    mls: 'NAPLES-2024-004',
    title: 'Family Home in Naples Park',
    address: '748 97th Ave N',
    city: 'Naples',
    state: 'FL',
    zip: '34108',
    price: 625000,
    type: 'residential_sale',
    category: 'Single Family Home',
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1850,
    lotSize: 0.25,
    yearBuilt: 2005,
    description: 'Perfect family home minutes from Vanderbilt Beach. No HOA! Updated kitchen, new roof (2023), screened lanai, and room to add a pool.',
    features: ['No HOA', 'New Roof', 'Near Beach', 'Room for Pool', 'Great Schools'],
    images: ['/demo/properties/naples-park-1.jpg'],
    agent: 'demo-agent-laura-001',
    status: 'active',
    neighborhood: 'Naples Park',
    virtualTour: false,
    daysOnMarket: 5
  },
  {
    id: 'demo-prop-005',
    mls: 'NAPLES-2024-005',
    title: 'Commercial Retail Space - 5th Avenue',
    address: '699 5th Ave S',
    city: 'Naples',
    state: 'FL',
    zip: '34102',
    price: 2100000,
    type: 'commercial_sale',
    category: 'Retail',
    sqft: 3500,
    yearBuilt: 1995,
    description: 'Prime retail location on famous 5th Avenue South in downtown Naples. High foot traffic, excellent visibility, currently leased to national tenant.',
    features: ['Prime Location', 'High Traffic', 'Currently Leased', 'NNN Lease', '6% Cap Rate'],
    images: ['/demo/properties/5th-ave-1.jpg'],
    agent: 'demo-agent-tony-001',
    status: 'active',
    neighborhood: 'Downtown Naples',
    capRate: 6.0,
    daysOnMarket: 45
  },
  {
    id: 'demo-prop-006',
    mls: 'NAPLES-2024-006',
    title: 'Industrial Warehouse - Collier County',
    address: '3411 Westview Dr',
    city: 'Naples',
    state: 'FL',
    zip: '34104',
    price: 1450000,
    type: 'industrial_sale',
    category: 'Warehouse',
    sqft: 12000,
    lotSize: 1.2,
    yearBuilt: 2010,
    ceilingHeight: 24,
    description: 'Modern warehouse with office space. 3 loading docks, 24\' clear height, fenced yard. Ideal for distribution or light manufacturing.',
    features: ['3 Loading Docks', '24\' Ceiling', 'Fenced Yard', 'Office Space', 'I-75 Access'],
    images: ['/demo/properties/warehouse-1.jpg'],
    agent: 'demo-agent-tony-001',
    status: 'active',
    neighborhood: 'East Naples Industrial',
    daysOnMarket: 30
  },
  {
    id: 'demo-prop-007',
    mls: 'FM-2024-001',
    title: 'Gulf Access Home in Cape Coral',
    address: '5418 Pelican Blvd',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33914',
    price: 895000,
    type: 'residential_sale',
    category: 'Single Family Home',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    lotSize: 0.35,
    yearBuilt: 2018,
    description: 'Beautiful gulf access home on intersecting canals. Private dock, heated pool, open floor plan. Quick boat ride to Sanibel and Gulf of Mexico.',
    features: ['Gulf Access', 'Private Dock', 'Heated Pool', 'Canal Views', 'Boat Lift'],
    images: ['/demo/properties/cape-coral-1.jpg'],
    agent: 'demo-agent-laura-001',
    status: 'active',
    neighborhood: 'Cape Coral',
    virtualTour: true,
    daysOnMarket: 12
  },
  {
    id: 'demo-prop-008',
    mls: 'FM-2024-002',
    title: 'Luxury Rental in Bonita Springs',
    address: '27134 Serrano Way',
    city: 'Bonita Springs',
    state: 'FL',
    zip: '34135',
    price: 5500,
    type: 'residential_rent',
    category: 'Single Family Home',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2400,
    yearBuilt: 2020,
    description: 'Furnished luxury rental in Bonita Bay. Screened pool, lake views, golf membership available. Minimum 6-month lease.',
    features: ['Furnished', 'Pool', 'Lake Views', 'Gated Community', 'Golf Available'],
    images: ['/demo/properties/bonita-1.jpg'],
    agent: 'demo-agent-laura-001',
    status: 'active',
    neighborhood: 'Bonita Bay',
    leaseTerms: '6+ months',
    daysOnMarket: 3
  }
]

// Demo Credentials
export const DEMO_CREDENTIALS = {
  broker: {
    email: 'demo-admin@premiere-plus.cr-realtor.com',
    password: 'DemoAdmin2024!',
    role: 'broker_admin'
  },
  tony: {
    email: 'demo-tony@premiere-plus.cr-realtor.com',
    password: 'DemoTony2024!',
    role: 'agent'
  },
  laura: {
    email: 'demo-laura@premiere-plus.cr-realtor.com',
    password: 'DemoLaura2024!',
    role: 'agent'
  },
  client: {
    email: 'demo-buyer@premiere-plus.cr-realtor.com',
    password: 'DemoBuyer2024!',
    role: 'client'
  }
}

// Demo Statistics for Dashboard
export const DEMO_STATS = {
  totalListings: 24,
  activeListings: 18,
  pendingListings: 4,
  soldThisMonth: 6,
  totalLeads: 127,
  newLeadsThisWeek: 23,
  showingsScheduled: 8,
  avgDaysOnMarket: 28,
  totalVolumeMTD: 8750000,
  totalVolumeYTD: 42500000,
  conversionRate: 23.5,
  clientSatisfaction: 4.92
}
