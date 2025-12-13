'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Save, Loader2, DollarSign, Home, Factory, Store } from 'lucide-react'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    address: '',
    city: '',
    state: 'FL',
    zip_code: '',
    county: '',
    
    // Classification
    category: 'residential',      // residential, commercial, industrial, land, mixed_use
    property_type: 'single_family', // single_family, condo, townhouse, commercial, industrial, etc.
    listing_type: 'for_sale',     // for_sale, for_rent, for_lease
    
    // Pricing
    price: '',
    rent_amount: '',
    rent_frequency: 'monthly',
    security_deposit: '',
    lease_term_months: '',
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    lot_size: '',
    year_built: '',
    
    // Rental Specific
    available_date: '',
    pets_allowed: false,
    furnished: false,
    
    // Status & Description
    status: 'active',
    description: '',
    mls_id: '',
    
    // Features
    features: [] as string[]
  })

  const propertyCategories = [
    { value: 'residential', label: 'Residential', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Store },
    { value: 'industrial', label: 'Industrial', icon: Factory },
    { value: 'land', label: 'Land', icon: Building2 },
    { value: 'mixed_use', label: 'Mixed Use', icon: Building2 },
  ]

  const propertyTypes: Record<string, { value: string; label: string }[]> = {
    residential: [
      { value: 'single_family', label: 'Single Family Home' },
      { value: 'condo', label: 'Condo/Apartment' },
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'villa', label: 'Villa' },
      { value: 'multi_family', label: 'Multi-Family' },
      { value: 'mobile_home', label: 'Mobile Home' },
    ],
    commercial: [
      { value: 'office', label: 'Office Space' },
      { value: 'retail', label: 'Retail Space' },
      { value: 'restaurant', label: 'Restaurant' },
      { value: 'commercial', label: 'Commercial Building' },
      { value: 'mixed_use', label: 'Mixed Use' },
    ],
    industrial: [
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'industrial', label: 'Industrial Facility' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'distribution', label: 'Distribution Center' },
      { value: 'flex_space', label: 'Flex Space' },
    ],
    land: [
      { value: 'land', label: 'Vacant Land' },
      { value: 'farm_ranch', label: 'Farm/Ranch' },
      { value: 'development', label: 'Development Land' },
    ],
    mixed_use: [
      { value: 'mixed_use', label: 'Mixed Use' },
    ],
  }

  const listingTypes = [
    { value: 'for_sale', label: 'For Sale', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'for_rent', label: 'For Rent', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'for_lease', label: 'For Lease', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const propertyData: Record<string, unknown> = {
        agent_id: user.id,
        title: formData.title || formData.address,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        county: formData.county || null,
        category: formData.category,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        status: formData.status,
        description: formData.description || null,
        mls_id: formData.mls_id || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        sqft: formData.sqft ? parseInt(formData.sqft) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        features: formData.features.length > 0 ? formData.features : null,
      }

      // Add price for sale listings
      if (formData.listing_type === 'for_sale') {
        propertyData.price = formData.price ? parseFloat(formData.price) : 0
      } else {
        // Rental/Lease fields
        propertyData.rent_amount = formData.rent_amount ? parseFloat(formData.rent_amount) : null
        propertyData.rent_frequency = formData.rent_frequency
        propertyData.security_deposit = formData.security_deposit ? parseFloat(formData.security_deposit) : null
        propertyData.lease_term_months = formData.lease_term_months ? parseInt(formData.lease_term_months) : null
        propertyData.available_date = formData.available_date || null
        propertyData.pets_allowed = formData.pets_allowed
        propertyData.furnished = formData.furnished
        propertyData.price = formData.rent_amount ? parseFloat(formData.rent_amount) : 0 // Also set price for display
      }

      const { error: insertError } = await supabase
        .from('properties')
        .insert(propertyData)

      if (insertError) throw insertError

      router.push('/dashboard/properties')
    } catch (err) {
      console.error('Error adding property:', err)
      setError(err instanceof Error ? err.message : 'Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  const isRental = formData.listing_type === 'for_rent' || formData.listing_type === 'for_lease'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-500">Residential, Commercial, or Industrial</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing Type Selection */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Listing Type</h2>
          <div className="grid grid-cols-3 gap-4">
            {listingTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, listing_type: type.value })}
                className={`p-4 rounded-xl border-2 text-center font-medium transition ${
                  formData.listing_type === type.value
                    ? type.color + ' border-current'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Category */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {propertyCategories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  category: cat.value,
                  property_type: propertyTypes[cat.value]?.[0]?.value || 'single_family'
                })}
                className={`p-4 rounded-xl border-2 text-center transition ${
                  formData.category === cat.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <cat.icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(propertyTypes[formData.category] || propertyTypes.residential).map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, property_type: type.value })}
                className={`p-3 rounded-xl border text-sm font-medium transition ${
                  formData.property_type === type.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Gulf Access Canal Home with Pool"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Naples"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="34102"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
              <select
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select County</option>
                <option value="Collier">Collier</option>
                <option value="Lee">Lee</option>
                <option value="Charlotte">Charlotte</option>
                <option value="Hendry">Hendry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MLS ID</label>
              <input
                type="text"
                value={formData.mls_id}
                onChange={(e) => setFormData({ ...formData, mls_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="224012345"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-gray-900">
              {isRental ? 'Rental Pricing' : 'Sale Price'}
            </h2>
          </div>
          
          {isRental ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.rent_amount}
                  onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="2500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={formData.rent_frequency}
                  onChange={(e) => setFormData({ ...formData, rent_frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                <input
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="2500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Term (months)</label>
                <input
                  type="number"
                  value={formData.lease_term_months}
                  onChange={(e) => setFormData({ ...formData, lease_term_months: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Date</label>
                <input
                  type="date"
                  value={formData.available_date}
                  onChange={(e) => setFormData({ ...formData, available_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pets_allowed}
                    onChange={(e) => setFormData({ ...formData, pets_allowed: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Pets Allowed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Furnished</span>
                </label>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="450000"
              />
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.category === 'residential' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
              <input
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Size (acres)</label>
              <input
                type="number"
                step="0.01"
                value={formData.lot_size}
                onChange={(e) => setFormData({ ...formData, lot_size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
              <input
                type="number"
                value={formData.year_built}
                onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Description</h2>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the property..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/properties"
            className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
