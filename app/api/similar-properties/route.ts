import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('property_id')
  const limit = parseInt(searchParams.get('limit') || '6')

  if (!propertyId) {
    return NextResponse.json({ error: 'property_id required' }, { status: 400 })
  }

  try {
    // Get the reference property
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (propError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Find similar properties based on:
    // 1. Same city
    // 2. Similar price range (±25%)
    // 3. Similar bedrooms (±1)
    // 4. Same property type (preferred)
    const priceMin = property.price * 0.75
    const priceMax = property.price * 1.25
    const bedsMin = Math.max(1, property.bedrooms - 1)
    const bedsMax = property.bedrooms + 1

    const { data: similar, error: simError } = await supabase
      .from('properties')
      .select('id, address, city, state, zip, price, bedrooms, bathrooms, sqft, property_type, photos, status')
      .eq('status', 'active')
      .neq('id', propertyId)
      .eq('city', property.city)
      .gte('price', priceMin)
      .lte('price', priceMax)
      .gte('bedrooms', bedsMin)
      .lte('bedrooms', bedsMax)
      .limit(limit)
      .order('price', { ascending: true })

    if (simError) throw simError

    // If not enough similar in same city, expand search
    let results = similar || []
    if (results.length < limit) {
      const { data: moreSimilar } = await supabase
        .from('properties')
        .select('id, address, city, state, zip, price, bedrooms, bathrooms, sqft, property_type, photos, status')
        .eq('status', 'active')
        .neq('id', propertyId)
        .gte('price', priceMin)
        .lte('price', priceMax)
        .gte('bedrooms', bedsMin)
        .lte('bedrooms', bedsMax)
        .not('id', 'in', `(${results.map(r => `'${r.id}'`).join(',') || "''"})`)
        .limit(limit - results.length)

      if (moreSimilar) {
        results = [...results, ...moreSimilar]
      }
    }

    // Calculate similarity scores
    const scored = results.map(p => {
      let score = 100

      // Price difference penalty
      const priceDiff = Math.abs(p.price - property.price) / property.price
      score -= priceDiff * 30

      // Bedroom difference penalty
      const bedDiff = Math.abs(p.bedrooms - property.bedrooms)
      score -= bedDiff * 10

      // City match bonus
      if (p.city === property.city) score += 10

      // Property type match bonus
      if (p.property_type === property.property_type) score += 15

      // Sqft difference penalty
      if (property.sqft && p.sqft) {
        const sqftDiff = Math.abs(p.sqft - property.sqft) / property.sqft
        score -= sqftDiff * 20
      }

      return { ...p, similarity_score: Math.max(0, Math.round(score)) }
    })

    // Sort by similarity score
    scored.sort((a, b) => b.similarity_score - a.similarity_score)

    return NextResponse.json({
      reference_property: {
        id: property.id,
        address: property.address,
        price: property.price,
        bedrooms: property.bedrooms,
        property_type: property.property_type
      },
      similar_properties: scored.slice(0, limit)
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
