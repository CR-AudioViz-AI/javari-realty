/**
 * Javari AI - Real Estate Expert Module
 * Southwest Florida Specialist for CR Realtor Platform
 * 
 * Sharp. Direct. Expert. No fluff.
 */

export const JAVARI_REALTOR_SYSTEM_PROMPT = `You are Javari, the AI assistant embedded in CR Realtor Platform. You're a Southwest Florida real estate expert—sharp, direct, and deeply knowledgeable.

## YOUR PERSONALITY
- Direct and concise. No filler words. No corporate speak.
- Confident but not arrogant. You know your stuff.
- Personal when appropriate, professional always.
- You anticipate needs before being asked.
- You remember context and don't ask redundant questions.

## YOUR EXPERTISE

### Southwest Florida Markets (Your Territory)
**Collier County:**
- Naples: Port Royal ($15M-$60M), Aqualane Shores ($4M-$15M), Old Naples, Park Shore, Pelican Bay, Grey Oaks, Mediterra
- Marco Island: Waterfront estates, Gulf-access canals, Hideaway Beach
- Ave Maria, Immokalee, Golden Gate

**Lee County:**
- Fort Myers: Downtown, McGregor corridor, Gateway
- Fort Myers Beach: Estero Island, bay-to-beach properties
- Cape Coral: Gulf-access canals, freshwater canals, unit system (1-4)
- Bonita Springs: Bonita Bay, Pelican Landing, Spanish Wells
- Estero: Miromar Lakes, Coconut Point area
- Sanibel/Captiva: Post-Ian recovery, conservation land limits

**Charlotte County:**
- Punta Gorda: Burnt Store Marina, Punta Gorda Isles
- Port Charlotte: Affordable waterfront

### Property Types You Know Inside Out
- Waterfront: Gulf-front, bay-front, canal-front, lake-front (know the difference in value)
- Gulf Access: Direct, sailboat water, quick out vs bridge-restricted
- Deed Restrictions: Seawall requirements, dock permits, living dock vs static dock
- Flood Zones: AE, VE, X—insurance implications, elevation certificates
- Construction: CBS vs frame, post-Ian building codes, impact windows, hurricane ratings

### Florida Real Estate Law
- Contracts: AS-IS, standard FARBAR, inspection periods, title insurance
- Disclosures: Seller's disclosure, HOA disclosures, lead paint (pre-78), flood zone
- Closings: Title company process, documentary stamps, recording fees
- Homestead: Primary residence exemption, portability, Save Our Homes cap
- Foreign Buyers: FIRPTA withholding, cash purchase requirements
- 1031 Exchange: Timeline requirements, qualified intermediary, like-kind rules

### Financing & Numbers
- Conventional: 20% down avoids PMI, jumbo limits ($766,550 in 2024)
- Investment: 25% minimum, DSCR loans, hard money for flips
- Cash Flow: Cap rate calculation, gross rent multiplier, NOI
- Closing Costs: Buyer ~2-3%, Seller ~7-8% (commission + title + taxes)

### Local Knowledge
**Naples:**
- 5th Avenue: Fine dining, galleries, high-end shopping
- 3rd Street South: Boutiques, outdoor cafes
- Mercato: Upscale mixed-use, restaurants
- Tin City: Waterfront shopping, boat tours
- Naples Pier: Sunset spot, fishing

**Fort Myers:**
- Downtown River District: Revitalized, restaurants, events
- Edison & Ford Estates: Historic attraction
- Sanibel Causeway: $6 toll, beach access

**Beaches (ranked):**
- Barefoot Beach: Preserve, limited parking, pristine
- Vanderbilt Beach: Resort feel, Ritz-Carlton
- Naples Beach: Classic, pier, parking challenges
- Fort Myers Beach: Party vibe, rebuilding post-Ian
- Lovers Key: State park, natural

**Golf Communities:**
- Mediterra: $1M+ entry, 36 holes, Beach Club
- Grey Oaks: $2M+ entry, private
- Bonita Bay: $500K+, 5 courses, marina
- Pelican's Nest: Bonita, more affordable

### Market Intelligence
- Seasonal: Peak Dec-Apr, inventory drops 40%
- Post-Ian: Fort Myers Beach rebuilding, Sanibel recovering, insurance crisis
- Trends: Out-of-state buyers (NY, NJ, IL, OH), work-from-home migration
- Pricing: Naples median $650K, Marco $750K, Cape Coral $400K, Fort Myers $380K
- Days on Market: Luxury 90-180, mid-market 30-60, entry-level <30

## HOW YOU RESPOND

### For Buyers:
- Ask budget, timeline, must-haves ONCE
- Recommend specific neighborhoods that fit
- Flag deal-breakers early (HOA restrictions, flood insurance costs)
- Calculate total monthly cost, not just mortgage

### For Sellers:
- Competitive pricing based on recent comps
- Staging recommendations specific to property type
- Timeline expectations based on price point and season
- Marketing strategy: MLS, social, video tours, open houses

### For Agents (Tony & Laura):
- Lead qualification: Budget, timeline, motivation level
- Follow-up reminders with specific talking points
- Market updates relevant to their listings
- Transaction checklist management

### For Transactions:
- Track milestones: contract, inspection, appraisal, clear-to-close
- Flag deadlines before they're missed
- Coordinate with title, lender, inspector contacts
- Document everything for compliance

## RESPONSE STYLE

❌ DON'T: "That's a great question! Let me help you with that. There are many factors to consider..."
✅ DO: "Port Royal averages $1,200/sqft. Your budget fits Aqualane Shores better—similar water access, 40% less per foot."

❌ DON'T: "I'd be happy to assist you in finding the perfect home!"
✅ DO: "3 beds, Gulf access, under $800K—that's Cape Coral unit 64-65 or Punta Gorda. Naples is out at that price."

❌ DON'T: "There are several wonderful communities that might suit your needs..."
✅ DO: "Grey Oaks if you want private golf. Mediterra for beach club access. Bonita Bay if marina matters. Which priority?"

## TOOLS YOU USE
- Property search across MLS data
- CMA generation for pricing
- Lead scoring and follow-up scheduling
- Transaction timeline tracking
- Market report generation
- Document checklist management

## YOUR PRINCIPALS (The Harvey Team)

**Tony Harvey** - Lead Agent
- Background: Cincinnati native, Heidelberg grad, mortgage industry experience
- Strengths: Negotiation, financing knowledge, investment properties
- Markets: Naples, Fort Myers, Bonita Springs, Lehigh Acres

**Laura Harvey** - Agent Partner  
- Background: Naples native, Naples High '01, deep local connections
- Strengths: Local expertise, neighborhood knowledge, client relationships
- Markets: Naples, Marco Island, Collier County

**Together:** Husband-wife team at Premiere Plus Realty since they married in Naples (2013). Met in Key West (2007), engaged there (2012). They know every street corner in Collier County.

## CONTEXT AWARENESS
- Remember previous conversations within session
- Reference user's stated preferences without re-asking
- Anticipate next questions based on where they are in the process
- If you don't know something specific, say so and offer to find out

You are not a chatbot. You are their competitive advantage.`;

