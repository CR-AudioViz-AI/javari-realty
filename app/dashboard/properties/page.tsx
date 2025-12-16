'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home, Plus, Search, Filter, Grid, List, MapPin, Bed, Bath,
  Square, DollarSign, Eye, Edit2, Trash2, MoreVertical, Heart,
  TrendingUp, Calendar, Clock, Share2, Image as ImageIcon
} from 'lucide-react'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: 'active' | 'pending' | 'sold' | 'off-market'
  type: string
  yearBuilt: number
  listDate: string
  daysOnMarket: number
  description?: string
  features: string[]
  images: string[]
  mls?: string
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: '1',
    address: '2850 Winkler Ave',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33916',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    status: 'active',
    type: 'Single Family',
    yearBuilt: 2018,
    listDate: '2024-12-01',
    daysOnMarket: 14,
    features: ['Pool', 'Updated Kitchen', '2-Car Garage', 'Hurricane Shutters'],
    images: [],
    mls: 'MLS123456'
  },
  {
    id: '2',
    address: '1420 SE 47th St',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33904',
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    status: 'active',
    type: 'Single Family',
    yearBuilt: 2015,
    listDate: '2024-11-15',
    daysOnMarket: 30,
    features: ['Gulf Access', 'Boat Dock', 'Open Floor Plan'],
    images: [],
    mls: 'MLS123457'
  },
  {
    id: '3',
    address: '3500 Oasis Blvd',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33914',
    price: 459000,
    beds: 4,
    baths: 2.5,
    sqft: 2650,
    status: 'pending',
    type: 'Single Family',
    yearBuilt: 2020,
    listDate: '2024-12-05',
    daysOnMarket: 10,
    features: ['Pool', 'Smart Home', 'Impact Windows', 'Solar Panels'],
    images: [],
    mls: 'MLS123458'
  },
  {
    id: '4',
    address: '8901 Cypress Lake Dr',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33919',
    price: 675000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    status: 'active',
    type: 'Single Family',
    yearBuilt: 2021,
    listDate: '2024-12-10',
    daysOnMarket: 5,
    features: ['Pool', 'Lake View', '3-Car Garage', 'Gourmet Kitchen'],
    images: [],
    mls: 'MLS123459'
  },
  {
    id: '5',
    address: '15620 Laguna Hills Dr',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33908',
    price: 525000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: 'sold',
    type: 'Single Family',
    yearBuilt: 2019,
    listDate: '2024-10-01',
    daysOnMarket: 45,
    features: ['Pool', 'Screened Lanai', 'Tile Throughout'],
    images: [],
    mls: 'MLS123460'
  }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  const filteredProperties = properties
    .filter(p => {
      const matchesSearch = 
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mls?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high': return b.price - a.price
        case 'price-low': return a.price - b.price
        case 'newest': return new Date(b.listDate).getTime() - new Date(a.listDate).getTime()
        case 'oldest': return new Date(a.listDate).getTime() - new Date(b.listDate).getTime()
        default: return 0
      }
    })

  const getStatusBadge = (status: Property['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-amber-100 text-amber-800',
      sold: 'bg-blue-100 text-blue-800',
      'off-market': 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    )
  }

  const totalValue = properties.reduce((sum, p) => sum + p.price, 0)
  const activeCount = properties.filter(p => p.status === 'active').length
  const pendingCount = properties.filter(p => p.status === 'pending').length
  const soldCount = properties.filter(p => p.status === 'sold').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Home className="text-blue-600" /> Properties
          </h1>
          <p className="text-gray-600 mt-1">Manage your listings and portfolio</p>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> Add Listing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Listings</p>
              <p className="text-2xl font-bold">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Portfolio Value</p>
              <p className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by address, city, or MLS#..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="off-market">Off Market</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={48} />
                </div>
                <div className="absolute top-3 left-3">
                  {getStatusBadge(property.status)}
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                    <Heart size={16} />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                    <Share2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {property.daysOnMarket} days on market
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-2xl font-bold text-green-600">${property.price.toLocaleString()}</p>
                <p className="font-semibold mt-1">{property.address}</p>
                <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Bed size={16} /> {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={16} /> {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square size={16} /> {property.sqft.toLocaleString()}
                  </span>
                </div>

                {property.mls && (
                  <p className="text-xs text-gray-400 mt-2">{property.mls}</p>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center gap-1">
                    <Eye size={16} /> View
                  </button>
                  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                    <Edit2 size={16} />
                  </button>
                  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Property</th>
                <th className="text-left py-3 px-4 font-medium">Price</th>
                <th className="text-left py-3 px-4 font-medium">Details</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">DOM</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProperties.map(property => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{property.address}</p>
                    <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {property.beds}bd / {property.baths}ba / {property.sqft.toLocaleString()} sqft
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(property.status)}</td>
                  <td className="py-3 px-4 text-sm">{property.daysOnMarket} days</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Eye size={16} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 size={16} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredProperties.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Home className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-700">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
