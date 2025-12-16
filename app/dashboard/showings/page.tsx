'use client'

import { useState } from 'react'
import {
  Calendar, Clock, MapPin, User, Plus, ChevronLeft, ChevronRight,
  Home, Phone, Mail, Check, X, Edit2, Trash2, Bell, Users,
  FileText, MessageSquare, Car, AlertCircle, CheckCircle
} from 'lucide-react'

interface Showing {
  id: string
  propertyAddress: string
  propertyId?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
  duration: number // minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  feedback?: string
  type: 'showing' | 'open-house' | 'inspection' | 'appraisal' | 'closing'
  reminderSent?: boolean
}

const SAMPLE_SHOWINGS: Showing[] = [
  {
    id: '1',
    propertyAddress: '2850 Winkler Ave, Fort Myers',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@email.com',
    clientPhone: '(239) 555-0101',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    status: 'confirmed',
    type: 'showing',
    notes: 'First showing, pre-approved buyer',
    reminderSent: true
  },
  {
    id: '2',
    propertyAddress: '1420 SE 47th St, Cape Coral',
    clientName: 'Mike Chen',
    clientEmail: 'mike@email.com',
    clientPhone: '(239) 555-0102',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 45,
    status: 'scheduled',
    type: 'showing',
    notes: 'Second showing, bringing spouse'
  },
  {
    id: '3',
    propertyAddress: '3500 Oasis Blvd, Cape Coral',
    clientName: 'Lisa Wang',
    clientEmail: 'lisa@email.com',
    clientPhone: '(239) 555-0105',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    duration: 60,
    status: 'scheduled',
    type: 'inspection'
  },
  {
    id: '4',
    propertyAddress: '2850 Winkler Ave, Fort Myers',
    clientName: 'David Kim',
    clientEmail: 'david@email.com',
    clientPhone: '(239) 555-0104',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '15:00',
    duration: 45,
    status: 'completed',
    type: 'showing',
    feedback: 'Liked the kitchen but concerns about backyard size'
  }
]

