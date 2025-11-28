'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'

interface Event {
  id: string
  title: string
  start_time: string
  end_time: string
  event_type: string
  location?: string
  notes?: string
  contact_name?: string
  property_id?: string
  property_title?: string
}

export default function CalendarPage() {
  const supabase = createClient()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newEvent, setNewEvent] = useState({
    title: '',
    event_type: 'showing',
    date: '',
    start_time: '10:00',
    end_time: '11:00',
    location: '',
    contact_name: '',
    notes: '',
  })

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  async function loadEvents() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('start_time', startOfMonth.toISOString())
      .lte('start_time', endOfMonth.toISOString())
      .order('start_time')

    setEvents(data || [])
    setLoading(false)
  }

  const eventTypes = [
    { id: 'showing', label: 'Showing', icon: Home, color: 'bg-blue-500' },
    { id: 'meeting', label: 'Meeting', icon: Users, color: 'bg-purple-500' },
    { id: 'call', label: 'Phone Call', icon: Phone, color: 'bg-emerald-500' },
    { id: 'video', label: 'Video Call', icon: Video, color: 'bg-amber-500' },
    { id: 'open_house', label: 'Open House', icon: Home, color: 'bg-rose-500' },
    { id: 'other', label: 'Other', icon: CalendarIcon, color: 'bg-gray-500' },
  ]

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time)
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear()
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleCreateEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDateTime = new Date(`${newEvent.date}T${newEvent.start_time}`)
    const endDateTime = new Date(`${newEvent.date}T${newEvent.end_time}`)

    const { error } = await supabase.from('calendar_events').insert({
      user_id: user.id,
      title: newEvent.title,
      event_type: newEvent.event_type,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      location: newEvent.location,
      contact_name: newEvent.contact_name,
      notes: newEvent.notes,
    })

    if (!error) {
      setShowNewEvent(false)
      setNewEvent({
        title: '',
        event_type: 'showing',
        date: '',
        start_time: '10:00',
        end_time: '11:00',
        location: '',
        contact_name: '',
        notes: '',
      })
      loadEvents()
    }
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear()
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_time)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = events
    .filter(event => new Date(event.start_time) > new Date())
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
          onClick={() => setShowNewEvent(true)}
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
                onClick={prevMonth}
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
                onClick={nextMonth}
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
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg transition ${
                    day ? 'hover:border-blue-300 cursor-pointer' : 'bg-gray-50'
                  } ${isToday(day || 0) ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
                  onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
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
                              className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${eventType?.color || 'bg-gray-500'}`}
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
            <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            {todaysEvents.length > 0 ? (
              <div className="space-y-3">
                {todaysEvents.map(event => {
                  const eventType = eventTypes.find(t => t.id === event.event_type)
                  const Icon = eventType?.icon || CalendarIcon
                  return (
                    <div key={event.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-lg ${eventType?.color || 'bg-gray-500'} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{monthNames[eventDate.getMonth()].slice(0, 3)}</p>
                        <p className="text-lg font-bold text-gray-900">{eventDate.getDate()}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
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
            <div className="space-y-2">
              {eventTypes.map(type => {
                const Icon = type.icon
                return (
                  <div key={type.id} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{type.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      {showNewEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Event</h2>
              <button onClick={() => setShowNewEvent(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Showing at 123 Main St"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {eventTypes.map(type => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewEvent(prev => ({ ...prev, event_type: type.id }))}
                        className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-1 ${
                          newEvent.event_type === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                    <input
                      type="time"
                      value={newEvent.start_time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                    <input
                      type="time"
                      value={newEvent.end_time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="123 Main St, Naples FL"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={newEvent.contact_name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, contact_name: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewEvent(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!newEvent.title || !newEvent.date}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
