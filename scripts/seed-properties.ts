// scripts/seed-properties.ts
// Seeds database with 1,000 realistic Florida properties

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Florida cities with realistic pricing
const floridaCities = [
  { city: 'Fort Myers', medianPrice: 385000, zipCodes: ['33901', '33905', '33907', '33916', '33919'] },
  { city: 'Naples', medianPrice: 595000, zipCodes: ['34102', '34103', '34104', '34105', '34108'] },
  { city: 'Cape Coral', medianPrice: 425000, zipCodes: ['33904', '33909', '33914', '33990', '33991'] },
  { city: 'Tampa', medianPrice: 395000, zipCodes: ['33602', '33606', '33609', '33611', '33629'] },
  { city: 'Orlando', medianPrice: 375000, zipCodes: ['32801', '32803', '32806', '32817', '32819'] },
  { city: 'Miami', medianPrice: 565000, zipCodes: ['33125', '33129', '33130', '33131', '33133'] },
  { city: 'St. Petersburg', medianPrice: 385000, zipCodes: ['33701', '33703', '33704', '33705', '33710'] },
  { city: 'Jacksonville', medianPrice: 325000, zipCodes: ['32202', '32204', '32205', '32207', '32223'] },
  { city: 'Sarasota', medianPrice: 485000, zipCodes: ['34231', '34232', '34233', '34234', '34236'] },
  { city: 'Clearwater', medianPrice: 395000, zipCodes: ['33755', '33756', '33759', '33760', '33761'] }
]

const propertyTypes = ['single_family', 'condo', 'townhouse', 'multi_family', 'land']
const statuses = ['active', 'pending', 'sold']
const socialImpactTypes = ['veterans', 'first_responders', 'seniors', 'first_time_buyers', 'none']

// Property descriptions templates
const descriptions = [
  "Beautiful property with modern updates and spacious layout. Perfect for families looking for comfort and convenience.",
  "Stunning home featuring high ceilings, natural light, and premium finishes throughout. Must see!",
  "Charming property in a quiet neighborhood. Recently renovated kitchen and bathrooms. Great schools nearby.",
  "Elegant home with open floor plan and designer touches. Move-in ready with all appliances included.",
  "Gorgeous property with private backyard, perfect for entertaining. Close to shopping and dining.",
  "Spacious home with large bedrooms and plenty of storage. Great community amenities and location.",
  "Updated property with modern features and energy-efficient appliances. Low maintenance landscaping.",
  "Pristine home in desirable neighborhood. Walk to parks, schools, and community center.",
  "Beautifully maintained property with attention to detail. Granite counters, stainless appliances.",
  "Inviting home with warm finishes and thoughtful layout. Perfect for growing families."
]

