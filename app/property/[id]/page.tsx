'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Car,
  Thermometer,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Calculator,
  DollarSign,
  Percent,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
  lot_size?: number
  year_built?: number
  property_type: string
  status: string
  photos: string[]
  description?: string
  features?: string[]
  garage_spaces?: number
  cooling?: string
  heating?: string
  hoa_fee?: number
  listing_agent_id?: string
  days_on_market?: number
  mls_number?: string
  created_at: string
}

interface Agent {
  id: string
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  license_number?: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  // Mortgage calculator state
  const [mortgageCalc, setMortgageCalc] = useState({
    price: 0,
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTerm: 30,
  })

  // Contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  // Schedule form
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '10:00',
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProperty()
    checkIfSaved()
    trackView()
  }, [propertyId])

  async function loadProperty() {
    try {
      const { data: prop, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (error) throw error
      
      setProperty(prop as Property)
      setMortgageCalc(prev => ({ ...prev, price: prop.price }))

      // Load listing agent
      if (prop.listing_agent_id) {
        const { data: agentData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', prop.listing_agent_id)
          .single()
        
        if (agentData) setAgent(agentData as Agent)
      }
    } catch (error) {
      console.error('Error loading property:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkIfSaved() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    // Check if this is a customer
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (customer) {
      setCustomerId(customer.id)
      
      const { data: saved } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('customer_id', customer.id)
        .eq('property_id', propertyId)
        .single()

      setIsSaved(!!saved)
    }
  }

  async function trackView() {
    // Track property view for analytics
    await supabase.from('property_views').insert({
      property_id: propertyId,
      action: 'view',
      created_at: new Date().toISOString()
    })
  }

  async function toggleSave() {
    if (!customerId) {
      router.push('/customer/login')
      return
    }

    if (isSaved) {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('customer_id', customerId)
        .eq('property_id', propertyId)
      
      setIsSaved(false)
      showNotif('success', 'Removed from favorites')
    } else {
      await supabase
        .from('saved_properties')
        .insert({ customer_id: customerId, property_id: propertyId })
      
      setIsSaved(true)
      showNotif('success', 'Saved to favorites!')
    }
  }

  async function submitContactForm() {
    if (!contactForm.name || !contactForm.email) return
    setSubmitting(true)

    try {
      // Create a lead from the contact form
      const { error } = await supabase.from('leads').insert({
        full_name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        source: 'property_inquiry',
        status: 'new',
        notes: `Property inquiry for: ${property?.address}\n\nMessage: ${contactForm.message}`,
        assigned_to: property?.listing_agent_id,
        created_at: new Date().toISOString()
      })

      if (error) throw error

      showNotif('success', 'Message sent! The agent will contact you shortly.')
      setShowContactForm(false)
      setContactForm({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      showNotif('error', 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function submitScheduleForm() {
    if (!scheduleForm.date) return
    setSubmitting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const requestData: Record<string, unknown> = {
        property_id: propertyId,
        property_address: `${property?.address}, ${property?.city}, ${property?.state}`,
        requested_date: scheduleForm.date,
        requested_time: scheduleForm.time,
        customer_notes: scheduleForm.notes,
        agent_id: property?.listing_agent_id,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      if (customerId) {
        requestData.customer_id = customerId
        
        // Get customer info
        const { data: cust } = await supabase
          .from('customers')
          .select('full_name, email, phone')
          .eq('id', customerId)
          .single()
        
        if (cust) {
          requestData.customer_name = cust.full_name
          requestData.customer_email = cust.email
          requestData.customer_phone = cust.phone
        }
      } else if (contactForm.name && contactForm.email) {
        requestData.customer_name = contactForm.name
        requestData.customer_email = contactForm.email
        requestData.customer_phone = contactForm.phone
      }

      const { error } = await supabase.from('showing_requests').insert(requestData)

      if (error) throw error

      showNotif('success', 'Showing requested! The agent will confirm shortly.')
      setShowScheduleForm(false)
      setScheduleForm({ date: '', time: '10:00', notes: '' })
    } catch (error) {
      showNotif('error', 'Failed to request showing. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function showNotif(type: 'success' | 'error', message: string) {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  function shareProperty() {
    if (navigator.share) {
      navigator.share({
        title: property?.address,
        text: `Check out this property: ${property?.address}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotif('success', 'Link copied to clipboard!')
    }
  }

  // Mortgage calculations
  const calculateMortgage = () => {
    const principal = mortgageCalc.price * (1 - mortgageCalc.downPaymentPercent / 100)
    const monthlyRate = mortgageCalc.interestRate / 100 / 12
    const numPayments = mortgageCalc.loanTerm * 12

    if (monthlyRate === 0) return principal / numPayments

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1)
    return payment
  }

  const monthlyPayment = calculateMortgage()
  const downPaymentAmount = mortgageCalc.price * (mortgageCalc.downPaymentPercent / 100)
  const loanAmount = mortgageCalc.price - downPaymentAmount
  const totalInterest = (monthlyPayment * mortgageCalc.loanTerm * 12) - loanAmount
  const estimatedTaxes = (mortgageCalc.price * 0.0125) / 12 // ~1.25% property tax
  const estimatedInsurance = (mortgageCalc.price * 0.005) / 12 // ~0.5% insurance
  const totalMonthly = monthlyPayment + estimatedTaxes + estimatedInsurance + (property?.hoa_fee || 0)

  const formatPrice = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Property not found</p>
          <Link href="/search" className="text-blue-600">Browse properties</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            Back to Search
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleSave} className={`p-2 rounded-lg border ${isSaved ? 'bg-rose-50 border-rose-200' : 'hover:bg-gray-100'}`}>
              <Heart className={`w-5 h-5 ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-gray-600'}`} />
            </button>
            <button onClick={shareProperty} className="p-2 rounded-lg border hover:bg-gray-100">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border">
              <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer" onClick={() => setShowGallery(true)}>
                {property.photos?.[currentPhotoIndex] ? (
                  <img src={property.photos[currentPhotoIndex]} alt={property.address} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-24 h-24 text-gray-400" />
                )}
                
                {property.photos && property.photos.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(i => i > 0 ? i - 1 : property.photos!.length - 1) }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(i => i < property.photos!.length - 1 ? i + 1 : 0) }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                      {currentPhotoIndex + 1} / {property.photos.length}
                    </div>
                  </>
                )}

                <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {property.status === 'active' ? 'For Sale' : property.status}
                </span>
              </div>
            </div>

            {/* Price & Address */}
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                  {property.hoa_fee && <p className="text-sm text-gray-500">+ ${property.hoa_fee}/mo HOA</p>}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {property.property_type}
                </span>
              </div>
              
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{property.address}</h1>
              <p className="text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {property.city}, {property.state} {property.zip}
              </p>

              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                  <p className="text-xs text-gray-500">Beds</p>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                  <p className="text-xs text-gray-500">Baths</p>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="font-semibold text-gray-900">{property.sqft?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Sq Ft</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="font-semibold text-gray-900">{property.year_built || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Built</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {property.lot_size && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Square className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Lot Size</p>
                      <p className="font-medium">{property.lot_size.toLocaleString()} sq ft</p>
                    </div>
                  </div>
                )}
                {property.garage_spaces && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Garage</p>
                      <p className="font-medium">{property.garage_spaces} spaces</p>
                    </div>
                  </div>
                )}
                {property.cooling && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Thermometer className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Cooling</p>
                      <p className="font-medium">{property.cooling}</p>
                    </div>
                  </div>
                )}
                {property.heating && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Thermometer className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Heating</p>
                      <p className="font-medium">{property.heating}</p>
                    </div>
                  </div>
                )}
                {property.mls_number && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">MLS #</p>
                      <p className="font-medium">{property.mls_number}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Days on Market</p>
                    <p className="font-medium">{property.days_on_market || Math.floor((Date.now() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Mortgage Calculator
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Home Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgageCalc.price}
                        onChange={(e) => setMortgageCalc(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ({mortgageCalc.downPaymentPercent}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={mortgageCalc.downPaymentPercent}
                      onChange={(e) => setMortgageCalc(prev => ({ ...prev, downPaymentPercent: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formatPrice(downPaymentAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={mortgageCalc.interestRate}
                        onChange={(e) => setMortgageCalc(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-4 pr-9 py-2 border rounded-lg"
                      />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
                    <select
                      value={mortgageCalc.loanTerm}
                      onChange={(e) => setMortgageCalc(prev => ({ ...prev, loanTerm: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value={30}>30 years</option>
                      <option value={20}>20 years</option>
                      <option value={15}>15 years</option>
                      <option value={10}>10 years</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-blue-700 font-medium mb-2">Estimated Monthly Payment</p>
                  <p className="text-4xl font-bold text-blue-900 mb-4">{formatPrice(totalMonthly)}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-medium">{formatPrice(monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax (est.)</span>
                      <span className="font-medium">{formatPrice(estimatedTaxes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance (est.)</span>
                      <span className="font-medium">{formatPrice(estimatedInsurance)}</span>
                    </div>
                    {property.hoa_fee && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">HOA Fee</span>
                        <span className="font-medium">${property.hoa_fee}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount</span>
                        <span className="font-medium">{formatPrice(loanAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest</span>
                        <span className="font-medium">{formatPrice(totalInterest)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent Card */}
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              {agent ? (
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {agent.full_name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <h3 className="font-semibold text-gray-900">{agent.full_name}</h3>
                  <p className="text-sm text-gray-500">Listing Agent</p>
                  {agent.license_number && <p className="text-xs text-gray-400">Lic# {agent.license_number}</p>}
                </div>
              ) : (
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900">CR Realty</h3>
                  <p className="text-sm text-gray-500">Contact us for more info</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => setShowScheduleForm(true)}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Showing
                </button>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact Agent
                </button>
                {agent?.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="w-full py-3 border text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    {agent.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Contact Agent</h2>
              <button onClick={() => setShowContactForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input type="text" value={contactForm.name} onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={contactForm.message} onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))} rows={3} placeholder={`I'm interested in ${property.address}...`} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex gap-3">
              <button onClick={() => setShowContactForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={submitContactForm} disabled={!contactForm.name || !contactForm.email || submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Showing Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Schedule Showing</h2>
              <button onClick={() => setShowScheduleForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">{property.address}, {property.city}</p>
              
              {!customerId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input type="text" value={contactForm.name} onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={contactForm.email} onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select value={scheduleForm.time} onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
                    {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t => (
                      <option key={t} value={t}>{parseInt(t) > 12 ? `${parseInt(t)-12}:00 PM` : `${parseInt(t)}:00 ${parseInt(t) === 12 ? 'PM' : 'AM'}`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={scheduleForm.notes} onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))} rows={2} placeholder="Any special requests..." className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex gap-3">
              <button onClick={() => setShowScheduleForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={submitScheduleForm} disabled={!scheduleForm.date || submitting || (!customerId && (!contactForm.name || !contactForm.email))} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}Request Showing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Gallery */}
      {showGallery && property.photos && property.photos.length > 0 && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button onClick={() => setShowGallery(false)} className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
          <button onClick={() => setCurrentPhotoIndex(i => i > 0 ? i - 1 : property.photos!.length - 1)} className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-lg">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img src={property.photos[currentPhotoIndex]} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
          <button onClick={() => setCurrentPhotoIndex(i => i < property.photos!.length - 1 ? i + 1 : 0)} className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-lg">
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full">
            {currentPhotoIndex + 1} / {property.photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
