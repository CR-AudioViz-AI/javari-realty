// app/customer/dashboard/checklists/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, CheckCircle, Circle, ChevronDown, ChevronUp, Home, DollarSign, FileText, Search, Key, Truck, Shield, AlertTriangle, Clock, Sparkles, Download, Share2, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface ChecklistItem { id: string; text: string; description?: string; required: boolean; floridaSpecific?: boolean; tips?: string[] }
interface ChecklistSection { id: string; title: string; icon: any; color: string; items: ChecklistItem[] }
interface Checklist { id: string; title: string; description: string; type: string; sections: ChecklistSection[] }

const BUYER_CHECKLIST: Checklist = {
  id: 'buyer', title: 'Homebuyer Checklist', description: 'Step-by-step guide from pre-approval to closing', type: 'buyer',
  sections: [
    { id: 'pre-approval', title: 'Pre-Approval & Planning', icon: DollarSign, color: 'green', items: [
      { id: 'b1', text: 'Check credit score (aim for 620+ conventional, 580+ FHA)', required: true, tips: ['Free reports at annualcreditreport.com'] },
      { id: 'b2', text: 'Calculate budget (28% front-end, 36% back-end DTI)', required: true },
      { id: 'b3', text: 'Save for down payment (3.5% FHA, 5% conventional, 20% no PMI)', required: true },
      { id: 'b4', text: 'Gather income docs (2yr W-2s, 2mo paystubs, tax returns)', required: true },
      { id: 'b5', text: 'Get pre-approval letter from lender', required: true },
      { id: 'b6', text: 'Research FL first-time buyer programs (FL Housing, SHIP)', required: false, floridaSpecific: true }
    ]},
    { id: 'house-hunting', title: 'House Hunting', icon: Search, color: 'blue', items: [
      { id: 'b7', text: 'Define must-haves vs nice-to-haves', required: true },
      { id: 'b8', text: 'Research neighborhoods (schools, crime, flood zones)', required: true },
      { id: 'b9', text: 'Find a real estate agent', required: false },
      { id: 'b10', text: 'Check FEMA flood maps for each property', required: true, floridaSpecific: true },
      { id: 'b11', text: 'Verify HOA/COA rules and fees', required: true, floridaSpecific: true }
    ]},
    { id: 'offer', title: 'Making an Offer', icon: FileText, color: 'purple', items: [
      { id: 'b12', text: 'Research comparable sales', required: true },
      { id: 'b13', text: 'Submit offer using FAR/BAR contract', required: true, floridaSpecific: true },
      { id: 'b14', text: 'Include earnest money deposit (1-3%)', required: true },
      { id: 'b15', text: 'Negotiate terms', required: true },
      { id: 'b16', text: 'Deliver EMD within 3 days of effective date', required: true, floridaSpecific: true }
    ]},
    { id: 'due-diligence', title: 'Due Diligence', icon: Shield, color: 'orange', items: [
      { id: 'b17', text: 'Schedule home inspection', required: true },
      { id: 'b18', text: 'Wind mitigation inspection', required: false, floridaSpecific: true },
      { id: 'b19', text: '4-point inspection (older homes)', required: false, floridaSpecific: true },
      { id: 'b20', text: 'WDO/termite inspection', required: true, floridaSpecific: true },
      { id: 'b21', text: 'Request HOA/COA documents', required: true, floridaSpecific: true },
      { id: 'b22', text: 'Review seller disclosures', required: true },
      { id: 'b23', text: 'Order appraisal', required: true },
      { id: 'b24', text: 'Title search and insurance', required: true }
    ]},
    { id: 'closing', title: 'Closing', icon: Key, color: 'teal', items: [
      { id: 'b25', text: 'Secure homeowners insurance', required: true },
      { id: 'b26', text: 'Secure flood insurance if required', required: true, floridaSpecific: true },
      { id: 'b27', text: 'Final loan approval (clear to close)', required: true },
      { id: 'b28', text: 'Review Closing Disclosure (3 days before)', required: true },
      { id: 'b29', text: 'Wire closing funds (verify by phone!)', required: true },
      { id: 'b30', text: 'Final walkthrough', required: true },
      { id: 'b31', text: 'Bring valid ID to closing', required: true }
    ]},
    { id: 'post-closing', title: 'After Closing', icon: Home, color: 'indigo', items: [
      { id: 'b32', text: 'File Homestead Exemption by March 1', required: true, floridaSpecific: true, tips: ['Up to $50,000 property tax exemption'] },
      { id: 'b33', text: 'Change locks', required: false },
      { id: 'b34', text: 'Set up utilities', required: true },
      { id: 'b35', text: 'Update address (USPS, DMV, voter)', required: true }
    ]}
  ]
}

