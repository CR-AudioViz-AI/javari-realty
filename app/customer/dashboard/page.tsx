'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Heart,
  Calendar,
  MessageSquare,
  Search,
  Bell,
  User,
  LogOut,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  Eye,
  Send,
  X,
  Filter,
  SlidersHorizontal,
  Star,
  Phone,
  Mail,
  Building2,
} from 'lucide-react'

interface Customer {
  id: string
  email: string
  full_name: string
  phone: string
  saved_properties: SavedProperty[]
  saved_searches: SavedSearch[]
  showing_requests: ShowingRequest[]
}

interface SavedProperty {
  id: string
  address: string
  city: string
  price: number
  beds: number
  baths: number
  sqft: number
  photo?: string
  saved_at: string
}

interface SavedSearch {
  id: string
  name: string
  criteria: {
    min_price?: number
    max_price?: number
    beds?: number
    baths?: number
    property_type?: string
    city?: string
  }
  created_at: string
  alert_enabled: boolean
}

interface ShowingRequest {
  id: string
  property_address: string
  requested_date: string
  requested_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
}

interface Message {
  id: string
  from: 'customer' | 'agent'
  text: string
  timestamp: string
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showRequestModal, setShowRequestModal] = useState(false)

  const [requestForm, setRequestForm] = useState({
    property_address: '',
    date: '',
    time: '10:00',
    notes: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('cr_current_customer')
    if (!stored) {
      router.push('/customer/login')
      return
    }
    
    const customerData = JSON.parse(stored)
    
    // Load full customer data with all saved items
    const customers = JSON.parse(localStorage.getItem('cr_customers') || '[]')
    const fullCustomer = customers.find((c: Customer) => c.id === customerData.id) || customerData
    
    setCustomer({
      ...fullCustomer,
      saved_properties: fullCustomer.saved_properties || [],
      saved_searches: fullCustomer.saved_searches || [],
      showing_requests: fullCustomer.showing_requests || [],
    })

    // Load messages
    const storedMessages = localStorage.getItem(`cr_messages_${customerData.id}`)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      // Demo welcome message
      setMessages([{
        id: '1',
        from: 'agent',
        text: "Hi! I'm your dedicated agent. Feel free to message me anytime with questions about properties or your home search. I'm here to help!",
        timestamp: new Date().toISOString(),
      }])
    }

    setLoading(false)
  }, [router])

  const saveCustomer = (updated: Customer) => {
    const customers = JSON.parse(localStorage.getItem('cr_customers') || '[]')
    const index = customers.findIndex((c: Customer) => c.id === updated.id)
    if (index >= 0) {
      customers[index] = updated
    }
    localStorage.setItem('cr_customers', JSON.stringify(customers))
    localStorage.setItem('cr_current_customer', JSON.stringify(updated))
    setCustomer(updated)
  }

  const removeSavedProperty = (propertyId: string) => {
    if (!customer) return
    const updated = {
      ...customer,
      saved_properties: customer.saved_properties.filter(p => p.id !== propertyId)
    }
    saveCustomer(updated)
  }

  const removeSavedSearch = (searchId: string) => {
    if (!customer) return
    const updated = {
      ...customer,
      saved_searches: customer.saved_searches.filter(s => s.id !== searchId)
    }
    saveCustomer(updated)
  }

  const toggleSearchAlert = (searchId: string) => {
    if (!customer) return
    const updated = {
      ...customer,
      saved_searches: customer.saved_searches.map(s =>
        s.id === searchId ? { ...s, alert_enabled: !s.alert_enabled } : s
      )
    }
    saveCustomer(updated)
  }

  const requestShowing = () => {
    if (!customer || !requestForm.property_address || !requestForm.date) return

    const newRequest: ShowingRequest = {
      id: crypto.randomUUID(),
      property_address: requestForm.property_address,
      requested_date: requestForm.date,
      requested_time: requestForm.time,
      status: 'pending',
      notes: requestForm.notes,
      created_at: new Date().toISOString(),
    }

    const updated = {
      ...customer,
      showing_requests: [...customer.showing_requests, newRequest]
    }
    saveCustomer(updated)
    setShowRequestModal(false)
    setRequestForm({ property_address: '', date: '', time: '10:00', notes: '' })
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !customer) return

    const msg: Message = {
      id: crypto.randomUUID(),
      from: 'customer',
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, msg]
    setMessages(updatedMessages)
    localStorage.setItem(`cr_messages_${customer.id}`, JSON.stringify(updatedMessages))
    setNewMessage('')

    // Simulate agent response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: crypto.randomUUID(),
        from: 'agent',
        text: "Thanks for your message! I'll get back to you shortly. In the meantime, feel free to browse our latest listings.",
        timestamp: new Date().toISOString(),
      }
      const withResponse = [...updatedMessages, response]
      setMessages(withResponse)
      localStorage.setItem(`cr_messages_${customer.id}`, JSON.stringify(withResponse))
    }, 2000)
  }

  const logout = () => {
    localStorage.removeItem('cr_current_customer')
    router.push('/customer/login')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  }

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'saved', label: 'Saved Homes', icon: Heart, count: customer.saved_properties.length },
    { id: 'searches', label: 'Saved Searches', icon: Search, count: customer.saved_searches.length },
    { id: 'showings', label: 'Showings', icon: Calendar, count: customer.showing_requests.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CR Realty</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {customer.full_name?.[0] || customer.email[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{customer.full_name || 'Guest'}</p>
                <p className="text-xs text-gray-500">{customer.email}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {customer.full_name?.split(' ')[0] || 'there'}!</h1>
              <p className="text-blue-100">Your personalized home search dashboard</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border p-5">
                <Heart className="w-8 h-8 text-rose-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{customer.saved_properties.length}</p>
                <p className="text-sm text-gray-500">Saved Homes</p>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <Search className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{customer.saved_searches.length}</p>
                <p className="text-sm text-gray-500">Saved Searches</p>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <Calendar className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{customer.showing_requests.filter(s => s.status === 'pending' || s.status === 'confirmed').length}</p>
                <p className="text-sm text-gray-500">Upcoming Showings</p>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <MessageSquare className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Request a Showing
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Message Your Agent
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <Link
                    href="/lead-capture"
                    className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" />
                      Update Search Criteria
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Your Agent */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Your Agent</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    TH
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Tony Harvey</p>
                    <p className="text-sm text-gray-500">Premiere Plus Realty</p>
                    <p className="text-sm text-gray-500">SWFL Specialist</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href="tel:+12395551234" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <Phone className="w-4 h-4" />
                    (239) 555-1234
                  </a>
                  <a href="mailto:tony@example.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <Mail className="w-4 h-4" />
                    tony@premiere-plus.com
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Saved Properties */}
            {customer.saved_properties.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Recently Saved</h2>
                  <button onClick={() => setActiveTab('saved')} className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {customer.saved_properties.slice(0, 3).map(property => (
                    <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                      <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-gray-900">{formatPrice(property.price)}</p>
                        <p className="text-sm text-gray-500 truncate">{property.address}</p>
                        <p className="text-xs text-gray-400">{property.beds} bd • {property.baths} ba • {property.sqft?.toLocaleString()} sqft</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Homes Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Saved Homes</h2>
              <span className="text-gray-500">{customer.saved_properties.length} properties</span>
            </div>

            {customer.saved_properties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.saved_properties.map(property => (
                  <div key={property.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition group">
                    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                      <button
                        onClick={() => removeSavedProperty(property.id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                      >
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                      <p className="text-gray-600">{property.address}</p>
                      <p className="text-sm text-gray-500">{property.city}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.beds}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.baths}</span>
                        <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft?.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setRequestForm({ ...requestForm, property_address: property.address })
                          setShowRequestModal(true)
                        }}
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Request Showing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-medium text-gray-900 mb-2">No Saved Homes Yet</h3>
                <p className="text-gray-500">When you find homes you love, save them here to keep track.</p>
              </div>
            )}
          </div>
        )}

        {/* Saved Searches Tab */}
        {activeTab === 'searches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Saved Searches</h2>
            </div>

            {customer.saved_searches.length > 0 ? (
              <div className="space-y-4">
                {customer.saved_searches.map(search => (
                  <div key={search.id} className="bg-white rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{search.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {search.criteria.city && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              <MapPin className="w-3 h-3 inline mr-1" />{search.criteria.city}
                            </span>
                          )}
                          {search.criteria.min_price && search.criteria.max_price && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              <DollarSign className="w-3 h-3 inline mr-1" />
                              {formatPrice(search.criteria.min_price)} - {formatPrice(search.criteria.max_price)}
                            </span>
                          )}
                          {search.criteria.beds && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              <Bed className="w-3 h-3 inline mr-1" />{search.criteria.beds}+ beds
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSearchAlert(search.id)}
                          className={`p-2 rounded-lg ${search.alert_enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
                          title={search.alert_enabled ? 'Alerts enabled' : 'Enable alerts'}
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeSavedSearch(search.id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-medium text-gray-900 mb-2">No Saved Searches</h3>
                <p className="text-gray-500">Save your search criteria to get alerts when new homes match.</p>
              </div>
            )}
          </div>
        )}

        {/* Showings Tab */}
        {activeTab === 'showings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Showing Requests</h2>
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Request Showing
              </button>
            </div>

            {customer.showing_requests.length > 0 ? (
              <div className="space-y-4">
                {customer.showing_requests.map(showing => (
                  <div key={showing.id} className="bg-white rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            showing.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            showing.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            showing.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {showing.status.charAt(0).toUpperCase() + showing.status.slice(1)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{showing.property_address}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(showing.requested_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {showing.requested_time}
                          </span>
                        </div>
                        {showing.notes && (
                          <p className="text-sm text-gray-500 mt-2">{showing.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-medium text-gray-900 mb-2">No Showing Requests</h3>
                <p className="text-gray-500 mb-4">Request a showing to tour homes you&apos;re interested in.</p>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Request a Showing
                </button>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border h-[600px] flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">Messages with Your Agent</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${
                    msg.from === 'customer'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === 'customer' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Showing Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Request a Showing</h2>
              <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address *</label>
                <input
                  type="text"
                  value={requestForm.property_address}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, property_address: e.target.value }))}
                  placeholder="123 Main St, Naples FL"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    value={requestForm.date}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    value={requestForm.time}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any special requests or questions..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex gap-3">
              <button onClick={() => setShowRequestModal(false)} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={requestShowing}
                disabled={!requestForm.property_address || !requestForm.date}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
