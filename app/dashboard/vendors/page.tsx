'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Search, MapPin, Phone, Mail, Globe, Star, Plus,
  Building2, Briefcase, Shield, Home, Hammer, Camera,
  FileText, DollarSign, Truck, Users, ChevronRight, Filter,
  CheckCircle, Clock, ExternalLink
} from 'lucide-react'

interface Vendor {
  id: string
  name: string
  category: string
  subcategory?: string
  description?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  rating?: number
  reviews_count?: number
  verified?: boolean
  featured?: boolean
  services?: string[]
  coverage_areas?: string[]
  years_in_business?: number
  license_number?: string
  insurance_verified?: boolean
}

const VENDOR_CATEGORIES = [
  { id: 'all', name: 'All Vendors', icon: Building2, color: 'bg-gray-100' },
  { id: 'lender', name: 'Mortgage Lenders', icon: DollarSign, color: 'bg-green-100' },
  { id: 'title', name: 'Title Companies', icon: FileText, color: 'bg-blue-100' },
  { id: 'inspector', name: 'Home Inspectors', icon: Search, color: 'bg-amber-100' },
  { id: 'appraiser', name: 'Appraisers', icon: Home, color: 'bg-purple-100' },
  { id: 'insurance', name: 'Insurance Agents', icon: Shield, color: 'bg-red-100' },
  { id: 'contractor', name: 'Contractors', icon: Hammer, color: 'bg-orange-100' },
  { id: 'photographer', name: 'Photographers', icon: Camera, color: 'bg-pink-100' },
  { id: 'mover', name: 'Moving Companies', icon: Truck, color: 'bg-cyan-100' },
  { id: 'attorney', name: 'Real Estate Attorneys', icon: Briefcase, color: 'bg-indigo-100' },
  { id: 'stager', name: 'Home Stagers', icon: Users, color: 'bg-teal-100' },
]

// Sample featured vendors (would come from database)
const FEATURED_VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Southwest Florida Title',
    category: 'title',
    description: 'Full-service title and escrow company serving Lee and Collier counties since 1995.',
    phone: '(239) 555-0100',
    email: 'closings@swfltitle.com',
    website: 'https://swfltitle.com',
    city: 'Fort Myers',
    state: 'FL',
    rating: 4.9,
    reviews_count: 127,
    verified: true,
    featured: true,
    services: ['Title Insurance', 'Escrow Services', 'Mobile Closings', '1031 Exchange'],
    years_in_business: 29,
  },
  {
    id: '2',
    name: 'Gulf Coast Mortgage',
    category: 'lender',
    description: 'Local lender with competitive rates and fast closings. FHA, VA, Conventional, Jumbo.',
    phone: '(239) 555-0200',
    email: 'loans@gulfcoastmtg.com',
    website: 'https://gulfcoastmtg.com',
    city: 'Cape Coral',
    state: 'FL',
    rating: 4.8,
    reviews_count: 89,
    verified: true,
    featured: true,
    services: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo', 'Refinance'],
    years_in_business: 15,
  },
  {
    id: '3',
    name: 'A+ Home Inspections',
    category: 'inspector',
    description: 'InterNACHI certified inspector. Thorough 400+ point inspections with same-day reports.',
    phone: '(239) 555-0300',
    email: 'inspect@aplusfl.com',
    city: 'Fort Myers',
    state: 'FL',
    rating: 5.0,
    reviews_count: 203,
    verified: true,
    featured: true,
    services: ['Full Home Inspection', 'Wind Mitigation', '4-Point', 'Roof Certification', 'Pool/Spa'],
    license_number: 'HI12345',
    insurance_verified: true,
  },
  {
    id: '4',
    name: 'Sunshine Insurance Group',
    category: 'insurance',
    description: 'Independent agency representing 20+ carriers. Home, flood, wind, and umbrella policies.',
    phone: '(239) 555-0400',
    email: 'quotes@sunshineins.com',
    city: 'Naples',
    state: 'FL',
    rating: 4.7,
    reviews_count: 156,
    verified: true,
    services: ['Homeowners', 'Flood', 'Wind', 'Umbrella', 'Condo', 'Landlord'],
  },
  {
    id: '5',
    name: 'Premier Appraisal Services',
    category: 'appraiser',
    description: 'State-certified appraisers with 20+ years experience in SW Florida market.',
    phone: '(239) 555-0500',
    email: 'appraisals@premierappraisal.com',
    city: 'Fort Myers',
    state: 'FL',
    rating: 4.9,
    reviews_count: 78,
    verified: true,
    services: ['Purchase Appraisals', 'Refinance', 'Estate', 'Divorce', 'Pre-Listing'],
    license_number: 'RD5678',
  },
  {
    id: '6',
    name: 'Paradise Home Photography',
    category: 'photographer',
    description: 'Professional real estate photography, drone, video tours, and Matterport 3D.',
    phone: '(239) 555-0600',
    email: 'book@paradisephoto.com',
    website: 'https://paradisephoto.com',
    city: 'Fort Myers',
    state: 'FL',
    rating: 5.0,
    reviews_count: 312,
    verified: true,
    featured: true,
    services: ['HDR Photography', 'Drone/Aerial', 'Video Tours', 'Matterport 3D', 'Floor Plans', 'Twilight'],
  },
]

