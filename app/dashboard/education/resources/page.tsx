'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Download, FileText, CheckSquare, ClipboardList, Home, DollarSign,
  Truck, Key, Search, Shield, Users, Calendar, ChevronLeft,
  Printer, Share2, BookOpen, Star
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: 'checklist' | 'template' | 'guide' | 'worksheet'
  icon: any
  popular?: boolean
  content?: string[]
}

const RESOURCES: Resource[] = [
  // Buyer Checklists
  {
    id: 'buyer-checklist',
    title: 'Complete Homebuyer Checklist',
    description: 'Everything you need to do from pre-approval to closing',
    category: 'Buying',
    type: 'checklist',
    icon: Home,
    popular: true,
    content: [
      '☐ Check your credit score and reports',
      '☐ Calculate your budget (28/36 rule)',
      '☐ Save for down payment and closing costs',
      '☐ Get pre-approved for a mortgage',
      '☐ Research neighborhoods',
      '☐ Find a real estate agent',
      '☐ Create your needs vs wants list',
      '☐ Start viewing homes',
      '☐ Make an offer',
      '☐ Schedule home inspection',
      '☐ Review inspection report',
      '☐ Negotiate repairs or credits',
      '☐ Complete appraisal',
      '☐ Finalize mortgage',
      '☐ Get homeowners insurance',
      '☐ Review title report',
      '☐ Do final walkthrough',
      '☐ Attend closing',
      '☐ Get your keys!',
    ]
  },
  {
    id: 'pre-approval-docs',
    title: 'Pre-Approval Document Checklist',
    description: 'All documents needed for mortgage pre-approval',
    category: 'Financing',
    type: 'checklist',
    icon: FileText,
    popular: true,
    content: [
      '☐ Last 2 years of W-2s',
      '☐ Last 30 days of pay stubs',
      '☐ Last 2 years of tax returns (all pages)',
      '☐ Last 2 months of bank statements',
      '☐ Investment/retirement account statements',
      '☐ Driver\'s license or passport',
      '☐ Social Security card',
      '☐ Rental history (12 months)',
      '☐ Gift letter (if applicable)',
      '☐ Divorce decree (if applicable)',
      '☐ Bankruptcy papers (if applicable)',
      '☐ Business returns (if self-employed)',
      '☐ Profit & loss statement (if self-employed)',
    ]
  },
  {
    id: 'inspection-checklist',
    title: 'Home Inspection Checklist',
    description: 'What to look for during a home inspection',
    category: 'Buying',
    type: 'checklist',
    icon: Search,
    content: [
      '**EXTERIOR**',
      '☐ Roof condition (shingles, flashing, gutters)',
      '☐ Foundation (cracks, settling)',
      '☐ Siding and trim condition',
      '☐ Windows and doors',
      '☐ Drainage away from house',
      '☐ Driveway and walkways',
      '☐ Fence and gates',
      '',
      '**INTERIOR**',
      '☐ Walls, ceilings, floors',
      '☐ Windows open/close properly',
      '☐ Doors open/close properly',
      '☐ Stairs and railings secure',
      '☐ Attic (insulation, ventilation)',
      '☐ Basement/crawl space',
      '',
      '**SYSTEMS**',
      '☐ HVAC age and condition',
      '☐ Water heater age and condition',
      '☐ Electrical panel condition',
      '☐ Plumbing (water pressure, leaks)',
      '☐ Smoke/CO detectors',
      '',
      '**KITCHEN & BATHROOMS**',
      '☐ Appliances working',
      '☐ Cabinets and counters',
      '☐ Faucets and fixtures',
      '☐ Toilets flush properly',
      '☐ Signs of water damage',
    ]
  },
  {
    id: 'final-walkthrough',
    title: 'Final Walkthrough Checklist',
    description: 'What to verify before closing',
    category: 'Buying',
    type: 'checklist',
    icon: Key,
    popular: true,
    content: [
      '☐ All agreed repairs completed',
      '☐ All items included in sale present',
      '☐ No new damage since inspection',
      '☐ All utilities working',
      '☐ All light fixtures work',
      '☐ All appliances work',
      '☐ Garage door opener(s) work',
      '☐ All keys and remotes present',
      '☐ Seller\'s belongings removed',
      '☐ House is broom-clean',
      '☐ No unexpected items left behind',
      '☐ HVAC working properly',
      '☐ Water heater working',
      '☐ Toilets and faucets work',
      '☐ Windows and doors lock properly',
    ]
  },
  // Seller Checklists
  {
    id: 'seller-checklist',
    title: 'Complete Home Seller Checklist',
    description: 'Prepare your home for a successful sale',
    category: 'Selling',
    type: 'checklist',
    icon: DollarSign,
    content: [
      '**BEFORE LISTING**',
      '☐ Research comparable sales',
      '☐ Interview real estate agents',
      '☐ Sign listing agreement',
      '☐ Get pre-listing inspection (optional)',
      '☐ Make necessary repairs',
      '☐ Declutter and depersonalize',
      '☐ Deep clean entire home',
      '☐ Stage home for showings',
      '☐ Professional photos taken',
      '',
      '**WHILE LISTED**',
      '☐ Keep home show-ready',
      '☐ Accommodate showings',
      '☐ Review and respond to offers',
      '☐ Negotiate terms',
      '☐ Accept offer',
      '',
      '**UNDER CONTRACT**',
      '☐ Complete disclosure forms',
      '☐ Cooperate with inspection',
      '☐ Negotiate repairs',
      '☐ Cooperate with appraisal',
      '☐ Start packing',
      '☐ Schedule moving company',
      '☐ Cancel/transfer utilities',
      '☐ Final walkthrough with buyer',
      '☐ Attend closing',
    ]
  },
  {
    id: 'staging-checklist',
    title: 'Home Staging Checklist',
    description: 'Make your home irresistible to buyers',
    category: 'Selling',
    type: 'checklist',
    icon: Home,
    content: [
      '**DECLUTTER**',
      '☐ Remove 50% of items from closets',
      '☐ Clear off countertops',
      '☐ Remove excess furniture',
      '☐ Pack away personal photos',
      '☐ Organize garage',
      '☐ Clear out basement/attic',
      '',
      '**DEEP CLEAN**',
      '☐ Wash all windows (inside and out)',
      '☐ Steam clean carpets',
      '☐ Clean all light fixtures',
      '☐ Scrub grout lines',
      '☐ Clean appliances inside and out',
      '☐ Pressure wash exterior',
      '',
      '**CURB APPEAL**',
      '☐ Mow and edge lawn',
      '☐ Trim bushes and trees',
      '☐ Add fresh mulch',
      '☐ Plant flowers',
      '☐ Paint front door',
      '☐ Clean/replace welcome mat',
      '☐ Update house numbers',
      '',
      '**FINISHING TOUCHES**',
      '☐ Fresh paint (neutral colors)',
      '☐ Update cabinet hardware',
      '☐ Replace outdated light fixtures',
      '☐ Add fresh towels in bathrooms',
      '☐ Fresh flowers on counter',
      '☐ Scented candles (subtle)',
    ]
  },
  // Moving Checklists
  {
    id: 'moving-checklist',
    title: '4-Week Moving Checklist',
    description: 'Stay organized during your move',
    category: 'Moving',
    type: 'checklist',
    icon: Truck,
    popular: true,
    content: [
      '**4 WEEKS BEFORE**',
      '☐ Research moving companies',
      '☐ Get moving quotes',
      '☐ Book moving company',
      '☐ Start decluttering',
      '☐ Begin packing non-essentials',
      '☐ Notify school (if applicable)',
      '',
      '**2-3 WEEKS BEFORE**',
      '☐ Change address with USPS',
      '☐ Notify banks and credit cards',
      '☐ Update subscriptions',
      '☐ Transfer medical records',
      '☐ Arrange pet travel',
      '☐ Pack room by room',
      '☐ Label all boxes',
      '',
      '**1 WEEK BEFORE**',
      '☐ Confirm moving company',
      '☐ Pack suitcases for moving day',
      '☐ Prepare important documents',
      '☐ Clean out refrigerator',
      '☐ Defrost freezer',
      '☐ Disassemble large furniture',
      '',
      '**DAY BEFORE**',
      '☐ Pack overnight bag',
      '☐ Charge all devices',
      '☐ Withdraw cash for tips',
      '☐ Confirm new home is ready',
      '',
      '**MOVING DAY**',
      '☐ Meet movers',
      '☐ Do final walkthrough',
      '☐ Turn off utilities',
      '☐ Lock up and leave keys',
      '☐ Head to new home!',
    ]
  },
  // Worksheets
  {
    id: 'needs-wants',
    title: 'Needs vs. Wants Worksheet',
    description: 'Prioritize what matters most in your new home',
    category: 'Buying',
    type: 'worksheet',
    icon: ClipboardList,
    content: [
      '**MUST-HAVES (Non-Negotiable)**',
      '☐ Minimum bedrooms: ___',
      '☐ Minimum bathrooms: ___',
      '☐ Minimum square feet: ___',
      '☐ Location/school district: ___',
      '☐ Maximum commute time: ___',
      '☐ Maximum budget: ___',
      '☐ Other: ___',
      '',
      '**NICE-TO-HAVES (Flexible)**',
      '☐ Pool',
      '☐ Garage (spaces: ___)',
      '☐ Updated kitchen',
      '☐ Updated bathrooms',
      '☐ Home office',
      '☐ Large yard',
      '☐ Single story',
      '☐ HOA/No HOA',
      '☐ Other: ___',
      '',
      '**DEAL BREAKERS (Will Not Accept)**',
      '☐ ___',
      '☐ ___',
      '☐ ___',
    ]
  },
  {
    id: 'budget-worksheet',
    title: 'Homebuying Budget Worksheet',
    description: 'Calculate what you can really afford',
    category: 'Financing',
    type: 'worksheet',
    icon: DollarSign,
    content: [
      '**INCOME**',
      'Gross Monthly Income #1: $___',
      'Gross Monthly Income #2: $___',
      'Other Income: $___',
      'TOTAL MONTHLY INCOME: $___',
      '',
      '**CURRENT DEBTS (Monthly)**',
      'Car Payment: $___',
      'Student Loans: $___',
      'Credit Cards (min): $___',
      'Other Loans: $___',
      'TOTAL MONTHLY DEBTS: $___',
      '',
      '**HOUSING BUDGET**',
      'Max Housing (28% of income): $___',
      'Max Total Debt (36% of income): $___',
      'Available for Housing: $___',
      '',
      '**SAVINGS**',
      'Down Payment Saved: $___',
      'Closing Costs (3-5%): $___',
      'Emergency Fund (3-6 mo): $___',
      'Moving Costs: $___',
      '',
      '**ESTIMATED PURCHASE PRICE: $___**',
    ]
  },
  {
    id: 'closing-checklist',
    title: 'Closing Day Checklist',
    description: 'Be prepared for closing day',
    category: 'Buying',
    type: 'checklist',
    icon: Key,
    content: [
      '**BRING TO CLOSING**',
      '☐ Government-issued photo ID',
      '☐ Cashier\'s check or wire confirmation',
      '☐ Proof of insurance',
      '☐ Copy of purchase agreement',
      '☐ Your real estate agent\'s contact',
      '',
      '**DOCUMENTS TO REVIEW**',
      '☐ Closing Disclosure (compare to Loan Estimate)',
      '☐ Promissory Note',
      '☐ Deed of Trust/Mortgage',
      '☐ Title Insurance Policy',
      '☐ Property Survey',
      '☐ HOA Documents (if applicable)',
      '',
      '**VERIFY**',
      '☐ Name spelled correctly on all docs',
      '☐ Property address correct',
      '☐ Loan amount correct',
      '☐ Interest rate correct',
      '☐ Closing costs match estimate',
      '☐ Proration of taxes correct',
      '',
      '**AFTER CLOSING**',
      '☐ Make copies of all documents',
      '☐ Store originals in safe place',
      '☐ Set up automatic payments',
      '☐ Change locks',
      '☐ Update voter registration',
      '☐ Update vehicle registration',
    ]
  },
]

