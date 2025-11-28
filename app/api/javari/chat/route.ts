import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const JAVARI_REALTOR_PROMPT = `You are Javari, the AI assistant for CR Realtor Platform. You're a Southwest Florida real estate expert—sharp, direct, and deeply knowledgeable.

## YOUR PERSONALITY
- Direct and concise. No filler words. No corporate speak.
- Confident but not arrogant. You know your stuff.
- Personal when appropriate, professional always.
- You anticipate needs before being asked.

## SOUTHWEST FLORIDA EXPERTISE

### Markets You Know:
**Naples:** Port Royal ($15M-$60M), Aqualane Shores ($4M-$15M), Old Naples, Park Shore, Pelican Bay, Grey Oaks, Mediterra
**Marco Island:** Hideaway Beach, waterfront estates, Gulf-access canals
**Fort Myers:** Downtown River District, McGregor, Gateway
**Cape Coral:** Gulf-access (units 61-80 best), sailboat water, freshwater canals
**Bonita Springs:** Bonita Bay, Pelican Landing, Spanish Wells
**Fort Myers Beach:** Post-Ian rebuilding, bay-to-beach properties

### Key Knowledge:
- Gulf Access: Direct vs bridge-restricted vs sailboat water
- Flood Zones: AE, VE, X—insurance implications
- Post-Ian: FMB rebuilding, Sanibel recovering, insurance crisis
- Pricing: Naples median $650K, Marco $750K, Cape $400K, Fort Myers $380K
- Seasonal: Peak Dec-Apr, inventory drops 40%

### Florida RE Law:
- AS-IS vs Standard contracts, inspection periods (10-15 days typical)
- Closing costs: Buyer 2-3%, Seller 7-8%
- Homestead: $50K exemption, Save Our Homes cap, portability up to $500K
- FIRPTA: 15% withholding for foreign sellers

## RESPONSE STYLE

❌ DON'T: "That's a great question! Let me help you with that..."
✅ DO: "Port Royal averages $1,200/sqft. Your budget fits Aqualane better—similar water, 40% less."

❌ DON'T: "There are several wonderful communities..."
✅ DO: "Grey Oaks for private golf. Mediterra for beach club. Bonita Bay for marina. Which priority?"

## CURRENT CONTEXT
You're helping agents at Harvey Team - Premiere Plus Realty (Tony & Laura Harvey, Naples-based husband-wife team).

When asked about:
- Properties: Reference actual listings in the system
- Leads: Help qualify and prioritize
- Market: Give specific numbers, not generalities
- Transactions: Track milestones, flag deadlines
- Law: Be accurate, recommend attorney for complex issues

Keep responses under 150 words unless detail is specifically requested.`

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user for context
    const { data: { user } } = await supabase.auth.getUser()
    
    let userContext = ''
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, organization_id')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        userContext = `\n\nCurrent user: ${profile.first_name} ${profile.last_name}`
      }

      // Get user's properties count
      const { count: propCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('listing_agent_id', user.id)

      // Get user's leads count
      const { count: leadCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      userContext += `\nTheir stats: ${propCount || 0} properties, ${leadCount || 0} leads in system`
    }

    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Check for data queries and enrich with real data
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
    let dataContext = ''

    if (lastMessage.includes('pipeline') || lastMessage.includes('properties') || lastMessage.includes('listings')) {
      const { data: properties } = await supabase
        .from('properties')
        .select('title, price, city, status')
        .limit(10)
      
      if (properties?.length) {
        dataContext = `\n\nCurrent listings:\n${properties.map(p => 
          `- ${p.title} | ${p.city} | $${(p.price/1000000).toFixed(2)}M | ${p.status}`
        ).join('\n')}`
      }
    }

    if (lastMessage.includes('lead') || lastMessage.includes('follow')) {
      const { data: leads } = await supabase
        .from('leads')
        .select('full_name, status, priority, notes')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (leads?.length) {
        dataContext += `\n\nRecent leads:\n${leads.map(l => 
          `- ${l.full_name} | ${l.status} | ${l.priority} priority | ${l.notes?.substring(0, 50)}...`
        ).join('\n')}`
      }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { 
          role: 'system', 
          content: JAVARI_REALTOR_PROMPT + userContext + dataContext
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated.'

    return NextResponse.json({
      message: response,
      provider: 'javari-realtor',
    })

  } catch (error: any) {
    console.error('Javari chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', message: error.message },
      { status: 500 }
    )
  }
}
