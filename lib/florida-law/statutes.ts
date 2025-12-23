// lib/florida-law/statutes.ts
// Florida Real Estate Law Reference Database - COMPLETE
// Source: http://www.leg.state.fl.us/statutes/

export interface StatuteSection {
  section: string
  title: string
  summary: string
  url: string
  keyPoints: string[]
  applicableTo: ('buyer' | 'seller' | 'landlord' | 'tenant' | 'agent' | 'investor')[]
  lastUpdated?: string
}

export interface StatuteChapter {
  chapter: number
  title: string
  description: string
  url: string
  sections: StatuteSection[]
}

export const FLORIDA_REAL_ESTATE_LAW: StatuteChapter[] = [
  {
    chapter: 83,
    title: 'Landlord and Tenant',
    description: 'Governs the relationship between landlords and tenants, including security deposits, evictions, and obligations.',
    url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/0083ContentsIndex.html',
    sections: [
      {
        section: '83.49',
        title: 'Deposit Money or Advance Rent',
        summary: 'Security deposits must be held in a separate account. Landlord must notify tenant of deposit location within 30 days. Upon termination, landlord has 15-60 days to return deposit.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0083/Sections/0083.49.html',
        keyPoints: [
          'Deposit must be held in separate account or surety bond posted',
          'Written notice to tenant within 30 days of receiving deposit',
          'Return within 15 days if no claims, 30 days notice if claiming deductions',
          'Tenant has 15 days to object to proposed deductions',
          'Failure to comply forfeits right to make claims'
        ],
        applicableTo: ['landlord', 'tenant', 'agent']
      },
      {
        section: '83.51',
        title: 'Landlord\'s Obligation to Maintain Premises',
        summary: 'Landlord must comply with building codes and maintain structural components, plumbing, and common areas.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0083/Sections/0083.51.html',
        keyPoints: [
          'Comply with all applicable building, housing, and health codes',
          'Maintain structural components (roof, windows, doors, floors)',
          'Provide working plumbing and reasonable heat',
          'Maintain common areas in safe condition',
          'Provide functioning locks and keys'
        ],
        applicableTo: ['landlord', 'tenant']
      },
      {
        section: '83.56',
        title: 'Termination of Rental Agreement',
        summary: 'Notice requirements: 3 days for nonpayment, 7 days for violations, 15 days for month-to-month.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0083/Sections/0083.56.html',
        keyPoints: [
          'Nonpayment: 3-day notice (excluding weekends/holidays)',
          'Lease violations: 7-day notice with opportunity to cure',
          'Month-to-month: 15 days written notice',
          'Week-to-week: 7 days written notice',
          'Some violations may not be curable'
        ],
        applicableTo: ['landlord', 'tenant', 'agent']
      },
      {
        section: '83.67',
        title: 'Prohibited Practices',
        summary: 'Landlords cannot engage in self-help evictions. Cannot interrupt utilities or change locks.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0000-0099/0083/Sections/0083.67.html',
        keyPoints: [
          'Cannot interrupt utilities',
          'Cannot change locks without consent',
          'Cannot remove doors or windows',
          'Violation allows tenant to recover 3 months rent',
          'Must use legal eviction process'
        ],
        applicableTo: ['landlord']
      }
    ]
  },
  {
    chapter: 718,
    title: 'Condominiums',
    description: 'Comprehensive condominium law covering creation, operation, and disclosure requirements.',
    url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0718/0718ContentsIndex.html',
    sections: [
      {
        section: '718.503',
        title: 'Disclosure Prior to Sale',
        summary: 'Seller must provide declaration, bylaws, rules, financial statements, and FAQ sheet.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0700-0799/0718/Sections/0718.503.html',
        keyPoints: [
          'Must provide declaration of condominium',
          'Must provide bylaws and rules',
          'Must provide recent financial statements',
          'Must provide FAQ sheet',
          'Buyer may cancel within 3 days of receiving documents'
        ],
        applicableTo: ['buyer', 'seller', 'agent']
      },
      {
        section: '718.116',
        title: 'Assessments; Liability; Lien',
        summary: 'Unit owners liable for assessments. Association has lien for unpaid assessments.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0700-0799/0718/Sections/0718.116.html',
        keyPoints: [
          'Owner liable from time of acquiring title',
          'Association has lien for unpaid assessments',
          'New owner may be liable for 12 months of previous unpaid assessments',
          'Foreclosure purchaser liability limited'
        ],
        applicableTo: ['buyer', 'seller', 'investor']
      }
    ]
  },
  {
    chapter: 720,
    title: 'Homeowners\' Associations',
    description: 'Governs HOA disclosure, governance, and owner rights.',
    url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0720/0720ContentsIndex.html',
    sections: [
      {
        section: '720.401',
        title: 'Disclosure Summary',
        summary: 'Seller must provide disclosure summary stating HOA existence and assessment obligations.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0700-0799/0720/Sections/0720.401.html',
        keyPoints: [
          'Must disclose HOA membership is mandatory',
          'Must disclose assessment amounts and frequency',
          'Must note existence of restrictive covenants',
          'Buyer may cancel within 3 days of receiving disclosure'
        ],
        applicableTo: ['buyer', 'seller', 'agent']
      },
      {
        section: '720.306',
        title: 'Meetings of Members; Voting',
        summary: 'Members have right to attend meetings and vote on association matters.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0700-0799/0720/Sections/0720.306.html',
        keyPoints: [
          'Annual members meeting required',
          'Notice required 14 days before meeting',
          'Members have right to speak on agenda items',
          'Proxy and electronic voting allowed'
        ],
        applicableTo: ['buyer', 'investor']
      }
    ]
  },
  {
    chapter: 689,
    title: 'Conveyances and Disclosures',
    description: 'Real property transfers and disclosure requirements.',
    url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0689/0689ContentsIndex.html',
    sections: [
      {
        section: '689.25',
        title: 'Disclosure of Material Facts',
        summary: 'Sellers must disclose known material facts affecting property value that are not readily observable.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699/0689/Sections/0689.25.html',
        keyPoints: [
          'Must disclose known latent defects',
          'Material facts affecting value must be disclosed',
          'Florida follows caveat emptor with exceptions',
          'Agent must also disclose known material facts'
        ],
        applicableTo: ['buyer', 'seller', 'agent']
      },
      {
        section: '689.261',
        title: 'Radon Gas Disclosure',
        summary: 'All real property contracts and leases must include radon disclosure statement.',
        url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699/0689/Sections/0689.261.html',
        keyPoints: [
          'Required in all real estate contracts',
          'Required in all rental agreements',
          'Specific statutory language required',
          'Testing recommended before purchase'
        ],
        applicableTo: ['buyer', 'seller', 'landlord', 'tenant', 'agent']
      }
    ]
  }
]

