'use client'

import { useState } from 'react'
import {
  Users, Plus, Search, Filter, MoreVertical, Phone, Mail,
  Calendar, DollarSign, Home, Clock, Star, Tag, ChevronDown,
  User, Edit2, Trash2, ArrowRight, MessageSquare, FileText,
  TrendingUp, AlertCircle, CheckCircle, XCircle
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  stage: string
  type: 'buyer' | 'seller' | 'both'
  budget?: number
  timeline?: string
  source: string
  score: 'A' | 'B' | 'C' | 'D' | 'F'
  lastContact: string
  nextFollowUp?: string
  notes?: string
  propertyInterest?: string
  avatar?: string
  tags: string[]
}

const STAGES = [
  { id: 'new', name: 'New Leads', color: 'bg-blue-500', icon: Users },
  { id: 'contacted', name: 'Contacted', color: 'bg-purple-500', icon: Phone },
  { id: 'qualified', name: 'Qualified', color: 'bg-amber-500', icon: CheckCircle },
  { id: 'showing', name: 'Showing', color: 'bg-cyan-500', icon: Home },
  { id: 'negotiating', name: 'Negotiating', color: 'bg-orange-500', icon: DollarSign },
  { id: 'closed', name: 'Closed', color: 'bg-green-500', icon: Star },
]

const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '(239) 555-0101',
    stage: 'qualified',
    type: 'buyer',
    budget: 450000,
    timeline: '1-3 months',
    source: 'Zillow',
    score: 'A',
    lastContact: '2024-12-12',
    nextFollowUp: '2024-12-15',
    propertyInterest: 'Cape Coral waterfront',
    tags: ['Pre-approved', 'Hot lead', 'First-time buyer']
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@email.com',
    phone: '(239) 555-0102',
    stage: 'showing',
    type: 'buyer',
    budget: 350000,
    timeline: '3-6 months',
    source: 'Facebook',
    score: 'B',
    lastContact: '2024-12-10',
    nextFollowUp: '2024-12-14',
    propertyInterest: 'Fort Myers single family',
    tags: ['Investor', 'Cash buyer']
  },
  {
    id: '3',
    name: 'Jennifer Lopez',
    email: 'jen@email.com',
    phone: '(239) 555-0103',
    stage: 'new',
    type: 'seller',
    source: 'Referral',
    score: 'A',
    lastContact: '2024-12-13',
    propertyInterest: '1420 SE 47th St',
    tags: ['Motivated seller', 'Relocating']
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@email.com',
    phone: '(239) 555-0104',
    stage: 'contacted',
    type: 'buyer',
    budget: 600000,
    timeline: '6+ months',
    source: 'Website',
    score: 'C',
    lastContact: '2024-12-08',
    tags: ['Vacation home']
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa@email.com',
    phone: '(239) 555-0105',
    stage: 'negotiating',
    type: 'buyer',
    budget: 425000,
    timeline: 'ASAP',
    source: 'Open House',
    score: 'A',
    lastContact: '2024-12-13',
    nextFollowUp: '2024-12-14',
    propertyInterest: '2850 Winkler Ave',
    tags: ['Pre-approved', 'Offer pending']
  },
  {
    id: '6',
    name: 'Robert Brown',
    email: 'rob@email.com',
    phone: '(239) 555-0106',
    stage: 'closed',
    type: 'buyer',
    budget: 389000,
    source: 'Zillow',
    score: 'A',
    lastContact: '2024-12-01',
    propertyInterest: 'Closed on Cape Coral',
    tags: ['Repeat client', 'Referral source']
  }
]