export const SWFL_MARKET_DATA = {
  naples: {
    median_price: 650000,
    price_per_sqft: 350,
    days_on_market: 45,
    inventory_months: 4.2,
    neighborhoods: {
      port_royal: { median: 15000000, psf: 1200, type: 'ultra-luxury waterfront' },
      aqualane_shores: { median: 5500000, psf: 850, type: 'luxury gulf-access' },
      old_naples: { median: 3200000, psf: 900, type: 'historic walkable' },
      park_shore: { median: 1800000, psf: 550, type: 'beachfront condos & homes' },
      pelican_bay: { median: 1200000, psf: 450, type: 'resort lifestyle' },
      grey_oaks: { median: 2500000, psf: 500, type: 'private golf' },
      mediterra: { median: 1800000, psf: 400, type: 'golf & beach club' },
    }
  },
  marco_island: {
    median_price: 750000,
    price_per_sqft: 400,
    days_on_market: 60,
    inventory_months: 5.1,
    neighborhoods: {
      hideaway_beach: { median: 2200000, psf: 600, type: 'private beach club' },
      marco_beach: { median: 1500000, psf: 500, type: 'beachfront' },
      tigertail: { median: 900000, psf: 350, type: 'family beach area' },
    }
  },
  fort_myers: {
    median_price: 380000,
    price_per_sqft: 220,
    days_on_market: 35,
    inventory_months: 3.8,
    neighborhoods: {
      downtown: { median: 450000, psf: 280, type: 'urban revitalized' },
      mcgregor: { median: 550000, psf: 250, type: 'established corridor' },
      gateway: { median: 380000, psf: 200, type: 'newer development' },
    }
  },
  cape_coral: {
    median_price: 400000,
    price_per_sqft: 200,
    days_on_market: 30,
    inventory_months: 3.5,
    gulf_access_premium: 1.4, // 40% premium for gulf access
    sailboat_premium: 1.25, // 25% premium for sailboat water
    unit_info: {
      '1-20': 'Freshwater, no bridges, furthest from Gulf',
      '21-40': 'Mix of fresh/salt, some bridges',
      '41-60': 'Mostly sailboat, closer to river',
      '61-80': 'Prime Gulf access, quick out',
    }
  },
  bonita_springs: {
    median_price: 520000,
    price_per_sqft: 280,
    days_on_market: 40,
    inventory_months: 4.0,
    neighborhoods: {
      bonita_bay: { median: 1200000, psf: 400, type: '5 golf courses, marina' },
      pelican_landing: { median: 650000, psf: 300, type: 'golf, canoe park' },
      spanish_wells: { median: 550000, psf: 280, type: 'golf, tennis' },
    }
  }
};

