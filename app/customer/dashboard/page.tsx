// =====================================================
// CR REALTOR PLATFORM - CUSTOMER DASHBOARD HOME
// Path: app/customer/dashboard/page.tsx
// Timestamp: 2025-12-01 11:16 AM EST
// Purpose: Customer portal home/overview (multi-tenant)
// =====================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Building2,
  MessageSquare,
  Heart,
  FileText,
  ArrowRight,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react'

interface CustomerData {
  id: string
  full_name: string
  assigned_agent_id: string
}

interface AgentData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
}

interface Stats {
  savedProperties: number
  unreadMessages: number
  sharedDocuments: number
  recentProperties: any[]
}

export default function CustomerDashboardPage() {
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [agent, setAgent] = useState<AgentData | null>(null)
  const [stats, setStats] = useState<Stats>({
    savedProperties: 0,
    unreadMessages: 0,
    sharedDocuments: 0,
    recentProperties: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get customer record
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!customerData) return
      setCustomer(customerData)

      // Get agent info
      const { data: agentData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .eq('id', customerData.assigned_agent_id)
        .single()

      if (agentData) setAgent(agentData)

      // Get stats
      const [savedCount, messageCount, docCount, recentProps] = await Promise.all([
        // Saved properties count
        supabase
          .from('saved_properties')
          .select('id', { count: 'exact', head: true })
          .eq('customer_id', customerData.id),
        
        // Unread messages count
        supabase
          .from('customer_messages')
          .select('id', { count: 'exact', head: true })
          .eq('customer_id', customerData.id)
          .eq('sender_type', 'agent')
          .eq('is_read', false),
        
        // Shared documents count
        supabase
          .from('customer_documents')
          .select('id', { count: 'exact', head: true })
          .eq('customer_id', customerData.id),
        
        // Recent shared properties
        supabase
          .from('properties')
          .select('id, address, city, state, price, bedrooms, bathrooms, square_feet, images')
          .eq('agent_id', customerData.assigned_agent_id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3)
      ])

      setStats({
        savedProperties: savedCount.count || 0,
        unreadMessages: messageCount.count || 0,
        sharedDocuments: docCount.count || 0,
        recentProperties: recentProps.data || []
      })

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const agentName = agent ? `${agent.first_name} ${agent.last_name}`.trim() : 'Your Agent'
  const customerFirstName = customer?.full_name?.split(' ')[0] || 'there'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {customerFirstName}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Ready to find your perfect home? Let's continue your search.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/customer/dashboard/favorites" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.savedProperties}</p>
          <p className="text-sm text-gray-500">Saved Homes</p>
        </Link>

        <Link href="/customer/dashboard/messages" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            {stats.unreadMessages > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
                {stats.unreadMessages}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
          <p className="text-sm text-gray-500">New Messages</p>
        </Link>

        <Link href="/customer/dashboard/documents" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.sharedDocuments}</p>
          <p className="text-sm text-gray-500">Documents</p>
        </Link>

        <Link href="/customer/dashboard/properties" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.recentProperties.length}+</p>
          <p className="text-sm text-gray-500">Properties</p>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
            <Link href="/customer/dashboard/properties" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {stats.recentProperties.length > 0 ? (
            <div className="grid gap-4">
              {stats.recentProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/customer/dashboard/properties/${property.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex"
                >
                  {/* Property Image */}
                  <div className="w-32 sm:w-48 h-32 bg-gray-200 flex-shrink-0">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 p-4">
                    <p className="font-semibold text-gray-900 mb-1">{property.address}</p>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {property.city}, {property.state}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      {formatPrice(property.price)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      {property.square_feet && (
                        <span>{property.square_feet.toLocaleString()} sqft</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No properties available yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back soon for new listings!</p>
            </div>
          )}
        </div>

        {/* Agent Contact Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Agent</h2>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {agent?.first_name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{agentName}</p>
                <p className="text-sm text-gray-500">Real Estate Agent</p>
              </div>
            </div>

            <div className="space-y-3">
              {agent?.email && (
                <a 
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{agent.email}</span>
                </a>
              )}
              {agent?.phone && (
                <a 
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{agent.phone}</span>
                </a>
              )}
            </div>

            <Link
              href="/customer/dashboard/messages"
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-5 w-5" />
              Send Message
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/customer/dashboard/properties"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Browse Properties</span>
              </Link>
              <Link
                href="/customer/dashboard/favorites"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="text-gray-700">View Saved Homes</span>
              </Link>
              <Link
                href="/customer/dashboard/documents"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">View Documents</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