export default function ClientPipelinePage() {
  const [clients, setClients] = useState<Client[]>(SAMPLE_CLIENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'buyer' | 'seller'>('all')
  const [draggedClient, setDraggedClient] = useState<Client | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || c.type === filterType || c.type === 'both'
    return matchesSearch && matchesType
  })

  const getClientsByStage = (stageId: string) => 
    filteredClients.filter(c => c.stage === stageId)

  const handleDragStart = (client: Client) => {
    setDraggedClient(client)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (stageId: string) => {
    if (draggedClient) {
      setClients(clients.map(c => 
        c.id === draggedClient.id ? { ...c, stage: stageId } : c
      ))
      setDraggedClient(null)
    }
  }

  const getScoreBadge = (score: Client['score']) => {
    const colors = {
      A: 'bg-green-100 text-green-800 border-green-300',
      B: 'bg-blue-100 text-blue-800 border-blue-300',
      C: 'bg-amber-100 text-amber-800 border-amber-300',
      D: 'bg-orange-100 text-orange-800 border-orange-300',
      F: 'bg-red-100 text-red-800 border-red-300',
    }
    return (
      <span className={`px-1.5 py-0.5 rounded text-xs font-bold border ${colors[score]}`}>
        {score}
      </span>
    )
  }

  const getTypeBadge = (type: Client['type']) => {
    const styles = {
      buyer: 'bg-blue-50 text-blue-700',
      seller: 'bg-green-50 text-green-700',
      both: 'bg-purple-50 text-purple-700',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const totalValue = clients
    .filter(c => c.stage !== 'closed' && c.budget)
    .reduce((sum, c) => sum + (c.budget || 0), 0)

  const hotLeads = clients.filter(c => c.score === 'A' && c.stage !== 'closed').length

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-blue-600" /> Client Pipeline
          </h1>
          <p className="text-gray-600 mt-1">Manage your leads from first contact to closing</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hot Leads (A)</p>
              <p className="text-2xl font-bold">{hotLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pipeline Value</p>
              <p className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Today</p>
              <p className="text-2xl font-bold">
                {clients.filter(c => c.nextFollowUp === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'buyer', 'seller'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-lg ${
                filterType === type ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div
            key={stage.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
            className="flex-shrink-0 w-80 bg-gray-100 rounded-xl"
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold">{stage.name}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-600">
                    {getClientsByStage(stage.id).length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[400px]">
              {getClientsByStage(stage.id).map(client => (
                <div
                  key={client.id}
                  draggable
                  onDragStart={() => handleDragStart(client)}
                  onClick={() => setSelectedClient(client)}
                  className="bg-white rounded-lg p-3 border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.source}</p>
                      </div>
                    </div>
                    {getScoreBadge(client.score)}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(client.type)}
                    {client.budget && (
                      <span className="text-xs text-gray-500">
                        ${(client.budget / 1000).toFixed(0)}K
                      </span>
                    )}
                  </div>

                  {client.propertyInterest && (
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <Home size={12} />
                      {client.propertyInterest.length > 25 
                        ? client.propertyInterest.substring(0, 25) + '...'
                        : client.propertyInterest}
                    </p>
                  )}

                  {client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {client.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(client.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Phone size={14} />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Mail size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeBadge(selectedClient.type)}
                    {getScoreBadge(selectedClient.score)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:underline">
                    {selectedClient.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${selectedClient.phone}`} className="text-blue-600 hover:underline">
                    {selectedClient.phone}
                  </a>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {selectedClient.budget && (
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold">${selectedClient.budget.toLocaleString()}</p>
                  </div>
                )}
                {selectedClient.timeline && (
                  <div>
                    <p className="text-xs text-gray-500">Timeline</p>
                    <p className="font-semibold">{selectedClient.timeline}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="font-semibold">{selectedClient.source}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Contact</p>
                  <p className="font-semibold">{new Date(selectedClient.lastContact).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedClient.propertyInterest && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-1">Property Interest</p>
                  <p className="font-medium">{selectedClient.propertyInterest}</p>
                </div>
              )}

              {selectedClient.tags.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Phone size={16} /> Call
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Mail size={16} /> Email
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Calendar size={16} /> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
