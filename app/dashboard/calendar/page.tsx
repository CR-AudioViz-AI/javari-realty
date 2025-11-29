'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Home,
  Phone,
  Video,
  Users,
  X,
  Check,
  Trash2,
  Edit,
  Loader2,
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  event_type: string
  start_time: string
  end_time: string
  location?: string
  contact_name?: string
  notes?: string
  property_id?: string
}

export default function CalendarPage() {
  const supabase = createClient()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    event_type: 'showing',
    date: '',
    start_time: '10:00',
    end_time: '11:00',
    location: '',
    contact_name: '',
    notes: '',
  })

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const eventTypes = [
    { id: 'showing', label: 'Showing', icon: Home, color: 'bg-blue-500' },
    { id: 'meeting', label: 'Meeting', icon: Users, color: 'bg-purple-500' },
    { id: 'call', label: 'Phone Call', icon: Phone, color: 'bg-emerald-500' },
    { id: 'video', label: 'Video Call', icon: Video, color: 'bg-amber-500' },
    { id: 'open_house', label: 'Open House', icon: Home, color: 'bg-rose-500' },
    { id: 'inspection', label: 'Inspection', icon: Clock, color: 'bg-indigo-500' },
    { id: 'closing', label: 'Closing', icon: Check, color: 'bg-green-500' },
    { id: 'other', label: 'Other', icon: CalendarIcon, color: 'bg-gray-500' },
  ]

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  async function loadEvents() {
    setLoading(true)
    // For now, use local storage since table doesn't exist yet
    const stored = localStorage.getItem('cr_calendar_events')
    if (stored) {
      const allEvents = JSON.parse(stored)
      // Filter to current month
      const filtered = allEvents.filter((e: CalendarEvent) => {
        const eventDate = new Date(e.start_time)
        return eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getFullYear() === currentDate.getFullYear()
      })
      setEvents(filtered)
    }
    setLoading(false)
  }

  const saveEvent = async () => {
    setSaving(true)
    
    const startDateTime = new Date(`${formData.date}T${formData.start_time}`)
    const endDateTime = new Date(`${formData.date}T${formData.end_time}`)

    const newEvent: CalendarEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      title: formData.title,
      event_type: formData.event_type,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      location: formData.location,
      contact_name: formData.contact_name,
      notes: formData.notes,
    }

    // Save to local storage
    const stored = localStorage.getItem('cr_calendar_events')
    let allEvents = stored ? JSON.parse(stored) : []
    
    if (editingEvent) {
      allEvents = allEvents.map((e: CalendarEvent) => e.id === editingEvent.id ? newEvent : e)
    } else {
      allEvents.push(newEvent)
    }
    
    localStorage.setItem('cr_calendar_events', JSON.stringify(allEvents))
    
    setSaving(false)
    setShowModal(false)
    setEditingEvent(null)
    resetForm()
    loadEvents()
  }

  const deleteEvent = (id: string) => {
    if (!confirm('Delete this event?')) return
    const stored = localStorage.getItem('cr_calendar_events')
    let allEvents = stored ? JSON.parse(stored) : []
    allEvents = allEvents.filter((e: CalendarEvent) => e.id !== id)
    localStorage.setItem('cr_calendar_events', JSON.stringify(allEvents))
    loadEvents()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'showing',
      date: '',
      start_time: '10:00',
      end_time: '11:00',
      location: '',
      contact_name: '',
      notes: '',
    })
  }

  const openNewEvent = (date?: Date) => {
    resetForm()
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0]
      }))
    }
    setEditingEvent(null)
    setShowModal(true)
  }

  const openEditEvent = (event: CalendarEvent) => {
    const startDate = new Date(event.start_time)
    setFormData({
      title: event.title,
      event_type: event.event_type,
      date: startDate.toISOString().split('T')[0],
      start_time: startDate.toTimeString().slice(0, 5),
      end_time: new Date(event.end_time).toTimeString().slice(0, 5),
      location: event.location || '',
      contact_name: event.contact_name || '',
      notes: event.notes || '',
    })
    setEditingEvent(event)
    setShowModal(true)
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time)
      return eventDate.getDate() === day
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear()
  }

  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_time)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  const upcomingEvents = events
    .filter(event => new Date(event.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500">Schedule showings, meetings, and appointments</p>
        </div>
        <button
          onClick={() => openNewEvent()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : []
              const dateObj = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null
              
              return (
                <div
                  key={index}
                  onClick={() => dateObj && openNewEvent(dateObj)}
                  className={`min-h-[100px] p-2 border rounded-lg transition cursor-pointer ${
                    day ? 'hover:border-blue-300 hover:bg-blue-50/50' : 'bg-gray-50 cursor-default'
                  } ${isToday(day || 0) ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
                >
                  {day && (
                    <>
                      <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => {
                          const eventType = eventTypes.find(t => t.id === event.event_type)
                          return (
                            <div
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); openEditEvent(event) }}
                              className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${eventType?.color || 'bg-gray-500'} hover:opacity-80`}
                            >
                              {event.title}
                            </div>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Today&apos;s Schedule</h3>
            {todaysEvents.length > 0 ? (
              <div className="space-y-3">
                {todaysEvents.map(event => {
                  const eventType = eventTypes.find(t => t.id === event.event_type)
                  const Icon = eventType?.icon || CalendarIcon
                  return (
                    <div 
                      key={event.id} 
                      onClick={() => openEditEvent(event)}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    >
                      <div className={`w-10 h-10 rounded-lg ${eventType?.color || 'bg-gray-500'} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {event.location && ` • ${event.location}`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No events today</p>
                <button 
                  onClick={() => openNewEvent(new Date())}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  + Add event
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const eventDate = new Date(event.start_time)
                  const eventType = eventTypes.find(t => t.id === event.event_type)
                  return (
                    <div 
                      key={event.id} 
                      onClick={() => openEditEvent(event)}
                      className="flex gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition"
                    >
                      <div className="text-center min-w-[40px]">
                        <p className="text-xs text-gray-500">{monthNames[eventDate.getMonth()].slice(0, 3)}</p>
                        <p className="text-lg font-bold text-gray-900">{eventDate.getDate()}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${eventType?.color || 'bg-gray-500'}`} />
                          <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>

          {/* Event Types Legend */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Event Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(type => {
                const Icon = type.icon
                return (
                  <div key={type.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <span className="text-xs text-gray-600">{type.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingEvent(null) }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Showing at 123 Main St"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {eventTypes.map(type => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, event_type: type.id }))}
                        className={`p-2 rounded-lg border-2 transition flex flex-col items-center gap-1 ${
                          formData.event_type === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="123 Main St, Naples FL"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Additional details..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              {editingEvent && (
                <button
                  onClick={() => { deleteEvent(editingEvent.id); setShowModal(false); setEditingEvent(null) }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => { setShowModal(false); setEditingEvent(null) }}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEvent}
                disabled={!formData.title || !formData.date || saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
