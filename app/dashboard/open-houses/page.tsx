'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2,
  Share2, QrCode, Mail, MessageSquare, CheckCircle, XCircle,
  Home, User, Phone, FileText, Download, Eye, TrendingUp,
  AlertCircle, Bell, ChevronRight, ExternalLink, Copy
} from 'lucide-react'

interface OpenHouse {
  id: string
  property_id: string
  property_address: string
  property_image?: string
  date: string
  start_time: string
  end_time: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  attendees: Attendee[]
  notes?: string
  created_at: string
}

interface Attendee {
  id: string
  name: string
  email: string
  phone?: string
  checked_in: boolean
  check_in_time?: string
  interest_level: 'hot' | 'warm' | 'cold' | 'unknown'
  notes?: string
  source: string
}

export default function OpenHouseManagementPage() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([])
  const [selectedEvent, setSelectedEvent] = useState<OpenHouse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [signInData, setSignInData] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  // Sample data
  useEffect(() => {
    const sampleData: OpenHouse[] = [
      {
        id: '1',
        property_id: 'prop-1',
        property_address: '2850 Winkler Ave, Fort Myers, FL 33916',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        start_time: '14:00',
        end_time: '17:00',
        status: 'upcoming',
        attendees: [
          { id: 'a1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '239-555-0101', checked_in: false, interest_level: 'unknown', source: 'Zillow' },
          { id: 'a2', name: 'Mike Chen', email: 'mike@email.com', phone: '239-555-0102', checked_in: false, interest_level: 'unknown', source: 'Facebook' },
        ],
        notes: 'First open house for this listing',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        property_id: 'prop-2',
        property_address: '1420 SE 47th St, Cape Coral, FL 33904',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], // 3 days ago
        start_time: '13:00',
        end_time: '16:00',
        status: 'completed',
        attendees: [
          { id: 'a3', name: 'Jennifer Lopez', email: 'jen@email.com', phone: '239-555-0103', checked_in: true, check_in_time: '13:15', interest_level: 'hot', source: 'Sign', notes: 'Very interested, pre-approved' },
          { id: 'a4', name: 'David Kim', email: 'david@email.com', checked_in: true, check_in_time: '14:30', interest_level: 'warm', source: 'Online' },
          { id: 'a5', name: 'Lisa Wang', email: 'lisa@email.com', phone: '239-555-0105', checked_in: true, check_in_time: '15:00', interest_level: 'cold', source: 'Neighbor' },
        ],
        created_at: new Date().toISOString()
      }
    ]
    setOpenHouses(sampleData)
    setLoading(false)
  }, [])

  const upcomingEvents = openHouses.filter(oh => oh.status === 'upcoming' || oh.status === 'active')
  const pastEvents = openHouses.filter(oh => oh.status === 'completed' || oh.status === 'cancelled')

  const getStatusBadge = (status: OpenHouse['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  const getInterestBadge = (level: Attendee['interest_level']) => {
    const styles = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-amber-100 text-amber-800',
      cold: 'bg-blue-100 text-blue-800',
      unknown: 'bg-gray-100 text-gray-800'
    }
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[level]}`}>{level}</span>
  }

  const generateSignInQR = (eventId: string) => {
    const signInUrl = `https://realtor.craudiovizai.com/sign-in/${eventId}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(signInUrl)}`
  }

  const copySignInLink = (eventId: string) => {
    const url = `https://realtor.craudiovizai.com/sign-in/${eventId}`
    navigator.clipboard.writeText(url)
    alert('Sign-in link copied to clipboard!')
  }

  const handleCheckIn = (attendeeId: string) => {
    if (!selectedEvent) return
    setOpenHouses(prev => prev.map(oh => {
      if (oh.id === selectedEvent.id) {
        return {
          ...oh,
          attendees: oh.attendees.map(a => 
            a.id === attendeeId 
              ? { ...a, checked_in: true, check_in_time: new Date().toLocaleTimeString() }
              : a
          )
        }
      }
      return oh
    }))
  }

  const handleAddWalkIn = () => {
    if (!selectedEvent || !signInData.name || !signInData.email) return
    
    const newAttendee: Attendee = {
      id: `walk-${Date.now()}`,
      name: signInData.name,
      email: signInData.email,
      phone: signInData.phone,
      checked_in: true,
      check_in_time: new Date().toLocaleTimeString(),
      interest_level: 'unknown',
      source: 'Walk-in'
    }

    setOpenHouses(prev => prev.map(oh => {
      if (oh.id === selectedEvent.id) {
        return { ...oh, attendees: [...oh.attendees, newAttendee] }
      }
      return oh
    }))

    setSignInData({ name: '', email: '', phone: '' })
    setShowSignInModal(false)
  }

  const totalAttendees = openHouses.reduce((sum, oh) => sum + oh.attendees.length, 0)
  const hotLeads = openHouses.flatMap(oh => oh.attendees).filter(a => a.interest_level === 'hot').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-blue-600" /> Open House Manager
          </h1>
          <p className="text-gray-600 mt-1">Schedule, manage, and track your open houses</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Schedule Open House
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Visitors</p>
              <p className="text-2xl font-bold">{totalAttendees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hot Leads</p>
              <p className="text-2xl font-bold">{hotLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{pastEvents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
          }`}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'past' ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
          }`}
        >
          Past ({pastEvents.length})
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="lg:col-span-1 space-y-4">
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedEvent?.id === event.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Home className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600 truncate max-w-[180px]">
                    {event.property_address.split(',')[0]}
                  </span>
                </div>
                {getStatusBadge(event.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {event.start_time}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {event.attendees.length}
                </span>
              </div>
            </div>
          ))}

          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-600">No {activeTab} open houses</p>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="lg:col-span-2">
          {selectedEvent ? (
            <div className="bg-white rounded-xl border">
              {/* Event Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedEvent.property_address}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {selectedEvent.start_time} - {selectedEvent.end_time}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(selectedEvent.status)}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.status === 'upcoming' && (
                    <button
                      onClick={() => setShowSignInModal(true)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Walk-in
                    </button>
                  )}
                  <button
                    onClick={() => copySignInLink(selectedEvent.id)}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2"
                  >
                    <Copy size={16} /> Copy Sign-in Link
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2">
                    <Mail size={16} /> Email All
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2">
                    <Download size={16} /> Export
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center gap-6">
                  <img 
                    src={generateSignInQR(selectedEvent.id)} 
                    alt="Sign-in QR Code"
                    className="w-24 h-24 rounded-lg border bg-white"
                  />
                  <div>
                    <h3 className="font-semibold mb-1">Digital Sign-In</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Display this QR code at your open house for contactless sign-in
                    </p>
                    <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                      Download printable sign <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendees */}
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users size={18} />
                  Attendees ({selectedEvent.attendees.length})
                </h3>

                {selectedEvent.attendees.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEvent.attendees.map(attendee => (
                      <div key={attendee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            attendee.checked_in ? 'bg-green-100' : 'bg-gray-200'
                          }`}>
                            {attendee.checked_in ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : (
                              <User className="text-gray-400" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{attendee.email}</span>
                              {attendee.phone && <span>• {attendee.phone}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {getInterestBadge(attendee.interest_level)}
                              <span className="text-xs text-gray-400">via {attendee.source}</span>
                              {attendee.check_in_time && (
                                <span className="text-xs text-gray-400">• Checked in {attendee.check_in_time}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!attendee.checked_in && selectedEvent.status !== 'completed' && (
                            <button
                              onClick={() => handleCheckIn(attendee.id)}
                              className="text-green-600 hover:bg-green-50 p-2 rounded"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                            <Mail size={18} />
                          </button>
                          <button className="text-purple-600 hover:bg-purple-50 p-2 rounded">
                            <MessageSquare size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-gray-600">No attendees yet</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select an Open House</h3>
              <p className="text-gray-500">Click on an event to view details and manage attendees</p>
            </div>
          )}
        </div>
      </div>

      {/* Walk-in Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Walk-in Visitor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={signInData.name}
                  onChange={(e) => setSignInData({ ...signInData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={signInData.phone}
                  onChange={(e) => setSignInData({ ...signInData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="(239) 555-0100"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSignInModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWalkIn}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add & Check In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