// Quick lookup functions
export function getChapterByNumber(chapterNum: number): StatuteChapter | undefined {
  return FLORIDA_REAL_ESTATE_LAW.find(c => c.chapter === chapterNum)
}

export function getSectionByNumber(chapterNum: number, sectionNum: string): StatuteSection | undefined {
  const chapter = getChapterByNumber(chapterNum)
  return chapter?.sections.find(s => s.section === sectionNum)
}

export function searchStatutes(query: string): StatuteSection[] {
  const lowerQuery = query.toLowerCase()
  const results: StatuteSection[] = []
  
  FLORIDA_REAL_ESTATE_LAW.forEach(chapter => {
    chapter.sections.forEach(section => {
      if (
        section.title.toLowerCase().includes(lowerQuery) ||
        section.summary.toLowerCase().includes(lowerQuery) ||
        section.keyPoints.some(kp => kp.toLowerCase().includes(lowerQuery))
      ) {
        results.push(section)
      }
    })
  })
  
  return results
}

export function getStatutesForRole(role: StatuteSection['applicableTo'][number]): StatuteSection[] {
  const results: StatuteSection[] = []
  
  FLORIDA_REAL_ESTATE_LAW.forEach(chapter => {
    chapter.sections.forEach(section => {
      if (section.applicableTo.includes(role)) {
        results.push(section)
      }
    })
  })
  
  return results
}

// Disclosure checklists
export interface DisclosureItem {
  id: string
  text: string
  required: boolean
  statute?: string
  description: string
}

export const SELLER_DISCLOSURES: DisclosureItem[] = [
  { id: 'material-defects', text: 'Known material defects', required: true, statute: '689.25', description: 'Latent defects affecting value' },
  { id: 'lead-paint', text: 'Lead-based paint (pre-1978)', required: true, statute: 'Federal', description: 'Required for homes built before 1978' },
  { id: 'radon', text: 'Radon gas disclosure', required: true, statute: '689.261', description: 'Florida required disclosure' },
  { id: 'flood-zone', text: 'Flood zone status', required: true, description: 'FEMA flood zone designation' },
  { id: 'sinkholes', text: 'Sinkhole history', required: true, statute: '627.7073', description: 'Prior claims or repairs' },
  { id: 'hoa', text: 'HOA/COA membership', required: true, statute: '720.401', description: 'Mandatory membership and assessments' },
  { id: 'chinese-drywall', text: 'Chinese drywall', required: true, statute: '558.442', description: 'Presence or prior presence' },
  { id: 'coastal-erosion', text: 'Coastal erosion', required: true, statute: '161.57', description: 'CBRS zones or erosion issues' }
]

export const LANDLORD_DISCLOSURES: DisclosureItem[] = [
  { id: 'radon', text: 'Radon gas disclosure', required: true, statute: '689.261', description: 'Required in all leases' },
  { id: 'lead-paint', text: 'Lead-based paint (pre-1978)', required: true, statute: 'Federal', description: 'Required for pre-1978 buildings' },
  { id: 'security-deposit', text: 'Security deposit location', required: true, statute: '83.49', description: 'Must notify within 30 days' },
  { id: 'landlord-identity', text: 'Landlord name and address', required: true, statute: '83.50', description: 'For service of notices' }
]

// Florida RE glossary
export const FLORIDA_RE_GLOSSARY: Record<string, string> = {
  'SFHA': 'Special Flood Hazard Area - High-risk flood zone requiring flood insurance',
  'CBRS': 'Coastal Barrier Resources System - No federal flood insurance available',
  'HOA': 'Homeowners Association - Mandatory membership organization',
  'COA': 'Condominium Owners Association - Condo governing body',
  'Estoppel Letter': 'Document confirming HOA/COA account status',
  'Wind Mitigation': 'Report documenting hurricane-resistant features',
  '4-Point Inspection': 'Roof, electrical, plumbing, HVAC inspection',
  'Documentary Stamps': 'Florida transfer tax ($0.70 per $100)',
  'Homestead Exemption': 'Property tax exemption for primary residence (up to $50,000)'
}