const SELLER_CHECKLIST: Checklist = {
  id: 'seller', title: 'Home Seller Checklist', description: 'Prepare and sell for top dollar', type: 'seller',
  sections: [
    { id: 'prep', title: 'Pre-Listing Preparation', icon: Home, color: 'blue', items: [
      { id: 's1', text: 'Get CMA from agent', required: true },
      { id: 's2', text: 'Declutter and depersonalize', required: true },
      { id: 's3', text: 'Deep clean entire home', required: true },
      { id: 's4', text: 'Make necessary repairs', required: true },
      { id: 's5', text: 'Enhance curb appeal', required: true, floridaSpecific: true }
    ]},
    { id: 'disclosures', title: 'Florida Disclosures', icon: FileText, color: 'orange', items: [
      { id: 's6', text: 'Seller Property Disclosure', required: true, floridaSpecific: true },
      { id: 's7', text: 'Radon gas disclosure', required: true, floridaSpecific: true },
      { id: 's8', text: 'Lead paint disclosure (pre-1978)', required: true },
      { id: 's9', text: 'HOA/COA disclosure summary', required: true, floridaSpecific: true },
      { id: 's10', text: 'Flood zone disclosure', required: true, floridaSpecific: true },
      { id: 's11', text: 'Sinkhole/insurance claim disclosure', required: true, floridaSpecific: true }
    ]},
    { id: 'listing', title: 'Listing & Marketing', icon: Sparkles, color: 'purple', items: [
      { id: 's12', text: 'Professional photography', required: true },
      { id: 's13', text: 'List on MLS', required: true },
      { id: 's14', text: 'Install lockbox and sign', required: true },
      { id: 's15', text: 'Schedule open houses', required: false }
    ]},
    { id: 'closing', title: 'Offer to Closing', icon: DollarSign, color: 'green', items: [
      { id: 's16', text: 'Review and negotiate offers', required: true },
      { id: 's17', text: 'Sign FAR/BAR contract', required: true, floridaSpecific: true },
      { id: 's18', text: 'Provide access for inspections', required: true },
      { id: 's19', text: 'Negotiate repairs/credits', required: false },
      { id: 's20', text: 'Order lender payoff statement', required: true },
      { id: 's21', text: 'Review settlement statement', required: true },
      { id: 's22', text: 'Move out before closing', required: true },
      { id: 's23', text: 'Attend closing', required: true }
    ]}
  ]
}

const INSPECTION_CHECKLIST: Checklist = {
  id: 'inspection', title: 'Home Inspection Checklist', description: 'What to look for during inspection', type: 'inspection',
  sections: [
    { id: 'exterior', title: 'Exterior & Roof', icon: Home, color: 'gray', items: [
      { id: 'i1', text: 'Roof condition and age', required: true, floridaSpecific: true, tips: ['FL roofs last 15-25 years'] },
      { id: 'i2', text: 'Gutters and downspouts', required: true },
      { id: 'i3', text: 'Siding/stucco condition', required: true },
      { id: 'i4', text: 'Impact windows/hurricane shutters', required: true, floridaSpecific: true },
      { id: 'i5', text: 'Foundation/slab', required: true },
      { id: 'i6', text: 'Pool/spa condition', required: false, floridaSpecific: true }
    ]},
    { id: 'interior', title: 'Interior Systems', icon: Shield, color: 'blue', items: [
      { id: 'i7', text: 'HVAC system age/condition', required: true, tips: ['FL AC lifespan 10-15 years'] },
      { id: 'i8', text: 'Electrical panel and wiring', required: true, tips: ['Aluminum wiring = fire risk'] },
      { id: 'i9', text: 'Plumbing supply/drain lines', required: true, tips: ['Polybutylene pipes = problem'] },
      { id: 'i10', text: 'Water heater age', required: true },
      { id: 'i11', text: 'Attic insulation', required: true }
    ]},
    { id: 'florida', title: 'Florida-Specific', icon: AlertTriangle, color: 'orange', items: [
      { id: 'i12', text: 'WDO/termite inspection', required: true, floridaSpecific: true },
      { id: 'i13', text: 'Mold inspection', required: false, floridaSpecific: true },
      { id: 'i14', text: 'Hurricane straps/clips', required: true, floridaSpecific: true },
      { id: 'i15', text: 'Wind mitigation features', required: false, floridaSpecific: true },
      { id: 'i16', text: 'Seawall condition (waterfront)', required: false, floridaSpecific: true }
    ]}
  ]
}

