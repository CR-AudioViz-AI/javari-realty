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
  LogOut,
  ChevronRight,
  Bed,
  Bath,
  Square,
  Clock,
  Plus,
  Send,
  X,
  Building2,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Customer {
  id: string
  email: string
  full_name: string
  phone: string
  buyer_type?: string
  budget_min?: number
  budget_max?: number
  timeline?: string
  assigned_agent_id?: string
}

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  property_type: string
  status: string
  photos: string[]
  description?: string
}

interface ShowingRequest {
  id: string
  property_id?: string
  property_address: string
  requested_date: string
  requested_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  customer_notes?: string
  agent_notes?: string
}

interface Message {
  id: string
  sender_type: 'customer' | 'agent' | 'system'
  content: string
  created_at: string
  read: boolean
}

interface Conversation {
  id: string
  agent_id: string
  last_message?: string
  last_message_at?: string
  customer_unread: number
}

export default function CustomerDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([])
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  
  const [requestForm, setRequestForm] = useState({
    property_address: '',
    property_id: '',
    date: '',
    time: '10:00',
    notes: '',
  })

  useEffect(() => {
    loadCustomerData()
  }, [])

  async function loadCustomerData() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/customer/login')
        return
      }

      // Get or create customer profile
      let customerData: Customer | null = null
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (existingCustomer) {
        customerData = existingCustomer as Customer
      } else {
        const newCustomer = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || '',
        }
        
        const { data: created } = await supabase
          .from('customers')
          .insert(newCustomer)
          .select()
          .single()
        
        customerData = (created || newCustomer) as Customer
      }

      setCustomer(customerData)

      // Load saved property IDs
      const { data: savedData } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('customer_id', session.user.id)

      if (savedData) {
        setSavedPropertyIds(savedData.map((s: { property_id: string }) => s.property_id))
      }
      
      // Load showing requests
      const { data: showingsData } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('customer_id', session.user.id)
        .order('requested_date', { ascending: true })

      if (showingsData) {
        setShowingRequests(showingsData as ShowingRequest[])
      }
      
      // Load properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20)

      if (propertiesData) {
        setProperties(propertiesData as Property[])
      }
      
      // Load conversation
      const { data: convData } = await supabase
        .from('conversations')
        .select('*')
        .eq('customer_id', session.user.id)
        .single()

      if (convData) {
        setConversation(convData as Conversation)
        
        const { data: msgsData } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', convData.id)
          .order('created_at', { ascending: true })

        if (msgsData) {
          setMessages(msgsData as Message[])
        }
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleSaveProperty(property: Property) {
    if (!customer) return

    const isSaved = savedPropertyIds.includes(property.id)

    if (isSaved) {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('customer_id', customer.id)
        .eq('property_id', property.id)

      if (!error) {
        setSavedPropertyIds(prev => prev.filter(id => id !== property.id))
        showNotification('success', 'Property removed from favorites')
      }
    } else {
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          customer_id: customer.id,
          property_id: property.id
        })

      if (!error) {
        setSavedPropertyIds(prev => [...prev, property.id])
        showNotification('success', 'Property saved to favorites!')
      }
    }
  }

  async function submitShowingRequest() {
    if (!customer || !requestForm.date) return
    
    setSubmittingRequest(true)

    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .insert({
          customer_id: customer.id,
          customer_name: customer.full_name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          property_id: requestForm.property_id || null,
          property_address: requestForm.property_address,
          requested_date: requestForm.date,
          requested_time: requestForm.time,
          customer_notes: requestForm.notes,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setShowingRequests(prev => [...prev, data as ShowingRequest])
      }
      setShowRequestModal(false)
      setRequestForm({ property_address: '', property_id: '', date: '', time: '10:00', notes: '' })
      showNotification('success', 'Showing request submitted!')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request'
      showNotification('error', errorMessage)
    } finally {
      setSubmittingRequest(false)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !customer) return
    
    setSendingMessage(true)

    try {
      let convId = conversation?.id

      if (!convId) {
        const { data: agents } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)

        const agentId = agents?.[0]?.id || customer.assigned_agent_id

        if (!agentId) {
          showNotification('error', 'No agent available.')
          return
        }

        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            customer_id: customer.id,
            agent_id: agentId
          })
          .select()
          .single()

        if (convError) throw convError
        if (newConv) {
          convId = newConv.id
          setConversation(newConv as Conversation)
        }
      }

      const { data: msg, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: convId,
          customer_id: customer.id,
          sender_type: 'customer',
          sender_id: customer.id,
          content: newMessage
        })
        .select()
        .single()

      if (error) throw error

      if (msg) {
        setMessages(prev => [...prev, msg as Message])
      }
      setNewMessage('')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      showNotification('error', errorMessage)
    } finally {
      setSendingMessage(false)
    }
  }

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/customer/login')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <Link href="/customer/login" className="text-blue-600">Return to login</Link>
        </div>
      </div>
    )
  }

  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id))

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'properties', label: 'Browse', icon: Search, count: properties.length },
    { id: 'saved', label: 'Saved', icon: Heart, count: savedProperties.length },
    { id: 'showings', label: 'Showings', icon: Calendar, count: showingRequests.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CR Realty</span>
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={loadCustomerData} className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {customer.full_name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{customer.full_name || 'Guest'}</p>
                <p className="text-xs text-gray-500">{customer.email}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-200'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {customer.full_name?.split(' ')[0] || 'there'}!</h1>
              <p className="text-blue-100">Your personalized home search dashboard</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border p-5">
                <Heart className="w-8 h-8 text-rose-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{savedProperties.length}</p>
                <p className="text-sm text-gray-500">Saved Homes</p>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <Search className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-sm text-gray-500">Available Listings</p>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <Calendar className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{showingRequests.filter(s => s.status === 'pending' || s.status === 'confirmed').length}</p>
                <p className="text-sm text-gray-500">Upcoming Showings</p>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <MessageSquare className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setActiveTab('properties')} className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <span className="flex items-center gap-2"><Search className="w-5 h-5" />Browse Properties</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setShowRequestModal(true)} className="w-full flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
                  <span className="flex items-center gap-2"><Calendar className="w-5 h-5" />Request a Showing</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveTab('messages')} className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                  <span className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Message Your Agent</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Available Properties ({properties.length})</h2>
            {properties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                  <div key={property.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group">
                    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      {property.photos?.[0] ? (
                        <img src={property.photos[0]} alt={property.address} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-12 h-12 text-gray-400" />
                      )}
                      <button onClick={() => toggleSaveProperty(property)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow hover:bg-white">
                        <Heart className={`w-5 h-5 ${savedPropertyIds.includes(property.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                      </button>
                      <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        {property.property_type}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                      <p className="text-gray-600 truncate">{property.address}</p>
                      <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>
                        <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft?.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setRequestForm({
                            property_address: `${property.address}, ${property.city}`,
                            property_id: property.id,
                            date: '', time: '10:00', notes: ''
                          })
                          setShowRequestModal(true)
                        }}
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Request Showing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No properties available. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Saved Homes ({savedProperties.length})</h2>
            {savedProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map(property => (
                  <div key={property.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">
                    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                      <button onClick={() => toggleSaveProperty(property)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow hover:bg-red-50">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                      <p className="text-gray-600">{property.address}</p>
                      <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>
                        <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No saved homes yet</p>
                <button onClick={() => setActiveTab('properties')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Browse Properties
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'showings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Showing Requests</h2>
              <button onClick={() => setShowRequestModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />New Request
              </button>
            </div>

            {showingRequests.length > 0 ? (
              <div className="space-y-4">
                {showingRequests.map(showing => (
                  <div key={showing.id} className="bg-white rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
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
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(showing.requested_date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{showing.requested_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No showing requests yet</p>
                <button onClick={() => setShowRequestModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Request a Showing
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border h-[600px] flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">Messages with Your Agent</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${
                    msg.sender_type === 'customer' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender_type === 'customer' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && sendMessage()}
                  placeholder="Type a message..."
                  disabled={sendingMessage}
                  className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button onClick={sendMessage} disabled={!newMessage.trim() || sendingMessage} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50">
                  {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Request a Showing</h2>
              <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address *</label>
                <input type="text" value={requestForm.property_address} onChange={(e) => setRequestForm(prev => ({ ...prev, property_address: e.target.value }))} placeholder="123 Main St, Naples FL" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={requestForm.date} onChange={(e) => setRequestForm(prev => ({ ...prev, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select value={requestForm.time} onChange={(e) => setRequestForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t => (
                      <option key={t} value={t}>{parseInt(t) > 12 ? `${parseInt(t)-12}:00 PM` : `${parseInt(t)}:00 ${parseInt(t) === 12 ? 'PM' : 'AM'}`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={requestForm.notes} onChange={(e) => setRequestForm(prev => ({ ...prev, notes: e.target.value }))} rows={2} placeholder="Any special requests..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex gap-3">
              <button onClick={() => setShowRequestModal(false)} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50" disabled={submittingRequest}>Cancel</button>
              <button onClick={submitShowingRequest} disabled={!requestForm.property_address || !requestForm.date || submittingRequest} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {submittingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
