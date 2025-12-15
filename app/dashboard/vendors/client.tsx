'use client'

import { useState } from 'react'
import {
  Search, MapPin, Phone, Mail, Globe, Star, Plus,
  Building2, Shield, Home, DollarSign, FileText, Hammer, Camera,
  Truck, Users, CheckCircle, Clock, ExternalLink
} from 'lucide-react'

interface Vendor {
  id: string
  name: string
  category: string
  description?: string
  phone?: string
  email?: string
  website?: string
  city?: string
  state?: string
  rating?: number
  reviews_count?: number
  verified?: boolean
  featured?: boolean
  services?: string[]
  years_in_business?: number
}

const VENDOR_CATEGORIES = [
  { id: 'all', name: 'All', icon: Building2 },
  { id: 'lender', name: 'Lenders', icon: DollarSign },
  { id: 'title', name: 'Title', icon: FileText },
  { id: 'inspector', name: 'Inspectors', icon: Search },
  { id: 'insurance', name: 'Insurance', icon: Shield },
  { id: 'contractor', name: 'Contractors', icon: Hammer },
  { id: 'photographer', name: 'Photo/Video', icon: Camera },
  { id: 'mover', name: 'Movers', icon: Truck },
]

const SAMPLE_VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Southwest Florida Title',
    category: 'title',
    description: 'Full-service title and escrow since 1995.',
    phone: '(239) 555-0100',
    email: 'closings@swfltitle.com',
    city: 'Fort Myers',
    state: 'FL',
    rating: 4.9,
    reviews_count: 127,
    verified: true,
    featured: true,
    services: ['Title Insurance', 'Escrow', 'Mobile Closings', '1031 Exchange'],
    years_in_business: 29,
  },
  {
    id: '2',
    name: 'Gulf Coast Mortgage',
    category: 'lender',
    description: 'Local lender with competitive rates.',
    phone: '(239) 555-0200',
    city: 'Cape Coral',
    state: 'FL',
    rating: 4.8,
    reviews_count: 89,
    verified: true,
    featured: true,
    services: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    years_in_business: 15,
  },
  {
    id: '3',
    name: 'A+ Home Inspections',
    category: 'inspector',
    description: 'InterNACHI certified, same-day reports.',
    phone: '(239) 555-0300',
    city: 'Fort Myers',
    state: 'FL',
    rating: 5.0,
    reviews_count: 203,
    verified: true,
    services: ['Full Inspection', 'Wind Mitigation', '4-Point', 'Roof Cert'],
  },
  {
    id: '4',
    name: 'Sunshine Insurance Group',
    category: 'insurance',
    description: 'Independent agency, 20+ carriers.',
    phone: '(239) 555-0400',
    city: 'Naples',
    state: 'FL',
    rating: 4.7,
    reviews_count: 156,
    verified: true,
    services: ['Homeowners', 'Flood', 'Wind', 'Umbrella'],
  },
  {
    id: '5',
    name: 'Paradise Home Photography',
    category: 'photographer',
    description: 'HDR, drone, video, and Matterport 3D.',
    phone: '(239) 555-0600',
    city: 'Fort Myers',
    state: 'FL',
    rating: 5.0,
    reviews_count: 312,
    verified: true,
    featured: true,
    services: ['HDR Photos', 'Drone', 'Video Tours', 'Matterport'],
  },
]

export default function VendorDirectoryClient() {
  const [vendors] = useState<Vendor[]>(SAMPLE_VENDORS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [city, setCity] = useState('')

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = !search || v.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || v.category === category
    const matchesCity = !city || v.city?.toLowerCase().includes(city.toLowerCase())
    return matchesSearch && matchesCategory && matchesCity
  })

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="text-green-600" /> Vendor Network
            <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">Active</span>
          </h1>
          <p className="text-gray-600 mt-1">500+ verified service providers</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {VENDOR_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              category === cat.id ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <cat.icon size={16} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured */}
      {category === 'all' && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" /> Featured Partners
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {vendors.filter(v => v.featured).map(vendor => (
              <div key={vendor.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold">{vendor.name}</h3>
                  {vendor.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <CheckCircle size={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{vendor.description}</p>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(vendor.rating || 0)}
                  <span className="text-sm text-gray-600 ml-1">({vendor.reviews_count})</span>
                </div>
                <div className="flex gap-2">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">
                      <Phone size={14} /> Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Vendors */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{filteredVendors.length} Vendors Found</h2>
        
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{vendor.name}</h3>
                  {vendor.verified && <CheckCircle className="text-green-600" size={16} />}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {vendor.city}, {vendor.state}
                  {vendor.years_in_business && ` • ${vendor.years_in_business} years`}
                </p>
                <p className="text-gray-600 text-sm mb-3">{vendor.description}</p>
                {vendor.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(vendor.rating)}
                    <span className="text-sm text-gray-600">({vendor.reviews_count} reviews)</span>
                  </div>
                )}
                {vendor.services && (
                  <div className="flex flex-wrap gap-2">
                    {vendor.services.map(s => (
                      <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 md:w-40">
                {vendor.phone && (
                  <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 justify-center text-sm">
                    <Phone size={16} /> Call
                  </a>
                )}
                {vendor.email && (
                  <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 justify-center text-sm">
                    <Mail size={16} /> Email
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