const CHECKLISTS = [BUYER_CHECKLIST, SELLER_CHECKLIST, INSPECTION_CHECKLIST]

export default function ChecklistsPage() {
  const [activeChecklist, setActiveChecklist] = useState('buyer')
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})
  const [expandedSections, setExpandedSections] = useState<string[]>(['pre-approval'])

  const currentChecklist = CHECKLISTS.find(c => c.id === activeChecklist) || BUYER_CHECKLIST

  useEffect(() => {
    const saved = localStorage.getItem(`checklist-${activeChecklist}`)
    if (saved) setCompletedItems(JSON.parse(saved))
    else setCompletedItems({})
  }, [activeChecklist])

  useEffect(() => {
    localStorage.setItem(`checklist-${activeChecklist}`, JSON.stringify(completedItems))
  }, [completedItems, activeChecklist])

  const toggleItem = (id: string) => setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleSection = (id: string) => setExpandedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const getProgress = () => {
    const all = currentChecklist.sections.flatMap(s => s.items)
    const done = all.filter(i => completedItems[i.id]).length
    return { done, total: all.length, pct: Math.round((done / all.length) * 100) }
  }

  const getSectionProgress = (section: ChecklistSection) => {
    const done = section.items.filter(i => completedItems[i.id]).length
    return { done, total: section.items.length }
  }

  const resetChecklist = () => { setCompletedItems({}); localStorage.removeItem(`checklist-${activeChecklist}`) }
  const progress = getProgress()

  const colorMap: Record<string, string> = { green: 'bg-green-500', blue: 'bg-blue-500', purple: 'bg-purple-500', orange: 'bg-orange-500', teal: 'bg-teal-500', indigo: 'bg-indigo-500', gray: 'bg-gray-500' }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/dashboard" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl"><ClipboardList className="w-8 h-8 text-white" /></div>
              Interactive Checklists
            </h1>
            <p className="text-gray-600 mt-1">Track your progress step-by-step</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {CHECKLISTS.map(c => (
            <button key={c.id} onClick={() => setActiveChecklist(c.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeChecklist === c.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
              {c.title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentChecklist.title}</h2>
              <p className="text-gray-600 text-sm">{currentChecklist.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{progress.pct}%</div>
              <div className="text-sm text-gray-500">{progress.done}/{progress.total} complete</div>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress.pct}%` }} />
          </div>
          <button onClick={resetChecklist} className="mt-4 text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> Reset Progress
          </button>
        </div>

        <div className="space-y-4">
          {currentChecklist.sections.map(section => {
            const sp = getSectionProgress(section)
            const isExpanded = expandedSections.includes(section.id)
            const Icon = section.icon
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <button onClick={() => toggleSection(section.id)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorMap[section.color]} bg-opacity-20`}>
                      <Icon className={`w-5 h-5 text-${section.color}-600`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">{sp.done}/{sp.total} completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${colorMap[section.color]}`} style={{ width: `${(sp.done / sp.total) * 100}%` }} />
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {section.items.map(item => (
                      <div key={item.id} onClick={() => toggleItem(item.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all flex items-start gap-3 ${completedItems[item.id] ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}`}>
                        {completedItems[item.id] ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={completedItems[item.id] ? 'text-green-800 line-through' : 'text-gray-800'}>{item.text}</span>
                            {item.required && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">Required</span>}
                            {item.floridaSpecific && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">FL</span>}
                          </div>
                          {item.tips && item.tips.length > 0 && (
                            <div className="mt-1 text-xs text-gray-500">{item.tips[0]}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