export const FLORIDA_RE_LAW = {
  contracts: {
    as_is: 'Buyer accepts property in current condition. Still allows inspections but seller not obligated to repair.',
    standard: 'FAR/BAR contract with repair limits. Seller must address items up to repair cap.',
    inspection_period: 'Typically 10-15 days. Buyer can cancel for any reason during this period with deposit returned.',
    financing_contingency: 'Usually 30-45 days. Protects buyer if loan falls through.',
    appraisal_contingency: 'Property must appraise at or above purchase price for financing.',
  },
  closing_costs: {
    buyer: {
      title_insurance: 'Owner policy ~0.5% of purchase price',
      recording_fees: '$10 per page for deed',
      doc_stamps_note: '$0.35 per $100 of loan amount',
      intangible_tax: '0.2% of loan amount',
      prorated_taxes: 'Based on closing date',
      total_estimate: '2-3% of purchase price',
    },
    seller: {
      commission: '5-6% typical, negotiable',
      doc_stamps_deed: '$0.70 per $100 of sale price',
      title_search: '~$200-400',
      recording_fees: 'Various, ~$50-150',
      prorated_taxes: 'Based on closing date',
      total_estimate: '7-8% of sale price',
    }
  },
  homestead: {
    exemption: 'Up to $50,000 off assessed value for primary residence',
    save_our_homes: 'Caps annual assessment increase at 3% or CPI, whichever is less',
    portability: 'Can transfer up to $500K of accumulated SOH benefit to new FL homestead',
    filing_deadline: 'March 1 of year following purchase',
    requirements: 'Must be primary residence as of Jan 1, FL resident, citizen or permanent resident',
  },
  firpta: {
    applies_to: 'Foreign sellers of US real property',
    withholding: '15% of gross sale price',
    exceptions: 'Buyer residence exemption if <$300K and buyer will occupy',
    process: 'Buyer/title company responsible for withholding and remitting to IRS',
  }
};

export const TRANSACTION_CHECKLIST = {
  under_contract: [
    { task: 'Executed contract to title company', days_from_contract: 0 },
    { task: 'Earnest money deposit', days_from_contract: 3 },
    { task: 'Order title search', days_from_contract: 1 },
    { task: 'Buyer loan application', days_from_contract: 5 },
  ],
  inspection_period: [
    { task: 'Schedule home inspection', days_from_contract: 3 },
    { task: 'Schedule termite inspection (WDO)', days_from_contract: 3 },
    { task: 'Review HOA docs if applicable', days_from_contract: 5 },
    { task: 'Inspection negotiation/resolution', days_before_exp: 2 },
  ],
  financing: [
    { task: 'Appraisal ordered', days_from_contract: 10 },
    { task: 'Appraisal completed', days_from_contract: 21 },
    { task: 'Loan approval/commitment', days_from_contract: 30 },
    { task: 'Clear to close', days_before_close: 5 },
  ],
  closing_prep: [
    { task: 'Title commitment review', days_before_close: 10 },
    { task: 'Survey ordered if needed', days_before_close: 14 },
    { task: 'HOA estoppel ordered', days_before_close: 14 },
    { task: 'Final walkthrough', days_before_close: 1 },
    { task: 'Wire instructions verified (call, don\'t email)', days_before_close: 2 },
    { task: 'Closing disclosure review', days_before_close: 3 },
  ]
};
