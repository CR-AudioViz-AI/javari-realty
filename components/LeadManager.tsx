'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Users, Plus, Search, Filter, Phone, Mail,
  Calendar, Star, Clock, ChevronRight, Edit2,
  Trash2, MessageSquare, Home, DollarSign,
  TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'showing' | 'offer' | 'closed' | 'lost'
  source: 'website' | 'referral' | 'zillow' | 'realtor' | 'social' | 'other'
  type: 'buyer' | 'seller' | 'both'
  budget?: { min: number; max: number }
  preferredAreas?: string[]
  notes: string
  createdAt: string
  lastContactedAt?: string
  nextFollowUp?: string
  score: number
  propertyInterests?: string[]
}

interface LeadManagerProps {
  onLeadSelect?: (lead: Lead) => void
  onLeadUpdate?: (lead: Lead) => void
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  contacted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  qualified: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  showing: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  offer: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  closed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  lost: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'showing', 'offer', 'closed']

export default function LeadManager({ onLeadSelect, onLeadUpdate }: LeadManagerProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Load leads
  useEffect(() => {
    const saved = localStorage.getItem('zoyzyLeads')
    if (saved) {
      setLeads(JSON.parse(saved))
    } else {
      // Demo leads
      const demoLeads: Lead[] = [
        { id: '1', name: 'John Smith', email: 'john@email.com', phone: '(555) 123-4567', status: 'qualified', source: 'website', type: 'buyer', budget: { min: 400000, max: 550000 }, notes: 'Looking for 3BR in Cape Coral', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), score: 85 },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 234-5678', status: 'showing', source: 'referral', type: 'buyer', budget: { min: 600000, max: 800000 }, notes: 'Wants waterfront property', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), score: 92 },
        { id: '3', name: 'Mike Williams', email: 'mike@email.com', phone: '(555) 345-6789', status: 'new', source: 'zillow', type: 'seller', notes: 'Inherited property, motivated', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 78 },
        { id: '4', name: 'Emily Davis', email: 'emily@email.com', phone: '(555) 456-7890', status: 'offer', source: 'website', type: 'buyer', budget: { min: 350000, max: 450000 }, notes: 'First-time buyer, pre-approved', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), score: 95 },
        { id: '5', name: 'Robert Brown', email: 'robert@email.com', phone: '(555) 567-8901', status: 'contacted', source: 'social', type: 'both', notes: 'Relocating from NY', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 72 },
      ]
      setLeads(demoLeads)
    }
  }, [])

  // Save leads
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('zoyzyLeads', JSON.stringify(leads))
    }
  }, [leads])

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !searchQuery || 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery)
      const matchesStatus = !filterStatus || lead.status === filterStatus
      const matchesType = !filterType || lead.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [leads, searchQuery, filterStatus, filterType])

  // Pipeline view leads grouped by status
  const pipelineLeads = useMemo(() => {
    return PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage] = filteredLeads.filter(l => l.status === stage)
      return acc
    }, {} as Record<string, Lead[]>)
  }, [filteredLeads])

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    active: leads.filter(l => ['contacted', 'qualified', 'showing', 'offer'].includes(l.status)).length,
    closed: leads.filter(l => l.status === 'closed').length,
    avgScore: leads.length > 0 ? leads.reduce((sum, l) => sum + l.score, 0) / leads.length : 0
  }

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(l => 
      l.id === leadId ? { ...l, status: newStatus } : l
    ))
  }

  const deleteLead = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setLeads(prev => prev.filter(l => l.id !== leadId))
      if (selectedLead?.id === leadId) setSelectedLead(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <div>
              <h2 className="font-semibold text-lg">Lead Manager</h2>
              <p className="text-white/80 text-sm">{stats.total} leads • {stats.active} active</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{stats.new}</p>
          <p className="text-xs text-gray-500">New</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.active}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
          <p className="text-xs text-gray-500">Closed</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>{stats.avgScore.toFixed(0)}</p>
          <p className="text-xs text-gray-500">Avg Score</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            />
          </div>
          
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="showing">Showing</option>
            <option value="offer">Offer</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
          
          <select
            value={filterType || ''}
            onChange={(e) => setFilterType(e.target.value || null)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="both">Both</option>
          </select>

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'pipeline' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
            >
              Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'list' ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                onClick={() => { setSelectedLead(lead); onLeadSelect?.(lead) }}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{lead.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-500">{formatDate(lead.createdAt)}</p>
                  {lead.budget && (
                    <p className="text-gray-700 dark:text-gray-300">
                      ${(lead.budget.min / 1000).toFixed(0)}K-${(lead.budget.max / 1000).toFixed(0)}K
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No leads found
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map(stage => (
              <div key={stage} className="flex-shrink-0 w-64">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize text-gray-900 dark:text-white">{stage}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {pipelineLeads[stage]?.length || 0}
                  </span>
                </div>
                <div className="space-y-2 min-h-[200px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                  {pipelineLeads[stage]?.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); onLeadSelect?.(lead) }}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{lead.name}</p>
                        <span className={`text-xs font-bold ${getScoreColor(lead.score)}`}>{lead.score}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{lead.notes}</p>
                      {lead.budget && (
                        <p className="text-xs text-indigo-600 mt-1">
                          ${(lead.budget.min / 1000).toFixed(0)}K-${(lead.budget.max / 1000).toFixed(0)}K
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50" onClick={() => setSelectedLead(null)}>
          <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedLead.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[selectedLead.status]}`}>
                    {selectedLead.status}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(selectedLead.score)}`}>
                  {selectedLead.score}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <a href={`tel:${selectedLead.phone}`} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-center flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a href={`mailto:${selectedLead.email}`} className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-center flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-900 dark:text-white">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-900 dark:text-white">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-gray-900 dark:text-white capitalize">{selectedLead.type}</p>
                  </div>
                  {selectedLead.budget && (
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-gray-900 dark:text-white">
                        ${selectedLead.budget.min.toLocaleString()} - ${selectedLead.budget.max.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{selectedLead.notes}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(STATUS_COLORS).map(status => (
                      <button
                        key={status}
                        onClick={() => updateLeadStatus(selectedLead.id, status as Lead['status'])}
                        className={`px-3 py-1 rounded text-xs capitalize ${
                          selectedLead.status === status 
                            ? STATUS_COLORS[status]
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => deleteLead(selectedLead.id)}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
