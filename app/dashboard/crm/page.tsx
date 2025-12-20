'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Phone, Mail, Calendar, MoreVertical, Plus, Search, Filter, ArrowRight, Eye, Edit, Trash2 } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  budget: string
  area: string
  source: string
  notes?: string
}

interface PipelineStage {
  id: string
  title: string
  color: string
  leads: Lead[]
}

const INITIAL_PIPELINE: PipelineStage[] = [
  { 
    id: 'new', 
    title: 'New Leads', 
    color: 'bg-gray-500',
    leads: [
      { id: '1', name: 'Michael Johnson', email: 'michael@email.com', phone: '(239) 555-0123', budget: '$500K-$750K', area: 'Naples', source: 'Website' },
      { id: '2', name: 'Sarah Williams', email: 'sarah@email.com', phone: '(239) 555-0456', budget: '$400K-$600K', area: 'Cape Coral', source: 'Referral' }
    ]
  },
  { 
    id: 'contacted', 
    title: 'Contacted', 
    color: 'bg-blue-500',
    leads: [
      { id: '3', name: 'David Brown', email: 'david@email.com', phone: '(239) 555-0789', budget: 'Under $400K', area: 'Fort Myers', source: 'Zillow' }
    ]
  },
  { 
    id: 'qualified', 
    title: 'Qualified', 
    color: 'bg-yellow-500',
    leads: [
      { id: '4', name: 'Jennifer Davis', email: 'jennifer@email.com', phone: '(239) 555-0321', budget: '$600K-$900K', area: 'Bonita Springs', source: 'Open House' }
    ]
  },
  { 
    id: 'showing', 
    title: 'Showing', 
    color: 'bg-purple-500',
    leads: [
      { id: '5', name: 'Robert Martinez', email: 'robert@email.com', phone: '(239) 555-0654', budget: '$450K-$550K', area: 'Cape Coral', source: 'Website' }
    ]
  },
  { 
    id: 'offer', 
    title: 'Offer Made', 
    color: 'bg-orange-500',
    leads: [
      { id: '6', name: 'Lisa Anderson', email: 'lisa@email.com', phone: '(239) 555-0987', budget: '$700K-$850K', area: 'Naples', source: 'Referral' }
    ]
  },
  { 
    id: 'closed', 
    title: 'Closed Won', 
    color: 'bg-green-500',
    leads: [
      { id: '7', name: 'James Wilson', email: 'james@email.com', phone: '(239) 555-0147', budget: '$525,000', area: 'Fort Myers', source: 'Website' }
    ]
  }
]

export default function CRMPage() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>(INITIAL_PIPELINE)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [draggedLead, setDraggedLead] = useState<{lead: Lead, fromStage: string} | null>(null)

  const moveLead = (leadId: string, fromStageId: string, toStageId: string) => {
    if (fromStageId === toStageId) return
    
    setPipeline(prev => {
      const newPipeline = prev.map(stage => ({...stage, leads: [...stage.leads]}))
      const fromStage = newPipeline.find(s => s.id === fromStageId)
      const toStage = newPipeline.find(s => s.id === toStageId)
      
      if (!fromStage || !toStage) return prev
      
      const leadIndex = fromStage.leads.findIndex(l => l.id === leadId)
      if (leadIndex === -1) return prev
      
      const [lead] = fromStage.leads.splice(leadIndex, 1)
      toStage.leads.push(lead)
      
      return newPipeline
    })
  }

  const handleDragStart = (lead: Lead, stageId: string) => {
    setDraggedLead({lead, fromStage: stageId})
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, toStageId: string) => {
    e.preventDefault()
    if (draggedLead) {
      moveLead(draggedLead.lead.id, draggedLead.fromStage, toStageId)
      setDraggedLead(null)
    }
  }

  const totalLeads = pipeline.reduce((sum, stage) => sum + stage.leads.length, 0)
  const pipelineValue = pipeline
    .filter(s => s.id !== 'closed')
    .reduce((sum, stage) => sum + stage.leads.length * 15000, 0) // Avg commission estimate

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Client Pipeline</h1>
            <p className="text-gray-500">
              {totalLeads} total clients • Est. pipeline value: ${pipelineValue.toLocaleString()}
            </p>
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
          {pipeline.map((stage) => (
            <div 
              key={stage.id} 
              className="w-80 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold">{stage.title}</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                    {stage.leads.length}
                  </span>
                </div>
              </div>
              
              {/* Cards Container */}
              <div className={`space-y-3 min-h-96 p-2 rounded-lg bg-gray-50 ${draggedLead ? 'border-2 border-dashed border-blue-300' : ''}`}>
                {stage.leads
                  .filter(lead => 
                    !searchQuery || 
                    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.area.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead, stage.id)}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{lead.name}</h4>
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{lead.email}</span>
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
                    <div className="mt-2 text-xs text-gray-400">
                      Source: {lead.source}
                    </div>
                    
                    {/* Quick Actions */}
                    {stage.id !== 'closed' && (
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-400">Move to:</span>
                        <div className="flex gap-1">
                          {pipeline
                            .filter(s => s.id !== stage.id)
                            .slice(0, 3)
                            .map(s => (
                              <button
                                key={s.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveLead(lead.id, stage.id, s.id)
                                }}
                                className={`w-2 h-2 rounded-full ${s.color} hover:ring-2 ring-offset-1`}
                                title={s.title}
                              />
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {stage.leads.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No clients in this stage</p>
                    <p className="text-xs">Drag clients here or add new</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedLead.name}</h2>
                <p className="text-gray-500">{selectedLead.area} • {selectedLead.budget}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">
                  {selectedLead.email}
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">
                  {selectedLead.phone}
                </a>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Source</div>
                <div className="font-medium">{selectedLead.source}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Showing
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