export default function ResourcesPage() {
  const [category, setCategory] = useState('All')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const categories = ['All', 'Buying', 'Selling', 'Financing', 'Moving']
  
  const filteredResources = RESOURCES.filter(r => 
    category === 'All' || r.category === category
  )

  const handlePrint = (resource: Resource) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${resource.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #1e40af; }
              p { color: #666; }
              .content { margin-top: 20px; white-space: pre-line; }
            </style>
          </head>
          <body>
            <h1>${resource.title}</h1>
            <p>${resource.description}</p>
            <div class="content">${resource.content?.join('\n') || ''}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link href="/dashboard/education" className="text-blue-600 hover:underline flex items-center gap-1 mb-4">
        <ChevronLeft size={18} /> Back to Education Center
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Download className="text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Checklists & Templates</h1>
          <p className="text-gray-600">Free downloadable resources to keep you organized</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg ${
              category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resource List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredResources.map(resource => (
            <button
              key={resource.id}
              onClick={() => setSelectedResource(resource)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedResource?.id === resource.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <resource.icon size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{resource.title}</h3>
                    {resource.popular && <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{resource.description}</p>
                  <span className="text-xs text-blue-600 mt-1 inline-block">{resource.category}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Resource Preview */}
        <div className="lg:col-span-2">
          {selectedResource ? (
            <div className="bg-white rounded-xl border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedResource.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedResource.description}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {selectedResource.category}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                        {selectedResource.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrint(selectedResource)}
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      <Printer size={18} /> Print
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 max-h-[500px] overflow-y-auto">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {selectedResource.content?.map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h3 key={i} className="font-bold text-blue-800 mt-4 mb-2 first:mt-0">
                          {line.replace(/\*\*/g, '')}
                        </h3>
                      )
                    }
                    if (line === '') {
                      return <div key={i} className="h-4" />
                    }
                    if (line.startsWith('☐')) {
                      return (
                        <label key={i} className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          <span>{line.substring(2)}</span>
                        </label>
                      )
                    }
                    return <p key={i} className="py-1">{line}</p>
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
              <FileText className="mx-auto mb-3" size={48} />
              <p>Select a resource to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
