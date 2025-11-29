'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Loader2,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ShowingRequest {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  property_address: string
  requested_date: string
  requested_time: string
  status: string
  customer_notes?: string
  agent_notes?: string
  created_at: string
}

export default function AgentShowingsPage() {
  const supabase = createClient()
  const [showings, setShowings] = useState<ShowingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null)
  const [updating, setUpdating] = useState(false)
  const [agentNotes, setAgentNotes] = useState('')

  useEffect(() => { loadShowings() }, [])

  async function loadShowings() {
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .order('requested_date', { ascending: true })

      if (error) throw error
      setShowings((data || []) as ShowingRequest[])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ status, agent_notes: agentNotes, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (!error) {
        setShowings(prev => prev.map(s => s.id === id ? { ...s, status, agent_notes: agentNotes } : s))
        if (selectedShowing?.id === id) {
          setSelectedShowing(prev => prev ? { ...prev, status, agent_notes: agentNotes } : null)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUpdating(false)
    }
  }

  const filtered = showings.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter
    const matchSearch = !searchTerm || 
      s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.property_address?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    all: showings.length,
    pending: showings.filter(s => s.status === 'pending').length,
    confirmed: showings.filter(s => s.status === 'confirmed').length,
    completed: showings.filter(s => s.status === 'completed').length,
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const statusColor = (s: string) => {
    if (s === 'pending') return 'bg-amber-100 text-amber-700'
    if (s === 'confirmed') return 'bg-emerald-100 text-emerald-700'
    if (s === 'completed') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Showing Requests</h1>
          <p className="text-gray-500">Manage customer showing requests</p>
        </div>
        <button onClick={loadShowings} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(['all', 'pending', 'confirmed', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`p-4 rounded-xl border text-left ${filter === f ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
            <p className="text-2xl font-bold">{counts[f]}</p>
            <p className="text-sm text-gray-500 capitalize">{f}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-3 border rounded-xl" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filtered.length > 0 ? filtered.map(s => (
            <div key={s.id} onClick={() => { setSelectedShowing(s); setAgentNotes(s.agent_notes || '') }} className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md ${selectedShowing?.id === s.id ? 'border-blue-500' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(s.status)}`}>{s.status}</span>
                {s.status === 'pending' && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs animate-pulse">Action Required</span>}
              </div>
              <h3 className="font-semibold text-gray-900">{s.property_address}</h3>
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(s.requested_date)}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{s.requested_time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{s.customer_name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{s.customer_email}</span>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No showing requests found</p>
            </div>
          )}
        </div>

        <div>
          {selectedShowing ? (
            <div className="bg-white rounded-xl border p-6 sticky top-6">
              <h2 className="font-semibold mb-4">Showing Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Property</p>
                  <p className="font-medium">{selectedShowing.property_address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Date & Time</p>
                  <p className="font-medium">{formatDate(selectedShowing.requested_date)} at {selectedShowing.requested_time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Customer</p>
                  <p className="font-medium">{selectedShowing.customer_name}</p>
                  <a href={`mailto:${selectedShowing.customer_email}`} className="text-sm text-blue-600 flex items-center gap-1"><Mail className="w-3 h-3" />{selectedShowing.customer_email}</a>
                  {selectedShowing.customer_phone && <a href={`tel:${selectedShowing.customer_phone}`} className="text-sm text-blue-600 flex items-center gap-1"><Phone className="w-3 h-3" />{selectedShowing.customer_phone}</a>}
                </div>
                {selectedShowing.customer_notes && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Customer Notes</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedShowing.customer_notes}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Your Notes</p>
                  <textarea value={agentNotes} onChange={(e) => setAgentNotes(e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Add notes..." />
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedShowing.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(selectedShowing.id, 'confirmed')} disabled={updating} className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm">
                          <CheckCircle className="w-4 h-4" />Confirm
                        </button>
                        <button onClick={() => updateStatus(selectedShowing.id, 'cancelled')} disabled={updating} className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm">
                          <XCircle className="w-4 h-4" />Cancel
                        </button>
                      </>
                    )}
                    {selectedShowing.status === 'confirmed' && (
                      <>
                        <button onClick={() => updateStatus(selectedShowing.id, 'completed')} disabled={updating} className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
                          <CheckCircle className="w-4 h-4" />Complete
                        </button>
                        <button onClick={() => updateStatus(selectedShowing.id, 'no_show')} disabled={updating} className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm">
                          <AlertCircle className="w-4 h-4" />No Show
                        </button>
                      </>
                    )}
                  </div>
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