function generateStreetName() {
  const prefixes = ['Oak', 'Maple', 'Pine', 'Elm', 'Cedar', 'Sunset', 'River', 'Lake', 'Park', 'Garden']
  const suffixes = ['Drive', 'Lane', 'Avenue', 'Circle', 'Way', 'Court', 'Boulevard', 'Street', 'Trail', 'Place']
  const number = Math.floor(Math.random() * 9000) + 1000
  return `${number} ${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
}

function generateProperty(cityData: typeof floridaCities[0]) {
  const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
  const status = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * 2) + 1] : 'active' // 80% active
  
  // Price variation based on property type
  let priceVariation = 1.0
  if (propertyType === 'condo') priceVariation = 0.7
  if (propertyType === 'townhouse') priceVariation = 0.85
  if (propertyType === 'multi_family') priceVariation = 1.3
  if (propertyType === 'land') priceVariation = 0.4
  
  const basePrice = cityData.medianPrice * priceVariation
  const price = Math.round((basePrice + (Math.random() * basePrice * 0.6 - basePrice * 0.3)) / 5000) * 5000
  
  // Property details based on type
  let bedrooms = 3
  let bathrooms = 2
  let squareFeet = 1800
  
  if (propertyType === 'condo') {
    bedrooms = Math.floor(Math.random() * 2) + 2 // 2-3 bed
    bathrooms = Math.floor(Math.random() * 2) + 1 // 1-2 bath
    squareFeet = 1000 + Math.floor(Math.random() * 800)
  } else if (propertyType === 'single_family') {
    bedrooms = Math.floor(Math.random() * 3) + 3 // 3-5 bed
    bathrooms = Math.floor(Math.random() * 2) + 2 // 2-3 bath
    squareFeet = 1500 + Math.floor(Math.random() * 2000)
  } else if (propertyType === 'townhouse') {
    bedrooms = Math.floor(Math.random() * 2) + 2 // 2-3 bed
    bathrooms = Math.floor(Math.random() * 2) + 2 // 2-3 bath
    squareFeet = 1200 + Math.floor(Math.random() * 1000)
  } else if (propertyType === 'multi_family') {
    bedrooms = Math.floor(Math.random() * 4) + 4 // 4-7 bed
    bathrooms = Math.floor(Math.random() * 3) + 3 // 3-5 bath
    squareFeet = 2500 + Math.floor(Math.random() * 2000)
  } else if (propertyType === 'land') {
    bedrooms = 0
    bathrooms = 0
    squareFeet = 0
  }
  
  // Lot size for houses and land
  let lotSize = null
  if (propertyType === 'single_family' || propertyType === 'land') {
    lotSize = 5000 + Math.floor(Math.random() * 15000)
  }
  
  // Year built
  const yearBuilt = Math.floor(Math.random() * 40) + 1984 // 1984-2024
  
  // Social impact (30% of properties)
  const socialImpact = Math.random() > 0.7 
    ? socialImpactTypes[Math.floor(Math.random() * (socialImpactTypes.length - 1))]
    : null
  
  // Features
  const features = []
  if (propertyType !== 'land') {
    if (Math.random() > 0.3) features.push('central_ac')
    if (Math.random() > 0.4) features.push('pool')
    if (Math.random() > 0.5) features.push('garage')
    if (Math.random() > 0.6) features.push('fireplace')
    if (Math.random() > 0.7) features.push('updated_kitchen')
    if (Math.random() > 0.8) features.push('hardwood_floors')
  }
  
  const zipCode = cityData.zipCodes[Math.floor(Math.random() * cityData.zipCodes.length)]
  
  return {
    address: generateStreetName(),
    city: cityData.city,
    state: 'FL',
    zip_code: zipCode,
    property_type: propertyType,
    listing_type: 'sale',
    price,
    bedrooms,
    bathrooms,
    square_feet: squareFeet,
    lot_size: lotSize,
    year_built: yearBuilt,
    status,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    features,
    social_impact_type: socialImpact,
    photos: [], // Photos will be added via Unsplash API or similar
    mls_id: `MLS${Math.floor(Math.random() * 9000000) + 1000000}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

async function seedProperties() {
  console.log('🌱 Starting property seeding...')
  console.log(`📍 Generating 1,000 properties across ${floridaCities.length} Florida cities`)
  
  const properties = []
  const propertiesPerCity = Math.floor(1000 / floridaCities.length)
  
  for (const cityData of floridaCities) {
    console.log(`\n🏙️  Generating ${propertiesPerCity} properties for ${cityData.city}...`)
    
    for (let i = 0; i < propertiesPerCity; i++) {
      properties.push(generateProperty(cityData))
    }
  }
  
  // Fill remaining to reach exactly 1000
  while (properties.length < 1000) {
    const randomCity = floridaCities[Math.floor(Math.random() * floridaCities.length)]
    properties.push(generateProperty(randomCity))
  }
  
  console.log(`\n✅ Generated ${properties.length} properties`)
  console.log('\n📤 Inserting into database...')
  
  // Insert in batches of 100
  const batchSize = 100
  let inserted = 0
  
  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize)
    const { error } = await supabase
      .from('properties')
      .insert(batch)
    
    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
    } else {
      inserted += batch.length
      console.log(`✅ Inserted batch ${i / batchSize + 1}/${Math.ceil(properties.length / batchSize)} (${inserted} total)`)
    }
  }
  
  console.log(`\n🎉 Successfully seeded ${inserted} properties!`)
  console.log('\n📊 Breakdown by city:')
  
  for (const cityData of floridaCities) {
    const count = properties.filter(p => p.city === cityData.city).length
    console.log(`   ${cityData.city}: ${count} properties (median: $${cityData.medianPrice.toLocaleString()})`)
  }
  
  console.log('\n📊 Social Impact Properties:')
  for (const type of socialImpactTypes) {
    if (type === 'none') continue
    const count = properties.filter(p => p.social_impact_type === type).length
    console.log(`   ${type}: ${count} properties`)
  }
}

// Run the seed function
seedProperties()
  .then(() => {
    console.log('\n✅ Seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  })
