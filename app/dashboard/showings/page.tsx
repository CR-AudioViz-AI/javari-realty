'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ShowingRequest {
  id: string
  customer_id?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  property_id?: string
  property_address: string
  requested_date: string
  requested_time: string
  confirmed_date?: string
  confirmed_time?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  customer_notes?: string
  agent_notes?: string
  created_at: string
  properties?: {
    address: string
    city: string
    price: number
  }
  customers?: {
    full_name: string
    email: string
    phone: string
  }
}

export default function AgentShowingsPage() {
  const supabase = createClient()
  const [showings, setShowings] = useState<ShowingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null)
  const [updating, setUpdating] = useState(false)
  const [agentNotes, setAgentNotes] = useState('')

  useEffect(() => {
    loadShowings()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('showing_requests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'showing_requests'
      }, () => {
        loadShowings()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadShowings() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('showing_requests')
        .select(`
          *,
          properties (address, city, price),
          customers (full_name, email, phone)
        `)
        .order('requested_date', { ascending: true })

      if (error) throw error
      setShowings(data || [])
    } catch (error) {
      console.error('Error loading showings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateShowingStatus(id: string, status: string, notes?: string) {
    setUpdating(true)
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      }
      
      if (notes) {
        updateData.agent_notes = notes
      }
      
      if (status === 'confirmed') {
        // Set confirmed date/time to requested date/time
        const showing = showings.find(s => s.id === id)
        if (showing) {
          updateData.confirmed_date = showing.requested_date
          updateData.confirmed_time = showing.requested_time
        }
      }

      const { error } = await supabase
        .from('showing_requests')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      // Update local state
      setShowings(prev => prev.map(s => 
        s.id === id ? { ...s, ...updateData } : s
      ))
      
      if (selectedShowing?.id === id) {
        setSelectedShowing(prev => prev ? { ...prev, ...updateData } : null)
      }
    } catch (error) {
      console.error('Error updating showing:', error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredShowings = showings.filter(showing => {
    const matchesFilter = filter === 'all' || showing.status === filter
    const matchesSearch = !searchTerm || 
      showing.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showing.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showing.property_address?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusCounts = {
    all: showings.length,
    pending: showings.filter(s => s.status === 'pending').length,
    confirmed: showings.filter(s => s.status === 'confirmed').length,
    completed: showings.filter(s => s.status === 'completed').length,
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'confirmed': return 'bg-emerald-100 text-emerald-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-gray-100 text-gray-700'
      case 'no_show': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Showing Requests</h1>
          <p className="text-gray-500">Manage customer showing requests</p>
        </div>
        <button
          onClick={loadShowings}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'All Requests', count: statusCounts.all, filter: 'all' as const, color: 'bg-gray-500' },
          { label: 'Pending', count: statusCounts.pending, filter: 'pending' as const, color: 'bg-amber-500' },
          { label: 'Confirmed', count: statusCounts.confirmed, filter: 'confirmed' as const, color: 'bg-emerald-500' },
          { label: 'Completed', count: statusCounts.completed, filter: 'completed' as const, color: 'bg-blue-500' },
        ].map(stat => (
          <button
            key={stat.filter}
            onClick={() => setFilter(stat.filter)}
            className={`p-4 rounded-xl border text-left transition ${
              filter === stat.filter ? 'border-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`}></div>
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, email, or property..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Showings List */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredShowings.length > 0 ? (
            filteredShowings.map(showing => (
              <div
                key={showing.id}
                onClick={() => {
                  setSelectedShowing(showing)
                  setAgentNotes(showing.agent_notes || '')
                }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition hover:shadow-md ${
                  selectedShowing?.id === showing.id ? 'border-blue-500 ring-2 ring-blue-100' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(showing.status)}`}>
                      {showing.status.charAt(0).toUpperCase() + showing.status.slice(1)}
                    </span>
                    {showing.status === 'pending' && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium animate-pulse">
                        Action Required
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(showing.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {showing.property_address || showing.properties?.address}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(showing.requested_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {showing.requested_time}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{showing.customer_name || showing.customers?.full_name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{showing.customer_email || showing.customers?.email}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-2">No Showing Requests</h3>
              <p className="text-gray-500">
                {filter !== 'all' ? `No ${filter} showings found.` : 'No showing requests yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedShowing ? (
            <div className="bg-white rounded-xl border p-6 sticky top-6">
              <h2 className="font-semibold text-gray-900 mb-4">Showing Details</h2>
              
              {/* Property */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Property</label>
                <p className="font-medium text-gray-900">{selectedShowing.property_address}</p>
                {selectedShowing.properties?.price && (
                  <p className="text-sm text-gray-500">
                    ${selectedShowing.properties.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Date/Time */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Requested Date & Time</label>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedShowing.requested_date)} at {selectedShowing.requested_time}
                </p>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Customer</label>
                <p className="font-medium text-gray-900">{selectedShowing.customer_name}</p>
                <a href={`mailto:${selectedShowing.customer_email}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {selectedShowing.customer_email}
                </a>
                {selectedShowing.customer_phone && (
                  <a href={`tel:${selectedShowing.customer_phone}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedShowing.customer_phone}
                  </a>
                )}
              </div>

              {/* Customer Notes */}
              {selectedShowing.customer_notes && (
                <div className="mb-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Customer Notes</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{selectedShowing.customer_notes}</p>
                </div>
              )}

              {/* Agent Notes */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Your Notes</label>
                <textarea
                  value={agentNotes}
                  onChange={(e) => setAgentNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this showing..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => updateShowingStatus(selectedShowing.id, selectedShowing.status, agentNotes)}
                  disabled={updating}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Save Notes
                </button>
              </div>

              {/* Status Actions */}
              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedShowing.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateShowingStatus(selectedShowing.id, 'confirmed', agentNotes)}
                        disabled={updating}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateShowingStatus(selectedShowing.id, 'cancelled', agentNotes)}
                        disabled={updating}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                  {selectedShowing.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => updateShowingStatus(selectedShowing.id, 'completed', agentNotes)}
                        disabled={updating}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </button>
                      <button
                        onClick={() => updateShowingStatus(selectedShowing.id, 'no_show', agentNotes)}
                        disabled={updating}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        No Show
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-6 text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Select a showing to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
