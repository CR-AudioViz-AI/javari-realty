'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Phone, Mail, Calendar, MoreVertical, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'

const PIPELINE_STAGES = [
  { id: 'new', title: 'New Leads', color: 'bg-gray-500', count: 2 },
  { id: 'contacted', title: 'Contacted', color: 'bg-blue-500', count: 1 },
  { id: 'qualified', title: 'Qualified', color: 'bg-yellow-500', count: 1 },
  { id: 'showing', title: 'Showing', color: 'bg-purple-500', count: 1 },
  { id: 'offer', title: 'Offer Made', color: 'bg-orange-500', count: 1 },
  { id: 'closed', title: 'Closed', color: 'bg-green-500', count: 1 }
]

const ALL_LEADS = [
  { id: '1', name: 'Michael Johnson', email: 'michael@email.com', phone: '(239) 555-0123', budget: '$500K-$750K', area: 'Naples', source: 'Website', stage: 'new', created: '2 hours ago' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@email.com', phone: '(239) 555-0456', budget: '$400K-$600K', area: 'Cape Coral', source: 'Referral', stage: 'new', created: '5 hours ago' },
  { id: '3', name: 'David Brown', email: 'david@email.com', phone: '(239) 555-0789', budget: 'Under $400K', area: 'Fort Myers', source: 'Zillow', stage: 'contacted', created: '1 day ago' },
  { id: '4', name: 'Jennifer Davis', email: 'jennifer@email.com', phone: '(239) 555-0321', budget: '$600K-$900K', area: 'Bonita Springs', source: 'Open House', stage: 'qualified', created: '2 days ago' },
  { id: '5', name: 'Robert Martinez', email: 'robert@email.com', phone: '(239) 555-0654', budget: '$450K-$550K', area: 'Cape Coral', source: 'Website', stage: 'showing', created: '3 days ago' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@email.com', phone: '(239) 555-0987', budget: '$700K-$850K', area: 'Naples', source: 'Referral', stage: 'offer', created: '5 days ago' },
  { id: '7', name: 'James Wilson', email: 'james@email.com', phone: '(239) 555-0147', budget: '$525,000', area: 'Fort Myers', source: 'Website', stage: 'closed', created: '1 week ago' }
]

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [leads, setLeads] = useState(ALL_LEADS)

  const filteredLeads = leads.filter(lead => {
    if (selectedStage && lead.stage !== selectedStage) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return lead.name.toLowerCase().includes(query) || 
             lead.email.toLowerCase().includes(query) ||
             lead.area.toLowerCase().includes(query)
    }
    return true
  })

  const moveToStage = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ))
  }

  const getStageColor = (stage: string) => {
    return PIPELINE_STAGES.find(s => s.id === stage)?.color || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Client Pipeline</h1>
            <p className="text-gray-500">{leads.length} total clients across all stages</p>
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

      {/* Pipeline Stages Overview */}
      <div className="p-6">
        <div className="grid grid-cols-6 gap-4 mb-6">
          {PIPELINE_STAGES.map((stage) => {
            const stageCount = leads.filter(l => l.stage === stage.id).length
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedStage === stage.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="font-medium text-sm">{stage.title}</span>
                </div>
                <div className="text-2xl font-bold">{stageCount}</div>
              </button>
            )
          })}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Area</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stage</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{lead.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.source} • {lead.created}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      {lead.budget}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {lead.area}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.stage}
                      onChange={(e) => moveToStage(lead.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm text-white cursor-pointer ${getStageColor(lead.stage)}`}
                    >
                      {PIPELINE_STAGES.map(stage => (
                        <option key={stage.id} value={stage.id} className="text-gray-900">
                          {stage.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Schedule">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