const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const min = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${min}`
})

export default function ShowingsSchedulerPage() {
  const [showings, setShowings] = useState<Showing[]>(SAMPLE_SHOWINGS)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getShowingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return showings.filter(s => s.date === dateStr)
  }

  const getStatusBadge = (status: Showing['status']) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-amber-100 text-amber-800'
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    )
  }

  const getTypeBadge = (type: Showing['type']) => {
    const styles = {
      showing: 'bg-blue-50 text-blue-700',
      'open-house': 'bg-purple-50 text-purple-700',
      inspection: 'bg-amber-50 text-amber-700',
      appraisal: 'bg-cyan-50 text-cyan-700',
      closing: 'bg-green-50 text-green-700'
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </span>
    )
  }

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + direction)
    setSelectedDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const todayShowings = getShowingsForDate(new Date())
  const upcomingCount = showings.filter(s => s.status === 'scheduled' || s.status === 'confirmed').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-blue-600" /> Showing Scheduler
          </h1>
          <p className="text-gray-600 mt-1">Schedule and manage property showings</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Schedule Showing
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
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold">{todayShowings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <CheckCircle className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold">
                {showings.filter(s => s.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Home className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Properties</p>
              <p className="text-2xl font-bold">
                {new Set(showings.map(s => s.propertyAddress)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Today
            </button>
          </div>

          <div className="flex gap-2">
            {['day', 'week', 'list'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  viewMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filter */}
        <div className="flex gap-2">
          {['all', 'scheduled', 'confirmed', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs ${
                filterStatus === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Time Slots */}
          <div className="lg:col-span-2 bg-white rounded-xl border overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-semibold">Schedule</h3>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {TIME_SLOTS.map(time => {
                const showingsAtTime = getShowingsForDate(selectedDate)
                  .filter(s => s.time === time)
                  .filter(s => filterStatus === 'all' || s.status === filterStatus)
                
                return (
                  <div key={time} className="flex">
                    <div className="w-20 py-3 px-4 text-sm text-gray-500 bg-gray-50 flex-shrink-0">
                      {time}
                    </div>
                    <div className="flex-1 py-2 px-4 min-h-[60px]">
                      {showingsAtTime.map(showing => (
                        <div
                          key={showing.id}
                          onClick={() => setSelectedShowing(showing)}
                          className={`p-3 rounded-lg mb-2 cursor-pointer hover:shadow-md transition-shadow ${
                            showing.status === 'confirmed' ? 'bg-green-50 border border-green-200' :
                            showing.status === 'cancelled' ? 'bg-red-50 border border-red-200 opacity-60' :
                            'bg-blue-50 border border-blue-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{showing.propertyAddress.split(',')[0]}</p>
                              <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                <User size={12} /> {showing.clientName}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getStatusBadge(showing.status)}
                              {getTypeBadge(showing.type)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <Bell size={16} className="text-amber-600" />
                  Send Reminders
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-blue-600" />
                  Export Schedule
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <MessageSquare size={16} className="text-green-600" />
                  Bulk Message
                </button>
              </div>
            </div>

            {/* Today's Summary */}
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Today's Summary</h3>
              {todayShowings.length > 0 ? (
                <div className="space-y-3">
                  {todayShowings.map(showing => (
                    <div key={showing.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="font-bold text-sm">{showing.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{showing.clientName}</p>
                        <p className="text-xs text-gray-500">{showing.propertyAddress.split(',')[0]}</p>
                      </div>
                      {getStatusBadge(showing.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No showings today</p>
              )}
            </div>

            {/* Needs Follow-up */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Needs Follow-up
              </h3>
              <div className="space-y-2">
                {showings.filter(s => s.status === 'completed' && !s.feedback).slice(0, 3).map(s => (
                  <div key={s.id} className="bg-white rounded-lg p-2 text-sm">
                    <p className="font-medium">{s.clientName}</p>
                    <p className="text-xs text-gray-500">{s.propertyAddress.split(',')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Property</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {showings
                .filter(s => filterStatus === 'all' || s.status === filterStatus)
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .map(showing => (
                <tr key={showing.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{new Date(showing.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-500">{showing.time}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{showing.propertyAddress.split(',')[0]}</p>
                    <p className="text-sm text-gray-500">{showing.propertyAddress.split(',').slice(1).join(',')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{showing.clientName}</p>
                    <p className="text-sm text-gray-500">{showing.clientPhone}</p>
                  </td>
                  <td className="py-3 px-4">{getTypeBadge(showing.type)}</td>
                  <td className="py-3 px-4">{getStatusBadge(showing.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                        <Phone size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => setSelectedShowing(showing)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Showing Detail Modal */}
      {selectedShowing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Showing Details</h2>
                <div className="flex gap-2 mt-2">
                  {getTypeBadge(selectedShowing.type)}
                  {getStatusBadge(selectedShowing.status)}
                </div>
              </div>
              <button onClick={() => setSelectedShowing(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Home className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium">{selectedShowing.propertyAddress}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedShowing.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedShowing.time} ({selectedShowing.duration} min)</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Client Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-gray-400" />
                    <span>{selectedShowing.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${selectedShowing.clientPhone}`} className="text-blue-600 hover:underline">
                      {selectedShowing.clientPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${selectedShowing.clientEmail}`} className="text-blue-600 hover:underline">
                      {selectedShowing.clientEmail}
                    </a>
                  </div>
                </div>
              </div>

              {selectedShowing.notes && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedShowing.notes}</p>
                </div>
              )}

              {selectedShowing.feedback && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Feedback</h3>
                  <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">{selectedShowing.feedback}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                {selectedShowing.status === 'scheduled' && (
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <Check size={16} /> Confirm
                  </button>
                )}
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Edit2 size={16} /> Edit
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