export default function VendorDirectoryPage() {
  const [vendors, setVendors] = useState<Vendor[]>(FEATURED_VENDORS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [city, setCity] = useState('')
  
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = search === '' || 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || v.category === category
    const matchesCity = city === '' || v.city?.toLowerCase().includes(city.toLowerCase())
    return matchesSearch && matchesCategory && matchesCity
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="text-blue-600" /> Vendor Directory
          </h1>
          <p className="text-gray-600 mt-1">
            Trusted professionals to help with every step of your transaction
          </p>
        </div>
        <Link href="/dashboard/vendors/add">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={18} /> Add Vendor
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {VENDOR_CATEGORIES.map(cat => {
          const count = cat.id === 'all' ? vendors.length : vendors.filter(v => v.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                category === cat.id 
                  ? 'bg-blue-600 text-white' 
                  : `${cat.color} hover:opacity-80`
              }`}
            >
              <cat.icon size={16} />
              {cat.name}
              <span className="text-xs opacity-75">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Featured Section */}
      {category === 'all' && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" /> Featured Partners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.filter(v => v.featured).slice(0, 3).map(vendor => (
              <div key={vendor.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{vendor.name}</h3>
                  {vendor.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <CheckCircle size={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(vendor.rating || 0)}
                  <span className="text-sm text-gray-600 ml-1">({vendor.reviews_count})</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {vendor.services?.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-white px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
                      <Phone size={14} /> Call
                    </a>
                  )}
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 border py-2 rounded-lg text-sm hover:bg-gray-50">
                      <Globe size={14} /> Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendor List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">
          {category === 'all' ? 'All Vendors' : VENDOR_CATEGORIES.find(c => c.id === category)?.name}
          <span className="text-gray-500 font-normal ml-2">({filteredVendors.length})</span>
        </h2>
        
        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            <Building2 className="mx-auto mb-3" size={48} />
            <p>No vendors found matching your criteria</p>
            <button onClick={() => { setSearch(''); setCategory('all'); setCity(''); }} className="text-blue-600 hover:underline mt-2">
              Clear filters
            </button>
          </div>
        ) : (
          filteredVendors.map(vendor => {
            const CategoryIcon = VENDOR_CATEGORIES.find(c => c.id === vendor.category)?.icon || Building2
            return (
              <div key={vendor.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${VENDOR_CATEGORIES.find(c => c.id === vendor.category)?.color}`}>
                        <CategoryIcon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{vendor.name}</h3>
                          {vendor.verified && (
                            <CheckCircle className="text-green-600" size={16} />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {VENDOR_CATEGORIES.find(c => c.id === vendor.category)?.name}
                          {vendor.city && ` • ${vendor.city}, ${vendor.state}`}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{vendor.description}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      {vendor.rating && (
                        <div className="flex items-center gap-1">
                          {renderStars(vendor.rating)}
                          <span className="text-sm text-gray-600 ml-1">{vendor.rating} ({vendor.reviews_count} reviews)</span>
                        </div>
                      )}
                      {vendor.years_in_business && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} /> {vendor.years_in_business} years
                        </span>
                      )}
                    </div>
                    
                    {vendor.services && (
                      <div className="flex flex-wrap gap-2">
                        {vendor.services.map(s => (
                          <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 md:w-48">
                    {vendor.phone && (
                      <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 justify-center">
                        <Phone size={16} /> {vendor.phone}
                      </a>
                    )}
                    {vendor.email && (
                      <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 justify-center">
                        <Mail size={16} /> Email
                      </a>
                    )}
                    {vendor.website && (
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 justify-center">
                        <ExternalLink size={16} /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Are You a Service Provider?</h3>
        <p className="text-blue-100 mb-4">Join our vendor directory and connect with local realtors and homebuyers.</p>
        <Link href="/dashboard/vendors/add">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50">
            List Your Business Free
          </button>
        </Link>
      </div>
    </div>
  )
}
