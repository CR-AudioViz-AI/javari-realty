'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Phone, Mail, Calendar, MoreVertical, Plus, Search, Filter, ArrowRight, Eye, Edit, Trash2 } from 'lucide-react'

const PIPELINE_STAGES = [
  { id: 'new', title: 'New Leads', color: 'bg-gray-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-yellow-500' },
  { id: 'showing', title: 'Showing', color: 'bg-purple-500' },
  { id: 'offer', title: 'Offer Made', color: 'bg-orange-500' },
  { id: 'closed', title: 'Closed', color: 'bg-green-500' }
]

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  budget: string
  area: string
  source: string
  stage: string
  notes?: string
  createdAt: string
}

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Michael Johnson', email: 'michael@email.com', phone: '(239) 555-0123', budget: '$500K-$750K', area: 'Naples', source: 'Website', stage: 'new', createdAt: '2 hours ago' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@email.com', phone: '(239) 555-0456', budget: '$400K-$600K', area: 'Cape Coral', source: 'Referral', stage: 'new', createdAt: '5 hours ago' },
  { id: '3', name: 'David Brown', email: 'david@email.com', phone: '(239) 555-0789', budget: 'Under $400K', area: 'Fort Myers', source: 'Zillow', stage: 'contacted', createdAt: '1 day ago' },
  { id: '4', name: 'Jennifer Davis', email: 'jennifer@email.com', phone: '(239) 555-0321', budget: '$600K-$900K', area: 'Bonita Springs', source: 'Open House', stage: 'qualified', createdAt: '2 days ago' },
  { id: '5', name: 'Robert Martinez', email: 'robert@email.com', phone: '(239) 555-0654', budget: '$450K-$550K', area: 'Cape Coral', source: 'Website', stage: 'showing', createdAt: '3 days ago' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@email.com', phone: '(239) 555-0987', budget: '$700K-$850K', area: 'Naples', source: 'Referral', stage: 'offer', createdAt: '5 days ago' },
  { id: '7', name: 'James Wilson', email: 'james@email.com', phone: '(239) 555-0147', budget: '$525,000', area: 'Fort Myers', source: 'Website', stage: 'closed', createdAt: '1 week ago' },
  { id: '8', name: 'Amanda Taylor', email: 'amanda@email.com', phone: '(239) 555-0258', budget: '$350K-$450K', area: 'Lehigh Acres', source: 'Facebook', stage: 'new', createdAt: '3 hours ago' }
]

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null)

  const moveLead = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ))
    setShowMoveMenu(null)
  }

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => {
      const matchesStage = lead.stage === stageId
      const matchesSearch = searchQuery === '' || 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.area.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStage && matchesSearch
    })
  }

  const totalLeads = leads.length
  const totalValue = leads.reduce((sum, lead) => {
    const match = lead.budget.match(/\$?([\d,]+)/g)
    if (match) {
      const value = parseInt(match[0].replace(/[$,]/g, ''))
      return sum + value
    }
    return sum
  }, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Client Pipeline</h1>
            <p className="text-gray-500">{totalLeads} total clients • Est. value: ${(totalValue / 1000).toFixed(0)}K+</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link
              href="/dashboard/leads/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Client
            </Link>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id)
            return (
              <div key={stage.id} className="w-80 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-semibold">{stage.title}</h3>
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                      {stageLeads.length}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 min-h-96 p-2 rounded-lg bg-gray-50">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{lead.name}</h4>
                        <div className="relative">
                          <button 
                            onClick={() => setShowMoveMenu(showMoveMenu === lead.id ? null : lead.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          {showMoveMenu === lead.id && (
                            <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 w-48">
                              <div className="p-2 border-b">
                                <span className="text-xs text-gray-500 font-medium">Move to:</span>
                              </div>
                              {PIPELINE_STAGES.filter(s => s.id !== lead.stage).map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => moveLead(lead.id, s.id)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                                  {s.title}
                                </button>
                              ))}
                              <div className="border-t">
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {lead.area}
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          {lead.budget}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-400">{lead.source}</span>
                        <span className="text-xs text-gray-400">{lead.createdAt}</span>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No clients in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-8">
            {PIPELINE_STAGES.map(stage => {
              const count = getLeadsByStage(stage.id).length
              return (
                <div key={stage.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-sm text-gray-600">{stage.title}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/leads" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Leads →
            </Link>
            <Link href="/dashboard/reports" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Pipeline Report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
